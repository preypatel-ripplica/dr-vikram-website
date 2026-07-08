import styles from "./AppointmentSection.module.css";
import { useI18n } from "@/lib/i18n-context";

type ContactCard = {
  label: string;
  value: string;
  href: string;
};

type LocationLink = {
  label: string;
  href: string;
};

type AppointmentSectionProps = {
  eyebrow?: string;
  title?: string;
  email?: ContactCard;
  phone?: ContactCard;
  locations?: LocationLink[];
};

const defaultEmail = {
  label: "Email us",
  value: "drvikram.uro@gmail.com",
  href: "mailto:drvikram.uro@gmail.com",
};

const defaultPhone = {
  label: "Call us",
  value: "9871008256",
  href: "tel:+919871008256",
};

const shalbyMapsUrl =
  "https://www.google.com/maps/place/SHALBY+International+Hospitals/data=!4m2!3m1!1s0x0:0xb400eb3f1185b675?sa=X&ved=1t:2428&ictx=111";
const urowellnessMapsUrl =
  "https://www.google.com/maps/place/Urowellness+Clinic/@28.4105879,77.0494974,15.49z/data=!4m6!3m5!1s0x390d2326e6cfc237:0xce7eb85b0e06c7ba!8m2!3d28.412509!4d77.054953!16s%2Fg%2F11nr0cx85r?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";

const defaultLocations = [
  {
    label:
      "Shalby International Hospitals, Golf Course Rd, Parsvnath Exotica, DLF Phase 5, Sector 53, Gurugram, Haryana 122011",
    href: shalbyMapsUrl,
  },
  {
    label:
      "Urowellness Clinic, 1st floor, Eros City Square Mall, 117, Rosewood City, Sector 49, Gurugram, Haryana 122018",
    href: urowellnessMapsUrl,
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

function MailIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4.75 7.25C4.75 6.42 5.42 5.75 6.25 5.75H17.75C18.58 5.75 19.25 6.42 19.25 7.25V16.75C19.25 17.58 18.58 18.25 17.75 18.25H6.25C5.42 18.25 4.75 17.58 4.75 16.75V7.25Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5.5 7L12 12.25L18.5 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
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

function PlusIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="M10 4.75V15.25M4.75 10H15.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ContactTile({ item }: { item: ContactCard }) {
  const { t } = useI18n();

  return (
    <a className={styles.contactTile} href={item.href}>
      <span className={styles.contactIcon}>
        <MailIcon />
      </span>
      <span className={styles.contactText}>
        <span>{t(item.label)}</span>
        <strong>{item.value}</strong>
      </span>
      <ExternalLinkIcon />
    </a>
  );
}

export function AppointmentSection({
  eyebrow = "Contact us",
  title = "Any concern? Make an appointment",
  email = defaultEmail,
  phone = defaultPhone,
  locations = defaultLocations,
}: AppointmentSectionProps) {
  const { t } = useI18n();

  return (
    <section className={styles.appointmentSection} data-node-id="64:25713" id="contact">
      <div className={styles.appointmentInfo}>
        <div className={styles.appointmentHeading}>
          <p className={styles.sectionLabel}>
            <ShieldPlusIcon />
            <span>{t(eyebrow)}</span>
          </p>
          <h2>{t(title)}</h2>
        </div>

        <div className={styles.contactGroup}>
          <div className={styles.contactRow}>
            <ContactTile item={email} />
            <ContactTile item={phone} />
          </div>

          <div className={styles.locationTile}>
            <span className={styles.contactIcon}>
              <MailIcon />
            </span>
            <div className={styles.locationContent}>
              <span>{t("Address")}</span>
              {locations.map((location) => (
                <a
                  href={location.href}
                  key={location.label}
                  rel={location.href.startsWith("http") ? "noreferrer" : undefined}
                  target={location.href.startsWith("http") ? "_blank" : undefined}
                >
                  <span>{t(location.label)}</span>
                  <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form className={styles.appointmentForm}>
        <div className={styles.formRow}>
          <label>
            <span className={styles.fieldLabel}>{t("Your name")}</span>
            <input autoComplete="name" name="name" placeholder={t("Your name")} type="text" />
          </label>
          <label>
            <span className={styles.fieldLabel}>{t("Email")}</span>
            <input autoComplete="email" name="email" placeholder={t("Email")} type="email" />
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            <span className={styles.fieldLabel}>{t("Whatsapp no.")}</span>
            <input
              autoComplete="tel"
              inputMode="tel"
              name="whatsapp"
              placeholder={t("Whatsapp no.")}
              type="tel"
            />
          </label>
          <label>
            <span className={styles.fieldLabel}>{t("Location")}</span>
            <input autoComplete="address-level2" name="location" placeholder={t("Location")} type="text" />
          </label>
        </div>

        <label className={styles.messageField}>
          <span className={styles.fieldLabel}>{t("Describe your problem")}</span>
          <textarea name="problem" placeholder={t("Describe your problem...")} />
        </label>

        <label className={styles.uploadField}>
          <input
            accept="image/*,.pdf,.doc,.docx"
            name="attachment"
            type="file"
          />
          <span>
            <PlusIcon />
            {t("Upload any relevant photo or doc")}
          </span>
        </label>

        <button type="submit">{t("Submit")}</button>
      </form>
    </section>
  );
}
