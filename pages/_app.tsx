import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ClientDomTranslator } from "@/components/shared/ClientDomTranslator";
import { I18nProvider } from "@/lib/i18n-context";
import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  getLocaleFromPath,
  getLocaleMeta,
  isLocale,
  localizePath,
  stripLocaleFromPath,
} from "@/lib/i18n-config";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getPageLocale(pageProps.locale, router.asPath);
  const localeMeta = getLocaleMeta(locale);
  const canonicalPath = pageProps.canonicalPath || stripLocaleFromPath(router.asPath || "/");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.drvikramurology.com").replace(/\/$/, "");
  const localizedShellKey = `${locale}:${canonicalPath}`;

  useEffect(() => {
    document.documentElement.lang = localeMeta.code;
    document.documentElement.dir = localeMeta.dir;
  }, [localeMeta.code, localeMeta.dir]);

  return (
    <I18nProvider locale={locale}>
      <Head>
        <link href="/assets/figma/header-logo-mark.svg" rel="icon" type="image/svg+xml" />
        <link href="/assets/figma/header-logo-mark.svg" rel="shortcut icon" />
        <link
          href={absoluteUrl(siteUrl, localizePath(canonicalPath, locale))}
          rel="canonical"
        />
        {LOCALES.map((item) => (
          <link
            href={absoluteUrl(siteUrl, localizePath(canonicalPath, item.code))}
            hrefLang={item.code}
            key={item.code}
            rel="alternate"
          />
        ))}
        <link href={absoluteUrl(siteUrl, canonicalPath)} hrefLang="x-default" rel="alternate" />
      </Head>
      <div key={localizedShellKey}>
        <ClientDomTranslator locale={locale} />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </I18nProvider>
  );
}

function getPageLocale(pageLocale: unknown, asPath: string): Locale {
  if (typeof pageLocale === "string" && isLocale(pageLocale)) {
    return pageLocale;
  }

  return getLocaleFromPath(asPath || "/") || DEFAULT_LOCALE;
}

function absoluteUrl(siteUrl: string, route: string) {
  const cleanRoute = route.split("#")[0]?.split("?")[0] || "/";
  return `${siteUrl}${cleanRoute === "/" ? "" : cleanRoute}`;
}
