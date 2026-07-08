import Head from "next/head";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import styles from "@/styles/BlogsPage.module.css";

type BlogCategory = "before" | "during" | "after";

type BlogPost = {
  category: BlogCategory;
  categoryLabel: string;
  badgeTone: "blue" | "orange" | "pink";
  readTime: string;
  title: string;
  excerpt: string;
};

const categoryTabs: { key: BlogCategory; label: string }[] = [
  { key: "before", label: "Before Treatment" },
  { key: "during", label: "During Treatment" },
  { key: "after", label: "After Treatment" },
];

const blogPosts: BlogPost[] = [
  {
    category: "before",
    categoryLabel: "Treatment",
    badgeTone: "blue",
    readTime: "12 min read",
    title: "The Link Between Chronic Pain, Nausea and Vomiting",
    excerpt:
      "Chronic pain is more than just a persistent ache it's a complex condition that affects over 24% of adults.",
  },
  {
    category: "during",
    categoryLabel: "Treatment",
    badgeTone: "orange",
    readTime: "12 min read",
    title: "The Link Between Chronic Pain, Nausea and Vomiting",
    excerpt:
      "Chronic pain is more than just a persistent ache it's a complex condition that affects over 24% of adults.",
  },
  {
    category: "after",
    categoryLabel: "Treatments",
    badgeTone: "pink",
    readTime: "12 min read",
    title: "The Link Between Chronic Pain, Nausea and Vomiting",
    excerpt:
      "Chronic pain is more than just a persistent ache it's a complex condition that affects over 24% of adults.",
  },
  {
    category: "before",
    categoryLabel: "Treatment",
    badgeTone: "blue",
    readTime: "12 min read",
    title: "The Link Between Chronic Pain, Nausea and Vomiting",
    excerpt:
      "Chronic pain is more than just a persistent ache it's a complex condition that affects over 24% of adults.",
  },
  {
    category: "during",
    categoryLabel: "Treatment",
    badgeTone: "orange",
    readTime: "12 min read",
    title: "The Link Between Chronic Pain, Nausea and Vomiting",
    excerpt:
      "Chronic pain is more than just a persistent ache it's a complex condition that affects over 24% of adults.",
  },
  {
    category: "after",
    categoryLabel: "Treatments",
    badgeTone: "pink",
    readTime: "12 min read",
    title: "The Link Between Chronic Pain, Nausea and Vomiting",
    excerpt:
      "Chronic pain is more than just a persistent ache it's a complex condition that affects over 24% of adults.",
  },
];

const faqs = [
  "Do I need to travel before deciding on treatment?",
  "What language support is available?",
  "How long should I plan to stay?",
  "What language support is available?",
  "How long should I plan to stay?",
  "How are follow-ups managed after I return home?",
  "How long should I plan to stay?",
  "How are follow-ups managed after I return home?",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image alt="" fill sizes="20px" src="/assets/figma/blogs/shield-plus.svg" />
      </span>
      <span>{children}</span>
    </p>
  );
}

function BlogHero() {
  return (
    <section className={styles.hero} data-node-id="103:37117">
      <div className={styles.heroHeading}>
        <SectionLabel>Blogs</SectionLabel>
        <div className={styles.heroText}>
          <h1>
            Ready to <span>take control</span> of your health?
          </h1>
          <p>Keep yourself updated regarding best practices and exercises to reduce your pain</p>
        </div>
      </div>
      <span className={styles.heroArrow}>
        <Image alt="" fill sizes="32px" src="/assets/figma/blogs/hero-arrow.svg" />
      </span>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className={styles.blogCard}>
      <div className={styles.blogImage}>
        <Image
          alt=""
          className={styles.blogImageAsset}
          fill
          sizes="(max-width: 900px) 100vw, 347px"
          src="/assets/figma/blogs/blog-doctor.png"
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <span className={`${styles.badge} ${styles[post.badgeTone]}`}>
            {post.categoryLabel}
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.readTime}>{post.readTime}</span>
        </div>

        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </div>

      <a className={styles.readMore} href="#">
        <span>Read more</span>
        <Image alt="" height={20} src="/assets/figma/blogs/arrow-outward.svg" width={20} />
      </a>
    </article>
  );
}

function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("before");

  const sortedPosts = useMemo(() => {
    const active = blogPosts.filter((post) => post.category === activeCategory);
    const rest = blogPosts.filter((post) => post.category !== activeCategory);
    return [...active, ...rest];
  }, [activeCategory]);

  return (
    <section className={styles.blogGridSection} data-node-id="103:37294">
      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Blog categories">
          {categoryTabs.map((tab) => (
            <button
              aria-selected={activeCategory === tab.key}
              className={activeCategory === tab.key ? styles.activeTab : undefined}
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.blogGrid}>
        {sortedPosts.map((post, index) => (
          <BlogCard key={`${post.category}-${index}`} post={post} />
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection} data-node-id="103:37322">
      <div className={styles.faqHeading}>
        <SectionLabel>Common questions</SectionLabel>
        <h2>Frequently asked questions</h2>
      </div>

      <div className={styles.faqList}>
        {faqs.map((question, index) => {
          const isOpen = openIndex === index;

          return (
            <div className={styles.faqItem} key={`${question}-${index}`}>
              <button
                aria-expanded={isOpen}
                className={styles.faqButton}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{question}</span>
                <Image
                  alt=""
                  className={isOpen ? styles.chevronOpen : undefined}
                  height={18}
                  src="/assets/figma/blogs/faq-chevron.svg"
                  width={18}
                />
              </button>
              {isOpen ? (
                <p className={styles.faqAnswer}>
                  Our team will guide you with the next practical step during consultation.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function BlogsPage() {
  return (
    <>
      <Head>
        <title>Blogs | Dr. Vikram</title>
        <meta
          content="Read Dr. Vikram's latest guidance on treatment, recovery, and patient care."
          name="description"
        />
      </Head>

      <main className={styles.blogsPage}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[styles.hero, styles.blogGridSection, styles.faqSection]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <BlogHero />
        <BlogGrid />
        <FaqSection />
      </main>
    </>
  );
}
