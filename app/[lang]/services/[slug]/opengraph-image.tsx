import { isLocale, i18n } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { renderOg, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Innovialabs service";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : i18n.defaultLocale);
  const item = dict.services.items.find((s) => s.slug === slug) ?? dict.services.items[0];
  return renderOg({
    kicker: dict.services.meta.title,
    title: item.title,
    subtitle: item.subtitle,
  });
}
