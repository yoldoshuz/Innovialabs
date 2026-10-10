import { isLocale, i18n } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { caseMeta, type CaseSlug } from "@/lib/content";
import { renderOg, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Innovialabs case study";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : i18n.defaultLocale);
  const item = dict.cases.items.find((c) => c.slug === slug) ?? dict.cases.items[0];
  const meta = caseMeta[item.slug as CaseSlug];
  const fact = item.facts[0];
  return renderOg({
    kicker: [dict.cases.title, item.industry, meta.year].filter(Boolean).join(" · "),
    title: item.name,
    subtitle: item.tagline,
    stat: fact ? { value: fact.value, label: fact.label } : undefined,
  });
}
