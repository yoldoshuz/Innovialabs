---
title: "Structured Logging: How to Write Logs That Are Easy to Search"
description: JSON logs, log levels, request and correlation IDs, what you must never log, and examples for Node.js, Python and Go.
summary: Write logs as JSON with a fixed set of fields — time, level, service, message and request ID; then any error is found with a filter instead of reading thousands of lines.
---
## What a structured log is

A plain log is a line of text: `User 42 failed to pay order 981`. A human understands it, but a machine has to parse it with regexes that break whenever someone rewords the message.

A **structured log** is a record with named fields, most often JSON:

```json
{"ts":"2026-03-14T10:22:05Z","level":"error","service":"billing","msg":"payment failed","user_id":42,"order_id":981,"request_id":"a1b2c3"}
```

A log system understands this right away: you can filter all errors of the `billing` service, count them per hour or find every event of a single request.

## Required fields

Agree on one set of fields for all services:

- **ts** — time in UTC, ISO 8601.
- **level** — the record's level.
- **service** and **env** — which service, in which environment.
- **msg** — a short, constant description of the event, with no interpolated variables.
- **request_id** / **trace_id** — an ID that ties together the records of one request.
- **error** — error type and message, with the stack trace in a separate field.

The key habit: **variables go into fields, not into the message text**. `msg: "payment failed"` is identical in every case, so it is easy to group.

## Log levels

| Level | When to use |
|---|---|
| **debug** | Development details; usually off in production |
| **info** | Significant normal events: startup, job finished, user signed in |
| **warn** | Something went wrong but the system coped: retry, fallback |
| **error** | An operation failed and needs attention |
| **fatal** | The process cannot continue |

If error records show up during normal operation, people stop reacting to them. A level should mean an action, not the developer's mood.

## Request IDs and correlation IDs

When a request passes through the frontend, API, a queue and a worker, you need to follow it end to end.

1. At the entry point (load balancer or first service), generate a unique ID if the header doesn't already have one.
2. Put the ID into the logger context so it lands in every record automatically.
3. When calling other services, pass the ID along in a header such as `X-Request-ID` or the standard W3C Trace Context `traceparent`.
4. Return the ID to the client in the response so users can quote it to support.

If you use OpenTelemetry, take the `trace_id` from it: logs will link to traces immediately.

## What you must never log

- Passwords, tokens, API keys, session cookies, the `Authorization` header.
- Card numbers, passport data and other sensitive personal data.
- Full request and response bodies "just in case".
- File contents and large binary data.

Set up **redaction** at the logger level rather than relying on every developer's attention.

## Examples

**Node.js (pino):**

```js
import pino from "pino";

const logger = pino({
  base: { service: "billing" },
  redact: ["req.headers.authorization", "password"],
});

const log = logger.child({ request_id: "a1b2c3" });
log.error({ user_id: 42, order_id: 981 }, "payment failed");
```

**Python (structlog):**

```python
import structlog

structlog.configure(processors=[
    structlog.processors.add_log_level,
    structlog.processors.TimeStamper(fmt="iso", utc=True),
    structlog.processors.JSONRenderer(),
])

log = structlog.get_logger().bind(service="billing", request_id="a1b2c3")
log.error("payment failed", user_id=42, order_id=981)
```

**Go (log/slog):**

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil)).
    With("service", "billing", "request_id", "a1b2c3")
logger.Error("payment failed", "user_id", 42, "order_id", 981)
```

## Common mistakes

- Different names for the same field across services: `userId`, `user_id`, `uid`.
- Logging inside a loop on every iteration — noise and extra cost.
- Multi-line stack traces in plain text that get split into separate records.
- Writing to files inside a container instead of stdout.

## FAQ

### Aren't JSON logs hard to read by eye?

In local development, enable pretty output (for example `pino-pretty` or structlog's console renderer); in production keep JSON, since the log system is the one reading it.

### How do logs differ from metrics and traces?

Metrics show numbers over time, traces show a request's path through services, and logs show the details of a specific event. A shared `trace_id` links them together.

### Which level should production use?

Usually info. Turn on debug temporarily and selectively when investigating a specific problem.
