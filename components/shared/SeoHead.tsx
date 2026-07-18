import Head from "next/head";
import { imageUrl, SITE_IMAGE } from "@/lib/seo";

type SeoHeadProps = {
  title: string;
  description: string;
  image?: string;
  ogType?: "website" | "article";
  jsonLd?: Array<Record<string, unknown> | null> | Record<string, unknown> | null;
};

export function SeoHead({
  title,
  description,
  image = SITE_IMAGE,
  ogType = "website",
  jsonLd,
}: SeoHeadProps) {
  const resolvedImage = imageUrl(image);
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title key="title">{title}</title>
      <meta content={description} key="description" name="description" />
      <meta content={title} key="og:title" property="og:title" />
      <meta content={description} key="og:description" property="og:description" />
      <meta content={ogType} key="og:type" property="og:type" />
      <meta content={resolvedImage} key="og:image" property="og:image" />
      <meta content={title} key="twitter:title" name="twitter:title" />
      <meta content={description} key="twitter:description" name="twitter:description" />
      <meta content={resolvedImage} key="twitter:image" name="twitter:image" />
      {jsonLdItems.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          key={`json-ld-${index}`}
          type="application/ld+json"
        />
      ))}
    </Head>
  );
}
