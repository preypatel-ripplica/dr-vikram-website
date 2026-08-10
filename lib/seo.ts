import type { BlogData } from "@/lib/blogs";
import type { TreatmentData } from "@/lib/treatments";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://drvikrambaruakaushik.com").replace(/\/$/, "");
export const SITE_NAME = "Dr. Vikram Barua Kaushik";
export const DOCTOR_NAME = "Dr. Vikram Barua Kaushik";
export const CLINIC_NAME = "Urowellness Clinic";
export const SITE_IMAGE = `${SITE_URL}/images/hero-combined.png`;
export const SOCIAL_IMAGE = `${SITE_URL}/images/hero-combined-desktop.webp`;
export const CLINIC_IMAGE = `${SITE_URL}/images/Clinic.webp`;
export const LOGO_IMAGE = `${SITE_URL}/images/logo.png`;
// Genuine solo portrait — never the composite hero banner — for Person schema.
export const DOCTOR_IMAGE = `${SITE_URL}/images/DSC_0138.webp`;
export const CLINIC_PHONE = "+919871008256";
export const CLINIC_EMAIL = "drvikram.uro@gmail.com";
export const CLINIC_PUBLIC_PHONE = "9871008256";
export const CLINIC_TIMING = "Monday to Saturday, 5:00 PM - 8:00 PM";
export const CLINIC_MAP_URL =
  "https://www.google.com/maps/place/Urowellness+Clinic/@28.4105879,77.0494974,15.49z/data=!4m6!3m5!1s0x390d2326e6cfc237:0xce7eb85b0e06c7ba!8m2!3d28.412509!4d77.054953!16s%2Fg%2F11nr0cx85r";
export const CLINIC_ADDRESS = {
  streetAddress: "1st Floor, Eros City Square Mall, 117, Rosewood City, Sector 49",
  addressLocality: "Gurugram",
  addressRegion: "Haryana",
  postalCode: "122018",
  addressCountry: "IN",
};
export const CLINIC_FULL_ADDRESS =
  "Urowellness Clinic, 1st floor, Eros City Square Mall, 117, Rosewood City, Sector 49, Gurugram, Haryana 122018";
// Verified, currently-live profile links only — no placeholder/fabricated URLs.
export const DOCTOR_SAME_AS = [
  "https://www.youtube.com/@DrVikramBaruaKaushik",
  "https://www.instagram.com/drvikramkaushik/",
  "https://www.facebook.com/UrowellnessClinic",
];

type JsonLd = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export function absoluteUrl(path = "/") {
  const cleanPath = path.split("?")[0] || "/";
  return `${SITE_URL}${cleanPath === "/" ? "/" : cleanPath}`;
}

export function imageUrl(path?: string) {
  if (!path) return SITE_IMAGE;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageGraph({
  path,
  title,
  description,
  type = "WebPage",
  image,
  headline,
  primaryImage,
}: {
  path: string;
  title: string;
  description: string;
  type?: string;
  image?: string;
  /** Defaults to `title` — pass this when the visible H1 differs from the `<title>` tag. */
  headline?: string;
  /** Adds `primaryImageOfPage` when the page has one clear hero/lead image. */
  primaryImage?: string;
}): JsonLd {
  return compact({
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    headline: headline ?? title,
    description,
    image: imageUrl(image),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#doctor` },
    provider: { "@id": `${SITE_URL}/#organization` },
    primaryImageOfPage: primaryImage
      ? { "@type": "ImageObject", url: imageUrl(primaryImage) }
      : undefined,
    inLanguage: "en",
  });
}

/**
 * The three identity nodes shared by every page: WebSite, MedicalOrganization,
 * Person. This is the single source of truth for the doctor/clinic's name,
 * so a fix here reaches every page automatically — never redeclare these
 * nodes by hand elsewhere.
 */
export function identityGraphItems(): JsonLd[] {
  return [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: ["Dr. Vikram", "Dr. Vikram Barua", CLINIC_NAME],
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": ["MedicalOrganization", "MedicalClinic", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: CLINIC_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: LOGO_IMAGE,
        contentUrl: LOGO_IMAGE,
        width: 720,
        height: 720,
      },
      image: CLINIC_IMAGE,
      telephone: CLINIC_PHONE,
      email: CLINIC_EMAIL,
      hasMap: CLINIC_MAP_URL,
      priceRange: "$$",
      medicalSpecialty: "Urology",
      address: {
        "@type": "PostalAddress",
        ...CLINIC_ADDRESS,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "17:00",
          closes: "20:00",
        },
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#doctor`,
      name: DOCTOR_NAME,
      alternateName: ["Dr. Vikram Barua", "Dr. Vikram"],
      url: `${SITE_URL}/`,
      image: {
        "@type": "ImageObject",
        url: DOCTOR_IMAGE,
      },
      jobTitle: "Urologist and Robotic Surgeon",
      telephone: CLINIC_PHONE,
      email: CLINIC_EMAIL,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: DOCTOR_SAME_AS,
    },
  ];
}

export function clinicPageGraphs({
  title,
  description,
  path = "/urowellness-clinic-gurugram",
}: {
  title: string;
  description: string;
  path?: string;
}): JsonLd[] {
  return [
    pageGraph({
      path,
      title,
      description,
      type: "MedicalWebPage",
      image: CLINIC_IMAGE,
      primaryImage: CLINIC_IMAGE,
    }),
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "@id": `${absoluteUrl(path)}#urowellness-clinic`,
      name: CLINIC_NAME,
      url: absoluteUrl(path),
      image: CLINIC_IMAGE,
      logo: LOGO_IMAGE,
      telephone: CLINIC_PHONE,
      email: CLINIC_EMAIL,
      hasMap: CLINIC_MAP_URL,
      priceRange: "$$",
      medicalSpecialty: "Urology",
      address: {
        "@type": "PostalAddress",
        ...CLINIC_ADDRESS,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "17:00",
          closes: "20:00",
        },
      ],
      physician: { "@id": `${SITE_URL}/#doctor` },
      availableService: [
        "Urology consultation",
        "Kidney stone consultation",
        "Prostate problem consultation",
        "Urinary symptom evaluation",
        "Men's health urology consultation",
        "Robotic urology consultation",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Physician",
      "@id": `${absoluteUrl(path)}#physician`,
      name: DOCTOR_NAME,
      image: DOCTOR_IMAGE,
      medicalSpecialty: "Urology",
      telephone: CLINIC_PHONE,
      email: CLINIC_EMAIL,
      worksFor: { "@id": `${absoluteUrl(path)}#urowellness-clinic` },
      address: {
        "@type": "PostalAddress",
        ...CLINIC_ADDRESS,
      },
    },
    breadcrumbGraph([
      { name: "Home", path: "/" },
      { name: CLINIC_NAME, path },
    ]),
  ];
}

export function breadcrumbGraph(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqGraph(items?: FaqItem[]): JsonLd | null {
  if (!items?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function treatmentGraphs(treatment: TreatmentData): JsonLd[] {
  const path = `/treatments/${treatment.slug}`;
  const title = treatment.metaTitle;
  const description = treatment.metaDescription;
  const procedureName = /treatment$/i.test(treatment.hero.title)
    ? treatment.hero.title
    : `${treatment.hero.title} treatment`;

  return withoutNulls([
    pageGraph({
      path,
      title,
      description,
      image: treatment.hero.image,
    }),
    {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      "@id": `${absoluteUrl(path)}#condition`,
      name: treatment.hero.title,
      description: treatment.overview.body.join(" "),
      possibleTreatment: {
        "@id": `${absoluteUrl(path)}#procedure`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": ["MedicalProcedure", "MedicalTherapy"],
      "@id": `${absoluteUrl(path)}#procedure`,
      name: procedureName,
      description: treatment.experience.body.join(" "),
      provider: { "@id": `${SITE_URL}/#doctor` },
    },
    faqGraph(treatment.faqs.items),
    breadcrumbGraph([
      { name: "Home", path: "/" },
      { name: "Treatments", path: "/#treatments" },
      { name: treatment.hero.title, path },
    ]),
  ]);
}

export function blogGraphs(blog: BlogData): JsonLd[] {
  const path = `/blogs/${blog.slug}`;
  const title = blog.metaTitle || `${blog.title} | Dr. Vikram`;
  const keywords = [
    blog.seo.primaryKeyword,
    ...blog.seo.secondaryKeywords,
  ].filter(Boolean);

  return withoutNulls([
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(path)}#blogposting`,
      mainEntityOfPage: { "@id": `${absoluteUrl(path)}#webpage` },
      headline: blog.title,
      description: blog.metaDescription,
      image: imageUrl(blog.hero.image),
      author: { "@id": `${SITE_URL}/#doctor` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      about: blog.seo.primaryKeyword || blog.category || blog.title,
      keywords: keywords.length ? keywords.join(", ") : undefined,
      datePublished: blog.publishedAt || undefined,
      dateModified: blog.publishedAt || undefined,
      inLanguage: "en",
    },
    pageGraph({
      path,
      title,
      description: blog.metaDescription,
      image: blog.hero.image,
    }),
    faqGraph(
      blog.faqs.items.map((item) => ({
        question: item.question,
        answer: item.answer.join(" "),
      })),
    ),
    breadcrumbGraph([
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: blog.title, path },
    ]),
  ]);
}

export function itemListGraph({
  path,
  name,
  items,
}: {
  path: string;
  name: string;
  items: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#itemlist`,
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };
}

export function compact<T extends JsonLd>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ""),
  ) as T;
}

function withoutNulls<T>(items: Array<T | null>): T[] {
  return items.filter((item): item is T => Boolean(item));
}
