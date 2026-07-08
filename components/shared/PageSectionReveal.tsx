"use client";

import { useEffect } from "react";

type PageSectionRevealProps = {
  childClassName: string;
  pendingClassName: string;
  sectionClassNames: string[];
  visibleChildClassName: string;
  visibleClassName: string;
};

export function PageSectionReveal({
  childClassName,
  pendingClassName,
  sectionClassNames,
  visibleChildClassName,
  visibleClassName,
}: PageSectionRevealProps) {
  useEffect(() => {
    const sections = sectionClassNames.flatMap((className) =>
      Array.from(document.getElementsByClassName(className)).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      ),
    );

    sections.forEach((section) => {
      section.classList.add(pendingClassName);
      Array.from(section.children).forEach((child) => {
        child.classList.add(childClassName);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(visibleClassName);
          Array.from(entry.target.children).forEach((child) => {
            child.classList.add(visibleChildClassName);
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [
    childClassName,
    pendingClassName,
    sectionClassNames,
    visibleChildClassName,
    visibleClassName,
  ]);

  return null;
}
