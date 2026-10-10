import type { MetadataRoute } from "next";
import { i18n, localeMeta, type Locale } from "@/lib/i18n/config";
import { caseSlugs, serviceSlugs } from "@/lib/content";
import { allMetas, blogCategories, countByCategory, pageCount } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

/** Every content path (without locale prefix), with crawl hints. */
const paths = (): Entry[] => [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  ...serviceSlugs.map((s): Entry => ({ path: `/services/${s}`, priority: 0.85, changeFrequency: "monthly" })),
  { path: "/cases", priority: 0.8, changeFrequency: "weekly" },
  ...caseSlugs.map((s): Entry => ({ path: `/cases/${s}`, priority: 0.7, changeFrequency: "monthly" })),
  { path: "/brief", priority: 0.7, changeFrequency: "yearly" },
  { path: "/company", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contacts", priority: 0.7, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  ...Array.from({ length: Math.max(0, pageCount() - 1) }, (_, i): Entry => ({
    path: `/blog/page/${i + 2}`,
    priority: 0.4,
    changeFrequency: "weekly",
  })),
  ...blogCategories
    .filter((c) => countByCategory()[c] > 0)
    .map((c): Entry => ({ path: `/blog/category/${c}`, priority: 0.6, changeFrequency: "weekly" })),
  ...allMetas().map((m): Entry => ({ path: `/blog/${m.slug}`, priority: 0.6, changeFrequency: "monthly" })),
];

/** One entry per locale URL, each listing all its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (locale: Locale, path: string) => `${siteConfig.url}/${locale}${path}`;

  return paths().flatMap(({ path, priority, changeFrequency }) =>
    i18n.locales.map((locale) => ({
      url: url(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            i18n.locales.map((l) => [localeMeta[l].hreflang, url(l, path)]),
          ),
          "x-default": url(i18n.defaultLocale, path),
        },
      },
    })),
  );
}
