---
title: What Are Reasoning Models and When to Use Them
description: How reasoning models differ from regular LLMs, which tasks they improve, and why they are slower and more expensive. A plain explanation with examples.
summary: Reasoning models think before answering: they generate a chain of intermediate steps and spend extra compute on it. That clearly helps with math, code, analysis and multi-step tasks, but makes answers slower and costlier, so simple tasks do not need them.
---

## The short answer

A **reasoning model** (also called a thinking model) is a language model that goes through a reasoning phase before giving its final answer: it breaks the task into steps, checks intermediate conclusions and sometimes backtracks to fix itself. A regular model answers right away, token by token. A thinking model first spends extra compute on deliberation and only then responds.

That leads to the core trade-off: **higher accuracy on hard tasks, at the cost of longer waits and more tokens**.

## How it works

These models are trained to produce an internal chain of reasoning, essentially a scratchpad, before answering. That scratchpad:

- may be hidden from the user or shown as a short summary;
- consumes tokens that are usually billed like output tokens;
- can often be tuned with a setting such as **reasoning effort** or a **thinking budget**, depending on the provider.

The idea is simple: the more the model thinks, the better its chance of catching a mistake in its own logic before it answers.

## Where reasoning models help

- **Math and calculations**: financial models, unit economics, checking formulas.
- **Programming**: tracking down tricky bugs, refactoring, designing architecture.
- **Multi-step analysis**: comparing several contracts, finding contradictions in requirements, building a project plan.
- **Logic with many constraints**: schedules, resource allocation, rules with exceptions.
- **Agents**: when the AI plans a sequence of actions and calls tools on its own.

## Where they are overkill

- Short texts: posts, emails, product descriptions.
- Translation and paraphrasing.
- Classifying support tickets, extracting fields from documents.
- Support chatbots where response speed matters.

A regular model does these just as well, faster and cheaper.

## Comparison

| Criterion | Regular model | Reasoning model |
|---|---|---|
| Response speed | Fast | Seconds to minutes |
| Cost per request | Lower | Higher due to reasoning tokens |
| Hard multi-step tasks | Makes more mistakes | Noticeably more accurate |
| Simple tasks | Ideal | Overkill |
| Real-time chat | Fits | Usually too slow |

## How to choose in practice

1. **Start with a regular model.** If the quality is good enough, stop there.
2. **Find the tasks where it fails** on logic, math or skipped steps. Move only those to a reasoning model.
3. **Tune the reasoning level.** You rarely need the maximum; a medium setting often gives nearly the same result faster.
4. **Combine models.** For example, a reasoning model drafts the plan and a regular model executes the simple steps.
5. **Measure.** Build a set of real examples and compare models on it instead of going by gut feeling.

## Common mistakes

- **Using a thinking model for everything.** Bills grow, users wait, and simple answers do not get better.
- **Adding "think step by step" to a reasoning model's prompt.** It already does that; describing the task and success criteria clearly helps more.
- **Trusting the reasoning blindly.** A long chain of thought looks convincing, but the model can still be wrong. Verify important conclusions.

## FAQ

### Why does a reasoning model take so long to answer?

Before answering it generates a chain of reasoning, sometimes a long one. Every token of that chain takes compute, so response time grows with task complexity and the reasoning level you choose.

### Should users see the reasoning?

Not necessarily. In internal tools a short summary of the reasoning helps people see where a conclusion came from. In customer-facing products the final answer is usually enough.

### Can a regular model get a similar effect?

Partly: asking it to work through the problem step by step improves results. But models trained specifically to reason are usually more reliable on hard tasks.
