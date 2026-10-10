import type { Metadata } from "next";
import { i18n, localeMeta, type Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

const abs = (path: string) => `${siteConfig.url}${path}`;

/** Canonical + hreflang alternates (every locale + x-default) for a path. */
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  const languages = Object.fromEntries(
    i18n.locales.map((l) => [localeMeta[l].hreflang, `/${l}${path}`]),
  );
  return {
    canonical: `/${lang}${path}`,
    languages: { ...languages, "x-default": `/${i18n.defaultLocale}${path}` },
  };
}

/**
 * Per-page metadata. `title` is wrapped by the layout's title template;
 * OG/Twitter images come from the nearest `opengraph-image` file.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  type = "website",
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      type,
      siteName: siteConfig.name,
      title: `${title} — ${siteConfig.name}`,
      description,
      url: `/${lang}${path}`,
      locale: localeMeta[lang].ogLocale,
      alternateLocale: i18n.locales.filter((l) => l !== lang).map((l) => localeMeta[l].ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD (Schema.org). Every node links back to the organization and
 * the website by @id, so search engines see one connected graph.
 * ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

/** Renders structured data; `<` is escaped to prevent script injection. */
export function JsonLd({ data }: { data: Json }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const orgId = abs("/#organization");
export const websiteId = abs("/#website");
const catalogId = (lang: Locale) => abs(`/${lang}/services#catalog`);

// Uzbekistan and CIS first, but we work remotely with clients anywhere.
const areaServed = [
  { "@type": "Place", name: "Worldwide" },
  { "@type": "Country", name: "Uzbekistan" },
  { "@type": "Country", name: "Kazakhstan" },
  { "@type": "Country", name: "Kyrgyzstan" },
  { "@type": "Country", name: "Azerbaijan" },
  { "@type": "Country", name: "Russia" },
];

/** Organization + WebSite, rendered once per page by the locale layout. */
export function organizationJsonLd({
  lang,
  description,
  slogan,
  services,
}: {
  lang: Locale;
  description: string;
  slogan: string;
  services: string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        alternateName: siteConfig.alternateNames,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          "@id": abs("/#logo"),
          url: abs(siteConfig.logo.png),
          contentUrl: abs(siteConfig.logo.png),
          width: 512,
          height: 512,
          caption: siteConfig.name,
        },
        image: { "@id": abs("/#logo") },
        slogan,
        description,
        email: siteConfig.email,
        ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        foundingDate: String(siteConfig.foundingYear),
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.address.city,
          addressRegion: siteConfig.address.region,
          addressCountry: siteConfig.address.country,
        },
        areaServed,
        knowsLanguage: ["uz", "ru", "en"],
        knowsAbout: services,
        hasOfferCatalog: { "@id": catalogId(lang) },
        sameAs: siteConfig.sameAs,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteConfig.email,
            url: abs(`/${lang}/brief`),
            areaServed: "UZ",
            availableLanguage: ["Uzbek", "Russian", "English"],
            ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.alternateNames,
        description,
        inLanguage: i18n.locales.map((l) => localeMeta[l].hreflang),
        publisher: { "@id": orgId },
      },
    ],
  };
}

/** The page itself, tied to the site and the organization by @id. */
export function webPageJsonLd({
  lang,
  path,
  name,
  description,
  type = "WebPage",
}: {
  lang: Locale;
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage";
}): Json {
  const url = abs(`/${lang}${path}`);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: localeMeta[lang].hreflang,
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
    publisher: { "@id": orgId },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

type ServiceLike = { slug: string; title: string; subtitle: string; points: string[] };

const serviceNode = (lang: Locale, item: ServiceLike) => ({
  "@type": "Service",
  "@id": abs(`/${lang}/services/${item.slug}#service`),
  name: item.title,
  serviceType: item.title,
  description: `${item.subtitle}. ${item.points.join("; ")}`,
  url: abs(`/${lang}/services/${item.slug}`),
  provider: { "@id": orgId },
  areaServed,
  availableLanguage: ["uz", "ru", "en"],
});

/** One service page: the service plus how we deliver it, step by step. */
export function serviceJsonLd({
  lang,
  item,
  steps,
}: {
  lang: Locale;
  item: ServiceLike;
  steps: { title: string; text: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    ...serviceNode(lang, item),
    inLanguage: localeMeta[lang].hreflang,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: item.title,
      itemListElement: item.points.map((point) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: point },
      })),
    },
    potentialAction: {
      "@type": "CommunicateAction",
      name: item.title,
      target: abs(`/${lang}/brief`),
    },
    subjectOf: {
      "@type": "HowTo",
      name: item.title,
      step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
    },
  };
}

/** All services as the organization's OfferCatalog. */
export function servicesJsonLd(lang: Locale, name: string, items: ServiceLike[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": catalogId(lang),
    name,
    url: abs(`/${lang}/services`),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "Offer",
      position: i + 1,
      itemOffered: serviceNode(lang, item),
    })),
  };
}

/** Cases list as an ItemList (each item points at its case page). */
export function casesListJsonLd(lang: Locale, items: { slug: string; name: string; tagline: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/${lang}/cases/${item.slug}`),
      name: `${item.name}: ${item.tagline}`,
    })),
  };
}

export function caseJsonLd({
  lang,
  slug,
  name,
  headline,
  description,
  about,
  year,
  url,
}: {
  lang: Locale;
  slug: string;
  name: string;
  headline: string;
  description: string;
  about: string;
  year?: number;
  url?: string;
}): Json {
  const page = abs(`/${lang}/cases/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${page}#case`,
    name,
    headline,
    description,
    about,
    url: page,
    image: abs(`/${lang}/cases/${slug}/opengraph-image`),
    ...(year ? { dateCreated: String(year) } : {}),
    inLanguage: localeMeta[lang].hreflang,
    creator: { "@id": orgId },
    publisher: { "@id": orgId },
    isPartOf: { "@id": websiteId },
    ...(url ? { sameAs: url } : {}),
  };
}

/* ------------------------------------------------------------------ *
 * Blog
 * ------------------------------------------------------------------ */

/** A blog listing (index, page N, category) as an ItemList of posts. */
export function blogListJsonLd({
  lang,
  name,
  description,
  posts,
}: {
  lang: Locale;
  name: string;
  description: string;
  posts: { slug: string; title: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/${lang}/blog/${p.slug}`),
      name: p.title,
    })),
  };
}

export function blogPostJsonLd({
  lang,
  post,
  section,
}: {
  lang: Locale;
  post: { slug: string; title: string; description: string; summary: string; date: string; tags: string[]; minutes: number };
  section: string;
}): Json {
  const url = abs(`/${lang}/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    abstract: post.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    inLanguage: localeMeta[lang].hreflang,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: section,
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.minutes}M`,
    isAccessibleForFree: true,
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    isPartOf: { "@id": websiteId },
  };
}
