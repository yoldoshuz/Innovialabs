import type { MetadataRoute } from "next";
import { i18n, localeMeta, type Locale } from "@/lib/i18n/config";
import { serviceSlugs, caseSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

/** Every content path (without locale prefix), with a crawl priority. */
const paths: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.9 },
  ...serviceSlugs.map((s) => ({ path: `/services/${s}`, priority: 0.7 })),
  { path: "/cases", priority: 0.9 },
  ...caseSlugs.map((s) => ({ path: `/cases/${s}`, priority: 0.7 })),
  { path: "/company", priority: 0.8 },
  { path: "/contacts", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const url = (locale: Locale, path: string) =>
    `${siteConfig.url}/${locale}${path}`;

  return paths.map(({ path, priority }) => ({
    url: url(i18n.defaultLocale, path),
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: Object.fromEntries(
        i18n.locales.map((l) => [localeMeta[l].hreflang, url(l, path)]),
      ),
    },
  }));
}
