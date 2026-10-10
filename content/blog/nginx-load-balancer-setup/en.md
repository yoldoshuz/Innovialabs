---
title: How to Configure Nginx as a Load Balancer
description: A practical guide to Nginx load balancing: upstream blocks, balancing methods, passive health checks, weights, backup servers and sticky sessions.
summary: List your app servers in an upstream block, pick a method (round-robin, least_conn, ip_hash or hash), set max_fails and fail_timeout, and point proxy_pass at it — Nginx then spreads requests and skips failed servers.
---

## The short answer

Load balancing in Nginx has two parts: an **upstream** block that lists your servers and a **proxy_pass** directive that sends requests to it. A minimal working setup:

```nginx
upstream app_backend {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

By default requests are distributed in turn (**round-robin**). From here, tune the setup to your traffic.

## How to choose a balancing method

The method goes on the first line inside `upstream`.

| Method | How it works | When it fits |
|---|---|---|
| round-robin (default) | In turn, respecting weights | Identical servers, short requests |
| `least_conn` | To the server with the fewest active connections | Requests of varying length, WebSocket, uploads |
| `ip_hash` | One client IP maps to one server | Simple client affinity without cookies |
| `hash $key consistent` | Server chosen by any key | Affinity by cookie, URL or header; caches |
| `random two least_conn` | Two random servers, the less loaded wins | Several balancers in front of one pool |

For most web applications, `least_conn` is a sensible starting point.

## Passive health checks

Open source Nginx checks servers **passively**, based on real requests. The parameters are set per server:

```nginx
upstream app_backend {
    least_conn;
    server 10.0.0.11:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:3000 max_fails=3 fail_timeout=30s;
}
```

- **max_fails** — how many failed attempts within `fail_timeout` mark a server as unavailable.
- **fail_timeout** — both the window for counting failures and how long the server stays excluded.

What counts as a failure is controlled by `proxy_next_upstream`. By default that is a connection error or timeout. You can add response codes:

```nginx
proxy_next_upstream error timeout http_502 http_503;
proxy_next_upstream_tries 2;
```

Be careful with non-idempotent requests: retrying a POST on another server can create a duplicate order. Nginx does not retry them by default, so enable `non_idempotent` only deliberately. Active checks (`health_check`) exist only in the commercial NGINX Plus; with open source Nginx, use external monitoring instead.

## Weights and backup servers

If your servers differ in capacity, use **weight**:

```nginx
upstream app_backend {
    server 10.0.0.11:3000 weight=3;
    server 10.0.0.12:3000 weight=1;
    server 10.0.0.13:3000 backup;
    server 10.0.0.14:3000 down;
}
```

- `weight=3` — the server gets roughly three times as many requests.
- `backup` — used only when all primary servers are unavailable. It cannot be combined with `hash`, `ip_hash` or `random`.
- `down` — the server is temporarily out of rotation, handy for maintenance.

## Sticky sessions

Pinning a user to a server matters when sessions live in application memory. Open source Nginx offers two options:

```nginx
# by client IP
ip_hash;

# by session cookie
hash $cookie_sessionid consistent;
```

`ip_hash` works poorly when many users share one IP (an office, a mobile carrier). Cookie-based affinity is more precise. The best option, though, is to drop sticky sessions entirely and store sessions in **Redis** or a database: any server can then handle any request, and scaling and deployments get simpler.

## Connections to the backend

To avoid opening a new TCP connection for every request, enable **keepalive**:

```nginx
upstream app_backend {
    least_conn;
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
    keepalive 32;
}

location / {
    proxy_pass http://app_backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
}
```

## Common mistakes

- Not passing `Host` and `X-Forwarded-For` — the app sees the wrong domain and the balancer's IP.
- `max_fails=0` — checks are off, and requests keep hitting a dead server.
- In-memory sessions without affinity — users get logged out at random.
- Changing the config without testing it: always run `nginx -t`, then `nginx -s reload`.

## FAQ

### How many servers do I need for load balancing?

At least two, otherwise there is nothing to balance. Nginx itself is still a single point of failure, so critical systems run two balancers sharing a floating IP or use a cloud provider's load balancer.

### Why is least_conn better than round-robin?

Round-robin ignores that one request takes milliseconds and another takes minutes. `least_conn` sends each new request where there are fewer active connections, so load is spread more evenly when request durations vary.

### Can Nginx balance WebSocket connections?

Yes. Add `proxy_http_version 1.1` and the `Upgrade` and `Connection` headers to the relevant location. For long-lived connections, `least_conn` is the better fit.
