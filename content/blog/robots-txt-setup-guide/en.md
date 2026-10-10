---
title: How to Set Up robots.txt Correctly: Rules and Examples
description: robots.txt directives, user-agents, wildcards, Yandex Clean-param, ready templates for WordPress and Bitrix, and how to test the file before it hurts SEO.
summary: robots.txt controls how bots crawl your site: block service areas and duplicates, never block CSS, JS or important pages, add a Sitemap line and test the file in Search Console and Yandex Webmaster.
---
## The short answer

**robots.txt** is a text file at the site root (`https://example.com/robots.txt`) that tells search bots which areas not to crawl. It controls **crawling**, not indexing: a blocked page can still appear in results if other pages link to it. To remove a page from search, use `noindex`; use robots.txt to keep bots from wasting resources on junk URLs.

## Core directives

| Directive | What it does |
|---|---|
| `User-agent` | Which bot the rules apply to (`*` means all) |
| `Disallow` | Blocks crawling of a path |
| `Allow` | Permits a path inside a blocked section |
| `Sitemap` | Points to the sitemap URL |
| `Clean-param` | Yandex only: which GET parameters to ignore |

Rules are grouped by `User-agent`. A bot picks the most specific group for itself, and within it, when `Allow` and `Disallow` conflict, the rule with the longer matching path wins.

## Wildcards

- `*` — any sequence of characters: `Disallow: /*?sort=` blocks every URL with a sort parameter.
- `$` — end of URL: `Disallow: /*.pdf$` blocks PDF files but not `/pdf-guide/`.

Paths are case-sensitive, and `Disallow: /catalog` also blocks `/catalog-old/`. If you mean only the section, write `/catalog/`.

## Clean-param for Yandex

This directive tells Yandex that certain parameters do not change page content, so such URLs are treated as one page:

```text
User-agent: Yandex
Clean-param: utm_source&utm_medium&utm_campaign /
Clean-param: ref /catalog/
```

The first line strips UTM tags site-wide; the second ignores `ref` in the catalog. Google does not support this directive; for Google, handle duplicates with `rel="canonical"`.

## Ready templates

**WordPress:**

```text
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /?s=
Disallow: /*?replytocom=

Sitemap: https://example.com/sitemap.xml
```

**1C-Bitrix:**

```text
User-agent: *
Disallow: /bitrix/
Disallow: /auth/
Disallow: /personal/
Disallow: /search/
Disallow: /*?sort=
Allow: /bitrix/*.css
Allow: /bitrix/*.js

Sitemap: https://example.com/sitemap.xml
```

**Framework site (Next.js and similar):**

```text
User-agent: *
Disallow: /api/
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml
```

Templates are a starting point. Check them against your own site structure before publishing.

## How to test the file

1. Open `/robots.txt` in a browser: it must return status 200 and plain text.
2. **Google Search Console** — the robots.txt report shows which version Google sees and any errors.
3. **Yandex Webmaster** — "Tools" → "Robots.txt analysis" lets you check whether specific URLs are allowed.
4. After changes, test a few key pages — they must remain accessible.

Protocol details: [Google's robots.txt documentation](https://developers.google.com/search/docs/crawling-indexing/robots/intro).

## Common mistakes

- `Disallow: /` left on the live site after moving from staging.
- CSS and JS blocked, so the search engine cannot render the page properly.
- Trying to remove a page from search with robots.txt instead of noindex.
- Blocking pages that carry noindex — the bot never sees the tag.
- Outdated directives like `Host`, which Yandex no longer uses.

## FAQ

### Does robots.txt protect private data?

No. The file is public, and well-behaved bots simply choose to follow it. Protect private data with authentication, not robots.txt.

### Do I need Crawl-delay?

Google does not support it, and Yandex no longer relies on it either. Manage bot load through server settings and webmaster tools instead.

### Can one robots.txt cover several subdomains?

No. Each subdomain and protocol reads its own file at its own root, so `shop.example.com` needs a separate robots.txt.
