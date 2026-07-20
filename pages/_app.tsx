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
import { CLINIC_NAME, DOCTOR_NAME, LOGO_IMAGE, SITE_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getPageLocale(pageProps.locale, router.asPath);
  const localeMeta = getLocaleMeta(locale);
  const canonicalPath = pageProps.canonicalPath || stripLocaleFromPath(router.asPath || "/");
  const siteUrl = SITE_URL;
  const localizedShellKey = `${locale}:${canonicalPath}`;
  const canonicalUrl = absoluteUrl(siteUrl, localizePath(canonicalPath, locale));
  const isNotFoundRoute = canonicalPath === "/404" || router.pathname === "/404";
  const logoUrl = LOGO_IMAGE;
  const siteImageUrl = SITE_IMAGE;
  const structuredData = getStructuredData(siteUrl, logoUrl, siteImageUrl);

  useEffect(() => {
    document.documentElement.lang = localeMeta.code;
    document.documentElement.dir = localeMeta.dir;
  }, [localeMeta.code, localeMeta.dir]);

  return (
    <I18nProvider clientTranslations={pageProps.clientTranslations} locale={locale}>
      <Head>
        <link href="/favicon-v2.ico" rel="icon" sizes="any" />
        <link href="/favicon-v2.png" rel="icon" sizes="720x720" type="image/png" />
        <link href="/favicon-v2.png" rel="shortcut icon" type="image/png" />
        <link href="/favicon-v2.ico" rel="shortcut icon" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <meta content={SITE_NAME} property="og:site_name" />
        <meta content={canonicalUrl} property="og:url" />
        <meta content="summary_large_image" name="twitter:card" />
        <link href={canonicalUrl} rel="canonical" />
        {!isNotFoundRoute && LOCALES.map((item) => (
          <link
            href={absoluteUrl(siteUrl, localizePath(canonicalPath, item.code))}
            hrefLang={item.code}
            key={item.code}
            rel="alternate"
          />
        ))}
        {!isNotFoundRoute && <link href={absoluteUrl(siteUrl, canonicalPath)} hrefLang="x-default" rel="alternate" />}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
      </Head>
      <div key={localizedShellKey}>
        <ClientDomTranslator clientTranslations={pageProps.clientTranslations} locale={locale} />
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

function getStructuredData(siteUrl: string, logoUrl: string, siteImageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": SITE_NAME,
        "alternateName": [
          DOCTOR_NAME,
          CLINIC_NAME
        ],
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "inLanguage": "en"
      },
      {
        "@type": "MedicalOrganization",
        "@id": `${siteUrl}/#organization`,
        "name": CLINIC_NAME,
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": logoUrl,
          "width": 720,
          "height": 720
        },
        "image": siteImageUrl,
        "telephone": "+919871008256",
        "email": "drvikram.uro@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1st floor, Eros City Square Mall, 117, Rosewood City, Sector 49",
          "addressLocality": "Gurugram",
          "addressRegion": "Haryana",
          "postalCode": "122018",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#dr-vikram`,
        "name": DOCTOR_NAME,
        "url": siteUrl,
        "image": siteImageUrl,
        "telephone": "+919871008256",
        "email": "drvikram.uro@gmail.com",
        "jobTitle": "Urologist and Robotic Surgeon",
        "worksFor": {
          "@id": `${siteUrl}/#organization`
        }
      }
    ]
  };
}
