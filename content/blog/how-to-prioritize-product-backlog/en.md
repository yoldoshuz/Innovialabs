---
title: How to Prioritize a Product Backlog by Business Value
description: RICE, value vs effort and the Kano model with a clear worked example: how to rank features and decide what your team should build first.
summary: Score every item by business value and effort, run RICE on the top candidates, check with the Kano model that basic expectations are covered, then build what delivers the most value per unit of effort.
---
## The short answer

Backlog prioritization is not a debate about whose idea is better. It is comparing items on one scale. The combination that works best:

- **Value vs Effort** to quickly sort the whole list into four groups.
- **RICE** to score the 10-20 candidates that pass the first filter.
- **The Kano model** to make sure you have not skipped what users take for granted.

Before using any method, define **the goal for the next period**: revenue growth, retention, fewer support tickets. Without a goal, "value" becomes a matter of taste.

## Value vs Effort: the first filter

Give each item two scores from 1 to 5: value toward the goal and effort for the team. You get four quadrants:

| Quadrant | Value | Effort | Action |
|---|---|---|---|
| Quick wins | high | low | do now |
| Big bets | high | high | plan and split into stages |
| Fill-ins | low | low | do when there is a gap |
| Money pits | low | high | remove from the backlog |

It is rough, but it takes an hour and cuts the noise immediately.

## RICE: a more precise score

**RICE = Reach × Impact × Confidence / Effort**

- **Reach** — how many users the change affects in a period, such as a quarter.
- **Impact** — effect per user: 3 massive, 2 high, 1 medium, 0.5 low, 0.25 minimal.
- **Confidence** — how sure you are about the estimates: 100%, 80% or 50%. With no data, be honest and use 50%.
- **Effort** — total team person-months.

## Worked example: an online store

The quarterly goal is more repeat orders. The numbers below are illustrative, only to show the calculation.

| Feature | Reach | Impact | Confidence | Effort | RICE |
|---|---|---|---|---|---|
| One-click reorder | 4000 | 2 | 80% | 1 | 6400 |
| Loyalty program | 6000 | 2 | 50% | 4 | 1500 |
| Dark mode | 8000 | 0.25 | 80% | 1 | 1600 |
| "Back in stock" alerts | 2000 | 1 | 80% | 0.5 | 3200 |

The order: reorder first, then alerts, then dark mode and loyalty. Note that the loyalty program may be strong, but low confidence and high effort push it down. The right move is not to drop it, but to run a cheap experiment and raise its Confidence.

## Kano model: what users take for granted

Kano groups features by how they affect satisfaction:

- **Must-be** — missing them frustrates users, having them does not delight. Example: payments that just work.
- **Performance** — the better, the happier: delivery speed, search quality.
- **Attractive** — unexpected, but memorable.
- **Indifferent** — users do not care.

A practical rule: cover must-be features first even if their RICE is modest, then performance features, and add one or two attractive ones. A short survey helps find the category, with two questions: "How would you feel if this feature existed?" and "If it did not?"

## Making it part of the routine

1. Update scores every sprint or month — the data changes.
2. Effort estimates come from the development team, not the product owner.
3. Record what each Reach and Impact estimate is based on: analytics, interviews, support tickets.
4. Keep a fixed quota for tech debt and bugs, or they will lose to any feature.
5. Share the table with stakeholders — it settles many arguments.

## Common mistakes

- **Prioritizing by volume.** The loudest stakeholder is not the most valuable task.
- **Inflated confidence.** 100% confidence without data distorts the whole ranking.
- **Items that are too big.** A six-month epic cannot be estimated honestly — split it.
- **Method for its own sake.** The formula supports the conversation; people still make the final call.

## FAQ

### Which method should a small team use?

Start with Value vs Effort: it needs no analytics and takes little time. Add RICE when you have many candidates and need a well-argued choice between them.

### How do you estimate Reach before the product exists?

Use the size of the target segment, competitor data or interview results, and keep Confidence at 50% or lower. After launch, replace the estimates with real data.

### Should tech debt be scored with RICE?

It is better to reserve a fixed share of capacity for it every sprint. Its value shows up indirectly, in speed and stability, so in the formula it almost always loses.
