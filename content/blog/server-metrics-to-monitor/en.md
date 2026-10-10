---
title: Which Server and Application Metrics You Should Monitor
description: What to collect: CPU, memory, disk, network, the four golden signals, RED and USE methods, sensible alert thresholds and what each spike usually means.
summary: Monitor server resources (CPU, memory, disk, network) with the USE method and application behavior with the four golden signals: latency, traffic, errors and saturation; alert on what users actually feel.
---
## What to monitor first

Metrics live on two levels:

- **Server resources**: CPU, memory, disk, network. They answer "is the hardware enough?"
- **Application behavior**: latency, request volume, errors. They answer "is the user having a good time?"

Start with the second level. Users do not care about CPU usage; they care that a page is slow or fails. Resource metrics help you find the **cause**.

## The four golden signals

This approach comes from the Google SRE book. For any service that handles requests:

1. **Latency**: response time. Track the p95 and p99 percentiles, not the average, because averages hide slow requests.
2. **Traffic**: requests per second or another load measure.
3. **Errors**: share of failed responses, such as HTTP 5xx, timeouts or wrong answers.
4. **Saturation**: how close the service is to its limit, such as queues, connection pools or the busiest resource.

## RED and USE methods

Two simplified checklists that complement each other.

| Method | Used for | What to measure |
|---|---|---|
| **RED** | Services and APIs | Rate (requests), Errors, Duration |
| **USE** | Resources: CPU, disk, network | Utilization, Saturation (queue), Errors |

**RED** is the outside view, how a client sees the service. **USE** is the inside view, for finding the bottleneck.

## Resource metrics and what a spike means

The thresholds below are **starting points**, not rules. The right values depend on your normal load.

### CPU
- **Watch:** utilization, load average relative to core count, iowait, steal on virtual machines.
- **Starting threshold:** sustained utilization above 80–90% deserves a look.
- **A spike usually means:** a traffic surge, a heavy query or a loop in code, a cron job. High **iowait** points to a slow disk; high **steal** points to an overloaded host at your provider.

### Memory
- **Watch:** available memory (not "free"), swap usage, OOM killer events.
- **Starting threshold:** available memory consistently below 10–15%, or active swapping.
- **It usually means:** a memory leak (a sawtooth graph that drops only on restart), oversized caches or pools, growing load.

### Disk
- **Watch:** usage, free inodes, I/O latency, IOPS.
- **Starting threshold:** above 80–85% usage is a warning, above 90–95% is urgent.
- **It usually means:** logs without rotation, backups on the same disk, temp files. Rising I/O latency suggests heavy database queries or an exhausted cloud disk limit.

### Network
- **Watch:** inbound and outbound traffic, errors and packet loss, connection count, TCP retransmits.
- **A spike usually means:** a marketing campaign or bot traffic, a DDoS, large exports, provider issues.

## Application and business metrics

Beyond system metrics, it pays to collect:

- **database** query duration and the number of slow queries;
- **queue** size and background job processing time;
- **external dependencies** such as payment gateways and APIs, with their latency and errors;
- **business metrics** such as sign-ups, orders and payments. A sudden drop in orders while servers look "green" is often the first sign of a breakage.

## Setting up alerts without noise

- **Every alert must require action.** If it can be ignored, it is a dashboard, not an alert.
- **Alert on symptoms**, not causes: "error rate went up" matters more than "CPU at 85%".
- **Use duration**: the condition should hold for several minutes, not a single data point.
- **Split severity levels**: warnings go to chat, critical alerts page the on-call person.
- **Revisit thresholds** after every incident.

## Common mistakes

- Looking only at average latency.
- Monitoring the server but never checking the site from outside (uptime checks).
- Creating dozens of alerts the team gets used to and stops reacting to.
- Not keeping metric history, which hides trends and your normal baseline.

## FAQ

### Which tool should I start monitoring with?
A common open-source stack is Prometheus for collecting metrics and Grafana for dashboards and alerts. Cloud providers and SaaS tools offer similar features without running your own infrastructure.

### What matters more: metrics, logs or traces?
They do different jobs. Metrics tell you something is wrong, logs tell you what exactly happened, traces show where in a chain of services a request slows down. Most teams start with metrics and logs.

### Why are percentiles better than the average?
Averages smooth out outliers: if most requests are fast and some are very slow, the average still looks fine. p95 and p99 show the experience of your least lucky users.
