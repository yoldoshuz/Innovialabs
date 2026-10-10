---
title: What Is an SLA in a Software Support Contract
description: What an SLA covers: response and resolution times, severity levels, uptime and penalties, plus the contract wording worth looking for.
summary: An SLA is the part of a contract that sets measurable commitments: how fast the contractor responds to issues, how fast it fixes them and what availability it guarantees. Without numbers and definitions it is an empty promise.
---

## The short answer

An **SLA (Service Level Agreement)** is a section of a contract, or a separate appendix, where the contractor commits to *measurable* support obligations: how fast it responds, how fast it fixes, how much of the time the system must be up and what happens when promises are broken.

A good SLA answers four questions:

- **What** counts as an incident and how severe it is.
- **When** the contractor must respond and resolve.
- **How** performance is measured.
- **What** happens on a breach.

## Response time vs resolution time

These are different metrics and often get mixed up.

- **Response time** is how long it takes from your request until a specialist confirms they are working on it. An automated reply usually does not count.
- **Resolution time** is how long it takes to fix the problem or put a temporary workaround in place.

A promise like "we reply within 15 minutes" with no resolution target guarantees little: you can reply fast and fix for a week.

## Severity levels

Deadlines depend on how serious the issue is. Three or four levels are common:

| Level | What it means | Example |
|---|---|---|
| Critical | System is down or a key process has stopped | Orders or payments are not accepted |
| High | An important function fails with no workaround | Accounting reports are not generated |
| Medium | There is a problem, but work can continue | One section loads slowly |
| Low | Minor issues and requests | A typo in the interface |

It matters **who assigns the level**. Ideally the criteria are written into the contract and disputes follow a clear rule rather than one side's discretion.

## Uptime: system availability

**Uptime** is the share of time the system is working. An SLA states it as a percentage over a period, usually a month. More "nines" means less allowed downtime and more expensive infrastructure and on-call duty.

What to check:

- **How availability is calculated** and who measures it: external monitoring or the contractor's own logs.
- **What is excluded**: planned maintenance, hosting or third-party outages, issues on the client's side.
- **Maintenance windows**: when they happen and how much notice you get.

## Support hours

Clarify when the deadlines apply: 24/7, business hours only, or "critical 24/7, everything else in business hours". And in which time zone. A "4 hours" target on business hours may mean a reply only the next morning.

## Penalties and credits

Usually these are **service credits**: a discount on the next support period for each breach or for missed uptime. Check:

- whether there is a **cap** on compensation;
- whether the client must **claim** the breach itself, and by when;
- what counts as a **repeated breach** and whether it allows termination.

## Sample wording to look for

Good wording is specific:

- "Response time is measured from registration of the request in the ticketing system until a responsible specialist is assigned."
- "For critical incidents, support is provided 24/7, including weekends and public holidays."
- "Availability is calculated from external monitoring data with checks at least once per minute."
- "The Contractor notifies the Client of planned maintenance no later than [N] business days in advance."

Warning signs are vague phrases: "within a reasonable time", "where possible", "promptly", "will use best efforts".

## Common mistakes

- Accepting an SLA without defined severity levels.
- Not listing request channels: where to write at night if everything is down.
- No reporting, such as a monthly report on tickets and availability.
- Demanding maximum targets for a non-critical system and overpaying.

## FAQ

### How is an SLA different from a regular support contract?

A regular contract says the contractor supports the system. An SLA adds measurable deadlines, targets and consequences for missing them, which is something you can actually verify.

### Which uptime should I choose?

Base it on what downtime costs your business. If an hour offline is expensive, high targets are justified. For an internal, non-critical system it makes sense to accept softer terms and save money.

### Does an SLA cover new feature development?

Usually not. An SLA covers incidents and stability. New features and changes are typically handled separately, on an hourly basis or as a separate order.
