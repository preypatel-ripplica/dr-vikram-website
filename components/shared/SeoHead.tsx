import Head from "next/head";
import { absoluteUrl, imageUrl, SITE_IMAGE, SITE_NAME } from "@/lib/seo";

type SeoHeadProps = {
  title: string;
  description: string;
  /** Overrides the og:description/twitter:description text when it should read differently from the meta description. */
  socialDescription?: string;
  image?: string;
  ogType?: "website" | "article";
  canonicalPath?: string;
  jsonLd?: Array<Record<string, unknown> | null> | Record<string, unknown> | null;
};

export function SeoHead({
  title,
  description,
  socialDescription,
  image = SITE_IMAGE,
  ogType = "website",
  canonicalPath,
  jsonLd,
}: SeoHeadProps) {
  const resolvedImage = imageUrl(image);
  const resolvedSocialDescription = socialDescription ?? description;
  const resolvedUrl = canonicalPath ? absoluteUrl(canonicalPath) : undefined;
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title key="title">{title}</title>
      <meta content={description} key="description" name="description" />
      {resolvedUrl && <link href={resolvedUrl} key="canonical" rel="canonical" />}
      <meta content={title} key="og:title" property="og:title" />
      <meta content={resolvedSocialDescription} key="og:description" property="og:description" />
      <meta content={ogType} key="og:type" property="og:type" />
      <meta content={SITE_NAME} key="og:site_name" property="og:site_name" />
      {resolvedUrl && <meta content={resolvedUrl} key="og:url" property="og:url" />}
      <meta content={resolvedImage} key="og:image" property="og:image" />
      <meta content="summary_large_image" key="twitter:card" name="twitter:card" />
      <meta content={title} key="twitter:title" name="twitter:title" />
      <meta content={resolvedSocialDescription} key="twitter:description" name="twitter:description" />
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
