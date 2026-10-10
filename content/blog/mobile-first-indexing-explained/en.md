---
title: What Is Mobile-First Indexing and How to Prepare
description: Google indexes the mobile version of your site. Learn which mobile vs desktop differences hurt rankings and how to check your site with a checklist.
summary: With mobile-first indexing, search engines judge your site by its mobile version, so anything missing on mobile, such as text, markup or images, effectively does not exist for rankings.
---
## What mobile-first indexing means

**Mobile-first indexing** means Google crawls and indexes your site the way a smartphone sees it. The primary crawler is **Googlebot Smartphone**, and the mobile version of a page is what goes into the index and gets ranked.

It is not a separate "mobile index". There is one index; the mobile version is simply its data source. If a page is thinner on a phone than on a laptop, search sees the thinner version, even for desktop users.

## Why it matters in practice

Many sites were historically built "for desktop", with a simplified mobile version: blocks removed, texts shortened, markup dropped. Under mobile-first indexing, those shortcuts hit SEO directly.

The core principle is **content parity**: mobile and desktop versions should contain the same primary content.

## Common parity problems

- **Trimmed content.** Product descriptions, reviews, FAQs or spec tables appear only on desktop. If they are absent from the mobile HTML, they are absent from the index.
- **Content loaded on interaction.** If text loads only after a tap or swipe, the crawler will most likely miss it: it does not click buttons or swipe carousels. Accordions and tabs are fine when their content is already in the HTML.
- **Missing structured data.** Product, FAQ or BreadcrumbList markup exists on desktop but is not rendered in the mobile template.
- **Different meta tags.** Title, description and meta robots should match. A stray `noindex` in the mobile template is a common and painful mistake.
- **Broken lazy loading.** Images and blocks that load only on scroll through custom scripts may never be indexed. Native `loading="lazy"` or IntersectionObserver are safer.
- **Images without alt text** or in low quality on mobile only.
- **Blocked resources.** CSS, JS or images for the mobile version are disallowed in robots.txt, so the crawler cannot render the page properly.

## How to prepare: a checklist

1. **Move to responsive design** if your site still uses a separate mobile subdomain (m.example.com). One URL and one HTML for every device is the simplest way to guarantee parity.
2. **Compare the HTML** of mobile and desktop versions of key pages: H1–H3 headings, main text, links, images.
3. **Validate structured data** on the mobile version with the Rich Results Test.
4. **See the page as the crawler does.** The URL Inspection tool in Google Search Console shows the rendered HTML and a screenshot from Googlebot Smartphone.
5. **Check internal links.** If the mobile menu leaves important sections out of the HTML, those pages are harder to discover and receive less link equity.
6. **Watch performance.** Mobile users are often on slow networks, and Core Web Vitals are assessed with mobile data too.

## If you run a separate mobile site

If moving to responsive design is not possible yet, the mobile version must be connected to the main one:

```html
<!-- on the desktop page -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.example.com/page">

<!-- on the mobile page -->
<link rel="canonical" href="https://www.example.com/page">
```

The mobile subdomain must also serve the same content, markup and meta tags, and its resources must not be blocked.

## FAQ

### Do I need to do anything if my site is already responsive?

Usually you only need to confirm that important blocks are not removed from the HTML at small screen sizes and that lazy loading works correctly. With one HTML for all devices, most parity issues disappear.

### Is content inside collapsed accordions and tabs indexed?

Yes, as long as the text is already in the HTML and only visually collapsed. The problem appears when content is fetched from the server only after a click.

### Does mobile-first indexing affect desktop rankings?

Yes. The index is shared, so a page is ranked using its mobile version data in both mobile and desktop search.
