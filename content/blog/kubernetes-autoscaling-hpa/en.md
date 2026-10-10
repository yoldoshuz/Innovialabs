---
title: Kubernetes Autoscaling: HPA, VPA and Cluster Autoscaler
description: How HPA, VPA and Cluster Autoscaler work, how to configure HPA on CPU and custom metrics, and how to avoid flapping and conflicts between autoscalers.
summary: HPA changes the number of pods, VPA changes each pod's CPU and memory requests, and Cluster Autoscaler adds or removes nodes; combine HPA with Cluster Autoscaler, and do not let HPA and VPA act on the same resource metric.
---

## Three autoscalers, three different jobs

Kubernetes scales on three levels, and each tool answers a different question:

| Tool | What it changes | Reacts to | Typical use |
|---|---|---|---|
| **HPA** (Horizontal Pod Autoscaler) | Number of pod replicas | CPU, memory, custom or external metrics | Stateless web services and workers |
| **VPA** (Vertical Pod Autoscaler) | CPU and memory requests of pods | Observed resource usage over time | Right-sizing requests, services that do not scale out well |
| **Cluster Autoscaler** | Number of nodes | Pods stuck in Pending, underused nodes | Making room for new pods, saving cost |

HPA is built into Kubernetes. VPA and Cluster Autoscaler are separate components you install (managed clouds often provide the cluster-level one as an option; Karpenter is a popular alternative for node provisioning).

## How HPA works

On a regular interval HPA reads a metric, compares it with the target and calculates the desired replica count, roughly:

`desiredReplicas = ceil(currentReplicas × currentValue / targetValue)`

If pods average 90% CPU against a 60% target with 4 replicas, HPA wants 6. A small tolerance stops it from reacting to tiny deviations.

Two prerequisites are easy to miss:

- **metrics-server** must be installed for CPU and memory metrics.
- Containers must have **CPU requests** set. Utilization is measured as a percentage of the request; without it HPA cannot calculate anything.

## Configuring HPA on CPU and a custom metric

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Pods
          value: 4
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
```

With several metrics, HPA computes a replica count for each and picks the **largest**. The values here are illustrative; choose them from load tests.

**Custom metrics** such as requests per second or queue length are not available by default. You need an adapter that exposes them to the Kubernetes metrics API, for example Prometheus Adapter, or **KEDA**, which also scales on queue length, cron schedules and many external sources. For queue workers, queue depth is usually a better signal than CPU.

## How VPA works

VPA has three parts: a **recommender** that watches usage, an **updater** that can evict pods whose requests are far off, and an **admission controller** that sets new requests when pods are created. Update modes range from `Off` (recommendations only) to modes that apply them automatically.

A safe way to start is `Off` mode: read the recommendations and adjust requests manually. Automatic modes may restart pods, so protect services with a PodDisruptionBudget.

## How Cluster Autoscaler works

Cluster Autoscaler does not look at CPU load. It reacts to **scheduling**:

- When pods are Pending because no node has enough free requested resources, it adds a node from a node group.
- When a node has been underused for a while and its pods can move elsewhere, it drains and removes it.

That is why accurate requests matter: they are what both the scheduler and the autoscaler count. Pods without requests, or with local storage and strict PodDisruptionBudgets, can block scale-down.

## Avoiding flapping and conflicts

- **Do not run HPA and VPA on the same CPU or memory metric** for one workload. VPA raises requests, utilization drops, HPA removes pods, load per pod rises, and the loop continues. If you need both, let HPA use a custom metric and VPA handle resources, or keep VPA in `Off` mode.
- **Use stabilization windows**, especially for scale-down, so short dips do not remove pods that are needed a minute later.
- **Limit the rate of change** with `behavior` policies.
- **Account for startup time.** If pods take long to become ready, new replicas arrive late and HPA keeps adding more. Use readiness and startup probes, and keep images lean.
- **Set sensible minReplicas** so there is always headroom for a sudden spike while new pods and nodes come up.
- **Check the whole chain**: HPA can request 20 pods, but if the cluster cannot add nodes or the database cannot take more connections, scaling only moves the bottleneck.

## FAQ

### Do I need all three autoscalers?

No. Many clusters run HPA plus Cluster Autoscaler, and use VPA only in recommendation mode to tune requests. Add tools only when a specific problem calls for them.

### Why does my HPA show unknown metrics?

Usually metrics-server is not installed or not working, the container has no CPU request, or the custom metric name does not match what the adapter exposes. Check `kubectl describe hpa` for events.

### Can HPA scale to zero?

The built-in HPA keeps at least one replica in standard setups. Event-driven tools like KEDA can scale to zero and back, which suits queue workers with idle periods. See the official [Kubernetes documentation](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).
