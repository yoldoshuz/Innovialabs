---
title: kubectl Cheat Sheet: Commands You Use Every Day
description: Everyday kubectl commands grouped by task: viewing resources, logs, exec, port-forward, scaling, rollouts, contexts and namespaces, with examples.
summary: Most daily Kubernetes work fits into about ten kubectl commands: get, describe, logs, exec, port-forward, scale, rollout, plus switching context and namespace.
---
## The kubectl commands you actually need

Day-to-day cluster work needs a small set: **get** and **describe** to see state, **logs** and **exec** to investigate problems, **port-forward** to reach a service locally, **scale** and **rollout** to manage deployments, and **config** to switch between clusters. Below they are grouped by task.

## Viewing resources

```bash
kubectl get pods                      # pods in the current namespace
kubectl get pods -A                   # pods in all namespaces
kubectl get pods -o wide              # plus node and IP
kubectl get deploy,svc,ingress        # several types at once
kubectl get pods -l app=api           # filter by label
kubectl get pod api-7d9f -o yaml      # full manifest
kubectl describe pod api-7d9f         # details and events
kubectl get events --sort-by=.metadata.creationTimestamp
```

**describe** is the first thing to run when a pod will not start: the Events section shows whether the image failed to pull, resources ran out or a probe failed.

## Logs

```bash
kubectl logs api-7d9f                 # pod logs
kubectl logs -f api-7d9f              # follow in real time
kubectl logs api-7d9f -c worker       # a specific container
kubectl logs api-7d9f --previous      # logs of the crashed instance
kubectl logs deploy/api --tail=100    # last lines from a pod of the deployment
kubectl logs -l app=api --since=10m   # by label, last 10 minutes
```

The **--previous** flag is essential for CrashLoopBackOff: the current container has just restarted, and the reason for the crash lives in the previous one's logs.

## Exec and debugging inside a pod

```bash
kubectl exec -it api-7d9f -- sh       # interactive shell
kubectl exec api-7d9f -- env          # single command
kubectl exec -it api-7d9f -c worker -- sh
```

If the image has no shell (distroless images), use **kubectl debug** with a separate debug container.

## Port-forward

```bash
kubectl port-forward pod/api-7d9f 8080:3000
kubectl port-forward svc/postgres 5432:5432
```

This lets you open a database or internal service on your machine without exposing it publicly. The connection lives as long as the command runs.

## Scaling and rollouts

```bash
kubectl scale deploy/api --replicas=3
kubectl rollout status deploy/api     # wait for the rollout to finish
kubectl rollout history deploy/api    # revision history
kubectl rollout undo deploy/api       # roll back to the previous revision
kubectl rollout restart deploy/api    # restart pods without changing the manifest
kubectl set image deploy/api api=registry/api:1.4.2
```

**rollout restart** is handy after updating a Secret or ConfigMap mounted as environment variables: pods are recreated one by one, without downtime under a normal RollingUpdate strategy.

## Contexts and namespaces

```bash
kubectl config get-contexts           # list clusters
kubectl config current-context
kubectl config use-context prod
kubectl config set-context --current --namespace=backend
kubectl get ns
```

The `set-context` line saves you from typing `-n backend` on every command.

## Applying and deleting manifests

```bash
kubectl apply -f k8s/                 # apply a folder
kubectl diff -f k8s/                  # preview changes
kubectl delete -f k8s/job.yaml
kubectl top pods                      # CPU and memory (requires metrics-server)
```

## Common mistakes

- **Working in the wrong context.** Check `current-context` before risky commands, especially when prod is configured nearby.
- **Forgetting the namespace.** An empty `get pods` output often means you are looking in the wrong place.
- **Editing live resources with edit.** `kubectl edit` is fine for experiments, but changes are lost on the next `apply` from the repository.
- **Deleting a pod instead of fixing the cause.** A pod managed by a Deployment is recreated with the same error.

## FAQ

### What is the difference between kubectl apply and kubectl create?

`create` creates a resource and fails if it already exists. `apply` is declarative: it creates or updates the resource to match the file, which makes it the right choice for CI/CD and manifests stored in Git.

### How do I quickly find out why a pod is not starting?

Run `kubectl describe pod <name>` and read the Events at the bottom, then `kubectl logs <name> --previous` if the container has already crashed.

### Can I shorten long commands?

Yes. Many people set an alias `k=kubectl` and use short resource names: `po`, `deploy`, `svc`, `ns`. Enabling shell autocompletion helps too; the official kubectl documentation explains how.
