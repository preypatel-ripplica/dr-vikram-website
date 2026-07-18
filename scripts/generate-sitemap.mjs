import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://drvikrambaruakaushik.com").replace(/\/$/, "");
const locales = ["en", "hi", "ar", "ru"];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function localizePath(route, locale) {
  if (locale === "en") return route;
  return route === "/" ? `/${locale}` : `/${locale}${route}`;
}

const treatmentFiles = fs.readdirSync(path.join(ROOT, "data", "treatments")).filter((file) => file.endsWith(".json"));
const blogFiles = fs.readdirSync(path.join(ROOT, "data", "blogs")).filter((file) => file.endsWith(".json"));

const routes = [
  "/",
  "/blogs",
  "/contact-us",
  "/international-patient-support",
  "/testimonials",
  "/treatment-journey",
  "/video-gallery",
  ...treatmentFiles.map((file) => `/treatments/${readJson(path.join("data", "treatments", file)).slug}`),
  ...blogFiles.map((file) => `/blogs/${readJson(path.join("data", "blogs", file)).slug}`),
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolute(route) {
  return `${SITE_URL}${route === "/" ? "" : route}`;
}

const urls = [];

for (const route of routes) {
  for (const locale of locales) {
    const localizedRoute = localizePath(route, locale);
    const alternates = [
      ...locales.map((alternateLocale) => ({
        hreflang: alternateLocale,
        href: absolute(localizePath(route, alternateLocale)),
      })),
      { hreflang: "x-default", href: absolute(route) },
    ];

    urls.push([
      "  <url>",
      `    <loc>${escapeXml(absolute(localizedRoute))}</loc>`,
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
