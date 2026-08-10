import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@/components/icons/CheckCircle";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { SectionEyebrow } from "./TreatmentShared";

type TreatmentJourneyProps = {
  journey: TreatmentData["journey"];
};

function JourneyCaret({ direction }: { direction: "left" | "right" }) {
  return <span aria-hidden="true" className={direction === "right" ? styles.journeyCaretRight : styles.journeyCaret} />;
}

export function TreatmentJourney({ journey }: TreatmentJourneyProps) {
  const initialStep =
    journey.defaultActiveStep >= 0 && journey.defaultActiveStep < journey.steps.length
      ? journey.defaultActiveStep
      : 0;
  const [activeStep, setActiveStep] = useState(initialStep);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentStep = journey.steps[activeStep];

  useEffect(() => {
    const tabs = tabsRef.current;
    const tab = tabRefs.current[activeStep];
    if (!tabs || !tab) return;

    tabs.scrollTo({
      behavior: "smooth",
      left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2,
    });
  }, [activeStep]);

  if (!journey.steps.length || !currentStep) {
    return null;
  }

  function moveStep(direction: "previous" | "next") {
    setActiveStep((step) => {
      if (direction === "previous") return Math.max(0, step - 1);
      return Math.min(journey.steps.length - 1, step + 1);
    });
  }

  return (
    <section
      className={`${styles.contentSection} ${styles.journeySection}`}
      data-node-id="76:33252"
      id="treatment-journey"
    >
      <SectionEyebrow>{journey.eyebrow}</SectionEyebrow>
      <h2>{journey.title}</h2>
      <div className={styles.journeyTabs} ref={tabsRef}>
        {journey.steps.map((step, index) => (
          <button
            className={index === activeStep ? styles.activeJourneyTab : undefined}
            key={step.title}
            onClick={() => setActiveStep(index)}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
          >
            <span>{step.label}</span>
            {step.title}
          </button>
        ))}
      </div>
      <div className={styles.journeyCard} data-node-id="76:33293">
        <div className={styles.journeyCardHeader}>
          <div className={styles.journeyTitleGroup}>
            <div className={styles.journeyIcon}>
              <SiteIcon name={journey.icon} />
            </div>
            <div>
              <h3>{currentStep.heading}</h3>
              <p>{currentStep.subheading}</p>
            </div>
          </div>
          <div className={styles.journeyControls}>
            <span>
              {activeStep + 1} of {journey.steps.length}
            </span>
            <button
              aria-label="Previous treatment step"
              onClick={() => moveStep("previous")}
              type="button"
            >
              <JourneyCaret direction="left" />
            </button>
            <button
              aria-label="Next treatment step"
              onClick={() => moveStep("next")}
              type="button"
            >
              <JourneyCaret direction="right" />
            </button>
          </div>
        </div>
        <div className={styles.journeyCardBody}>
          <p>{currentStep.description}</p>
          <div className={styles.journeyChecklist}>
            <strong>Patient instructions</strong>
            <ul>
              {currentStep.checklist.map((item) => (
                <li key={item}>
                  <span className={styles.journeyCheckIcon}>
                    <CheckCircle className={styles.journeyCheckCircle} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
