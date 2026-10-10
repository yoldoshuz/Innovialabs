---
title: What Uptime and SLA Mean: 99.9% vs 99.99% in Practice
description: Uptime percentages turned into real minutes of downtime per month and year, what an SLA actually guarantees and how compensation for outages works.
summary: 99.9% uptime allows up to 43 minutes of downtime a month, 99.99% about 4 minutes. An SLA promises that level, but when it is broken you usually get a credit on your next bill, not compensation for your losses.
---

## The short answer

**Uptime** is the share of time a service is available. An **SLA** (Service Level Agreement) is the part of a contract where the provider promises a certain uptime and describes what happens if it falls short.

Each extra "nine" cuts allowed downtime roughly tenfold:

| Uptime | Downtime per month (30 days) | Downtime per year |
|---|---|---|
| 99% | 7 h 12 min | 3 d 15 h 36 min |
| 99.5% | 3 h 36 min | 1 d 19 h 48 min |
| 99.9% | 43 min 12 s | 8 h 45 min |
| 99.95% | 21 min 36 s | 4 h 22 min |
| 99.99% | 4 min 19 s | 52 min 34 s |
| 99.999% | 26 s | 5 min 15 s |

The math is simple: multiply the downtime share by the minutes in the period. For 99.9%, that is 0.1% of the 43,200 minutes in a month, or 43.2 minutes.

## 99.9% vs 99.99% in practice

- **99.9%** means the service may be down for up to 43 minutes a month, for example one bad overnight incident. For most corporate websites, landing pages and internal systems, that is a reasonable level.
- **99.99%** means about 4 minutes a month. A person would not even have time to figure out what went wrong. This level requires automatic failover, multiple availability zones and an on-call team.

Every additional nine costs noticeably more: redundant infrastructure, monitoring, rehearsed recovery procedures. So the real question is not "how many nines do we want" but **how much an hour of downtime costs your business**.

## What an SLA actually guarantees

When reading an SLA, look at the details:

- **What counts as downtime.** Full unavailability? An error rate above a threshold? Slow responses usually do not count.
- **How it is measured.** Who records the outage, the provider or you, and over what period the percentage is calculated.
- **Exclusions.** Scheduled maintenance, force majeure, issues on your side and beta features are usually not covered.
- **Conditions.** Some SLAs apply only to certain architectures, for example when resources are deployed across several availability zones.

## How compensation works

This is the biggest disappointment for many: an SLA is not insurance.

- Compensation is usually issued as **service credits**, a discount on future bills, not cash.
- The credit is a percentage of the **specific service's** monthly cost and depends on how far uptime dropped.
- It is almost always capped at that service's monthly cost.
- You must **request it yourself** within a set deadline and provide evidence.
- **Lost revenue, client penalties and reputational damage are not covered.**

If an hour of downtime costs you many times your monthly hosting bill, reliability has to come from architecture, not from the contract.

## System uptime is lower than its parts

If your site depends on several services, their availability multiplies. A server at 99.9% and a database at 99.9%, both required for the site to work, give about 99.8% together, which is roughly 86 minutes of possible downtime per month. The more dependencies in a chain, the lower the final number.

## What to do in practice

1. Estimate the cost of an hour of downtime: lost orders, support calls, reputation.
2. Pick a target uptime based on that estimate.
3. Set up **external uptime monitoring** to see the real picture and to have evidence when you claim credits.
4. Remove single points of failure where it is justified: a database replica, a second app instance, another zone.
5. Regularly verify that restoring from backups actually works.

## FAQ

### What is the difference between an SLA and an SLO?

An **SLA** is an external commitment with consequences for the provider. An **SLO** is the team's internal target, usually stricter than the SLA, so there is a buffer before the contract is breached.

### Does scheduled maintenance count as downtime?

Usually not, as long as the provider announced it the way the SLA describes. That is why it matters how and how far in advance such work is announced.

### Does a small website need 99.99% uptime?

Most often, no. A corporate website or landing page needs reliable hosting, monitoring and backups. Strict targets make sense for payments, online services and systems where every minute of downtime directly costs money.
