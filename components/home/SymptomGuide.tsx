"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import styles from "@/styles/Home.module.css";

type StepKey = "concern" | "timeline" | "support";

type AnswerState = {
  concern: string;
  timeline: string;
  support: string;
};

const steps: Array<{
  key: StepKey;
  question: string;
  options: string[];
}> = [
  {
    key: "concern",
    question: "What are you mainly concerned about?",
    options: [
      "Pain or burning while urinating",
      "Kidney stone pain / side pain",
      "Frequent urination or weak urine flow",
      "Men's health or fertility concern",
      "I already have reports and need an opinion",
    ],
  },
  {
    key: "timeline",
    question: "How long has this been happening?",
    options: [
      "Started recently",
      "More than a week",
      "Keeps coming back",
      "I need urgent guidance",
    ],
  },
  {
    key: "support",
    question: "What would help you most right now?",
    options: [
      "Book a clinic consultation",
      "Understand the likely treatment path",
      "Review my reports with the doctor",
      "Speak with the clinic team",
    ],
  },
];

const emptyAnswers: AnswerState = {
  concern: "",
  timeline: "",
  support: "",
};

const stepMessages: Record<StepKey, string> = {
  concern:
    "Tell us what feels most urgent so we can point you toward the right urology care pathway.",
  timeline:
    "How long symptoms have been present helps decide whether you need routine review or faster guidance.",
  support:
    "Choose the next step that feels most useful. You can book a visit, share reports, or speak with the clinic team.",
};

function ShieldPlusIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
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

function StethoscopeIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 3V8.5C6 11 8 13 10.5 13C13 13 15 11 15 8.5V3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M10.5 13V15.5C10.5 18 12.5 20 15 20C17.5 20 19.5 18 19.5 15.5V14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <circle cx="19.5" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function MedicalKitIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" width="16" x="4" y="8" />
      <path
        d="M9 8V6.5C9 5.67 9.67 5 10.5 5H13.5C14.33 5 15 5.67 15 6.5V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path d="M12 11V17M9 14H15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="M6.6 3.7L7.7 6.4C7.9 6.9 7.8 7.4 7.4 7.7L6.6 8.4C7.5 10.3 9 11.8 10.9 12.7L11.6 11.9C11.9 11.5 12.4 11.4 12.9 11.6L15.6 12.7C16.1 12.9 16.4 13.4 16.3 13.9C16.1 15.2 15 16.1 13.7 16.1C8.3 16.1 3.9 11.7 3.9 6.3C3.9 5 4.8 3.9 6.1 3.7C6.3 3.7 6.5 3.7 6.6 3.7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 18 18">
      <path
        d="M3.5 9H14.5M10 4.5L14.5 9L10 13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function SymptomGuide() {
  const { t, localizeHref } = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>(emptyAnswers);
  const currentStep = steps[activeStep];
  const selectedAnswer = answers[currentStep.key];
  const isFinalStep = activeStep === steps.length - 1;

  const progress = useMemo(
    () => `${((activeStep + 1) / steps.length) * 100}%`,
    [activeStep],
  );

  function chooseOption(value: string) {
    setAnswers((current) => ({
      ...current,
      [currentStep.key]: value,
    }));
  }

  function continueGuide() {
    if (!selectedAnswer) {
      return;
    }

    if (!isFinalStep) {
      setActiveStep((current) => current + 1);
      return;
    }

    const contact = document.querySelector("#contact") ?? document.querySelector("footer");
    contact?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startOver() {
    setActiveStep(0);
    setAnswers(emptyAnswers);
  }

  return (
    <section className={styles.symptomGuideSection} data-node-id="64:22031">
      <div className={styles.symptomGuideInner}>
        <div className={styles.symptomGuideHeader}>
          <p className={styles.sectionLabel}>
            <span className={styles.icon}>
              <ShieldPlusIcon />
            </span>
            <span>{t("Symptom guide")}</span>
          </p>
          <h2>{t("Not sure what care you need?")}</h2>
        </div>

        <div className={styles.symptomGuidePanel}>
          <div className={styles.symptomQuestionCard}>
            <div className={styles.symptomProgressHeader}>
              <span>
                {t("Step")} {activeStep + 1} {t("of")} {steps.length}
              </span>
              <button onClick={startOver} type="button">
                {t("Start over")}
              </button>
            </div>
            <div className={styles.symptomProgressTrack}>
              <span style={{ width: progress }} />
            </div>

            <div className={styles.symptomQuestionBody}>
              <h3>{t(currentStep.question)}</h3>
              <div className={styles.symptomOptions}>
                {currentStep.options.map((option) => (
                  <button
                    aria-pressed={selectedAnswer === option}
                    className={selectedAnswer === option ? styles.selectedSymptomOption : ""}
                    key={option}
                    onClick={() => chooseOption(option)}
                    type="button"
                  >
                    <span>{t(option)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.symptomQuestionFooter}>
              <button
                className={styles.symptomBackButton}
                disabled={activeStep === 0}
                onClick={() => setActiveStep((current) => current - 1)}
                type="button"
              >
                {t("Back")}
              </button>
              <button
                className={styles.symptomContinueButton}
                disabled={!selectedAnswer}
                onClick={continueGuide}
                type="button"
              >
                {isFinalStep ? t("Book consult") : t("Continue")}
              </button>
            </div>
          </div>

          <aside className={styles.symptomSideCards} aria-label={t("Symptom guide support")}>
            <article className={styles.symptomInfoCard}>
              <span className={styles.symptomRoundIcon}>
                <StethoscopeIcon />
              </span>
              <p>
                {t(stepMessages[currentStep.key])}
              </p>
              <a href={localizeHref("#contact")}>{t("Know more")}</a>
            </article>

            <article className={styles.symptomNextCard}>
              <h3>{t("What happens next?")}</h3>
              <ul>
                <li>
                  <span>
                    <MedicalKitIcon />
                  </span>
                  {t("Share symptoms or reports")}
                </li>
                <li>
                  <span>
                    <StethoscopeIcon />
                  </span>
                  {t("Doctor reviews the concern")}
                </li>
                <li>
                  <span>
                    <ArrowRightIcon />
                  </span>
                  {t("Get a clear treatment plan")}
                </li>
              </ul>
            </article>

            <a className={styles.symptomHelpCard} href="tel:+919871008256">
              <span className={styles.symptomHelpIcon}>
                <PhoneIcon />
              </span>
              <span>
                <strong>{t("Need help right now?")}</strong>
                <small>{t("Helpline available 24/7")}</small>
              </span>
              <ArrowRightIcon />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
