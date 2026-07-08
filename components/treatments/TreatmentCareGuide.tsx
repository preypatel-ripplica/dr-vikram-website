import { useState } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { SectionEyebrow } from "./TreatmentShared";

type TreatmentCareGuideProps = {
  careGuide: TreatmentData["careGuide"];
};

export function TreatmentCareGuide({ careGuide }: TreatmentCareGuideProps) {
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = careGuide.tabs[activeTab];

  return (
    <section
      className={`${styles.contentSection} ${styles.careSection}`}
      data-node-id="76:33440"
      id="patient-care-guide"
    >
      <SectionEyebrow>{careGuide.eyebrow}</SectionEyebrow>
      <h2>{careGuide.title}</h2>
      <p className={`${styles.sectionIntro} ${styles.careIntro}`}>{careGuide.intro}</p>

      <div className={styles.careTabs} role="tablist">
        {careGuide.tabs.map((tab, index) => (
          <button
            aria-selected={index === activeTab}
            className={index === activeTab ? styles.activeCareTab : undefined}
            key={tab.label}
            onClick={() => setActiveTab(index)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className={styles.careList}>
        {currentTab.items.map((item) => (
          <li key={item}>
            <span className={styles.careCheckIcon}>
              <SiteIcon name="care-check" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className={styles.careNote}>{careGuide.note}</p>
    </section>
  );
}
