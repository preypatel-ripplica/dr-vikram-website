import Image from "next/image";
import styles from "@/styles/Icon.module.css";

const iconPaths = {
  "caret-left": "/assets/icons/caret-left.svg",
  "caret-right": "/assets/icons/caret-right.svg",
  "care-check": "/assets/icons/care-check.svg",
  "check-circle": "/assets/icons/check-circle.svg",
  "check-circle-muted": "/assets/icons/check-circle-muted.svg",
  "figma-shield-plus": "/assets/icons/figma-shield-plus.svg",
  "stat-cases": "/assets/icons/stat-cases.svg",
  "stat-experience": "/assets/icons/stat-experience.svg",
  "stat-success": "/assets/icons/stat-success.svg",
  "treatment-journey": "/assets/icons/treatment-journey.svg",
} as const;

export type SiteIconName = keyof typeof iconPaths;

type SiteIconProps = {
  className?: string;
  name: string;
};

export function SiteIcon({ className, name }: SiteIconProps) {
  const src = iconPaths[name as SiteIconName];

  if (!src) return null;

  return (
    <span aria-hidden="true" className={[styles.icon, className].filter(Boolean).join(" ")}>
      <Image alt="" fill sizes="24px" src={src} unoptimized />
    </span>
  );
}
