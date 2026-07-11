import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { useI18n } from "@/lib/i18n-context";
import styles from "@/styles/TestimonialsPage.module.css";

const stats = [
  {
    value: "10000 +",
    label: "Happy patients",
    icon: "/images/testimonials/icon-patients.svg",
    tone: "green",
  },
  {
    value: "500+",
    label: "International patients",
    icon: "/images/testimonials/icon-plane.svg",
    tone: "blue",
  },
  {
    value: "4.9",
    label: "Average rating",
    icon: "/images/testimonials/icon-star.svg",
    tone: "amber",
  },
];

const filters = [
  "All",
  "Kidney Stone",
  "Prostate",
  "Robotic Surgery",
  "Cancer",
  "Men's Health",
];

type Story = {
  id: string;
  category: (typeof filters)[number];
  date: string;
  featured?: boolean;
  name: string;
  meta: string;
  badge: string;
  image: string;
  quote: string;
};

const stories: Story[] = [
  {
    id: "rahul",
    category: "Kidney Stone",
    date: "Mar 2025",
    featured: true,
    name: "Rahul Gupta",
    meta: "24M, India",
    badge: "Kidney Stone · Mar 2025",
    image: "/assets/figma/testimonials/rahul-gupta-figma.png",
    quote:
      "Dr. Vikram explained my scan in a way I could finally understand. I had been anxious about surgery, but he walked me through why the stone needed treatment, what the safer options were, and what recovery would look like. By the end of the visit, my family and I felt clear and calm.",
  },
  {
    id: "raghav",
    category: "Cancer",
    date: "Apr 2025",
    featured: true,
    name: "Raghav Chaddha",
    meta: "24M, India",
    badge: "Cancer review · Apr 2025",
    image: "/assets/figma/testimonials/raghav-chaddha.png",
    quote:
      "The consultation was calm and practical from the first few minutes. Dr. Vikram reviewed every report, explained what the results meant, and told us which tests were actually needed next. It felt structured, honest, and much less frightening than trying to understand everything online.",
  },
  {
    id: "ayush",
    category: "Robotic Surgery",
    date: "Jun 2025",
    featured: true,
    name: "Ayush Pareekh",
    meta: "24M, India",
    badge: "Robotic Surgery · Jun 2025",
    image: "/assets/figma/testimonials/ayush-pareekh.png",
    quote:
      "The team discussed the procedure, hospital stay, and recovery in simple language before we decided. I appreciated that nothing was rushed and every practical detail was covered, from admission to follow-up. That made the robotic surgery decision feel informed instead of overwhelming.",
  },
  {
    id: "david",
    category: "Prostate",
    date: "Oct 2024",
    featured: true,
    name: "David L.",
    meta: "24M, United Kingdom",
    badge: "Prostate Management · Oct 2024",
    image: "/images/testimonials/featured-david.png",
    quote:
      "Dr. Vikram was thorough, honest, and compassionate. He explained every stage of my biopsy results calmly and put together a very clear management plan. The follow-up is available by video, so I only travel from London when absolutely necessary. It feels like true continuity of care.",
  },
  {
    id: "ramesh",
    category: "Kidney Stone",
    date: "Mar 2025",
    name: "Ramesh K.",
    meta: "48M, India",
    badge: "RIRS · Mar 2025",
    image: "/images/testimonials/figma-patient-1.png",
    quote:
      "I had suffered with kidney stones for years and tried every home remedy before meeting Dr. Vikram. He explained the RIRS procedure clearly, including the stent, recovery timeline, and prevention plan. The procedure and follow-up were smooth, and I knew whom to call at every step.",
  },
  {
    id: "ahmed",
    category: "Kidney Stone",
    date: "Jan 2025",
    name: "Ahmed Al-Rashidi",
    meta: "52M, UAE",
    badge: "PCNL · Jan 2025",
    image: "/images/testimonials/story-ahmed.png",
    quote:
      "I came from Dubai for a complex stone and wanted clarity before travelling. The plan was explained in advance, my reports were reviewed carefully, and the hospital stay was handled with care. The team helped with the practical details, which made the whole process easier for my family.",
  },
  {
    id: "george",
    category: "Robotic Surgery",
    date: "Dec 2024",
    name: "George O.",
    meta: "57M, Kenya",
    badge: "Robotic surgery · Dec 2024",
    image: "/images/testimonials/figma-patient-2.png",
    quote:
      "I travelled for robotic surgery after a video consultation, so I needed the plan to be very clear. Dr. Vikram explained the surgery, risks, hospital stay, and recovery milestones before I booked my travel. Follow-up happened on time and I always knew the next step.",
  },
  {
    name: "Meera D.",
    id: "meera",
    category: "Prostate",
    date: "Apr 2025",
    meta: "45F, India",
    badge: "Bladder care · Apr 2025",
    image: "/images/testimonials/figma-patient-3.png",
    quote:
      "I was embarrassed to talk about urinary leakage and kept delaying consultation. Dr. Vikram made the conversation comfortable, asked practical questions, and explained the tests without making me feel judged. The treatment plan was simple to follow and gave me confidence again.",
  },
  {
    id: "manish",
    category: "Men's Health",
    date: "Nov 2024",
    name: "Manish S.",
    meta: "42M, India",
    badge: "Men's health · Nov 2024",
    image: "/images/testimonials/story-ramesh.png",
    quote:
      "The consultation was private, direct, and respectful. I got a clear set of tests, treatment choices, and a realistic timeline without feeling judged or rushed. It helped to speak with someone who treated the concern seriously but also made it feel manageable.",
  },
];

const featuredStories = stories.filter((story) => story.featured);

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

function StarRow({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? styles.smallStars : styles.starRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          alt=""
          aria-hidden="true"
          key={index}
          src="/images/testimonials/star-row.svg"
        />
      ))}
    </span>
  );
}

function FeaturedStorySection({
  activeIndex,
  activeStory,
  total,
  onNext,
  onPrevious,
}: {
  activeIndex: number;
  activeStory: Story;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const { t } = useI18n();

  return (
    <section className={styles.featuredSection} data-node-id="148:24781" id="featured-story">
      <article className={styles.featuredCard} key={activeStory.id}>
        <div className={styles.featuredImage}>
          <Image
            alt={`${activeStory.name} patient story`}
            fill
            sizes="280px"
            src={activeStory.image}
          />
          <div className={styles.featuredPatient}>
            <strong>{activeStory.name}</strong>
            <span>{t(activeStory.meta)}</span>
          </div>
        </div>

        <div className={styles.featuredContent}>
          <div>
            <div className={styles.featuredMeta}>
              <span className={styles.featuredMetaLeft}>
                <StarRow />
                <span className={styles.featuredPill}>{t(activeStory.badge)}</span>
              </span>
              <time>{activeStory.date}</time>
            </div>
            <blockquote>&quot;{t(activeStory.quote)}&quot;</blockquote>
          </div>

          <div className={styles.featuredControls}>
            <button aria-label={t("Previous testimonial")} onClick={onPrevious} type="button">
              ‹
            </button>
            <span className={styles.progressPill} aria-hidden="true">
              <span className={styles.progressTrack}>
                <span
                  className={styles.progressFill}
                  style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                />
              </span>
              {Array.from({ length: total - 1 }).map((_, index) => (
                <span className={styles.progressDot} key={index} />
              ))}
            </span>
            <button aria-label={t("Next testimonial")} onClick={onNext} type="button">
              ›
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

function AllTestimonialsSection({
  activeFilter,
  onFilterChange,
  onStorySelect,
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onStorySelect: (story: Story) => void;
}) {
  const { t } = useI18n();
  const filteredStories = useMemo(
    () =>
      activeFilter === "All"
        ? stories
        : stories.filter((story) => story.category === activeFilter),
    [activeFilter],
  );

  return (
    <section className={styles.allStoriesSection} data-node-id="148:24370">
      <div className={styles.storiesHeader}>
        <div>
          <p className={styles.label}>
            <ShieldPlusIcon />
            <span>{t("Stories by condition")}</span>
          </p>
          <h2>{t("All testimonials")}</h2>
        </div>

        <div className={styles.filterRow} aria-label={t("Testimonial filters")}>
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={activeFilter === filter ? styles.filterActive : undefined}
              key={filter}
              onClick={() => onFilterChange(filter)}
              type="button"
            >
              {t(filter)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.storyGrid}>
        {filteredStories.map((story) => (
          <article className={styles.storyCard} key={story.id}>
            <div className={styles.storyImage}>
              <Image alt="" fill sizes="(max-width: 900px) 100vw, 410px" src={story.image} />
              <div className={styles.storyImageText}>
                <strong>{story.name}</strong>
                <span>{t(story.meta)}</span>
              </div>
            </div>
            <div className={styles.storyBody}>
              <div className={styles.storyTop}>
                <StarRow small />
                <span className={styles.storyBadge}>{t(story.badge)}</span>
              </div>
              <p>&quot;{t(story.quote)}&quot;</p>
              <button onClick={() => onStorySelect(story)} type="button">
                {t("Read full story")} →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function TestimonialsPage() {
  const { t } = useI18n();
  const [activeStoryId, setActiveStoryId] = useState(featuredStories[0]?.id ?? stories[0].id);
  const [activeFilter, setActiveFilter] = useState("All");
  const activeStory = stories.find((story) => story.id === activeStoryId) ?? stories[0];
  const activeFeaturedIndex = Math.max(
    0,
    featuredStories.findIndex((story) => story.id === activeStory.id),
  );

  function showPrevious() {
    setActiveStoryId((currentId) => {
      const currentIndex = featuredStories.findIndex((story) => story.id === currentId);
      const nextIndex =
        currentIndex <= 0 ? featuredStories.length - 1 : currentIndex - 1;
      return featuredStories[nextIndex]?.id ?? currentId;
    });
  }

  function showNext() {
    setActiveStoryId((currentId) => {
      const currentIndex = featuredStories.findIndex((story) => story.id === currentId);
      const nextIndex =
        currentIndex < 0 ? 0 : (currentIndex + 1) % featuredStories.length;
      return featuredStories[nextIndex]?.id ?? currentId;
    });
  }

  function showStory(story: Story) {
    setActiveStoryId(story.id);

    document.getElementById("featured-story")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  useEffect(() => {
    const timer = window.setInterval(showNext, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Testimonials | Dr. Vikram</title>
        <meta
          content="Patient testimonials and recovery stories from people treated by Dr. Vikram."
          name="description"
        />
      </Head>

      <main className={styles.page}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.hero,
            styles.featuredSection,
            styles.allStoriesSection,
            styles.appointmentWrap,
            styles.sectionWrap,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <section className={styles.hero}>
          <div className={styles.heroContent} data-node-id="148:24780">
            <p className={styles.label}>
              <ShieldPlusIcon />
              <span>{t("Patient Support · Testimonials")}</span>
            </p>

            <div className={styles.heroText}>
              <h1>
                {t("Real patients,")}
                <br />
                {t("real recoveries")}
              </h1>
              <p>
                {t("Every story is from a patient who chose to share so others could decide with confidence.")}
              </p>
            </div>

            <div className={styles.statsRow}>
              {stats.map((stat) => (
                <article className={styles.statCard} key={stat.label}>
                  <span className={`${styles.statIcon} ${styles[stat.tone]}`}>
                    <img alt="" src={stat.icon} />
                  </span>
                  <span>
                    <strong>{stat.value}</strong>
                    <small>{t(stat.label)}</small>
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.heroImage} data-node-id="203:17078">
            <Image
              alt={t("Patient consultation support")}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 620px"
              src="/images/testimonials/hero-consultation-pexels.jpg"
            />
          </div>
        </section>

        <FeaturedStorySection
          activeIndex={activeFeaturedIndex}
          activeStory={activeStory}
          total={featuredStories.length}
          onNext={showNext}
          onPrevious={showPrevious}
        />
        <AllTestimonialsSection
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onStorySelect={showStory}
        />
        <div className={styles.appointmentWrap}>
          <AppointmentSection />
        </div>
        <div className={styles.sectionWrap}>
          <FinalCtaSection />
        </div>
      </main>
    </>
  );
}
