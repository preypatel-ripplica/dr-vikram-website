import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { getAllBlogs, type BlogData } from "@/lib/blogs";
import { breadcrumbGraph, faqGraph, itemListGraph, pageGraph } from "@/lib/seo";
import styles from "@/styles/BlogsPage.module.css";

const blogPosts = getAllBlogs();

const faqs = [
  {
    question: "How do I know if my urinary symptoms need a doctor?",
    answer:
      "You should speak to a urologist if symptoms are repeated, painful, worsening, or affecting sleep and daily routine. Burning urination, blood in urine, fever with urinary symptoms, severe flank pain, or inability to pass urine should not be ignored.",
  },
  {
    question: "Is kidney stone pain always severe?",
    answer:
      "Not always. Some stones cause sudden severe back or side pain, while smaller or non-blocking stones may cause mild discomfort, burning urination, blood in urine, nausea, or no symptoms at all. A scan helps confirm the size and location.",
  },
  {
    question: "When should prostate symptoms be checked?",
    answer:
      "Men should get checked if they have weak urine flow, frequent urination, waking often at night, urgency, incomplete emptying, blood in urine, or pain. Early evaluation helps separate common prostate enlargement from infection or more serious causes.",
  },
  {
    question: "Can urology problems be treated without surgery?",
    answer:
      "Many urology problems can be managed with medicines, lifestyle changes, observation, or small endoscopic procedures. Surgery is considered when symptoms, reports, stone size, blockage, cancer risk, or repeated infections make it necessary.",
  },
  {
    question: "What reports should I bring for a urology consultation?",
    answer:
      "Bring recent ultrasound, CT, MRI, urine tests, blood tests, PSA reports, biopsy reports, discharge summaries, and current medicines if available. If you do not have reports yet, the doctor can advise which tests are actually needed.",
  },
  {
    question: "How can I reduce the chance of kidney stones coming back?",
    answer:
      "Most patients are advised to increase water intake, reduce excess salt, avoid dehydration, and review diet based on stone type. Recurrent stones may need urine and blood evaluation so prevention can be personalized.",
  },
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
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div className={styles.faqItem} key={faq.question}>
              <button
                aria-expanded={isOpen}
                className={styles.faqButton}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{t(faq.question)}</span>
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
                  {t(faq.answer)}
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
  const title = t("Blogs | Dr. Vikram");
  const description = t("Read Dr. Vikram's latest guidance on treatment, recovery, and patient care.");

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        jsonLd={[
          pageGraph({ path: "/blogs", title, description, type: "CollectionPage" }),
          itemListGraph({
            path: "/blogs",
            name: "Urology blog articles",
            items: blogPosts.map((post) => post.title),
          }),
          faqGraph(faqs),
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
          ]),
        ]}
      />

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
