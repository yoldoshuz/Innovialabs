---
title: SEO Audit Checklist: How to Audit a Website Step by Step
description: A step-by-step SEO audit checklist covering indexation, technical health, on-page, content, links and local SEO, with tools for each check and how to prioritize
summary: An SEO audit goes top-down: first check that search engines can see your pages, then technical health, on-page, content, links and local presence, and sort fixes by impact and effort.
---

## Where an audit starts

Run the audit in a strict order: **indexation → technical → on-page → content → links → local SEO**. The logic is simple: if a page is not in the index, polishing its headings is pointless. Each level only makes sense once the previous one is in order.

Free tools are enough for a solid baseline audit:

- **Google Search Console** and **Yandex Webmaster** — data straight from the search engines;
- a **crawler** (Screaming Frog, Sitebulb or similar) — walks the site like a search bot;
- **PageSpeed Insights** — speed and Core Web Vitals;
- the `site:` search operator — a quick, rough check.

## 1. Indexation

- Compare the number of indexed pages with the number of pages that should be in search.
- Find important URLs with "Discovered - currently not indexed" and "Crawled - currently not indexed" statuses.
- Check `robots.txt`: are sections, CSS or JS blocked?
- Look for accidental `noindex` in meta robots and the `X-Robots-Tag` HTTP header.
- Make sure `sitemap.xml` exists, is submitted to both consoles and lists only canonical URLs that return 200.

## 2. Technical health

Run the crawler and go through the reports:

| Check | What to look for |
|---|---|
| Status codes | 404, 5xx, redirect chains and loops |
| Canonical tags | canonical pointing to another or non-indexable page |
| Duplicates | www vs non-www, trailing slash, URL parameters |
| HTTPS | mixed content, redirect from http |
| Speed | LCP, INP, CLS in PageSpeed Insights |
| Mobile | content and links match the desktop version |
| Depth | key pages more than 3–4 clicks from home |

Also check whether the server returns the main content in HTML or whether it only appears after JavaScript runs.

## 3. On-page

- **Title** is unique, matches the query and is not truncated.
- **Description** is unique and describes the page in plain language.
- One **H1**, a logical H2–H3 hierarchy.
- **Alt** text on meaningful images.
- **Structured data** (Organization, Product, Article, FAQ) passes validation.
- **Internal links** point to important pages with clear anchor text.

## 4. Content

- Each key query group maps to one page — no **cannibalization**.
- No thin pages with a couple of lines and no templated duplicates.
- Texts answer the user's question instead of being stuffed with keywords.
- Outdated material is updated or merged.

## 5. Links

- Review the external links report in Search Console and Webmaster.
- Find links pointing to pages that now return 404 — that is lost value.
- Check for obviously spammy referring domains and sudden link spikes.
- Find **orphan pages** with no internal links pointing to them.

## 6. Local SEO

If the business serves customers offline:

- **Google Business Profile** and **Yandex Business** listings are complete and verified;
- name, address and phone (**NAP**) match on the site and across directories;
- there is a contacts page with address and map, and separate pages for multiple locations;
- reviews get replies.

## How to prioritize

Put all findings into one table and score each issue on two axes: **impact** and **effort**.

1. **Blockers** — anything that prevents indexation: noindex, blocked robots, 5xx. Fix these first.
2. **High impact, low effort** — titles, redirects for broken links, sitemap.
3. **High impact, high effort** — speed, site architecture, content rework. Plan them into sprints.
4. **Low impact** — cosmetics, done when time allows.

A typical mistake is starting with a hundred minor warnings from the crawler and missing the single line in robots.txt that blocks the whole catalog.

## FAQ

### How often should you run an SEO audit?

A full audit makes sense after a redesign, migration or CMS change, and periodically as prevention. Indexation and errors in Search Console and Webmaster are worth checking regularly; it takes a few minutes.

### Can you audit a site without paid tools?

Yes. Search Console, Webmaster, PageSpeed Insights and the free version of a crawler cover most checks for a small site. Paid services help with link analysis and large projects.

### What matters more: technical SEO or content?

Technical first, because without indexation nobody sees the content. But once blockers are fixed, most growth usually comes from content that answers queries better than competitors do.
