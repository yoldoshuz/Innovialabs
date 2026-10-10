---
title: What Is Crawl Budget and When It Becomes a Problem
description: Crawl budget in plain terms: what it is made of, which sites need to care and what wastes it, from URL parameters to redirect chains and thin pages.
summary: Crawl budget is how many pages a search bot can and wants to crawl on your site; large and fast-changing sites should manage it, while smaller sites mostly need to avoid generating junk URLs.
---
## The short answer

**Crawl budget** is the number of pages a search engine bot crawls on your site in a given period. It has two parts:

- **Crawl rate (capacity limit)** — how many requests the bot can make without overloading your server. Fast, error-free responses raise it; slowdowns and 5xx errors lower it.
- **Crawl demand** — how much the search engine wants to crawl your pages. Popular and frequently updated URLs get visited more often, stale and low-value ones less.

When the bot spends time on junk addresses, important pages get indexed later.

## Who actually needs to care

For most small sites crawl budget is not an issue: a bot easily handles a few hundred or thousand pages. Google's own documentation says the topic matters mainly for **very large sites** and sites with **rapidly changing content**.

It is worth attention if you run:

- an **online store** with filters and tens of thousands of products;
- an **aggregator or classifieds site** where pages appear and disappear daily;
- a **news site** where speed of indexing matters;
- a site whose reports show many pages as "Discovered – currently not indexed".

## What wastes crawl budget

| Source | Why it hurts |
|---|---|
| URL parameters and filters | Endless combinations like `?color=red&sort=price` create thousands of duplicates |
| Redirect chains | Every extra hop is a separate bot request |
| Thin and empty pages | Empty categories, tags with one post, internal search results |
| Duplicates | www vs non-www, trailing slash vs none, http vs https |
| Soft 404s | A "product not found" page returning 200 |
| Infinite spaces | Calendars, endless pagination, auto-generated links |
| Slow server | The bot reduces its request rate |

## How to clean it up

1. **Check crawl stats** in Google Search Console and Yandex Webmaster to see how many requests the bot makes and which responses it gets.
2. **Analyse server logs.** This is the most accurate way to see which URLs the bot really visits.
3. **Block junk parameters** in `robots.txt`. Yandex also supports the `Clean-param` directive, which merges URLs that differ only by insignificant parameters.
4. **Remove redirect chains** and link straight to the final address.
5. **Use canonical** for duplicates and **noindex** for utility pages, remembering that robots.txt blocks crawling, while noindex only works if the page can be crawled.
6. **Keep sitemap.xml clean**: only canonical pages returning 200.
7. **Speed up server responses** and fix 5xx errors.

Example `robots.txt` rules:

```text
User-agent: *
Disallow: /search
Disallow: /*?sort=

User-agent: Yandex
Clean-param: utm_source&utm_medium&utm_campaign
```

## Common mistakes

- Blocking a page in robots.txt while expecting the bot to see its noindex tag.
- Listing redirects, 404s and non-canonical URLs in the sitemap.
- Generating thousands of landing pages without unique content.
- Trying to "increase the budget" instead of reducing the number of junk URLs.

## FAQ

### How do I know my site has a crawl budget problem?

If new and updated pages take a long time to get indexed and logs show the bot mostly visiting parameters and duplicates, it is likely. For small sites, indexing delays usually come from page quality, not budget.

### Can I ask Google to crawl my site more often?

You cannot raise the budget directly. A fast, stable server, useful updated content and no junk URLs are what help.

### Does noindex save crawl budget?

Bots still crawl noindex pages, though they may do it less often over time. To save crawling, avoid creating or linking to such URLs in the first place.
