---
title: "DRY, KISS and YAGNI: Programming Principles Explained"
description: What DRY, KISS and YAGNI mean in code, why blindly applying DRY creates wrong abstractions, and how the three principles balance each other out.
summary: DRY means one piece of knowledge in one place, KISS means the simplest working solution, YAGNI means not building what you do not need yet; apply them together, not alone.
---

## The three principles in brief

- **DRY (Don't Repeat Yourself)** — every piece of knowledge about the system should live in one place. It is about rules and decisions, not matching lines of code.
- **KISS (Keep It Simple, Stupid)** — choose the simplest solution that works. Simple code is easier to read, test and change.
- **YAGNI (You Aren't Gonna Need It)** — do not build features "for the future" until they are actually needed.

All three fight the same enemy — unnecessary complexity — from different angles.

## DRY by example

The rule "free shipping above a certain total" appears in the cart, the customer email and the admin panel. If the threshold is hard-coded in three places, someone will forget one of them when the rule changes.

```js
// one place for the rule
export const FREE_SHIPPING_THRESHOLD = 500_000;

export function hasFreeShipping(total) {
  return total >= FREE_SHIPPING_THRESHOLD;
}
```

Now the cart, the email and the admin panel all call one function.

## When DRY hurts

The danger is merging code that **only looks alike**. Two validation functions — for sign-up and for checkout — check the same fields today. You create a shared `validateUser()`. A month later checkout needs an address and sign-up does not. A flag appears. Then another. The function grows conditions, and every edit risks breaking both flows.

This is called a **wrong abstraction**. Signs:

- the shared function keeps gaining boolean parameters;
- inside there are many `if`s depending on who is calling;
- a change for one caller requires checking all the others.

A practical rule: tolerate duplication until you see a third similar case and understand it really is the same knowledge. If an abstraction is already wrong, do not be afraid to inline the copies back and split the code again.

## KISS in practice

- A plain loop beats a chain of five clever operations if your team reads it faster.
- Add a separate service, queue or cache when you have a concrete problem, not "because big companies do it".
- A clear variable name often replaces a comment.

Simple is not primitive. A simple solution may take more thinking, but it leaves fewer moving parts.

## YAGNI in practice

Typical violations:

- a universal plugin system for an app that has zero plugins;
- support for several databases when you use one;
- settings for parameters nobody has ever changed.

Each of these "just in case" pieces costs time now and gets in the way later: it has to be maintained, tested and worked around. When the need actually appears, you will know the real requirements and build it more precisely.

YAGNI does not cancel good structure: clean, tested code is easy to extend when the time comes.

## How the principles balance each other

| Situation | What the principle suggests |
|---|---|
| One business rule in three places | DRY: move it to one place |
| A shared function overgrown with flags | KISS: split it back into simple ones |
| Tempted by a "future-proof" abstraction | YAGNI: wait for a real need |
| A simple solution duplicates code | Check whether it is the same knowledge |

When DRY pushes toward a complex abstraction, KISS and YAGNI hold it back. When KISS turns into copy-pasting one rule, DRY reminds you of the cost of things drifting out of sync.

## FAQ

### Is any duplication a DRY violation?

No. DRY is about knowledge, not text. Two identical fragments that change for different reasons are better kept separate.

### Doesn't YAGNI contradict thoughtful architecture?

No. YAGNI forbids building unnecessary features, not thinking ahead. Good structure and tests are exactly what let you add the needed parts later without pain.

### Where do I start if everything in the project is complicated?

Find the area that changes most often and simplify it: remove unused options, split overloaded functions, and gather duplicated rules into one place.
