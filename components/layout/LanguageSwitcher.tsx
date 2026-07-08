import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { LOCALES, localizePath, stripLocaleFromPath } from "@/lib/i18n-config";
import { useI18n } from "@/lib/i18n-context";
import styles from "./Header.module.css";

export function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const currentLocale = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];
  const currentPath = stripLocaleFromPath(router.asPath || "/");

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const close = () => setIsOpen(false);

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    router.events.on("routeChangeStart", close);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      router.events.off("routeChangeStart", close);
    };
  }, [router.events]);

  return (
    <div className={styles.languageSwitcher} ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={styles.languageButton}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>{currentLocale.nativeLabel}</span>
      </button>

      <div
        className={`${styles.languageMenu} ${isOpen ? styles.languageMenuOpen : ""}`}
        role="menu"
      >
        {LOCALES.map((item) => (
          <Link
            aria-current={item.code === locale ? "page" : undefined}
            className={styles.languageOption}
            href={localizePath(currentPath, item.code)}
            key={item.code}
            locale={false}
            onClick={() => {
              setIsOpen(false);
              onNavigate?.();
            }}
            role="menuitem"
          >
            <span>{item.nativeLabel}</span>
            <small>{t(item.label)}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
