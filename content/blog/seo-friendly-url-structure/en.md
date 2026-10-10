---
title: How to Create SEO-Friendly URLs: Structure and Rules
description: How to build clean URLs: transliterating Cyrillic, nesting depth, parameters, trailing slashes and changing addresses safely with 301 redirects.
summary: A good URL is short, readable, lowercase, uses hyphens between words and avoids needless parameters; change it only with a 301 redirect from the old address.
---

## What an SEO-friendly URL is and why it matters

An **SEO-friendly URL** is an address that tells a person what is on the page before they click. Compare:

- `/catalog/laptops/lenovo-thinkpad-x1/`
- `/index.php?cat=12&id=8841&sort=2`

The first one is readable in search results, in a messenger and in a forum link. Search engines treat words in a URL as a minor signal about the topic, but the main benefits are trust, click-through and easier analytics: the address shows the section at a glance.

## Core rules

- **Lowercase.** A server may treat `/Blog/Post` and `/blog/post` as different pages — that is duplication.
- **Hyphens between words.** Not underscores and not spaces (`%20`).
- **Short and to the point.** Drop filler words when the meaning survives: `/how-to-choose-a-hosting-provider/` can become `/choosing-hosting/`.
- **One page, one address.** Decide on `www` or no `www`, always use `https`, and redirect every other variant.
- **No dates or IDs unless needed.** A date in an article URL makes updates awkward: after a refresh the address still looks old.
- **Keywords yes, stuffing no.** `/seo/seo-services-seo-website/` looks like spam.

## Transliterating Cyrillic and other scripts

Non-Latin characters are allowed in URLs, but when copied they turn into long strings like `%D0%BA%D0%B0...`. That is why Russian-language sites usually **transliterate** to Latin.

| Option | Example | Notes |
|---|---|---|
| Transliteration | `/dostavka-po-tashkentu/` | Most common, readable by everyone |
| English translation | `/delivery-tashkent/` | Convenient for multilingual sites |
| Native script | `/доставка-по-ташкенту/` | Looks fine in the browser, ugly when copied |

Pick **one transliteration scheme** and use it everywhere. If one letter becomes `sch` in one section and `shh` in another, URLs become unpredictable. Best practice is to generate slugs from titles automatically with a single function in your CMS.

## Nesting depth

URL structure usually mirrors site structure: `/section/subsection/page/`. That is useful, but there is no need for five or six levels.

- **2–3 levels** are enough for most sites.
- What matters is not depth in the address but **clicks from the homepage** — the page must be reachable through internal links.
- If a product belongs to several categories, do not create a URL under each one — choose a single primary path.

## Query parameters, filters and UTM tags

Parameters (`?sort=price&page=2`) are fine for sorting, pagination and filters, but they create thousands of versions of one page.

- For sorting and technical parameters, set a **canonical** pointing to the main version.
- Filters that people actually search for ("Lenovo laptops") work better as separate clean URLs with a unique title and text.
- UTM tags should never be indexed: canonical handles this, and for Yandex the `Clean-param` directive in robots.txt helps too.

## Trailing slash: with or without

Technically `/page` and `/page/` are different URLs. Neither is better for SEO; what matters is **consistency**. Choose one and 301-redirect the other. An nginx example that removes the slash:

```nginx
rewrite ^/(.*)/$ /$1 permanent;
```

Test it first to make sure it does not break the root or real directories.

## How to change URLs safely

Changing addresses on a live site is a common cause of traffic drops. The process:

1. Build a **mapping table** "old URL → new URL" for every page.
2. Set up one-to-one **301 redirects**, without chains (A → B → C) and without sending everything to the homepage.
3. Update **internal links**, canonicals, hreflang and sitemap.xml to the new addresses.
4. Crawl a list of old URLs: each must return 301 and land on a page returning 200.
5. Watch indexing in Google Search Console and Yandex Webmaster, and keep redirects in place for a long time.

A temporary dip after a migration is possible, so do not change URLs for cosmetics alone. If old addresses work and have no duplicates, leaving them is fine.

## FAQ

### Should I replace old ugly URLs with clean ones?

Only if there is a real problem: duplicates, parameters in the index, a confusing structure. Changing URLs always carries risk, so do it once, with a complete redirect map.

### For a Russian-language site, transliteration or English words?

Both work. Transliteration is closer to what users type, English is more convenient for multilingual projects. The key is to choose one approach and not mix them.

### Do words in the URL affect rankings?

Only slightly. The main value of clean URLs is clarity for people, easier analytics and no duplicates, not a direct ranking boost.
