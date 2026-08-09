import type { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Bot, ClipboardCheck, MapPin, MessagesSquare } from "lucide-react";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { LocalizedHighlight } from "@/components/shared/LocalizedHighlight";
import {
  CLINIC_FULL_ADDRESS,
  CLINIC_MAP_URL,
  CLINIC_TIMING,
  DOCTOR_NAME,
  SOCIAL_IMAGE,
  absoluteUrl,
  identityGraphItems,
} from "@/lib/seo";
import { getAllTreatments, type TreatmentData } from "@/lib/treatments";
import styles from "@/styles/Home.module.css";

const TreatmentsCarousel = dynamic(
  () => import("@/components/home/TreatmentsCarousel").then((mod) => mod.TreatmentsCarousel),
  { loading: () => <DeferredSection className={styles.treatmentsSection} />, ssr: false },
);
const SymptomGuide = dynamic(
  () => import("@/components/home/SymptomGuide").then((mod) => mod.SymptomGuide),
  { loading: () => <DeferredSection className={styles.symptomGuideSection} />, ssr: false },
);
const RoboticVisionComparison = dynamic(
  () =>
    import("@/components/home/RoboticVisionComparison").then(
      (mod) => mod.RoboticVisionComparison,
    ),
  { loading: () => <DeferredSection className={styles.roboticVisionSection} />, ssr: false },
);
const RoboticMovementToggle = dynamic(
  () =>
    import("@/components/home/RoboticMovementToggle").then((mod) => mod.RoboticMovementToggle),
  { loading: () => <DeferredSection className={styles.roboticMovementSection} />, ssr: false },
);
const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection").then((mod) => mod.TestimonialsSection),
  { loading: () => <DeferredSection className={styles.testimonialsSection} />, ssr: false },
);
const AppointmentSection = dynamic(
  () => import("@/components/shared/AppointmentSection").then((mod) => mod.AppointmentSection),
  { loading: () => <DeferredSection className={styles.finalCtaSection} />, ssr: false },
);
const FinalCtaSection = dynamic(
  () => import("@/components/home/FinalCtaSection").then((mod) => mod.FinalCtaSection),
  { loading: () => <DeferredSection className={styles.finalCtaSection} />, ssr: false },
);

export const getStaticProps: GetStaticProps<{
  disableIdentityGraph: boolean;
  navTreatments: TreatmentData[];
}> = async () => {
  return { props: { disableIdentityGraph: true, navTreatments: await getAllTreatments() } };
};

const homeSeoTitle = "Dr. Vikram Barua Kaushik | Urologist & Robotic Surgeon";
const homeSeoDescription =
  "Dr. Vikram Barua Kaushik provides specialist urology care with clear diagnosis, personalised treatment planning, minimally invasive procedures and robotic surgery.";
const homeSocialDescription =
  "Advanced urology, minimally invasive treatment and robotic surgery with a patient-first approach.";

function homepageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...identityGraphItems(),
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/")}#webpage`,
        url: absoluteUrl("/"),
        name: homeSeoTitle,
        headline: DOCTOR_NAME,
        description: homeSeoDescription,
        isPartOf: {
          "@id": `${absoluteUrl("/")}#website`,
        },
        about: {
          "@id": `${absoluteUrl("/")}#doctor`,
        },
        provider: {
          "@id": `${absoluteUrl("/")}#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: SOCIAL_IMAGE,
        },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${absoluteUrl("/")}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
        ],
      },
    ],
  };
}

function ShieldPlusIcon() {
  return (
    <svg aria-hidden="true" className={styles.icon} fill="none" viewBox="0 0 20 20">
      <path
        d="M10 2.25L16.25 4.75V9.5C16.25 13.25 13.73 16.73 10 17.75C6.27 16.73 3.75 13.25 3.75 9.5V4.75L10 2.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path
        d="M10 6.75V12.75M7 9.75H13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <ShieldPlusIcon />
      <span>{children}</span>
    </p>
  );
}

function DeferredSection({ className }: { className: string }) {
  return <section aria-hidden="true" className={`${className} ${styles.deferredSection}`} />;
}

function ClinicSpotlightSection() {
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.clinicSection}>
      <div className={styles.clinicImage}>
        <Image
          alt="Urowellness Clinic Sector 49 Gurugram"
          fill
          sizes="(max-width: 900px) 100vw, 560px"
          src="/images/Clinic.webp"
        />
      </div>
      <div className={styles.clinicContent}>
        <SectionLabel>{t("Urowellness Clinic Gurugram")}</SectionLabel>
        <h2>{t("Urology clinic in Sector 49, Gurugram")}</h2>
        <p>
          {t(
            "Visit Urowellness Clinic at Eros City Square Mall, Rosewood City, for kidney stone consultation, prostate problems, urinary symptoms, UTI treatment, men's health concerns, and robotic urology guidance.",
          )}
        </p>
        <div className={styles.clinicMeta}>
          <p>
            <MapPin aria-hidden="true" />
            <span>{CLINIC_FULL_ADDRESS}</span>
          </p>
          <p>
            <ClockIcon />
            <span>{CLINIC_TIMING}</span>
          </p>
        </div>
        <div className={styles.clinicActions}>
          <a className={styles.primaryAction} href={localizeHref("/urowellness-clinic-gurugram")}>
            {t("Explore clinic")}
          </a>
          <a
            className={styles.secondaryAction}
            href={CLINIC_MAP_URL}
            rel="noreferrer"
            target="_blank"
          >
            {t("Open maps")}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, localizeHref, locale } = useI18n();
  const isDefaultLocale = locale === "en";

  return (
    <>
      <SeoHead
        canonicalPath={isDefaultLocale ? "/" : undefined}
        description={homeSeoDescription}
        image={SOCIAL_IMAGE}
        jsonLd={isDefaultLocale ? homepageGraph() : null}
        socialDescription={homeSocialDescription}
        title={homeSeoTitle}
      />
      <Head>
        <link
          as="image"
          fetchPriority="high"
          href="/images/hero-combined-mobile.webp"
          media="(max-width: 700px)"
          rel="preload"
          type="image/webp"
        />
        <link
          as="image"
          fetchPriority="high"
          href="/images/hero-combined-desktop.webp"
          media="(min-width: 701px)"
          rel="preload"
          type="image/webp"
        />
      </Head>

      <main className={styles.homePage}>
        <ScrollReveal />
        <section className={styles.hero} data-faulty-node-skipped="64:20363">
        <div className={styles.heroCopy}>
          <SectionLabel>{t("Urowellness Clinic")}</SectionLabel>
          <div className={styles.heroText}>
            <LocalizedHighlight
              as="h1"
              highlight="patient-first urology care"
              source="Dr. Vikram Barua Kaushik: patient-first urology care"
            />
            <p>
              {t("Specialist urology care in Gurugram for kidney stones, prostate concerns, urinary symptoms, cancer evaluation, and robotic surgery planning.")}
            </p>
          </div>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href={localizeHref("#contact")}>
              {t("Book appointment")}
            </a>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <picture>
            <source media="(min-width: 701px)" srcSet="/images/hero-combined-desktop.webp" type="image/webp" />
            <img
              alt=""
              decoding="sync"
              fetchPriority="high"
              height={720}
              src="/images/hero-combined-mobile.webp"
              width={675}
            />
          </picture>
        </div>
      </section>

      <section className={styles.aboutSection} data-node-id="64:21895">
        <div className={styles.aboutCopy} data-node-id="64:21896">
          <div className={styles.aboutHeadingGroup} data-node-id="64:21897">
          <SectionLabel>{t("About Urowellness Clinic")}</SectionLabel>
          <LocalizedHighlight
            as="h2"
            highlight="Urowellness Clinic"
            source="Urowellness Clinic brings focused urology care to your kidney, prostate, bladder and urinary health journey."
          />
          </div>
          <a className={styles.aboutButton} href={localizeHref("#contact")}>
            {t("Know more")}
          </a>
        </div>

        <div className={styles.aboutStats} data-node-id="64:21904">
          <div className={styles.aboutStatsColumn}>
            <article className={`${styles.aboutStatCard} ${styles.aboutHappy}`}>
              <strong>10K+</strong>
              <span>{t("Happy patients")}</span>
            </article>
            <article className={`${styles.aboutStatCard} ${styles.aboutTreatments}`}>
              <strong>5K+</strong>
              <span>{t("Successful treatments")}</span>
            </article>
          </div>
          <div className={styles.aboutStatsColumn}>
            <div className={styles.aboutDoctorImage}>
              <Image
                alt={t("Medical team consulting with a patient")}
                fill
                sizes="281px"
                src="/assets/figma/about/about-us-consultation.webp"
              />
            </div>
            <article className={`${styles.aboutStatCard} ${styles.aboutExperience}`}>
              <strong>20+</strong>
              <span>{t("Years of experience")}</span>
            </article>
          </div>
        </div>
      </section>

      <ClinicSpotlightSection />

      <section className={styles.expertsSection} data-node-id="64:21918">
        <div className={styles.expertsInner}>
          <div className={styles.expertsHeader}>
            <SectionLabel>{t("Meet our experts")}</SectionLabel>
            <h2>{t("Best in class team of doctors")}</h2>
          </div>

          <div className={styles.expertsContent}>
            <div className={styles.expertTopRow}>
              <div className={styles.expertImageCard}>
                <Image
                  alt="Dr. Vikram Barua Kaushik, urologist and robotic surgeon"
                  fill
                  sizes="625px"
                  src="/images/DSC_0138.webp"
                />
              </div>

              <article className={styles.expertProfileCard}>
                <div className={styles.expertProfileText}>
                  <div className={styles.expertNameBlock}>
                    <h3>{t("Dr. Vikram Barua Kaushik")}</h3>
                    <p>{t("Urologist & Robotic Surgeon")}</p>
                  </div>
                  <p>
                    {t("Dr. Vikram provides clear, patient-first consultation for kidney stones, prostate concerns, urinary symptoms, urological cancer, and robotic surgery planning.")}
                  </p>
                </div>
                <div className={styles.expertChecks}>
                  <p>
                    <CheckIcon />
                    <span>{t("Patient-first urology consultation and report review")}</span>
                  </p>
                  <p>
                    <CheckIcon />
                    <span>
                      {t("Robotic and minimally invasive treatment planning.")}
                    </span>
                  </p>
                </div>
              </article>
            </div>

            <div className={styles.expertFeatureGrid}>
              <ExpertFeature
                Icon={ClipboardCheck}
                title="Accurate Diagnosis"
                copy="Report review and symptom mapping"
              />
              <ExpertFeature
                Icon={Bot}
                title="Robotic Expertise"
                copy="Separate route for robotic surgery"
              />
              <ExpertFeature
                Icon={MessagesSquare}
                title="Clear Communication"
                copy="Patient-first consultation flow"
              />
            </div>
          </div>
        </div>
      </section>

      <TreatmentsCarousel />
      <SymptomGuide />
      <RoboticVisionComparison />
      <RoboticMovementToggle />
      <TestimonialsSection />
        <AppointmentSection />
        <FinalCtaSection />
      </main>
    </>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 11.08V12a9 9 0 1 1-5.34-8.23"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 4L12 14.01L9 11.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.75V12L15 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ExpertFeature({
  Icon,
  title,
  copy,
}: {
  Icon: typeof ClipboardCheck;
  title: string;
  copy: string;
}) {
  const { t } = useI18n();

  return (
    <article className={styles.expertFeatureCard}>
      <span className={styles.expertFeatureIcon}>
        <Icon aria-hidden="true" strokeWidth={2} />
      </span>
      <div>
        <h3>{t(title)}</h3>
        <p>{t(copy)}</p>
      </div>
    </article>
  );
}
