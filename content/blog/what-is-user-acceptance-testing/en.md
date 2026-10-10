---
title: What Is User Acceptance Testing (UAT) in Software Projects
description: What UAT is, who performs it, how it differs from QA, how to prepare test scenarios and how to record a proper sign-off before a product goes live.
summary: UAT is the final check of a product by the client and real users on real scenarios, after which the result is formally accepted or sent back for fixes.
---

## UAT in plain words

**User Acceptance Testing (UAT)** is the client-side check of a product before launch. Its goal is to confirm that the system solves the business tasks as agreed and is practical to use in real work.

UAT happens at the very end: features are already built and tested by the development team. The outcome of UAT is an **acceptance decision**: accepted, accepted with remarks, or returned for rework.

## Who performs UAT

Acceptance is done by **the client side**, not the developers:

- the **product owner** or the responsible manager;
- **future users**: operators, accountants, sales managers, warehouse staff;
- sometimes **domain experts** who know the rules and exceptions of the process.

The development team prepares the environment, answers questions and fixes what is found, but does not sign off on the client's behalf.

## How UAT differs from QA

| | QA testing | UAT |
|---|---|---|
| Who tests | The team's testers | Client and users |
| When | During development | Before launch |
| What they look for | Technical errors, bugs | Fit with business tasks |
| Basis | Requirements and spec | Real work scenarios |
| Result | Bug reports | Acceptance decision |

QA answers "does it work without errors?", while UAT answers "is this what we need?". A product can be bug-free and still fail acceptance if it does not fit the real process.

## How to prepare for UAT

1. **Define acceptance criteria** early, during requirements. Ideally each user story already has them.
2. **Pick the participants** and give them dedicated time. UAT done "on the side" tends to be shallow.
3. **Prepare the environment**: a separate staging setup as close to production as possible, with realistic test data.
4. **Write scenarios** based on real work tasks.
5. **Agree on how to report issues**: where to log them and how to rate severity.
6. **Fix the timeline**: how long testing lasts and how much time is reserved for fixes.

## How to write test scenarios

A scenario is a step-by-step description of a real user task with an expected result. Example for an online store:

- **Scenario:** placing an order paid by card.
- **Steps:** find a product, add it to the cart, enter the address, choose payment, pay.
- **Expected result:** the order appears in the admin panel as "Paid" and the shopper receives a notification.
- **Actual result:** filled in by the tester.
- **Status:** passed / failed.

Cover not only the happy path but also typical deviations: order cancellation, refunds, invalid input.

## How to record issues and sign-off

For every issue, record:

- what you did (steps);
- what you expected and what you got;
- a screenshot or screen recording;
- **severity**: blocks work, gets in the way, cosmetic.

Separate **defects** (does not work as agreed) from **new wishes** (works, but you would like it differently). Wishes are usually logged separately and do not block acceptance.

UAT ends with a **signed acceptance certificate** or written confirmation. It states what was tested, which remarks remain open, and when they will be resolved.

## Common mistakes

- Starting UAT without acceptance criteria, which turns it into a debate about taste.
- Testing on empty data instead of realistic data.
- Involving only the manager rather than the people who will use the system daily.
- Mixing bugs and new ideas in one list.
- Not recording the result in writing.

## FAQ

### How long does UAT take?

It depends on the product's scope, the number of scenarios and participants' availability. What matters more is agreeing on a timeframe in advance and not letting acceptance drag on.

### Can UAT be skipped if QA has tested everything?

It is not recommended. QA checks conformance to requirements, but only users can confirm the system fits their real work.

### What if new requirements come up during UAT?

Log them separately, estimate them and plan them as the next stage. The current version is accepted against the criteria that were originally agreed.
