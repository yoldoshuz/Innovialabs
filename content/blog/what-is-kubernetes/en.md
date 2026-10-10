---
title: What Is Kubernetes and When Does Your Project Need It
description: Kubernetes in plain words: what orchestration is, the control plane and nodes, what it automates, and when a small project is better off without it.
summary: Kubernetes is a system that starts, restarts, scales and updates containers across a group of servers for you. It pays off with many services, several servers and uptime requirements; a small project usually does fine with Docker Compose or a PaaS.
---
## Kubernetes in a nutshell

**Kubernetes** (K8s) is a **container orchestration** platform. You describe the desired state: "run three copies of the API, expose them at this address, give them this much memory". Kubernetes constantly compares reality with that description and fixes any difference: it restarts crashed containers, moves them off a failed server and rolls out new versions.

Docker answers "how do I package and run one container". Kubernetes answers "how do I manage hundreds of containers on dozens of servers so that everything keeps running without manual work".

## What a cluster is made of

A Kubernetes cluster has two parts.

**Control plane** — the brain of the cluster:

- **API server** — the single entry point. Every command (`kubectl`, CI/CD, dashboards) goes through it.
- **etcd** — the store for cluster state: what should run and where.
- **Scheduler** — decides which node runs a new container based on free resources.
- **Controller manager** — a set of controllers that bring the actual state in line with the desired one.

**Worker nodes** — the servers where applications run:

- **kubelet** — the agent on each node that starts containers as the control plane instructs.
- **container runtime** — the software that actually runs containers (for example, containerd).
- **kube-proxy** — handles network routing to services.

In managed offerings from cloud providers, the provider runs the control plane, and you only deal with nodes and your applications.

## What Kubernetes automates

- **Self-healing.** A container crashes — it is restarted. A node fails — its pods move elsewhere.
- **Scaling.** The number of copies changes with one command or automatically based on load.
- **Zero-downtime updates.** A rolling update gradually replaces old copies with new ones and can roll back.
- **Service discovery and load balancing.** Services find each other by name, and traffic is spread across copies.
- **Configuration and secrets.** Settings and passwords live separately from the image.
- **Declarative setup.** All infrastructure is described in YAML files that live in Git and go through review.

## When you do not need Kubernetes

Kubernetes solves real problems, but it is complex in its own right. It requires knowledge, time for maintenance, monitoring and cluster upgrades. Honest signs that your project does not need it yet:

- the app runs on **one or two servers**, and that is fine;
- there are **few services**, and they rarely change;
- nobody on the team is **ready to own** the cluster;
- a short downtime during deploys is **acceptable**;
- the project is an **MVP**, and the main goal is to test a hypothesis fast.

In these cases **Docker Compose** on a server, a **PaaS platform** or a cloud's managed container service is enough. Moving to Kubernetes later is easier if the app is already containerised and configured through environment variables.

## When Kubernetes is worth it

- many services that different teams release independently;
- load varies noticeably, and you need autoscaling;
- **high availability** requirements: losing one server must not stop the product;
- frequent releases and a need for one standard deployment process;
- several environments (dev, staging, prod) that must stay identical.

## How to decide

| Question | Leaning Compose / PaaS | Leaning Kubernetes |
|---|---|---|
| How many servers? | one or two | several or more |
| How many services? | a handful | dozens |
| DevOps expertise on the team? | no | yes |
| Is downtime acceptable? | yes, briefly | no |
| Load pattern | stable | spiky, growing |

If most answers land in the left column, start simpler. Project documentation: [kubernetes.io](https://kubernetes.io/docs/concepts/overview/).

## FAQ

### Does Kubernetes replace Docker?

No. Docker (or another tool) builds images, and Kubernetes manages how they run on a cluster. Images built with Docker run in Kubernetes unchanged.

### Can Kubernetes run on a single server?

Yes, there are lightweight single-node distributions. But you lose the main benefit — surviving a server failure — while keeping the complexity.

### Self-managed or managed cluster?

For most teams a managed cluster is simpler: the provider handles control plane upgrades and availability. A self-managed cluster makes sense with special requirements for data location or infrastructure.
