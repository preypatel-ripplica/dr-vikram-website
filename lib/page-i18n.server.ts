import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n-config";
import { DEFAULT_LOCALE } from "@/lib/i18n-config";
import { decodeTranslationEntities, normalizeTranslationText } from "@/lib/i18n";
import memory from "@/.cache/translation-memory.json";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type TranslationEntry = {
  en?: string;
} & Partial<Record<Locale, string>>;

const translationMemory = memory as Record<string, TranslationEntry>;
const translationsByEnglish = new Map(
  Object.values(translationMemory).map((entry) => [
    normalizeTranslationText(entry.en ?? ""),
    entry,
  ]),
);

let runtimeTranslationKeys: string[] | undefined;
const runtimeTranslationKeysBySource = new Map<string, string[]>();

function getRuntimeTranslationKeys(sourcePaths?: string[]) {
  if (!sourcePaths?.length) {
    if (runtimeTranslationKeys) {
      return runtimeTranslationKeys;
    }

    const roots = ["components", "pages"];
    const keys = new Set<string>();
    const tCallPattern = /\bt\(\s*(["'`])((?:\\.|(?!\1).)*)\1/g;

    for (const root of roots) {
      collectRuntimeTranslationKeys(
        path.join(/* turbopackIgnore: true */ process.cwd(), root),
        keys,
        tCallPattern,
      );
    }

    runtimeTranslationKeys = Array.from(keys).sort();
    return runtimeTranslationKeys;
  }

  const cacheKey = sourcePaths.slice().sort().join("|");
  const cachedKeys = runtimeTranslationKeysBySource.get(cacheKey);
  if (cachedKeys) {
    return cachedKeys;
  }

  const keys = new Set<string>();
  const tCallPattern = /\bt\(\s*(["'`])((?:\\.|(?!\1).)*)\1/g;

  for (const sourcePath of sourcePaths) {
    collectRuntimeTranslationKeys(
      path.join(/* turbopackIgnore: true */ process.cwd(), sourcePath),
      keys,
      tCallPattern,
    );
  }

  const sourceKeys = Array.from(keys).sort();
  runtimeTranslationKeysBySource.set(cacheKey, sourceKeys);
  return sourceKeys;
}

function collectRuntimeTranslationKeys(
  directory: string,
  keys: Set<string>,
  pattern: RegExp,
) {
  if (!fs.existsSync(directory)) {
    return;
  }

  const stat = fs.statSync(directory);

  if (stat.isFile()) {
    collectRuntimeTranslationKeysFromFile(directory, keys, pattern);
    return;
  }

  if (!stat.isDirectory()) {
    return;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectRuntimeTranslationKeys(entryPath, keys, pattern);
      continue;
    }

    if (!/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      continue;
    }

    collectRuntimeTranslationKeysFromFile(entryPath, keys, pattern);
  }
}

function collectRuntimeTranslationKeysFromFile(
  filePath: string,
  keys: Set<string>,
  pattern: RegExp,
) {
  if (!/\.(tsx|ts|jsx|js)$/.test(filePath)) {
    return;
  }

  const source = fs.readFileSync(filePath, "utf8");
  pattern.lastIndex = 0;

  for (const match of source.matchAll(pattern)) {
    const value = parseStringLiteral(match[1], match[2]);
    const key = normalizeTranslationText(value);

    if (key) {
      keys.add(key);
    }
  }
}

function parseStringLiteral(quote: string, value: string) {
  if (quote === "`") {
    return value.replace(/\\`/g, "`").replace(/\\n/g, "\n");
  }

  try {
    return JSON.parse(`${quote}${value}${quote}`) as string;
  } catch {
    return value
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n");
  }
}

export function getClientTranslations(locale: Locale, sourcePaths?: string[]) {
  if (locale === DEFAULT_LOCALE) {
    return {};
  }

  return Object.fromEntries(
    getRuntimeTranslationKeys(sourcePaths)
      .map((key) => {
        const translated = translationsByEnglish.get(key)?.[locale];
        return translated ? [key, decodeTranslationEntities(translated)] : undefined;
      })
      .filter((entry): entry is [string, string] => Boolean(entry)),
  );
}

const SKIPPED_KEYS = new Set([
  "slug",
  "id",
  "href",
  "url",
  "videoUrl",
  "canonical",
  "canonicalPath",
  "ogImage",
  "src",
  "image",
  "icon",
  "cardImage",
  "bannerImage",
  "authorImage",
  "videoThumbnail",
  "publishedAt",
  "publishedLabel",
  "access_key",
  "from_name",
]);

const SKIPPED_KEY_PARTS = [
  "path",
  "url",
  "href",
  "src",
  "image",
  "thumbnail",
  "icon",
  "class",
  "type",
];

function shouldSkipKey(key: string) {
  if (SKIPPED_KEYS.has(key)) {
    return true;
  }

  const normalizedKey = key.toLowerCase();
  return SKIPPED_KEY_PARTS.some((part) => normalizedKey.includes(part));
}

function translateString(value: string, locale: Locale) {
  if (locale === DEFAULT_LOCALE) {
    return value;
  }

  const normalized = normalizeTranslationText(value);
  if (!normalized) {
    return value;
  }

  const translated = translationsByEnglish.get(normalized)?.[locale];

  return translated ? decodeTranslationEntities(translated) : value;
}

export function translateObjectForLocale<T extends JsonValue>(value: T, locale: Locale): T {
  if (locale === DEFAULT_LOCALE) {
    return value;
  }

  if (typeof value === "string") {
    return translateString(value, locale) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateObjectForLocale(item, locale)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      shouldSkipKey(key) ? child : translateObjectForLocale(child, locale),
    ]),
  ) as T;
}

export function withLocaleProps<T extends Record<string, unknown>>(
  props: T,
  locale: Locale,
  options: { runtimeSources?: string[] } = {},
) {
  const translatedProps = translateObjectForLocale(props as unknown as JsonValue, locale) as T;
  const localeProps = {
    ...translatedProps,
    locale,
  };

  return locale === DEFAULT_LOCALE
    ? localeProps
    : {
        ...localeProps,
        clientTranslations: getClientTranslations(locale, options.runtimeSources),
      };
}
