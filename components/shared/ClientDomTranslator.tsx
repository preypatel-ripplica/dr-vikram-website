import { useRouter } from "next/router";
import { useEffect } from "react";
import { DEFAULT_LOCALE, type Locale, normalizeTranslationText, translateText } from "@/lib/i18n";

const SAFE_ATTRIBUTES = ["alt", "aria-label", "placeholder", "title"];
const SKIPPED_TAGS = new Set([
  "CODE",
  "IFRAME",
  "NOSCRIPT",
  "PRE",
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
]);

function preserveOuterWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function shouldSkipNode(node: Node) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (parent.closest("[data-no-translate]")) return true;
  return SKIPPED_TAGS.has(parent.tagName);
}

function translateTextNode(node: Text, locale: Locale) {
  if (shouldSkipNode(node)) return;

  const original = node.nodeValue ?? "";
  const normalized = normalizeTranslationText(original);
  if (!normalized) return;

  const translated = translateText(locale, normalized);
  if (translated !== normalized) {
    node.nodeValue = preserveOuterWhitespace(original, translated);
  }
}

function translateElementAttributes(element: Element, locale: Locale) {
  if (element.closest("[data-no-translate]")) return;

  for (const attribute of SAFE_ATTRIBUTES) {
    const original = element.getAttribute(attribute);
    if (!original) continue;

    const normalized = normalizeTranslationText(original);
    const translated = translateText(locale, normalized);

    if (translated !== normalized) {
      element.setAttribute(attribute, translated);
    }
  }
}

function translateDocument(locale: Locale) {
  if (locale === DEFAULT_LOCALE) return;
  if (!document.body) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => translateTextNode(node, locale));
  document
    .querySelectorAll(SAFE_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(","))
    .forEach((element) => translateElementAttributes(element, locale));
}

export function ClientDomTranslator({ locale }: { locale: Locale }) {
  const router = useRouter();

  useEffect(() => {
    if (locale === DEFAULT_LOCALE) return;

    let scheduled = false;
    let frame = 0;

    const scheduleTranslation = () => {
      if (scheduled) return;

      scheduled = true;
      frame = window.requestAnimationFrame(() => {
        scheduled = false;
        translateDocument(locale);
      });
    };

    scheduleTranslation();

    const observer = new MutationObserver((mutations) => {
      const hasRelevantChange = mutations.some((mutation) => {
        if (mutation.type === "characterData") return true;
        if (mutation.type === "attributes") return true;

        return Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            return Boolean(normalizeTranslationText(node.textContent));
          }

          return node.nodeType === Node.ELEMENT_NODE;
        });
      });

      if (hasRelevantChange) {
        scheduleTranslation();
      }
    });

    observer.observe(document.body, {
      attributeFilter: SAFE_ATTRIBUTES,
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [locale, router.asPath]);

  return null;
}
