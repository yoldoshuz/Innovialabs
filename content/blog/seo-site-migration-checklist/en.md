---
title: Website Migration Without Losing SEO Traffic: Checklist
description: How to move to a new domain, CMS, HTTPS or URL structure without losing traffic: URL mapping, 301 redirects, metadata, monitoring and rollback criteria.
summary: Traffic survives when every old URL leads with a single 301 redirect to its exact equivalent, metadata and content move over intact, and you monitor indexing and errors daily after launch.
---

## The core rule of migration

Search engines already know your old URLs and their value. The goal of a migration is to **pass that value to the new URLs** without gaps. That takes three things: a complete URL map, correct 301 redirects and monitoring after launch.

The less you change at once, the easier it is to find the cause of a drop. If possible, do not combine a domain change, a CMS change and a structure change in one release.

## Migration types and their risks

| Type | What changes | Main risk |
|---|---|---|
| HTTP → HTTPS | Protocol | Mixed content, forgotten redirects |
| Domain change | The whole address | Lost link equity without redirects |
| CMS change | Templates, URLs, markup | Missing meta tags, new page addresses |
| Structure change | Paths and nesting | Thousands of 404s, broken internal links |

## Pre-launch checklist

1. **Collect all old URLs**: a crawler, the sitemap, pages with traffic from analytics, pages with backlinks from webmaster tools.
2. **Build a URL map**: old address → new address, one to one. Do not send everything to the homepage.
3. **Move the metadata**: title, description, H1, canonical, hreflang, structured data.
4. **Keep the content**: text, images with alt attributes, internal links.
5. **Protect the staging site** with a password, not only robots.txt.
6. **Record a baseline**: traffic, rankings for key queries, number of indexed pages.

## Redirects done right

- Use **301** for a permanent move.
- No chains: the old URL goes straight to the final one.
- For removed pages with no equivalent, use a relevant section or an honest 404/410, not the homepage.
- Test redirects with a script against the whole map before launch.

An nginx example for a domain change:

```nginx
server {
    listen 443 ssl;
    server_name old-domain.uz www.old-domain.uz;
    return 301 https://new-domain.uz$request_uri;
}
```

## Launch day checklist

- Turn on redirects and remove the indexing block from the new site.
- Check robots.txt, a sitemap.xml with new URLs, canonical tags pointing to new addresses.
- Add the new site to Google Search Console and Yandex Webmaster.
- For a domain change, use the **Change of Address** tool in Search Console and the site move setting in Yandex Webmaster.
- Update internal links so they do not pass through redirects.

## Post-launch monitoring

Check daily during the first weeks:

- 404 and 5xx errors in logs and webmaster reports;
- the number of indexed pages for the old and new site;
- traffic and rankings against the baseline;
- Core Web Vitals of the new version.

Keep old redirects for a long time; do not remove them after a month or two.

## Rollback criteria

Agree in advance on when to roll back:

- widespread 5xx errors or key sections unavailable;
- important pages drop out of the index and the cause cannot be fixed quickly;
- critical failures in payments or forms.

A small, temporary ranking fluctuation after a migration is normal. Roll back for technical breakage, not for the first dip.

## FAQ

### How long does traffic take to recover after a migration?

It depends on the site size and redirect quality. Minor fluctuations are normal while search engines recrawl the URLs. If the decline persists and grows, look for technical errors.

### Can I redirect all old pages to the homepage?

No. Search engines treat such redirects as soft 404s, and page value is lost. Send each page to its closest equivalent.

### Should I keep the old domain?

Yes. Renew it and keep the redirects as long as people and links still arrive at the old addresses.
