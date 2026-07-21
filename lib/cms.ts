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

function requireCmsConfig() {
  if (!CMS_API_URL || !CMS_API_TOKEN) {
    throw new Error(
      "CMS_API_URL and CMS_API_TOKEN must be set in .env.local — this site has no local JSON fallback for treatments or blogs.",
    );
  }
}

async function cmsPost<T = unknown>(endpoint: string, body: object): Promise<T> {
  requireCmsConfig();

  const res = await fetch(`${CMS_API_URL}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CMS_API_TOKEN}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(body),
  });

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

const collectionCache = new Map<string, unknown[]>();

/** Fetch every entry in a collection. Cached per build so pages sharing a collection don't refetch. */
export async function fetchCollection(slug: string): Promise<unknown[]> {
  if (collectionCache.has(slug)) return collectionCache.get(slug)!;

  const data = await cmsPost<unknown[] | CmsEntriesResponse>("content.entries.list", {
    collection_slug: slug,
    page_size: 100,
  });

  const entries = Array.isArray(data) ? data : data?.entries ?? data?.data ?? data?.items ?? [];
  collectionCache.set(slug, entries);
  return entries;
}

/** Unwrap a CMS list item — entries come back as `{ entry_id, collection_id, entry: {...} }`. */
export function entryData<T = Record<string, unknown>>(item: unknown): T {
  return ((item as { entry?: unknown })?.entry ?? item) as T;
}

async function downloadTo(url: string, absPath: string): Promise<void> {
  const res = await fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } });
  if (!res.ok) {
    throw new Error(`Failed to download CMS media from ${url}: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, buffer);
}

export type CmsMedia = { media_id?: string; alt_text?: string; name?: string } | string | null | undefined;

const mediaCache = new Map<string, string>();

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

  const media = await cmsPost<{ filename?: string; name?: string; download_url?: string; preview_url?: string; url?: string }>(
    "content.media.get",
    { media_id: field.media_id },
  );

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

  mediaCache.set(field.media_id, localPath);
  return localPath;
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
