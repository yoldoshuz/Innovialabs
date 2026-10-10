---
title: Vercel vs Netlify vs Cloudflare Pages: Which to Choose
description: A practical comparison of Vercel, Netlify and Cloudflare Pages: free limits, builds, serverless and edge support, pricing at scale and framework support.
summary: Vercel is the easiest home for Next.js with server features, Netlify is convenient for static sites and Astro, and Cloudflare is usually cheapest at high traffic because it does not charge for static bandwidth. Your framework and traffic profile make the final call.
---
## The short answer

- **Vercel** if your site runs on Next.js and uses its server features: server rendering, ISR, server actions, middleware. New Next.js features land here first.
- **Netlify** if the site is static or built with Astro, Hugo or Eleventy, and you want built-in conveniences such as form handling.
- **Cloudflare Pages** if you expect a lot of traffic, want predictable costs, or already run your DNS on Cloudflare. Cloudflare is now steering new projects toward Workers with static assets, but Pages keeps working.

All three serve static files from a global CDN, deploy from Git and create preview deployments for branches. The differences are in server-side code, pricing and limits.

## Side-by-side comparison

| Criterion | Vercel | Netlify | Cloudflare Pages |
|---|---|---|---|
| Next.js | Full support out of the box | Via adapter, most features | Via the OpenNext adapter, test carefully |
| Other frameworks | Broad support | Broad support, strong for static | Broad support through adapters |
| Serverless functions | Node.js and other languages | Node.js, Go | Workers runtime, partial Node.js compatibility |
| Edge | Middleware and edge functions | Edge Functions on Deno | All code runs at the edge |
| Free plan | Non-commercial projects only | Available, with resource caps | No charge for static bandwidth, limits on builds and function requests |
| Paying at scale | Team seats plus usage | Credit and usage based | Workers usage, no egress fees |

All three change their limits and prices regularly, so check the pricing pages before you decide.

## Free plans: what to check

- **Terms of use.** Vercel's Hobby plan explicitly excludes commercial use, so a company site does not belong there.
- **What happens when you exceed a limit.** Some platforms pause the project until the next cycle, others start billing. Know which before launch.
- **Concurrent builds and build minutes.** For a team that pushes often, these run out sooner than bandwidth.

## Build speed

Build time depends mostly on the project: page count, dependency weight, build cache, and how many pages are pre-rendered. There is no honest universal ranking. The reliable method is to import the same repository into all three platforms (free to do) and compare build times on your own code.

## Serverless and edge: the key difference

- **Vercel and Netlify** run functions in a familiar Node.js environment. Any npm package, database driver or file operation works.
- **Cloudflare** runs code in the Workers runtime built on V8 isolates. Cold starts are practically invisible, but not every Node.js API is supported, so some libraries need replacing.

On all three, functions are for short tasks. Long-running jobs, queues and persistent connections belong on a separate server or container.

## Cost at scale

At high volume, the bill comes from:

- **outbound bandwidth**, especially for image- and video-heavy sites;
- **function invocations and execution time**;
- **build minutes** and team seats;
- **image optimization**, which some platforms bill separately.

For a busy, media-heavy site, Cloudflare's model without static bandwidth fees usually gives the most predictable bill. If most of the load is Next.js server rendering, Vercel's convenience may justify the price difference.

## Common mistakes when choosing

- Picking by free plan without checking whether it allows commercial use.
- Building deeply on platform-only features (proprietary storage, config services, edge APIs) and then being unable to move.
- Not setting spending limits and usage alerts.
- Running functions far from the database: a round trip to a distant database cancels out any edge advantage.

## FAQ

### Can I move from one platform to another later?

A static site moves quickly: connect the repository on the new platform and update DNS. Server functions and platform services take more work, as they must be adapted to the new environment, especially when moving to Workers.

### Which platform is fastest for visitors?

For static files, all three CDNs perform comparably. For dynamic pages, what matters more is where your database is and how close the functions run to it.

### Does Next.js fully work outside Vercel?

Most features work through adapters, but the newest ones may arrive later. Before moving, test the site's key flows on the target platform.
