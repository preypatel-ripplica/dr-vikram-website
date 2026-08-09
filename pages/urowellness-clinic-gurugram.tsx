import type { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipboardCheck, FileSearch, HeartPulse, MapPin, Stethoscope } from "lucide-react";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import {
  CLINIC_EMAIL,
  CLINIC_FULL_ADDRESS,
  CLINIC_MAP_URL,
  CLINIC_NAME,
  CLINIC_PUBLIC_PHONE,
  CLINIC_TIMING,
  clinicPageGraphs,
  faqGraph,
  itemListGraph,
} from "@/lib/seo";
import { getAllTreatments, type TreatmentData } from "@/lib/treatments";
import styles from "@/styles/UrowellnessClinicPage.module.css";

export const getStaticProps: GetStaticProps<{
  navTreatments: TreatmentData[];
}> = async () => {
  return { props: { navTreatments: await getAllTreatments() } };
};

const pagePath = "/urowellness-clinic-gurugram";
const title = "Urowellness Clinic Gurugram | Urology Clinic in Sector 49";
const description =
  "Visit Urowellness Clinic in Sector 49, Gurugram for urology consultation with Dr. Vikram Barua. Care for kidney stones, prostate problems, urinary symptoms, men's health, and urological cancer concerns.";

const conditions = [
  "Kidney stones",
  "Prostate problems",
  "Urinary symptoms",
  "UTI treatment",
  "Men's health concerns",
  "Urological cancer evaluation",
  "Bladder problems",
  "Robotic urology consultation",
];

const reasons = [
  {
    Icon: Stethoscope,
    title: "Focused urology consultation",
    copy: "Urowellness Clinic is built around urology care in Gurugram, with consultation for kidney stones, prostate problems, urinary symptoms, men's health concerns, and cancer evaluation.",
  },
  {
    Icon: FileSearch,
    title: "Reports reviewed clearly",
    copy: "Symptoms, prior prescriptions, scans, and lab reports are reviewed before a treatment plan is explained in plain language.",
  },
  {
    Icon: HeartPulse,
    title: "Clinic care with hospital backup",
    copy: "Consultations happen at Urowellness Clinic in Sector 49, while procedures that need hospital care are planned through Dr. Vikram Barua Kaushik's hospital practice.",
  },
];

const journey = [
  "Consultation and symptom review",
  "Report and scan assessment",
  "Diagnosis and treatment planning",
  "Procedure guidance if needed",
  "Follow-up and recovery advice",
];

const faqs = [
  {
    question: "Where is Urowellness Clinic in Gurugram?",
    answer: CLINIC_FULL_ADDRESS,
  },
  {
    question: "What are the Urowellness Clinic timings?",
    answer: `${CLINIC_NAME} is open ${CLINIC_TIMING}. Appointments are recommended before visiting.`,
  },
  {
    question: "Which urology concerns are seen at Urowellness Clinic?",
    answer:
      "Patients visit for kidney stones, prostate problems, urinary symptoms, UTI treatment, bladder concerns, men's health concerns, and urological cancer evaluation.",
  },
  {
    question: "How can I book an appointment at Urowellness Clinic?",
    answer: `Call ${CLINIC_PUBLIC_PHONE}, email ${CLINIC_EMAIL}, or use the appointment form on this page.`,
  },
];

function ShieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image alt="" fill sizes="20px" src="/assets/icons/figma-shield-plus.svg" />
      </span>
      <span>{children}</span>
    </p>
  );
}

function ClinicHero() {
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <ShieldLabel>{t("Urowellness Clinic Gurugram")}</ShieldLabel>
        <h1>{t("Urowellness Clinic, Sector 49, Gurugram")}</h1>
        <p>
          {t(
            "Urology clinic in Gurugram for kidney stones, prostate problems, urinary symptoms, UTI treatment, men's health concerns, and robotic urology consultation with Dr. Vikram Barua Kaushik.",
          )}
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href={localizeHref("#contact")}>
            {t("Book appointment")}
          </a>
          <a
            className={styles.secondaryAction}
            href={CLINIC_MAP_URL}
            rel="noreferrer"
            target="_blank"
          >
            <MapPin aria-hidden="true" />
            {t("Open maps")}
          </a>
        </div>
      </div>
      <div className={styles.heroImage}>
        <Image
          alt="Urowellness Clinic Sector 49 Gurugram"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 560px"
          src="/images/Clinic.webp"
        />
      </div>
    </section>
  );
}

function AboutClinicSection() {
  const { t } = useI18n();

  return (
    <section className={styles.aboutSection}>
      <div className={styles.sectionHeader}>
        <ShieldLabel>{t("About the clinic")}</ShieldLabel>
        <h2>{t("Urowellness Clinic brings focused urology care to Sector 49")}</h2>
      </div>
      <div className={styles.aboutGrid}>
        <p>
          {t(
            "Urowellness Clinic is located at Eros City Square Mall, Rosewood City, Sector 49, Gurugram. Dr. Vikram Barua Kaushik sees patients here for common and complex urology concerns, from kidney stone pain and prostate symptoms to recurrent urinary infections and men's health issues.",
          )}
        </p>
        <p>
          {t(
            "The consultation is designed around clarity: symptoms are mapped, reports are reviewed, and next steps are explained before treatment begins. When surgery or advanced care is needed, patients are guided through appropriate hospital-based options.",
          )}
        </p>
      </div>
    </section>
  );
}

function ConditionsSection() {
  const { t } = useI18n();

  return (
    <section className={styles.conditionsSection}>
      <div className={styles.sectionHeader}>
        <ShieldLabel>{t("Conditions treated")}</ShieldLabel>
        <h2>{t("Urology concerns seen at Urowellness Clinic")}</h2>
      </div>
      <div className={styles.conditionGrid}>
        {conditions.map((condition) => (
          <article className={styles.conditionCard} key={condition}>
            <ClipboardCheck aria-hidden="true" />
            <h3>{t(condition)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function WhyVisitSection() {
  const { t } = useI18n();

  return (
    <section className={styles.whySection}>
      <div className={styles.sectionHeader}>
        <ShieldLabel>{t("Why patients visit")}</ShieldLabel>
        <h2>{t("Clear consultation for urology care in Gurugram")}</h2>
      </div>
      <div className={styles.reasonGrid}>
        {reasons.map(({ Icon, title: reasonTitle, copy }) => (
          <article className={styles.reasonCard} key={reasonTitle}>
            <span className={styles.reasonIcon}>
              <Icon aria-hidden="true" />
            </span>
            <h3>{t(reasonTitle)}</h3>
            <p>{t(copy)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DoctorSection() {
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.doctorSection}>
      <div className={styles.doctorImage}>
        <Image
          alt="Dr. Vikram Barua Kaushik urologist at Urowellness Clinic Gurugram"
          fill
          sizes="(max-width: 900px) 100vw, 480px"
          src="/images/DSC_0138.webp"
        />
      </div>
      <div className={styles.doctorContent}>
        <ShieldLabel>{t("Doctor profile")}</ShieldLabel>
        <h2>{t("Dr. Vikram Barua Kaushik")}</h2>
        <p>{t("Urologist & Robotic Surgeon")}</p>
        <p>
          {t(
            "Dr. Vikram Barua Kaushik provides consultation at Urowellness Clinic for kidney stones, prostate health, urinary symptoms, male infertility, erectile dysfunction, and robotic urology planning.",
          )}
        </p>
        <Link className={styles.textLink} href={localizeHref("/about-us")}>
          {t("Read doctor profile")}
        </Link>
      </div>
    </section>
  );
}

function VisitDetailsSection() {
  const { t } = useI18n();

  return (
    <section className={styles.visitSection}>
      <div className={styles.visitDetails}>
        <ShieldLabel>{t("Clinic address")}</ShieldLabel>
        <h2>{t("Visit Urowellness Clinic in Sector 49, Gurugram")}</h2>
        <dl>
          <div>
            <dt>{t("Address")}</dt>
            <dd>{CLINIC_FULL_ADDRESS}</dd>
          </div>
          <div>
            <dt>{t("Timing")}</dt>
            <dd>{CLINIC_TIMING}</dd>
          </div>
          <div>
            <dt>{t("Phone")}</dt>
            <dd>
              <a href="tel:+919871008256">{CLINIC_PUBLIC_PHONE}</a>
            </dd>
          </div>
          <div>
            <dt>{t("Email")}</dt>
            <dd>
              <a href={`mailto:${CLINIC_EMAIL}`}>{CLINIC_EMAIL}</a>
            </dd>
          </div>
        </dl>
        <a className={styles.mapButton} href={CLINIC_MAP_URL} rel="noreferrer" target="_blank">
          <MapPin aria-hidden="true" />
          {t("Get directions on Google Maps")}
        </a>
      </div>
      <div className={styles.journeyCard}>
        <ShieldLabel>{t("Patient journey")}</ShieldLabel>
        <ol>
          {journey.map((step) => (
            <li key={step}>{t(step)}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FaqSection() {
  const { t } = useI18n();

  return (
    <section className={styles.faqSection}>
      <div className={styles.sectionHeader}>
        <ShieldLabel>{t("FAQs")}</ShieldLabel>
        <h2>{t("Urowellness Clinic questions")}</h2>
      </div>
      <div className={styles.faqList}>
        {faqs.map((faq) => (
          <details className={styles.faqItem} key={faq.question}>
            <summary>{t(faq.question)}</summary>
            <p>{t(faq.answer)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function UrowellnessClinicPage() {
  return (
    <>
      <SeoHead
        canonicalPath={pagePath}
        description={description}
        image="/images/Clinic.webp"
        jsonLd={[
          ...clinicPageGraphs({ title, description, path: pagePath }),
          faqGraph(faqs),
          itemListGraph({
            path: pagePath,
            name: "Urowellness Clinic urology services",
            items: conditions,
          }),
        ]}
        title={title}
      />
      <main className={styles.clinicPage}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.hero,
            styles.aboutSection,
            styles.conditionsSection,
            styles.whySection,
            styles.doctorSection,
            styles.visitSection,
            styles.faqSection,
            styles.sharedAppointment,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <ClinicHero />
        <AboutClinicSection />
        <ConditionsSection />
        <WhyVisitSection />
        <DoctorSection />
        <VisitDetailsSection />
        <FaqSection />
        <div className={styles.sharedAppointment}>
          <AppointmentSection
            eyebrow="Urowellness Clinic appointments"
            title="Book a urology consultation in Sector 49, Gurugram"
          />
        </div>
      </main>
    </>
  );
}
