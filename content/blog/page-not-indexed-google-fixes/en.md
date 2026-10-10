---
title: Why Pages Are Not Indexed by Google and How to Fix It
description: Decoding Search Console statuses like Discovered and Crawled - currently not indexed, finding root causes and fixing them, including IndexNow for Yandex.
summary: A page stays out of the index either because of a technical block (noindex, robots, canonical, errors) or because the search engine does not see enough value in it; the first is fixed with settings, the second with better content and internal links.
---

## The short answer

The causes fall into two groups. **Technical**: the page is blocked, unavailable or has a canonical pointing elsewhere. **Quality**: Google sees the page but decides it is not worth a place in the index. Start with the **URL Inspection tool** in Google Search Console: it shows the exact status and reason.

## What Search Console statuses mean

| Status | What is happening | Where to look |
|---|---|---|
| Discovered - currently not indexed | Google knows the URL but has not crawled it yet | crawl budget, internal links, server speed |
| Crawled - currently not indexed | Google read the page and postponed it | content quality and uniqueness |
| Excluded by noindex tag | the page forbids indexing | meta robots, `X-Robots-Tag` |
| Blocked by robots.txt | the bot cannot access it | `Disallow` rules |
| Page with redirect | the URL redirects elsewhere | normal if the redirect is intentional |
| Duplicate, Google chose different canonical | Google treats another page as primary | canonical, duplicates, parameters |
| Server error (5xx) / Not found (404) | the page is not served | server, deleted URLs |

## Technical causes and fixes

Check in this order:

1. **noindex** in the HTML or HTTP header. It often survives from development or gets turned on by a plugin.
2. **robots.txt** blocks a section. Remember: a robots block prevents crawling, it does not guarantee removal from the index.
3. **Canonical** points to another page, or to itself with a different protocol or domain.
4. **Status codes**: the page must return 200, not 3xx, 404 or 5xx.
5. **JavaScript rendering**: if the main text only appears after scripts run, confirm in URL Inspection that Google sees it in the rendered HTML.
6. **Not in the sitemap and no internal links** — an orphan page that is hard to discover.

## Quality causes

"Crawled - currently not indexed" is most often about the page's value:

- **Thin content**: a couple of paragraphs or a product card with no description.
- **Duplicates**: many near-identical pages, such as filters or tags.
- **No unique value** compared with pages already in the index.
- **Weak internal linking**: a single link from deep inside the site.

What helps:

- merge similar pages into one strong page;
- expand the content so it answers a real question;
- link to the page from sections that are already indexed;
- keep service and junk URLs out of the index so the bot spends time on what matters.

## How to speed up indexing after fixes

- **Google**: in URL Inspection, click "Request indexing". It is a signal, not a guarantee, and has a daily quota.
- Update and resubmit **sitemap.xml** with an accurate `lastmod` date.
- **Yandex and Bing**: use the **IndexNow** protocol — the site itself notifies search engines about changed URLs. Google does not support it.

An IndexNow request:

```bash
curl -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "example.com",
    "key": "your-key",
    "keyLocation": "https://example.com/your-key.txt",
    "urlList": ["https://example.com/new-page"]
  }'
```

The key is a string you generate yourself and host in a text file on the site. Details are in the protocol documentation at indexnow.org.

## Common mistakes

- Clicking "Request indexing" over and over instead of finding the cause.
- Blocking a page in robots.txt while expecting the search engine to see a noindex on it.
- Generating thousands of automatic pages and being surprised that only a fraction gets indexed.

## FAQ

### How long does a new page take to get indexed?

There is no fixed timeline. Pages on sites with good internal linking and regular updates usually get indexed faster. If the status does not change for a long time, look for a technical cause or a content value problem.

### Is it normal that some pages are not indexed?

Yes. Redirects, duplicates with a canonical, service and parameter URLs should not be indexed. Worry only when important pages end up outside the index.

### Does IndexNow work for Google?

No. Google does not use IndexNow; for Google you still rely on the sitemap, internal links and indexing requests in Search Console. IndexNow is useful for Yandex, Bing and other participating search engines.
