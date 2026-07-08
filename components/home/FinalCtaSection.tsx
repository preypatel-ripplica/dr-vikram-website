import styles from "@/styles/Home.module.css";
import { useI18n } from "@/lib/i18n-context";
import { LocalizedHighlight } from "@/components/shared/LocalizedHighlight";

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

export function FinalCtaSection() {
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.finalCtaSection} data-node-id="64:25630">
      <div className={styles.finalCtaContent}>
        <p className={styles.finalCtaLabel}>
          <ShieldPlusIcon />
          <span>{t("Advanced urology clinic")}</span>
        </p>

        <div className={styles.finalCtaText}>
          <LocalizedHighlight
            as="h2"
            highlight="take control"
            source="Ready to take control of your health?"
          />
          <p>
            {t("Book a consultation to review your symptoms, reports, and treatment options with a clear next-step plan.")}
          </p>
        </div>
      </div>

      <div className={styles.finalCtaActions}>
        <a className={styles.finalCtaPrimary} href={localizeHref("#contact")}>
          {t("Book appointment")}
        </a>
        <a className={styles.finalCtaSecondary} href={localizeHref("#contact")}>
          {t("Contact us")}
        </a>
      </div>
    </section>
  );
}
