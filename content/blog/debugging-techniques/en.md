---
title: How to Debug Code: A Systematic Step-by-Step Approach
description: A repeatable debugging process — reproduce, isolate, hypothesize, verify — and how to use breakpoints, logs and rubber-duck debugging effectively.
summary: Debugging is not guessing but a loop: reproduce the bug reliably, narrow down where it happens, form one hypothesis, test it against facts, then lock in the fix with a test.
---

## The core rule of debugging

You find bugs faster when you **follow a process** instead of changing code at random. A working four-step loop:

1. **Reproduce** — make the error appear reliably.
2. **Isolate** — narrow down where it happens.
3. **Hypothesize** — name one specific cause.
4. **Verify** — confirm or refute it with facts, not feelings.

If the hypothesis fails, go back to step 2 with new data.

## Step 1. Reproduce

Without reproduction you cannot tell whether you fixed anything. Collect:

- exact steps, input data and environment (browser, OS, app version);
- the full error message and **stack trace** — read it until you reach the first line of your own code;
- what you expected and what actually happened.

The goal is a **minimal example**: as few steps and as little data as possible while the bug still occurs. Ideally, turn it into an automated test that currently fails.

## Step 2. Isolate

Shrink the search area:

- **Binary search through code**: add a check halfway along the data path. Value already wrong? Look earlier. Correct? Look later.
- **Binary search through history**: if it used to work, `git bisect` finds the commit that broke it.

```bash
git bisect start
git bisect bad            # current version is broken
git bisect good <hash>    # this version worked
# test each suggested version and mark it good/bad
git bisect reset
```

- **Remove things**: disable caching, extensions, part of the data, third-party services — until the bug disappears. The last thing removed is your suspect.

## Step 3. Hypothesize

Put it in one sentence: "The price arrives as a string, so `+` concatenates instead of adding." A good hypothesis is **testable** and tells you which observation would disprove it. Write down the hypotheses you have checked — it saves time if debugging drags on.

## Step 4. Verify with tools

### Breakpoints

A debugger in your IDE or browser pauses the program on a chosen line, showing every variable at that moment.

- **Conditional breakpoints** fire only when a condition holds, such as `order.id === 42` — invaluable inside loops.
- **Step over / step into / step out** — walk the code line by line, entering functions only when needed.
- The **call stack** shows how the program got there.

### Watch expressions

Add expressions like `items.length` or `user?.role` to the watch panel: they are re-evaluated at each step, so you see the exact moment a value goes wrong.

### Logging

Logs are essential where you cannot attach a debugger: production, async processes, timing issues.

- Log **context**: IDs, input values, which branch was taken.
- Use levels: `debug`, `info`, `warn`, `error`.
- Never log passwords, tokens or personal data.
- Remove temporary `console.log` and `print` calls after the fix.

### Rubber-duck debugging

Explain the code line by line — to a colleague, a rubber duck or a text note. By saying what "should" happen, you often spot the place where reality differs from expectation yourself.

## After the fix

- Confirm the original scenario no longer reproduces.
- Add a **regression test** so the bug cannot come back.
- Look for **similar spots**: the same mistake may have been copied.
- Fix the cause, not the symptom: a `try/catch` that just swallows the error is not a fix.

## Common mistakes

- Changing several things at once — you will not know what helped.
- Trusting assumptions instead of checking values.
- Ignoring the first error message and looking only at the last.
- Debugging for hours without a break: a short pause often reveals the obvious.

## FAQ

### Which is better: a debugger or logs?

They complement each other. A debugger is handy locally when the bug reproduces; logs work in production and for async or rare errors.

### What if the bug will not reproduce?

Gather more data: add logging around the suspicious area, compare environments and inputs. Flaky bugs are often caused by race conditions, caching or timing.

### When should I ask for help?

When you have tested several hypotheses and have no new ideas. Describe the reproduction steps and what you already checked — often just writing the question reveals the answer.
