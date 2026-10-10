---
title: Horizontal vs Vertical Scaling: How to Scale an Application
description: How scaling up differs from scaling out, the limits of each, what makes an app stateless and scalable, and when it is time to switch approaches.
summary: Vertical scaling means a bigger server; horizontal scaling means more servers behind a load balancer. Scaling up is the easier start, but long-term growth and fault tolerance require a stateless app ready to scale out.
---

## The short answer

**Vertical scaling (scale up)** means giving one server more resources: more CPU, more memory, faster disks. No code changes are needed.

**Horizontal scaling (scale out)** means running several copies of your application on different servers and spreading traffic between them with a **load balancer**. It requires some architectural preparation, but it has almost no ceiling and gives you fault tolerance.

## Side-by-side comparison

| Criterion | Vertical | Horizontal |
|---|---|---|
| Code changes | None | Required: statelessness, shared sessions |
| Ceiling | The largest server available | Practically none |
| Fault tolerance | Single point of failure | One node failing is not critical |
| Downtime when growing | Often a restart | Nodes are added without stopping |
| Operational complexity | Low | Higher: load balancer, node monitoring |
| Cost | Powerful hardware gets disproportionately expensive | Many cheap nodes, more maintenance |

## Limits of scaling up

- **Physical ceiling.** At some point there is no bigger server, or it costs far more than it is worth.
- **Single point of failure.** If the server goes down, everything goes down.
- **Downtime on upgrades.** Changing plans or hardware usually means a reboot.
- **Not everything gets faster.** If the app is bound by single-threaded code or database locks, extra cores help little.

Still, scaling up is a sensible start: it is fast, cheap to maintain and covers the growth of most small projects.

## What makes an app horizontally scalable

The key rule: **any instance must be able to handle any request**. To get there:

- **Stateless service.** Do not keep user state in process memory.
- **Shared sessions.** Store sessions in Redis, a database or signed tokens (such as JWT), not in one server's memory.
- **Files in external storage.** Put user uploads in object storage (S3-compatible), not on a local disk.
- **Background jobs through a queue.** A cron job on every node runs the task N times; use a queue or a distributed lock.
- **Shared cache.** A local cache on each node leads to inconsistent data.
- **Health checks.** The load balancer needs an endpoint like `/health` to know which node is alive.

A minimal load-balancing example in nginx:

```nginx
upstream app {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://app;
    }
}
```

## What about the database

The application scales out easily; the database is harder. The usual sequence:

1. Scale the database server up and optimize queries and indexes.
2. Move reads to **read replicas**.
3. Cache hot data.
4. Only when truly necessary, use **sharding** — it adds significant complexity.

## When to switch to scaling out

- Load regularly hits one server's limits, and the next tier is disproportionately expensive.
- Downtime is unacceptable and you need fault tolerance.
- Traffic fluctuates a lot, so adding nodes on demand (autoscaling) pays off.
- You need to update the app without stopping it (rolling deploys).

## Common mistakes

- Scaling out without removing in-memory state, so users keep getting logged out.
- Adding servers when the real bottleneck is slow database queries.
- Skipping monitoring and not knowing what is actually saturated: CPU, memory, disk or network.

## FAQ

### Where should a small project start?

With vertical scaling and optimizing code and queries. But build the app stateless from day one, so moving to several servers later does not require a rewrite.

### Do I need Kubernetes to scale horizontally?

No. For a few nodes, a load balancer such as nginx or a cloud load balancer is enough. Kubernetes pays off when you have many services and nodes and need automation.

### Can both approaches be combined?

Yes, and that is the typical setup: choose a reasonable node size vertically, then increase the number of nodes horizontally.
