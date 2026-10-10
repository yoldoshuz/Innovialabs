---
title: How to Write a Technical Specification: Step-by-Step Guide
description: A step-by-step process and template for a technical specification: goals, users, functional and non-functional requirements, integrations and acceptance criteria.
summary: A good specification answers five questions: why the product exists, who it is for, what it does, what qualities it needs and how you will know the work is accepted. Write it from user tasks, not from a list of screens.
---

## What a specification is and why you need it

A **technical specification** is a document in which the client and the contractor agree on exactly what needs to be built. It lets you:

- get an **accurate estimate** of time and budget;
- compare contractors on the same scope;
- avoid disputes at acceptance: "that is not what we meant".

A specification does not need to be long. It needs to be **unambiguous**: every item is understood the same way by both sides.

## Step 1. Goals and context

Start with the business problem, not the features:

- what problem the product solves;
- how you will know it works (for example, "leads arrive in the CRM without manual entry");
- what already exists: website, CRM, customer base, brand.

## Step 2. Users and roles

List who will use the system and what each of them needs:

| Role | Main tasks |
| --- | --- |
| Customer | Find a product, place an order, pay |
| Manager | Process the order, contact the customer |
| Administrator | Manage catalog, prices, access |

Roles immediately reveal which interfaces and permissions you need.

## Step 3. Functional requirements

This is **what the system does**. A convenient format is user stories:

```text
As a customer, I want to pay for an order via Payme or Click
so that I do not have to transfer money manually.
```

For each feature, specify:

- **the main scenario** — the user's steps;
- **exceptions** — what happens on an error, an empty field, a cancelled payment;
- **priority** — required for the first version or can wait.

Priorities help you cut an MVP and control the budget.

## Step 4. Non-functional requirements

This is **what the system must be like**:

- **performance** — how many concurrent users, acceptable response time;
- **security** — personal data storage, roles, backups;
- **platforms** — browsers, iOS/Android, responsiveness;
- **languages** — Russian, Uzbek, English;
- **accessibility and SEO**, if it is a public website.

These are the items most often forgotten, and later they turn into expensive rework.

## Step 5. Integrations

Describe each external system:

- name and purpose (CRM, 1C, payment gateway, Telegram);
- **what data** is exchanged and in which direction;
- whether there is an API and documentation, and who provides access.

If there is no documentation, say so. It is an honest risk the contractor will factor into the estimate.

## Step 6. Design and content

- Is there a brand book, mockups or references?
- Who prepares the copy, photos and product cards?
- Is an admin panel needed, and what can be edited in it?

## Step 7. Acceptance criteria

For each key feature, write a testable condition:

- "The order appears in the CRM with the status New after a successful payment."
- "The catalog page opens on mobile without horizontal scrolling."

If a requirement cannot be tested, it cannot be accepted.

## Specification template

1. Project goals and context
2. Users and roles
3. Functional requirements (with priorities)
4. Non-functional requirements
5. Integrations
6. Design and content
7. Acceptance criteria
8. Out of scope
9. Glossary

The **out of scope** section prevents more disputes than any other.

## Common mistakes

- **Describing a solution instead of a problem** — "add a button" instead of "the customer needs to repeat a past order".
- **Vague wording** — "fast", "convenient", "modern" without measurable criteria.
- **No priorities** — everything is "required" and the budget balloons.
- **Writing it once** — the specification must be updated when decisions change.

## FAQ

### Can the contractor write the specification for me?

Yes, many teams do this during a discovery phase. But only you know the goals, roles and business rules, so your involvement is essential, and you must read and approve the final document carefully.

### How detailed should a specification be?

Detailed enough that two different contractors understand it the same way. You do not need the design of every button, but you do need scenarios, exceptions and acceptance criteria.

### What if requirements change during the project?

That is normal. Record changes in the document, assess their impact on time and budget, and agree on them before work starts. Agile methods work exactly this way — through managed change, not by abandoning the document.
