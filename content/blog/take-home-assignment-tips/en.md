---
title: Take-Home Test Assignments: How to Complete Them Well
description: How to read take-home assignment requirements, limit your time, show code quality, write a clear README and know when it is reasonable to decline.
summary: Read the requirements carefully and ask questions, cap your time and do the core well, show clean code with tests and a clear README, and politely decline assignments that are oversized or look like unpaid work.
---
## The short answer: what reviewers expect

A take-home assignment shows how you work **without time pressure in the room**: whether you understand requirements, set priorities and bring a task to a clean result. Reviewers look not at the number of features but at **the quality of the core**, the clarity of your code and how you explain your decisions.

## 1. Read the requirements twice

- Separate the **required** items from the **nice-to-haves**.
- Note the constraints: language, framework, submission format, deadline.
- If something is unclear, **ask**. That is normal professional practice, not a weakness. If nobody answers, choose a reasonable assumption and write it down in the README.

## 2. Scope your time

A take-home task can expand forever. Decide in advance how much time you are willing to invest and plan:

1. A minimal working version covering all required items.
2. Tests for the key logic.
3. The README.
4. Improvements and extras, only if time remains.

If the assignment suggests a time budget, respect it. Doing more than asked but delivering late usually scores worse.

## 3. Code quality signals

Reviewers form an impression within minutes. What helps:

- **A clear project structure** and meaningful names.
- **Separation of concerns**: business logic apart from I/O and the framework.
- **Error handling** and input validation.
- **Tests** for the main scenarios and edge cases.
- **A tidy Git history**: small commits with clear messages.
- **Consistent style**: a linter and formatter, no commented-out code or debug output.
- **No overengineering**: skip heavy dependencies and complex architecture for a small task.
- **No secrets in the repo**: keys and passwords go in environment variables, with an `.env.example` file.

## 4. README and communication

The README speaks for you when you are not there. A minimal outline:

```markdown
# Project name

## How to run
Install and run commands, environment requirements.

## How to run tests
One command.

## Decisions and assumptions
Why this approach, what you assumed where requirements were unclear.

## What I would improve
What you did not get to and how you would do it with more time.
```

Check that the project runs **from scratch** using your instructions, for example in a fresh folder after cloning. When you submit, add a short note: what is done, how long it took and where to look.

## 5. When it is reasonable to decline

Declining is fine when:

- the task is clearly **far beyond a reasonable size** and needs many days of unpaid work;
- it looks like **a real company task** that could be used without you;
- requirements are missing and nobody answers questions;
- you already have public code solving a similar problem, so you can **offer it instead**;
- the company will not give feedback even on a large assignment.

Decline politely and offer an alternative: share your portfolio, walk through your code on a call or complete a shorter version.

## Common mistakes

- Skimming the requirements and building the wrong thing.
- Spending all the time on extras and leaving required parts unfinished.
- Submitting a project that does not run with the given instructions.
- Sending it without a README or a single test.
- Silently missing the deadline instead of warning in advance.

## FAQ

### Can I use AI assistants for a take-home assignment?

Check the company's rules. If it is allowed, own every line: in the next stage you may be asked to explain or change the code, and a lack of understanding will show.

### What if I cannot make the deadline?

Let them know early and propose a new date, or submit what is ready with a README section describing what is missing and how you would finish it.

### Should I do more than they asked for?

Only after the required part is done well. It is better to list extras as ideas in the README than to implement them in a rush.
