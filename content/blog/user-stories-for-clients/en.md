---
title: User Stories: How Clients Should Describe Features
description: How to describe a product feature as a user story with acceptance criteria so the dev team understands it the same way. Template, examples and common mistakes.
summary: A user story is a short feature description from the user's point of view: "As a [role], I want [action] so that [goal]", plus acceptance criteria that define when it is done.
---

## What a user story is and why clients need it

A **user story** describes one feature from the perspective of the person who will use it. It answers three questions: who, what they want to do, and why.

The classic template:

> As a **[role]**, I want **[action]** so that **[goal or benefit]**.

For a client, it is the simplest way to explain what you need without technical detail. You describe the problem and the outcome, and the developers choose how to build it.

## The three parts of a good story

- **Role.** A specific type of user: "shopper", "warehouse manager", "admin". Not just "user" if the product has several roles.
- **Action.** What the person does in the product. One action, one story.
- **Goal.** Why they need it. The goal is what lets the team suggest a simpler or better solution than the one you had in mind.

## Acceptance criteria: a story is not finished without them

**Acceptance criteria** are testable conditions under which the feature counts as done. Without them, "done" will mean different things to you and to the developer.

A handy format is **Given / When / Then**:

- **Given:** the starting situation.
- **When:** the user's action.
- **Then:** the expected result.

Every criterion should be answerable with a simple yes or no.

## A bad and a good example

**Bad:**

> We need a proper cart like the big stores have, so it is convenient.

It is unclear who the user is, what "proper" means, and how to check the result.

**Good:**

> As a **shopper**, I want to **change the item quantity right in the cart** so that **I don't have to go back to the product page**.

Acceptance criteria:

1. Given there is an item in the cart, when the shopper taps "+", then the quantity increases by 1 and the total is recalculated.
2. When the quantity reaches 0, then the item is removed from the cart.
3. When the shopper tries to add more than is in stock, then a message about available stock is shown.

A story like this can be estimated, built and tested without extra calls.

## How to write stories step by step

1. **List the roles** in the product: who uses it and who manages it.
2. **For each role, write down the tasks** they need to get done. Tasks, not screens.
3. **Phrase the stories** using the template, one per action.
4. **Add acceptance criteria**: the normal flow, errors, edge cases.
5. **Prioritise**: what the first version needs and what can wait.
6. **Discuss with the team.** A story is a starting point for conversation, not a contract set in stone.

## Common client mistakes

- **Stories that are too big.** "As an owner, I want a CRM" is a whole product, not a story. Split it into pieces that take a few days to build.
- **A solution instead of a goal.** "I want a dropdown" instead of "I want to pick a city quickly". State the goal and the team may offer something better.
- **No goal at all.** Without "so that", it is hard to set priority or check whether the feature solves the problem.
- **Vague criteria.** "Fast", "convenient", "nice" cannot be tested. Be measurable or describe concrete behaviour.
- **Forgotten errors.** What happens if the connection drops, a field is empty or a payment fails?

## Checklist before sending to the team

- Is the role specific?
- Is there one action per story?
- Is there a "so that" with a clear benefit?
- Can each acceptance criterion be checked yes/no?
- Are errors and edge cases covered?
- Is the priority stated?

## FAQ

### Should the client write user stories personally?

Not necessarily, but it helps. Even rough stories from you help the team understand the business logic. An analyst or project manager can then refine the wording and criteria.

### How is a user story different from a specification?

A specification describes the whole system and often fixes decisions. User stories describe individual user needs and leave the team room to choose the implementation. In practice they are often combined: stories can be part of the specification.

### How many acceptance criteria does one story need?

As many as it takes to verify the result unambiguously. Usually that is a few points: the main flow and the important exceptions. If the list gets very long, split the story.
