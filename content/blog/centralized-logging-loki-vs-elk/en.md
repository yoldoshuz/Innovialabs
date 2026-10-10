---
title: "Centralized Logging: Grafana Loki vs ELK Stack"
description: Why logs should leave your servers, how Grafana Loki and ELK differ in indexing, resources and cost, and how to set up minimal log shipping.
summary: Loki indexes only labels and stores logs cheaply, which suits most teams already on Grafana; ELK indexes full text and searches more powerfully, but needs far more resources and care.
---
## The short answer

If you mainly need to collect logs from all servers and quickly find errors by service, environment and time, start with **Grafana Loki**. If you need full-text search on any word, complex analytics and field aggregations over large volumes, look at **ELK** (Elasticsearch, Logstash, Kibana) or its open fork OpenSearch.

## Why logs should leave the server

- **Servers die.** The logs you need to investigate the outage go down with the disk.
- **You have more than one server.** Hunting an error with `ssh` and `grep` across five machines and ten containers is slow.
- **Containers are ephemeral.** When a container is recreated, its stdout is gone.
- **Access and security.** A developer should not need root on production just to read logs.
- **Correlation.** One window shows what happened across all services in the same second.

## How they work

**ELK** parses every record and builds an **inverted index** of its content. Searching any word or field is very fast, but the index takes a lot of space and Elasticsearch is demanding on memory and disk.

**Loki** indexes only **labels**: `app`, `env`, `host`. The log text is compressed into chunks and stored, for example, in object storage. At query time Loki first selects streams by labels, then filters the text by brute force.

## Comparison

| Criterion | Grafana Loki | ELK / OpenSearch |
|---|---|---|
| What is indexed | Labels only | Full text and fields |
| Resources | Modest | High (RAM, fast disks) |
| Storage | Object storage (S3-compatible) or disk | Cluster disks |
| Search for an arbitrary word | Slower over large ranges | Fast |
| Field analytics | Basic (LogQL) | Powerful |
| UI | Grafana | Kibana / OpenSearch Dashboards |
| Operational complexity | Lower | Higher: shards, replicas, index retention |

In both cases cost depends not on the product name but on **daily log volume, retention period and how fast search must be**. The less you index, the cheaper storage gets — that is Loki's main advantage.

## Minimal log shipping

A universal collector is **Fluent Bit**: it reads files or container logs and can ship them to both Loki and Elasticsearch. That is handy — you can start with one backend and switch later without touching applications.

Shipping to Loki:

```ini
[INPUT]
    Name   tail
    Path   /var/log/app/*.log
    Tag    app

[OUTPUT]
    Name   loki
    Match  app
    Host   loki
    Port   3100
    Labels job=app, env=prod
```

Shipping to Elasticsearch:

```ini
[OUTPUT]
    Name               es
    Match              app
    Host               elasticsearch
    Port               9200
    Index              app-logs
    Suppress_Type_Name On
```

Grafana also has its own agent, **Grafana Alloy**, which replaced Promtail. For ELK the classic option is Filebeat. Pick one agent for the whole infrastructure.

An example Loki query (LogQL): all errors of a service in the selected period.

```logql
{app="api", env="prod"} |= "error" | json | level="error"
```

## How not to get it wrong

- **Few labels in Loki.** Use 3–6 stable labels. Never turn `user_id` or `request_id` into labels — the number of streams will explode. Keep such values in the log body.
- **Unstructured logs.** JSON logs are far easier to filter in both systems.
- **No retention.** Decide how long to keep logs up front, or the disk will run out unexpectedly.
- **Secrets in logs.** Passwords, tokens and personal data must not reach central storage.
- **A collector without a buffer.** Enable disk buffering so you don't lose logs when the backend is unavailable.

## FAQ

### Can I start with Loki and move to ELK later?

Yes, especially if shipping is built on a universal agent such as Fluent Bit or the OpenTelemetry Collector. Only the output plugin changes; applications stay the same.

### Is Loki a good fit for a small project?

Yes. Loki can run as a single container with local disk storage, and you view logs in the same Grafana where your metrics already live.

### What should I choose for audit and security analytics?

For complex multi-field queries and investigations, Elasticsearch or OpenSearch is usually more convenient: its full-text index and aggregations are stronger.
