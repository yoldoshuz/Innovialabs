---
title: Blue-Green vs Canary Deployment: Strategies Compared
description: How blue-green and canary shift traffic, what they cost in infrastructure, how fast they roll back and how to implement both with Nginx and Kubernetes.
summary: Blue-green switches all traffic at once between two full environments — instant rollback, but double infrastructure. Canary moves traffic to the new version gradually — lower risk, but it needs per-version metrics and automated analysis.
---

## The core difference

Both strategies solve the same problem: ship a new version without downtime and with a fast way back. The difference is **how traffic moves**.

- **Blue-green.** There are two identical environments: "blue" (current version) and "green" (new). You deploy to green, verify it and switch **all traffic at once**. Blue stays on standby for rollback.
- **Canary.** A **small share of traffic** goes to the new version. If metrics look healthy, the share grows step by step to 100%. If not, traffic returns to the old version.

## Comparison on key parameters

| Parameter | Blue-green | Canary |
|---|---|---|
| Traffic shift | All at once | Gradually, in steps |
| Infrastructure | Doubled during the release | A small number of extra instances |
| Rollback speed | Instant — switch back | Fast — remove the canary share |
| Blast radius of a bug | All users after the switch | Only the canary share |
| Monitoring needs | Basic checks before switching | Per-version metrics comparing errors and latency |
| Complexity | Lower | Higher |
| Tested on real traffic | Only after the switch | From the first step |

## When to choose which

**Blue-green** fits when:

- you want a simple, predictable release with instant rollback;
- traffic is low and a statistically meaningful canary analysis is not possible anyway;
- the budget allows a second copy of the environment during releases.

**Canary** fits when:

- you have many users and a bug hitting everyone at once is costly;
- you have metrics split by version: error rate, latency, business indicators;
- the team is ready to automate analysis and rollback.

The two are compatible: you can deploy a green environment and shift traffic to it gradually.

## The shared hard part: the database

Both versions run against **the same database** for a while. Schema migrations must therefore be **backward compatible**: add new columns and tables first, ship code that works with both schemas, and only then remove the old parts. Otherwise rolling back the app will not help — the old version cannot work with the new schema.

## Implementing with Nginx

**Blue-green** — two upstreams and a switch of one line followed by `nginx -s reload`:

```nginx
upstream blue  { server 10.0.0.10:8080; }
upstream green { server 10.0.0.20:8080; }

server {
    listen 80;
    location / {
        proxy_pass http://green;  # switch: green <-> blue
    }
}
```

**Canary** — weights inside one upstream:

```nginx
upstream app {
    server 10.0.0.10:8080 weight=9;  # stable version
    server 10.0.0.20:8080 weight=1;  # canary
}
```

To keep a user from bouncing between versions, use stickiness by cookie or hash (`hash $cookie_user_id consistent;`) — but then distribution depends on the key rather than the weights.

## Implementing with Kubernetes

- **Blue-green.** Two Deployments labeled `version: blue` and `version: green`. The Service selects pods by label; switching means changing `version` in the Service selector.
- **Basic canary.** Two Deployments behind one Service; the traffic share roughly equals the replica share. Coarse, but needs no extra tools.
- **Canary via Ingress.** Ingress controllers such as ingress-nginx support canary annotations with a weight or header and cookie rules.
- **Automated canary.** Argo Rollouts, Flagger or a service mesh manage the steps, check metrics and roll back automatically.

## Common mistakes

- Incompatible database migrations that make rollback impossible.
- Canary without per-version metrics — you cannot tell what broke.
- Canary steps that are too short: problems that appear under load or over time do not have a chance to surface.
- Deleting the blue environment right after the switch, while a rollback may still be needed.

## FAQ

### Which is cheaper in infrastructure?

Usually canary: extra resources are needed only for a small share of traffic. Blue-green requires a full second copy of the environment at least during the release.

### Can I run canary with little traffic?

You can, but a few percent of traffic may produce too few requests for reliable conclusions. In that case lengthen the steps or use blue-green with thorough checks before switching.

### How is canary different from feature flags?

Canary splits traffic between deployed versions of the application. **Feature flags** turn features on inside one version for selected users. They are often used together.
