---
title: How to Set Up Yandex Webmaster: Complete Guide
description: How to add and verify a site in Yandex Webmaster, set the region, read indexing reports, diagnostics and search queries, and request page recrawls.
summary: Add your site and verify ownership, set the region and sitemap, then monitor diagnostics, indexing and queries, and send important pages for recrawl after every change.
---
## The short answer: what to do

**Yandex Webmaster** is a free dashboard where Yandex reports how your site is doing in search. The basic setup:

1. Sign in to Webmaster with the company's Yandex ID.
2. Add the site with its exact address and protocol: `https://example.com`.
3. Verify ownership.
4. Set the region, add a sitemap and check the main mirror.
5. Open diagnostics and indexing reports once a week.

If your audience uses Yandex, without Webmaster you will miss many problems until traffic drops.

## Adding and verifying the site

Yandex treats `http://` and `https://`, as well as www and non-www versions, as different sites. Add the version that is your **main mirror**, usually https with or without www depending on your redirects.

Verification methods:

- **Meta tag** in the `<head>` of the homepage.
- **HTML file** in the site root.
- **DNS TXT record** at your domain registrar.

```html
<meta name="yandex-verification" content="your_code" />
```

Keep the verification code after the check: Yandex periodically re-verifies rights, and access can be revoked if the code disappears.

## Region and site information

For commercial sites, **regional settings** matter: Yandex considers the region when ranking location-dependent queries. In the search appearance settings, set the city or country where you operate. You usually need to justify the region, for example with a contacts page that shows your address.

If the company has an office or store, it is also worth filling in organization details through Yandex Business.

## Indexing

The **Indexing** section holds the key reports:

- **Crawl statistics** — which pages the robot requested and which response codes it got. Many 404 or 5xx responses are a signal to investigate.
- **Pages in search** — what was added to and removed from search, with the exclusion reason.
- **Sitemap files** — add your sitemap URL and check it is processed without errors.
- **Site move and mirrors** — make sure the right mirror is selected as the main one.

Not every exclusion is a problem. Duplicates, `noindex` pages and non-canonical URLs are supposed to be absent from search. Focus on the pages you actually want to rank.

## Site diagnostics

The **Diagnostics** section lists issues Yandex found, marked by severity: site unavailability, robots.txt errors, a missing sitemap, SSL certificate problems, slow server response. Also check **Security and violations**: messages about malicious code or violations that can cost you rankings appear there.

Turn on email notifications to learn about critical issues right away.

## Search queries

The **Search queries** report shows impressions, clicks, CTR and average position. Useful techniques:

- group queries by topic and track how each group changes;
- find queries with good impressions but low CTR and improve their title and description;
- compare periods before and after changes on the site.

## Page recrawl

After editing content or fixing errors, submit URLs under **Reindex pages**. The robot will visit them sooner, but search results do not update instantly. The daily number of URLs is limited, so pick the important ones: new services, fixed product pages, updated articles. For bulk changes, an updated sitemap is more reliable.

## FAQ

### Do I need Webmaster if the site is already in Google Search Console?

Yes, if your audience uses Yandex. The search engines have different robots, rules and reports, and a problem visible in one is not always visible in the other.

### Why doesn't the site appear in search after adding it?

Indexing a new site takes time. Check diagnostics, robots.txt and the sitemap, and make sure pages return a 200 code and are not blocked by `noindex`.

### How many regions can I set?

Set the region where you really operate. If the company works nationwide or in several cities, back it up with contacts on the site rather than listing cities in the copy.
