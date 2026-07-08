export const DEFAULT_LOCALE = "en";

export const LOCALES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", dir: "ltr" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export type LocaleDirection = (typeof LOCALES)[number]["dir"];

export const TARGET_LOCALES = LOCALES.filter(
  (locale) => locale.code !== DEFAULT_LOCALE,
);

export const LOCALE_CODES = LOCALES.map((locale) => locale.code);

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && LOCALE_CODES.includes(value as Locale));
}

export function getLocaleMeta(locale: string | undefined) {
  return LOCALES.find((item) => item.code === locale) ?? LOCALES[0];
}

export function stripLocaleFromPath(pathname = "/") {
  const [pathWithoutHash, hash = ""] = pathname.split("#");
  const [pathWithoutQuery, query = ""] = pathWithoutHash.split("?");
  const segments = pathWithoutQuery.split("/").filter(Boolean);

  if (segments.length && isLocale(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
    segments.shift();
  }

  const barePath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  const queryPart = query ? `?${query}` : "";
  const hashPart = hash ? `#${hash}` : "";

  return `${barePath}${queryPart}${hashPart}`;
}

export function localizePath(pathname = "/", locale: Locale = DEFAULT_LOCALE) {
  if (!pathname || /^(https?:|mailto:|tel:|#)/.test(pathname)) {
    return pathname;
  }

  const basePath = stripLocaleFromPath(pathname);

  if (locale === DEFAULT_LOCALE) {
    return basePath;
  }

  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}

export function getLocaleFromPath(pathname = "/"): Locale {
  const firstSegment = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}
