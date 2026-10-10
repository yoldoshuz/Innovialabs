---
title: SEO Checklist Before Launching a New Website
description: What to check before go-live: remove staging noindex, set up sitemap and robots, redirect old URLs, add analytics and markup, test speed and mobile.
summary: Before launch, make sure the site is open for indexing, old URLs have 301 redirects, sitemap and robots are correct, analytics collects data, and pages are fast and usable on a phone.
---

## The short answer

Most SEO failures at launch are not about strategy but about forgotten details: **noindex left from staging**, missing **redirects** from old URLs, a blocking `robots.txt`. Walk through the checklist below before switching DNS and once more right after.

## Indexation

- Remove `noindex` from every page that should be in search. Check both the meta tag and the `X-Robots-Tag` HTTP header.
- Remove basic HTTP authentication if it was on staging.
- Rewrite `robots.txt`: staging often has `Disallow: /` for the whole site.
- Make sure the **staging site itself** is closed to indexing and will not compete with production.

A minimal working `robots.txt`:

```txt
User-agent: *
Disallow: /admin/
Disallow: /cart/

Sitemap: https://example.com/sitemap.xml
```

## Sitemap

- `sitemap.xml` is generated automatically and updates on publish.
- It lists only canonical URLs returning 200 — no redirects, 404s or blocked pages.
- URLs use the correct protocol and the production domain, not staging.
- The sitemap is submitted to Google Search Console and Yandex Webmaster.

## Redirects during migration

If the new site replaces an old one, this is the riskiest item.

1. Export every URL of the old site: from a crawler, the sitemap, Search Console and analytics.
2. Map each old URL to the closest matching new one.
3. Set up **301 redirects** directly, without chains.
4. Do not send everything to the homepage: search engines may treat such redirects as "soft 404s".
5. After launch, run the old URL list through a crawler and check the status codes.

## Domain and duplicates

- One primary version: with or without `www`, `https` only.
- All other variants 301-redirect to it.
- A consistent trailing slash format.
- A correct `rel="canonical"` on every page.
- For multilingual sites — `hreflang` tags and separate URLs per language.

## On-page and markup

- Unique `title` and `description` on all templates, no placeholders like "New page".
- One `H1` per page.
- `alt` text on meaningful images.
- Schema.org markup (Organization, BreadcrumbList, Product, Article) passes the validator.
- Open Graph tags for proper previews in messengers.
- A helpful 404 page that returns a real 404 status code.

## Speed and mobile

- Test key templates in **PageSpeed Insights**: home, category, product, article.
- Images are compressed, in modern formats, with explicit dimensions.
- No render-blocking scripts slowing down the first paint.
- The site works well on a phone: readable font, tappable buttons, no horizontal scrolling.
- Mobile content matches the desktop version.

## Analytics

- **Google Analytics** and **Yandex Metrica** tags are installed on every page.
- Goals are set up: lead form, call, purchase.
- Search Console and Webmaster ownership is verified for the production domain.
- If you are migrating, keep access to the old analytics for comparison.

## Common mistakes

- Launching on Friday evening, when nobody is around to fix problems.
- Redirects planned for "later".
- A staging site open to indexing that gets into search before production.
- Deleted pages with traffic and no replacement.

## FAQ

### How long does it take search engines to index a new site?

There is no fixed timeline: it depends on site size, links pointing to it and page quality. A submitted sitemap, requesting indexing of key URLs in Search Console and the IndexNow protocol for Yandex help speed things up.

### Are redirects necessary if the structure changed a lot?

Yes. Even without an exact match, point the old URL to the closest relevant page or section. Without redirects you lose accumulated rankings and backlinks.

### What if traffic drops after launch?

First check the blockers: noindex, robots.txt, status codes and redirects. Then compare Search Console reports before and after launch to find the pages that lost impressions.
