import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { SectionEyebrow } from "./TreatmentShared";

type TreatmentOverviewProps = {
  overview: TreatmentData["overview"];
};

export function TreatmentOverview({ overview }: TreatmentOverviewProps) {
  const highlightAlreadyIncludesPrefix =
    Boolean(overview.titlePrefix) && overview.titleHighlight.includes(overview.titlePrefix);

  return (
    <section className={styles.contentSection} data-node-id="76:33134" id="overview">
      <SectionEyebrow>{overview.eyebrow}</SectionEyebrow>
      <h2>
        {highlightAlreadyIncludesPrefix ? (
          <span>{overview.titleHighlight}</span>
        ) : (
          <>
            {overview.titlePrefix} <span>{overview.titleHighlight}</span>
          </>
        )}
      </h2>
      <div className={styles.richText}>
        {overview.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className={styles.conditionGroups} id="about-cancer">
        {overview.subsections.map((section) => (
          <section className={styles.conditionGroup} key={section.title}>
            <h3>{section.title}</h3>
            <div className={styles.richText}>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
