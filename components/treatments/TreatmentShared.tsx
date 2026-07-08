import styles from "@/styles/TreatmentPage.module.css";
import { SiteIcon } from "@/components/icons/SiteIcon";

export function ShieldPlusIcon() {
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

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.eyebrowIcon}>
        <SiteIcon name="figma-shield-plus" />
      </span>
      <span>{children}</span>
    </p>
  );
}

export function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 18 18">
      <path
        d="M7 5L11 9L7 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
      <circle cx="24" cy="24" fill="white" fillOpacity="0.88" r="23" />
      <path d="M20 16L34 24L20 32V16Z" fill="#3dc1be" />
    </svg>
  );
}
