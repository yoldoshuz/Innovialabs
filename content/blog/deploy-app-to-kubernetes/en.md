---
title: How to Deploy an Application to Kubernetes Step by Step
description: Step by step from a Docker image to a running Deployment and Service in Kubernetes, with ConfigMap and Secret config, verification and version updates.
summary: Push the image to a registry, describe a Deployment, a Service and config in YAML, apply them with kubectl apply, check rollout status and update the app by changing the image tag.
---

## The short answer

Deploying to Kubernetes means declaring the desired state. You don't start containers by hand; you tell the cluster: "keep 3 copies of this image running and give them an address". The minimal path:

1. Build the image and push it to a **container registry**.
2. Describe a **Deployment** — which image and how many replicas.
3. Describe a **Service** — a stable address for the pods.
4. Move settings into a **ConfigMap** and a **Secret**.
5. Run `kubectl apply` and check the status.

## Step 1. Image in a registry

The cluster pulls the image itself, so it must live in a reachable registry (Docker Hub, GitHub Container Registry, a cloud or self-hosted one).

```bash
docker build -t registry.example.com/shop/api:1.0.0 .
docker push registry.example.com/shop/api:1.0.0
```

Use a **specific version tag**, not `latest`: that way you know exactly what is running and can roll back.

## Step 2. Deployment

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
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/shop/api:1.0.0
          ports:
            - containerPort: 8080
          envFrom:
            - configMapRef:
                name: api-config
            - secretRef:
                name: api-secrets
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 256Mi
```

Key points:

- **labels and selector** must match — that is how the Deployment finds its pods.
- **readinessProbe** keeps traffic away from a pod until the app is ready.
- **resources** help the scheduler and protect the node from a greedy container. Tune the values for your app.

## Step 3. Service

Pods get recreated and change IPs. A Service gives them a permanent name inside the cluster:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8080
```

Other services reach the app at `http://api`. For external access you usually add an Ingress.

## Step 4. Configuration

```bash
kubectl create configmap api-config --from-literal=LOG_LEVEL=info
kubectl create secret generic api-secrets --from-literal=DB_PASSWORD=change-me
```

Don't keep secrets in the image or in plain text in Git. With a GitOps approach, use encrypted secrets or an external secret store.

## Step 5. Apply and verify

```bash
kubectl apply -f deployment.yaml -f service.yaml
kubectl rollout status deployment/api
kubectl get pods -l app=api
kubectl logs deployment/api
```

If a pod doesn't start, begin with `kubectl describe pod <name>` — the Events section shows errors such as `ImagePullBackOff` (the image can't be pulled) or `CrashLoopBackOff` (the app crashes on startup).

## Updating and rolling back

To ship a new version, change the image tag in the YAML and run `kubectl apply` again. By default a Deployment performs a **rolling update**: it brings up new pods and removes old ones gradually, guided by the readinessProbe.

```bash
kubectl rollout history deployment/api
kubectl rollout undo deployment/api
```

## Common mistakes

- The `latest` tag — you can't tell which version is running, and rollbacks become guesswork.
- No readinessProbe — traffic hits pods that aren't ready during an update.
- Manual changes via `kubectl edit` that never make it into YAML — Git and the cluster drift apart.
- Missing `imagePullSecrets` for a private registry.

## FAQ

### Do I need Helm for my first deployment?

No. For a single app, plain YAML manifests and `kubectl apply` are enough. Helm becomes useful once you have several environments and many repeated parameters.

### How is a Deployment different from a pod?

A pod is one running instance. A Deployment makes sure the right number of pods is always running, recreates failed ones and manages updates.

### How do I open the app in a browser?

For a quick check, `kubectl port-forward service/api 8080:80` works. For permanent external access, set up an Ingress or a Service of type LoadBalancer.
