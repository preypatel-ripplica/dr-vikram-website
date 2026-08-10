import type { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bot, Building2, HeartHandshake, Stethoscope } from "lucide-react";
import { TestimonialsSection as HomeTestimonialsSection } from "@/components/home/TestimonialsSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { getAllTreatments, getTreatmentNavItems, type TreatmentData, type TreatmentNavItem } from "@/lib/treatments";
import {
  breadcrumbGraph,
  faqGraph,
  itemListGraph,
  pageGraph,
} from "@/lib/seo";
import styles from "@/styles/AboutPage.module.css";

const stats = [
  { value: "10K+", label: "Happy patients" },
  { value: "5K+", label: "Successful treatments" },
  { value: "20+", label: "Years of experience" },
];

const whyChooseUs = [
  {
    Icon: Stethoscope,
    title: "Comprehensive urology care",
    copy: "From kidney stones to prostate health and urinary symptoms, every case gets a full work-up before any treatment is planned.",
  },
  {
    Icon: Bot,
    title: "Robotic & minimally invasive expertise",
    copy: "Robotic and laparoscopic techniques are used where they help, reducing pain, blood loss, and recovery time.",
  },
  {
    Icon: HeartHandshake,
    title: "Patient-first approach",
    copy: "Every consultation starts with listening. Treatment plans are explained clearly, in the patient's own language.",
  },
  {
    Icon: Building2,
    title: "Hospital-backed practice",
    copy: "Consultations at Urowellness Clinic, with surgical care at Shalby International Hospitals, Gurugram.",
  },
];

const faqs = [
  {
    question: "Who is Dr. Vikram Barua Kaushik?",
    answer:
      "Dr. Vikram Barua Kaushik is a Gurugram-based urologist and robotic surgeon who runs Urowellness Clinic and consults on urology cases at Shalby International Hospitals. His practice focuses on kidney stones, prostate problems, urinary symptoms, urological cancer, and robotic surgery planning.",
  },
  {
    question: "What conditions does Dr. Vikram Barua Kaushik treat at Urowellness Clinic?",
    answer:
      "Dr. Vikram Barua Kaushik treats kidney stones, prostate problems, bladder problems, male infertility, erectile dysfunction, urinary tract infections, urethral stricture, and urological cancer, with both medical and surgical treatment options.",
  },
  {
    question: "Where is Urowellness Clinic located?",
    answer:
      "Urowellness Clinic is on the 1st floor of Eros City Square Mall, Sector 49, Gurugram, Haryana. Surgical cases are managed at Shalby International Hospitals, Golf Course Road, Sector 53, Gurugram.",
  },
  {
    question: "Does Dr. Vikram Barua Kaushik perform robotic surgery?",
    answer:
      "Yes. Dr. Vikram Barua Kaushik plans and performs robotic and minimally invasive surgery for suitable urology cases, alongside conventional surgical options where appropriate.",
  },
  {
    question: "How do I book an appointment with Dr. Vikram Barua Kaushik?",
    answer:
      "You can book an appointment by calling or messaging +91 98710 08256, emailing drvikram.uro@gmail.com, or using the appointment form on the contact page.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image alt="" fill sizes="20px" src="/assets/icons/figma-shield-plus.svg" />
      </span>
      <span>{children}</span>
    </p>
  );
}

function AboutHero() {
  const { t } = useI18n();

  return (
    <section className={styles.hero}>
      <div className={styles.heroHeading}>
        <SectionLabel>{t("About us")}</SectionLabel>
        <div className={styles.heroText}>
          <h1>
            {t("Dr. Vikram Barua Kaushik")}: {t("Urologist & Robotic Surgeon, Urowellness Clinic")}
          </h1>
          <p>
            {t(
              "Gurugram-based urology specialist known for patient-first care in kidney stones, prostate health, urinary symptoms, and robotic surgery, at Urowellness Clinic and Shalby International Hospitals.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function BioSection() {
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.bioSection}>
      <div className={styles.bioImage}>
        <Image
          alt="Dr. Vikram Barua Kaushik, Urologist and Robotic Surgeon at Urowellness Clinic"
          fill
          sizes="(max-width: 900px) 100vw, 560px"
          src="/images/DSC_0138.webp"
        />
      </div>

      <div className={styles.bioContent}>
        <SectionLabel>{t("Meet the doctor")}</SectionLabel>
        <h2>{t("About Dr. Vikram Barua Kaushik")}</h2>
        <p>
          {t(
            "Dr. Vikram Barua Kaushik is the urologist and robotic surgeon behind Urowellness Clinic in Gurugram, treating kidney stones, prostate problems, urinary symptoms, urological cancer, male infertility, and erectile dysfunction.",
          )}
        </p>
        <p>
          {t(
            "Consultations are patient-first: every visit starts with a clear review of symptoms and reports, followed by a treatment plan explained in plain language, not just a diagnosis. Where surgery is needed, robotic and minimally invasive options are used wherever they benefit the patient, with procedures carried out at Shalby International Hospitals, Gurugram.",
          )}
        </p>

        <div className={styles.statsRow}>
          {stats.map((stat) => (
            <article className={styles.statCard} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{t(stat.label)}</span>
            </article>
          ))}
        </div>

        <a className={styles.bioButton} href={localizeHref("/contact-us")}>
          {t("Book a consultation")}
        </a>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const { t } = useI18n();

  return (
    <section className={styles.whyChooseSection}>
      <div className={styles.whyChooseHeader}>
        <SectionLabel>{t("Why choose us")}</SectionLabel>
        <h2>{t("Why patients choose Urowellness Clinic")}</h2>
      </div>

      <div className={styles.whyChooseGrid}>
        {whyChooseUs.map(({ Icon, title, copy }) => (
          <article className={styles.whyChooseCard} key={title}>
            <span className={styles.whyChooseIcon}>
              <Icon aria-hidden="true" strokeWidth={2} />
            </span>
            <h3>{t(title)}</h3>
            <p>{t(copy)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExpertiseSection({ treatments }: { treatments: TreatmentData[] }) {
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.expertiseSection}>
      <div className={styles.expertiseHeader}>
        <SectionLabel>{t("Areas of expertise")}</SectionLabel>
        <h2>{t("Urology conditions Dr. Vikram Barua Kaushik treats")}</h2>
      </div>

      <div className={styles.expertiseGrid}>
        {treatments.map((treatment) => (
          <Link
            className={styles.expertiseCard}
            href={localizeHref(`/treatments/${treatment.slug}`)}
            key={treatment.slug}
          >
            <h3>{t(treatment.hero.title)}</h3>
            <p>{t(treatment.hero.summary)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqHeader}>
        <SectionLabel>{t("FAQs")}</SectionLabel>
        <h2>{t("Common questions")}</h2>
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
                  src="/assets/figma/patient-support/faq-chevron.svg"
                  width={18}
                />
              </button>
              {isOpen ? <p className={styles.faqAnswer}>{t(faq.answer)}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps<{
  treatments: TreatmentData[];
  navTreatments: TreatmentNavItem[];
}> = async () => {
  const [treatments, navTreatments] = await Promise.all([getAllTreatments(), getTreatmentNavItems()]);
  return { props: { treatments, navTreatments } };
};

export default function AboutUsPage({ treatments }: { treatments: TreatmentData[] }) {
  const title = "About Dr. Vikram Barua Kaushik | Urowellness Clinic";
  const description =
    "Meet Dr. Vikram Barua Kaushik, urologist and robotic surgeon at Urowellness Clinic, Gurugram, with expert care for kidney stones, prostate, and urinary health.";

  return (
    <>
      <SeoHead
        description={description}
        jsonLd={[
          pageGraph({ path: "/about-us", title, description, type: "AboutPage" }),
          faqGraph(faqs),
          itemListGraph({
            path: "/about-us",
            name: "Urology conditions treated",
            items: treatments.map((treatment) => treatment.hero.title),
          }),
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about-us" },
          ]),
        ]}
        title={title}
      />
      <main className={styles.aboutPage}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.hero,
            styles.bioSection,
            styles.whyChooseSection,
            styles.expertiseSection,
            styles.faqSection,
            styles.homeTestimonialsWrap,
            styles.sharedAppointment,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <AboutHero />
        <BioSection />
        <WhyChooseSection />
        <ExpertiseSection treatments={treatments} />
        <FaqSection />
        <div className={styles.homeTestimonialsWrap}>
          <HomeTestimonialsSection />
        </div>
        <div className={styles.sharedAppointment}>
          <AppointmentSection />
        </div>
      </main>
    </>
  );
}
