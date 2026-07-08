import type { ElementType } from "react";
import { useI18n } from "@/lib/i18n-context";

type LocalizedHighlightProps = {
  as?: ElementType;
  className?: string;
  source: string;
  highlight: string;
};

export function LocalizedHighlight({
  as: Component = "span",
  className,
  source,
  highlight,
}: LocalizedHighlightProps) {
  const { t } = useI18n();
  const translatedSource = t(source);
  const translatedHighlight = t(highlight);
  const highlightIndex = translatedSource.indexOf(translatedHighlight);

  if (highlightIndex === -1 || !translatedHighlight) {
    return <Component className={className}>{translatedSource}</Component>;
  }

  const before = translatedSource.slice(0, highlightIndex);
  const after = translatedSource.slice(highlightIndex + translatedHighlight.length);

  return (
    <Component className={className}>
      {before}
      <span>{translatedHighlight}</span>
      {after}
    </Component>
  );
}
