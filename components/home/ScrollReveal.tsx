"use client";

import { useEffect } from "react";
import styles from "@/styles/Home.module.css";

const revealSelectors = [
  "aboutSection",
  "expertsSection",
  "treatmentsSection",
  "symptomGuideSection",
  "roboticVisionSection",
  "roboticMovementSection",
  "testimonialsSection",
  "finalCtaSection",
] as const;

function isHTMLElement(section: HTMLElement | null): section is HTMLElement {
  return section !== null;
}

export function ScrollReveal() {
  useEffect(() => {
    const sections = revealSelectors
      .map((key) => document.querySelector<HTMLElement>(`.${styles[key]}`))
      .filter(isHTMLElement);

    sections.forEach((section) => {
      section.classList.add(styles.revealPending);
      Array.from(section.children).forEach((child) => {
        child.classList.add(styles.revealChild);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.revealVisible);
          Array.from(entry.target.children).forEach((child) => {
            child.classList.add(styles.revealChildVisible);
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
