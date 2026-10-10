---
title: Kubernetes Requests and Limits: How to Size Containers Right
description: How Kubernetes requests differ from limits, how QoS classes work, what causes OOMKilled and CPU throttling, and how to right-size from real usage.
summary: Requests tell the scheduler where a pod fits, limits tell the kernel how much it may use. Set requests from real usage, give memory limits headroom, and treat CPU limits carefully because they cause throttling.
---

## In short: requests for scheduling, limits for enforcement

**Requests** are what a pod reserves on a node. The scheduler places a pod only on a node where the sum of existing requests plus the new one fits into allocatable capacity. Actual usage is not considered at this point.

**Limits** are a ceiling enforced by the Linux kernel through cgroups. What happens at the ceiling depends on the resource:

- **CPU** is compressible. A container hitting its CPU limit gets slowed down (**throttling**). The process survives but responds slower.
- **Memory** is not compressible. Exceed the memory limit and the kernel kills the process; the pod shows **OOMKilled** and restarts.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    memory: "512Mi"
```

## QoS classes and why they matter

Kubernetes assigns each pod a quality-of-service class. It decides who gets evicted first when a node runs out of memory.

| Class | Condition | Eviction priority under memory pressure |
|---|---|---|
| **Guaranteed** | Every container has requests = limits for CPU and memory | Evicted last |
| **Burstable** | At least one request or limit set, but not Guaranteed | Middle |
| **BestEffort** | No requests or limits at all | Evicted first |

Databases and critical services are good candidates for **Guaranteed**. Most stateless apps are fine as **Burstable**. **BestEffort** in production is almost always a mistake.

## OOMKilled and CPU throttling: how to spot them

**OOMKilled** is easy to see:

```bash
kubectl describe pod <pod> | grep -A3 "Last State"
```

The usual causes: a limit below the real peak, a memory leak, or a runtime that ignores the container limit (for example old JVM settings or an unbounded Node.js heap).

**CPU throttling** is sneakier: nothing crashes, latency just grows. The signal is a rising `container_cpu_cfs_throttled_periods_total` while average CPU looks moderate. This happens with bursty workloads: the quota for a short period runs out and threads wait for the next window.

## A method to right-size from real data

1. **Start with a sensible guess.** Run the service with moderate requests and a generous memory limit.
2. **Collect metrics across a typical load cycle** — several days at least, including peak hours. You need Prometheus with cAdvisor/kubelet metrics or an equivalent.
3. **Set the CPU request** near a high percentile (p90–p95) of real usage, not the absolute peak.
4. **Set the memory request** to the typical working set and the **memory limit** above the observed maximum with headroom for spikes.
5. **Decide on the CPU limit separately.** Many teams skip it for latency-sensitive services to avoid throttling and rely on requests for fair sharing. If you need one (multi-tenant clusters, noisy-neighbor protection), keep it well above the request.
6. **Validate under load.** Run a load test and watch throttling, OOM events and latency.
7. **Revisit regularly.** Major releases change the consumption profile.

The **Vertical Pod Autoscaler** in recommendation mode (`updateMode: "Off"`) helps: it does not touch pods, it only suggests values.

## Common mistakes

- **Requests set far too high.** Nodes look full on paper but sit idle — you pay for empty capacity.
- **Requests set too low.** The scheduler packs too many pods per node, they fight for resources and eviction risk grows.
- **Memory limit equal to a tight request.** Any spike becomes an OOMKilled.
- **Same resources for every service.** A copied template rarely fits both an API and a queue worker.
- **HPA on CPU without correct requests.** The Horizontal Pod Autoscaler measures utilization relative to the request, so a wrong request breaks autoscaling.

## FAQ

### Should I always set a CPU limit?

Not always. A CPU limit protects node neighbors but causes throttling. For latency-sensitive services teams often set only a CPU request. In shared clusters with strict quotas a limit may be mandatory — then keep generous headroom.

### Why was my pod OOMKilled when the memory graph stays below the limit?

Dashboards often average data, hiding short spikes. Container memory accounting also includes part of the page cache. Check `container_memory_working_set_bytes` at a fine resolution and review the runtime's memory settings.

### How do I set defaults for a namespace?

Use a **LimitRange** to inject requests and limits into containers that do not declare them, and a **ResourceQuota** to cap total consumption in the namespace.
