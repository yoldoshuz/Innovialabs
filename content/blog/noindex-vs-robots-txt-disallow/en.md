---
title: Noindex vs Robots.txt Disallow: Which One to Use
description: Disallow blocks crawling, noindex blocks indexing. Learn the difference, why combining them backfires, and which one to use for common page types.
summary: Disallow in robots.txt stops crawlers from fetching a page, while noindex stops it from appearing in search; to remove a page from results, use noindex and keep the URL crawlable.
---
## The short answer

- **Disallow** in robots.txt blocks **crawling**: the crawler does not fetch the page.
- **noindex** (a meta tag or HTTP header) blocks **indexing**: the crawler fetches the page but does not show it in search.

If you want a page out of search results, use **noindex**. If you want crawlers to stop spending resources on useless URLs, use **Disallow**.

## Why Disallow does not remove a page from search

Disallow only says "do not enter". If other pages, on your site or elsewhere, link to a blocked URL, Google may still index that URL without knowing its content. It can show up in results as a bare address with no proper description.

That is why robots.txt is a crawl management tool, not a way to hide pages.

## How noindex works

Noindex is set in HTML:

```html
<meta name="robots" content="noindex">
```

Or as an HTTP header, which also works for PDFs, images and other non-HTML files:

```text
X-Robots-Tag: noindex
```

For the directive to work, the crawler must **fetch the page** and see it. Google and Yandex both respect the noindex meta tag. A `noindex` rule inside robots.txt is not supported by Google.

## Why Disallow + noindex backfires

This is the most common mistake: a page is blocked in robots.txt and given noindex "just to be safe". The result:

1. Robots.txt forbids fetching the page.
2. The crawler never fetches it, so it never sees noindex.
3. If the URL has links pointing to it, it may stay in the index.

The correct order for removing an already indexed page:

1. Add noindex and **do not block** the URL in robots.txt.
2. Wait until the page drops out of the index (check in Search Console or Yandex Webmaster).
3. Only then, if needed, block it with Disallow to save crawl resources.

## What to use for typical pages

| Page type | What to use |
|---|---|
| Cart, checkout, user account | noindex or Disallow; these rarely get indexed on their own |
| Internal site search | noindex; Disallow if there are huge numbers of such URLs |
| Filters and sorting with parameters | canonical to the main page, Disallow for endless combinations |
| "Thank you" page after a form | noindex |
| PDFs and files you do not want in search | X-Robots-Tag: noindex |
| Duplicate pages | canonical, not Disallow |
| Staging site | password protection; robots.txt and noindex do not prevent access |
| Technical URLs, service scripts | Disallow |

## Common mistakes

- **Blocking CSS and JS in robots.txt.** The crawler cannot render the page and may evaluate it incorrectly.
- **Shipping `Disallow: /` from staging to production.** The whole site stops being crawled. Check robots.txt after every release.
- **Leaving noindex in a template** after development. Pages quietly disappear from search.
- **Using robots.txt for secret sections.** The file is public, so anyone can read which paths you are hiding.

## FAQ

### Which removes a page from search faster: noindex or Disallow?

Noindex: after the next crawl, the page is dropped from the index. Disallow does not guarantee removal. For urgent cases, Search Console offers a temporary URL removal tool.

### Can I use noindex and canonical together?

It is better not to. Canonical says "index another page instead of this one", while noindex says "do not index this one". Mixed signals can lead to unpredictable results, so pick one approach.

### Does Yandex treat these rules the same way as Google?

Broadly, yes: Yandex supports Disallow and the noindex meta tag. It also supports a Clean-param directive in robots.txt for pages with insignificant GET parameters.
