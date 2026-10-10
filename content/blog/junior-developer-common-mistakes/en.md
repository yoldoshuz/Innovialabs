---
title: Common Junior Developer Mistakes and How to Avoid Them
description: Frequent first-job mistakes for developers: hiding blockers, fear of asking, overengineering, ignoring feedback, plus practical fixes for each one.
summary: Most junior developer mistakes are about communication rather than code: ask in time, report blockers early, keep solutions simple and treat feedback as a way to grow faster.
---
## The essentials in a minute

Nobody expects a junior developer to know everything. They expect you to **learn quickly, report progress predictably and not hide problems**. Nearly all typical first-job mistakes are about communication and habits, not syntax. Here are the most common ones and what to do instead.

## 1. Not asking for help

A newcomer is afraid of looking incompetent and spends a day on a problem a colleague could unblock in ten minutes.

**How to fix it:**

- Set yourself a **timebox**: for example, if there is no progress after an hour, you ask.
- Before asking, note **what you have already tried**.
- Phrase the question so it can be answered without a call:

```text
Task: add a date filter to the report.
Problem: the API returns 400 when I send the date.
Tried: ISO format, timestamp, read the endpoint docs.
Question: which format does the backend expect, or where is it documented?
```

## 2. Staying silent about blockers

The task is stuck on access, an unclear requirement or someone else's bug, yet the stand-up update is "all good, working on it".

**How to fix it:**

- Raise a blocker **as soon as it appears**, not on the deadline day.
- Say what is needed to unblock it and from whom.
- If a deadline is at risk, warn early and offer options: simplify the task, move the date, split it into parts.

## 3. Overengineering

Wanting to show your level leads to "future-proof" abstractions, unnecessary patterns and home-made mini frameworks for a simple task.

**How to fix it:**

- Solve the **current task**, not hypothetical future ones.
- Follow the approaches the project already uses, even if you know a "better" one — propose it separately.
- Ask yourself: would a colleague understand this code without an explanation?

## 4. Ignoring feedback or arguing with all of it

Review comments feel like personal criticism and are either silently ignored or trigger long debates.

**How to fix it:**

- Separate yourself from your code: a comment is about the solution, not about you.
- If you disagree, **ask for the reasoning** instead of defending.
- Write down recurring remarks and check your code against that list before the next PR.

## 5. Huge pull requests

A week of work in a single PR is hard to review and sits for a long time.

**How to fix it:** split work into small, logical PRs and open a draft early to get early feedback.

## 6. Starting before understanding the task

The code is written, and then it turns out something else was needed.

**How to fix it:** restate the task in your own words to whoever set it and clarify the acceptance criteria and edge cases **before** you start.

## 7. Skipping self-review

The PR is submitted without a local check, tests have not been run and debug output is still in the code.

**How to fix it:** keep a personal pre-submit checklist:

- the task meets the acceptance criteria;
- main and edge cases are checked;
- tests and the linter pass;
- no commented-out or debug code;
- the PR description explains what changed and why.

## Signs you are growing

- Your questions get more specific and blockers become rarer.
- Your estimates get closer to reality.
- Review comments shift from "how to do it right" to "what would be better".
- You are trusted with tasks that come with fewer details.

## FAQ

### How often can a junior ask questions without annoying the team?

It is not the number of questions that annoys people but unprepared ones. If you show what you have tried and batch small questions together, teams are usually happy to help.

### What should I do if I am going to miss a deadline?

Tell the team as early as possible, explain why and suggest options. An early signal gives the team time to adjust; a late one creates a problem for everyone.

### Is it normal not to understand most of the codebase in the first months?

Yes. Focus on the modules you work with, ask about the architecture and write down what you learn. Understanding of the system builds up gradually.
