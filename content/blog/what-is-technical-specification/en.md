---
title: What Is a Technical Specification for Software
description: What a software technical specification is, who writes it, which sections it contains and why it protects both the client and the contractor.
summary: A technical specification is a document that pins down what exactly must be built, how it should work and how the result will be accepted; it protects both sides from disputes and wasted budget.
---

## What a spec is and why you need one

A **technical specification (spec)** is a document that describes **what** a future system must do, **for whom**, and **how to check** that it was built correctly.

A spec turns the idea in the client's head into a shared text that everyone reads the same way: the business owner, the manager, the designer, developers and testers.

Without a spec, everyone keeps their own version of the product in mind. The gaps surface late, when the code is already written and changes are expensive.

## Why a spec protects both sides

It protects the **client** from "you built the wrong thing". If a feature is described, the contractor must deliver it as written.

It protects the **contractor** from endless revisions. Anything not in the document is a new task that is estimated separately.

A spec also lets you:

- **compare proposals** from different vendors on the same basis;
- **estimate** time and budget more accurately;
- **accept the work** against clear criteria instead of personal taste;
- **hand the project over** to another team without losing knowledge.

## Who writes the spec

There are several options, and each can work:

| Who writes it | Pros | Cons |
|---|---|---|
| The client | Knows the business best | Often misses technical details |
| The contractor's business or systems analyst | Knows what developers need | Needs time to learn the business |
| Both, during a discovery phase | Both perspectives are covered | A separate stage of work |

In practice, collaboration works best: the client defines goals and processes, and the analyst translates them into requirements.

## Sections of a spec

There's no strict standard for commercial projects, but a good spec usually covers:

1. **Project goals.** Which business problem we're solving and how we'll know it's solved.
2. **Users and roles.** Who uses the system (customer, manager, admin) and what each can do.
3. **Functional requirements.** What the system does. User scenarios work well: "A customer picks a product, adds it to the cart and pays online."
4. **Non-functional requirements.** Speed, load, security, supported browsers and devices, interface languages.
5. **Integrations.** Which systems exchange data with it: payment providers, CRM, accounting software, delivery services.
6. **Design.** A link to mockups or interface and brand requirements.
7. **Constraints.** Technologies, hosting, legal requirements for data storage.
8. **Acceptance criteria.** How each feature is verified.
9. **Out of scope.** Often forgotten, yet it prevents many disputes.

## How to write a spec that works

- **Be specific.** Instead of "a fast website", write "the catalog page loads quickly on mobile internet" together with a clear way to measure it.
- **Avoid vague words** like "convenient", "modern" or "etc." They can't be verified.
- **Describe scenarios, not just screens.** What matters is what the user does and what they see in response, including errors.
- **Number your requirements.** They're easier to reference in discussions and during acceptance.
- **Add diagrams and mockups.** One process diagram often replaces a page of text.
- **Treat the spec as a living document.** Changes are fine, but they're recorded and approved in writing.

## Common mistakes

- **A one-page spec** for a complex system is a wish list, not a specification.
- **A hundred-page spec** for an MVP means months spent on a document instead of testing the idea.
- **Describing the solution instead of the problem.** "Put a button on the right" is weaker than "the user must be able to repeat a past order quickly".
- **No acceptance criteria**, so the handover turns into an argument.

## FAQ

### Can development start without a spec?

Yes, if the work runs in short iterations and requirements are refined along the way, as in agile methods. Even then you need a task list with clear definitions of done.

### How long does it take to prepare a spec?

It depends on the system's size, the number of roles and integrations, and how ready the client is to discuss details. For a small project it can be a few meetings; for a large system it's a separate phase.

### Is a spec the same as a brief?

No. A brief is a short questionnaire with goals, budget and wishes that starts the conversation. A spec is a detailed document used to build and accept the product.
