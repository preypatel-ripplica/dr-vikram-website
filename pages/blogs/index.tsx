import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { useI18n } from "@/lib/i18n-context";
import { getAllBlogs, type BlogData } from "@/lib/blogs";
import styles from "@/styles/BlogsPage.module.css";

const blogPosts = getAllBlogs();

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
  const { t } = useI18n();

  return (
    <section className={styles.hero} data-node-id="103:37117">
      <div className={styles.heroHeading}>
        <SectionLabel>{t("Blogs")}</SectionLabel>
        <div className={styles.heroText}>
          <h1>
            {t("Ready to")} <span>{t("take control")}</span> {t("of your health?")}
          </h1>
          <p>{t("Keep yourself updated regarding best practices and exercises to reduce your pain")}</p>
        </div>
      </div>
      <span className={styles.heroArrow}>
        <Image alt="" fill sizes="32px" src="/assets/figma/blogs/hero-arrow.svg" />
      </span>
    </section>
  );
}

function BlogCard({ post }: { post: BlogData }) {
  const { localizeHref, t } = useI18n();

  return (
    <article className={styles.blogCard}>
      <div className={styles.blogImage}>
        <Image
          alt={post.title}
          className={styles.blogImageAsset}
          fill
          sizes="(max-width: 900px) 100vw, 347px"
          src={post.hero.image}
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <span className={`${styles.badge} ${styles.blue}`}>{t("Kidney Stones")}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.readTime}>{t(post.readTime)}</span>
        </div>

        <h2>{t(post.title)}</h2>
        <p>{t(post.metaDescription)}</p>
      </div>

      <Link className={styles.readMore} href={localizeHref(`/blogs/${post.slug}/`)}>
        <span>{t("Read more")}</span>
        <Image alt="" height={20} src="/assets/figma/blogs/arrow-outward.svg" width={20} />
      </Link>
    </article>
  );
}

function BlogGrid() {
  return (
    <section className={styles.blogGridSection} data-node-id="103:37294">
      <div className={styles.blogGrid}>
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection} data-node-id="103:37322">
      <div className={styles.faqHeading}>
        <SectionLabel>{t("Common questions")}</SectionLabel>
        <h2>{t("Frequently asked questions")}</h2>
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
                <span>{t(question)}</span>
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
                  {t("Our team will guide you with the next practical step during consultation.")}
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
  const { t } = useI18n();

  return (
    <>
      <Head>
        <title>{t("Blogs | Dr. Vikram")}</title>
        <meta
          content={t("Read Dr. Vikram's latest guidance on treatment, recovery, and patient care.")}
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
