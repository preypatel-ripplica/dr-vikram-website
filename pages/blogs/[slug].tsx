import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { SeoHead } from "@/components/shared/SeoHead";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n-config";
import { withLocaleProps } from "@/lib/page-i18n.server";
import { getAllBlogs, getBlogBySlug, type BlogData } from "@/lib/blogs";
import { blogGraphs } from "@/lib/seo";
import { getAllTreatments, type TreatmentData } from "@/lib/treatments";
import styles from "@/styles/BlogDetailPage.module.css";

type BlogPageProps = {
  blog: BlogData;
  canonicalPath: string;
  locale: Locale;
  navTreatments: TreatmentData[];
};

// Sections always render in this fixed order in this template — the CMS's
// `sidebar.items` only supplies label text overrides, never order, so a
// misordered CMS entry can no longer put the sidebar out of sync with the
// actual section order on the page.
const BLOG_SECTION_ORDER: { href: string; defaultLabel: string }[] = [
  { href: "#overview", defaultLabel: "Overview" },
  { href: "#about", defaultLabel: "About the condition" },
  { href: "#size-guide", defaultLabel: "Size guide" },
  { href: "#treatment-options", defaultLabel: "Treatment options" },
  { href: "#symptom-check", defaultLabel: "Symptom check" },
  { href: "#experience", defaultLabel: "Our experience" },
  { href: "#faq", defaultLabel: "Common questions" },
];

function buildSidebarItems(blog: BlogData): BlogData["sidebar"]["items"] {
  const labelByHref = new Map(blog.sidebar.items.map((item) => [item.href, item.label]));

  return BLOG_SECTION_ORDER.map(({ href, defaultLabel }) => ({
    href,
    label: labelByHref.get(href) || defaultLabel,
  }));
}

function SectionLabel({ children }: { children: React.ReactNode }) {
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

function SectionHeading({
  eyebrow,
  title,
  highlight,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2>
        {title}
        {highlight ? (
          <>
            {" "}
            <span>{highlight}</span>
          </>
        ) : null}
      </h2>
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
          alt=""
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

function OverviewSection({ blog }: { blog: BlogData }) {
  return (
    <section className={styles.contentSection} id="about" data-node-id="135:10337">
      <SectionHeading
        eyebrow={blog.overview.eyebrow}
        highlight={blog.overview.highlight}
        title={blog.overview.titlePrefix}
      />

      <div className={styles.richText}>
        {blog.overview.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className={styles.articleSubsection}>
        <h3>{blog.overview.subheading}</h3>
        <div className={styles.richText}>
          {blog.overview.subParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function SizeGuideSection({ blog }: { blog: BlogData }) {
  return (
    <section className={styles.contentSection} id="size-guide" data-node-id="135:10349">
      <SectionHeading eyebrow={blog.sizeGuide.eyebrow} title={blog.sizeGuide.title} />

      <div className={styles.sizeGrid}>
        {blog.sizeGuide.items.map((item) => (
          <article className={styles.sizeCard} key={item.size}>
            <div className={styles.sizeCardHeader}>
              <span className={styles.sizeIcon}>
                <Image alt="" height={28} src={item.icon} width={28} />
              </span>
              <strong>{item.size}</strong>
            </div>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TreatmentOptionsSection({ blog }: { blog: BlogData }) {
  return (
    <section
      className={styles.contentSection}
      id="treatment-options"
      data-node-id="135:10395"
    >
      <SectionHeading
        eyebrow={blog.treatmentOptions.eyebrow}
        title={blog.treatmentOptions.title}
      />

      <div className={styles.optionList}>
        {blog.treatmentOptions.items.map((item) => (
          <article className={styles.optionCard} key={item.title}>
            <span className={styles.optionIcon}>
              <Image alt="" height={24} src={item.icon} width={24} />
            </span>
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <h3>{item.title}</h3>
                <span>{item.bestFor}</span>
                <span>{item.duration}</span>
              </div>
              <p>{item.copy}</p>
            </div>
          </article>
        ))}
      </div>

      <p className={styles.noteBox}>{blog.treatmentOptions.note}</p>
    </section>
  );
}

function SymptomChecker({ blog }: { blog: BlogData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const currentStep = blog.symptomCheck.steps[activeStep];
  const isFinalStep = activeStep === blog.symptomCheck.steps.length - 1;
  const selectedAnswer = answers[activeStep];
  const progress = `${((activeStep + 1) / blog.symptomCheck.steps.length) * 100}%`;

  function startOver() {
    setActiveStep(0);
    setAnswers({});
  }

  function chooseOption(option: string) {
    setAnswers((current) => ({ ...current, [activeStep]: option }));
  }

  function continueGuide() {
    if (!selectedAnswer) return;

    if (isFinalStep) {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setActiveStep((step) => step + 1);
  }

  return (
    <section className={styles.symptomSection} id="symptom-check" data-node-id="135:10449">
      <SectionHeading eyebrow={blog.symptomCheck.eyebrow} title={blog.symptomCheck.title} />

      <div className={styles.symptomPanel}>
        <div className={styles.symptomCard}>
          <div className={styles.symptomMeta}>
            <span>
              Step {activeStep + 1} of {blog.symptomCheck.steps.length}
            </span>
            <button onClick={startOver} type="button">
              Start over
            </button>
          </div>
          <div className={styles.symptomProgress}>
            <span style={{ width: progress }} />
          </div>

          <div className={styles.symptomBody}>
            <h3>{currentStep.question}</h3>
            <div className={styles.symptomOptions}>
              {currentStep.options.map((option) => (
                <button
                  aria-pressed={selectedAnswer === option}
                  className={selectedAnswer === option ? styles.selectedSymptomOption : ""}
                  key={option}
                  onClick={() => chooseOption(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.continueButton}
            disabled={!selectedAnswer}
            onClick={continueGuide}
            type="button"
          >
            {isFinalStep ? "Book appointment" : "Continue"}
          </button>
        </div>
      </div>

      <p className={styles.smallNote}>{blog.symptomCheck.note}</p>
    </section>
  );
}

function ExperienceSection({ blog }: { blog: BlogData }) {
  return (
    <section className={styles.contentSection} id="experience" data-node-id="135:10491">
      <SectionHeading eyebrow={blog.experience.eyebrow} title={blog.experience.title} />

      <div className={styles.richText}>
        {blog.experience.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className={styles.articleSubsection}>
        <h3>{blog.experience.subheading}</h3>
        <div className={styles.richText}>
          {blog.experience.subParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className={styles.experienceCard}>
        <div className={styles.experienceImage}>
          <Image
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 916px"
            src={blog.experience.image}
          />
        </div>
        <blockquote>{blog.experience.quote}</blockquote>
        <p>{blog.experience.byline}</p>
      </div>

      <div className={styles.statsGrid}>
        {blog.experience.stats.map((stat) => (
          <article className={styles.statCard} key={stat.label}>
            <span className={styles.statIcon}>
              <Image alt="" height={20} src={stat.icon} width={20} />
            </span>
            <div>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ blog }: { blog: BlogData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection} id="faq" data-node-id="135:10546">
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
              {isOpen ? <p>{item.answer}</p> : null}
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
        title={`${blog.title} | Dr. Vikram`}
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
            <section className={styles.overviewAnchor} id="overview" />
            <OverviewSection blog={blog} />
            <SizeGuideSection blog={blog} />
            <TreatmentOptionsSection blog={blog} />
            <SymptomChecker blog={blog} />
            <ExperienceSection blog={blog} />
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
  const [blog, navTreatments] = await Promise.all([getBlogBySlug(slug), getAllTreatments()]);

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
