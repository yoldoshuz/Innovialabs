---
title: What Is Vercel and How It Differs from Classic Hosting
description: How Vercel works: git-based deploys, preview URLs, edge network and serverless functions, plan limits, and which projects are a poor fit for it.
summary: Vercel is a platform that builds and publishes your frontend and serverless functions on every git push, with no servers to manage. It is great for sites and web apps on Next.js and similar frameworks, and a poor fit for long-running jobs and heavy backends.
---

## The short answer

**Vercel** is a deployment platform for frontends and lightweight backends. With classic hosting or a VPS, you rent a server, install software, configure a web server and push updates yourself. On Vercel there are no servers for you to manage: you connect a git repository, and the platform builds the project and serves it through its global network.

Vercel is made by the same company that develops Next.js, so Next.js support is especially deep. Other frameworks work too: Nuxt, SvelteKit, Astro and plain static sites.

## How it works

### Git-based deploys

You connect a GitHub, GitLab or Bitbucket repository. Then:

1. A push to the main branch triggers a build and ships the **production version**.
2. A push to any other branch, or a pull request, creates a separate **preview deployment**.
3. Every deployment is immutable, so rolling back simply means switching to a previous one.

### Preview URLs

Each preview deployment gets its own URL. A designer, manager or client opens it and reviews changes before they reach the main site. For teams this is one of the most useful features: feedback happens on a live version, not on screenshots.

### Edge network

Static files and cached pages are served from network nodes close to the user. There is also **middleware** that runs before the main request handling: redirects, auth checks, A/B tests, language detection.

### Serverless functions

API routes and server-side rendering run as **functions**: they start on demand and scale automatically. You do not decide how many servers to keep; when traffic spikes, the platform runs more instances.

## How it differs from classic hosting

| | Classic hosting / VPS | Vercel |
|---|---|---|
| Server | You rent and administer it | Not your responsibility |
| Deploys | Manual or via your own CI/CD | Automatic from git |
| Change previews | Must be set up separately | Built in |
| Scaling | You buy capacity in advance | Automatic |
| Long-running processes | Work fine | Not suitable |
| Price predictability | Fixed rent | Usage-based |

## Plans and limits

- **Hobby**: a free plan for personal, non-commercial projects only. A company website needs a paid plan.
- **Pro**: billed per team member plus usage beyond the included allowances.
- **Enterprise**: custom terms, advanced security and guarantees.

Every plan has limits: function execution time, bandwidth, build time, function size. Exact values change, so check the documentation. The key point: as traffic grows, **your bill grows with it**, so turn on spending notifications.

## Projects that fit Vercel poorly

- **Long-running background jobs**: video processing, large imports, queues that run for hours. Function execution time is capped.
- **Persistent connections**: your own WebSocket server, game servers, a bot using long polling. For a Telegram bot, use webhooks or a separate server.
- **Databases**: Vercel does not host your database itself; you need an external service, ideally in the same region as your functions.
- **Heavy backends** with their own processes, cron jobs and local disk.
- **Integrations that require a fixed outbound IP** for allowlists: there is none by default.

A common working setup: the frontend and lightweight APIs on Vercel, with the main backend, queues and database on a VPS or in a cloud.

## FAQ

### Can I host a non-Next.js site on Vercel?

Yes. Vercel supports many frameworks as well as plain static sites. Next.js simply gets more platform-specific features because the same company builds it.

### Can I use my own domain?

Yes, on every plan. Add the domain to your project and create the DNS records Vercel shows you. The SSL certificate is issued automatically.

### What happens if my site suddenly gets a lot of traffic?

The platform scales on its own and the site keeps working. On paid plans, however, your usage bill will grow, so set up limits and spending alerts in advance.
