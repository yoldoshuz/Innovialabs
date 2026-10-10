---
title: Kubernetes Troubleshooting: CrashLoopBackOff, Pending and OOMKilled
description: A step-by-step workflow for failing Kubernetes pods using describe, logs, events and probes, with common causes of CrashLoopBackOff, Pending and OOMKilled.
summary: The pod status tells you where to look: Pending is a scheduling problem, CrashLoopBackOff means the container starts and dies, OOMKilled means it ran out of memory. Four commands cover most cases: get, describe, logs --previous and get events.
---

## Status first, cause second

A pod status is not a diagnosis, it is a direction:

| Status | What is happening | Where to look |
|---|---|---|
| **Pending** | The pod cannot be placed on a node | `describe`, events |
| **CrashLoopBackOff** | The container starts and crashes; Kubernetes increases the delay between restarts | `logs --previous`, exit code |
| **OOMKilled** | The kernel killed the process for exceeding its memory limit | `describe`, memory metrics |
| **ImagePullBackOff** | The image cannot be pulled | `describe`, events |

## The core command set

Almost every investigation starts the same way:

```bash
kubectl get pods -n <ns> -o wide
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -n <ns> --previous
kubectl get events -n <ns> --sort-by=.lastTimestamp
```

- **describe** shows container state, `Last State`, the **exit code**, the reason and pod events.
- **logs --previous** prints logs from the previous, crashed container instance. Without the flag you often see the empty log of a freshly restarted process.
- **events** give the timeline: scheduling, image pulls, probe failures, evictions.

## CrashLoopBackOff: the container starts and dies

Check the **exit code** in `describe` first:

- **1** or another app-specific code — the application itself failed. Look for a stack trace in `logs --previous`.
- **137** — the process received SIGKILL. Often an OOMKill or a kill after a failed liveness probe.
- **0** — the process exited "successfully", but Kubernetes expects a long-running service. For example, the start command ran and returned.

Typical causes:

1. **Missing configuration.** An environment variable, Secret or ConfigMap is absent and the app crashes on boot.
2. **Unavailable dependency.** The database or another service does not respond and the app cannot wait for it.
3. **Wrong command or entrypoint.** A typo in `command`/`args` or the wrong working directory.
4. **An aggressive liveness probe.** The app takes longer to start than `initialDelaySeconds` and gets killed before it is ready. The fix is a **startupProbe** for slow starts.
5. **Permissions.** The container runs as the wrong user and cannot write to the directory it needs.

If there are no logs at all, temporarily override the command with `sleep` and use `kubectl exec` to inspect the environment manually. Do not leave this in production.

## Pending: the pod cannot find a node

The Events section of `describe` contains the scheduler's message. Common ones:

- **Insufficient cpu/memory** — no node has room for the pod's requests. Lower the requests, add nodes or check the cluster autoscaler.
- **didn't match node selector / affinity** — no node carries the required labels.
- **had taint that the pod didn't tolerate** — nodes are tainted and the pod lacks a toleration.
- **unbound PersistentVolumeClaim** — the volume was not provisioned or there is no matching StorageClass.

## OOMKilled: killed for memory

`describe` shows `Reason: OOMKilled` and exit code 137. Then:

1. Look at real memory usage in metrics for the period before the crash.
2. If the peak is stable and predictable, raise the **memory limit** with headroom.
3. If usage grows steadily, hunt for a **memory leak** — a higher limit only delays the crash.
4. Check whether the runtime knows the container limit: heap settings in JVM, Node.js, Go.

Distinguish a container OOMKill from **eviction (Evicted)**: in the latter the whole node ran short of memory and the kubelet evicts pods by QoS class.

## Common debugging mistakes

- Running `kubectl logs` without `--previous` and concluding there are no logs.
- Treating CrashLoopBackOff by adding resources without reading the exit code.
- Identical liveness and readiness probes: a dependency issue triggers restarts instead of temporarily removing the pod from traffic.
- Ignoring events: they are kept for a limited time, so read them promptly or ship them to your logging system.

## FAQ

### What is the difference between liveness, readiness and startup probes?

**Liveness** decides whether to restart the container. **Readiness** decides whether it should receive traffic. **Startup** protects slow-starting apps: until it passes, the other probes do not run.

### How do I debug a pod that crashes instantly?

Use `kubectl logs --previous`, and if that is not enough, `kubectl debug` with an ephemeral container or a temporary `sleep` command to inspect the environment from inside.

### Why is my pod Pending when nodes look lightly loaded?

The scheduler counts **requests**, not actual usage. If requests are inflated, nodes are "full" on paper. Compare requests with real consumption.
