import { useState } from "react";
import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";
import { ArrowIcon, SectionEyebrow } from "./TreatmentShared";

type TreatmentFaqProps = {
  faqs: TreatmentData["faqs"];
};

export function TreatmentFaq({ faqs }: TreatmentFaqProps) {
  const [openQuestion, setOpenQuestion] = useState(
    faqs.items[0]?.question ?? "",
  );

  return (
    <section
      className={styles.contentSection}
      data-node-id="76:33948"
      id="common-questions"
    >
      <SectionEyebrow>{faqs.eyebrow}</SectionEyebrow>
      <h2>{faqs.title}</h2>
      <div className={styles.faqList}>
        {faqs.items.map((faq) => (
          <div
            className={styles.faqItem}
            data-open={openQuestion === faq.question}
            key={faq.question}
          >
            <button
              aria-expanded={openQuestion === faq.question}
              className={styles.faqQuestion}
              onClick={(event) => {
                event.preventDefault();
                setOpenQuestion((current) =>
                  current === faq.question ? "" : faq.question,
                );
              }}
              type="button"
            >
              <span>{faq.question}</span>
              <ArrowIcon />
            </button>
            <div className={styles.faqAnswer} role="region">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
