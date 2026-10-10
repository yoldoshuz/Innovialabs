---
title: What Is Next.js and What It Adds on Top of React
description: Next.js in plain words: routing, server rendering, API endpoints, image and font optimization, deployment, and the projects it fits best.
summary: Next.js is a framework built on React that adds file-based routing, server rendering, backend endpoints and built-in optimization so sites load fast and index well.
---
## Short answer: React is a library, Next.js is a framework

**React** does one job: describe a UI as components and update it when data changes. Everything else — routes, data loading, bundling, SEO, a server — you assemble yourself from separate tools.

**Next.js** takes React and answers those questions for you. You get a project structure where each folder is a page, HTML is prepared on the server, and images, fonts and scripts are optimized automatically.

## File-based routing

In a plain React app you declare routes in code through a separate library. In Next.js a route is a file or folder:

```text
app/
  page.tsx             -> /
  about/page.tsx       -> /about
  blog/[slug]/page.tsx -> /blog/any-post
```

Why this helps:

- the site structure is visible right in the file tree;
- **nested layouts** (header, menu, footer) are defined once and do not re-render on navigation;
- code is split per page automatically, so users only download what they need right now.

## Server rendering

The biggest thing Next.js adds to React is **rendering on the server**. There are several modes:

| Mode | When HTML is created | Good for |
|---|---|---|
| Static generation (SSG) | at build time | landing pages, blogs, docs |
| Incremental regeneration (ISR) | at build, then periodically | catalogs, news |
| Server-side rendering (SSR) | on every request | personal or fast-changing data |
| Client rendering | in the browser | interactive parts of the UI |

Why it matters: search engines and users get ready HTML with real text, not an empty page that fills in after JavaScript loads. That helps **SEO** and the speed of the first paint.

## A backend inside the project

Next.js lets you write server code next to the frontend:

- **Route Handlers** (formerly API routes) — regular HTTP endpoints, for example for a contact form or a webhook;
- **Server Actions** — functions called from a form that run on the server without a hand-written API.

For small projects this removes the need for a separate backend service. For complex business logic a dedicated backend can still be the better choice.

## Images, fonts and scripts

Built-in components solve common performance problems:

- **next/image** — serves images at the right size and in modern formats, lazy-loads them and reserves space so the page does not jump;
- **next/font** — loads fonts without extra requests to third-party servers and without text flashing;
- **next/script** — controls when third-party scripts such as analytics load.

All of this directly affects **Core Web Vitals**.

## Deployment

Hosting options:

- **Vercel** — the platform from the creators of Next.js, deployment in a few clicks;
- **your own Node.js server** — `next build` and `next start`, often in Docker behind nginx;
- **static export** — if the site needs no server, it can be exported as plain HTML files to any host.

## Which projects Next.js fits

**A good fit:**

- company sites, landing pages and blogs where indexing matters;
- online stores and catalogs;
- multilingual sites;
- products where marketing pages and the user dashboard live in one codebase.

**Possibly overkill:**

- an internal admin panel behind a login, where SEO is irrelevant;
- a small widget or single-page app with no server side.

## FAQ

### Do I need to know React before learning Next.js?

Yes, at least the basics: components, props, state and hooks. Next.js is built on React, and its features are hard to understand without those concepts.

### Is Next.js frontend or backend?

Both. Its main job is the interface, but you can write server code in it: rendering, endpoints, database access. Heavy business logic is often moved into a separate backend.

### Do I have to host Next.js on Vercel?

No. A project can run on any server with Node.js, in a Docker container, or, if it uses no server features, be exported as a static site.
