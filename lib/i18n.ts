import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  getLocaleMeta,
  localizePath,
} from "@/lib/i18n-config";
import memory from "@/.cache/translation-memory.json";

type TranslationEntry = {
  en?: string;
} & Partial<Record<Locale, string>>;

type TranslationMemory = Record<string, TranslationEntry>;

const translationMemory = memory as TranslationMemory;
const translationsByEnglish = new Map(
  Object.values(translationMemory).map((entry) => [
    normalizeTranslationText(entry.en ?? ""),
    entry,
  ]),
);

export function normalizeTranslationText(value: unknown) {
  return decodeTranslationEntities(value)
    .replace(/\s+/g, " ")
    .trim();
}

export function decodeTranslationEntities(value: unknown) {
  return String(value)
    .replace(/&apos;|&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#x22;|&#34;/g, '"')
    .replace(/&amp;|&#x26;|&#38;/g, "&")
    .replace(/&nbsp;|&#xA0;|&#160;/g, " ");
}

export function getTranslationKey(value: unknown) {
  return normalizeTranslationText(value);
}

export function translateText(locale: Locale, value: string) {
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

export { DEFAULT_LOCALE, LOCALES, getLocaleMeta, localizePath };
export type { Locale };
