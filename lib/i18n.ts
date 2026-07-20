import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  getLocaleMeta,
  localizePath,
} from "@/lib/i18n-config";

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

export type ClientTranslations = Record<string, string>;

export function translateText(
  locale: Locale,
  value: string,
  clientTranslations: ClientTranslations = {},
) {
  if (locale === DEFAULT_LOCALE) {
    return value;
  }

  const normalized = normalizeTranslationText(value);
  if (!normalized) {
    return value;
  }

  const translated = clientTranslations[normalized];

  return translated ? decodeTranslationEntities(translated) : value;
}

export { DEFAULT_LOCALE, LOCALES, getLocaleMeta, localizePath };
export type { Locale };
