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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD (Schema.org)
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

export function organizationJsonLd(lang: Locale, description: string): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.name,
        url: abs(`/${lang}`),
        logo: abs(siteConfig.logo.png),
        slogan: siteConfig.slogan,
        description,
        email: siteConfig.email,
        foundingDate: String(siteConfig.foundingYear),
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.address.city,
          addressCountry: siteConfig.address.country,
        },
        areaServed: ["UZ", "KZ", "KG", "AZ", "RU"],
        knowsLanguage: ["uz", "ru", "en"],
        sameAs: [siteConfig.telegram.bot],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteConfig.email,
          availableLanguage: ["Uzbek", "Russian", "English"],
          ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        },
      },
      {
        "@type": "WebSite",
        "@id": abs("/#website"),
        url: abs(`/${lang}`),
        name: siteConfig.name,
        inLanguage: localeMeta[lang].hreflang,
        publisher: { "@id": orgId },
      },
    ],
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

export function serviceJsonLd({
  lang,
  slug,
  name,
  description,
}: {
  lang: Locale;
  slug: string;
  name: string;
  description: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: abs(`/${lang}/services/${slug}`),
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    inLanguage: localeMeta[lang].hreflang,
  };
}

/** All services as an OfferCatalog on the organization. */
export function servicesJsonLd(
  lang: Locale,
  items: { slug: string; title: string; subtitle: string; points: string[] }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: siteConfig.name,
    url: abs(`/${lang}/services`),
    itemListElement: items.map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.title,
        description: `${item.subtitle}. ${item.points.join("; ")}`,
        provider: { "@id": orgId },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
      },
    })),
  };
}

export function caseJsonLd({
  lang,
  slug,
  name,
  description,
  image,
  year,
  url,
}: {
  lang: Locale;
  slug: string;
  name: string;
  description: string;
  image: string;
  year?: number;
  url: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: abs(`/${lang}/cases/${slug}`),
    image: abs(image),
    ...(year ? { dateCreated: String(year) } : {}),
    inLanguage: localeMeta[lang].hreflang,
    creator: { "@id": orgId },
    sameAs: url,
  };
}
