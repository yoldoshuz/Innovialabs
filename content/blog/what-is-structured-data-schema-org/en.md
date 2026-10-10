---
title: What Is Structured Data and Schema.org Markup
description: What structured data and Schema.org are, how JSON-LD differs from Microdata, the most common markup types and what search engines actually do with it.
summary: Structured data is a machine-readable description of page content using the Schema.org vocabulary: product, article, organization, review. It helps search engines understand a page and may earn a rich result, but it guarantees neither the rich result nor higher rankings.
---
## The short answer

**Structured data** describes page content in a format programs can read easily. A person sees "Laptop, 12,000,000 UZS, in stock" on the page; through markup, a search engine gets the same information as fields: type — product, price, currency, availability.

**Schema.org** is the shared vocabulary for these descriptions, supported by Google, Yandex, Bing and others. It defines types (`Product`, `Article`, `Organization`) and their properties (`name`, `price`, `author`).

## Markup formats

| Format | What it looks like | When to use |
|---|---|---|
| **JSON-LD** | A separate `<script type="application/ld+json">` block | The default choice: kept apart from layout, easier to maintain |
| **Microdata** | `itemscope`, `itemprop` attributes inside the HTML | Older templates and CMSs that already use it |
| **RDFa** | `vocab`, `property` attributes in the HTML | Less common, mostly in specific systems |

Google recommends JSON-LD, and Yandex supports it too. If you are starting from scratch, choose it.

An example for an article:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What Is Structured Data",
  "author": { "@type": "Organization", "name": "Company Name" },
  "datePublished": "2026-01-15",
  "image": "https://example.com/cover.jpg"
}
</script>
```

## Common types

- **Organization / LocalBusiness** — name, logo, contacts, address, opening hours.
- **Product + Offer** — product, price, availability; often with **AggregateRating** and **Review**.
- **Article / BlogPosting** — headline, author, date, image.
- **BreadcrumbList** — breadcrumbs that may appear in the snippet instead of the URL.
- **FAQPage** — questions and answers on the page.
- **Event, Recipe, JobPosting, Course** — for matching content.
- **WebSite** — a description of the site as a whole.

## What search engines do with it

1. **Understand the page better.** Which entity is described, who the author is, which organisation the content belongs to.
2. **May show a rich result:** rating stars, price, breadcrumbs, event details.
3. **Reuse the data elsewhere:** business profiles, shopping features, knowledge panels.

What markup **does not** do:

- It is not a direct ranking factor and does not lift positions by itself.
- It does not guarantee a rich result — the search engine decides, and the set of supported types changes over time.
- It won't fix a weak page.

The indirect benefit is real: a more prominent snippet can attract more clicks.

## How to implement it without errors

1. **Mark up only what is visible on the page.** The price in the markup must match the page; reviews must be genuine.
2. **Generate markup from the same data** as the content — in a CMS template or component, not by hand on every page.
3. **Fill in required and recommended properties** for the type you use.
4. **Validate:** Google's Rich Results Test, the Schema.org validator and the checker in Yandex Webmaster.
5. **Watch the reports** in Search Console and Yandex Webmaster after publishing.

## Common mistakes

- Marking up data that isn't on the page — this breaks search engine guidelines and can lead to manual actions.
- The same `Organization` with different details on different pages.
- Self-serving reviews of your own company marked up on its own site to get stars — Google does not show stars for them.
- Markup that isn't updated when price or availability changes.

## FAQ

### Does a small site need structured data?

Yes, at least the basics: `Organization` or `LocalBusiness`, `BreadcrumbList` and markup for the main content type. It takes little time and makes the site easier for search engines to understand.

### JSON-LD or Microdata?

JSON-LD, unless you have a specific reason. It is separate from layout and easier to generate and validate. Microdata makes sense only if your CMS already has it built in.

### Why is there markup but no rich result?

The search engine decides whether to show it. Check the markup for errors and that it matches the content; if everything is correct, keep improving the page quality and give it time.
