---
title: Internal Linking for SEO: Strategy and Best Practices
description: How internal links distribute value, why hub pages matter, how to choose anchors, find orphan pages and apply practical linking patterns for blogs and catalogs.
summary: Internal links tell search engines which pages matter and how they relate: point more links at key pages through hubs, use descriptive anchors and leave no page without incoming links.
---
## How internal linking works

Internal links do three jobs:

- **Help pages get discovered.** Crawlers follow links; a page with no links may be missed or crawled rarely.
- **Distribute value.** Pages that receive many internal links, especially from the homepage and sections, are treated as more important.
- **Explain the topic.** The link text and surrounding content hint at what the target page is about.

Hence the main rule: **the pages that matter most to the business should get the most internal links and sit close to the homepage** — within a few clicks.

## Hub pages

A **hub** is an overview page on a topic that links to all the detailed pieces, while they link back to the hub and to each other. This forms a topic cluster.

A blog example:

- hub: "Everything about CRM for small business";
- articles: choosing a CRM, implementation, mistakes, telephony integration, moving from Excel;
- each article links to the hub and to 2–3 sibling articles.

In a catalog, categories and collections act as hubs: "Laptops" → "Laptops for work" → product pages.

## How to choose anchors

An anchor is the clickable text of a link. Rules for internal links are softer than for external ones, but the idea is the same:

| Bad | Good |
|---|---|
| "click here" | "how to choose a CRM" |
| "read more" | "amoCRM vs Bitrix24 comparison" |
| the same anchor on every link | natural variations of the wording |

- The anchor should **describe the target page**.
- Vary the wording — it connects the page to a wider set of queries.
- Avoid two links with different anchors to the same page in one paragraph.

## Orphan pages

An **orphan page** has no internal links pointing to it. It may be in the sitemap, but for search engines that is a weak signal of importance.

How to find them:

1. Crawl the site with a crawler such as Screaming Frog or similar to get the list of pages reachable through links.
2. Compare it with the sitemap and with URLs that get traffic in Google Search Console.
3. Anything in the sitemap or analytics that the crawler did not find is an orphan candidate.

Then decide: either add links from relevant pages and hubs, or, if the page is not needed, merge it with another one or remove it with a redirect.

## Practical patterns

### For a blog

- 3–5 contextual in-text links per article to related pieces.
- A "Related reading" block with topically close articles, not just the latest ones.
- Links from articles to commercial service pages where it helps the reader.
- When you publish a new article, add links to it from 2–3 older ones.

### For a catalog

- **Breadcrumbs** on every page: they link to parent sections.
- Filters that matter for search as separate indexable pages linked from categories.
- "Similar products" and "Frequently bought together" blocks on product pages.
- Links from articles and guides to matching categories.

## Common mistakes

- Important pages buried deep — many clicks away.
- Menus and footers with hundreds of links that drown out the valuable ones.
- Links pointing to redirects or 404 pages.
- Internal links with `nofollow` — value does not flow between your own pages.
- JavaScript-only navigation without regular `<a href>` links.

```html
<!-- Good: a regular link crawlers can follow -->
<a href="/blog/choose-crm">how to choose a CRM</a>

<!-- Bad: navigation only through a click handler -->
<span onclick="go('/blog/choose-crm')">read more</span>
```

## FAQ

### How many internal links should an article have?

There is no strict limit. Let usefulness guide you: add a link where the reader may genuinely need the related topic, not to hit a number.

### Do menu and footer links help?

Yes, they make pages reachable from the whole site. But contextual in-text links give search engines more information about the topic, so both kinds matter.

### How often should I review internal linking?

Add links to every new article when you publish it, and every few months crawl the site to check for orphans, broken links and redirects.
