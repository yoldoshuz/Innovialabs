---
title: Common Mistakes in Technical Specifications and How to Fix Them
description: Vague wording, missing edge cases and no acceptance criteria: the most common spec mistakes, each with a corrected before-and-after example.
summary: Most spec problems come down to one thing — a requirement that cannot be verified. The fix is concrete wording, described edge cases and acceptance criteria for every feature.
---
## The core mistake: requirements nobody can verify

A good technical specification answers one question: how will we know this is done? Without an answer, the client and the developer will picture different results. Almost every mistake below is a variation of this problem. Each comes with a "before" and "after" example.

## 1. Vague wording

Words like "user-friendly", "fast", "modern" or "intuitive" do not describe system behavior.

- **Before:** "The site must load fast."
- **After:** "The home page shows its main content quickly on mobile connections; Core Web Vitals stay in the green zone according to PageSpeed Insights."

Rule: replace every adjective with a measurable condition or a concrete user action.

## 2. Missing edge cases

The spec only describes the happy path, where everything goes to plan.

- **Before:** "The user pays for the order by card."
- **After:** "The user pays by card. If the payment is declined, show the reason and offer to retry. If the user closes the page during payment, the order stays 'Awaiting payment' and is cancelled after a set time. If the payment provider does not respond, the order is not confirmed until a status arrives."

Ask of every feature: what if the data is missing, too large, invalid, the network drops, or the action is repeated twice?

## 3. No acceptance criteria

Without them, handover turns into an argument.

- **Before:** "Implement sign-up."
- **After:**
  - the user enters a phone number and receives a confirmation code;
  - a wrong code shows an error, and a new code can be requested after a set interval;
  - signing up twice with the same number is impossible, the user is offered to log in;
  - after successful sign-up the user lands in their account.

A handy format is "Given — When — Then". Each item can be checked manually or by a test.

## 4. A solution instead of a problem

The client writes "build it with technology X" or "add a button in the top right" without explaining why.

- **Before:** "Add Excel export."
- **After:** "Once a month the accountant needs a list of paid orders for a period to reconcile. The format is a table that opens in Excel."

When the goal is clear, the developer can suggest a simpler solution.

## 5. No roles or permissions

"The user can edit an order" — which user? Describe roles (customer, manager, admin) and a table of who sees and changes what.

| Action | Customer | Manager | Admin |
|---|---|---|---|
| See own orders | yes | — | yes |
| Change order status | no | yes | yes |
| Delete an order | no | no | yes |

## 6. Forgotten non-functional requirements

Beyond features, specify expected load, supported browsers and devices, interface languages, backups, personal data storage rules, and who maintains the system after launch.

## 7. Everything is equally important

If all 80 items are mandatory, timelines and budget will not add up. Split requirements into "must have for launch", "nice to have" and "later". This makes the timeline discussion honest.

## Quick checklist before sending a spec

- every feature has a goal and acceptance criteria;
- errors and edge cases are described;
- roles and permissions are listed;
- non-functional requirements are stated;
- priorities are set;
- no words without measurable meaning.

## FAQ

### Does the client have to write the spec alone?

No. It is enough to describe goals, users and key scenarios. A detailed spec is often written together with the developer during the analysis phase, which is faster and more accurate.

### How detailed should a spec be?

Detailed enough that two independent teams would understand the same scope and the same way to verify it. Implementation details are usually unnecessary.

### Can the spec change during development?

Yes, through an agreed process: the change is recorded in writing, its impact on timeline and budget is estimated, and then it is accepted or postponed.
