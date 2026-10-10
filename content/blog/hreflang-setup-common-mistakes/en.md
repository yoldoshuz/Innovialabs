---
title: How to Set Up hreflang Tags and Avoid Common Mistakes
description: hreflang syntax in HTML, HTTP headers and sitemaps, x-default, return tags, language and region codes, and the mistakes that make the markup fail.
summary: hreflang tells search engines which pages are translations of each other. Every version must link to all the others and to itself, with valid codes and absolute URLs, or the markup is ignored.
---
## What hreflang does

The **hreflang** attribute connects the language and regional versions of the same page. It lets a search engine show users the version in their language instead of a random one. hreflang does not boost rankings by itself and does not block indexing — it is a hint about which URL to show to whom.

You can place the markup in one of three ways. Pick one and avoid mixing them without a reason.

## Method 1: HTML tags

In the `<head>` of every version, list all versions including the page itself:

```html
<link rel="alternate" hreflang="ru" href="https://site.com/ru/pricing/" />
<link rel="alternate" hreflang="en" href="https://site.com/en/pricing/" />
<link rel="alternate" hreflang="uz" href="https://site.com/uz/pricing/" />
<link rel="alternate" hreflang="x-default" href="https://site.com/en/pricing/" />
```

The block is identical on all three pages. This is the most transparent option for sites with a few languages.

## Method 2: HTTP header

Useful for non-HTML files such as PDFs:

```http
Link: <https://site.com/ru/guide.pdf>; rel="alternate"; hreflang="ru",
      <https://site.com/en/guide.pdf>; rel="alternate"; hreflang="en"
```

## Method 3: sitemap

Convenient for large sites: the markup does not add weight to pages and is managed in one place.

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://site.com/ru/pricing/</loc>
    <xhtml:link rel="alternate" hreflang="ru" href="https://site.com/ru/pricing/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://site.com/en/pricing/"/>
    <xhtml:link rel="alternate" hreflang="uz" href="https://site.com/uz/pricing/"/>
  </url>
  <!-- the same <url> block for /en/ and /uz/ -->
</urlset>
```

## Language and region codes

- **Language** — an ISO 639-1 code: `ru`, `en`, `uz`.
- **Region** (optional) — an ISO 3166-1 alpha-2 country code after a hyphen: `ru-UZ`, `en-GB`.
- A region without a language is not allowed: `hreflang="UZ"` is an error.
- Order matters: language first, then country. `uz-RU` means "Uzbek for Russia", not the other way round.
- You can specify a script, such as `uz-Latn` and `uz-Cyrl`, if you have both versions.

## x-default

`x-default` is the version for everyone who does not match any listed option. It is usually the English page or a language selector page. It is optional but useful if you have such a fallback.

## Checklist for a correct setup

- **Reciprocity.** If page A links to B, B must link back to A. Without the return tag the pair is ignored.
- **Self-reference.** Every page includes itself in the list.
- **Absolute URLs** with protocol: `https://site.com/en/`, not `/en/`.
- **Canonical addresses.** URLs in hreflang must match those pages' canonicals and return status 200.
- **Matching pages.** Link translations of the same page, not every page to the homepage.

## Common mistakes

| Mistake | Consequence |
|---|---|
| Missing return tags | The connection is ignored |
| `hreflang="en-UK"` | Invalid country code, the correct one is `en-GB` |
| Every version's canonical points to one page | Translations drop out of the index |
| URLs in hreflang redirect or return 404 | The signal is lost |
| Markup added only to the homepage | Inner pages remain unconnected |
| Different language sets on different versions | Conflicting signals |

## How to check

- Open the source code of several pages in each version and compare the link sets.
- Use a site crawler that can validate hreflang reciprocity.
- Watch the international targeting and indexing reports in webmaster tools.

The full specification is in [Google's documentation](https://developers.google.com/search/docs/specialty/international/localized-versions).

## FAQ

### Do I need hreflang if the site has only two languages?

Yes, if the versions are translations of the same pages. Even with two languages the markup helps search engines avoid mixing up versions in results.

### Can hreflang replace canonical?

No, they are different tools. Canonical picks the main copy among duplicates, hreflang connects translations. Each language version should be canonical to itself.

### Which is better: HTML tags or a sitemap?

HTML tags are simpler for small sites. For large ones a sitemap is better: it does not add page weight and is easier to generate automatically.
