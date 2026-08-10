import { useEffect, useMemo, useRef, useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { TreatmentCareGuide } from "./TreatmentCareGuide";
import { TreatmentCtaSection } from "./TreatmentCtaSection";
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
  const clickedSectionLock = useRef<number | null>(null);

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
    function updateActiveSection() {
      if (clickedSectionLock.current && Date.now() < clickedSectionLock.current) {
        return;
      }

      const markerOffset = window.matchMedia("(max-width: 900px)").matches ? 120 : 150;
      const marker = window.scrollY + markerOffset;
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));

      const currentSection = sections.reduce<HTMLElement | null>((current, section) => {
        return section.offsetTop <= marker ? section : current;
      }, sections[0] ?? null);

      if (currentSection?.id) {
        setActiveSection(currentSection.id);
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sectionIds]);

  function handleSectionClick(sectionId: string) {
    clickedSectionLock.current = Date.now() + 700;
    setActiveSection(sectionId);
  }

  return (
    <main className={styles.treatmentPage}>
      <TreatmentScrollReveal />
      <TreatmentHero hero={treatment.hero} readTime={treatment.readTime} />

      <div className={styles.bodyShell} data-node-id="76:33070">
        <TreatmentSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          sidebar={treatment.sidebar}
        />

        <article className={styles.article}>
          <TreatmentOverview overview={treatment.overview} />
          <TreatmentSymptomChecker symptomCheck={treatment.symptomCheck} />
          <TreatmentJourney journey={treatment.journey} />
          <TreatmentExperience experience={treatment.experience} />
          <TreatmentCareGuide careGuide={treatment.careGuide} />
          {treatment.ctaSection ? (
            <TreatmentCtaSection ctaSection={treatment.ctaSection} />
          ) : null}
          <TreatmentFaq faqs={treatment.faqs} />
        </article>
      </div>

      <AppointmentSection />
      <FinalCtaSection />
    </main>
  );
}
