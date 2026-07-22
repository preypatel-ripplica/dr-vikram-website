import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Treatments",
    links: [
      { label: "Urological cancer", href: "/treatments/urological-cancer" },
      { label: "Prostate problems", href: "/treatments/prostate-problems" },
      { label: "Kidney stones", href: "/treatments/kidney-stones" },
      { label: "Bladder problems", href: "/treatments/bladder-problems" },
      { label: "Male infertility", href: "/treatments/male-infertility" },
      { label: "Erectile dysfunction", href: "/treatments/erectile-dysfunction" },
      { label: "Urinary tract infection", href: "/treatments/urinary-tract-infection" },
      { label: "Urethral stricture", href: "/treatments/urethral-stricture" },
    ],
  },
  {
    title: "Patient support",
    links: [
      { label: "About us", href: "/about-us" },
      { label: "Treatment journey", href: "/treatment-journey" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Video gallery", href: "/video-gallery" },
      { label: "International patients", href: "/international-patient-support" },
      { label: "Contact us", href: "/contact-us" },
    ],
  },
  {
    title: "Blogs",
    links: [
      { label: "All blogs", href: "/blogs" },
      { label: "Kidney stones", href: "/blogs/kidney-stones" },
    ],
  },
];

const addresses = [
  {
    name: "Shalby International Hospitals",
    shortLabel: "Golf Course Road, Sector 53, Gurugram",
    label:
      "Shalby International Hospitals, Golf Course Rd, Parsvnath Exotica, DLF Phase 5, Sector 53, Gurugram, Haryana 122011",
    href:
      "https://www.google.com/maps/place/SHALBY+International+Hospitals/data=!4m2!3m1!1s0x0:0xb400eb3f1185b675?sa=X&ved=1t:2428&ictx=111",
  },
  {
    name: "Urowellness Clinic",
    shortLabel: "Eros City Square Mall, Sector 49, Gurugram",
    label:
      "Urowellness Clinic, 1st floor, Eros City Square Mall, 117, Rosewood City, Sector 49, Gurugram, Haryana 122018",
    href: "https://www.google.com/maps/place/Urowellness+Clinic/@28.4105879,77.0494974,15.49z/data=!4m6!3m5!1s0x390d2326e6cfc237:0xce7eb85b0e06c7ba!8m2!3d28.412509!4d77.054953!16s%2Fg%2F11nr0cx85r?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
  },
];

const contactLinks = [
  { label: "drvikram.uro@gmail.com", href: "mailto:drvikram.uro@gmail.com" },
  { label: "9871008256", href: "tel:+919871008256" },
];

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.externalIcon}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M7.5 4.5H15.5V12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M15.25 4.75L6.25 13.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.5 15.5H4.5V7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 8.25H16V5.25H13.6C10.95 5.25 9.5 6.85 9.5 9.25V11H7.5V14H9.5V20H12.75V14H15.25L15.75 11H12.75V9.55C12.75 8.7 13.1 8.25 14 8.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect
        height="15"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="2"
        width="15"
        x="4.5"
        y="4.5"
      />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.8" cy="7.2" fill="currentColor" r="1" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 12C21 9.9 20.8 8.55 20.45 7.78C20.25 7.35 19.9 7.01 19.47 6.81C18.64 6.43 15.34 6.25 12 6.25C8.66 6.25 5.36 6.43 4.53 6.81C4.1 7.01 3.75 7.35 3.55 7.78C3.2 8.55 3 9.9 3 12C3 14.1 3.2 15.45 3.55 16.22C3.75 16.65 4.1 16.99 4.53 17.19C5.36 17.57 8.66 17.75 12 17.75C15.34 17.75 18.64 17.57 19.47 17.19C19.9 16.99 20.25 16.65 20.45 16.22C20.8 15.45 21 14.1 21 12Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M10.5 9.25L15 12L10.5 14.75V9.25Z" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const { t, localizeHref } = useI18n();

  return (
    <footer className={styles.footerShell}>
      <div className={styles.footerFrame} data-node-id="64:22517">
        <div className={styles.brandLogo} data-node-id="64:25602">
          <Image
            alt="Urowellness"
            height={97}
            src="/images/footer_logo.svg"
            width={398}
          />
        </div>

        <nav className={styles.columns} aria-label={t("Footer navigation")}>
          {columns.map((column) => (
            <section className={styles.column} key={column.title}>
              <h2>{t(column.title)}</h2>
              <ul>
                {column.links.map((item) => (
                  <li key={`${column.title}-${item.href}`}>
                    <Link href={localizeHref(item.href)}>{t(item.label)}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <div className={styles.socials} aria-label={t("Social media links")}>
          <a
            aria-label="Instagram"
            className={styles.socialLink}
            href="https://www.instagram.com/drvikramkaushik/"
            rel="noreferrer"
            target="_blank"
          >
            <InstagramIcon />
          </a>
          <a
            aria-label="Facebook"
            className={styles.socialLink}
            href="https://www.facebook.com/UrowellnessClinic"
            rel="noreferrer"
            target="_blank"
          >
            <FacebookIcon />
          </a>
          <a
            aria-label="YouTube"
            className={styles.socialLink}
            href="https://www.youtube.com/@DrVikramBaruaKaushik"
            rel="noreferrer"
            target="_blank"
          >
            <YouTubeIcon />
          </a>
        </div>

        <section className={styles.locations} aria-label={t("Locations")}>
          <p className={styles.locationLabel}>{t("Address")}</p>
          {addresses.map((address) => (
            <a
              className={styles.locationLink}
              href={address.href}
              key={address.label}
              rel={address.href.startsWith("http") ? "noreferrer" : undefined}
              target={address.href.startsWith("http") ? "_blank" : undefined}
              title={address.label}
            >
              <span>
                {t(address.name)}, {t(address.shortLabel)}
              </span>
              <ExternalLinkIcon />
            </a>
          ))}
          <div className={styles.footerContactLinks}>
            {contactLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <p className={styles.copyright}>
          {t("© Urowellness Clinic, All Right Reserved.")}
        </p>
      </div>
    </footer>
  );
}
