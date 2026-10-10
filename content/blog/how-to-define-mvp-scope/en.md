---
title: How to Define MVP Scope Using Feature Prioritization
description: How to use MoSCoW and user journey mapping to cut a product idea down to a first release you can launch quickly and test with real users.
summary: Map one key user journey from problem to result, sort features with MoSCoW and keep only the Must items in the MVP — everything without which that journey breaks.
---

## The short answer: what belongs in an MVP

An **MVP** is the minimal version of a product that lets you test your main hypothesis with real users. It contains only what a user needs to **complete the core scenario from start to finish**. Everything else goes into the second and later releases.

The most reliable way to find that line is to combine two tools: **user journey mapping** and **MoSCoW prioritization**.

## Step 1. State the hypothesis

Before choosing features, answer in one sentence: *who* your user is, *what problem* they solve and *what result* they should get. For example: "A small cafe owner wants to take orders through Telegram without phone calls."

If the hypothesis does not fit into one sentence, the MVP will end up vague.

## Step 2. Map the user journey

A **user journey map** is the sequence of steps a person goes through to reach the result. For the cafe example:

1. The customer opens the bot.
2. Sees the menu.
3. Picks dishes and quantities.
4. Places the order and enters an address.
5. The owner receives a notification.
6. The customer learns the order is accepted.

Under each step, list the features it needs. This shows you the **product skeleton** — the minimal set without which the chain breaks.

## Step 3. Sort features with MoSCoW

**MoSCoW** splits every feature into four groups:

| Group | Meaning | Cafe example |
|---|---|---|
| **Must have** | The core journey fails without it | Menu, cart, checkout, owner notification |
| **Should have** | Important, but you can live without it for now | Online payment, order statuses |
| **Could have** | Nice, but not critical | Loyalty program, reviews |
| **Won't have (now)** | Deliberately left out of this release | Mobile app, analytics |

The rule is simple: **only Must goes into the MVP**. If the Must list is too long, test each item with one question: "Can the user still get the result without it, even if it is less convenient?" If yes, it is a Should.

## Step 4. Look for manual workarounds

Many features can be replaced with manual work at the start:

- instead of online payment — pay on delivery;
- instead of an admin panel — a spreadsheet or chat notifications;
- instead of automated messaging — messages sent by hand;
- instead of complex search — a short list of categories.

These are not hacks but a way to test demand faster. Automate what people actually use.

## Step 5. Decide how to measure success

An MVP without a metric is just a first version. Before launch, decide **what signal** confirms the hypothesis: how many people complete the journey, whether they come back, whether they are willing to pay. Without it you cannot tell what to do next.

## Common mistakes

- **Too many Musts.** Every extra feature delays launch and blurs the test.
- **No Won't list.** Without an explicit "not doing" list, features quietly creep back into the plan.
- **An MVP without quality.** Minimal does not mean broken: the core journey must work reliably.
- **Prioritizing by team opinion.** Rely on the user journey, not on what is fun to build.

## FAQ

### How is an MVP different from a prototype?

A prototype shows what the product will look like and usually does not work with real data. An MVP is a working product that real users use to solve a real task.

### Can an MVP target several audiences at once?

Better not. Each audience adds its own scenarios and features. Start with one, test the hypothesis, and expand only after that.

### What happens to Should and Could features after launch?

Review them based on the MVP results. Some will turn out unnecessary, and requests you did not know about before launch will move to the top.
