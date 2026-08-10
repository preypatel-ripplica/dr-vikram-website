import Image from "next/image";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { SectionEyebrow } from "./TreatmentShared";

type TreatmentExperienceProps = {
  experience: TreatmentData["experience"];
};

export function TreatmentExperience({ experience }: TreatmentExperienceProps) {
  const hasStats = experience.stats.length > 0;

  return (
    <section
      className={styles.contentSection}
      data-node-id="76:33359"
      id="our-experience"
    >
      <SectionEyebrow>{experience.eyebrow}</SectionEyebrow>
      <h2>{experience.title}</h2>
      <div className={styles.richText}>
        {experience.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className={styles.experienceFeatureText}>
        <h3>{experience.featureTitle}</h3>
        <p>{experience.featureText}</p>
      </section>

      <div className={styles.videoFeature}>
        <div className={styles.videoImage}>
          <Image
            alt={experience.featureTitle}
            fill
            sizes="(max-width: 900px) 100vw, 980px"
            src={experience.video.image}
          />
        </div>
        <p>{experience.video.title}</p>
        {"byline" in experience.video ? (
          <span>{experience.video.byline}</span>
        ) : null}
      </div>

      {hasStats ? (
        <div className={styles.statsGrid}>
          {experience.stats.map((stat) => (
            <article key={stat.label}>
              <span className={styles.statIcon} aria-hidden="true">
                <SiteIcon name={stat.icon} />
              </span>
              <span>
                <strong>{stat.value}</strong>
                <em>{stat.label}</em>
              </span>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
