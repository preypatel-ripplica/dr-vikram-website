import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppointmentSection } from "@/components/shared/AppointmentSection";
import { PageSectionReveal } from "@/components/shared/PageSectionReveal";
import videoGallery from "@/data/video-gallery.json";
import styles from "@/styles/VideoGalleryPage.module.css";

type CategoryKey = "all" | "education" | "robotic" | "testimonials" | "qa";

type VideoTone = "blue" | "orange" | "teal" | "pink";

type VideoItem = {
  category: string;
  categoryKey: Exclude<CategoryKey, "all">;
  title: string;
  excerpt: string;
  views: string;
  duration: string;
  tone: VideoTone;
};

const categoryTabs: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "education", label: "Education" },
  { key: "robotic", label: "Robotic" },
  { key: "testimonials", label: "Testimonials" },
  { key: "qa", label: "Q&A" },
];

const videos = videoGallery.videos as VideoItem[];
const featuredVideo = videoGallery.featured as VideoItem;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <span className={styles.shieldIcon}>
        <Image
          alt=""
          fill
          sizes="20px"
          src="/assets/figma/video-gallery/shield-plus.svg"
        />
      </span>
      <span>{children}</span>
    </p>
  );
}

function PlayButton({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? styles.playButtonLarge : styles.playButton}>
      <span className={styles.playIcon}>
        <Image
          alt=""
          fill
          sizes={large ? "24px" : "18px"}
          src="/assets/figma/video-gallery/play.svg"
        />
      </span>
    </span>
  );
}

function MetaItem({
  icon,
  children,
  compact = false,
}: {
  icon: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <span className={compact ? styles.metaItemSmall : styles.metaItem}>
      <Image
        alt=""
        height={compact ? 12 : 14}
        src={icon}
        width={compact ? 12 : 14}
      />
      <span>{children}</span>
    </span>
  );
}

function VideoHero() {
  return (
    <section className={styles.hero} data-node-id="149:31140">
      <div className={styles.heroContent}>
        <div className={styles.heroHeading}>
          <SectionLabel>Patient Support · Video Gallery</SectionLabel>
          <div className={styles.heroText}>
            <h1>Watch. Understand. Decide.</h1>
            <p>
              Educational walkthroughs, robotic surgery explanations, patient
              stories, and live Q&As — all from Dr. Vikram&apos;s team.
            </p>
          </div>
        </div>

        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#contact">
            Book appointment
          </a>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <Image
          alt="Dr. Vikram"
          fill
          priority
          sizes="683px"
          src="/images/hero-combined.png"
        />
      </div>
    </section>
  );
}

function FeaturedVideo() {
  return (
    <section className={styles.featuredWrap} data-node-id="149:29173">
      <article className={styles.featuredCard}>
        <div className={styles.featuredMedia}>
          <Image
            alt=""
            className={styles.thumbTexture}
            fill
            priority
            sizes="427px"
            src="/assets/figma/video-gallery/featured-thumb.svg"
          />
          <span className={styles.thumbShade} />
          <PlayButton large />
        </div>

        <div className={styles.featuredBody}>
          <span className={`${styles.videoBadge} ${styles.teal}`}>
            {featuredVideo.category}
          </span>
          <h2>{featuredVideo.title}</h2>
          <p>{featuredVideo.excerpt}</p>
          <div className={styles.metaRow}>
            <MetaItem icon="/assets/figma/video-gallery/views.svg">
              {featuredVideo.views}
            </MetaItem>
            <MetaItem icon="/assets/figma/video-gallery/clock.svg">
              {featuredVideo.duration}
            </MetaItem>
          </div>
          <a className={styles.watchButton} href="#">
            <Image
              alt=""
              height={16}
              src="/assets/figma/video-gallery/watch.svg"
              width={16}
            />
            <span>Watch now</span>
          </a>
        </div>
      </article>
    </section>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <article className={styles.videoCard}>
      <div className={`${styles.videoThumb} ${styles[`${video.tone}Thumb`]}`}>
        <Image
          alt=""
          className={styles.cardThumbTexture}
          fill
          sizes="(max-width: 900px) 100vw, 411px"
          src="/assets/figma/video-gallery/card-thumb.svg"
        />
        <span className={styles.thumbShadeSmall} />
        <PlayButton />
      </div>

      <div className={styles.videoCardBody}>
        <span className={`${styles.videoBadge} ${styles[video.tone]}`}>
          {video.category}
        </span>
        <h3>{video.title}</h3>
        <p>{video.excerpt}</p>
        <div className={styles.cardMetaRow}>
          <MetaItem
            compact
            icon={
              video.tone === "blue" || video.tone === "orange"
                ? "/assets/figma/video-gallery/views.svg"
                : "/assets/figma/video-gallery/card-views.svg"
            }
          >
            {video.views}
          </MetaItem>
          <MetaItem compact icon="/assets/figma/video-gallery/clock.svg">
            {video.duration}
          </MetaItem>
        </div>
      </div>
    </article>
  );
}

function VideoGrid() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const counts = useMemo(() => {
    return videos.reduce(
      (acc, video) => {
        acc.all += 1;
        acc[video.categoryKey] += 1;
        return acc;
      },
      { all: 0, education: 0, robotic: 0, testimonials: 0, qa: 0 },
    );
  }, []);

  const visibleVideos = useMemo(() => {
    if (activeCategory === "all") {
      return videos;
    }

    return videos.filter((video) => video.categoryKey === activeCategory);
  }, [activeCategory]);

  return (
    <section className={styles.videoGridSection} data-node-id="149:31230">
      <div className={styles.filterBar}>
        <div className={styles.filters} role="tablist" aria-label="Video categories">
          {categoryTabs.map((tab) => (
            <button
              aria-selected={activeCategory === tab.key}
              className={activeCategory === tab.key ? styles.activeFilter : undefined}
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              role="tab"
              type="button"
            >
              <span>{tab.label}</span>
              <span className={styles.count}>({counts[tab.key]})</span>
            </button>
          ))}
        </div>
        <p>{visibleVideos.length} videos</p>
      </div>

      <div className={styles.videoGrid}>
        {visibleVideos.map((video) => (
          <VideoCard key={video.title} video={video} />
        ))}
      </div>
    </section>
  );
}

function YoutubeSection() {
  return (
    <section className={styles.youtubeSection} data-node-id="149:32072">
      <div className={styles.youtubeCard}>
        <div className={styles.youtubeContent}>
          <div className={styles.youtubeCopy}>
            <span className={styles.youtubeIcon}>
              <Image
                alt=""
                height={24}
                src="/assets/figma/video-gallery/youtube-icon.svg"
                width={24}
              />
            </span>
            <div>
              <h2>Dr. Vikram on YouTube</h2>
              <p>
                New patient education videos, surgical walkthroughs, and Q&A
                sessions every week. Subscribe to never miss one.
              </p>
            </div>
          </div>

          <a
            className={styles.youtubeButton}
            href="https://www.youtube.com/@DrVikramBaruaKaushik"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt=""
              height={18}
              src="/assets/figma/video-gallery/youtube-play.svg"
              width={18}
            />
            <span>View on YouTube</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className={styles.closingCta} data-node-id="146:5804">
      <div className={styles.closingHeading}>
        <p className={styles.sectionLabel}>
          <span className={styles.shieldIcon}>
            <Image
              alt=""
              fill
              sizes="20px"
              src="/assets/figma/video-gallery/cta-shield-plus.svg"
            />
          </span>
          <span>Advanced urology clinic</span>
        </p>

        <div className={styles.closingText}>
          <h2>
            Ready to <span>take control</span> of your health?
          </h2>
          <p>
            Watch patient education videos, then schedule a consultation for
            advice specific to your reports and symptoms.
          </p>
        </div>
      </div>

      <div className={styles.closingActions}>
        <a className={styles.primaryButton} href="#contact">
          Book appointment
        </a>
        <Link className={styles.secondaryButton} href="/contact-us/">
          Contact us
        </Link>
      </div>
    </section>
  );
}

export default function VideoGalleryPage() {
  return (
    <>
      <Head>
        <title>Video Gallery | Dr. Vikram</title>
        <meta
          name="description"
          content="Watch educational urology videos, robotic surgery explainers, patient stories, and Q&A sessions from Dr. Vikram's team."
        />
      </Head>

      <main className={styles.videoGalleryPage}>
        <PageSectionReveal
          childClassName={styles.revealChild}
          pendingClassName={styles.revealPending}
          sectionClassNames={[
            styles.hero,
            styles.featuredWrap,
            styles.videoGridSection,
            styles.youtubeSection,
            styles.appointmentWrap,
            styles.closingCta,
          ]}
          visibleChildClassName={styles.revealChildVisible}
          visibleClassName={styles.revealVisible}
        />
        <VideoHero />
        <FeaturedVideo />
        <VideoGrid />
        <YoutubeSection />
        <div className={styles.appointmentWrap} data-node-id="149:29461">
          <AppointmentSection />
        </div>
        <ClosingCta />
      </main>
    </>
  );
}
