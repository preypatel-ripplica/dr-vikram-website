import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  type ClientTranslations,
  type Locale,
  getLocaleMeta,
  localizePath,
  translateText,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (text: string) => string;
  localizeHref: (href: string) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  t: (text) => text,
  localizeHref: (href) => href,
});

export function I18nProvider({
  children,
  clientTranslations = {},
  locale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  clientTranslations?: ClientTranslations;
  locale?: Locale;
}) {
  const meta = getLocaleMeta(locale);
  const t = useCallback(
    (text: string) => translateText(locale, text, clientTranslations),
    [clientTranslations, locale],
  );
  const localizeHref = useCallback((href: string) => localizePath(href, locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      dir: meta.dir,
      t,
      localizeHref,
    }),
    [locale, localizeHref, meta.dir, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
