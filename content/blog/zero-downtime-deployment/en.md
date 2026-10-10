---
title: Zero-Downtime Deployment: Techniques and Step-by-Step Setup
description: How to ship releases without downtime: rolling restarts, health checks, graceful shutdown, connection draining and backward-compatible database migrations.
summary: New instances must start and pass a readiness check before old ones stop, old ones must finish in-flight requests before exiting, and the database schema must work with both versions at once.
---

## What zero-downtime deployment really requires

A release without downtime is not one trick but four rules working together:

- **Rolling replacement**: new instances start before old ones are removed, so capacity never drops to zero.
- **Health checks**: traffic goes only to instances that report they are ready.
- **Graceful shutdown with connection draining**: an old instance stops accepting new requests, finishes the current ones and only then exits.
- **Backward-compatible migrations**: during the rollout, old and new code run side by side against the same database, so the schema must suit both.

If any one of these is missing, users will see errors for a few seconds or minutes on every deploy, even with perfect infrastructure.

## Rolling restarts

In a rolling update the orchestrator (Kubernetes, Docker Swarm, Nomad, or a script behind a load balancer) replaces instances in small batches:

1. Start one new instance.
2. Wait until it passes the readiness check.
3. Add it to the load balancer.
4. Remove one old instance from the balancer, let it drain, stop it.
5. Repeat until all instances run the new version.

The key settings are **how many extra instances may exist** during the update and **how many may be unavailable**. For zero downtime, allow zero unavailable instances and at least one extra.

Alternatives with the same goal: **blue-green** (two full environments, traffic switches at once) and **canary** (a small share of traffic goes to the new version first). Both still depend on health checks and draining.

## Health checks: liveness vs readiness

Do not mix these two:

- **Readiness** answers "may I receive traffic right now?". It should fail during startup, while warming caches, and during shutdown.
- **Liveness** answers "am I stuck and need a restart?". Keep it simple; do not check the database here, or a database hiccup will restart every instance at once.

A readiness endpoint that always returns 200 is the most common reason "zero-downtime" deploys still drop requests.

## Graceful shutdown and connection draining

When the orchestrator stops a container it sends **SIGTERM**, waits for a grace period, then sends SIGKILL. Your app must use that window. A minimal Node.js example:

```js
const express = require('express');
const app = express();
let shuttingDown = false;

app.get('/healthz/ready', (req, res) => {
  res.status(shuttingDown ? 503 : 200).end();
});

const server = app.listen(3000);

process.on('SIGTERM', () => {
  shuttingDown = true;
  setTimeout(() => {
    server.close(() => process.exit(0));
  }, 5000);
});
```

The order matters: first mark the instance as not ready, wait a few seconds so the load balancer stops routing to it, then close the server, which lets open requests finish. Background workers should stop taking new jobs and finish or return the current one.

## A working Kubernetes example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  template:
    metadata:
      labels:
        app: api
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: api
          image: registry.example.com/api:1.4.2
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /healthz/ready
              port: 3000
            periodSeconds: 5
            failureThreshold: 2
```

`maxUnavailable: 0` keeps full capacity, `maxSurge: 1` adds one pod at a time, and the grace period must be longer than your drain delay plus the slowest request.

## Backward-compatible database migrations

Use the **expand and contract** pattern. Example: renaming `name` to `full_name`.

| Release | Database | Code |
|---|---|---|
| 1. Expand | Add `full_name`, nullable | Write to both columns, read `name` |
| 2. Backfill | Copy data in batches | Same |
| 3. Switch | No change | Read and write `full_name` only |
| 4. Contract | Drop `name` | Same |

Rules that follow from it:

- Never rename or drop a column in the same release that stops using it.
- Add new columns as nullable or with a default.
- Run heavy data copies in batches, not in one locking statement.
- Run migrations as a separate step before the rollout, not on every instance start.

## Common mistakes

- Readiness probe that ignores shutdown state.
- Grace period shorter than the longest request or job.
- Destructive migration shipped together with code.
- Sessions stored in instance memory, so users get logged out when it stops.
- No rollback check: the previous version must also work with the new schema.

## FAQ

### Do I need Kubernetes for zero-downtime deploys?

No. The same steps work with nginx or a cloud load balancer and two or more instances. Kubernetes simply automates the rolling update and probes.

### Is one server enough?

You can run two app processes on one machine and switch traffic between them, but the server itself remains a single point of failure during OS updates or outages.

### How do I roll back safely?

Keep the schema compatible with the previous release and redeploy the old image. That is why destructive schema changes come only after the new code has been stable for a while.
