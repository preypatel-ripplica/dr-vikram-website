import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { TestimonialsSection as HomeTestimonialsSection } from "@/components/home/TestimonialsSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import styles from "@/styles/ContactPage.module.css";

const contactCards = [
  {
    label: "Email us",
    value: "drvikram.uro@gmail.com",
    href: "mailto:drvikram.uro@gmail.com",
  },
  {
    label: "Call us",
    value: "9871008256",
    href: "tel:+919871008256",
  },
  {
    label: "Timings",
    value: "All Day: 11.00 AM - 04.00 PM",
    href: "#appointment",
  },
];

const shalbyMapsUrl =
  "https://www.google.com/maps/place/SHALBY+International+Hospitals/data=!4m2!3m1!1s0x0:0xb400eb3f1185b675?sa=X&ved=1t:2428&ictx=111";
const urowellnessMapsUrl =
  "https://www.google.com/maps/place/Urowellness+Clinic/@28.4105879,77.0494974,15.49z/data=!4m6!3m5!1s0x390d2326e6cfc237:0xce7eb85b0e06c7ba!8m2!3d28.412509!4d77.054953!16s%2Fg%2F11nr0cx85r?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";

const visitLocations = [
  {
    label:
      "Shalby International Hospitals, Golf Course Rd, Parsvnath Exotica, DLF Phase 5, Sector 53, Gurugram, Haryana 122011",
    href: shalbyMapsUrl,
    image: "/images/Shalby_Hospital.png",
  },
  {
    label:
      "Urowellness Clinic, 1st floor, Eros City Square Mall, 117, Rosewood City, Sector 49, Gurugram, Haryana 122018",
    href: urowellnessMapsUrl,
    image: "/images/Clinic.png",
  },
];

function ShieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image alt="" fill sizes="20px" src="/assets/icons/figma-shield-plus.svg" />
      </span>
      <span>{children}</span>
    </p>
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

function ClockIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="17.25" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M24 14.5V24L30.5 30.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function CaretButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`${direction} location`}
      className={styles.locationArrow}
      onClick={onClick}
      type="button"
    >
      <span className={direction === "right" ? styles.caretRight : styles.caretLeft} />
    </button>
  );
}

function ContactCard({ card }: { card: (typeof contactCards)[number] }) {
  return (
    <a className={styles.contactCard} href={card.href}>
      <span className={styles.contactIcon}>
        <Image alt="" fill sizes="37px" src="/assets/figma/contact-page/mail.svg" />
      </span>
      <span className={styles.contactCopy}>
        <span>{card.label}</span>
        <strong>{card.value}</strong>
      </span>
      {card.label === "Email us" ? <ExternalLinkIcon /> : null}
    </a>
  );
}

function ContactHero() {
  return (
    <section className={styles.hero} data-node-id="103:39138">
      <div className={styles.heroHeading}>
        <ShieldLabel>Contact us</ShieldLabel>
        <div className={styles.heroText}>
          <h1>We are always eager to help</h1>
          <p>Contact us for any concerns or if you notice any symptoms</p>
        </div>
      </div>
      <span className={styles.heroArrow}>
        <Image alt="" fill sizes="32px" src="/assets/figma/contact-page/hero-arrow.svg" />
      </span>
    </section>
  );
}

function ContactCardsSection() {
  return (
    <section className={styles.contactCards} data-node-id="103:39502">
      {contactCards.map((card) => (
        <ContactCard card={card} key={card.label} />
      ))}
    </section>
  );
}

function VisitSection() {
  const [activeLocation, setActiveLocation] = useState(0);
  const location = visitLocations[activeLocation];

  function moveLocation(direction: "previous" | "next") {
    setActiveLocation((current) => {
      if (direction === "previous") {
        return current === 0 ? visitLocations.length - 1 : current - 1;
      }

      return current === visitLocations.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <section className={styles.visitSection} data-node-id="103:39542">
      <div className={styles.visitInner}>
        <div className={styles.visitImage}>
          <Image
            alt={location.label}
            height={571}
            key={location.image}
            src={location.image}
            width={761}
          />
        </div>
        <article className={styles.visitCard}>
          <div className={styles.visitContent}>
            <div className={styles.visitHeading}>
              <ShieldLabel>Visit for consultation</ShieldLabel>
              <h2>Dr. Vikram</h2>
              <p>MBBS, MD, FELLOWSHIP PAIN MEDICINE (FIAPM)</p>
            </div>

            <div className={styles.visitMeta}>
              <ClockIcon />
              <span>Every Day 11:00AM - 04:00PM</span>
            </div>

            <a
              className={styles.visitAddress}
              href={location.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className={styles.locationIcon}>
                <Image alt="" fill sizes="28px" src="/assets/figma/contact-page/location.svg" />
              </span>
              <span>{location.label}</span>
            </a>
          </div>

          <div className={styles.locationControls}>
            <CaretButton direction="left" onClick={() => moveLocation("previous")} />
            <span>
              {activeLocation + 1}/{visitLocations.length}
            </span>
            <CaretButton direction="right" onClick={() => moveLocation("next")} />
          </div>
        </article>
      </div>
    </section>
  );
}

function AppointmentFormSection() {
  return (
    <section className={styles.appointment} data-node-id="103:39314" id="appointment">
      <div className={styles.appointmentInfo}>
        <div className={styles.appointmentHeading}>
          <ShieldLabel>Treatments</ShieldLabel>
          <h2>Any concern? Make an appointment</h2>
        </div>

        <div className={styles.appointmentContactGroup}>
          <div className={styles.appointmentContactRow}>
            {contactCards.slice(0, 2).map((card) => (
              <ContactCard card={card} key={`appointment-${card.label}`} />
            ))}
          </div>
          <div className={styles.locationTile}>
            <span className={styles.smallContactIcon}>
              <Image alt="" fill sizes="23px" src="/assets/figma/contact-page/mail.svg" />
            </span>
            <div>
              <span>Address</span>
              <a href={shalbyMapsUrl} rel="noreferrer" target="_blank">
                Shalby International Hospitals, Golf Course Rd, Parsvnath
                Exotica, DLF Phase 5, Sector 53, Gurugram, Haryana 122011{" "}
                <ExternalLinkIcon />
              </a>
              <a href={urowellnessMapsUrl} rel="noreferrer" target="_blank">
                Urowellness Clinic, 1st floor, Eros City Square Mall, 117,
                Rosewood City, Sector 49, Gurugram, Haryana 122018{" "}
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      <form className={styles.form}>
        <div className={styles.formRow}>
          <input aria-label="Your name" placeholder="Your name" type="text" />
          <input aria-label="Email" placeholder="Email" type="email" />
        </div>
        <div className={styles.formRow}>
          <input aria-label="Whatsapp no." placeholder="Whatsapp no." type="tel" />
          <input aria-label="Location" placeholder="Location" type="text" />
        </div>
        <textarea aria-label="Describe your problem" placeholder="Describe your problem..." />
        <label className={styles.upload}>
          <input type="file" />
          <span>
            <PlusIcon />
            Upload any relevant photo or doc
          </span>
        </label>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default function ContactUsPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Dr. Vikram</title>
        <meta
          name="description"
          content="Contact Dr. Vikram's team for appointments, consultation details, locations, and patient support."
        />
      </Head>
      <main className={styles.contactPage}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.hero,
            styles.contactCards,
            styles.visitSection,
            styles.homeTestimonialsWrap,
            styles.appointment,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <ContactHero />
        <ContactCardsSection />
        <VisitSection />
        <div className={styles.homeTestimonialsWrap}>
          <HomeTestimonialsSection />
        </div>
        <AppointmentFormSection />
      </main>
    </>
  );
}
