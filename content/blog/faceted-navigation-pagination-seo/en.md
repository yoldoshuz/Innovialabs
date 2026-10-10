---
title: Faceted Navigation and Pagination SEO for Large Catalogs
description: Which filter combinations to make indexable, how to control parameter crawling, and how to handle pagination properly without rel=prev/next.
summary: Index only filter combinations with real search demand, keep the rest out of crawling, and give each paginated page its own URL, a self-referencing canonical and plain links.
---
## The short answer

Filters in a large catalog generate an almost endless number of URLs: color, size, brand, price, sorting and every combination of them. If all of that reaches the index, search engines spend **crawl budget** on duplicates and important product pages get crawled less often.

A working setup looks like this:

- **Landing pages** only for combinations people actually search for ("men's Nike sneakers").
- **All other filters** stay out of the index and, ideally, out of crawling.
- **Pagination** uses separate indexable URLs, each with a canonical pointing to itself.

## Which filter combinations deserve indexing

Decide with data, not with the structure of your filter panel. Check every combination:

1. **Demand** — people search for it (Google Keyword Planner, Yandex Wordstat).
2. **Inventory** — the page has enough products, not one or two.
3. **Uniqueness** — its own title, H1, meta tags and, where possible, a short text.
4. **Reasonable depth** — one or two dimensions are usually enough: category + brand, category + type. Three or more filters at once rarely have demand.

Keep a "combination pattern → decision" table:

| Combination type | Example | Decision |
|---|---|---|
| Category + brand | /sneakers/nike/ | Index, clean URL |
| Category + color | /sneakers/?color=red | Based on demand |
| Sorting | ?sort=price_asc | Do not index |
| Price range | ?price=1000-5000 | Do not index |
| 3+ filters | ?brand=x&color=y&size=z | Do not index |

Give indexable combinations **static, clean URLs** and link to them from menus or internal linking blocks, not only through a JavaScript filter.

## How to control parameter crawling

Several tools exist for non-indexable combinations, and they do different jobs:

- **robots.txt Disallow** — the bot does not crawl the URL. Saves budget, but the URL can still be indexed without content if many links point to it.
- **meta robots noindex** — keeps the page out of the index, but the bot must fetch the page to see the tag. Never combine it with Disallow: a blocked page cannot be read.
- **canonical** — a hint, not a directive. Fine for near-identical pages such as sort orders, but it does not guarantee crawl savings.
- **Clean-param in robots.txt** — a Yandex directive for parameters that do not change content (utm, sessions, sorting).
- **Filters without links** — parameters change via forms or JavaScript with no `<a href>`, so bots never discover those URLs.

```text
User-agent: *
Disallow: /*?*sort=
Disallow: /*?*price=

User-agent: Yandex
Clean-param: sort&utm_source&utm_medium /catalog/
```

Also:

- Enforce a **fixed parameter order** so `?color=red&size=42` and `?size=42&color=red` do not become two URLs.
- Return **404** for filter combinations with no results, or do not link to them at all.

## Pagination without rel=prev/next

Google stopped using `rel="prev"` and `rel="next"` as a signal long ago, and Yandex relies on its own mechanisms. Pagination has to work on its own:

- **Every page has its own URL**: `/catalog/?page=2` or `/catalog/page/2/`.
- **Self-referencing canonical**, not a canonical to page 1. Otherwise products on deeper pages may be discovered less reliably.
- **Plain `<a href>` links** to adjacent pages and a few nearby ones.
- **Infinite scroll and "Load more"** are fine, as long as paginated URLs also exist and are reachable through links.
- **Do not repeat the category text** on every paginated page; keep it on page 1.
- Titles for pages 2+ can include the number: "Sneakers — page 2".

## Common mistakes

- Every filter is indexable, and the index fills with thousands of near-empty pages.
- Disallow and noindex on the same URL.
- All paginated pages canonicalized to page 1.
- Indexable filters reachable only through JavaScript, with no HTML links.
- Links to filters that return zero results.

## FAQ

### Should paginated pages be noindexed?

Usually not. Pages 2+ help bots discover products. A self-referencing canonical, a unique title with the page number and no duplicated text are enough.

### robots.txt or noindex for filters?

If the goal is saving crawl on a huge number of URLs, use robots.txt or remove links to those filters. If the URLs are already indexed and must go, apply noindex first and add Disallow only after they drop out of the index.

### How do I know filters are wasting crawl budget?

Check the Crawl Stats report in Google Search Console, crawl data in Yandex Webmaster and your server logs. If bots mostly hit parameter URLs while new products get indexed slowly, that is a clear signal.
