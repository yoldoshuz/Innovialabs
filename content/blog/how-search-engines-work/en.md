---
title: How Search Engines Work: Crawling, Indexing and Ranking
description: How Google and Yandex discover, render, store and rank web pages, and what a site owner can actually influence at each stage of the process.
summary: A search engine first discovers a page with a crawler, then renders and stores it in its index, and on each query picks the most useful answers from that index. Site owners influence every stage through accessibility, clear markup and content quality.
---

## In short: four stages

Google and Yandex follow the same pattern:

1. **Discovery** — the crawler learns that a page exists.
2. **Crawling and rendering** — the crawler downloads the page and runs JavaScript when needed.
3. **Indexing** — the engine analyzes the content and decides whether to store the page.
4. **Ranking** — on every query, the system picks matching pages from the index and sorts them.

If a page drops out at any stage, it never reaches the user.

## Discovery: how crawlers find pages

A crawler (Googlebot, YandexBot) follows links and reads lists of URLs. Main sources:

- **internal links** from other pages of your site;
- **external links** from other sites;
- **sitemap.xml** — a file listing your pages;
- manual URL submission in Google Search Console or Yandex Webmaster.

**What you control:** a page nothing links to (an "orphan") may never be found. Keep the sitemap up to date and link important pages together.

## Crawling and rendering

The crawler requests the page from your server. What matters here:

- **robots.txt** — allows or blocks crawling of sections;
- **server response** — 200 for live pages, 301 for moves, 404 for removed ones;
- **speed and stability** — if the server is slow or returns errors, the crawler fetches less.

Modern search engines can execute JavaScript, but rendering costs resources and may be delayed. If key text only appears after scripts run, it may be picked up later or incompletely. That is why content sites often choose **server-side rendering (SSR) or static generation**.

## Indexing: will the page be stored

Not every crawled page makes it into the index. The engine may reject it if it:

- carries a `noindex` tag;
- duplicates another page (then the **canonical** version counts);
- is nearly empty or unhelpful;
- returns an error or redirects.

```html
<!-- Block indexing -->
<meta name="robots" content="noindex">

<!-- Point to the main version of the page -->
<link rel="canonical" href="https://example.com/services/seo">
```

**What you control:** unique content, correct canonicals, no stray `noindex`. Check the status in the indexing reports of Search Console and Webmaster.

## Ranking: who ends up on top

For a query, the system selects matching pages within a fraction of a second and sorts them. Exact formulas are secret, but the main factor groups are known:

| Group | Examples |
|---|---|
| **Relevance** | how well the page answers the meaning of the query, not just its words |
| **Quality and expertise** | completeness, accuracy, a clear author and source |
| **Authority** | links and mentions from other sites |
| **Usability** | speed, mobile version, no intrusive elements |
| **Context** | user location, language, device type |
| **Behavior** | Yandex gives noticeable weight to how users interact with results |

Results are personalized: two people in different cities may see different pages.

## Where pages get lost: checklist

- The page has no links to it and is missing from the sitemap.
- A section is accidentally blocked in robots.txt.
- The server returns 5xx or responds very slowly.
- Main content loads only via script after a user action.
- A `noindex` left over from a staging version.
- Several URLs with identical content and no canonical.
- The text does not answer the query the page was built for.

## FAQ

### How long does it take for a new page to appear in search?

There is no fixed time: anywhere from a few days to a few weeks. Links from already indexed pages, an up-to-date sitemap and URL submission through webmaster tools speed it up.

### Do Google and Yandex work differently?

The stages are the same, but ranking algorithms, indexing speed and factor weights differ. That is why one site's positions in the two engines often do not match.

### Can I pay a search engine for an organic position?

No. You can only pay for ads, which are labeled separately. Organic positions depend on the site's quality and relevance.
