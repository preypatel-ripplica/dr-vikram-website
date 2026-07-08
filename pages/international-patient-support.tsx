import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TestimonialsSection as HomeTestimonialsSection } from "@/components/home/TestimonialsSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import styles from "@/styles/PatientSupportPage.module.css";

const countries = [
  "UAE",
  "UK",
  "USA",
  "Canada",
  "Nigeria",
  "Kenya",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Maldives",
  "Oman",
  "Kuwait",
];

const consultationSteps = [
  {
    icon: "/assets/figma/patient-support/report.svg",
    label: "Share reports via email or WhatsApp",
  },
  {
    icon: "/assets/figma/patient-support/video.svg",
    label: "Video call within 48 hours",
  },
  {
    icon: "/assets/figma/patient-support/plan.svg",
    label: "Written plan + cost estimate",
  },
  {
    icon: "/assets/figma/patient-support/travel.svg",
    label: "Travel only once confirmed",
  },
];

const timelineSteps = [
  {
    step: "Step 1",
    phase: "Start here",
    title: "Video Consultation",
    copy: "Share your reports via email or WhatsApp. We schedule a secure video call with Dr. Vikram within 48 hours — no travel needed for the first opinion.",
    icon: "/assets/figma/patient-support/timeline-video.svg",
    tone: "blue",
  },
  {
    step: "Step 2",
    phase: "Before you travel",
    title: "Travel & Visa",
    copy: "Our international coordinator provides a medical visa support letter and connects you to trusted travel partners in your country.",
    icon: "/assets/figma/patient-support/timeline-travel.svg",
    tone: "cyan",
  },
  {
    step: "Step 3",
    phase: "Before you travel",
    title: "Admission & Stay",
    copy: "We coordinate hospital admission, private room preferences, interpreter services, and nearby accommodation for family.",
    icon: "/assets/figma/patient-support/timeline-stay.svg",
    tone: "orange",
  },
  {
    step: "Step 4",
    phase: "Ongoing",
    title: "Remote Follow-Up",
    copy: "After you return home, care continues via teleconsultation, shared reports, and direct messaging with Dr. Vikram's clinical team.",
    icon: "/assets/figma/patient-support/timeline-followup.svg",
    tone: "green",
  },
];

const checklistItems = [
  "Video consultation completed",
  "Medical visa letter requested",
  "Reports shared with our team",
  "Travel dates confirmed",
  "Flight booked",
  "Accommodation arranged",
  "Admission date confirmed",
  "Surgery date planned",
  "Follow-up plan received",
];

const faqs = [
  "Do I need to travel before deciding on treatment?",
  "What language support is available?",
  "How long should I plan to stay?",
  "What language support is available?",
  "How long should I plan to stay?",
  "How are follow-ups managed after I return home?",
  "How long should I plan to stay?",
  "How are follow-ups managed after I return home?",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image
          alt=""
          fill
          sizes="20px"
          src="/assets/figma/patient-support/shield-plus.svg"
        />
      </span>
      <span>{children}</span>
    </p>
  );
}

function CenteredHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className={styles.centeredHeading}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2>{title}</h2>
    </div>
  );
}

function ConsultationCard() {
  return (
    <aside className={styles.consultCard}>
      <h2>Start your international consultation</h2>

      <div className={styles.stepList}>
        {consultationSteps.map((step) => (
          <div className={styles.stepItem} key={step.label}>
            <span className={styles.stepIcon}>
              <Image alt="" height={14} src={step.icon} width={14} />
            </span>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <a className={styles.videoButton} href="#contact">
        Book video consultation
      </a>

      <p className={styles.availability}>Available Mon-Sat · 8 am-8 pm IST</p>
    </aside>
  );
}

function InternationalSupportHero() {
  return (
    <section
      className={styles.heroSection}
      data-faulty-node-skipped="146:16220"
      data-node-id="146:14038"
    >
      <div className={styles.heroInner} data-node-id="146:16219">
        <div className={styles.heroCopy}>
          <div className={styles.headingGroup}>
            <SectionLabel>International Patient Support</SectionLabel>
            <div className={styles.heroText}>
              <h1>Expert urological care, wherever you are</h1>
              <p>
                We have supported patients from 35+ countries. Your journey to
                Dr. Vikram&apos;s care starts with a video call — no flight
                required to get a clear diagnosis and treatment plan.
              </p>
            </div>
          </div>

          <div className={styles.countryWrap}>
            {countries.map((country) => (
              <span className={styles.countryPill} key={country}>
                {country}
              </span>
            ))}
          </div>
        </div>

        <ConsultationCard />
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className={styles.howSection} data-node-id="146:15595">
      <div className={styles.sectionStack}>
        <CenteredHeading
          eyebrow="How it works"
          title="Four steps from first contact to safe return home"
        />

        <div className={styles.timelinePanel}>
          <div className={styles.timelineRail} />
          <div className={styles.timelineList}>
            {timelineSteps.map((item) => (
              <article className={styles.timelineItem} key={item.title}>
                <div className={styles.timelineIcon}>
                  <Image alt="" height={24} src={item.icon} width={24} />
                </div>
                <div className={styles.timelineCard}>
                  <div className={styles.timelineCopy}>
                    <div className={styles.stepMeta}>
                      <span className={styles[item.tone]}>{item.step}</span>
                      <i />
                      <small>{item.phase}</small>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TravelChecklistSection() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => new Set());
  const completed = checkedItems.size;
  const progress = `${(completed / checklistItems.length) * 100}%`;

  function toggleItem(index: number) {
    setCheckedItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section className={styles.checklistSection} data-node-id="146:15708">
      <div className={styles.sectionStack}>
        <CenteredHeading eyebrow="Travel checklist" title="Track your preparation" />

        <div className={styles.checklistPanel}>
          <div className={styles.checklistTable}>
            {checklistItems.map((item, index) => {
              const isChecked = checkedItems.has(index);

              return (
                <label
                  className={`${styles.checklistRow} ${
                    isChecked ? styles.checklistRowActive : ""
                  }`}
                  key={item}
                >
                  <span>{item}</span>
                  <input
                    checked={isChecked}
                    onChange={() => toggleItem(index)}
                    type="checkbox"
                  />
                  <span className={styles.fakeCheckbox}>
                    {isChecked ? (
                      <Image
                        alt=""
                        height={12}
                        src="/assets/figma/patient-support/check.svg"
                        width={12}
                      />
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>

          <aside className={styles.checklistAside}>
            <div className={styles.progressCard}>
              <strong>{completed}</strong>
              <span>of {checklistItems.length} items done</span>
              <div className={styles.progressTrack}>
                <span style={{ width: progress }} />
              </div>
              <p>Start checking off items as you prepare for your visit.</p>
            </div>

            <a className={styles.helpCard} href="tel:+919871008256">
              <span className={styles.helpIcon}>
                <Image
                  alt=""
                  height={16}
                  src="/assets/figma/patient-support/help-phone.svg"
                  width={16}
                />
              </span>
              <span>
                <strong>Need help right now?</strong>
                <small>Helpline available 24/7</small>
              </span>
              <Image
                alt=""
                height={16}
                src="/assets/figma/patient-support/help-arrow.svg"
                width={16}
              />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

function InternationalFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection} data-node-id="146:18606">
      <div className={styles.faqHeading}>
        <SectionLabel>Common questions</SectionLabel>
        <h2>International patient FAQs</h2>
      </div>

      <div className={styles.faqList}>
        {faqs.map((question, index) => {
          const isOpen = openIndex === index;

          return (
            <div className={styles.faqItem} key={`${question}-${index}`}>
              <button
                aria-expanded={isOpen}
                className={styles.faqButton}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{question}</span>
                <Image
                  alt=""
                  className={isOpen ? styles.chevronOpen : undefined}
                  height={18}
                  src="/assets/figma/patient-support/faq-chevron.svg"
                  width={18}
                />
              </button>
              {isOpen ? (
                <p className={styles.faqAnswer}>
                  Dr. Vikram&apos;s team will guide you with the next practical
                  step based on your reports and travel plan.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className={styles.finalCta} data-node-id="146:16031">
      <div className={styles.finalCtaHeading}>
        <SectionLabel>Advanced urology clinic</SectionLabel>
        <div>
          <h2>
            Ready to <span>take control</span> of your health?
          </h2>
          <p>
            Share your reports, plan your visit, and get practical support
            before and after your consultation.
          </p>
        </div>
      </div>
      <div className={styles.finalCtaActions}>
        <a className={styles.primaryCta} href="#contact">
          Book appointment
        </a>
        <Link className={styles.secondaryCta} href="/contact-us">
          Contact us
        </Link>
      </div>
    </section>
  );
}

export default function PatientSupportPage() {
  return (
    <>
      <Head>
        <title>International Patient Support | Dr. Vikram</title>
        <meta
          content="International patient support for Dr. Vikram's urology and robotic surgery care."
          name="description"
        />
      </Head>

      <main className={styles.patientSupportPage}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.heroSection,
            styles.howSection,
            styles.checklistSection,
            styles.faqSection,
            styles.homeTestimonialsWrap,
            styles.appointmentWrap,
            styles.finalCta,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <InternationalSupportHero />
        <HowItWorksSection />
        <TravelChecklistSection />
        <InternationalFaqSection />
        <div className={styles.homeTestimonialsWrap}>
          <HomeTestimonialsSection />
        </div>
        <div className={styles.appointmentWrap} data-node-id="146:15972">
          <AppointmentSection />
        </div>
        <FinalCtaSection />
      </main>
    </>
  );
}
