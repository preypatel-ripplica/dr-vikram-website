import {
  asArray,
  asMedia,
  asRecord,
  asString,
  entryData,
  fetchCollection,
  resolveImage,
  toStringArray,
} from "@/lib/cms";

// Small illustrative icons (size guide, treatment options, stat badges) are
// fixed local assets, not CMS uploads — the CMS only stores the icon key
// (e.g. "stone-size-under-4mm"), and it's resolved to this folder here.
const BLOG_ICON_BASE = "/assets/figma/blog-detail";

function blogIcon(value: unknown): string {
  const key = asString(value);
  return key ? `${BLOG_ICON_BASE}/${key}.svg` : "";
}

export type BlogData = {
  slug: string;
  title: string;
  readTime: string;
  metaDescription: string;
  hero: {
    summary: string;
    image: string;
    caption: string;
  };
  sidebar: {
    items: { label: string; href: string }[];
  };
  overview: {
    eyebrow: string;
    titlePrefix: string;
    highlight: string;
    paragraphs: string[];
    subheading: string;
    subParagraphs: string[];
  };
  sizeGuide: {
    eyebrow: string;
    title: string;
    items: { size: string; icon: string; copy: string }[];
  };
  treatmentOptions: {
    eyebrow: string;
    title: string;
    note: string;
    items: { title: string; icon: string; bestFor: string; duration: string; copy: string }[];
  };
  symptomCheck: {
    eyebrow: string;
    title: string;
    steps: { question: string; options: string[] }[];
    note: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    subheading: string;
    subParagraphs: string[];
    image: string;
    quote: string;
    byline: string;
    stats: { value: string; label: string; icon: string }[];
  };
  faqs: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
};

async function mapBlog(item: unknown): Promise<BlogData | null> {
  const e = asRecord(entryData(item));
  const slug = asString(e.slug);
  const title = asString(e.title);
  if (!slug || !title) return null;

  const hero = asRecord(e.hero);
  const sidebar = asRecord(e.sidebar);
  const overview = asRecord(e.overview);
  const sizeGuide = asRecord(e.sizeGuide);
  const treatmentOptions = asRecord(e.treatmentOptions);
  const symptomCheck = asRecord(e.symptomCheck);
  const experience = asRecord(e.experience);
  const faqs = asRecord(e.faqs);

  return {
    slug,
    title,
    readTime: asString(e.readTime),
    metaDescription: asString(e.metaDescription),
    hero: {
      summary: asString(hero.summary),
      image: await resolveImage(asMedia(hero.image)),
      caption: asString(hero.caption),
    },
    sidebar: {
      items: asArray(sidebar.items).map((entry) => {
        const item = asRecord(entry);
        return { label: asString(item.label), href: asString(item.href) };
      }),
    },
    overview: {
      eyebrow: asString(overview.eyebrow),
      titlePrefix: asString(overview.titlePrefix),
      highlight: asString(overview.highlight),
      paragraphs: toStringArray(overview.paragraphs),
      subheading: asString(overview.subheading),
      subParagraphs: toStringArray(overview.subParagraphs),
    },
    sizeGuide: {
      eyebrow: asString(sizeGuide.eyebrow),
      title: asString(sizeGuide.title),
      items: asArray(sizeGuide.items).map((entry) => {
        const item = asRecord(entry);
        return {
          size: asString(item.size),
          icon: blogIcon(item.icon),
          copy: asString(item.copy),
        };
      }),
    },
    treatmentOptions: {
      eyebrow: asString(treatmentOptions.eyebrow),
      title: asString(treatmentOptions.title),
      note: asString(treatmentOptions.note),
      items: asArray(treatmentOptions.items).map((entry) => {
        const item = asRecord(entry);
        return {
          title: asString(item.title),
          icon: blogIcon(item.icon),
          bestFor: asString(item.bestFor),
          duration: asString(item.duration),
          copy: asString(item.copy),
        };
      }),
    },
    symptomCheck: {
      eyebrow: asString(symptomCheck.eyebrow),
      title: asString(symptomCheck.title),
      steps: asArray(symptomCheck.steps).map((entry) => {
        const step = asRecord(entry);
        return { question: asString(step.question), options: toStringArray(step.options) };
      }),
      note: asString(symptomCheck.note),
    },
    experience: {
      eyebrow: asString(experience.eyebrow),
      title: asString(experience.title),
      paragraphs: toStringArray(experience.paragraphs),
      subheading: asString(experience.subheading),
      subParagraphs: toStringArray(experience.subParagraphs),
      image: await resolveImage(asMedia(experience.image)),
      quote: asString(experience.quote),
      byline: asString(experience.byline),
      stats: asArray(experience.stats).map((entry) => {
        const stat = asRecord(entry);
        return {
          value: asString(stat.value),
          label: asString(stat.label),
          icon: blogIcon(stat.icon),
        };
      }),
    },
    faqs: {
      eyebrow: asString(faqs.eyebrow),
      title: asString(faqs.title),
      items: asArray(faqs.items).map((entry) => {
        const faqItem = asRecord(entry);
        return { question: asString(faqItem.question), answer: asString(faqItem.answer) };
      }),
    },
  };
}

let cachedBlogs: Promise<BlogData[]> | null = null;

/** All blogs — CMS entries only, no local fallback. */
export function getAllBlogs(): Promise<BlogData[]> {
  if (!cachedBlogs) {
    cachedBlogs = (async () => {
      const entries = await fetchCollection("blog");
      const mapped = await Promise.all(entries.map(mapBlog));
      return mapped
        .filter((blog): blog is BlogData => blog !== null)
        .sort((a, b) => a.slug.localeCompare(b.slug));
    })();
  }

  return cachedBlogs;
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  const blogs = await getAllBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}
