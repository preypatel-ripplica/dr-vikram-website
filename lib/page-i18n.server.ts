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

export function withLocaleProps<T extends Record<string, unknown>>(props: T, locale: Locale) {
  const translatedProps = translateObjectForLocale(props as unknown as JsonValue, locale) as T;

  return {
    ...translatedProps,
    locale,
  };
}
