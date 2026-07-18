import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TestimonialsSection as HomeTestimonialsSection } from "@/components/home/TestimonialsSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { breadcrumbGraph, faqGraph, itemListGraph, pageGraph } from "@/lib/seo";
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
  {
    question: "Do I need to travel before deciding on treatment?",
    answer:
      "No. You can share reports first and schedule a video consultation. Dr. Vikram's team can explain the likely diagnosis, treatment options, estimated stay, and whether travel is needed before you book flights.",
  },
  {
    question: "What reports should I share before the video consultation?",
    answer:
      "Share recent scans, blood and urine tests, biopsy or PSA reports if relevant, discharge summaries, current prescriptions, and a short symptom timeline. Clear photos or PDFs are usually enough for the first review.",
  },
  {
    question: "What language support is available?",
    answer:
      "English and Hindi support is available directly. For other languages, the team can help plan interpreter support when required, especially for hospital admission, consent, and discharge instructions.",
  },
  {
    question: "How long should I plan to stay?",
    answer:
      "The stay depends on diagnosis and procedure. Many evaluation visits are short, while surgery may require extra days for admission, recovery, and fit-to-fly review. The team will suggest a practical travel window after reviewing reports.",
  },
  {
    question: "Can my family travel with me?",
    answer:
      "Yes. A family member or attendant can usually travel with the patient. The coordinator can guide you on hospital stay, nearby accommodation, and planning around the patient's admission and follow-up.",
  },
  {
    question: "Will I receive a cost estimate before travel?",
    answer:
      "After report review, the team can share an estimated treatment plan and cost range where possible. Final cost may change if tests, diagnosis, procedure, or hospital-stay needs change after examination.",
  },
  {
    question: "How are follow-ups managed after I return home?",
    answer:
      "Follow-ups can be managed through video consultation, phone, WhatsApp, and shared reports. Dr. Vikram's team will explain medicines, warning signs, stent removal if relevant, and timing for repeat tests or scans.",
  },
  {
    question: "What happens if my condition changes before I travel?",
    answer:
      "Contact the clinic team immediately and share updated symptoms or reports. If there are warning signs such as fever, severe pain, or inability to pass urine, seek urgent care locally first.",
  },
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
  const { t } = useI18n();

  return (
    <div className={styles.centeredHeading}>
      <SectionLabel>{t(eyebrow)}</SectionLabel>
      <h2>{t(title)}</h2>
    </div>
  );
}

function ConsultationCard() {
  const { t } = useI18n();

  return (
    <aside className={styles.consultCard}>
      <h2>{t("Start your international consultation")}</h2>

      <div className={styles.stepList}>
        {consultationSteps.map((step) => (
          <div className={styles.stepItem} key={step.label}>
            <span className={styles.stepIcon}>
              <Image alt="" height={14} src={step.icon} width={14} />
            </span>
            <span>{t(step.label)}</span>
          </div>
        ))}
      </div>

      <a className={styles.videoButton} href="#contact">
        {t("Book video consultation")}
      </a>

      <p className={styles.availability}>{t("Available Mon-Sat · 8 am-8 pm IST")}</p>
    </aside>
  );
}

function InternationalSupportHero() {
  const { t } = useI18n();

  return (
    <section
      className={styles.heroSection}
      data-faulty-node-skipped="146:16220"
      data-node-id="146:14038"
    >
      <div className={styles.heroInner} data-node-id="146:16219">
        <div className={styles.heroCopy}>
          <div className={styles.headingGroup}>
            <SectionLabel>{t("International Patient Support")}</SectionLabel>
            <div className={styles.heroText}>
              <h1>{t("Expert urological care, wherever you are")}</h1>
              <p>
                {t("We have supported patients from 35+ countries. Your journey to Dr. Vikram's care starts with a video call — no flight required to get a clear diagnosis and treatment plan.")}
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
  const { t } = useI18n();

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
                      <span className={styles[item.tone]}>{t(item.step)}</span>
                      <i />
                      <small>{t(item.phase)}</small>
                    </div>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.copy)}</p>
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
  const { t } = useI18n();
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
                  <span>{t(item)}</span>
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
              <span>{t("of")} {checklistItems.length} {t("items done")}</span>
              <div className={styles.progressTrack}>
                <span style={{ width: progress }} />
              </div>
              <p>{t("Start checking off items as you prepare for your visit.")}</p>
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
                <strong>{t("Need help right now?")}</strong>
                <small>{t("Helpline available 24/7")}</small>
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
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection} data-node-id="146:18606">
      <div className={styles.faqHeading}>
        <SectionLabel>{t("Common questions")}</SectionLabel>
        <h2>{t("International patient FAQs")}</h2>
      </div>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div className={styles.faqItem} key={faq.question}>
              <button
                aria-expanded={isOpen}
                className={styles.faqButton}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{t(faq.question)}</span>
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
                  {t(faq.answer)}
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
  const { t, localizeHref } = useI18n();

  return (
    <section className={styles.finalCta} data-node-id="146:16031">
      <div className={styles.finalCtaHeading}>
        <SectionLabel>{t("Advanced urology clinic")}</SectionLabel>
        <div>
          <h2>
            {t("Ready to")} <span>{t("take control")}</span> {t("of your health?")}
          </h2>
          <p>
            {t("Share your reports, plan your visit, and get practical support before and after your consultation.")}
          </p>
        </div>
      </div>
      <div className={styles.finalCtaActions}>
        <a className={styles.primaryCta} href="#contact">
          {t("Book appointment")}
        </a>
        <Link className={styles.secondaryCta} href={localizeHref("/contact-us")}>
          {t("Contact us")}
        </Link>
      </div>
    </section>
  );
}

export default function PatientSupportPage() {
  const title = "International Patient Support | Dr. Vikram";
  const description = "International patient support for Dr. Vikram's urology and robotic surgery care, including report review, video consultation, travel planning, and follow-up.";

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        jsonLd={[
          pageGraph({ path: "/international-patient-support", title, description }),
          itemListGraph({
            path: "/international-patient-support",
            name: "International patient journey",
            items: timelineSteps.map((step) => step.title),
          }),
          itemListGraph({
            path: "/international-patient-support#countries",
            name: "International patient countries",
            items: countries,
          }),
          faqGraph(faqs),
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "International Patient Support", path: "/international-patient-support" },
          ]),
        ]}
      />

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
