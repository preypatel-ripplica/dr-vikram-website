import type { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { Bot, ClipboardCheck, MessagesSquare } from "lucide-react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { RoboticMovementToggle } from "@/components/home/RoboticMovementToggle";
import { RoboticVisionComparison } from "@/components/home/RoboticVisionComparison";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { SymptomGuide } from "@/components/home/SymptomGuide";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TreatmentsCarousel } from "@/components/home/TreatmentsCarousel";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { LocalizedHighlight } from "@/components/shared/LocalizedHighlight";
import { breadcrumbGraph, itemListGraph, pageGraph } from "@/lib/seo";
import { getAllTreatments, type TreatmentData } from "@/lib/treatments";
import styles from "@/styles/Home.module.css";

export const getStaticProps: GetStaticProps<{ navTreatments: TreatmentData[] }> = async () => {
  return { props: { navTreatments: await getAllTreatments() } };
};

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

export default function Home() {
  const { t, localizeHref } = useI18n();
  const title = t("Dr. Vikram | Urology & Robotic Surgery");
  const description = t("Specialist urology consultation for kidney stones, prostate care, urinary health, and robotic surgery.");

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        jsonLd={[
          pageGraph({ path: "/", title, description }),
          itemListGraph({
            path: "/",
            name: "Urology services",
            items: [
              "Kidney stones",
              "Prostate problems",
              "Urinary symptoms",
              "Urological cancer",
              "Robotic surgery planning",
            ],
          }),
          breadcrumbGraph([{ name: "Home", path: "/" }]),
        ]}
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
          <SectionLabel>{t("Advanced urology clinic")}</SectionLabel>
          <div className={styles.heroText}>
            <LocalizedHighlight
              as="h1"
              highlight="patient first"
              source="Urology and patient first consultation"
            />
            <p>
              {t("Personalised urology care for kidney stones, prostate concerns, urinary symptoms, cancer evaluation, and robotic surgery planning.")}
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
              alt="Dr. Vikram"
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
          <SectionLabel>{t("About us")}</SectionLabel>
          <LocalizedHighlight
            as="h2"
            highlight="urology specialists"
            source="Our dedicated medical team highly experienced doctors and urology specialists committed to your unique health journey with our patient first approach."
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
                  alt="Dr. Vikram"
                  fill
                  sizes="625px"
                  src="/images/DSC_0138.webp"
                />
              </div>

              <article className={styles.expertProfileCard}>
                <div className={styles.expertProfileText}>
                  <div className={styles.expertNameBlock}>
                    <h3>Dr. Vikram</h3>
                    <p>{t("Urologist & Robotic Surgeon")}</p>
                  </div>
                  <p>
                    {t("Dr. Vikram provides focused care for kidney stones, prostate concerns, urinary symptoms, urological cancer, and robotic surgery.")}
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
