---
title: How to Add JSON-LD Schema Markup to Your Website
description: Ready JSON-LD examples for Organization, LocalBusiness, Product, Article, FAQ and Breadcrumb, plus how to validate markup with Google and Schema.org tools.
summary: JSON-LD is a script type="application/ld+json" block using the Schema.org vocabulary to describe a page for search engines; add the fitting type, fill it with real data and check it in a validator.
---
## The short answer: what JSON-LD is and where it goes

**JSON-LD** is the structured data format Google recommends. It is a JSON object using the **Schema.org** vocabulary inside a `<script type="application/ld+json">` tag. You can place it in `<head>` or `<body>`; it does not affect how the page looks.

Markup helps search engines understand exactly what a page is about: a company, a product, an article. In return the page may get a **rich result** with price, rating or breadcrumbs. There is no guarantee: the search engine decides.

The main rule: **markup must match the visible content**. Never mark up prices, reviews or questions that are not on the page.

## Organization — for the homepage

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Studio",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://t.me/example"]
}
```

## LocalBusiness — if you have an office or store

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Example Studio",
  "telephone": "+998 00 000 00 00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Example St",
    "addressLocality": "Tashkent",
    "addressCountry": "UZ"
  },
  "openingHours": "Mo-Fr 09:00-18:00"
}
```

Use a more specific subtype when one exists: `Restaurant`, `Dentist`, `Store`.

## Product — for a product page

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "X1 Wireless Headphones",
  "image": "https://example.com/x1.jpg",
  "sku": "X1-BLK",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "UZS",
    "availability": "https://schema.org/InStock"
  }
}
```

Fill price and availability from your database so the markup never drifts from the storefront.

## Article — for blog posts

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Improve LCP",
  "datePublished": "2026-01-15",
  "dateModified": "2026-02-01",
  "author": { "@type": "Organization", "name": "Example Studio" },
  "image": "https://example.com/cover.jpg"
}
```

## FAQPage — for a questions block

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How long does delivery take?",
    "acceptedAnswer": { "@type": "Answer", "text": "One to three days." }
  }]
}
```

Google shows FAQ rich results only for a limited set of authoritative sites, but the markup remains valid and helps machines understand the page structure.

## BreadcrumbList — breadcrumbs

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 2, "name": "SEO", "item": "https://example.com/blog/seo" }
  ]
}
```

## How to validate markup

1. Google's **Rich Results Test** shows which rich results a page is eligible for and which fields are required.
2. The **Schema Markup Validator** (validator.schema.org) checks syntax against the whole Schema.org vocabulary, including types Google does not use.
3. After publishing, watch the enhancement reports in Google Search Console to see errors across the whole site.

## Common mistakes

- Static markup that goes stale: the price changed, but JSON-LD still has the old one.
- JSON syntax errors: a trailing comma breaks the whole block.
- Relative links instead of absolute ones in `url`, `image` and `logo`.
- The same Product markup on every catalog page.

## FAQ

### Can a page have several JSON-LD blocks?

Yes. Organization, BreadcrumbList and Article can live side by side. Keep them as separate scripts or combine them in a `@graph` array.

### Does markup directly improve rankings?

Not by itself. It helps search engines understand the page and may earn a rich result that makes your listing more visible.

### Which is better: JSON-LD or Microdata?

Both are supported, but JSON-LD is easier to maintain: it stays separate from the HTML layout and is simple to generate from data.
