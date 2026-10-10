---
title: Incident Response and Blameless Postmortems: A Practical Guide
description: Incident roles and communication during an outage, a postmortem template, finding root causes and tracking action items to completion without blame.
summary: During an incident, appoint a commander and restore service first; afterwards, run a blameless review, find systemic causes and drive every action item to completion.
---

## The essentials

A good incident process has two parts:

1. **During the outage** — restore service fast rather than looking for the perfect fix. Clear roles and a single communication channel help.
2. **After the outage** — a **blameless postmortem**: a review that looks for weaknesses in systems and processes, not for a person to blame.

Why blameless? When mistakes are punished, people hide details, and the team loses its most valuable information about how the system really behaves.

## Roles during an incident

Even in a small team, split the roles, or everyone fixes the same thing and nobody talks to the business.

| Role | Responsibility |
|---|---|
| **Incident Commander** | Coordinates, makes decisions, does not fix things personally |
| **Ops / technical lead** | Diagnoses and applies fixes |
| **Communications** | Updates status for customers, support and management |
| **Scribe** | Keeps the timeline: what was noticed, what was done, when |

In a small team one person can hold several roles, but the Incident Commander must be named explicitly.

## Communication during an outage

- Open a **dedicated channel** for the incident and keep the discussion there.
- Announce the **severity level** and who is in command.
- Post **regular updates** at predictable intervals, even when there is no news.
- Write external status in plain language: what is broken, who is affected, when the next update comes.
- The priority is **mitigation**: roll back the release, shift traffic, disable a feature. The root cause comes later.

## Postmortem template

Hold the review while details are fresh, usually within a few working days.

```markdown
## Summary
What happened, who was affected, how long it lasted.

## Impact
Affected users, features, breached SLOs.

## Timeline
Time — event — who did what.

## Root causes and contributing factors

## What went well

## What went wrong and where we got lucky

## Action items
Task — owner — due date — ticket link.
```

## How to find root causes

- **5 Whys** — keep asking "why?" until you reach a process or a system. Stopping at "the engineer made a mistake" is a sign of a weak review.
- Look for **several contributing factors**: complex outages rarely have a single cause.
- Ask "**how did the system allow this to happen?**" instead of "who did this?".
- Separate the **trigger** (what started the outage) from the **causes** (why it was possible and why it was not caught earlier).

## How to drive action items to completion

A postmortem without completed tasks is just text. To keep tasks from getting lost:

- Every task has **one owner and a due date**.
- Tasks go **into your regular tracker**, not just the document.
- Be specific: not "improve monitoring" but "add an alert on payment error rate".
- Split tasks into **quick fixes** (this week) and **systemic** ones (need planning).
- Review open postmortem tasks regularly in team meetings.

## Common mistakes

- Looking for a culprit instead of causes.
- Reviewing only major outages — small incidents are cheaper to analyse and teach the same lessons.
- Too many action items that nobody has time to finish.
- A postmortem nobody reads: share the findings with the whole team.

## FAQ

### Which incidents need a postmortem?

At least those that affected users or breached an SLO, plus near misses where an outage was narrowly avoided. Write the criteria down in advance so you do not decide from scratch every time.

### What does blameless mean if a person really made the mistake?

It means the person is not punished and the question becomes broader: why did the process let the mistake reach production, and why did checks not catch it? Fixing the process prevents repeats better than punishment.

### Who should write the postmortem?

Usually someone involved in the incident, often the Incident Commander, with input from everyone who worked on it. The final review happens in a meeting where anyone can add to the timeline.
