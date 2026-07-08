"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { LocalizedHighlight } from "@/components/shared/LocalizedHighlight";
import styles from "@/styles/Home.module.css";

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

function SliderHandleIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 28 14">
      <path
        d="M10 3L6 7L10 11M18 3L22 7L18 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function RoboticVisionComparison() {
  const { t, localizeHref } = useI18n();
  const [position, setPosition] = useState(50);
  const showStandardCaption = position >= 34;
  const showRoboticCaption = position <= 66;
  const comparisonStyle = useMemo(
    () =>
      ({
        "--comparison-position": `${position}%`,
      }) as CSSProperties,
    [position],
  );

  return (
    <section
      className={styles.roboticVisionSection}
      data-node-id="64:22129"
      id="robotic-surgery"
    >
      <div className={styles.roboticVisionInner}>
        <div className={styles.roboticVisionHeader}>
          <p className={styles.sectionLabel}>
            <span className={styles.icon}>
              <ShieldPlusIcon />
            </span>
            <span>{t("Robotic surgery")}</span>
          </p>
          <LocalizedHighlight
            as="h2"
            highlight="robotic vision"
            source="See the difference robotic vision can make"
          />
        </div>

        <div className={styles.roboticVisionPanel}>
          <div className={styles.roboticComparisonColumn}>
            <div className={styles.roboticComparisonCard} style={comparisonStyle}>
              <div className={styles.roboticBaseImage}>
                <Image
                  alt={t("Robotic-assisted magnified surgical view")}
                  fill
                  sizes="568px"
                  src="/assets/figma/robotic-vision/robotic-view.png"
                />
              </div>
              <div className={styles.roboticStandardOverlay}>
                <Image
                  alt={t("Standard surgical visibility")}
                  fill
                  sizes="568px"
                  src="/assets/figma/robotic-vision/standard-view.png"
                />
              </div>

              <span className={styles.standardPill}>{t("Standard view")}</span>
              <span className={styles.roboticPill}>{t("Robotic-assisted view")}</span>
              <span
                className={`${styles.standardCaption} ${
                  showStandardCaption ? "" : styles.comparisonCaptionHidden
                }`}
              >
                {t("Limited detail · Flat perspective")}
              </span>
              <span
                className={`${styles.roboticCaption} ${
                  showRoboticCaption ? "" : styles.comparisonCaptionHidden
                }`}
              >
                {t("Enhanced clarity · 3D magnified")}
              </span>

              <div className={styles.comparisonDivider} aria-hidden="true" />
              <div className={styles.comparisonHandle} aria-hidden="true">
                <SliderHandleIcon />
              </div>

              <input
                aria-label={t("Compare standard visibility with robotic-assisted vision")}
                className={styles.comparisonRange}
                max="96"
                min="4"
                onChange={(event) => setPosition(Number(event.target.value))}
                type="range"
                value={position}
              />
            </div>
            <p className={styles.roboticComparisonHint}>
              {t("Slide to compare standard visibility with robotic-assisted magnified vision.")}
            </p>
          </div>

          <article className={styles.roboticVisionCopyCard}>
            <div className={styles.roboticVisionCopy}>
              <h3>{t("More clarity for delicate urology procedures")}</h3>
              <p>
                {t("Robotic systems support high-definition magnified vision, helping the surgeon see fine structures more clearly during selected procedures.")}
              </p>
            </div>

            <p className={styles.roboticNote}>
              {t("The robot does not operate by itself. Dr. Vikram controls every movement from the console.")}
            </p>

            <a className={styles.roboticVisionButton} href={localizeHref("#contact")}>
              {t("Explore robotic surgery")}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
