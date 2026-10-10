---
title: How to Set Up Prometheus and Grafana for Monitoring
description: Step by step: run Prometheus and Grafana with Docker Compose, add node_exporter and app metrics, write basic PromQL and build a first dashboard.
summary: Prometheus scrapes metrics from exporters over HTTP and Grafana visualizes them; both run from one docker-compose.yml, and a useful first dashboard needs only five or six PromQL queries.
---
## The short version: how it works

**Prometheus** polls (scrapes) HTTP `/metrics` endpoints every few seconds and stores the numbers in a time-series database. **Exporters** expose those metrics: `node_exporter` covers the server (CPU, memory, disk, network), and your application exposes requests, errors and latency. **Grafana** connects to Prometheus as a data source and draws the charts.

The minimal working setup is four containers: Prometheus, Grafana, node_exporter and the application itself.

## Step 1. Docker Compose

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prom-data:/prometheus
    ports:
      - "9090:9090"

  node-exporter:
    image: prom/node-exporter
    pid: host
    volumes:
      - /:/host:ro,rslave
    command: ["--path.rootfs=/host"]

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"

volumes:
  prom-data:
  grafana-data:
```

In production, pin specific image versions and do not expose ports 9090 and 3000 publicly — serve Grafana through a reverse proxy with HTTPS.

## Step 2. Prometheus configuration

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["prometheus:9090"]
  - job_name: node
    static_configs:
      - targets: ["node-exporter:9100"]
  - job_name: app
    static_configs:
      - targets: ["app:8080"]
```

Run `docker compose up -d` and open `http://localhost:9090/targets`. Every target should be **UP**. If one is DOWN, check the service name, the port and that the containers share a network.

## Step 3. Application metrics

Most languages have official or widely used Prometheus client libraries. A Node.js example with `prom-client`:

```js
import express from "express";
import client from "prom-client";

const app = express();
client.collectDefaultMetrics();

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status"],
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on("finish", () =>
    end({ method: req.method, route: req.route?.path ?? "unknown", status: res.statusCode })
  );
  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(8080);
```

The key rule for labels: **never put high-cardinality values in labels** — user IDs, full URLs, emails. Every unique label combination is a separate time series, and storage grows fast.

## Step 4. Basic PromQL queries

| What you watch | Query |
|---|---|
| CPU usage, % | `100 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100` |
| Available memory | `node_memory_MemAvailable_bytes` |
| Disk usage, % | `100 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100` |
| Requests per second | `sum(rate(http_request_duration_seconds_count[5m]))` |
| 5xx error ratio | `sum(rate(http_request_duration_seconds_count{status=~"5.."}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))` |
| 95th percentile latency | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` |

Remember: counters (`_total`, `_count`) almost always go through `rate()`, otherwise you get an ever-growing line.

## Step 5. Your first Grafana dashboard

1. Open Grafana on port 3000 and change the admin password right away.
2. **Connections → Data sources → Prometheus**, URL: `http://prometheus:9090`.
3. Create a dashboard and add panels using the queries from the table.
4. For server metrics, import a ready-made Node Exporter dashboard from the Grafana catalog by its ID.
5. Add an `instance` variable to switch between servers.

Describe the data source and dashboards through **provisioning** (YAML and JSON in the repository) so they can be restored and versioned.

## Common mistakes

- **No alerts.** Nobody watches dashboards at night. At minimum, alert on disk usage, unreachable targets (`up == 0`) and rising errors.
- **Retention left to chance.** Prometheus keeps data for a limited time by default; set `--storage.tsdb.retention.time` deliberately.
- **Open ports.** `/metrics` and an unauthenticated Prometheus should never be reachable from the internet.
- **Too many labels.** Cardinality is the main reason Prometheus becomes heavy.

## FAQ

### Do I need Prometheus if I already have cloud monitoring?

Not necessarily. Cloud tools cover basic infrastructure metrics, while Prometheus shines when you want control over your data, application metrics and one stack on your own servers.

### How do I get notified about problems?

Write alerting rules in Prometheus and connect Alertmanager, which sends notifications to Telegram, Slack or email. Grafana's built-in alerting is an alternative.

### Can I monitor several servers?

Yes. Install node_exporter on each server and add their addresses to `targets`. For dynamic infrastructure, use service discovery instead of a static list.
