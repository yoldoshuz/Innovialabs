---
title: Cloud Vendor Lock-In: Risks and How to Stay Portable
description: Where cloud vendor lock-in comes from, when a multi-cloud setup is justified and practical steps that keep a realistic exit path to another provider.
summary: Lock-in comes from proprietary services, egress fees and closed data formats; you do not need to avoid it entirely, but you should choose deliberately where you get locked in and keep a working exit path.
---
## The short answer

**Vendor lock-in** is when moving to another cloud provider becomes so expensive or slow that it is effectively impossible. You cannot avoid lock-in completely, and usually you should not try: managed services save your team real time. The goal is to **get locked in on purpose**: know exactly what would be hard to move and have an exit plan.

## Where lock-in comes from

**Proprietary services.** Queues, databases, functions, AI services and authentication systems differ between providers. The more logic depends on their APIs, the more code you rewrite when you move.

**Egress fees.** Getting data into a cloud is usually cheap or free; getting it out costs money. For large data volumes this becomes a real barrier.

**Data formats and schemas.** Some services store data in formats or models with no direct equivalent elsewhere. Export is possible but needs transformation.

**Infrastructure and processes.** IAM policies, networking, monitoring, CI/CD and team skills are tuned to one provider. This is lock-in too, even if it is rarely counted.

**Contract terms.** Discounts for long-term spend commitments are attractive but reduce flexibility.

## Risk by layer

| Layer | Example | Difficulty to move |
|---|---|---|
| Virtual machines, containers | VMs, Kubernetes | Low |
| Standard databases | Managed PostgreSQL, MySQL | Low to medium |
| Object storage with S3-compatible API | S3 and alternatives | Low to medium |
| Serverless and integrations | Functions, event triggers | Medium to high |
| Proprietary databases and services | Unique NoSQL, analytics, AI services | High |

## When multi-cloud makes sense

**Multi-cloud** means running in several clouds at once. It adds complexity: two permission systems, two networks, two billing models and more knowledge required from the team. It is justified when:

- regulation forbids depending on a single supplier;
- you need a service only another provider offers (a specific AI model, for example);
- critical systems must survive a full provider outage;
- data residency rules require regions your main cloud does not have.

For most small and mid-sized projects, **one provider plus a ready exit plan** is more sensible than permanent multi-cloud.

## How to keep an exit path

1. **Containerize applications.** A Docker image runs almost anywhere, from a VPS to any cloud's Kubernetes.
2. **Prefer open standards.** PostgreSQL over a unique database, an S3-compatible API for files, OpenTelemetry for metrics and tracing.
3. **Describe infrastructure as code.** Terraform or OpenTofu will not make a move automatic, but they document everything you need to recreate.
4. **Hide proprietary pieces behind an interface.** If you use a unique queue or AI service, wrap the calls in your own module so that only it needs to change.
5. **Export data regularly** in open formats and keep a copy outside your main provider.
6. **Estimate egress early.** Work out your data volume and the cost of pulling it out before it grows large.
7. **Rehearse the exit.** Deploy at least a test copy on another provider. Nothing shows the real pain points better.

## Common mistakes

- Fighting lock-in at any cost and refusing useful managed services.
- Building multi-cloud "just in case" without a real reason.
- Ignoring data export costs when choosing an architecture.
- Keeping backups only in the same cloud as the primary data.

## FAQ

### Does Kubernetes solve lock-in completely?

No. It makes the applications themselves portable, but databases, storage, networking, load balancers and IAM still depend on the provider. Kubernetes reduces lock-in at the compute layer, not across the whole system.

### Should we avoid serverless because of lock-in?

Not necessarily. If business logic lives in separate modules and functions are a thin wrapper around it, a move mostly affects configuration and triggers. The key is not to bury your whole architecture inside functions.

### How do we know how locked in we already are?

List every provider service you use and, for each one, answer: is there an open or equivalent option elsewhere, how much code touches it and how much data lives in it. That list is your risk map.
