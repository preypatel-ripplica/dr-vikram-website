import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import { SeoHead } from "@/components/shared/SeoHead";
import { useI18n } from "@/lib/i18n-context";
import { breadcrumbGraph, itemListGraph, pageGraph } from "@/lib/seo";
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
  "Surgery",
  "International Patients",
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
    id: "pushpender-kumar",
    category: "Surgery",
    date: "14 Jun 2024",
    featured: true,
    name: "Pushpender Kumar",
    meta: "Google review",
    badge: "Surgery · Google review",
    image: "/assets/figma/testimonials/rahul-gupta-figma.png",
    quote:
      "Dr. Vikram Barua sir is so professional and he performed my surgery very well. I am so satisfied with his treatment and his whole team is so excellent and caring for patients. Overall the service is good. I will refer to my friends.",
  },
  {
    id: "khalifa-khalifa",
    category: "International Patients",
    date: "5 Dec 2022",
    featured: true,
    name: "Khalifa Khalifa",
    meta: "Translated Google review · Iraq",
    badge: "International patient · Iraq",
    image: "/images/testimonials/featured-david.png",
    quote:
      "Peace be upon you. I am the Iraqi citizen Abdullah Aasi Al-Sanad from Anbar Governorate, Al-Qaim district. I was suffering from urinary tract blockage for more than 4 years and severe lung inflammation for more than 20 years. Through translator Mohammed Khalifa Abu Youssef, I travelled to India and underwent all tests at Artemis Hospital. The operation was successful, praise be to God. Now I feel a great improvement, noting that the operation was performed 4 days ago. I thank Dr. Vikram, the distinguished team, Dr. Shivan Shou, all nurses in the ward, and the cleaning staff for this excellent service. Greetings to everyone.",
  },
  {
    id: "lawal-bello",
    category: "International Patients",
    date: "18 Sept 2023",
    featured: true,
    name: "Lawal Bello",
    meta: "Google review · Nigeria",
    badge: "Prostate · International patient",
    image: "/assets/figma/testimonials/raghav-chaddha.png",
    quote:
      "My name is Lawal Bello Musa from Nigeria. I had trilober enlargement lateral lobes, which my local doctor in my country was unable to treat, until I was referred to Dr. Vikram Barua's urology clinic in Artemis Hospital. After examination, Dr. Vikram advised me for UroLift placement, which was done successfully in February 2023. Now I can pass urine very well. I came back for follow-up this September 10, 2023. Now everything is okay and I am going back to my country happy. Thank you, Dr. Vikram Barua.",
  },
  {
    id: "rupesh-kaushik",
    category: "Kidney Stone",
    date: "3 Dec 2022",
    featured: true,
    name: "Rupesh Kaushik",
    meta: "Google review",
    badge: "Kidney calculus · PCNL",
    image: "/images/testimonials/figma-patient-1.png",
    quote:
      "My father was operated for kidney calculus, which was quite bigger in size. Doctor Kaushik was very polite throughout the process, starting from the diagnosis till the PCNL and DJ stenting was done. He is equipped with all the technical expertise and reciprocates the most apt behaviour and patient-centric approach. We are very thankful to him as everything went smoothly. In addition, I wanted to thank everyone at the hospital, starting from housekeeping, Mr. Amit Jha, and the daily caretaking nursing and medical staff, Mr. Gautam, Mr. Amit, and Ms. Alice. They all assisted my dad in every way possible to make him feel comfortable during and even post surgery.",
  },
  {
    id: "arpana-mehalawat",
    category: "Prostate",
    date: "26 Nov 2022",
    featured: true,
    name: "Arpana Mehalawat",
    meta: "Google review",
    badge: "Follow-up care · Google review",
    image: "/images/testimonials/story-george.png",
    quote:
      "Since 10 years, I have been following up with Dr. Vikram Barua. He explained my health issues so well and suggested the best decision every time I met him. Thank you for everything.",
  },
  {
    id: "akshay-agarwal",
    category: "Surgery",
    date: "9 Dec 2022",
    featured: true,
    name: "CA. Akshay Agarwal",
    meta: "Google review",
    badge: "Surgery · Google review",
    image: "/images/testimonials/story-ramesh.png",
    quote:
      "Thanks Dr. Vikram for operating on my father. He and his urologist team are very supportive and very careful. The Artemis nursing team is also very caring and intelligent. The whole team explained the procedure and treatment to us in a very calm way.",
  },
  {
    id: "jasveer-sheoran",
    category: "Surgery",
    date: "18 Mar 2023",
    featured: true,
    name: "Jasveer Sheoran",
    meta: "Google review",
    badge: "Surgery · Google review",
    image: "/images/testimonials/figma-patient-2.png",
    quote:
      "Dr. Vikram Barua did surgery for me. I am totally fine and getting discharged today. He treated me professionally and so well. I am so comfortable here with Dr. Vikram and the whole urology team. They are so professional and excellent. The nursing staff took good care of me during my hospital stay. Thank you to everyone.",
  },
  {
    id: "carolyn-kyalo",
    category: "International Patients",
    date: "8 Oct 2024",
    featured: true,
    name: "Carolyn Kyalo",
    meta: "Google review",
    badge: "Surgery · Google review",
    image: "/images/testimonials/story-ahmed.png",
    quote:
      "Dr. Vikram provided excellent service to my husband. We got immediate attention on the first appointment. The surgery was very successful and performed with professional service and updates. We were amazed by the quick recovery. My husband was up and moving 2 days after the surgery. He went out of his way to even visit on a Sabbath. His support team are proficient and knowledgeable about what is required. I would highly recommend him to anyone looking for a urologist.",
  },
  {
    id: "ramautar-jhawar",
    category: "Kidney Stone",
    date: "9 Feb 2023",
    featured: true,
    name: "Ramautar Jhawar",
    meta: "Google review",
    badge: "RIRS · Kidney stone",
    image: "/assets/figma/testimonials/ayush-pareekh.png",
    quote:
      "Amazing experience. We did not feel any discomfort. It was great even though we underwent RIRS surgery and were discharged the very next day. Dr. Vikram Barua is a great doctor with a vision to make his patients feel good and comfortable, very down to earth, humble, and noble, serving in his field with the right noble vision. He has great hands. Our regards to him always, best wishes, and thank you to him and his team.",
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
  const title = "Testimonials | Dr. Vikram";
  const description = "Real Google reviews and patient testimonials for Dr. Vikram's urology and robotic surgery care.";
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
    const timer = window.setInterval(showNext, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        jsonLd={[
          pageGraph({ path: "/testimonials", title, description, type: "CollectionPage" }),
          itemListGraph({
            path: "/testimonials",
            name: "Patient testimonials",
            items: stories.map((story) => story.name),
          }),
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "Testimonials", path: "/testimonials" },
          ]),
        ]}
      />

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
