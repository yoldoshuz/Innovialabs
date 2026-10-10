---
title: Monitoring vs Observability: Metrics, Logs and Traces Explained
description: How monitoring differs from observability, what metrics, logs and traces each answer, how they work together and which tools cover which pillar.
summary: Monitoring tells you something is broken based on checks you defined in advance; observability lets you find out why using three data sources: metrics (how much), logs (what happened) and traces (where exactly).
---
## The short answer

**Monitoring** means watching indicators you already know matter: CPU load, error count, response time. You decide upfront what is important and set alerts. Monitoring answers **"is something wrong?"**

**Observability** is a property of a system: how well you can understand its internal state from the data it emits, including in situations nobody anticipated. It answers **"why is this happening?"**

They are not rivals. Monitoring is part of observability: an alert tells you errors went up, then observability data helps you find the cause.

## The three pillars: metrics, logs, traces

| Source | What it is | Question it answers |
|---|---|---|
| **Metrics** | numbers over time: requests per second, errors, latency, memory | How much? How often? Is there a trend? |
| **Logs** | event records with details: the error, the user, the parameters | What exactly happened? |
| **Traces** | the path of a single request through all services, with timing for each step | Where exactly is it slow or failing? |

### Metrics

Metrics are cheap to store and fast to aggregate, which is why dashboards and alerts are built on them. The downside is limited detail: a metric shows that 5xx errors went up but not which request caused them.

Watch out for **cardinality**. If you add a label with a user ID or a full URL to a metric, the number of time series explodes and storage becomes slow and expensive.

### Logs

Logs give context: a stack trace, input data, an order ID. Prefer **structured logs** (JSON) so you can search and filter by fields. The downside is volume: logs grow fast, and storing and indexing them costs money.

### Traces

A trace is made of **spans**, units of work such as handling an HTTP request, a database query or an external API call. All spans of one request share a **trace ID**. Traces matter most in systems with several services, where one service's logs are not enough to find the cause.

## How they work together

A typical investigation looks like this:

1. A **metric** fires an alert: API p95 latency went up.
2. A **trace** of a slow request shows the time is spent calling the payments service.
3. **Logs** from that service with the same trace ID show database connection timeouts.

The key is **correlation**: put the trace ID into every log line and configure your tools to jump from a chart to traces and from a trace to logs.

## Which tools cover which pillar

| Job | Popular open source options |
|---|---|
| Metrics | Prometheus, VictoriaMetrics |
| Logs | Loki, Elasticsearch/OpenSearch, Graylog |
| Traces | Jaeger, Tempo, Zipkin |
| Dashboards and alerts | Grafana, Alertmanager |
| Data collection | OpenTelemetry, Fluent Bit, Vector |

There are also platforms that cover all three pillars at once: Datadog, New Relic, Grafana Cloud, Elastic Observability. They are faster to set up, but the cost usually grows with data volume.

**OpenTelemetry** is an open standard and a set of SDKs for collecting metrics, logs and traces. If you instrument your code with it, you can switch the storage backend without rewriting the application.

## Where to start

- Small project: server and application metrics, centralized logs, a few alerts on errors and availability. Tracing can wait.
- Several services or queues: add tracing via OpenTelemetry and include the trace ID in logs.
- Alert on **symptoms** users actually feel (errors, latency), not on every internal metric, or the team will start ignoring notifications.

## FAQ

### Does a small project need observability?
Usually not the full three-pillar setup. But basic metrics, centralized logs and alerts are needed by any project in production; without them you learn about problems from your users.

### Can I get by with logs only?
Technically you can derive metrics from logs, but it is slower and more expensive. Metrics are better for dashboards and alerts, logs are better for investigating specific cases.

### What is APM?
APM (Application Performance Monitoring) is a class of tools that automatically collect application metrics and traces: endpoint response times, slow database queries, errors. In practice it is a ready-made observability setup for the application layer.
