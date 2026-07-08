import { useEffect, useMemo, useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { TreatmentCareGuide } from "./TreatmentCareGuide";
import { TreatmentExperience } from "./TreatmentExperience";
import { TreatmentFaq } from "./TreatmentFaq";
import { TreatmentHero } from "./TreatmentHero";
import { TreatmentJourney } from "./TreatmentJourney";
import { TreatmentOverview } from "./TreatmentOverview";
import { TreatmentScrollReveal } from "./TreatmentScrollReveal";
import { TreatmentSidebar } from "./TreatmentSidebar";
import { TreatmentSymptomChecker } from "./TreatmentSymptomChecker";

type TreatmentPageTemplateProps = {
  treatment: TreatmentData;
};

export function TreatmentPageTemplate({ treatment }: TreatmentPageTemplateProps) {
  const [activeSection, setActiveSection] = useState(
    treatment.sidebar.items[0]?.href.replace("#", "") ?? "overview",
  );

  const sectionIds = useMemo(
    () => treatment.sidebar.items.map((item) => item.href.replace("#", "")),
    [treatment.sidebar.items],
  );

  useEffect(() => {
    if (window.location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [treatment.slug]);

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
    <main className={styles.treatmentPage}>
      <TreatmentScrollReveal />
      <TreatmentHero hero={treatment.hero} readTime={treatment.readTime} />

      <div className={styles.bodyShell} data-node-id="76:33070">
        <TreatmentSidebar
          activeSection={activeSection}
          sidebar={treatment.sidebar}
        />

        <article className={styles.article}>
          <TreatmentOverview overview={treatment.overview} />
          <TreatmentSymptomChecker symptomCheck={treatment.symptomCheck} />
          <TreatmentJourney journey={treatment.journey} />
          <TreatmentExperience experience={treatment.experience} />
          <TreatmentCareGuide careGuide={treatment.careGuide} />
          <TreatmentFaq faqs={treatment.faqs} />
        </article>
      </div>

      <AppointmentSection />
      <FinalCtaSection />
    </main>
  );
}
