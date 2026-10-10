---
title: Duplicate Content: What It Is and How It Hurts SEO
description: Full and partial duplicate pages, where they come from (www, trailing slashes, parameters, print pages) and how to fix each type of duplicate.
summary: Duplicate content is the same or nearly identical content at different URLs. It confuses search engines about which page to rank, splits link signals and wastes crawl resources; fix it with 301 redirects, rel=canonical and proper parameter handling.
---
## What duplicates are and why they matter

A **duplicate** is a page whose content fully or almost fully matches another page on the site but lives at a different address.

- **Full duplicates** — the same content at different URLs: `site.uz/page` and `site.uz/page/`.
- **Partial duplicates** — pages that share a large share of text: product pages that differ only by color, filter and pagination pages, identical category descriptions.

Why it hurts:

- the search engine picks which version to show, and it may pick the wrong one;
- external and internal links are spread across copies instead of strengthening one page;
- the crawler spends time on copies instead of new pages;
- pages can swap places in results, so rankings "jump".

A technical duplicate on its own usually does not lead to a penalty. Penalties become possible when copying is used to manipulate rankings — for example, mass-cloning pages for different queries.

## Common technical causes and fixes

| Cause | Example | Fix |
|---|---|---|
| www vs non-www | `www.site.uz` and `site.uz` | 301 redirect to one version |
| http vs https | `http://` and `https://` | 301 redirect to https |
| Trailing slash | `/catalog` and `/catalog/` | Pick one format, 301 to it |
| Index files | `/` and `/index.php` | 301 to the root URL |
| URL parameters | `?utm_source=...`, `?sort=price` | rel=canonical to the main page, Clean-param for Yandex |
| Print versions | `/page/print` | noindex or canonical to the original |
| Letter case | `/Page` and `/page` | 301 to lowercase |

## How the main tools work

A **301 redirect** is the most reliable option when users do not need the copy. Visitors and crawlers land on the right URL, and signals move to it.

**rel=canonical** tells the search engine which version is primary when the copy must stay accessible (sorting, UTM tags):

```html
<link rel="canonical" href="https://site.uz/catalog/">
```

Google and Yandex treat canonical as a hint, not a strict command. If the pages differ a lot, the search engine may ignore it.

**Clean-param** is a robots.txt directive understood by Yandex. It says a parameter does not change the page content:

```text
User-agent: Yandex
Clean-param: utm_source&utm_medium&utm_campaign
```

**noindex** removes a page from the index but does not pass its signals to another page. Use it for utility pages that should not appear in search.

## Handling partial duplicates

- **Product variants:** merge colors and sizes into one product page with a variant selector, or write unique descriptions.
- **Filters:** index only combinations with real search demand; handle the rest with canonical or noindex.
- **Pagination:** each paginated page with different products should have a self-referencing canonical, not one pointing to page one.
- **Boilerplate text:** do not repeat the same large SEO block on every category page.

## How to find duplicates

1. Run a site crawler and look for matching titles, descriptions and H1s.
2. Check the indexing reports in Search Console — they show which pages Google treats as copies.
3. Review "Pages in search" and diagnostics in Yandex Webmaster.
4. Manually open the site with and without www, with and without a trailing slash — a redirect should fire.

## Common mistakes

- Pointing canonical from every paginated page to page one.
- Blocking duplicates in robots.txt with Disallow — the crawler cannot see canonical on a blocked page.
- Using different versions of the same URL in internal links.
- Listing non-canonical URLs in the sitemap.

## FAQ

### Do small sites need to deal with duplicates?

Yes, especially technical ones: setting up redirects for www, https and trailing slashes is a one-time job. On a small site, the wrong page being chosen is more noticeable because there are fewer pages.

### Which is better: a 301 redirect or canonical?

If users do not need the copy, use a 301. If the page must stay accessible (sorting, UTM tags, print version), use canonical.

### Is the same text in different languages a duplicate?

No. Translations are different pages. Link the language versions with hreflang so the search engine shows each user the right language.
