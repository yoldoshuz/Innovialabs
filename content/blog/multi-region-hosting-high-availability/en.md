---
title: Multi-Region Hosting: Building a Site That Survives Outages
description: Active-passive vs active-active, how DNS failover works, what data replication really costs you and when a second region is worth paying for.
summary: Multi-region hosting means a running copy of your app in another region plus automatic traffic failover; start with active-passive and move to active-active only when downtime costs more than double infrastructure and harder data handling.
---

## The short answer

A single data center is a single point of failure. A fire, a power problem, a provider network fault or an issue affecting a whole cloud region takes your site down no matter how many servers you run inside it. **Multi-region hosting** is a working copy of the application in a geographically separate location, plus a mechanism that sends users there when the primary site is unavailable.

Keep two goals apart:

- **High availability within a region** — several servers across availability zones. It covers the loss of a machine or a rack.
- **Resilience across regions** — it covers the loss of an entire site. It is more expensive and harder, mostly because of data.

Before designing anything, write down two numbers: **RTO** (how quickly the service must come back) and **RPO** (how much recent data you can afford to lose). These drive the architecture, not a vague wish for "never going down".

## Active-passive vs active-active

| | Active-passive | Active-active |
|---|---|---|
| Traffic | All goes to the primary, the standby waits | Spread across regions all the time |
| Failover | Triggered on failure, takes minutes | Traffic simply stops going to the failed region |
| Data | One primary database, replica on standby | Writes in several regions or careful write routing |
| Complexity | Moderate | High |
| Cost | Standby can run scaled down | Full capacity in every region |

**Active-passive** fits most projects. The standby can be **hot** (everything running, only traffic needs switching), **warm** (minimal servers that scale up during an incident) or **cold** (only backups and infrastructure as code, brought up by hand).

**Active-active** gives the shortest downtime and, as a bonus, lower latency for users in different parts of the world. But each region must handle the full load on its own, and the application must cope with data changing in more than one place.

## DNS failover: how traffic moves

The most common mechanism is **DNS with health checks**. The DNS provider regularly probes an application endpoint in each region and, once the primary stops responding, starts returning the standby's address.

What to watch for:

- **Record TTL.** Resolvers cache answers for the TTL, so failover records use a short one. Some clients and ISPs may still hold the old address longer.
- **Check depth.** A `/health` endpoint that always returns `200` is useless. It should verify what the service cannot work without — database, cache, critical dependencies — without failing on optional ones.
- **Thresholds.** Failing over on one bad probe causes flapping. Require several consecutive failures from different locations.
- **Alternatives.** Global load balancers and anycast networks (offered by CDN providers, for example) shift traffic faster than DNS because they do not depend on resolver caches.

## Data: the real trade-off

Copying code and static assets is easy. The database is always the hard part.

- **Asynchronous replication.** The primary confirms a write immediately and the replica catches up with some lag. Fast, but during an outage the latest transactions may not have arrived — that gap is your RPO.
- **Synchronous replication.** A write is confirmed only once it is stored in both regions. No loss, but every write waits for cross-region latency, and a broken link can stall writes.
- **Multi-primary.** Writes are accepted in any region. You need a conflict-resolution strategy, and not every data model tolerates it.

Plan **failback** separately: once the primary region recovers its data is stale, and returning traffic without losing anything is its own procedure.

## Common mistakes

- The standby has never been tested under real load, and during the incident it turns out it does not start.
- Secrets, certificates, third-party DNS records or queues exist only in the primary region.
- User files live on a server disk instead of replicated object storage.
- Supporting services (auth, payments, email) are tied to one region and become the new single point of failure.
- No runbook: nobody knows who decides to fail over or which steps to run.

## When a second region is justified

Multi-region costs you twice: in infrastructure and in engineering time to maintain it. It pays off when:

- an hour of downtime costs more than running the standby;
- you have contractual availability commitments (SLAs) to customers;
- regulations require a backup site;
- your users are spread worldwide and latency itself affects the business.

If none of these apply, a sensible step is multiple availability zones in one region, regular backups to another region and infrastructure as code so you can rebuild everything in a predictable time.

## FAQ

### Is a CDN enough to survive a data center outage?

For a static site, partly: a CDN can keep serving cached pages while the origin is down. Dynamic features, forms, user accounts and APIs will still stop without a working backend.

### How often should failover be tested?

Regularly on a schedule, and after any major infrastructure change. An untested standby is not really a standby: only drills reveal your actual RTO and RPO.

### Can the standby region be at a different cloud provider?

Yes, and it also protects you from provider-wide issues. Complexity grows, though: different APIs, services and networking mean your infrastructure has to be described as portably as possible.
