import type { GetStaticPaths, GetStaticProps } from "next";
import type { ComponentType } from "react";
import HomePage from "@/pages/index";
import BlogsPage from "@/pages/blogs/index";
import BlogDetailPage from "@/pages/blogs/[slug]";
import ContactUsPage from "@/pages/contact-us";
import PatientSupportPage from "@/pages/international-patient-support";
import TestimonialsPage from "@/pages/testimonials";
import TreatmentJourneyPage from "@/pages/treatment-journey";
import TreatmentPage from "@/pages/treatments/[slug]";
import VideoGalleryPage from "@/pages/video-gallery";
import { getBlogBySlug, type BlogData } from "@/lib/blogs";
import { isLocale, TARGET_LOCALES, type Locale } from "@/lib/i18n-config";
import { withLocaleProps } from "@/lib/page-i18n.server";
import { getAllSiteRoutes } from "@/lib/routes";
import { getTreatmentBySlug, type TreatmentData } from "@/lib/treatments";

type LocalizedPageProps = {
  locale: Locale;
  canonicalPath: string;
  pageKey: string;
  treatment?: TreatmentData;
  blog?: BlogData;
};

const staticPageComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  "/": HomePage,
  "/blogs": BlogsPage,
  "/contact-us": ContactUsPage,
  "/international-patient-support": PatientSupportPage,
  "/testimonials": TestimonialsPage,
  "/treatment-journey": TreatmentJourneyPage,
  "/video-gallery": VideoGalleryPage,
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TARGET_LOCALES.flatMap((locale) =>
    getAllSiteRoutes().map((route) => ({
      params: {
        locale: locale.code,
        path: route === "/" ? [] : route.split("/").filter(Boolean),
      },
    })),
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<LocalizedPageProps> = async ({ params }) => {
  const locale = String(params?.locale ?? "");
  const pathSegments = Array.isArray(params?.path) ? params.path.map(String) : [];
  const canonicalPath = `/${pathSegments.join("/")}`.replace(/\/$/, "") || "/";

  if (!isLocale(locale) || locale === "en") {
    return { notFound: true };
  }

  const [section, slug] = pathSegments;

  if (section === "treatments" && slug) {
    const treatment = getTreatmentBySlug(slug);

    if (!treatment) {
      return { notFound: true };
    }

    return {
      props: withLocaleProps(
        {
          locale,
          canonicalPath,
          pageKey: "treatment",
          treatment,
        },
        locale,
      ),
    };
  }

  if (section === "blogs" && slug) {
    const blog = getBlogBySlug(slug);

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: withLocaleProps(
        {
          locale,
          canonicalPath,
          pageKey: "blog",
          blog,
        },
        locale,
      ),
    };
  }

  if (!staticPageComponents[canonicalPath]) {
    return { notFound: true };
  }

  return {
    props: withLocaleProps(
      {
        locale,
        canonicalPath,
        pageKey: canonicalPath,
      },
      locale,
    ),
  };
};

export default function LocalizedPage({ pageKey, ...props }: LocalizedPageProps) {
  if (pageKey === "treatment") {
    return (
      <TreatmentPage
        canonicalPath={props.canonicalPath}
        locale={props.locale}
        treatment={props.treatment as TreatmentData}
      />
    );
  }

  if (pageKey === "blog") {
    return (
      <BlogDetailPage
        blog={props.blog as BlogData}
        canonicalPath={props.canonicalPath}
        locale={props.locale}
      />
    );
  }

  const PageComponent = staticPageComponents[pageKey];

  return PageComponent ? <PageComponent {...props} /> : null;
}
