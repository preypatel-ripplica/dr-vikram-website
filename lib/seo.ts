import type { BlogData } from "@/lib/blogs";
import type { TreatmentData } from "@/lib/treatments";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://drvikrambaruakaushik.com").replace(/\/$/, "");
export const SITE_NAME = "Dr. Vikram | Urology & Robotic Surgery";
export const DOCTOR_NAME = "Dr. Vikram Barua";
export const CLINIC_NAME = "Urowellness Clinic";
export const SITE_IMAGE = `${SITE_URL}/images/hero-combined.png`;
export const LOGO_IMAGE = `${SITE_URL}/images/logo.png`;

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
  const cleanPath = path.split("#")[0]?.split("?")[0] || "/";
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
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
  type = "MedicalWebPage",
  image,
}: {
  path: string;
  title: string;
  description: string;
  type?: string;
  image?: string;
}): JsonLd {
  return compact({
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    headline: title,
    description,
    image: imageUrl(image),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#dr-vikram` },
    provider: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  });
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
      relevantSpecialty: "Urology",
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "@id": `${absoluteUrl(path)}#procedure`,
      name: `${treatment.hero.title} treatment`,
      description: treatment.experience.body.join(" "),
      procedureType: "Urologic treatment",
      relevantSpecialty: "Urology",
      provider: { "@id": `${SITE_URL}/#dr-vikram` },
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
  const title = `${blog.title} | Dr. Vikram`;

  return withoutNulls([
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(path)}#blogposting`,
      mainEntityOfPage: { "@id": `${absoluteUrl(path)}#webpage` },
      headline: blog.title,
      description: blog.metaDescription,
      image: imageUrl(blog.hero.image),
      author: { "@id": `${SITE_URL}/#dr-vikram` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      about: "Kidney stones",
      medicalSpecialty: "Urology",
      inLanguage: "en",
    },
    pageGraph({
      path,
      title,
      description: blog.metaDescription,
      type: "MedicalWebPage",
      image: blog.hero.image,
    }),
    faqGraph(blog.faqs.items),
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
