---
title: Load Balancing Algorithms: Round Robin, Least Connections and More
description: How a load balancer picks a server: round robin, weighted, least connections, IP hash and other algorithms, with their strengths, weaknesses and use cases.
summary: Round robin is usually enough for stateless APIs, least connections suits long-lived connections like WebSocket or streaming, weighted variants handle uneven servers, and IP hash is only for when sticky sessions are unavoidable.
---
## Short answer: which algorithm to choose

A **load balancer** receives incoming requests and spreads them across several backend servers. The algorithm decides *which* server gets the next request.

Quick guide:

- **Identical servers, short stateless requests** → round robin.
- **Servers of different capacity** → weighted round robin or weighted least connections.
- **Long-lived connections** (WebSocket, file uploads, streaming) → least connections.
- **A client must keep hitting the same server** → IP hash or consistent hashing.
- **Server response times vary a lot** → least response time or power of two choices, if your balancer supports them.

## Round robin

Requests go around in a circle: the first to server A, the second to B, the third to C, then back to A.

- **Pros:** simple, predictable, needs no knowledge of server state.
- **Cons:** ignores that one request takes milliseconds and another takes seconds. A slow server gets as many requests as a fast one.
- **Best for:** stateless APIs behind identical servers where requests are roughly equal in weight.

## Weighted round robin

Same idea, but each server gets a **weight**. A server with weight 3 receives three times as many requests as one with weight 1.

- **Best for:** pools with machines of different power, or gradually ramping a new server into traffic.
- **Con:** weights are set manually and do not react to current load.

## Least connections

A new request goes to the server with the **fewest active connections**.

- **Pros:** adapts to uneven load on its own. If a server is stuck on heavy requests, new ones go elsewhere.
- **Cons:** the balancer must track connections; with very short requests the difference from round robin is barely visible.
- **Best for:** WebSocket, long polling, file uploads, requests with unpredictable duration.

There is also **weighted least connections**, which considers both connections and server weight.

## IP hash and consistent hashing

The server is chosen by hashing the client IP (or another key such as a cookie or user ID). The same client consistently lands on the same server, which is called **sticky sessions**.

- **Pros:** an in-memory session is not lost, local caches work better.
- **Cons:** load can be uneven (many users behind one NAT share one IP). Adding or removing a server with a plain hash reshuffles most clients.
- **Consistent hashing** fixes the last problem: when the pool changes, only a small share of keys move. It is used for cache servers and sharding.

The best option is to **make the application stateless** (sessions in Redis or in a token), so sticky sessions are not needed at all.

## Least response time and power of two choices

- **Least response time** considers not only connection count but also the server's average response time. Good for uneven servers, but not supported everywhere and harder to tune.
- **Power of two choices**: the balancer picks two random servers and sends the request to the less loaded one. A simple trick that works well in large pools and with several independent balancers.
- **Random** selection sounds naive, but at high volume it spreads load almost evenly.

## Comparison

| Algorithm | Considers load | Sticky | Best for |
|---|---|---|---|
| Round robin | No | No | Identical servers, stateless APIs |
| Weighted round robin | No (static weights) | No | Servers of different capacity |
| Least connections | Yes | No | Long-lived connections |
| IP hash | No | Yes | Legacy apps with in-memory sessions |
| Consistent hashing | No | Yes | Caches, sharding |
| Power of two choices | Yes | No | Large pools, distributed balancers |

## Example in nginx

```nginx
upstream api {
    least_conn;
    server 10.0.0.11:3000 weight=2;
    server 10.0.0.12:3000;
    server 10.0.0.13:3000 backup;
}
```

Without `least_conn`, nginx uses weighted round robin. A `backup` server only receives traffic when the primary servers are unavailable. See the [nginx documentation](https://nginx.org/en/docs/http/ngx_http_upstream_module.html) for details.

## What matters more than the algorithm

- **Health checks.** The balancer must stop sending traffic to a failed server. Without them, any algorithm sends users to errors.
- **Timeouts and retries.** Decide what happens when a server does not respond, but never retry non-idempotent requests (payments, order creation).
- **Monitoring.** Watch load distribution and response time per server, not just the average.
- **The balancer itself** must not be a single point of failure.

## FAQ

### What works best for most web projects?

If the application is stateless and servers are identical, round robin or least connections will do well. Least connections is a safer default when request durations vary widely.

### Do I need sticky sessions?

Only if the application keeps state in a specific server's memory and you cannot change that yet. Otherwise move sessions to shared storage: scaling and taking servers out for maintenance become much easier.

### What is the difference between L4 and L7 balancing?

L4 works at the TCP/UDP level and sees only addresses and ports: fast, but with no content-based logic. L7 understands HTTP: it can route by path, headers and cookies and terminate TLS. Server selection algorithms apply at both levels.
