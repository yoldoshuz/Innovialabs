import type { Metadata } from "next";
import { i18n, localeMeta, type Locale } from "@/lib/i18n/config";

/**
 * Builds per-page metadata with canonical + hreflang alternates for a given
 * route path (e.g. "/services"). `title` is augmented by the root layout's
 * title template; `metadataBase` is inherited from the layout.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const languages = Object.fromEntries(
    i18n.locales.map((l) => [localeMeta[l].hreflang, `/${l}${path}`]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { ...languages, "x-default": `/${i18n.defaultLocale}${path}` },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/${lang}${path}`,
      locale: localeMeta[lang].ogLocale,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
