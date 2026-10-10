---
title: Next.js or Plain React with Vite: Which Do You Need
description: Next.js vs React with Vite for SEO-driven sites, dashboards and apps behind a login: hosting, complexity, performance and how to choose.
summary: If your pages must rank in search and open fast on the first visit, pick Next.js; if it is an app behind a login with no SEO needs, React with Vite is simpler and cheaper to maintain.
---
## Short answer

One question decides it: **do your pages need ready-made HTML from a server?**

- **Yes** — a public site, blog, catalog or store where traffic comes from search and social media. Choose **Next.js**.
- **No** — a dashboard, CRM, admin panel or internal tool that users reach after signing in. **React + Vite** is enough.

Both use React, so team skills and most components carry over between them.

## How they differ

**Vite** is a bundler and dev server. It starts a project quickly and builds it into a set of static files. Routing, data fetching and the rest you add yourself (for example, React Router and TanStack Query).

**Next.js** is a framework with its own rules: file-based routes, server rendering, server code inside the project, image and font optimization.

| Criterion | Next.js | React + Vite |
|---|---|---|
| HTML for search engines | ready on the server | built in the browser |
| Routing | built in, file-based | separate library |
| Server code | yes (Route Handlers, Server Actions) | needs a separate backend |
| Hosting | Node.js server, Vercel or static export | any static host or CDN |
| Learning curve | higher: server/client, caching | lower: a regular SPA |
| Architectural freedom | within framework conventions | assemble it your way |

## Scenario 1: a site that must rank in search

A company site, landing page, blog or online store. What matters here:

- **indexing** — the search engine should see text and meta tags immediately;
- **first-screen speed** — a visitor from search results should not wait for JavaScript;
- **link previews in messengers** — Open Graph tags must be in the HTML.

Next.js covers this out of the box. With a plain SPA you would have to add prerendering or a custom SSR setup — essentially building your own framework.

## Scenario 2: a dashboard or app behind a login

A CRM, analytics panel, user account area or internal service. Here:

- SEO is irrelevant — pages are behind authentication;
- users keep the app open for a long time, so the first load matters less than responsiveness afterwards;
- there is usually a separate backend already (an API in Node.js, Python, Go and so on).

**React + Vite** gives a simple model: everything runs in the browser, and the build is a folder of static files you can serve through nginx or a CDN. Fewer moving parts means fewer places for things to break.

## Scenario 3: a mixed product

Marketing pages plus a user dashboard. Two options:

1. **Everything in Next.js** — one project, shared components, one deployment.
2. **Split it** — the public site in Next.js (or even a static site generator), the app in React + Vite.

Splitting makes sense when different teams own the site and the app, or when they ship on different release cycles.

## Hosting and maintenance cost

- **A Vite build** is static files. You can host them almost anywhere, and the server needs very little attention.
- **Next.js with SSR** needs a running Node.js process or a platform that runs it. Monitoring, updates and cache configuration come along with it.
- **Next.js with static export** hosts like Vite, but some features (per-request server rendering, Server Actions) become unavailable.

## Common mistakes when choosing

- **Picking Next.js because it is trendy** for an internal admin panel, then fighting the server/client boundary for no benefit.
- **Building a public site as an SPA** and later trying to bolt SEO on.
- **Ignoring the team**: if developers have not worked with server rendering, budget time for learning.
- **Forgetting the backend**: Server Actions are convenient but do not replace a well-designed API when you have several clients (website, mobile app, bot).

## FAQ

### Can we move from Vite to Next.js later?

Yes. React components move over almost unchanged; you will need to rewrite routing, data fetching and any code that touches browser APIs during rendering.

### Is Next.js faster than React with Vite?

For the first visit to a public page, usually yes, because the HTML arrives ready. Inside an already loaded app, the difference depends mostly on code quality rather than the tool.

### Is Vite fine for a landing page?

Yes, if the landing page is fully static and prerendered to HTML at build time. If content changes often or there are many pages, Next.js is usually more convenient.
