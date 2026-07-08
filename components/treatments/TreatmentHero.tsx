import Image from "next/image";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";

type TreatmentHeroProps = {
  hero: TreatmentData["hero"];
  readTime: string;
};

export function TreatmentHero({ hero, readTime }: TreatmentHeroProps) {
  return (
    <section className={styles.hero} data-node-id="123:43509">
      <p className={styles.readTime}>{readTime}</p>
      <h1>
        <span className={styles.heroTitleLine}>{hero.title}:</span>
        <span className={styles.heroHighlightLine}>{hero.highlight}</span>
      </h1>
      <p className={styles.heroSummary}>{hero.summary}</p>
      <div className={styles.heroImage}>
        <Image
          alt={hero.title}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 1280px"
          src={hero.image}
        />
        <span>{hero.imageCaption}</span>
      </div>
    </section>
  );
}
