---
title: Meta Tags for SEO: Which Ones Matter and Which Don't
description: A look at title, description, robots, viewport, Open Graph and the obsolete keywords tag: what each meta tag does today and how to fill it in correctly.
summary: For SEO, title, meta robots and viewport genuinely matter, description affects snippet click-through, Open Graph controls how links look in social apps and messengers, and Google ignores meta keywords.
---

## Which meta tags actually matter

Meta tags are service lines in a page's `<head>` read by search engines, browsers and social networks. They are not equally useful:

| Tag | Affects ranking | What it is for |
|---|---|---|
| `title` | Yes | Headline in results and the browser tab |
| `meta description` | Not directly | Snippet text, affects clicks |
| `meta robots` | Controls indexing | Blocks indexing or following links |
| `meta viewport` | Indirectly | A correct mobile layout |
| Open Graph | No | Link previews in social apps and messengers |
| `meta keywords` | Not in Google | Obsolete |

## Title: the page's most important tag

**Title** is one of the strongest on-page signals. It appears as the headline in search results, although the search engine may rewrite it if it finds it unhelpful.

How to write it:

- unique for every page;
- the key point first, the main query included naturally, not as a list;
- short enough not to be truncated in results;
- the brand name at the end, after a separator.

## Description: for clicks, not rankings

**Meta description** does not affect ranking directly, but it is often used as the snippet text. A good description increases the chance users pick your link.

- Describe what the reader will find on the page in one or two sentences.
- Write a unique description for each page.
- Do not repeat the title or list keywords.

The search engine may replace your description with a passage from the page if it answers the query better. That is normal.

## Robots: controlling indexing

`meta robots` tells the search engine what to do with the page:

- `noindex`: do not show it in results;
- `nofollow`: do not follow links from the page.

Typical uses are service pages, internal search results and the cart. A common mistake is leaving `noindex` from a staging environment and shipping it to the live site.

Important: if a page is blocked in robots.txt, the crawler cannot see its `noindex`. To remove a page from the index, it must stay crawlable.

## Viewport: the mobile version

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Without this tag, mobile browsers render the page as a shrunken desktop layout. Search engines primarily evaluate the mobile version, so the tag is mandatory.

## Open Graph: how links look when shared

The `og:title`, `og:description`, `og:image` and `og:url` tags define link previews in Telegram, Facebook, LinkedIn and other services. They do not affect rankings, but they strongly affect whether people click a shared link. X (Twitter) additionally uses `twitter:card` tags.

```html
<meta property="og:title" content="Page title">
<meta property="og:description" content="Short description">
<meta property="og:image" content="https://example.com/cover.png">
```

## Keywords: an obsolete tag

`meta keywords` once listed a page's keywords. Because it was abused, Google stopped using it for ranking long ago. There is no need to fill it in, and a long list of keywords can reveal your keyword strategy to competitors.

## Common mistakes

- The same title and description across many pages.
- An empty title, or one that just says "Home".
- An accidental `noindex` on important pages.
- No `og:image`, so the link looks empty in messengers.
- Keyword stuffing in the title.

## FAQ

### Why does Google show a different title or description than mine?

The search engine rewrites them when it thinks other text better answers a specific query. Making your title and description match the page content more precisely reduces the chance of replacement.

### Should I fill in meta keywords for Yandex?

There is no practical benefit. Spend the time on title, description and content quality.

### Does Open Graph affect SEO?

Not rankings directly. But a clean preview increases clicks from social networks and messengers.
