"use client";

import { useEffect } from "react";
import styles from "@/styles/TreatmentPage.module.css";

const revealSelectors = [
  "hero",
  "contentSection",
  "journeySection",
  "careSection",
] as const;

export function TreatmentScrollReveal() {
  useEffect(() => {
    const sections = revealSelectors.flatMap((key) =>
      Array.from(document.querySelectorAll<HTMLElement>(`.${styles[key]}`)),
    );

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
