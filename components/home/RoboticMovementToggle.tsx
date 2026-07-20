"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { LocalizedHighlight } from "@/components/shared/LocalizedHighlight";
import styles from "@/styles/Home.module.css";

type MovementMode = "manual" | "robotic";

const modes: Record<
  MovementMode,
  {
    label: string;
    image: string;
    range: string;
  }
> = {
  manual: {
    label: "Manual",
    image: "/assets/figma/robotic-movement/manual-reference-crop.webp",
    range: "~180° movement range",
  },
  robotic: {
    label: "Robotic-assisted",
    image: "/assets/figma/robotic-movement/robotic-reference-crop.webp",
    range: "360° movement range",
  },
};

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

export function RoboticMovementToggle() {
  const { t, localizeHref } = useI18n();
  const [mode, setMode] = useState<MovementMode>("manual");
  const active = modes[mode];

  return (
    <section className={styles.roboticMovementSection} data-node-id="64:22188">
      <div className={styles.roboticMovementInner}>
        <div className={styles.roboticMovementHeader}>
          <p className={styles.sectionLabel}>
            <span className={styles.icon}>
              <ShieldPlusIcon />
            </span>
            <span>{t("Precision control")}</span>
          </p>
          <LocalizedHighlight
            as="h2"
            highlight="robotic movement"
            source="Why robotic movement matters in urology"
          />
        </div>

        <div className={styles.roboticMovementPanel}>
          <div className={styles.movementVisualCard}>
            <div className={styles.movementToggle} role="tablist" aria-label={t("Movement mode")}>
              {(Object.keys(modes) as MovementMode[]).map((key) => (
                <button
                  aria-selected={mode === key}
                  className={mode === key ? styles.activeMovementToggle : ""}
                  key={key}
                  onClick={() => setMode(key)}
                  role="tab"
                  type="button"
                >
                  {t(modes[key].label)}
                </button>
              ))}
            </div>

            <div className={styles.movementImageWrap}>
              <Image
                alt={t(`${active.label} instrument movement range`)}
                fill
                key={active.image}
                sizes="568px"
                src={active.image}
              />
            </div>

            <div className={styles.movementRangeWrap}>
              <span className={mode === "robotic" ? styles.roboticRangePill : ""}>
                {t(active.range)}
              </span>
            </div>
          </div>

          <article className={styles.movementCopyCard}>
            <div className={styles.movementCopy}>
              <h3>{t("More control in narrow surgical spaces")}</h3>
              <p>
                {t("Robotic instruments can support finer, wrist-like movement — especially useful in selected prostate, kidney, bladder, and reconstructive procedures.")}
              </p>
            </div>

            <div className={styles.movementComparisonRows}>
              <button
                className={mode === "manual" ? styles.activeMovementRow : ""}
                onClick={() => setMode("manual")}
                type="button"
              >
                <span>{t("Manual")}</span>
                <strong>{t("~180° range")}</strong>
              </button>
              <button
                className={mode === "robotic" ? styles.activeMovementRow : ""}
                onClick={() => setMode("robotic")}
                type="button"
              >
                <span>{t("Robotic-assisted")}</span>
                <strong>{t("360° range")}</strong>
              </button>
            </div>

            <a className={styles.movementButton} href={localizeHref("#contact")}>
              {t("Explore robotic surgery")}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
