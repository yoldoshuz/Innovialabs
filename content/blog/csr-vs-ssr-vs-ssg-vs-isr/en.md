---
title: CSR vs SSR vs SSG vs ISR: Rendering Strategies Explained
description: How CSR, SSR, SSG and ISR differ in speed, SEO, server cost and data freshness, and which one fits a blog, an online store or a dashboard.
summary: The difference is where and when HTML is built: in the browser (CSR), on the server per request (SSR), once at build time (SSG), or at build time with periodic updates (ISR). Content sites fit SSG and ISR, personal pages fit SSR, private panels fit CSR.
---

## The one-minute answer

Every page ends up as HTML. Rendering strategies answer two questions: **where** that HTML is built and **when**.

- **CSR (Client-Side Rendering)** — in the browser, after JavaScript loads.
- **SSR (Server-Side Rendering)** — on the server, on every request.
- **SSG (Static Site Generation)** — on the server, once at build time.
- **ISR (Incremental Static Regeneration)** — like SSG, but pages are rebuilt on a timer or event without rebuilding the whole site.

Modern frameworks like Next.js and Nuxt let you **mix** strategies on one site: each page gets its own.

## What it looks like

```text
CSR:  Browser -> empty HTML + JS -> JS calls the API -> page visible
SSR:  Browser -> server builds HTML with data -> ready page
SSG:  Build -> ready HTML files on a CDN -> browser gets them instantly
ISR:  Like SSG, but after N seconds or an event the page
      is quietly rebuilt in the background
```

## Each strategy in more detail

**CSR.** The server sends an almost empty page and a JavaScript bundle; the browser does the rest. Pros: simple hosting, smooth in-app navigation. Cons: slower first view, especially on weak phones, and search engines have a harder time seeing content.

**SSR.** On each request the server fetches data and returns finished HTML. Pros: content is visible right away, data is always fresh, good for SEO. Cons: you need a running server, load grows with traffic, and a slow API slows the whole page.

**SSG.** All pages are built in advance and stored as files. Pros: top speed, minimal cost, high reliability. Cons: updating content requires a rebuild; with thousands of pages builds get long.

**ISR.** A compromise: the page is served as static but refreshed periodically or on a signal. Pros: static speed with reasonably fresh data. Cons: users may briefly see an older version; you need a platform that supports it.

## Comparison

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| First view speed | Lower | Good | Best | Best |
| SEO | Weaker | Excellent | Excellent | Excellent |
| Server load | Minimal | High | Minimal | Low |
| Data freshness | Always fresh | Always fresh | Until rebuild | With delay |
| Personalization | Yes | Yes | No | No |

## What to choose for your project

- **Blog, docs, landing page** — SSG. If content is edited in a CMS, ISR, so you do not rebuild the whole site.
- **Online store** — catalog and product pages via ISR (fast and indexable); cart and checkout via SSR or CSR, because they are personal.
- **News site** — ISR with a short interval or revalidation on publish.
- **User account, dashboard, admin panel** — CSR or SSR. SEO does not matter here, pages are behind a login and data is per user.
- **Search and filter pages** — SSR if results should be indexed, otherwise CSR.

## Common mistakes

- **Building a public site entirely with CSR.** Content appears late and search promotion gets harder.
- **SSR for everything.** Unchanging pages are re-rendered on every request — wasted server spend.
- **Personal data in static pages.** A cached page can show one user's data to another.
- **One strategy for the whole site.** The strength of modern frameworks is mixing them.

## FAQ

### Which strategy is best for SEO?

SSR, SSG and ISR are equally good: the search engine receives ready HTML. CSR can be indexed too, but indexing is usually less reliable and slower.

### Can I use several strategies in one project?

Yes, and usually you should. For example, the home page and blog are static, the catalog uses ISR and the user account uses SSR or CSR.

### Is ISR the same as caching?

Essentially it is a managed cache of finished pages: the framework stores built HTML and decides when to refresh it. Unlike a plain cache, the refresh happens in the background so users do not wait.
