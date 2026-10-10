---
title: How to Find and Fix 404 Errors and Broken Links
description: How to find broken internal and external links, decide whether each 404 needs a redirect, a restore or nothing at all, and build a useful 404 page.
summary: Find broken links with a crawler and Search Console or Webmaster reports, then for each 404 decide: restore the page, 301 to the closest replacement, or honestly keep the 404 with a helpful error page.
---

## The short answer

A 404 on its own does not hurt a site: it is the normal response for a page that does not exist. The problem starts when **your own links**, **external links** from other sites or past traffic point to that 404. Those cases need fixing; the rest can stay.

## Where to find broken links

| Source | What it shows |
|---|---|
| Crawler (Screaming Frog, Sitebulb, etc.) | internal links to 404s and the pages containing them |
| Google Search Console, Pages report | "Not found (404)" URLs Google knows about |
| Yandex Webmaster, Pages in search and Diagnostics | excluded pages and crawl errors |
| Backlink reports | broken URLs that other sites link to |
| Server logs | real requests to non-existent addresses |
| Analytics | visits to the 404 page and their referrers |

For **outbound external links** (from your site to others), enable external URL checking in the crawler: other sites move and delete pages too.

## Deciding what to do with each 404

Ask three questions for every broken URL:

1. **Was the page deleted by mistake?** Restore it.
2. **Is there a close replacement?** Add a **301 redirect** to it: a new product version, an updated article, the parent category.
3. **No replacement and no links?** Leave the 404, or return **410** if the page is gone for good.

What not to do:

- **Redirect everything to the homepage.** Users do not find what they wanted, and search engines often treat it as a "soft 404".
- **Return 200 on a "not found" page.** That is a classic soft 404: the search engine sees an empty page as a real one.
- **Build chains** like A → B → C. Point straight to the final URL.

A 301 redirect in nginx:

```nginx
location = /old-product {
    return 301 /catalog/new-product;
}
```

## Fix internal links at the source

A redirect is a safety net for the outside world. If a broken link sits in **your menu, text or template**, update it right there to the current URL. Otherwise the bot takes an extra hop every time and users wait longer.

Pay special attention to templates: one wrong link in the footer is multiplied across every page of the site.

## How to build a useful 404 page

A good 404 page keeps people on the site:

- **A clear message** without technical jargon: the page is not here, here is what you can do.
- **Site search** right on the page.
- **Links** to the homepage, main sections and popular content.
- **The same navigation and design** as the rest of the site, so it is clear the visitor is not lost.
- **The correct 404 status code**, not 200 or a redirect.

Fire an analytics event when the 404 page is shown, with the URL and referrer. That way you spot new broken links before users complain.

## How to prevent new 404s

- Add a redirect as soon as you delete or rename a page.
- Generate template links from routes instead of typing them by hand.
- Run the crawler after major updates and on a schedule.
- Keep `sitemap.xml` automatic so deleted URLs do not linger in it.

## FAQ

### Do 404 errors hurt rankings?

Not by themselves: search engines consider them normal for removed pages. The harm comes when internal or valuable external links lead to a 404, their value is lost and users hit a dead end.

### When should I return 410 instead of 404?

A 410 says the page is gone permanently and will not return. Use it when you have definitely removed the content and plan no replacement. For most sites the difference is small; both responses are correct.

### Should I fix 404s from old or junk URLs in Search Console?

If they have no links and no traffic, no. Such URLs often come from typos or spam links. Focus on URLs that matter to users and have links pointing to them.
