---
title: How to Measure a Development Team's Productivity
description: Which metrics reflect the real value a development team delivers — lead time, release frequency, outcomes — and why lines of code and hours mislead.
summary: Measure a team by how quickly and reliably value reaches users: lead time, deployment frequency, change failure rate, time to restore and business outcomes. Lines of code and hours worked show activity, not results.
---

## What to actually measure

Development productivity is not the amount of work done, but **how fast and reliably value is delivered**. A good set of metrics answers three questions:

1. How quickly does a change travel from idea to user?
2. How stable is what has been shipped?
3. Does what was shipped produce the intended business result?

Metrics measure **the team and the process**, not individual developers.

## Delivery metrics (DORA)

Four metrics from the DORA research have become the standard for assessing delivery:

| Metric | What it shows |
|---|---|
| **Lead time for changes** | Time from commit to the change running in production |
| **Deployment frequency** | How often the team ships changes |
| **Change failure rate** | Share of releases that cause an incident or rollback |
| **Time to restore** | How quickly the service recovers after a failure |

The first two are about speed, the last two about stability. Read them together: frequent releases with frequent failures are not success.

Most of this data can be collected automatically from Git, CI/CD and your incident tracker, with no manual reporting.

## Outcome metrics

Delivery speed is useless if the wrong thing ships. So alongside process metrics you track **outcome metrics** tied to product goals:

- change in conversion, retention or activation after a release;
- fewer support requests about a specific problem;
- time users spend completing a key task;
- whether product goals set in advance were met.

These depend on more than engineering, but they are what shows the team's work matters.

## Why lines of code and hours mislead

**Lines of code.** A good solution is often shorter than a bad one. Deleting unnecessary code is valuable work that lowers the metric. Reward volume and you get bloated code.

**Hours.** Time at the keyboard shows presence, not results. A hard problem may need a day of thinking and ten lines of changes.

**Ticket counts or story points.** Estimates are subjective and inflate easily once they become a target. They are useful for planning inside a team, not for comparing teams.

The general principle is **Goodhart's law**: when a measure becomes a target, it ceases to be a good measure.

## How to introduce measurement

1. **Start with a goal.** What do you want to improve: speed, stability, predictability?
2. **Pick a few metrics.** For example, two DORA metrics and one outcome metric.
3. **Automate collection** from the tools you already use.
4. **Record a baseline** and watch the trend, not absolute numbers.
5. **Discuss with the team** in retrospectives: what slows the process down and how to remove it.
6. **Add a qualitative signal.** Short team surveys about what gets in the way often reveal causes the numbers do not show.

## Common mistakes

- Using metrics to rate or rank individuals.
- Comparing teams with different products and contexts on the same numbers.
- Measuring only speed and ignoring stability and outcomes.
- Collecting dozens of metrics nobody analyses.

## FAQ

### Can you measure an individual developer's productivity?

There are no reliable quantitative metrics for it: development is teamwork, and much of a person's contribution is invisible in numbers (reviews, helping colleagues, architecture decisions). Individual work is better assessed through feedback and regular one-on-ones.

### Do DORA metrics work for a small team?

Yes. They are easy to collect even on a small project and quickly reveal bottlenecks: slow reviews, manual deployment, unstable releases.

### How do I know a contractor is productive?

Look at how regularly working releases ship, how often work comes back because of bugs, how fast failures are fixed and whether agreed goals are met, rather than at timesheet reports.
