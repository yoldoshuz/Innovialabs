---
title: SLI, SLO and Error Budgets: SRE Reliability Basics in Practice
description: What SLI, SLO, SLA and error budgets mean, how to pick useful metrics, set realistic targets and balance feature work against reliability.
summary: An SLI is a measurable indicator of service quality, an SLO is the target for it, and the error budget is the allowed share of failures a team can spend on releases and experiments.
---

## The short answer

- **SLI (Service Level Indicator)** — a metric that reflects user experience. For example, the share of successful requests or the share of requests faster than a threshold.
- **SLO (Service Level Objective)** — a target for an SLI over a period. For example, 99.9% successful requests over 30 days.
- **SLA (Service Level Agreement)** — a contract with a customer that has consequences for breaches. An SLA is usually looser than the SLO so the team has a margin.
- **Error budget** — `100% − SLO`. With a 99.9% SLO, the budget is 0.1% failed requests, or roughly 43 minutes of downtime per 30 days.

The point is to agree on **how much reliability is enough** and stop arguing on gut feeling.

## How to choose good SLIs

A good SLI measures what **the user feels**, not the state of a server. CPU usage is a poor SLI: it can be high while users are perfectly happy.

Typical SLIs by service type:

| Service type | SLI |
|---|---|
| API, website | Availability (share of non-5xx responses), latency (share of requests under a threshold) |
| Queue, background jobs | Data freshness, share of jobs processed on time |
| Storage | Durability, share of successful reads |

Practical tips:

- Express an SLI as a **ratio of good events to all events**: `good / total`.
- Measure as close to the user as possible: the load balancer or synthetic checks beat application logs.
- Start with **2–3 SLIs** per critical user journey: login, checkout, search.
- For latency use **percentiles** (p95, p99), not averages.

## How to set a realistic SLO

1. **Look at history.** If the service consistently holds a certain level, start with a target slightly below the current reality.
2. **Never set 100%.** It is unreachable and blocks every change. Each extra "nine" sharply increases cost.
3. **Account for dependencies.** Your service cannot be more reliable than the cloud or database underneath it without redundancy.
4. **Pick a window.** A rolling 28- or 30-day window is a common choice.
5. **Review** SLOs quarterly together with product.

## How to use the error budget

The error budget turns reliability into **a resource you can spend**:

- Budget left — the team ships features and experiments freely.
- Budget running low — priority shifts to stability: fixes, tests, safer deployments.
- Budget exhausted — risky releases are frozen until it recovers.

Write this down as an **error budget policy** — a short document agreed with the business in advance. Then "slow down releases" becomes a rule, not the outcome of a fight.

A useful practice is alerting on **burn rate**: if the budget is being consumed many times faster than normal, act now, even if the SLO is not formally breached yet.

## Common mistakes

- **Too many SLOs.** Nobody tracks twenty targets.
- **SLIs based on internal metrics** instead of user experience.
- **SLOs without a policy.** If burning the budget changes nothing, it is just a chart.
- **Same targets for everything.** An admin panel and checkout need different reliability.

## FAQ

### How is an SLO different from an SLA?

An SLO is the team's internal target, while an SLA is an external commitment to a customer with penalties. SLAs are set below SLOs so missing the internal target does not immediately breach the contract.

### What if the error budget runs out early in the month?

Follow the pre-agreed policy: pause risky releases, analyse the causes of failures and invest in reliability. Once the budget recovers, return to the normal pace.

### Does a small project need SLOs?

Yes, in a simplified form: one or two SLIs for the main user flow and a clear target. It helps you set meaningful alerts and explain to the business how much reliability it actually needs.
