"use client";

import Image from "next/image";
import type { KeyboardEvent, TouchEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import styles from "@/styles/Home.module.css";

const testimonials = [
  {
    name: "Arpana Mehalawat",
    meta: "Google review · 26 Nov 2022",
    rating: "5",
    avatar: "/assets/figma/testimonials/rahul-gupta-figma.png",
    quote:
      "Since 10 years, I have been following up with Dr. Vikram Barua. He explained my health issues so well and suggested the best decision every time I met him. Thank you for everything.",
  },
  {
    name: "CA. Akshay Agarwal",
    meta: "Google review · 9 Dec 2022",
    rating: "5",
    avatar: "/assets/figma/testimonials/raghav-chaddha.png",
    quote:
      "Thanks Dr. Vikram for operating on my father. He and his urologist team are very supportive and very careful. The whole team explained the procedure and treatment to us in a very calm way.",
  },
  {
    name: "Jasveer Sheoran",
    meta: "Google review · 18 Mar 2023",
    rating: "5",
    avatar: "/assets/figma/testimonials/ayush-pareekh.png",
    quote:
      "Dr. Vikram Barua did surgery for me. I am totally fine and getting discharged today. I am so comfortable here with Dr. Vikram and the whole urology team.",
  },
];

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

function StarIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 26 26">
      <path
        d="M13 2.5L16.18 9.03L23.35 10.05L18.17 15.12L19.39 22.25L13 18.88L6.61 22.25L7.83 15.12L2.65 10.05L9.82 9.03L13 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === "left" ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function TestimonialsSection() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const touchStartX = useRef<number | null>(null);

  const visibleTestimonials = useMemo(
    () =>
      [-1, 0, 1].map((shift) => {
        const index = (activeIndex + shift + testimonials.length) % testimonials.length;
        return { ...testimonials[index], index, featured: shift === 0 };
      }),
    [activeIndex],
  );

  function showPrevious() {
    setSlideDirection("previous");
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  }

  function showNext() {
    setSlideDirection("next");
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }

  function focusTestimonial(index: number) {
    if (index === activeIndex) return;
    const nextIndex = (activeIndex + 1) % testimonials.length;
    setSlideDirection(index === nextIndex ? "next" : "previous");
    setActiveIndex(index);
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

  function handleTestimonialKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    focusTestimonial(index);
  }

  return (
    <section className={styles.testimonialsSection} data-node-id="64:22228">
      <div className={styles.testimonialsHeader}>
        <p className={styles.sectionLabel}>
          <span className={styles.icon}>
            <ShieldPlusIcon />
          </span>
          <span>{t("Testimonials")}</span>
        </p>
        <h2>{t("Hear what people say about us")}</h2>
      </div>

      <div className={styles.testimonialRailWrap}>
        <div
          aria-label={t("Patient testimonials")}
          className={styles.testimonialRail}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <div
            className={`${styles.testimonialTrack} ${
              slideDirection === "next"
                ? styles.testimonialTrackNext
                : styles.testimonialTrackPrevious
            }`}
            key={`${activeIndex}-${slideDirection}`}
          >
            {visibleTestimonials.map((testimonial) => (
              <article
                className={`${styles.testimonialReviewCard} ${
                  testimonial.featured ? styles.featuredTestimonial : ""
                }`}
                key={`${testimonial.name}-${testimonial.index}`}
                onClick={() => focusTestimonial(testimonial.index)}
                onFocus={() => focusTestimonial(testimonial.index)}
                onKeyDown={(event) => handleTestimonialKeyDown(event, testimonial.index)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.testimonialReviewTop}>
                  <div className={styles.testimonialPerson}>
                    <div className={styles.testimonialAvatar}>
                      <Image
                        alt=""
                        fill
                        sizes="60px"
                        src={testimonial.avatar}
                      />
                    </div>
                    <div>
                      <h3>{t(testimonial.name)}</h3>
                      <p>{t(testimonial.meta)}</p>
                    </div>
                  </div>
                  <div className={styles.testimonialRating}>
                    <StarIcon />
                    <span>{testimonial.rating}</span>
                  </div>
                </div>

                <blockquote>
                  &quot;{t(testimonial.quote)}&quot;
                </blockquote>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.testimonialControls}>
          <button
            aria-label={t("Previous testimonials")}
            onClick={showPrevious}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            aria-label={t("Next testimonials")}
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
