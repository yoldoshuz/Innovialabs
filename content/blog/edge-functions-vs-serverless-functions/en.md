---
title: Edge Functions vs Serverless Functions: What to Use When
description: Comparing edge and serverless functions by execution location, runtime limits, latency, database access and pricing to decide where each piece of logic belongs.
summary: Edge functions run close to the user and suit lightweight logic that does not hit a distant database; regional serverless functions run next to your data and suit business logic, database queries and longer operations.
---
## The short answer

**Edge functions** run in CDN points of presence, as close to the user as possible. They start almost instantly but run in a trimmed-down environment with tight limits. **Serverless functions** run in a specific cloud region, have a full runtime and usually sit next to your database.

A simple rule: **put on the edge what depends on the request, not on the data**. Anything that talks to the database repeatedly belongs in the region, next to the database.

## Comparison

| Criterion | Edge functions | Serverless functions |
|---|---|---|
| Where they run | Many locations worldwide, close to users | One or a few chosen regions |
| Runtime | Usually V8 isolates, Web APIs, parts of Node.js missing | Full Node.js, Python, Go, Java and more |
| Cold start | Very short | More noticeable, depends on runtime and code size |
| Limits | Stricter on CPU time, memory and code size | Wider: longer execution, more memory |
| Native modules, file system | Usually not available | Available |
| Database access | Via HTTP drivers or proxies, far from the DB | Standard drivers, close to the DB |
| Pricing model | Usually per request and CPU time | Usually per request, duration and memory |

Exact limits and prices differ between providers (Vercel, Cloudflare Workers, Netlify, AWS Lambda@Edge and CloudFront Functions) and change over time, so check their documentation.

## Latency: where time is actually lost

The edge only wins when a response can be built **without fetching remote data**. If an edge function in Tashkent makes three sequential queries to a database in Frankfurt, each one travels a long way, and the total is slower than a serverless function in Frankfurt making the same three queries locally.

So measure the **full response time** including every data request, not just the latency to the function.

## Database access patterns

- **A classic database in one region.** Keep logic that queries it in a serverless function in the same region. Most platforms let you pin the function region.
- **Edge plus distributed storage.** KV stores and replicated databases built for the edge give fast reads worldwide. Writes usually go to a primary region and propagate with a delay.
- **Edge plus cache.** The edge function serves from cache and, on a miss, calls a serverless function or API.
- **Connection pooling.** Edge functions and short-lived serverless functions can quickly exhaust a classic database's connection limit, so use a connection pooler or an HTTP driver.

## What goes where

**Good fits for the edge:**

- redirects and URL rewrites;
- geolocation and language selection;
- A/B tests and feature flags;
- JWT verification and basic route protection;
- adding security headers;
- personalization from cache or KV.

**Good fits for regional serverless:**

- business logic with several database queries;
- payments, webhooks, third-party API integrations;
- PDF generation, image processing;
- operations needing native libraries or long execution.

**For an always-on server** rather than functions: long-lived WebSocket connections, heavy background jobs, persistent queues.

## Common mistakes

- Moving all logic to the edge "for speed" while the database stays in one region.
- Using a library on the edge that relies on unavailable Node.js APIs and finding out only at deploy time.
- Not pinning serverless functions to the region where the database lives.
- Comparing prices by request count alone and ignoring execution time.

## FAQ

### Are edge functions always faster than serverless?

No. They start faster and sit closer to the user, but if the logic depends on a distant database, the total response can be slower. The edge wins on lightweight operations that do not need far-away data.

### Can I use both in one project?

Yes, and that is the most common setup. The edge layer handles routing, auth checks and caching, while serverless functions in the database's region run the core business logic.

### What should I pick if I am unsure?

Start with serverless functions in the region next to your database. Move individual operations to the edge once measurements show they benefit from being closer to users.
