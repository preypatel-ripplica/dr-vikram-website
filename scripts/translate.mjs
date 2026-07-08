import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const MEMORY_PATH = path.join(ROOT, ".cache", "translation-memory.json");
const DEFAULT_LOCALE = "en";
const TARGET_LOCALES = ["hi", "ar", "ru"];
const DEFAULT_SCOPES = [
  "shared-ui",
  "home",
  "contact",
  "blogs",
  "treatments",
  "testimonials",
  "patient-support",
  "video-gallery",
  "treatment-journey",
];

const SKIPPED_KEYS = new Set([
  "accept",
  "aria-controls",
  "autoComplete",
  "className",
  "d",
  "data-node-id",
  "fill",
  "height",
  "inputMode",
  "key",
  "max",
  "method",
  "min",
  "name",
  "rel",
  "role",
  "sizes",
  "stroke",
  "strokeLinecap",
  "strokeLinejoin",
  "target",
  "type",
  "value",
  "viewBox",
  "width",
  "slug",
  "id",
  "href",
  "url",
  "videoUrl",
  "canonical",
  "canonicalPath",
  "ogImage",
  "src",
  "image",
  "icon",
  "cardImage",
  "bannerImage",
  "authorImage",
  "videoThumbnail",
  "publishedAt",
  "publishedLabel",
  "access_key",
  "from_name",
]);

const SAFE_JSX_TRANSLATION_ATTRIBUTES = new Set([
  "alt",
  "aria-label",
  "highlight",
  "placeholder",
  "source",
  "title",
]);

const CODE_CONTENT_KEYS = new Set([
  "answer",
  "byline",
  "caption",
  "categoryLabel",
  "copy",
  "description",
  "eyebrow",
  "heading",
  "highlight",
  "label",
  "meta",
  "note",
  "question",
  "quote",
  "range",
  "subheading",
  "summary",
  "title",
]);

const CODE_CONTENT_ARRAY_KEYS = new Set([
  "bullets",
  "checklist",
  "faqs",
  "features",
  "links",
  "options",
  "paragraphs",
  "questions",
  "steps",
  "subParagraphs",
]);

const CODE_CONTENT_ARRAY_NAMES = new Set([
  "categoryTabs",
  "faqs",
  "posts",
  "stories",
  "steps",
  "testimonials",
  "timelineSteps",
  "videos",
]);

const SKIPPED_EXACT_VALUES = new Set([
  "_blank",
  "_self",
  "address-level2",
  "button",
  "currentColor",
  "keydown",
  "email",
  "false",
  "manual",
  "menu",
  "menuitem",
  "mobile-navigation",
  "mousedown",
  "name",
  "next",
  "none",
  "noreferrer",
  "previous",
  "qa",
  "tab",
  "tablist",
  "submit",
  "tel",
  "text",
  "true",
  "touchstart",
  "use client",
]);

const SKIPPED_KEY_PARTS = [
  "path",
  "url",
  "href",
  "src",
  "image",
  "thumbnail",
  "icon",
  "class",
  "type",
];

const languageNames = {
  hi: "Hindi",
  ar: "Arabic",
  ru: "Russian",
};

const localeStyleGuides = {
  hi: [
    "Write natural, impactful Hindi for patients in India. Prefer clear healthcare copy over literal word-for-word translation.",
    "Use warm, trustworthy, patient-friendly wording. Avoid stiff Sanskritized phrasing when a common Hindi phrase is stronger.",
    "Example style: translate a phrase like \"care designed around you\" as \"आपकी जरूरतों के अनुसार देखभाल\" rather than a stiff literal phrase. Translate \"clear next steps\" as \"आगे की स्पष्ट योजना\" rather than word-by-word English structure.",
    "Use commonly understood medical Hindi; keep necessary terms like CT, PSA, URS, RIRS, PCNL, ECNL, robotic surgery, prostate, kidney, bladder, and urology recognizable.",
    "Keep Dr. Vikram, Urowellness, hospital/clinic names, addresses, emails, phone numbers, URLs, and units unchanged.",
  ],
  ar: [
    "Write natural, polished Arabic healthcare copy for patients. Prefer meaning-first localization over literal translation.",
    "Use Modern Standard Arabic that feels reassuring, professional, and easy to understand.",
    "Avoid awkward calques. Keep medical meaning precise while making headings and calls to action concise and persuasive.",
    "Keep Dr. Vikram, Urowellness, hospital/clinic names, addresses, emails, phone numbers, URLs, and technical abbreviations unchanged.",
  ],
  ru: [
    "Write natural Russian healthcare copy for patients. Prefer clear localized medical wording over literal translation.",
    "Use a professional, calm, trustworthy tone. Make headings and CTAs concise and impactful.",
    "Keep medical meaning precise and avoid awkward English sentence structure.",
    "Keep Dr. Vikram, Urowellness, hospital/clinic names, addresses, emails, phone numbers, URLs, and technical abbreviations unchanged.",
  ],
};

const scopeFiles = {
  "shared-ui": [
    "components/layout/Header.tsx",
    "components/layout/Footer.tsx",
    "components/shared/AppointmentSection.tsx",
    "components/home/FinalCtaSection.tsx",
  ],
  home: [
    "pages/index.tsx",
    "components/home/SymptomGuide.tsx",
    "components/home/TreatmentsCarousel.tsx",
    "components/home/TestimonialsSection.tsx",
    "components/home/RoboticMovementToggle.tsx",
    "components/home/RoboticVisionComparison.tsx",
  ],
  contact: ["pages/contact-us.tsx"],
  blogs: ["pages/blogs/index.tsx", "pages/blogs/[slug].tsx", "data/blogs"],
  treatments: ["pages/treatments/[slug].tsx", "components/treatments", "data/treatments"],
  testimonials: ["pages/testimonials.tsx"],
  "patient-support": ["pages/international-patient-support.tsx"],
  "video-gallery": ["pages/video-gallery.tsx", "data/video-gallery.json"],
  "treatment-journey": ["pages/treatment-journey.tsx"],
};

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

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const scopeArg = args.find((arg) => arg.startsWith("--scope="));
const scopes = scopeArg
  ? scopeArg.replace("--scope=", "").split(",").map((scope) => scope.trim()).filter(Boolean)
  : DEFAULT_SCOPES;
const batchSize = Number(process.env.TRANSLATION_BATCH_SIZE || 60);
const geminiModel =
  process.env.GEMINI_TRANSLATION_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";

function normalizeTranslationText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function getTranslationKey(value) {
  return crypto
    .createHash("sha256")
    .update(normalizeTranslationText(value))
    .digest("hex")
    .slice(0, 16);
}

function shouldSkipKey(key) {
  if (SKIPPED_KEYS.has(key)) return true;
  const lowerKey = key.toLowerCase();
  return SKIPPED_KEY_PARTS.some((part) => lowerKey.includes(part));
}

function isTranslatableString(value) {
  const text = normalizeTranslationText(value);
  if (!text) return false;
  if (text.length > 500) return false;
  if (SKIPPED_EXACT_VALUES.has(text)) return false;
  if (/^[\d\s.,:+\-/%()]+$/.test(text)) return false;
  if (/^\d+(\.\d+)?(px|rem|em|vh|vw|%)$/.test(text)) return false;
  if (/^M[-+0-9A-Za-z.,\s]+Z?$/.test(text)) return false;
  if (/^(https?:|mailto:|tel:|#|\/)/.test(text)) return false;
  if (/^[\w.-]+@[\w.-]+$/.test(text)) return false;
  if (/\.(png|jpe?g|svg|webp|gif|pdf|docx?)$/i.test(text)) return false;
  if (/[{}<>]/.test(text)) return false;
  if (/\b(import|export|function|const|let|return|className|styles|undefined|null)\b/.test(text)) {
    return false;
  }
  return /[A-Za-z]/.test(text);
}

function collectFromJson(value, strings, key = "") {
  if (typeof value === "string") {
    if (!shouldSkipKey(key) && isTranslatableString(value)) {
      strings.add(normalizeTranslationText(value));
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectFromJson(item, strings, key));
    return;
  }

  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      collectFromJson(childValue, strings, childKey);
    }
  }
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function collectFromCode(source, strings) {
  const sourceFile = ts.createSourceFile(
    "source.tsx",
    stripComments(source),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  function add(value) {
    const text = normalizeTranslationText(value);
    if (isTranslatableString(text) && !text.includes("${")) {
      strings.add(text);
    }
  }

  function getPropertyName(node) {
    if (!node) return "";
    if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
      return String(node.text);
    }
    return "";
  }

  function getJsxAttributeName(node) {
    if (!node) return "";
    if (ts.isIdentifier(node) || ts.isJsxNamespacedName(node)) {
      return node.getText(sourceFile);
    }
    return "";
  }

  function shouldSkipStringLiteral(node) {
    const parent = node.parent;

    if (!parent) return false;
    if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) return true;
    if (ts.isCallExpression(parent)) {
      const callee = parent.expression.getText(sourceFile);
      return callee !== "t" && callee !== "translateText";
    }
    if (ts.isCallExpression(parent) && parent.expression.getText(sourceFile) === "require") return true;

    if (ts.isPropertyAssignment(parent) && parent.initializer === node) {
      const key = getPropertyName(parent.name);
      return shouldSkipKey(key) || !CODE_CONTENT_KEYS.has(key);
    }

    if (ts.isJsxAttribute(parent) && parent.initializer === node) {
      const key = getJsxAttributeName(parent.name);
      return !SAFE_JSX_TRANSLATION_ATTRIBUTES.has(key) || shouldSkipKey(key);
    }

    if (ts.isArrayLiteralExpression(parent)) {
      return !isTranslatableArrayLiteral(parent);
    }

    if (
      ts.isLiteralTypeNode(parent) ||
      ts.isImportTypeNode(parent) ||
      ts.isExternalModuleReference(parent)
    ) {
      return true;
    }

    return false;
  }

  function isTranslatableArrayLiteral(arrayNode) {
    let current = arrayNode.parent;

    while (current) {
      if (ts.isPropertyAssignment(current)) {
        const key = getPropertyName(current.name);
        return !shouldSkipKey(key) && CODE_CONTENT_ARRAY_KEYS.has(key);
      }

      if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name)) {
        return CODE_CONTENT_ARRAY_NAMES.has(current.name.text);
      }

      if (
        ts.isCallExpression(current) ||
        ts.isJsxAttribute(current) ||
        ts.isImportDeclaration(current) ||
        ts.isExportDeclaration(current)
      ) {
        return false;
      }

      current = current.parent;
    }

    return false;
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      add(node.getText(sourceFile));
    } else if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      !shouldSkipStringLiteral(node)
    ) {
      add(node.text);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function listFiles(entry) {
  const absolute = path.join(ROOT, entry);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];

  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((dirent) => {
    const child = path.join(entry, dirent.name);
    return dirent.isDirectory() ? listFiles(child) : [path.join(ROOT, child)];
  });
}

function collectScopeStrings(scope) {
  const strings = new Set();
  const entries = scopeFiles[scope] || [];

  for (const entry of entries) {
    for (const file of listFiles(entry)) {
      if (file.endsWith(".json")) {
        collectFromJson(JSON.parse(fs.readFileSync(file, "utf8")), strings);
      } else if (/\.(tsx?|jsx?)$/.test(file)) {
        collectFromCode(fs.readFileSync(file, "utf8"), strings);
      }
    }
  }

  return [...strings].sort((a, b) => a.localeCompare(b));
}

function loadMemory() {
  if (!fs.existsSync(MEMORY_PATH)) return {};
  return JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8"));
}

function saveMemory(memory) {
  fs.mkdirSync(path.dirname(MEMORY_PATH), { recursive: true });
  fs.writeFileSync(MEMORY_PATH, `${JSON.stringify(memory, null, 2)}\n`);
}

function ensureEnglish(memory, strings) {
  for (const text of strings) {
    const key = getTranslationKey(text);
    memory[key] ||= { [DEFAULT_LOCALE]: text };
    memory[key][DEFAULT_LOCALE] ||= text;
  }
}

function getMissing(memory, strings, locale) {
  return strings.filter((text) => {
    const entry = memory[getTranslationKey(text)];
    return !entry?.[locale];
  });
}

async function translateBatch(texts, locale) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required when generating missing translations.");
  }

  const languageName = languageNames[locale] || locale;
  const prompt = [
    `Translate this JSON array from English to ${languageName} for a urology clinic website.`,
    "Return only a JSON array of strings.",
    "Keep the same order and item count.",
    "Translate each full string or paragraph as one unit. Preserve the original meaning, medical accuracy, and intent.",
    "Do not translate word-for-word when a more natural localized phrase is more impactful.",
    "Make the result patient-friendly, trustworthy, concise, and suitable for website headings, buttons, forms, FAQs, and treatment content.",
    "Maintain the same level of formality as the source. Do not add new claims, promises, or medical advice.",
    "Keep brand names, doctor names, URLs, slugs, IDs, file paths, email addresses, phone numbers, and code-like values unchanged.",
    ...(localeStyleGuides[locale] || []),
    JSON.stringify(texts),
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  const translations = JSON.parse(extractJsonArray(text));

  if (!Array.isArray(translations) || translations.length !== texts.length) {
    throw new Error("Gemini returned a different item count.");
  }

  return translations.map((value) => normalizeTranslationText(value));
}

function extractJsonArray(value) {
  const text = String(value || "").trim();

  if (text.startsWith("[")) {
    return text;
  }

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) {
    return fenced[1].trim();
  }

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  throw new Error(`Gemini did not return a JSON array: ${text.slice(0, 240)}`);
}

let memory = loadMemory();
let totalMissing = 0;

for (const scope of scopes) {
  const strings = collectScopeStrings(scope);
  ensureEnglish(memory, strings);
  saveMemory(memory);

  for (const locale of TARGET_LOCALES) {
    const missing = getMissing(memory, strings, locale);
    totalMissing += missing.length;

    if (!missing.length) {
      console.log(`${scope}:${locale} is complete`);
      continue;
    }

    console.log(`${scope}:${locale} missing ${missing.length} strings`);

    if (dryRun) continue;

    for (let index = 0; index < missing.length; index += batchSize) {
      const batch = missing.slice(index, index + batchSize);
      const translations = await translateBatch(batch, locale);

      batch.forEach((source, batchIndex) => {
        memory[getTranslationKey(source)][locale] = translations[batchIndex];
      });

      saveMemory(memory);
      console.log(`${scope}:${locale} saved ${Math.min(index + batch.length, missing.length)}/${missing.length}`);
    }
  }
}

saveMemory(memory);

if (dryRun) {
  console.log(`Dry run complete. Missing translations: ${totalMissing}`);
} else {
  console.log(`Translation complete. Missing translations before run: ${totalMissing}`);
}
