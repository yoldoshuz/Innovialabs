---
title: What Is a Canonical Tag and When to Use It
description: What the canonical tag does, when to use it for URL parameters, sorting and duplicates, and which mistakes can push pages out of the search index.
summary: rel=canonical tells search engines which URL is the main one among identical or near-identical pages. It consolidates signals on one version and keeps duplicates out of results, but a wrong setup can deindex the pages you need.
---
## The short answer

A **canonical URL** is the main version of a page — the one you want to appear in search. When the same content is available at several addresses, the `rel="canonical"` tag tells search engines: "index and rank this address, the others are copies of it".

The tag goes in the `<head>`:

```html
<link rel="canonical" href="https://example.com/catalog/shoes/" />
```

Important: canonical is a **hint, not a directive**. Google and Yandex weigh it together with other signals (redirects, internal links, sitemap) and may pick a different version if those signals conflict.

## Where duplicates come from

Sites often create duplicates on their own:

- **URL parameters**: `?utm_source=...`, `?ref=...`, session IDs;
- **sorting and view options**: `?sort=price`, `?view=grid`;
- `www` and non-`www`, `http` and `https`, trailing slash or not;
- one product in several categories: `/men/sneakers/model-x` and `/sale/model-x`;
- print versions, AMP pages, content republished on other sites.

Without a canonical, the search engine decides on its own which version is primary, and link equity and behavioural signals are split between the copies.

## When to use canonical

| Situation | What to do |
|---|---|
| UTM tags and tracking parameters | canonical to the clean URL |
| Sorting of the same product list | canonical to the unsorted page |
| Product in several categories | canonical to one main address |
| Content republished on another site | canonical from the copy to the original (cross-domain) |
| Any regular page | self-referencing canonical |

A **self-referencing canonical** points to the page itself. Put it everywhere: it protects you from parameter duplicates you did not anticipate.

## When canonical is the wrong tool

- **Pages with different content.** If a "red sneakers" filter is a real landing page targeting its own query, do not fold it into the general catalog.
- **Pagination.** Pointing page 2 and beyond to page 1 is a common mistake: products on deeper pages lose their path into the index. Usually each paginated page needs its own canonical.
- **A permanent move.** If the old address is no longer needed, use a **301 redirect**, not a canonical.
- **Keeping a page out of the index.** That is what `noindex` is for; canonical does not guarantee exclusion.

## Mistakes that get pages deindexed

- **Every page points to the home page.** Often caused by a CMS template with a hard-coded canonical. The search engine may treat the whole site as a duplicate of the home page.
- **Canonical to a page that redirects, returns 404 or is noindex.** The signals conflict, and the engine ignores the hint or drops both versions.
- **Relative or wrong addresses.** A wrong protocol, domain or a stray parameter in the canonical causes confusion. Use absolute URLs.
- **Several canonicals on one page.** For example, one from the theme and one from an SEO plugin. Search engines may then ignore both.
- **A JavaScript-injected canonical that differs from the HTML.** Put it in the source HTML.
- **Chains.** Page A points to B, and B points to C. Point straight to the final address.

## How to check

1. Open the page source and find `rel="canonical"` — there should be exactly one, with an absolute URL.
2. In **Google Search Console**, use URL Inspection: it shows the canonical you declared and the one Google selected.
3. In **Yandex Webmaster**, check the pages-in-search report: excluded non-canonical pages are listed separately.
4. Crawl the site and look for canonicals that lead to redirects, 404s or the wrong template.

## FAQ

### Do I need a canonical if my site has no duplicates?

Yes, add a self-referencing canonical to every indexable page. Parameter duplicates appear from ads, social networks and external links even if you never created them.

### How is canonical different from a 301 redirect?

A redirect sends users and bots to another address, while a canonical keeps both pages accessible and only hints which one to show in search. If people do not need the copy, use a redirect.

### Why did Google pick a different canonical than mine?

Most likely other signals contradict your tag: internal links point to another version, the sitemap lists a different address, or the pages differ in content. Align all signals on one URL.
