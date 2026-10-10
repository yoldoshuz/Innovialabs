---
title: JavaScript SEO: SSR, SSG and CSR for React and Next.js Sites
description: How Googlebot and Yandex process JavaScript, how SSR, SSG and CSR differ for SEO, where hydration issues come from and how to check what bots see.
summary: For SEO, the safest option is to serve ready HTML with content via SSR or SSG. CSR, where the page is built in the browser, forces search engines to render JS, which is slower and does not always work.
---

## The short answer: which rendering to choose

If a page needs to rank, its **main content, links and meta tags must be in the server's HTML response**. SSR (server-side rendering) and SSG (static generation at build time) provide that. CSR, where the server sends an empty shell and JavaScript builds the content in the browser, suits dashboards and admin panels but is risky for public pages.

## How search engines process JavaScript

**Googlebot** first fetches the HTML, then queues the page for rendering and runs JavaScript in a modern Chromium. Time can pass between crawling and rendering, and some resources may fail to load because of timeouts or robots.txt blocks.

**Yandex** can also render JavaScript, but relying on it for key content is riskier. The safe strategy is the same for both: put what matters straight into the HTML.

What bots usually do not do:

- click buttons or scroll the page to load more content;
- follow links built with `onClick` and no `href`;
- see content that appears only after a user action.

## Strategy comparison

| Strategy | Where HTML is built | SEO | Best for |
|---|---|---|---|
| SSG | At build time | Excellent | Blogs, landing pages, documentation |
| ISR / revalidation | At build time and periodically | Excellent | Catalogs that do not change every second |
| SSR | On the server per request | Excellent | Personalized or frequently changing data |
| CSR | In the browser | Risky | Private areas, dashboards |

In Next.js, pages render on the server by default, while client components hydrate in the browser. API details change between versions, so check the official documentation for your version.

## Hydration issues

**Hydration** is when React in the browser "brings to life" the HTML that came from the server. If the server and browser markup differ, you get a hydration error: React may re-render that part, and the user sees a flicker.

Typical causes:

- using `Date.now()`, `Math.random()` or `window` during render;
- different content on server and client depending on locale or time zone;
- invalid HTML nesting, such as a `<div>` inside a `<p>`.

```tsx
"use client";
import { useEffect, useState } from "react";

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <span>{time ?? ""}</span>;
}
```

Compute browser-dependent values after mounting, not during render.

## How to check what the bot sees

1. **Page source** (not DevTools): are the text, links, title and description there?
2. **curl** from a terminal: a quick check of HTML without JavaScript.
3. **URL Inspection in Google Search Console**: the rendered HTML and a screenshot.
4. **Yandex Webmaster**: server response check and page status in the index.
5. Disable JavaScript in the browser and see what remains.

```bash
curl -s https://example.uz/catalog | grep -i "<title>"
```

## Common mistakes

- Meta tags and canonical are added only on the client.
- Navigation without real `<a href>` links.
- Infinite scroll without paginated pages that have their own URLs.
- JS and CSS files blocked in robots.txt.
- The server returns 200 for missing pages while JavaScript draws a "404".

## FAQ

### Do I have to switch to Next.js for SEO?

No. What matters is the result: ready HTML with content in the server response. You can get it with different tools, including prerendering for an existing SPA.

### Is CSR fine for an online store?

For the catalog and product pages it is a poor choice, since they must be indexed. CSR fits the cart, account area and other private sections.

### How do I know Google indexed content loaded by JavaScript?

Open URL Inspection in Search Console and look at the rendered HTML. If the text you need is not there, the search engine did not see it.
