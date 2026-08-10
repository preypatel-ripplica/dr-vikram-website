import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { SectionEyebrow } from "./TreatmentShared";

type TreatmentCtaSectionProps = {
  ctaSection: NonNullable<TreatmentData["ctaSection"]>;
};

export function TreatmentCtaSection({ ctaSection }: TreatmentCtaSectionProps) {
  return (
    <section className={`${styles.contentSection} ${styles.treatmentCtaSection}`}>
      <SectionEyebrow>{ctaSection.eyebrow}</SectionEyebrow>
      <h2>{ctaSection.title}</h2>
      <div className={styles.richText}>
        {ctaSection.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
