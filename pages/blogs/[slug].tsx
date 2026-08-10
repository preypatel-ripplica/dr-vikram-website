import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { SeoHead } from "@/components/shared/SeoHead";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n-config";
import { withLocaleProps } from "@/lib/page-i18n.server";
import { getAllBlogs, getBlogBySlug, type BlogContentBlock, type BlogData, type BlogParagraph } from "@/lib/blogs";
import { blogGraphs } from "@/lib/seo";
import { getTreatmentNavItems, type TreatmentNavItem } from "@/lib/treatments";
import styles from "@/styles/BlogDetailPage.module.css";

type BlogPageProps = {
  blog: BlogData;
  canonicalPath: string;
  locale: Locale;
  navTreatments: TreatmentNavItem[];
};

function buildSidebarItems(blog: BlogData): BlogData["sidebar"]["items"] {
  return blog.sidebar.items.filter((item) => item.href && item.label);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  if (!children) return null;

  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image
          alt=""
          fill
          sizes="20px"
          src="/assets/figma/blog-detail/shield-plus.svg"
        />
      </span>
      <span>{children}</span>
    </p>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className={styles.sectionHeading}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2>{title}</h2>
    </div>
  );
}

function BlogHero({ blog }: { blog: BlogData }) {
  return (
    <section className={styles.hero} data-node-id="135:10295">
      <p className={styles.readTime}>{blog.readTime}</p>
      <h1>{blog.title}</h1>
      <p className={styles.heroSummary}>{blog.hero.summary}</p>
      <div className={styles.heroImage}>
        <Image
          alt={blog.hero.alt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 1280px"
          src={blog.hero.image}
        />
        <span>{blog.hero.caption}</span>
      </div>
    </section>
  );
}

function Sidebar({
  activeSection,
  items,
}: {
  activeSection: string;
  items: BlogData["sidebar"]["items"];
}) {
  return (
    <aside className={styles.sidebar} data-node-id="135:10312">
      <nav className={styles.sidebarNav} aria-label="Article sections">
        {items.map((item) => {
          const id = item.href.replace("#", "");

          return (
            <a
              className={activeSection === id ? styles.activeNavItem : undefined}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className={styles.sidebarCta}>
        <strong>Have questions?</strong>
        <p>Dr. Vikram&apos;s team is here to help.</p>
        <a href="#contact">Book appointment</a>
      </div>
    </aside>
  );
}

function Paragraph({ paragraph }: { paragraph: BlogParagraph }) {
  if (typeof paragraph === "string") {
    return <p>{paragraph}</p>;
  }

  return (
    <p>
      {paragraph.map((part, index) =>
        part.type === "link" ? (
          <a href={part.href} key={`${part.text}-${index}`}>
            {part.text}
          </a>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </p>
  );
}

function IntroSection({ blog }: { blog: BlogData }) {
  return (
    <section className={styles.contentSection} id="overview" data-node-id="135:10337">
      <div className={styles.richText}>
        <Paragraph paragraph={blog.content.intro} />
      </div>
    </section>
  );
}

function SectionBlock({ block }: { block: Extract<BlogContentBlock, { type: "section" }> }) {
  const ListTag = block.list?.type === "ol" ? "ol" : "ul";

  return (
    <section className={styles.contentSection} id={block.id}>
      <SectionHeading eyebrow="" title={block.heading} />

      <div className={styles.richText}>
        {block.paragraphs.map((paragraph, index) => (
          <Paragraph key={index} paragraph={paragraph} />
        ))}
      </div>

      {block.list ? (
        <ListTag className={styles.articleList}>
          {block.list.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      ) : null}

      {block.quote ? <blockquote className={styles.inlineQuote}>{block.quote}</blockquote> : null}
    </section>
  );
}

function ImageBlock({ block }: { block: Extract<BlogContentBlock, { type: "image" }> }) {
  return (
    <figure className={styles.contentImage}>
      <Image
        alt={block.alt}
        fill
        sizes="(max-width: 900px) 100vw, 916px"
        src={block.src}
      />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function ContentBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === "image") return <ImageBlock block={block} />;

  return <SectionBlock block={block} />;
}

function ResourcesSection({ blog }: { blog: BlogData }) {
  if (!blog.resources.length) return null;

  return (
    <section className={styles.contentSection} id="resources">
      <SectionHeading eyebrow="" title="Resources" />
      <ul className={styles.resourceList}>
        {blog.resources.map((resource) => (
          <li key={resource.href}>
            <a href={resource.href} rel="noreferrer" target="_blank">
              {resource.title}
            </a>
            {resource.source ? <span>{resource.source}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FaqSection({ blog }: { blog: BlogData }) {
  const defaultOpenIndex = blog.faqs.items.findIndex((item) => item.openByDefault);
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex >= 0 ? defaultOpenIndex : null,
  );

  return (
    <section className={styles.faqSection} id={blog.faqs.id} data-node-id="135:10546">
      <SectionHeading eyebrow={blog.faqs.eyebrow} title={blog.faqs.title} />

      <div className={styles.faqList}>
        {blog.faqs.items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div className={styles.faqItem} key={item.question}>
              <button
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{item.question}</span>
                <Image
                  alt=""
                  className={isOpen ? styles.faqIconOpen : undefined}
                  height={18}
                  src="/assets/figma/blog-detail/faq-chevron.svg"
                  width={18}
                />
              </button>
              {isOpen
                ? item.answer.map((answer) => <p key={answer}>{answer}</p>)
                : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function BlogDetailPage({ blog }: BlogPageProps) {
  const sidebarItems = useMemo(() => buildSidebarItems(blog), [blog]);

  const [activeSection, setActiveSection] = useState(
    sidebarItems[0]?.href.replace("#", "") ?? "overview",
  );

  const sectionIds = useMemo(
    () => sidebarItems.map((item) => item.href.replace("#", "")),
    [sidebarItems],
  );

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-32% 0px -55% 0px",
        threshold: [0.08, 0.2, 0.4, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <>
      <SeoHead
        title={blog.metaTitle || `${blog.title} | Dr. Vikram`}
        description={blog.metaDescription}
        image={blog.hero.image}
        ogType="article"
        jsonLd={blogGraphs(blog)}
      />

      <main className={styles.blogDetailPage}>
        <BlogHero blog={blog} />

        <div className={styles.bodyShell} data-node-id="135:10311">
          <Sidebar activeSection={activeSection} items={sidebarItems} />

          <article className={styles.article}>
            <IntroSection blog={blog} />
            {blog.content.blocks.map((block, index) => (
              <ContentBlock key={`${block.type}-${index}`} block={block} />
            ))}
            <ResourcesSection blog={blog} />
            <FaqSection blog={blog} />
          </article>
        </div>

        <AppointmentSection />
        <FinalCtaSection />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await getAllBlogs();

  return {
    fallback: false,
    paths: blogs.map((blog) => ({
      params: { slug: blog.slug },
    })),
  };
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const [blog, navTreatments] = await Promise.all([getBlogBySlug(slug), getTreatmentNavItems()]);

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: withLocaleProps(
      {
        blog,
        canonicalPath: `/blogs/${blog.slug}`,
        navTreatments,
      },
      DEFAULT_LOCALE,
    ),
  };
};
