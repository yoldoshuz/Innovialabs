---
title: "Code Review Checklist: What to Check in a Pull Request"
description: A practical code review checklist covering correctness, readability, tests, security and performance, plus how to give and receive feedback constructively.
summary: A good review checks in order whether the code solves the task, is understandable, is tested, has no security holes or bottlenecks — and comments target the code, not the person.
---

## What to check first

A review is not a hunt for typos. Its goal is to make sure the change **solves the task, does not break anything else and will be clear to the next developer**. Go from important to minor:

1. Correctness.
2. Architecture and readability.
3. Tests.
4. Security.
5. Performance.
6. Style — leave it to the linter and formatter, not people.

## Before the review: the author's prep

- The PR is small and about one task. Large PRs get skimmed.
- The description says what was done, why, how to verify, and links the task.
- CI is green: tests, linter, build.
- The author reviewed their own diff before submitting.

## Reviewer checklist

### Correctness

- Does the code do what the task describes?
- Are edge cases handled: empty lists, `null`, zero and negative values, very long strings?
- What happens when the network, database or external API fails?
- Are there race conditions under concurrent requests?
- Are database migrations reversible and safe for existing data?

### Readability and structure

- Are names of variables, functions and classes clear without explanation?
- Are there long functions worth splitting?
- Does the code duplicate an existing utility?
- Is the change in the right layer (UI, business logic, data access)?
- Do comments explain "why" rather than restate "what"?

### Tests

- Are there tests for the new logic and for the fixed bug?
- Do the tests check behavior rather than implementation details?
- Would the test fail if the code were broken? A test that always passes is useless.

### Security

- Is user input validated on the server?
- Are database queries parameterized, with no SQL built from strings?
- Are permissions checked: can this user see and change exactly this data?
- Are there no secrets, tokens or passwords in code or logs?
- Do new dependencies come from reliable sources, and are they really needed?

### Performance

- No database queries inside a loop (the N+1 problem)?
- Do large result sets have pagination and the right indexes?
- Do heavy operations avoid blocking the user's response?

## How to write comments

Comment on the code, not the author. Compare:

| Bad | Better |
|---|---|
| "This is wrong" | "An empty list will throw here — maybe add a check?" |
| "Why did you do this?" | "Help me understand: why this approach rather than X?" |
| "Redo it" | "I suggest extracting this into a function — easier to test" |

Useful habits:

- Mark severity: **blocker**, **suggestion**, **nit**. The author will know what is required and what is optional.
- Explain the reason, not just the demand.
- Point out good decisions too — that is feedback as well.
- If a thread drags on for many messages, jump on a call.

## How to receive comments

- They review the code, not you. A remark is not a judgment of your skills.
- If you disagree, argue your case instead of ignoring it.
- Reply to every comment: fixed, under discussion, or left as is with a reason.
- Recurring remarks are a signal to add a linter rule or a team guideline.

## FAQ

### How many lines should a pull request have?

There is no universal number. Aim for a PR the reviewer can examine carefully in one sitting. If that is impossible, split the change into several sequential PRs.

### Who should do the review?

At least one person familiar with the affected part of the system. It also helps to occasionally involve colleagues from other areas, so knowledge spreads across the team.

### Can automated checks replace code review?

No, but automation removes routine: formatting, style, types, known vulnerabilities. Then people spend their time on logic, architecture and the meaning of the change.
