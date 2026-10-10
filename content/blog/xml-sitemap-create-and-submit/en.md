---
title: How to Create an XML Sitemap and Submit It to Search Engines
description: Sitemap format, which pages to include and exclude, sitemap index files, generation in CMSs and frameworks, and submitting your sitemap to Google and Yandex.
summary: An XML sitemap lists canonical, indexable URLs. Generate it with your CMS or framework, reference it in robots.txt and submit it in Google Search Console and Yandex Webmaster.
---
## The short answer

A **sitemap.xml** is a file listing the pages you want in search results. It helps search engines discover new and updated URLs faster, especially on large sites and in poorly linked sections. The process: generate the sitemap, make sure it contains only the right pages, reference it in robots.txt and submit it in webmaster tools.

## File format

A minimal sitemap looks like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-09-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/services/</loc>
  </url>
</urlset>
```

Key rules:

- full absolute URLs with protocol;
- UTF-8 encoding;
- no more than **50,000 URLs** and **50 MB** uncompressed per file;
- use `lastmod` only if it honestly reflects a content change.

Google ignores `changefreq` and `priority`, so there is no need to spend time on them.

## What to include and exclude

| Include | Exclude |
|---|---|
| Canonical pages returning 200 | Redirects and error pages |
| Pages open for indexing | URLs with noindex or blocked in robots.txt |
| Key categories, products, articles | Duplicates, filters, sort parameters |
| All language versions | Cart, account area, site search |

The core principle: the sitemap must not contradict other signals. A URL in the sitemap that carries noindex is a mistake.

## Index file for large sites

If you exceed the limit or want to split the sitemap by type, use a **sitemap index**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>https://example.com/sitemap-products.xml</loc></sitemap>
</sitemapindex>
```

Splitting by type also makes diagnostics easier: webmaster tools show which section gets indexed worse.

## Generating it in CMSs and frameworks

- **WordPress** — the core built-in sitemap or SEO plugins (Yoast, Rank Math).
- **Bitrix, Tilda, Shopify** — sitemaps are generated natively; enable and check them.
- **Next.js** — an `app/sitemap.ts` file that returns an array of URLs pulled from a database or CMS.
- **Other frameworks** — generator packages or your own endpoint that builds XML from the database.

The sitemap should update automatically when pages are published or removed, not be assembled by hand once a year.

## Submitting to Google and Yandex

1. Add a line to robots.txt: `Sitemap: https://example.com/sitemap.xml`.
2. **Google Search Console** — the "Sitemaps" report; paste the sitemap URL.
3. **Yandex Webmaster** — "Indexing" → "Sitemap files".
4. A few days later, check the status: read errors and the number of discovered URLs.

## Common mistakes

- URLs use http instead of https, or a www variant that does not match the main host.
- Pages with redirects and 404s are included.
- `lastmod` changes on every build even though content did not.
- The sitemap is blocked in robots.txt or returns a server error.

## FAQ

### Does a sitemap guarantee indexing?

No. It helps search engines discover pages, but they decide on indexing based on content quality and usefulness.

### Does a small site need a sitemap?

If there are few pages and all are linked, search engines will find them anyway. Still, a sitemap does no harm and makes indexing easier to monitor.

### How often should it be updated?

Ideally automatically, whenever the set of pages changes. You do not need to resubmit it in webmaster tools after every update.
