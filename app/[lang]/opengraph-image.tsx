import { isLocale, i18n } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { renderOg, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Innovialabs — Where ideas become products.";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : i18n.defaultLocale);
  return renderOg({
    title: `${dict.hero.titleTop} ${dict.hero.titleBottom}`,
    subtitle: dict.hero.lead,
  });
}
