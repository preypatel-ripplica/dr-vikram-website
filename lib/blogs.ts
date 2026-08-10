import {
  asArray,
  asMedia,
  asRecord,
  asString,
  entryData,
  fetchCollection,
  resolveImage,
} from "@/lib/cms";

export type BlogInlineText = {
  type: "text";
  text: string;
};

export type BlogInlineLink = {
  type: "link";
  text: string;
  href: string;
};

export type BlogParagraph = string | (BlogInlineText | BlogInlineLink)[];

export type BlogSectionBlock = {
  type: "section";
  id: string;
  heading: string;
  paragraphs: BlogParagraph[];
  list: {
    type: "ol" | "ul";
    items: string[];
  } | null;
  quote: string;
};

export type BlogImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption: string;
};

export type BlogContentBlock = BlogSectionBlock | BlogImageBlock;

export type BlogData = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalPath: string;
  ogImage: string;
  category: string;
  readTime: string;
  excerpt: string;
  heroSubtitle: string;
  author: string;
  authorImage: string;
  publishedAt: string;
  publishedLabel: string;
  tags: string[];
  cardImage: string;
  cardAlt: string;
  hero: {
    summary: string;
    image: string;
    alt: string;
    caption: string;
  };
  content: {
    intro: BlogParagraph;
    blocks: BlogContentBlock[];
  };
  resources: {
    title: string;
    href: string;
    source: string;
  }[];
  faqs: {
    id: string;
    eyebrow: string;
    title: string;
    items: {
      question: string;
      answer: string[];
      openByDefault: boolean;
    }[];
  };
  sidebar: {
    items: { label: string; href: string }[];
  };
  seo: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    internalLinks: { label: string; href: string }[];
    references: { label: string; href: string }[];
  };
};

export type BlogCardData = Pick<
  BlogData,
  "slug" | "title" | "metaDescription" | "category" | "readTime" | "cardImage" | "cardAlt" | "publishedAt"
>;

function slugifyId(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function listType(value: unknown): "ol" | "ul" {
  return asString(value) === "ol" || asString(value) === "ordered" ? "ol" : "ul";
}

function toStringList(value: unknown): string[] {
  return asArray(value).filter((entry): entry is string => typeof entry === "string");
}

function toParagraph(value: unknown): BlogParagraph | null {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return null;

  const parts = value
    .map((entry) => {
      const part = asRecord(entry);
      const type = asString(part.type);
      const text = asString(part.text);

      if (!text) return null;
      if (type === "link") {
        return { type: "link" as const, text, href: asString(part.href) };
      }

      return { type: "text" as const, text };
    })
    .filter((entry): entry is BlogInlineText | BlogInlineLink => entry !== null);

  return parts.length ? parts : null;
}

function toParagraphs(value: unknown): BlogParagraph[] {
  return asArray(value)
    .map(toParagraph)
    .filter((entry): entry is BlogParagraph => entry !== null);
}

function keywordList(keywords: string): string[] {
  return keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

async function resolveRequiredImage(value: unknown): Promise<string> {
  return resolveImage(asMedia(value));
}

async function resolveOptionalImage(value: unknown): Promise<string> {
  const media = asMedia(value);
  if (!media) return "";
  if (typeof media === "string") return media;
  if (!media.media_id) return "";
  return resolveImage(media);
}

async function mapContentBlock(
  entry: unknown,
  index: number,
  fallbackImage: unknown,
): Promise<BlogContentBlock | null> {
  const block = asRecord(entry);
  const type = asString(block.type);

  if (type === "image") {
    const image = asRecord(block.image || fallbackImage);
    const src = await resolveOptionalImage(block.src || block.image || fallbackImage);
    if (!src) return null;

    return {
      type: "image",
      src,
      alt: asString(block.alt || image.alt_text),
      caption: asString(block.caption),
    };
  }

  if (type !== "section") return null;

  const heading = asString(block.heading);
  const list = asRecord(block.list);
  const listItems = toStringList(list.items);

  return {
    type: "section",
    id: slugifyId(asString(block.id || heading), `section-${index + 1}`),
    heading,
    paragraphs: toParagraphs(block.paragraphs),
    list: listItems.length
      ? {
          type: listType(list.type),
          items: listItems,
        }
      : null,
    quote: asString(block.quote),
  };
}

async function mapBlog(item: unknown): Promise<BlogData | null> {
  const e = asRecord(entryData(item));
  const slug = asString(e.slug);
  const title = asString(e.title);
  if (!slug || !title) return null;

  const content = asRecord(e.content);
  const hero = asRecord(e.hero);
  const sidebar = asRecord(e.sidebar);
  const keywords = asString(e.keywords);
  const heroImageField = e.hero_image || e.heroImage || e.bannerImage || hero.image || e.ogImage || e.cardImage;
  const contentImageField = e.content_image || e.contentImage;
  const heroImage = await resolveRequiredImage(heroImageField);
  const cardImage = (await resolveOptionalImage(e.cardImage)) || heroImage;
  const ogImage = (await resolveOptionalImage(e.ogImage)) || heroImage;
  const heroImageMeta = asRecord(heroImageField);
  const contentBlocks = await Promise.all(
    asArray(content.blocks).map((block, index) => mapContentBlock(block, index, contentImageField)),
  );
  const faqs = asArray(e.faqs).map((entry) => {
    const faq = asRecord(entry);
    return {
      question: asString(faq.question),
      answer: toStringList(faq.answer),
      openByDefault: Boolean(faq.openByDefault),
    };
  });
  const resources = asArray(e.resources).map((entry) => {
    const resource = asRecord(entry);
    return {
      title: asString(resource.title),
      href: asString(resource.href),
      source: asString(resource.source),
    };
  });
  const sectionItems = contentBlocks
    .filter((block): block is BlogSectionBlock => block?.type === "section")
    .map((block) => ({ label: block.heading, href: `#${block.id}` }));

  return {
    slug,
    title,
    metaTitle: asString(e.seoTitle || e.metaTitle),
    metaDescription: asString(e.description || e.metaDescription),
    keywords,
    canonicalPath: asString(e.canonicalPath, `/blogs/${slug}`),
    ogImage,
    category: asString(e.category, "Urology"),
    readTime: asString(e.readTime),
    excerpt: asString(e.excerpt),
    heroSubtitle: asString(e.heroSubtitle || hero.summary || e.excerpt),
    author: asString(e.author, "Dr Vikram Barua Kaushik"),
    authorImage: await resolveOptionalImage(e.authorImage),
    publishedAt: asString(e.publishedAt || e.publishedDate),
    publishedLabel: asString(e.publishedLabel),
    tags: toStringList(e.tags),
    cardImage,
    cardAlt: asString(e.cardAlt),
    hero: {
      summary: asString(e.heroSubtitle || hero.summary || e.excerpt),
      image: heroImage,
      alt: asString(e.bannerAlt || e.cardAlt || heroImageMeta.alt_text),
      caption: asString(hero.caption || e.author),
    },
    content: {
      intro: toParagraph(content.intro) ?? "",
      blocks: contentBlocks.filter((block): block is BlogContentBlock => block !== null),
    },
    resources,
    faqs: {
      id: "faq",
      eyebrow: "FAQs",
      title: "Frequently asked questions",
      items: faqs,
    },
    sidebar: {
      items: asArray(sidebar.items).length
        ? asArray(sidebar.items).map((entry) => {
            const sidebarItem = asRecord(entry);
            return { label: asString(sidebarItem.label), href: asString(sidebarItem.href) };
          })
        : [
            { label: "Overview", href: "#overview" },
            ...sectionItems,
            ...(resources.length ? [{ label: "Resources", href: "#resources" }] : []),
            ...(faqs.length ? [{ label: "FAQs", href: "#faq" }] : []),
          ],
    },
    seo: {
      primaryKeyword: keywordList(keywords)[0] || asString(e.category),
      secondaryKeywords: keywordList(keywords).slice(1),
      internalLinks: [],
      references: resources.map((resource) => ({
        label: resource.title,
        href: resource.href,
      })),
    },
  };
}

async function mapBlogCard(item: unknown): Promise<BlogCardData | null> {
  const e = asRecord(entryData(item));
  const hero = asRecord(e.hero);
  const slug = asString(e.slug);
  const title = asString(e.title);

  if (!slug || !title) return null;

  const heroImageField = e.hero_image || e.heroImage || e.bannerImage || hero.image || e.ogImage || e.cardImage;
  const heroImage = await resolveRequiredImage(heroImageField);
  const cardImage = (await resolveOptionalImage(e.cardImage)) || heroImage;

  return {
    slug,
    title,
    metaDescription: asString(e.description || e.metaDescription),
    category: asString(e.category, "Urology"),
    readTime: asString(e.readTime),
    cardImage,
    cardAlt: asString(e.cardAlt),
    publishedAt: asString(e.publishedAt || e.publishedDate),
  };
}

let cachedBlogs: Promise<BlogData[]> | null = null;
let cachedBlogCards: Promise<BlogCardData[]> | null = null;

function sortByPublishedAt<T extends { publishedAt: string }>(entries: { item: T; index: number }[]) {
  return entries
    .sort((a, b) => {
      const bTime = Date.parse(b.item.publishedAt);
      const aTime = Date.parse(a.item.publishedAt);

      if (!Number.isNaN(bTime) && !Number.isNaN(aTime) && bTime !== aTime) {
        return bTime - aTime;
      }

      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

/** All blogs — CMS entries only, no local fallback. */
export function getAllBlogs(): Promise<BlogData[]> {
  if (!cachedBlogs) {
    cachedBlogs = (async () => {
      const entries = await fetchCollection("new-blogs");
      const mapped = await Promise.all(entries.map(mapBlog));
      return sortByPublishedAt(
        mapped
          .map((item, index) => ({ item, index }))
          .filter((entry): entry is { item: BlogData; index: number } => entry.item !== null),
      );
    })();
  }

  return cachedBlogs;
}

/** Blog listing cards only — keeps index pages and localized props small. */
export function getBlogCards(): Promise<BlogCardData[]> {
  if (!cachedBlogCards) {
    cachedBlogCards = (async () => {
      const entries = await fetchCollection("new-blogs");
      const mapped = await Promise.all(entries.map(mapBlogCard));
      return sortByPublishedAt(
        mapped
          .map((item, index) => ({ item, index }))
          .filter((entry): entry is { item: BlogCardData; index: number } => entry.item !== null),
      );
    })();
  }

  return cachedBlogCards;
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  const blogs = await getAllBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}
