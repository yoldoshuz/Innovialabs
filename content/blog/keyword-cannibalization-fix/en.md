---
title: "Keyword Cannibalization: How to Detect and Fix It"
description: What keyword cannibalization is, why several pages targeting one query weaken a site, and how to fix it with merging, canonicals or re-targeting.
summary: Cannibalization happens when several pages on your site compete for one query and split its signals; you find it in Search Console and fix it by merging pages, using canonicals or re-targeting them to different queries.
---

## What keyword cannibalization is

**Keyword cannibalization** happens when two or more pages on the same site answer the same search intent. The search engine can't decide which one to show, and as a result:

- rankings fluctuate: one page shows up today, another one tomorrow;
- links, user signals and internal authority are split across several URLs;
- no single page gathers enough strength to hold a top position.

Note: two pages on similar keywords are not automatically a problem. The problem is **identical intent**. An article on "how to choose a CRM" and a service page for "CRM implementation" solve different tasks and usually coexist fine.

## How to detect it

### In Google Search Console

1. Open the Performance report.
2. Filter by the query you care about.
3. Switch to the Pages tab.

If several URLs get impressions and clicks for one query, that's a candidate. It's especially suspicious when the page graphs alternate: one rises while the other drops on the same days.

### In Yandex Webmaster

The search query statistics section shows which pages appeared for a query. Same logic: several URLs for one intent is a reason to investigate.

### With a site search

A quick manual check: search `site:example.com key phrase` in Google. If several pages with nearly identical titles show up, they are probably competing.

### Typical causes

- Several blog posts on the same topic written at different times.
- A category and a tag listing the same products.
- Online store filter pages left open for indexing.
- Duplicates with URL parameters, `www` vs non-`www`, trailing slash vs none.

## How to fix it: four options

| Option | When it fits |
|---|---|
| Merge + 301 redirect | Pages cover the same thing and both have value |
| Canonical | Users need both pages, but only one should be indexed |
| Re-targeting | Pages can be split into different intents |
| Delete or noindex | The page is useful neither to people nor to search |

### Merging

The most effective option when pages essentially duplicate each other. Pick the main one (usually the page with more links and traffic), move the best parts of the other page into it, and **301 redirect** the second URL to the main one. Update internal links too.

### Canonical

Use it when both pages must stay accessible — for example, a product listed in several categories. On the secondary page, point to the main one:

```html
<link rel="canonical" href="https://example.com/main-page/" />
```

Keep in mind that canonical is a hint, not a directive: the search engine may ignore it if the pages differ significantly in content.

### Re-targeting

If the pages can be separated, shift one of them to a different intent: change the title, H1, the focus of the text and the anchors of internal links. For example, one article stays an overview while the other becomes a step-by-step guide for a different query.

### Delete or noindex

Outdated, thin pages without traffic or links are easier to remove. If they do have backlinks, a redirect to a relevant page is still the better choice.

## How to prevent it

- Keep a **keyword map**: one cluster, one target page.
- Before writing a new article, check whether a page on that topic already exists.
- Block service and filter pages without search demand from indexing.
- Watch internal links: anchors with the main keyword should point to the target page.

## FAQ

### Is cannibalization always bad?

No. If two of your pages rank for a query and both hold their positions steadily, that's more of a win. The problem is unstable rankings where no page grows.

### Should I use a 301 redirect or a canonical?

If users don't need the second page, use a 301 redirect — it's a stronger and unambiguous signal. Keep canonicals for cases where both pages must remain available.

### How soon will I see results?

It depends on how often search engines crawl your site. Changes usually appear gradually, after the affected pages are re-indexed.
