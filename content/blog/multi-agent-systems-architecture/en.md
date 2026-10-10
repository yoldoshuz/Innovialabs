---
title: Multi-Agent Systems: Architecture Patterns and Trade-Offs
description: Comparing orchestrator-worker, pipeline and debate patterns, handling agent memory and state, and knowing when a single agent is the better choice.
summary: A multi-agent system pays off when a task splits into independent parts or needs distinct roles and verification; otherwise a single agent with good tools is simpler, cheaper and more reliable. The main trade-offs are cost, latency and debugging complexity.
---
## The short answer: when you need several agents

An **agent** is an LLM that decides in a loop which tool to call and acts on the result. A **multi-agent system** is several such agents with different roles, prompts and tools that exchange results.

Multiple agents make sense when:

- the task can be **parallelized** into independent subtasks;
- a single context **cannot hold** all the information;
- you need **different specializations** or independent verification.

If none of these holds, start with one agent.

## Pattern 1. Orchestrator-worker

The **orchestrator** breaks the task into subtasks, hands them to **workers** and assembles the result.

- **Pros:** parallelism, each worker gets a clean, narrow context, easy to add new workers.
- **Cons:** quality depends on how well the orchestrator decomposes the task; workers may duplicate effort; the number of LLM calls grows.
- **Good for:** research across many sources, analyzing large document sets, generating parts of a report.

## Pattern 2. Pipeline

Agents run **sequentially**: the output of one is the input of the next. For example: extract data → validate → compose the answer.

- **Pros:** predictable, easy to debug — you see which step failed; each step can be tested on its own.
- **Cons:** an early error propagates downstream; no parallelism; a rigid structure fits open-ended tasks poorly.
- **Good for:** document processing and workflows with clear stages.

Often a pipeline needs no "agency" at all — it is a plain chain of LLM calls, and that is a good thing.

## Pattern 3. Debate and review

Several agents propose solutions or **critique** each other, and a final agent delivers the verdict. A simpler version is a "worker + reviewer" pair.

- **Pros:** catches errors a single pass misses; useful where mistakes are costly.
- **Cons:** multiple rounds multiply cost and latency; agents on the same model may agree on the same mistake.
- **Good for:** code review, legal and financial wording, complex reasoning.

## Comparing the patterns

| Criterion | Orchestrator-worker | Pipeline | Debate |
|---|---|---|---|
| Parallelism | High | None | Partial |
| Predictability | Medium | High | Medium |
| Cost | Grows with workers | Moderate | Grows with rounds |
| Debugging | Harder | Easiest | Medium |

## Memory and state

This is the most underrated part of the architecture.

- **Short-term memory** is the current task's context. Do not pass workers the whole history — give them only what they need, or cost and noise grow.
- **Shared state** should be stored explicitly: in a database, a file or a structured object, not in the agents' chat transcript.
- **Long-term memory** holds facts across sessions, usually via search over a knowledge base.
- **Structured handoffs** — agents exchange data against a schema (for example, JSON) rather than free text. That makes validation and debugging easier.
- **Idempotency and retries** — if a step fails, rerunning it must be safe.

## When a single agent is better

- The task is sequential and fits in the context window.
- **Low latency** and predictable cost matter.
- Subtasks depend heavily on each other — passing context between agents loses details.
- You do not yet have **tracing and evaluation** — without them a multi-agent system is nearly impossible to debug.

A good rule: start with one agent with solid tools and a good prompt, then split only where measurements show a gain.

## Common mistakes

- Building a "team of agents" for the architecture's sake rather than the task's.
- No limits on steps and calls — agents get stuck in loops.
- No logging of every call and decision.
- Fuzzy role boundaries: agents duplicate or contradict each other.

## FAQ

### Do I need a dedicated framework for multi-agent systems?

Not necessarily. Simple patterns can be built with ordinary code and API calls. A framework helps when you need ready-made state, tracing and retries, but it brings its own complexity.

### Can different agents use different models?

Yes, and it is a common optimization: a stronger model for planning and review, a faster and cheaper one for simple worker subtasks.

### How do I evaluate a multi-agent system?

Evaluate both the final result and each step: decomposition quality, worker output, number of calls and latency. Without tracing, finding the cause of a failure is very hard.
