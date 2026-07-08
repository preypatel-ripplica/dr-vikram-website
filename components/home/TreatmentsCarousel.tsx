"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { KeyboardEvent, MouseEvent, TouchEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import styles from "@/styles/Home.module.css";

const treatments = [
  {
    title: "Urological Cancer",
    href: "/treatments/urological-cancer",
    image: "/assets/figma/treatments/urological-cancer-card.png",
    bullets: [
      "Bladder, kidney, prostate, and testicular cancer review",
      "Staging, second opinion, and treatment roadmap",
    ],
  },
  {
    title: "Prostate Problems",
    href: "/treatments/prostate-problems",
    image: "/assets/figma/treatments/prostate-urinary-care.png",
    bullets: [
      "Weak flow, night urination, and PSA review",
      "Medicine, endoscopic, and surgery planning",
    ],
  },
  {
    title: "Kidney Stones",
    href: "/treatments/kidney-stones",
    image: "/assets/figma/treatments/urological-cancer-card.png",
    bullets: [
      "CT review for stone size and location",
      "URS, RIRS, PCNL, ECNL, and prevention care",
    ],
  },
  {
    title: "Bladder Problems",
    href: "/treatments/bladder-problems",
    image: "/assets/figma/treatments/prostate-urinary-care.png",
    bullets: [
      "Urgency, leakage, pain, and frequent urination",
      "Urine tests, cystoscopy, and bladder care planning",
    ],
  },
  {
    title: "Male Infertility",
    href: "/treatments/male-infertility",
    image: "/assets/figma/treatments/prostate-urinary-care.png",
    bullets: [
      "Semen analysis, hormones, and varicocele review",
      "Private guidance for fertility treatment options",
    ],
  },
  {
    title: "Erectile Dysfunction",
    href: "/treatments/erectile-dysfunction",
    image: "/assets/figma/treatments/robotic-urology.png",
    bullets: [
      "Private evaluation for erection concerns",
      "Safe medicines, tests, and long-term health review",
    ],
  },
  {
    title: "Urinary Tract Infection",
    href: "/treatments/urinary-tract-infection",
    image: "/assets/figma/treatments/prostate-urinary-care.png",
    bullets: [
      "Burning urine, fever, and recurrent UTI care",
      "Culture-based treatment and prevention planning",
    ],
  },
  {
    title: "Urethral Stricture",
    href: "/treatments/urethral-stricture",
    image: "/assets/figma/treatments/robotic-urology.png",
    bullets: [
      "Weak flow, spraying, and urine blockage review",
      "Uroflow, cystoscopy, and repair planning",
    ],
  },
];

function CheckCircleIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 11.08V12A9 9 0 1 1 15.66 3.77"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 4L12 14.01L9 11.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 36 36">
      <path
        d={direction === "left" ? "M22 9L13 18L22 27" : "M14 9L23 18L14 27"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export function TreatmentsCarousel() {
  const router = useRouter();
  const { t, localizeHref } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const touchStartX = useRef<number | null>(null);

  const visibleTreatments = useMemo(
    () =>
      [-1, 0, 1].map((shift) => {
        const index = (activeIndex + shift + treatments.length) % treatments.length;
        return { ...treatments[index], index, featured: shift === 0 };
      }),
    [activeIndex],
  );

  function showPrevious() {
    setSlideDirection("previous");
    setActiveIndex((current) => (current - 1 + treatments.length) % treatments.length);
  }

  function showNext() {
    setSlideDirection("next");
    setActiveIndex((current) => (current + 1) % treatments.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const deltaX = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
    touchStartX.current = null;

    if (Math.abs(deltaX) < 40) return;
    if (deltaX > 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  function focusTreatment(index: number) {
    if (index === activeIndex) return;
    const nextIndex = (activeIndex + 1) % treatments.length;
    setSlideDirection(index === nextIndex ? "next" : "previous");
    setActiveIndex(index);
  }

  function handleTreatmentKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const treatment = treatments[index];
    if (!treatment) return;
    if (index === activeIndex) {
      void router.push(localizeHref(treatment.href));
      return;
    }
    focusTreatment(index);
  }

  function handleTreatmentClick(
    event: MouseEvent<HTMLElement>,
    index: number,
    href: string,
  ) {
    event.preventDefault();
    if (index === activeIndex) {
      void router.push(localizeHref(href));
      return;
    }
    focusTreatment(index);
  }

  return (
    <section className={styles.treatmentsSection} data-node-id="64:21961">
      <div className={styles.treatmentsTop}>
        <div className={styles.treatmentsTitleBlock}>
          <p className={styles.sectionLabel}>
            <span className={styles.icon} aria-hidden="true">
              <svg fill="none" viewBox="0 0 20 20">
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
            </span>
            <span>{t("Treatments")}</span>
          </p>
          <h2>{t("Key Treatments")}</h2>
        </div>
        <p className={styles.treatmentsIntro}>
          {t("Clear care pathways for common urology concerns, from first symptoms and reports to treatment, recovery, and follow-up.")}
        </p>
      </div>

      <div
        className={styles.treatmentsViewport}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <div
          className={`${styles.treatmentsTrack} ${
            slideDirection === "next"
              ? styles.treatmentsTrackNext
              : styles.treatmentsTrackPrevious
          }`}
          key={`${activeIndex}-${slideDirection}`}
        >
          {visibleTreatments.map((treatment) => (
            <article
              className={`${styles.keyTreatmentCard} ${
                treatment.featured ? styles.featuredTreatment : ""
              }`}
              key={`${treatment.title}-${treatment.index}`}
              onClick={(event) =>
                handleTreatmentClick(event, treatment.index, treatment.href)
              }
              onFocus={() => focusTreatment(treatment.index)}
              onKeyDown={(event) => handleTreatmentKeyDown(event, treatment.index)}
              role="button"
              tabIndex={0}
            >
              <Image
                alt=""
                className={styles.treatmentCardImage}
                fill
                sizes="411px"
                src={treatment.image}
              />
              <div className={styles.treatmentCardTitleRow}>
                <h3>{t(treatment.title)}</h3>
                <Link
                  aria-label={t(`Open ${treatment.title}`)}
                  className={styles.treatmentArrow}
                  href={localizeHref(treatment.href)}
                  onClick={(event) => event.stopPropagation()}
                >
                  <ArrowRightIcon />
                </Link>
              </div>
              <div className={styles.treatmentBullets}>
                {treatment.bullets.map((bullet) => (
                  <p key={bullet}>
                    <CheckCircleIcon />
                    <span>{t(bullet)}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.treatmentsFooter}>
        <Link className={styles.viewAllTreatments} href={localizeHref("/treatments/urological-cancer")}>
          {t("View all treatments")} <ArrowRightIcon />
        </Link>
        <div className={styles.treatmentControls}>
          <button
            aria-label={t("Show previous treatment")}
            className={styles.treatmentNavButton}
            onClick={showPrevious}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            aria-label={t("Show next treatment")}
            className={styles.treatmentNavButton}
            onClick={showNext}
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
