import {
  asArray,
  asMedia,
  asNumber,
  asRecord,
  asString,
  entryData,
  fetchCollection,
  resolveImage,
  toStringArray,
} from "@/lib/cms";

export type TreatmentData = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  hero: {
    title: string;
    highlight: string;
    summary: string;
    image: string;
    imageCaption: string;
  };
  sidebar: {
    items: { label: string; href: string }[];
    ctaTitle: string;
    ctaText: string;
  };
  overview: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    body: string[];
    subsections: { title: string; body: string[] }[];
  };
  symptomCheck: {
    eyebrow: string;
    title: string;
    steps: { question: string; options: string[] }[];
    note: string;
  };
  journey: {
    eyebrow: string;
    icon: string;
    title: string;
    defaultActiveStep: number;
    steps: {
      label: string;
      title: string;
      heading: string;
      subheading: string;
      description: string;
      checklist: string[];
    }[];
  };
  experience: {
    eyebrow: string;
    title: string;
    body: string[];
    featureTitle: string;
    featureText: string;
    video: {
      image: string;
      title: string;
      byline: string;
    };
    stats: { value: string; label: string; icon: string }[];
  };
  careGuide: {
    eyebrow: string;
    icon: string;
    title: string;
    intro: string;
    tabs: { label: string; items: string[] }[];
    note: string;
  };
  faqs: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
};

async function mapTreatment(item: unknown): Promise<TreatmentData | null> {
  const e = asRecord(entryData(item));
  const hero = asRecord(e.hero);
  const slug = asString(e.slug);
  const heroTitle = asString(hero.title);
  if (!slug || !heroTitle) return null;

  const sidebar = asRecord(e.sidebar);
  const overview = asRecord(e.overview);
  const symptomCheck = asRecord(e.symptomCheck);
  const journey = asRecord(e.journey);
  const experience = asRecord(e.experience);
  const experienceVideo = asRecord(experience.video);
  const careGuide = asRecord(e.careGuide);
  const faqs = asRecord(e.faqs);

  return {
    slug,
    metaTitle: asString(e.metaTitle),
    metaDescription: asString(e.metaDescription),
    readTime: asString(e.readTime),
    hero: {
      title: heroTitle,
      highlight: asString(hero.highlight),
      summary: asString(hero.summary),
      image: await resolveImage(asMedia(hero.image)),
      imageCaption: asString(hero.imageCaption),
    },
    sidebar: {
      items: asArray(sidebar.items).map((entry) => {
        const item = asRecord(entry);
        return { label: asString(item.label), href: asString(item.href) };
      }),
      ctaTitle: asString(sidebar.ctaTitle),
      ctaText: asString(sidebar.ctaText),
    },
    overview: {
      eyebrow: asString(overview.eyebrow),
      titlePrefix: asString(overview.titlePrefix),
      titleHighlight: asString(overview.titleHighlight),
      body: toStringArray(overview.body),
      subsections: asArray(overview.subsections).map((entry) => {
        const sub = asRecord(entry);
        return { title: asString(sub.title), body: toStringArray(sub.body) };
      }),
    },
    symptomCheck: {
      eyebrow: asString(symptomCheck.eyebrow),
      title: asString(symptomCheck.title),
      steps: asArray(symptomCheck.steps).map((entry) => {
        const step = asRecord(entry);
        return { question: asString(step.question), options: toStringArray(step.options) };
      }),
      note: asString(symptomCheck.note),
    },
    journey: {
      eyebrow: asString(journey.eyebrow),
      icon: asString(journey.icon),
      title: asString(journey.title),
      defaultActiveStep: asNumber(journey.defaultActiveStep),
      steps: asArray(journey.steps).map((entry) => {
        const step = asRecord(entry);
        return {
          label: asString(step.label),
          title: asString(step.title),
          heading: asString(step.heading),
          subheading: asString(step.subheading),
          description: asString(step.description),
          checklist: toStringArray(step.checklist),
        };
      }),
    },
    experience: {
      eyebrow: asString(experience.eyebrow),
      title: asString(experience.title),
      body: toStringArray(experience.body),
      featureTitle: asString(experience.featureTitle),
      featureText: asString(experience.featureText),
      video: {
        image: await resolveImage(asMedia(experienceVideo.image)),
        title: asString(experienceVideo.title),
        byline: asString(experienceVideo.byline),
      },
      stats: asArray(experience.stats).map((entry) => {
        const stat = asRecord(entry);
        return { value: asString(stat.value), label: asString(stat.label), icon: asString(stat.icon) };
      }),
    },
    careGuide: {
      eyebrow: asString(careGuide.eyebrow),
      icon: asString(careGuide.icon),
      title: asString(careGuide.title),
      intro: asString(careGuide.intro),
      tabs: asArray(careGuide.tabs).map((entry) => {
        const tab = asRecord(entry);
        return { label: asString(tab.label), items: toStringArray(tab.items) };
      }),
      note: asString(careGuide.note),
    },
    faqs: {
      eyebrow: asString(faqs.eyebrow),
      title: asString(faqs.title),
      items: asArray(faqs.items).map((entry) => {
        const faqItem = asRecord(entry);
        return { question: asString(faqItem.question), answer: asString(faqItem.answer) };
      }),
    },
  };
}

let cachedTreatments: Promise<TreatmentData[]> | null = null;

/** All treatments — CMS entries only, no local fallback. */
export function getAllTreatments(): Promise<TreatmentData[]> {
  if (!cachedTreatments) {
    cachedTreatments = (async () => {
      const entries = await fetchCollection("treatments");
      const mapped = await Promise.all(entries.map(mapTreatment));
      return mapped.filter((treatment): treatment is TreatmentData => treatment !== null);
    })();
  }

  return cachedTreatments;
}

export async function getTreatmentBySlug(slug: string): Promise<TreatmentData | null> {
  const treatments = await getAllTreatments();
  return treatments.find((treatment) => treatment.slug === slug) ?? null;
}
