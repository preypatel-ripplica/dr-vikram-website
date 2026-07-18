import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { SeoHead } from "@/components/shared/SeoHead";
import { TreatmentPageTemplate } from "@/components/treatments/TreatmentPageTemplate";
import { DEFAULT_LOCALE } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
import { withLocaleProps } from "@/lib/page-i18n.server";
import { treatmentGraphs } from "@/lib/seo";
import { getAllTreatments, getTreatmentBySlug, type TreatmentData } from "@/lib/treatments";

type TreatmentPageProps = {
  treatment: TreatmentData;
  canonicalPath: string;
  locale: Locale;
};

export const getStaticPaths = (async () => {
  return {
    paths: getAllTreatments().map((treatment) => ({
      params: { slug: treatment.slug },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const slug = String(params?.slug ?? "");
  const treatment = getTreatmentBySlug(slug);

  if (!treatment) {
    return { notFound: true };
  }

  return {
    props: withLocaleProps(
      {
        treatment,
        canonicalPath: `/treatments/${treatment.slug}`,
      },
      DEFAULT_LOCALE,
    ),
  };
}) satisfies GetStaticProps<TreatmentPageProps>;

export default function TreatmentPage({
  treatment,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <SeoHead
        title={treatment.metaTitle}
        description={treatment.metaDescription}
        image={treatment.hero.image}
        jsonLd={treatmentGraphs(treatment)}
      />
      <TreatmentPageTemplate treatment={treatment} />
    </>
  );
}
