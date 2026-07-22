import type { GetStaticProps } from "next";
import { useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { breadcrumbGraph, itemListGraph, pageGraph } from "@/lib/seo";
import { getAllTreatments, type TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentJourneyPage.module.css";

export const getStaticProps: GetStaticProps<{ navTreatments: TreatmentData[] }> = async () => {
  return { props: { navTreatments: await getAllTreatments() } };
};

const icons = {
  consultation:
    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4992 1.80005H8.09922C7.60216 1.80005 7.19922 2.20299 7.19922 2.70005V4.50005C7.19922 4.99711 7.60216 5.40005 8.09922 5.40005H13.4992C13.9963 5.40005 14.3992 4.99711 14.3992 4.50005V2.70005C14.3992 2.20299 13.9963 1.80005 13.4992 1.80005Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.3996 3.60004H16.1996C16.677 3.60004 17.1348 3.78968 17.4724 4.12724C17.81 4.46481 17.9996 4.92265 17.9996 5.40004V18C17.9996 18.4774 17.81 18.9353 17.4724 19.2728C17.1348 19.6104 16.677 19.8 16.1996 19.8H5.39961C4.92222 19.8 4.46438 19.6104 4.12682 19.2728C3.78925 18.9353 3.59961 18.4774 3.59961 18V5.40004C3.59961 4.92265 3.78925 4.46481 4.12682 4.12724C4.46438 3.78968 4.92222 3.60004 5.39961 3.60004H7.19961" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.8008 9.90002H14.4008M10.8008 14.4H14.4008M7.19922 9.90002H7.20859M7.19922 14.4H7.20859" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  diagnosis:
    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.69922 6.30007V4.50007C2.69922 4.02268 2.88886 3.56485 3.22643 3.22728C3.56399 2.88972 4.02183 2.70007 4.49922 2.70007H6.29922M15.3008 2.70007H17.1008C17.5782 2.70007 18.036 2.88972 18.3736 3.22728C18.7111 3.56485 18.9008 4.02268 18.9008 4.50007V6.30007M18.9008 15.3V17.1C18.9008 17.5774 18.7111 18.0353 18.3736 18.3728C18.036 18.7104 17.5782 18.9 17.1008 18.9H15.3008M6.29922 18.9H4.49922C4.02183 18.9 3.56399 18.7104 3.22643 18.3728C2.88886 18.0353 2.69922 17.5774 2.69922 17.1V15.3" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7996 13.5001C12.2908 13.5001 13.4996 12.2913 13.4996 10.8001C13.4996 9.30893 12.2908 8.1001 10.7996 8.1001C9.30844 8.1001 8.09961 9.30893 8.09961 10.8001C8.09961 12.2913 9.30844 13.5001 10.7996 13.5001Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.4014 14.3999L12.6914 12.6899" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plan:
    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.19922 1.80005V5.40005M14.3984 1.80005V5.40005" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.0992 3.6001H4.49922C3.50511 3.6001 2.69922 4.40599 2.69922 5.4001V18.0001C2.69922 18.9942 3.50511 19.8001 4.49922 19.8001H17.0992C18.0933 19.8001 18.8992 18.9942 18.8992 18.0001V5.4001C18.8992 4.40599 18.0933 3.6001 17.0992 3.6001Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.69922 9H18.8992" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  procedure:
    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.8008 10.8H17.5688C17.1755 10.7992 16.7927 10.9272 16.479 11.1645C16.1653 11.4018 15.938 11.7353 15.8318 12.114L13.7168 19.638C13.7031 19.6848 13.6747 19.7258 13.6358 19.755C13.5968 19.7843 13.5495 19.8 13.5008 19.8C13.4521 19.8 13.4047 19.7843 13.3658 19.755C13.3268 19.7258 13.2984 19.6848 13.2848 19.638L8.31678 1.96205C8.30315 1.91531 8.27473 1.87426 8.23578 1.84505C8.19683 1.81584 8.14946 1.80005 8.10078 1.80005C8.0521 1.80005 8.00473 1.81584 7.96578 1.84505C7.92683 1.87426 7.89841 1.91531 7.88478 1.96205L5.76978 9.48605C5.664 9.86329 5.43802 10.1957 5.12616 10.4329C4.81429 10.67 4.43357 10.7989 4.04178 10.8H1.80078" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  recovery:
    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.1008 12.6001C18.4418 11.2861 19.8008 9.71107 19.8008 7.65007C19.8008 6.33725 19.2793 5.0782 18.351 4.14989C17.4227 3.22159 16.1636 2.70007 14.8508 2.70007C13.2668 2.70007 12.1508 3.15007 10.8008 4.50007C9.45078 3.15007 8.33478 2.70007 6.75078 2.70007C5.43796 2.70007 4.17891 3.22159 3.2506 4.14989C2.3223 5.0782 1.80078 6.33725 1.80078 7.65007C1.80078 9.72007 3.15078 11.2951 4.50078 12.6001L10.8008 18.9001L17.1008 12.6001Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.89844 10.8H8.55044L9.00044 9.90002L10.8004 13.95L12.6004 7.65002L13.9504 10.8H18.6934" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const clockIcon =
  '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0013 18.3332C14.6037 18.3332 18.3346 14.6023 18.3346 9.9999C18.3346 5.39753 14.6037 1.66656 10.0013 1.66656C5.39893 1.66656 1.66797 5.39753 1.66797 9.9999C1.66797 14.6023 5.39893 18.3332 10.0013 18.3332Z" stroke="#8C8C90" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 5V10L13.3333 11.6667" stroke="#8C8C90" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const chevronIcon =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 11.25L9 6.75L4.5 11.25" stroke="#8C8C90" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const checkIcon =
  '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.33464 2.5L3.7513 7.08333L1.66797 5" stroke="#39C3CF" stroke-width="1.04167" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const prepareIcon =
  '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.1237 1.08337H4.8737C4.57454 1.08337 4.33203 1.32589 4.33203 1.62504V2.70837C4.33203 3.00753 4.57454 3.25004 4.8737 3.25004H8.1237C8.42285 3.25004 8.66536 3.00753 8.66536 2.70837V1.62504C8.66536 1.32589 8.42285 1.08337 8.1237 1.08337Z" stroke="#8C8C90" stroke-width="0.8125" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.66797 2.16663H9.7513C10.0386 2.16663 10.3142 2.28076 10.5173 2.48393C10.7205 2.68709 10.8346 2.96264 10.8346 3.24996V10.8333C10.8346 11.1206 10.7205 11.3962 10.5173 11.5993C10.3142 11.8025 10.0386 11.9166 9.7513 11.9166H3.2513C2.96398 11.9166 2.68843 11.8025 2.48527 11.5993C2.28211 11.3962 2.16797 11.1206 2.16797 10.8333V3.24996C2.16797 2.96264 2.28211 2.68709 2.48527 2.48393C2.68843 2.28076 2.96398 2.16663 3.2513 2.16663H4.33464" stroke="#8C8C90" stroke-width="0.8125" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 5.95837H8.66667M6.5 8.66663H8.66667M4.33203 5.95837H4.33745M4.33203 8.66663H4.33745" stroke="#8C8C90" stroke-width="0.8125" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const journeySteps = [
  {
    title: "Consultation",
    time: "45-60 min",
    icon: icons.consultation,
    tone: "teal",
    description:
      "The first visit is unhurried. Dr. Vikram reviews your symptoms, history, and any prior reports before giving you a clear initial opinion.",
    points: [
      "Symptom & history review",
      "Physical examination",
      "Prior reports reviewed",
      "Initial diagnosis opinion",
    ],
    prepare: "Prepare: Bring all reports and a list of questions",
    cta: "Book video appointment",
  },
  {
    title: "Diagnosis",
    time: "2-7 days",
    icon: icons.diagnosis,
    tone: "blue",
    description:
      "Reports, scans, urine tests, and blood results are reviewed so the diagnosis is clear before treatment is discussed.",
    points: ["Report review", "Imaging advice", "Test planning", "Risk explanation"],
    prepare: "Prepare: Share current tests and any old reports",
    cta: "Plan diagnosis",
  },
  {
    title: "Treatment Plan",
    time: "2-7 days",
    icon: icons.plan,
    tone: "amber",
    description:
      "You get a clear plan with options, expected recovery, medicine advice, and whether a procedure may be needed.",
    points: ["Treatment options", "Procedure need", "Recovery estimate", "Follow-up timing"],
    prepare: "Prepare: Note medicines, allergies, and health conditions",
    cta: "Discuss plan",
  },
  {
    title: "Procedure",
    time: "30 min-3 hrs",
    icon: icons.procedure,
    tone: "green",
    description:
      "If a procedure is required, the team explains preparation, admission, anesthesia, discharge, and home care.",
    points: ["Pre-op checklist", "Admission guidance", "Procedure briefing", "Discharge plan"],
    prepare: "Prepare: Keep recent reports and medicine list ready",
    cta: "Ask procedure details",
  },
  {
    title: "Recovery",
    time: "1 week-3 months",
    icon: icons.recovery,
    tone: "pink",
    description:
      "Recovery is supported with follow-up visits, report review, medicine changes, and warning signs to watch for.",
    points: ["Follow-up review", "Medicine plan", "Warning signs", "Prevention advice"],
    prepare: "Prepare: Report fever, pain, bleeding, or urinary difficulty",
    cta: "Book follow-up",
  },
];

const prepSteps = ["Concern", "Reports", "Your kit"];
const concerns = [
  { label: "Kidney Stone", icon: "/images/treatment-journey/concern-kidney-stone.svg", tone: "blue" },
  { label: "Prostate / BPH", icon: "/images/treatment-journey/concern-prostate-bph.svg", tone: "teal" },
  { label: "Bladder Issue", icon: "/images/treatment-journey/concern-bladder.svg", tone: "amber" },
  { label: "Men's Health", icon: "/images/treatment-journey/concern-mens-health.svg", tone: "green" },
  { label: "Urological Cancer", icon: "/images/treatment-journey/concern-cancer.svg", tone: "pink" },
  { label: "Not sure yet", icon: "/images/treatment-journey/concern-not-sure.svg", tone: "gray" },
];
const reportItems = [
  "CT scan or X-ray",
  "Ultrasound report",
  "Blood test results",
  "Urine test results",
  "PSA report",
  "Biopsy / MRI report",
  "Current prescriptions",
  "I have nothing yet",
];
const kitData = {
  "Kidney Stone": {
    appointmentLabel: "Stone appointment",
    bring: ["CT scan or X-ray", "Ultrasound report", "Urine test results", "Current prescriptions"],
    questions: ["What is the stone size and location?", "Do I need URS, RIRS, PCNL, or ECNL?", "Will I need a stent?", "How can I prevent stones again?"],
  },
  "Prostate / BPH": {
    appointmentLabel: "Routine appointment",
    bring: ["PSA blood test result", "Urine flow test if done", "Prescription list", "Any prior prostate biopsy report"],
    questions: ["Is my PSA level a concern?", "Do I need a biopsy?", "What is causing my urinary symptoms?", "What are my treatment options?"],
  },
  "Bladder Issue": {
    appointmentLabel: "Bladder appointment",
    bring: ["Urine routine report", "Urine culture report", "Ultrasound report", "Current prescriptions"],
    questions: ["What is causing urgency or leakage?", "Do I need cystoscopy?", "Is infection or blockage possible?", "What are my treatment options?"],
  },
  "Men's Health": {
    appointmentLabel: "Men's health appointment",
    bring: ["Semen analysis if done", "Hormone reports", "Prescription list", "Previous fertility reports"],
    questions: ["What could be causing this?", "Do I need hormone testing?", "What treatment is suitable?", "How long can recovery take?"],
  },
  "Urological Cancer": {
    appointmentLabel: "Cancer opinion appointment",
    bring: ["Biopsy report", "CT, MRI, or PET report", "Blood and urine results", "Previous treatment notes"],
    questions: ["What stage is this?", "Is surgery suitable?", "Can robotic surgery help?", "What follow-up will I need?"],
  },
  "Not sure yet": {
    appointmentLabel: "First consultation",
    bring: ["Symptom timeline", "Any report you have", "Prescription list", "Your main questions"],
    questions: ["What could be causing this?", "Which tests are needed?", "Is this urgent?", "What should I do next?"],
  },
} as const;

function SvgIcon({ svg }: { svg: string }) {
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}

function JourneyStepsSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={styles.journeySection} data-node-id="146:7760" id="journey">
      <div className={styles.journeyCard}>
        {journeySteps.map((step, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              className={`${styles.journeyItem} ${isOpen ? styles.open : ""}`}
              key={step.title}
            >
              <button
                aria-expanded={isOpen}
                className={styles.journeyButton}
                onClick={() => {
                  if (isOpen) {
                    setOpenIndex((index + 1) % journeySteps.length);
                    return;
                  }

                  setOpenIndex(index);
                }}
                type="button"
              >
                <span className={`${styles.phaseIcon} ${styles[step.tone]}`}>
                  <SvgIcon svg={step.icon} />
                </span>
                <strong>{t(step.title)}</strong>
                <span className={styles.timeLabel}>
                  <SvgIcon svg={clockIcon} />
                  {step.time}
                </span>
                <span className={styles.chevron}>
                  <SvgIcon svg={chevronIcon} />
                </span>
              </button>

              <div className={styles.journeyBody}>
                <div className={styles.journeyBodyInner}>
                  <p>{t(step.description)}</p>
                  <div className={styles.pillRow}>
                    {step.points.map((point) => (
                      <span key={point}>
                        <SvgIcon svg={checkIcon} />
                        {t(point)}
                      </span>
                    ))}
                  </div>
                  <div className={styles.prepare}>
                    <SvgIcon svg={prepareIcon} />
                    <span>{t(step.prepare)}</span>
                  </div>
                  <a className={styles.stepCta} href="#contact">
                    {t(step.cta)}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  const { t } = useI18n();

  return (
    <div className={styles.prepStepper}>
      {prepSteps.map((step, index) => (
        <span className={styles.prepStepWrap} key={step}>
          <span className={index === activeStep ? styles.prepStepActive : ""}>
            <b>{index + 1}</b>
            {t(step)}
          </span>
          {index < prepSteps.length - 1 ? (
            <img alt="" className={styles.prepStepArrow} src="/images/treatment-journey/stepper-arrow.svg" />
          ) : null}
        </span>
      ))}
    </div>
  );
}

function PrepBuilderSection() {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedConcern, setSelectedConcern] = useState("Prostate / BPH");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const kit = kitData[selectedConcern as keyof typeof kitData];
  const selectedConcernMeta = concerns.find((concern) => concern.label === selectedConcern) ?? concerns[0];

  function toggleReport(report: string) {
    setSelectedReports((current) =>
      current.includes(report)
        ? current.filter((item) => item !== report)
        : [...current, report],
    );
  }

  return (
    <section className={styles.prepSection} data-node-id="146:8821">
      <div className={styles.prepHeading}>
        <p className={styles.prepLabel}>
          <span className={styles.labelIcon} aria-hidden="true" />
          {t("Treatment journey")}
        </p>
        <h2>{t("From diagnosis to recovery, step by step")}</h2>
      </div>

      <div className={styles.prepCard}>
        <header className={styles.prepHeader}>
          <h3>{t("Build your consultation prep kit")}</h3>
          <Stepper activeStep={activeStep} />
        </header>

        <div
          className={`${styles.prepBody} ${activeStep === 2 ? styles.kitBody : ""}`}
          key={activeStep}
        >
          {activeStep === 0 ? (
            <>
              <h4>{t("What is your main concern?")}</h4>
              <div className={styles.concernGrid}>
                {concerns.map((concern) => (
                  <button
                    className={selectedConcern === concern.label ? styles.selectedOption : ""}
                    key={concern.label}
                    onClick={() => {
                      setSelectedConcern(concern.label);
                      setActiveStep(1);
                    }}
                    type="button"
                  >
                    <span className={`${styles.concernIcon} ${styles[concern.tone]}`}>
                      <img alt="" src={concern.icon} />
                    </span>
                    {t(concern.label)}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {activeStep === 1 ? (
            <>
              <button className={styles.changeButton} onClick={() => setActiveStep(0)} type="button">
                {t("Change concern")}
              </button>
              <h4>{t("What do you already have?")}</h4>
              <p className={styles.helpText}>
                {t("Select everything that applies, or pick \"I have nothing yet\".")}
              </p>
              <div className={styles.reportGrid}>
                {reportItems.map((report) => (
                  <button
                    className={selectedReports.includes(report) ? styles.selectedOption : ""}
                    key={report}
                    onClick={() => toggleReport(report)}
                    type="button"
                  >
                    <span className={styles.radioDot} />
                    {t(report)}
                  </button>
                ))}
              </div>
              <button className={styles.buildButton} onClick={() => setActiveStep(2)} type="button">
                {t("Build my kit")} →
              </button>
            </>
          ) : null}

          {activeStep === 2 ? (
            <>
              <button className={styles.changeButton} onClick={() => setActiveStep(0)} type="button">
                {t("Change concern")}
              </button>
              <div className={styles.kitTop}>
                <div className={styles.kitFor}>
                  <span className={`${styles.concernIcon} ${styles[selectedConcernMeta.tone]}`}>
                    <img alt="" src={selectedConcernMeta.icon} />
                  </span>
                  <div>
                    <span>{t("Kit for")}</span>
                    <strong>{t(selectedConcern)}</strong>
                  </div>
                </div>
                <div className={styles.kitActions}>
                  <span>{t(kit.appointmentLabel)}</span>
                  <button type="button">{t("Copy kit")}</button>
                </div>
              </div>
              <div className={styles.kitGrid}>
                <article>
                  <h4>{t("What to bring")}</h4>
                  {kit.bring.map((item) => (
                    <p key={item}>{t(item)}</p>
                  ))}
                </article>
                <article>
                  <h4>{t("Questions to ask")}</h4>
                  {kit.questions.map((item, index) => (
                    <p key={item}>
                      <b>{index + 1}</b>
                      {t(item)}
                    </p>
                  ))}
                </article>
              </div>
              <p className={styles.expectText}>
                {t("What to expect: Expect a clear report review, simple explanation, and next-step treatment discussion.")}
              </p>
              <div className={styles.kitFooter}>
                <a href="#contact">{t("Book Consultation")}</a>
                <button onClick={() => setActiveStep(0)} type="button">{t("Start over")}</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function TreatmentJourneyPage() {
  const { t } = useI18n();
  const title = "Treatment Journey | Dr. Vikram";
  const description = "Your treatment journey with Dr. Vikram, from first consultation and report review to treatment planning, procedure guidance, recovery, and follow-up.";

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        jsonLd={[
          pageGraph({ path: "/treatment-journey", title, description }),
          itemListGraph({
            path: "/treatment-journey",
            name: "Treatment journey steps",
            items: journeySteps.map((step) => step.title),
          }),
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "Treatment Journey", path: "/treatment-journey" },
          ]),
        ]}
      />

      <main className={styles.page}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.hero,
            styles.journeySection,
            styles.prepSection,
            styles.testimonialsWrap,
            styles.appointmentWrap,
            styles.ctaWrap,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <section className={styles.hero} data-node-id="146:7460">
          <p className={styles.label}>
            <span className={styles.labelIcon} aria-hidden="true" />
            {t("Patient Support")}
          </p>

          <h1>{t("Your treatment journey, step by step")}</h1>

          <p className={styles.subtitle}>
            {t("From first consultation to full recovery - clear, honest, no surprises.")}
          </p>

          <a className={styles.scrollButton} href="#journey" aria-label={t("Go to journey steps")}>
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <JourneyStepsSection />
        <PrepBuilderSection />
        <div className={`${styles.homeSectionWrap} ${styles.testimonialsWrap}`}>
          <TestimonialsSection />
        </div>
        <div className={styles.appointmentWrap}>
          <AppointmentSection />
        </div>
        <div className={`${styles.homeSectionWrap} ${styles.ctaWrap}`}>
          <FinalCtaSection />
        </div>
      </main>
    </>
  );
}
