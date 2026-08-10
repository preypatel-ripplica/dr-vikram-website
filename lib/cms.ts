import fs from "node:fs";
import path from "node:path";

// -----------------------------------------------------------------------------
// Build-time CMS client — the CMS is the single source of truth for treatments
// and blogs. There is no local JSON fallback: if the CMS is unreachable or
// misconfigured, the build fails loudly instead of silently serving stale or
// empty content. Runs only inside getStaticProps/getStaticPaths/getInitialProps
// (Node, build time) — never import this from a component that also renders
// on the client.
// -----------------------------------------------------------------------------

const CMS_API_URL = process.env.CMS_API_URL;
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;
const CMS_RETRY_ATTEMPTS = Number(process.env.CMS_RETRY_ATTEMPTS || 5);
const CMS_RETRY_DELAY_MS = Number(process.env.CMS_RETRY_DELAY_MS || 700);

function requireCmsConfig() {
  if (!CMS_API_URL || !CMS_API_TOKEN) {
    throw new Error(
      "CMS_API_URL and CMS_API_TOKEN must be set in .env.local — this site has no local JSON fallback for treatments or blogs.",
    );
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelay(attempt: number) {
  return CMS_RETRY_DELAY_MS * attempt;
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function fetchWithRetry(url: string, init: RequestInit, label: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= CMS_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          ...(init.headers || {}),
          "ngrok-skip-browser-warning": "true",
          Connection: "close",
        },
      });

      if (res.ok || !isRetryableStatus(res.status) || attempt === CMS_RETRY_ATTEMPTS) {
        return res;
      }

      lastError = new Error(`${label} failed: ${res.status} ${res.statusText}`);
    } catch (error) {
      lastError = error;

      if (attempt === CMS_RETRY_ATTEMPTS) {
        throw new Error(`${label} failed after ${attempt} attempts: ${errorMessage(error)}`, {
          cause: error,
        });
      }
    }

    await wait(retryDelay(attempt));
  }

  throw new Error(`${label} failed: ${errorMessage(lastError)}`);
}

async function cmsPost<T = unknown>(endpoint: string, body: object): Promise<T> {
  requireCmsConfig();

  const res = await fetchWithRetry(`${CMS_API_URL}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CMS_API_TOKEN}`,
    },
    body: JSON.stringify(body),
  }, `CMS request to "${endpoint}"`);

  if (!res.ok) {
    throw new Error(`CMS request to "${endpoint}" failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

type CmsEntriesResponse = {
  entries?: unknown[];
  data?: unknown[];
  items?: unknown[];
};

const collectionCache = new Map<string, Promise<unknown[]>>();

/** Fetch every entry in a collection. Cached per build so pages sharing a collection don't refetch. */
export async function fetchCollection(slug: string): Promise<unknown[]> {
  if (collectionCache.has(slug)) return collectionCache.get(slug)!;

  const request = (async () => {
    const data = await cmsPost<unknown[] | CmsEntriesResponse>("content.entries.list", {
      collection_slug: slug,
      page_size: 100,
    });

    return Array.isArray(data) ? data : data?.entries ?? data?.data ?? data?.items ?? [];
  })();

  collectionCache.set(slug, request);

  try {
    return await request;
  } catch (error) {
    collectionCache.delete(slug);
    throw error;
  }
}

/** Unwrap a CMS list item — entries come back as `{ entry_id, collection_id, entry: {...} }`. */
export function entryData<T = Record<string, unknown>>(item: unknown): T {
  return ((item as { entry?: unknown })?.entry ?? item) as T;
}

async function downloadTo(url: string, absPath: string): Promise<void> {
  const res = await fetchWithRetry(
    url,
    { headers: { "ngrok-skip-browser-warning": "true" } },
    `CMS media download from ${url}`,
  );

  if (!res.ok) {
    throw new Error(`Failed to download CMS media from ${url}: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, buffer);
}

export type CmsMedia = { media_id?: string; alt_text?: string; name?: string } | string | null | undefined;

const mediaCache = new Map<string, Promise<string>>();

function findLocalMediaPath(mediaId: string): string {
  const mediaDir = path.join(process.cwd(), "public", "cms-images");
  if (!fs.existsSync(mediaDir)) return "";

  const localFile = fs
    .readdirSync(mediaDir)
    .find((filename) => filename === mediaId || filename.startsWith(`${mediaId}.`));

  return localFile ? `/cms-images/${localFile}` : "";
}

/**
 * Resolve a CMS image field to a local `/cms-images/...` path, downloading it
 * at build time if it hasn't been fetched yet. Throws if the field is missing
 * or the media can't be downloaded — a broken image is a build-time error,
 * not a silently blank `<img>` in production.
 */
export async function resolveImage(field: CmsMedia): Promise<string> {
  if (!field) {
    throw new Error("Missing required CMS image field");
  }

  if (typeof field === "string") {
    return field;
  }

  if (!field.media_id) {
    throw new Error(`CMS image field is missing media_id (name: ${field.name ?? "unknown"})`);
  }

  if (mediaCache.has(field.media_id)) {
    return mediaCache.get(field.media_id)!;
  }

  const existingLocalPath = findLocalMediaPath(field.media_id);
  if (existingLocalPath) {
    const request = Promise.resolve(existingLocalPath);
    mediaCache.set(field.media_id, request);
    return request;
  }

  const request = (async () => {
    const media = await cmsPost<{
      filename?: string;
      name?: string;
      download_url?: string;
      preview_url?: string;
      url?: string;
    }>("content.media.get", { media_id: field.media_id });

    const ext = path.extname(media?.filename || media?.name || field.name || "") || ".jpg";
    const localPath = `/cms-images/${field.media_id}${ext}`;
    const absPath = path.join(process.cwd(), "public", "cms-images", `${field.media_id}${ext}`);

    if (!fs.existsSync(absPath)) {
      const signedUrl = media?.download_url ?? media?.preview_url ?? media?.url;
      if (!signedUrl) {
        throw new Error(`CMS media ${field.media_id} has no downloadable URL`);
      }
      await downloadTo(signedUrl, absPath);
    }

    return localPath;
  })();

  mediaCache.set(field.media_id, request);

  try {
    return await request;
  } catch (error) {
    mediaCache.delete(field.media_id);
    throw error;
  }
}

export function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

export type CmsRecord = Record<string, unknown>;

export function asRecord(value: unknown): CmsRecord {
  return value && typeof value === "object" ? (value as CmsRecord) : {};
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function asMedia(value: unknown): CmsMedia {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return value as CmsMedia;
  return undefined;
}
