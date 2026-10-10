---
title: How to Add a Site to Google Search Console and Use It
description: Step by step: verify your site in Google Search Console, pick the right property type, read the key reports and use URL Inspection to control indexing.
summary: Add a Domain property via a DNS record, submit your sitemap, then regularly check the Performance, Pages and Core Web Vitals reports and inspect important URLs with the URL Inspection tool.
---
## The short answer: how to connect a site

**Google Search Console** is a free Google service that shows how the search engine sees your site: which pages are indexed, which queries bring you impressions and where technical problems are. Setup takes a few minutes:

1. Sign in with the company's Google account (not an employee's personal one).
2. Click "Add property" and choose a type: **Domain** or **URL prefix**.
3. Verify ownership using one of the available methods.
4. Submit your sitemap under "Sitemaps".

Data starts collecting after verification, so connect the service as soon as the site goes live.

## Domain vs URL prefix

| Property type | What it covers | How to verify |
|---|---|---|
| **Domain** | All subdomains and protocols: http, https, www, m. | DNS TXT record only |
| **URL prefix** | Only URLs with the given prefix, e.g. `https://example.com/` | HTML file, meta tag, Google Analytics, Tag Manager, DNS |

For most sites a **Domain property** is the better choice: you see the full picture and lose nothing when some traffic lands on the www or non-www version. A URL prefix property is handy when you have no DNS access or want to analyze one section, such as `/blog/`, separately.

## Verification methods

- **DNS TXT record** — added at your registrar or DNS panel. The most reliable option because it survives redesigns.
- **HTML file** — uploaded to the site root. Do not delete it after verification.
- **Meta tag** in the `<head>` of the homepage. Easy to lose when the template changes.
- **Google Analytics or Tag Manager** — if they are already installed and you have admin rights.

Example DNS record:

```text
Type: TXT
Name: @
Value: google-site-verification=your_code
```

DNS changes can take time to propagate. If verification fails at first, try again later.

## The key reports

**Performance.** Clicks, impressions, CTR and average position by query, page, country and device. Look for queries with many impressions but few clicks: they are candidates for better titles and descriptions.

**Pages (indexing).** Which URLs are indexed and why the others are not. Common reasons: "Discovered – currently not indexed", "Duplicate", "Excluded by noindex tag". Not every exclusion is an error: utility and duplicate pages should stay out of the index.

**Core Web Vitals.** Groups of URLs with poor, needs-improvement and good LCP, INP and CLS on mobile and desktop. The data comes from real Chrome users, so low-traffic sites may see an empty report.

**Sitemaps.** Processing status of your sitemap and the number of discovered URLs.

## The URL Inspection tool

Paste an address into the search bar at the top of the interface and you will see:

- whether the page is in Google's index;
- which canonical URL Google chose and whether it matches yours;
- whether the page was reachable during the last crawl;
- how Googlebot rendered the page ("Test live URL").

After fixing something, click **"Request indexing"**. It speeds up recrawling but does not guarantee indexing. Requests are limited, so save them for important pages.

## Common mistakes

- Verifying with a meta tag and removing it during a template update.
- Adding only the `http://` version and missing all `https://` data.
- Panicking over excluded pages without checking the reason.
- Sharing the account password instead of adding colleagues under "Users and permissions".

## FAQ

### How long until data appears?

The first data usually shows up within a few days. The Performance report does not include the period before the property was verified.

### Do I need Search Console if I already have Google Analytics?

Yes. Analytics shows what visitors do on your site, while Search Console shows what happens before the click: search impressions, queries and indexing.

### Can several people access one site?

Yes. The owner adds users with full or restricted permissions in the property settings without sharing their own account.
