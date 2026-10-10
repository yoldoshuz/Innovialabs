---
title: "LLM Observability: Tracing, Logging and Monitoring AI Apps"
description: What to log for every LLM request, how to trace multi-step agents, how to detect quality drift and how to keep logs safe for user privacy.
summary: Log every LLM call with its prompt version, inputs, outputs, tool calls, tokens, latency and cost, link the steps into one trace, watch quality over time, and mask personal data before it is stored.
---
## Why LLM apps need special observability

Classic monitoring answers "is the service up and fast?". For an AI app that is not enough: the service can return HTTP 200 quickly and still give a **wrong, made-up or unsafe answer**. Outputs are non-deterministic, and one user action may trigger several model calls, searches and tool invocations.

**LLM observability** means you can answer three questions for any request:

- What exactly did the model receive and return?
- Which steps, tools and documents were involved?
- How much did it cost, how long did it take, and was the answer good?

## What to log for every request

A useful minimum per LLM call:

| Field | Why it matters |
|---|---|
| **Trace ID and user/session ID** | link all steps of one action, find a user's complaint |
| **Model name and parameters** | temperature, max tokens; behavior depends on them |
| **Prompt template and version** | know which prompt produced the answer |
| **Input and output** (masked) | reproduce and debug issues |
| **Retrieved documents** | check whether RAG found the right context |
| **Tool calls** with arguments and results | see what the agent actually did |
| **Tokens in/out and cost** | control spending by feature and user |
| **Latency** (total and time to first token) | find slow steps |
| **Errors, retries, finish reason** | detect truncation, timeouts, refusals |
| **User feedback** | thumbs up/down, corrections, escalation to a human |

## Tracing multi-step agents

An agent may plan, search, call an API, call the model again and only then answer. Logging each call separately makes this impossible to follow. Use **traces and spans**:

- a **trace** is one user request end to end;
- a **span** is one step inside it: an LLM call, a vector search, a tool call;
- spans are nested, so you see the tree of what happened and where time and tokens went.

**OpenTelemetry** is the common standard for this, and it has emerging semantic conventions for generative AI. Specialized tools (open-source and SaaS) add LLM-focused views on top: prompt playgrounds, cost dashboards, evaluation runs.

```python
from opentelemetry import trace

tracer = trace.get_tracer("support-bot")

with tracer.start_as_current_span("answer_question") as span:
    span.set_attribute("prompt.version", "support-v7")
    docs = search_docs(question)          # child span inside
    span.set_attribute("rag.docs_count", len(docs))
    reply = call_llm(question, docs)      # child span inside
    span.set_attribute("llm.tokens.total", reply.usage.total_tokens)
```

Watch agents for typical failure patterns: **loops** (the same tool called again and again), **too many steps**, tool errors the model ignores, and runaway token use.

## Monitoring quality and drift

Answer quality can change even when your code does not: the provider updates the model, user questions shift, the knowledge base gets stale. Track it:

- **Offline evals** — a fixed test set run on every prompt or model change.
- **Online checks** — automated scoring of a sample of real traffic (LLM-as-judge, format validation, groundedness against retrieved documents).
- **Proxy signals** — share of negative feedback, escalations to humans, repeated questions, empty or refused answers.
- **Input drift** — new topics or languages appearing in requests that your prompts were not designed for.

Set alerts on sudden changes, not only on absolute thresholds.

## Privacy-safe logging

Prompts often contain names, phones, addresses, documents. Logging them as is creates a data leak waiting to happen.

- **Mask or redact** personal data (PII) before writing logs.
- Store full texts **only where necessary**, with a short retention period.
- Restrict access to raw traces by role and audit who reads them.
- Keep metrics (tokens, latency, cost) separately from content so dashboards do not expose texts.
- Check that your logging vendor's data storage location and terms fit local law and your contracts.

## Common mistakes

- Logging only errors, so good-looking but wrong answers stay invisible.
- No prompt versioning — impossible to tell which change broke quality.
- Tracking cost per month but not per feature or per user.
- Sending raw user data to a third-party logging service without review.

## FAQ

### Can I use my existing APM tool?

Yes for latency, errors and infrastructure. For prompts, tool calls, token cost and quality evaluation you usually need extra attributes or a tool focused on LLMs, ideally connected via OpenTelemetry.

### Should I log full prompts and answers?

Log them in a masked form when you need to debug and evaluate quality, keep them for a limited time, and restrict access. For many dashboards, metadata alone is enough.

### How do I notice that the model got worse?

Run a fixed evaluation set regularly and after every change, score a sample of live traffic, and watch user feedback and escalation rates for sudden shifts.
