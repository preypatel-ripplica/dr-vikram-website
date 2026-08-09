import type { GetStaticPaths, GetStaticProps } from "next";
import type { ComponentType } from "react";
import HomePage from "@/pages/index";
import AboutUsPage from "@/pages/about-us";
import BlogsPage from "@/pages/blogs/index";
import BlogDetailPage from "@/pages/blogs/[slug]";
import ContactUsPage from "@/pages/contact-us";
import PatientSupportPage from "@/pages/international-patient-support";
import TestimonialsPage from "@/pages/testimonials";
import TreatmentJourneyPage from "@/pages/treatment-journey";
import TreatmentPage from "@/pages/treatments/[slug]";
import UrowellnessClinicPage from "@/pages/urowellness-clinic-gurugram";
import VideoGalleryPage from "@/pages/video-gallery";
import { getAllBlogs, getBlogBySlug, type BlogData } from "@/lib/blogs";
import { isLocale, TARGET_LOCALES, type Locale } from "@/lib/i18n-config";
import { withLocaleProps } from "@/lib/page-i18n.server";
import { getAllSiteRoutes } from "@/lib/routes";
import { getAllTreatments, getTreatmentBySlug, type TreatmentData } from "@/lib/treatments";

type LocalizedPageProps = {
  clientTranslations?: Record<string, string>;
  locale: Locale;
  canonicalPath: string;
  pageKey: string;
  treatment?: TreatmentData;
  blog?: BlogData;
  treatments?: TreatmentData[];
  blogPosts?: BlogData[];
  navTreatments?: TreatmentData[];
};

const staticPageComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  "/": HomePage,
  "/about-us": AboutUsPage as ComponentType<Record<string, unknown>>,
  "/blogs": BlogsPage as ComponentType<Record<string, unknown>>,
  "/contact-us": ContactUsPage,
  "/international-patient-support": PatientSupportPage,
  "/testimonials": TestimonialsPage,
  "/treatment-journey": TreatmentJourneyPage,
  "/urowellness-clinic-gurugram": UrowellnessClinicPage,
  "/video-gallery": VideoGalleryPage,
};

const commonRuntimeSources = [
  "components/layout/Header.tsx",
  "components/layout/LanguageSwitcher.tsx",
  "components/layout/Footer.tsx",
  "components/shared/ClientDomTranslator.tsx",
];

const appointmentRuntimeSources = [
  "components/shared/AppointmentSection.tsx",
];

const finalCtaRuntimeSources = [
  "components/home/FinalCtaSection.tsx",
  "components/shared/LocalizedHighlight.tsx",
];

const testimonialRuntimeSources = [
  "components/home/TestimonialsSection.tsx",
  "pages/testimonials.tsx",
];

const localizedRuntimeSources: Record<string, string[]> = {
  "/about-us": [
    "pages/about-us.tsx",
    "components/home/TestimonialsSection.tsx",
    ...appointmentRuntimeSources,
  ],
  "/": [
    "pages/index.tsx",
    "components/home/TreatmentsCarousel.tsx",
    "components/home/SymptomGuide.tsx",
    "components/home/RoboticVisionComparison.tsx",
    "components/home/RoboticMovementToggle.tsx",
    "components/home/TestimonialsSection.tsx",
    ...appointmentRuntimeSources,
    ...finalCtaRuntimeSources,
  ],
  "/blogs": [
    "pages/blogs/index.tsx",
    "components/shared/LocalizedHighlight.tsx",
  ],
  "/contact-us": [
    "pages/contact-us.tsx",
    "components/home/TestimonialsSection.tsx",
    ...appointmentRuntimeSources,
  ],
  "/international-patient-support": [
    "pages/international-patient-support.tsx",
    "components/home/TestimonialsSection.tsx",
    ...appointmentRuntimeSources,
  ],
  "/testimonials": [
    ...testimonialRuntimeSources,
    ...appointmentRuntimeSources,
    ...finalCtaRuntimeSources,
  ],
  "/treatment-journey": [
    "pages/treatment-journey.tsx",
    "components/home/TestimonialsSection.tsx",
    ...appointmentRuntimeSources,
    ...finalCtaRuntimeSources,
  ],
  "/urowellness-clinic-gurugram": [
    "pages/urowellness-clinic-gurugram.tsx",
    ...appointmentRuntimeSources,
  ],
  "/video-gallery": [
    "pages/video-gallery.tsx",
    ...appointmentRuntimeSources,
  ],
};

const treatmentRuntimeSources = [
  "pages/treatments/[slug].tsx",
  "components/treatments",
  ...appointmentRuntimeSources,
  ...finalCtaRuntimeSources,
];

const blogRuntimeSources = [
  "pages/blogs/[slug].tsx",
  ...appointmentRuntimeSources,
  ...finalCtaRuntimeSources,
];

function getRuntimeSources(pageKey: string) {
  return [
    ...commonRuntimeSources,
    ...(localizedRuntimeSources[pageKey] ?? []),
  ];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const routes = await getAllSiteRoutes();
  const paths = TARGET_LOCALES.flatMap((locale) =>
    routes.map((route) => ({
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

  const navTreatments = await getAllTreatments();
  const [section, slug] = pathSegments;

  if (section === "treatments" && slug) {
    const treatment = await getTreatmentBySlug(slug);

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
          navTreatments,
        },
        locale,
        {
          runtimeSources: [
            ...commonRuntimeSources,
            ...treatmentRuntimeSources,
          ],
        },
      ),
    };
  }

  if (section === "blogs" && slug) {
    const blog = await getBlogBySlug(slug);

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
          navTreatments,
        },
        locale,
        {
          runtimeSources: [
            ...commonRuntimeSources,
            ...blogRuntimeSources,
          ],
        },
      ),
    };
  }

  if (!staticPageComponents[canonicalPath]) {
    return { notFound: true };
  }

  if (canonicalPath === "/blogs") {
    const blogPosts = await getAllBlogs();

    return {
      props: withLocaleProps(
        {
          locale,
          canonicalPath,
          pageKey: canonicalPath,
          blogPosts,
          navTreatments,
        },
        locale,
        {
          runtimeSources: getRuntimeSources(canonicalPath),
        },
      ),
    };
  }

  if (canonicalPath === "/about-us") {
    return {
      props: withLocaleProps(
        {
          locale,
          canonicalPath,
          pageKey: canonicalPath,
          treatments: navTreatments,
          navTreatments,
        },
        locale,
        {
          runtimeSources: getRuntimeSources(canonicalPath),
        },
      ),
    };
  }

  return {
    props: withLocaleProps(
      {
        locale,
        canonicalPath,
        pageKey: canonicalPath,
        navTreatments,
      },
      locale,
      {
        runtimeSources: getRuntimeSources(canonicalPath),
      },
    ),
  };
};

export default function LocalizedPage({ pageKey, ...props }: LocalizedPageProps) {
  if (pageKey === "treatment") {
    return (
      <TreatmentPage
        canonicalPath={props.canonicalPath}
        locale={props.locale}
        navTreatments={props.navTreatments ?? []}
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
        navTreatments={props.navTreatments ?? []}
      />
    );
  }

  const PageComponent = staticPageComponents[pageKey];

  return PageComponent ? <PageComponent {...props} /> : null;
}
