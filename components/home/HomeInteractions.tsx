"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/Home.module.css";

const roboticSlides = [
  {
    eyebrow: "Precision control",
    title: "More clarity for delicate urology procedures",
    copy: "Robotic systems support high-definition magnified views, helping the surgeon work around fine structures with greater confidence.",
    left: "Standard view",
    right: "Robotic-assisted view",
    notes: ["3D magnified view", "Better depth perception", "Fine structure visibility"],
    action: "Explore robotic surgery",
  },
  {
    eyebrow: "Range of motion",
    title: "More control in narrow surgical spaces",
    copy: "Robotic instruments can support finer, wrist-like motion for selected procedures while the surgeon remains fully in control.",
    left: "Manual",
    right: "Robotic-assisted",
    notes: ["~180° movement range", "360° instrument range", "Surgeon controlled"],
    action: "Check suitability",
  },
];

const testimonials = [
  {
    name: "Rahul Gupta",
    meta: "24, Male",
    rating: "4.2",
    quote:
      "Most experienced learnt doctor in the field of pain medicine. Very humble to the patients and best mentor a student can have.",
  },
  {
    name: "Ankit Sharma",
    meta: "38, Male",
    rating: "4.8",
    quote:
      "The consultation was calm and clear. The treatment options were explained without pressure, which helped my family decide.",
  },
  {
    name: "Rohit Mehra",
    meta: "51, Male",
    rating: "4.7",
    quote:
      "From diagnosis to follow-up, the process felt organized. I knew what reports to bring and what to expect after treatment.",
  },
];

export default function HomeInteractions() {
  const [roboticIndex, setRoboticIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const robotic = roboticSlides[roboticIndex];

  const visibleTestimonials = useMemo(
    () =>
      testimonials.map(
        (_, index) => testimonials[(testimonialIndex + index) % testimonials.length],
      ),
    [testimonialIndex],
  );

  return (
    <>
      <section className={styles.roboticSection} id="robotic-surgery">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>
            <span className={styles.dotIcon}>+</span>
            <span>{robotic.eyebrow}</span>
          </p>
          <h2>Robotic support where precision matters.</h2>
        </div>

        <div className={styles.roboticPanel}>
          <div className={styles.compareCard}>
            <div className={styles.segmentedControl}>
              {roboticSlides.map((slide, index) => (
                <button
                  aria-pressed={roboticIndex === index}
                  key={slide.left}
                  onClick={() => setRoboticIndex(index)}
                  type="button"
                >
                  {index === 0 ? "Visibility" : "Movement"}
                </button>
              ))}
            </div>
            <div className={styles.compareVisual}>
              <div>{robotic.left}</div>
              <div>{robotic.right}</div>
              <span />
            </div>
            <p>Slide to compare standard visibility with robotic-assisted planning.</p>
          </div>

          <div className={styles.roboticCopy}>
            <h3>{robotic.title}</h3>
            <p>{robotic.copy}</p>
            <div className={styles.roboticTags}>
              {robotic.notes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
            <blockquote>
              The robot does not operate by itself. Dr. Vikram controls every
              movement while the system supports precision.
            </blockquote>
            <a href="#contact">{robotic.action}</a>
          </div>
        </div>
      </section>

      <section className={styles.testimonialSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>
            <span className={styles.dotIcon}>+</span>
            <span>Testimonials</span>
          </p>
          <h2>Patients value clarity, humility and structured care.</h2>
        </div>
        <div className={styles.testimonialTrack}>
          {visibleTestimonials.map((item) => (
            <article className={styles.testimonialCard} key={item.name}>
              <div className={styles.testimonialTop}>
                <div className={styles.avatar}>{item.name.charAt(0)}</div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.meta}</p>
                </div>
                <strong>★ {item.rating}</strong>
              </div>
              <blockquote>“{item.quote}”</blockquote>
            </article>
          ))}
        </div>
        <div className={styles.carouselControls}>
          <button
            aria-label="Previous testimonial"
            onClick={() =>
              setTestimonialIndex((value) =>
                value === 0 ? testimonials.length - 1 : value - 1,
              )
            }
            type="button"
          >
            ←
          </button>
          <button
            aria-label="Next testimonial"
            onClick={() =>
              setTestimonialIndex((value) => (value + 1) % testimonials.length)
            }
            type="button"
          >
            →
          </button>
        </div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.contactInfo}>
          <p className={styles.sectionLabel}>
            <span className={styles.dotIcon}>+</span>
            <span>Treatments</span>
          </p>
          <h2>Talk to the clinic team and plan your next step.</h2>
          <div className={styles.contactCards}>
            <a href="mailto:drvikram.uro@gmail.com">
              <span>Email us</span>
              <strong>drvikram.uro@gmail.com</strong>
            </a>
            <a href="tel:+919871008256">
              <span>Call us</span>
              <strong>9871008256</strong>
            </a>
          </div>
        </div>
        <form className={styles.appointmentForm}>
          <div className={styles.formRow}>
            <input aria-label="Your name" placeholder="Your name" />
            <input aria-label="Email" placeholder="Email" type="email" />
          </div>
          <div className={styles.formRow}>
            <input aria-label="Whatsapp number" placeholder="Whatsapp no." />
            <input aria-label="Location" placeholder="Location" />
          </div>
          <textarea aria-label="Describe your problem" placeholder="Describe your problem..." />
          <label className={styles.uploadField}>
            <input type="file" />
            <span>+ Upload any relevant photo or doc</span>
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.sectionLabel}>
          <span className={styles.dotIcon}>+</span>
          <span>Advanced urology clinic</span>
        </p>
        <h2>Ready to take control of your health?</h2>
        <p>
          Book a consultation to review your symptoms, reports, and treatment
          options with a clear next-step plan.
        </p>
        <div>
          <a className={styles.primaryAction} href="#contact">
            Book appointment
          </a>
          <a className={styles.secondaryAction} href="tel:+919871008256">
            Call clinic
          </a>
        </div>
      </section>
    </>
  );
}
