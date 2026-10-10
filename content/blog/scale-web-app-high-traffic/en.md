---
title: How to Prepare a Web App for Traffic Spikes
description: A step-by-step plan before a sale or campaign: find bottlenecks, add caching, pool connections, queue heavy work, autoscale and degrade gracefully.
summary: Find the bottleneck with a load test, take pressure off the database with caching and connection pooling, move heavy work to queues, set up autoscaling and decide in advance which features you can switch off.
---
## The short answer

A traffic spike does not break "the server" in general. It breaks one specific **bottleneck**, usually the database, an external API or a slow endpoint. So preparation goes in this order:

1. Measure: a load test on a realistic scenario.
2. Relieve the database: **caching** and **connection pooling**.
3. Take heavy work out of the request: **queues**.
4. Let the system grow: **horizontal scaling** and autoscaling.
5. Decide what to turn off under overload: **graceful degradation**.

## Step 1. Find the bottleneck

Without measurements you will optimize the wrong thing. Take the real user journey during the campaign: home page, catalog, product page, cart, checkout.

- Run a load test (k6, Locust, JMeter) on a staging environment as close to production as possible.
- Increase load in steps and watch where response time grows first.
- Track metrics at the same time: CPU, memory, database connections, slow queries, 5xx errors.

Typical findings: a query without an index, N+1 queries in the ORM, a synchronous call to a payment or SMS gateway, PDF generation right inside the handler.

## Step 2. Cache everything you can

Caching is the cheapest way to survive a peak.

| Layer | What to cache | Tool |
|---|---|---|
| CDN | Static files, images, public pages | Any CDN |
| Reverse proxy | Non-personalized responses | nginx, Varnish |
| Application | Results of heavy queries, reference data | Redis, Memcached |
| Browser | Assets with a hash in the file name | Cache-Control headers |

Plan **invalidation** carefully: when a price or stock level changes, the cache must update. For a catalog a short TTL is often enough; even a few seconds of caching removes a large share of identical requests.

Protect against a **cache stampede**, when a key expires and hundreds of requests hit the database at once. A recompute lock or refreshing the cache in the background before expiry helps.

## Step 3. Database connection pooling

Every new connection to PostgreSQL or MySQL costs resources, and the limit is finite. If you scale the app to dozens of instances, each with its own pool, the database hits its connection limit before it runs out of CPU.

- Configure the app's pool with a sensible maximum per instance.
- For PostgreSQL, consider **PgBouncer** as a shared pooler.
- Move heavy reports to a **read replica**.

## Step 4. Queues for heavy work

The user should not wait while an email is sent or an invoice is generated. The request does the minimum (saves the order) and puts a job in a queue; workers process it separately.

```text
Request -> save order -> enqueue job -> 200 response
                              |
                Workers: email, SMS, ERP sync, PDF
```

RabbitMQ, Redis-based queues, Kafka or managed cloud queues all work. The benefit: during a peak the queue simply grows instead of taking the site down. Workers scale independently.

## Step 5. Horizontal scaling and autoscaling

To add instances, the app must be **stateless**: sessions in Redis or tokens, files in object storage, not on a local disk.

- A load balancer spreads traffic across instances.
- Autoscaling (for example, HPA in Kubernetes) adds pods based on CPU or request rate.
- Mind startup time: new instances do not appear instantly. Before a planned campaign, **raise the minimum in advance** instead of relying on the autoscaler to react.

## Step 6. Graceful degradation

Decide in advance what you can sacrifice so the core (catalog, cart, payment) keeps working:

- turn off recommendations, review search, live counters;
- serve a cached version of a page when the backend fails;
- add **rate limiting** for bots and heavy endpoints;
- use a **circuit breaker** for external APIs so a hung service does not hold threads;
- under extreme overload, show a waiting room instead of a 502 error.

Make these switches **feature flags** so you can flip them without a deploy.

## Pre-campaign checklist

- The load test passed with headroom above the expected peak.
- Dashboards and alerts are set up, and someone is on call.
- The minimum instance count is raised in advance.
- Deploys are frozen during the peak.
- Limits of external services (payments, SMS) are confirmed.
- There is a rollback plan and a list of flags for disabling features.

## Common mistakes

- Scaling the app when the database is the limit.
- Testing on an empty database with a handful of products.
- Forgetting third-party API limits.
- Shipping a new release on the day of the sale.

## FAQ

### Is a more powerful server enough?

Sometimes it is a quick temporary fix, but vertical scaling has a ceiling and does not solve one slow query or a hung external API. Start by finding the bottleneck.

### Do I need Kubernetes for autoscaling?

No. Cloud instance groups and PaaS platforms offer autoscaling too. Kubernetes pays off when you run many services and want one platform for them.

### How much headroom do I need?

Estimate the expected peak from past campaigns or the marketing forecast, then test with load noticeably above that estimate to see where and how the system starts to degrade.
