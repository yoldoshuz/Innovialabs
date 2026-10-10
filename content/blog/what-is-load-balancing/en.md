---
title: What Is Load Balancing and How a Load Balancer Works
description: A plain explanation of load balancing: L4 vs L7, health checks, session persistence and where the load balancer sits in a web architecture, with an nginx example.
summary: A load balancer receives incoming requests and spreads them across several servers while skipping unhealthy ones, so a service handles more traffic and keeps working when one server fails.
---
## The short answer

A **load balancer** is the entry point that sits in front of a group of identical servers and decides which one gets the next request. Clients see one address; behind it run two, ten or a hundred instances of your application.

It does three things:

- **spreads load** so no server is overloaded while others idle;
- **adds fault tolerance** by automatically removing failed servers from rotation;
- **adds flexibility**: you can add, remove and update servers without clients noticing.

## Where it sits in the architecture

A typical request path in a web app:

1. User → DNS → **CDN** (optional).
2. → **Load balancer** (cloud LB, nginx, HAProxy, Traefik).
3. → Several **application** instances.
4. → Database, cache, queues.

The load balancer often **terminates TLS** (the HTTPS certificate lives there), compresses responses and applies rate limits. Balancers also appear inside a system: between microservices, or in front of read replicas.

Note that the balancer itself can become a single point of failure. Cloud load balancers are made redundant by the provider; for your own nginx or HAProxy you run a pair of nodes sharing a floating IP.

## L4 vs L7

| | L4 (transport layer) | L7 (application layer) |
|---|---|---|
| Sees | IP addresses, ports, TCP/UDP | HTTP: path, headers, cookies, host |
| Decisions | "This connection goes to server B" | "`/api` goes to the backend, `/static` to storage" |
| Speed | Faster, less overhead | Slightly slower, far more flexible |
| TLS | Usually passes encrypted traffic through | Usually decrypts and inspects it |
| Examples | Cloud network LBs, HAProxy in TCP mode | nginx, HAProxy in HTTP mode, Traefik, cloud ALBs |

**L4** works for any TCP protocol: databases, MQTT, game servers. **L7** is what you need when routing depends on request content: multiple domains, API versions, canary releases.

## Health checks

The balancer regularly checks every server:

- **passive checks** remove a server when real requests return errors or time out;
- **active checks** have the balancer poll a dedicated endpoint, such as `GET /health`, on an interval.

A good health check confirms the app **can actually serve requests** without dragging in every dependency. If `/health` fails whenever the database is slow, the balancer may pull every server out of rotation at once.

## Session persistence

Sometimes one user must always land on the same server, for example when the session lives in process memory. This is called **sticky sessions**. Options:

- a cookie set by the balancer;
- a hash of the client's IP address.

Downsides: load spreads less evenly, and users lose their session when their server dies. A sturdier approach is to keep sessions in an external store (Redis, a database) or in a token, so stickiness is not needed.

## An nginx example

```nginx
upstream app {
    server 10.0.0.11:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Here nginx acts as an L7 balancer with passive checks: after a few failed attempts a server is temporarily taken out.

## Common mistakes

- **A single balancer with no standby**: the app is redundant, the entrance is not.
- **An over-clever health check** that depends on everything.
- **Losing the real client IP** by forgetting `X-Forwarded-For` or proxy protocol.
- **Balancer timeouts shorter than slow requests**: file uploads, reports, WebSockets.

## FAQ

### Do I need a load balancer with only one server?

Not for spreading load. A reverse proxy in front of the app (nginx, Caddy) still helps with TLS, compression and static files, and makes moving to several servers easier later.

### How is a load balancer different from a reverse proxy?

A reverse proxy accepts requests on behalf of a backend. A load balancer is a reverse proxy that spreads requests across multiple backends. In practice nginx and HAProxy do both.

### Can I balance with DNS?

You can list several IPs in a DNS record and clients will use different ones. But DNS is cached and knows nothing about server health, so it is better suited to spreading traffic across regions than to replacing a real load balancer.
