import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import type { TreatmentData } from "@/lib/treatments";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Header.module.css";

const patientSupportItems = [
  {
    label: "Treatment journey",
    href: "/treatment-journey",
  },
  {
    label: "Testimonials",
    href: "/testimonials",
  },
  {
    label: "Video gallery",
    href: "/video-gallery",
  },
  {
    label: "International patients",
    href: "/international-patient-support",
  },
];

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className={styles.chevron}
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

type HeaderProps = {
  treatments: TreatmentData[];
};

export default function Header({ treatments }: HeaderProps) {
  const { t, localizeHref } = useI18n();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const treatmentNavItems = treatments.map((treatment) => ({
    label: treatment.hero.title.replace(/^Understanding\s+/i, ""),
    href: `/treatments/${treatment.slug}`,
  }));

  const navItems = [
    {
      label: "Home",
      href: "/",
      hasDropdown: false,
      dropdownItems: [],
    },
    {
      label: "About us",
      href: "/about-us",
      hasDropdown: false,
      dropdownItems: [],
    },
    {
      label: "Treatments",
      href: treatmentNavItems[0]?.href ?? "/treatments",
      hasDropdown: true,
      dropdownItems: treatmentNavItems,
    },
    {
      label: "Blogs",
      href: "/blogs",
      hasDropdown: false,
      dropdownItems: [],
    },
    {
      label: "Patient support",
      href: "/treatment-journey",
      hasDropdown: true,
      dropdownItems: patientSupportItems,
    },
    {
      label: "Contact us",
      href: "/contact-us",
      hasDropdown: false,
      dropdownItems: [],
    },
  ];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent | TouchEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className={styles.header} data-node-id="64:20338" ref={headerRef}>
      <div className={styles.headerFrame}>
        <Link aria-label={t("Dr. Vikram home")} className={styles.logo} href={localizeHref("/")}>
          <span className={styles.logoMark} data-node-id="76:33059">
            <Image
              alt=""
              fill
              sizes="42px"
              src="/assets/figma/header-logo-mark.svg"
            />
          </span>
          <span className={styles.logoText} data-node-id="76:33064">
            <span className={styles.logoTitle} data-node-id="76:33066">
              Dr. Vikram
            </span>
            <span className={styles.logoSubtitle} data-node-id="76:33068">
              {t("Urologist & Robotic Surgeon")}
            </span>
          </span>
        </Link>

        <nav aria-label={t("Main navigation")} className={styles.nav}>
          {navItems.map((item) => (
            <div
              className={styles.navItemWrap}
              key={item.label}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setOpenDropdown(null);
                }
              }}
              onFocus={() => {
                if (item.dropdownItems.length) {
                  setOpenDropdown(item.label);
                }
              }}
              onMouseEnter={() => {
                if (item.dropdownItems.length) {
                  setOpenDropdown(item.label);
                }
              }}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                aria-expanded={
                  item.dropdownItems.length
                    ? openDropdown === item.label
                    : undefined
                }
                aria-haspopup={item.dropdownItems.length ? "menu" : undefined}
                className={styles.navItem}
                href={localizeHref(item.href)}
                onClick={() => setOpenDropdown(null)}
              >
                <span>{t(item.label)}</span>
                {item.hasDropdown ? <ChevronDown /> : null}
              </Link>

              {item.dropdownItems.length ? (
                <div
                  className={`${styles.dropdown} ${
                    openDropdown === item.label ? styles.dropdownOpen : ""
                  }`}
                  role="menu"
                >
                  {item.dropdownItems.map((dropdownItem) => (
                    <Link
                      className={styles.dropdownItem}
                      href={localizeHref(dropdownItem.href)}
                      key={dropdownItem.href}
                      onClick={() => setOpenDropdown(null)}
                      role="menuitem"
                    >
                      <span>{t(dropdownItem.label)}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <LanguageSwitcher />

          <Link
            className={styles.consultButton}
            data-node-id="64:20354"
            href="https://wa.me/919871008256"
            rel="noreferrer"
            target="_blank"
          >
            <span className={styles.whatsappFrame} aria-hidden="true">
              <span className={styles.whatsappMask} />
            </span>
            <span>{t("Consult now")}</span>
          </Link>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t("Close menu") : t("Open menu")}
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            type="button"
          >
            <Image
              alt=""
              height={24}
              src="/assets/figma/header-menu.svg"
              width={24}
            />
          </button>
        </div>
      </div>

      <nav
        aria-label={t("Mobile navigation")}
        className={`${styles.mobilePanel} ${
          isMobileMenuOpen ? styles.mobilePanelOpen : ""
        }`}
        id="mobile-navigation"
      >
        {navItems.map((item) => (
          <div className={styles.mobileNavGroup} key={item.label}>
            <Link
              className={styles.mobileNavItem}
              href={localizeHref(item.href)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t(item.label)}
            </Link>
            {item.dropdownItems.length ? (
              <div className={styles.mobileSubnav}>
                {item.dropdownItems.map((dropdownItem) => (
                  <Link
                    href={localizeHref(dropdownItem.href)}
                    key={dropdownItem.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(dropdownItem.label)}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </header>
  );
}
