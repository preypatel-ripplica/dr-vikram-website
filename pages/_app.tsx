import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
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
import { identityGraphItems, SITE_NAME, SITE_URL } from "@/lib/seo";
import "@/styles/globals.css";

const GA_MEASUREMENT_ID = "G-HFPTFPQHD0";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getPageLocale(pageProps.locale, router.asPath);
  const localeMeta = getLocaleMeta(locale);
  const canonicalPath = pageProps.canonicalPath || stripLocaleFromPath(router.asPath || "/");
  const siteUrl = SITE_URL;
  const localizedShellKey = `${locale}:${canonicalPath}`;
  const canonicalUrl = absoluteUrl(siteUrl, localizePath(canonicalPath, locale));
  const isNotFoundRoute = canonicalPath === "/404" || router.pathname === "/404";
  const structuredData = pageProps.disableIdentityGraph
    ? null
    : { "@context": "https://schema.org", "@graph": identityGraphItems() };

  useEffect(() => {
    document.documentElement.lang = localeMeta.code;
    document.documentElement.dir = localeMeta.dir;
  }, [localeMeta.code, localeMeta.dir]);

  useEffect(() => {
    function handleRouteChange(url: string) {
      window.gtag?.("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <I18nProvider clientTranslations={pageProps.clientTranslations} locale={locale}>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Head>
        <link href="/favicon.ico" rel="icon" sizes="any" />
        <link href="/favicon.png" rel="icon" type="image/png" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <meta content={SITE_NAME} key="og:site_name" property="og:site_name" />
        <meta content={canonicalUrl} key="og:url" property="og:url" />
        <meta content="summary_large_image" key="twitter:card" name="twitter:card" />
        <link href={canonicalUrl} key="canonical" rel="canonical" />
        {!isNotFoundRoute && LOCALES.map((item) => (
          <link
            href={absoluteUrl(siteUrl, localizePath(canonicalPath, item.code))}
            hrefLang={item.code}
            key={item.code}
            rel="alternate"
          />
        ))}
        {!isNotFoundRoute && <link href={absoluteUrl(siteUrl, canonicalPath)} hrefLang="x-default" rel="alternate" />}
        {structuredData && (
          <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            type="application/ld+json"
          />
        )}
      </Head>
      <div key={localizedShellKey}>
        <ClientDomTranslator clientTranslations={pageProps.clientTranslations} locale={locale} />
        <Header treatments={pageProps.navTreatments ?? []} />
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
  if (cleanRoute === "/") return `${siteUrl}/`;
  return `${siteUrl}${cleanRoute.endsWith("/") ? cleanRoute : `${cleanRoute}/`}`;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
  }
}
