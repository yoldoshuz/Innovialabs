---
title: Kubernetes Pods, Deployments and Services Explained
description: The core Kubernetes objects with minimal YAML examples: what Pods, Deployments and Services are and how they connect to run and expose an application.
summary: A Pod is a running container, a Deployment keeps the right number of Pods running and updates them without downtime, and a Service gives them a stable address. Labels and selectors tie them together.
---
## The short answer

To run an application in Kubernetes you usually need three objects:

- **Pod** — the smallest unit you run: one or more containers sharing a network.
- **Deployment** — describes how many Pods you want and from which image, and keeps that state.
- **Service** — a stable address and load balancer for a group of Pods.

They are linked by **labels**: the Deployment creates Pods labelled `app: web`, and the Service sends traffic to every Pod with that label.

## Pod: where the container lives

A Pod wraps a container. Containers in one Pod share an IP address and can talk over `localhost`. Most Pods hold a single container.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
  labels:
    app: web
spec:
  containers:
    - name: web
      image: nginx:1.27
      ports:
        - containerPort: 80
```

The key property: **Pods are disposable**. If a Pod crashes or its node fails, that Pod does not come back by itself, and a new one gets a different IP. That is why Pods are almost never created by hand — a Deployment does it.

## Deployment: how many copies, which version

A Deployment says: "keep three Pods from this template". If a Pod disappears, the Deployment creates a replacement. If you change the image, it gradually replaces old Pods with new ones.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 256Mi
```

What matters here:

- `replicas` — the desired number of Pods.
- `selector.matchLabels` must match `template.metadata.labels`, or the Deployment is rejected.
- `template` — the Pod template, essentially the Pod from the example above.
- `resources` helps the scheduler place Pods and protects the node from overload.

Under the hood a Deployment creates a **ReplicaSet**, which does the actual Pod counting. You rarely need to touch ReplicaSets directly.

## Service: a stable address

Pod IPs change, so you cannot call Pods directly. A Service gets a permanent name and IP inside the cluster and spreads requests across matching Pods.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

Now other Pods in the same namespace reach the app at `http://web`.

Main Service types:

| Type | Access | When to use |
|---|---|---|
| ClusterIP | inside the cluster only | service-to-service traffic, the default |
| NodePort | a port on every node | tests, simple setups |
| LoadBalancer | a cloud external load balancer | public access in the cloud |

For HTTP sites with domains, you usually add an **Ingress**, which routes requests by host and path to the right Service.

## How it all works together

1. You apply the files: `kubectl apply -f deployment.yaml -f service.yaml`.
2. The Deployment creates a ReplicaSet, which creates three Pods labelled `app: web`.
3. The scheduler places the Pods on nodes.
4. The Service finds Pods by the `app: web` selector and starts sending them traffic.
5. A Pod crashes — the Deployment creates a new one, and the Service adds it to the rotation automatically.

Handy commands to check things:

```bash
kubectl get pods -l app=web
kubectl describe deployment web
kubectl get endpoints web
kubectl rollout status deployment/web
```

## Common mistakes

- **Labels do not match.** The Service selector finds no Pods — `kubectl get endpoints` shows an empty list.
- **`port` and `targetPort` mixed up.** `port` is the Service port, `targetPort` is the container port.
- **Pods without a Deployment.** A hand-made Pod will not survive a node failure.
- **No readiness probe.** The Service may send traffic to a Pod that is not ready to serve yet.
- **The `latest` tag.** It is hard to tell which version is running and to roll back.

More in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/).

## FAQ

### Why do we need a Pod if we have a container?

A Pod groups tightly coupled containers that share network and storage, such as an app and a helper process for logs. Kubernetes schedules and scales Pods, not individual containers.

### How is a Deployment different from a StatefulSet?

A Deployment fits stateless apps where Pods are interchangeable. A StatefulSet is for cases where each copy needs a stable name and its own storage, such as databases.

### How do I expose the app to the internet?

In the cloud, use a Service of type LoadBalancer or, for HTTP, an Ingress with a controller. Ingress is more convenient when one address must serve several domains or paths.
