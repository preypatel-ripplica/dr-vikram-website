import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://drvikrambaruakaushik.com").replace(/\/$/, "");
const locales = ["en", "hi", "ar", "ru"];
const today = new Date().toISOString().slice(0, 10);

// Preserve each URL's previous <lastmod> across runs — only newly-added URLs
// get today's date. A URL's lastmod should only move when its content
// actually changes, not on every deploy.
function loadPreviousLastmods() {
  const sitemapPath = path.join(ROOT, "public", "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) return new Map();

  const xml = fs.readFileSync(sitemapPath, "utf8");
  const lastmods = new Map();
  const urlBlockPattern = /<url>([\s\S]*?)<\/url>/g;

  for (const match of xml.matchAll(urlBlockPattern)) {
    const block = match[1];
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1];
    if (loc && lastmod) lastmods.set(loc, lastmod);
  }

  return lastmods;
}

const previousLastmods = loadPreviousLastmods();

function loadEnvFile(filename) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[match[1]] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const CMS_API_URL = process.env.CMS_API_URL;
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;

if (!CMS_API_URL || !CMS_API_TOKEN) {
  throw new Error(
    "CMS_API_URL and CMS_API_TOKEN must be set in .env.local — the sitemap has no local JSON fallback for treatments or blogs.",
  );
}

async function fetchCollectionSlugs(collectionSlug) {
  const res = await fetch(`${CMS_API_URL}/api/content.entries.list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CMS_API_TOKEN}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ collection_slug: collectionSlug, page_size: 100 }),
  });

  if (!res.ok) {
    throw new Error(`CMS request for "${collectionSlug}" failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const entries = Array.isArray(data) ? data : data?.entries || data?.data || data?.items || [];

  return entries
    .map((item) => (item?.entry ?? item)?.slug)
    .filter((slug) => typeof slug === "string" && slug.length > 0);
}

const [treatmentSlugs, blogSlugs] = await Promise.all([
  fetchCollectionSlugs("treatments"),
  fetchCollectionSlugs("blog"),
]);

const routes = [
  "/",
  "/about-us",
  "/blogs",
  "/contact-us",
  "/international-patient-support",
  "/testimonials",
  "/treatment-journey",
  "/video-gallery",
  ...treatmentSlugs.map((slug) => `/treatments/${slug}`),
  ...blogSlugs.map((slug) => `/blogs/${slug}`),
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolute(route) {
  if (route === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${route.endsWith("/") ? route : `${route}/`}`;
}

function getPriority(route, locale) {
  if (route === "/" && locale === "en") return "1.0";
  if (route === "/") return "0.8";
  if (route.startsWith("/treatments/")) return locale === "en" ? "0.9" : "0.7";
  if (route === "/contact-us" || route === "/about-us") return locale === "en" ? "0.9" : "0.7";
  if (route === "/blogs" || route.startsWith("/blogs/")) return locale === "en" ? "0.8" : "0.6";
  return locale === "en" ? "0.8" : "0.6";
}

function getChangefreq(route) {
  if (route === "/" || route === "/blogs") return "weekly";
  if (route.startsWith("/blogs/")) return "monthly";
  return "monthly";
}

function localizePath(route, locale) {
  if (locale === "en") return route;
  return route === "/" ? `/${locale}` : `/${locale}${route}`;
}

const urls = [];

for (const route of routes) {
  for (const locale of locales) {
    const localizedRoute = localizePath(route, locale);
    const loc = absolute(localizedRoute);
    const lastmod = previousLastmods.get(loc) ?? today;
    const alternates = [
      ...locales.map((alternateLocale) => ({
        hreflang: alternateLocale,
        href: absolute(localizePath(route, alternateLocale)),
      })),
      { hreflang: "x-default", href: absolute(route) },
    ];

    urls.push([
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${getChangefreq(route)}</changefreq>`,
      `    <priority>${getPriority(route, locale)}</priority>`,
      ...alternates.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}" />`,
      ),
      "  </url>",
    ].join("\n"));
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), xml);
console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);
