import { useState } from "react";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { SectionEyebrow } from "./TreatmentShared";

type TreatmentSymptomCheckerProps = {
  symptomCheck: TreatmentData["symptomCheck"];
};

function scrollToAppointmentForm() {
  const contactForm = document.getElementById("contact");
  const fallbackTarget = document.querySelector("footer");
  const target = contactForm ?? fallbackTarget;

  if (!target) return;

  const headerOffset = window.matchMedia("(max-width: 900px)").matches ? 84 : 96;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.history.replaceState(null, "", "#contact");
  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
}

export function TreatmentSymptomChecker({
  symptomCheck,
}: TreatmentSymptomCheckerProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const currentStep = symptomCheck.steps[step];
  const selectedAnswer = answers[step];

  function selectAnswer(answer: string) {
    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[step] = answer;
      return nextAnswers;
    });
  }

  function continueFlow() {
    if (step < symptomCheck.steps.length - 1) {
      setStep((currentStepIndex) => currentStepIndex + 1);
      return;
    }

    scrollToAppointmentForm();
  }

  return (
    <section className={styles.contentSection} data-node-id="76:33182" id="symptom-check">
      <SectionEyebrow>{symptomCheck.eyebrow}</SectionEyebrow>
      <h2>{symptomCheck.title}</h2>
      <div className={styles.symptomCard} data-node-id="76:33702">
        <div className={styles.symptomCardInner}>
          <div className={styles.symptomMeta}>
            <span>
              Step {step + 1} of {symptomCheck.steps.length}
            </span>
            <button
              onClick={() => {
                setStep(0);
                setAnswers([]);
              }}
              type="button"
            >
              Start over
            </button>
          </div>
          <div className={styles.symptomProgress}>
            <span
              style={{
                width: `${((step + 1) / symptomCheck.steps.length) * 100}%`,
              }}
            />
          </div>
          <h3>{currentStep.question}</h3>
          <div className={styles.symptomOptions}>
            {currentStep.options.map((option) => (
              <button
                className={
                  selectedAnswer === option ? styles.selectedSymptomOption : undefined
                }
                key={option}
                onClick={() => selectAnswer(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className={styles.continueButton}
            disabled={!selectedAnswer}
            onClick={continueFlow}
            type="button"
          >
            {step === symptomCheck.steps.length - 1
              ? "Book consultation"
              : "Continue"}
          </button>
        </div>
      </div>
      <p className={styles.smallNote}>{symptomCheck.note}</p>
    </section>
  );
}
