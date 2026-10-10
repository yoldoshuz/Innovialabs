---
title: Kubernetes Ingress: How to Route External Traffic to Services
description: How Ingress differs from LoadBalancer and NodePort, how to install ingress-nginx, set up host and path routing and attach TLS certificates with cert-manager.
summary: Ingress is a single entry point for HTTP(S) traffic that routes requests to services by host and path; it needs an Ingress controller such as ingress-nginx, and cert-manager handles TLS certificates.
---

## The short answer

**Ingress** is a set of HTTP and HTTPS routing rules: "send requests for `shop.example.com` to the `web` service and `/api` to the `api` service". The Ingress object does nothing on its own: an **Ingress controller** enforces it, most often ingress-nginx. The controller gets one external address and distributes traffic among services. **cert-manager** issues and renews TLS certificates automatically.

## NodePort, LoadBalancer or Ingress

| Option | How it works | When it fits |
|---|---|---|
| **NodePort** | Opens a port on every node | Tests, local clusters, non-standard protocols |
| **LoadBalancer** | The cloud provisions a separate external load balancer per service | A single service or TCP/UDP traffic |
| **Ingress** | One entry point, routing by host and path | Several HTTP services behind one address |

Ingress saves load balancers and keeps TLS, redirects and routing in one place. The controller itself is usually exposed through a Service of type LoadBalancer (in the cloud) or NodePort (on your own servers).

## Installing ingress-nginx

Helm is the easiest way:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace
kubectl get svc -n ingress-nginx
```

Find the controller's **EXTERNAL-IP** in the output and point your domains' DNS records at it.

## Host and path routing

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop
spec:
  ingressClassName: nginx
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 80
```

What matters:

- **ingressClassName** tells which controller handles the rule. Without it the Ingress may simply be ignored.
- **pathType: Prefix** matches the path and everything below it; `Exact` matches only the exact path.
- An Ingress points to a **Service**, not to pods, and must live in the same namespace as those services.

## TLS with cert-manager

cert-manager obtains certificates, for example from Let's Encrypt, and renews them on its own.

```bash
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace --set crds.enabled=true
```

Then create a **ClusterIssuer**:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-key
    solvers:
      - http01:
          ingress:
            ingressClassName: nginx
```

And add an annotation and a `tls` block to the Ingress:

```yaml
metadata:
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  tls:
    - hosts:
        - shop.example.com
      secretName: shop-tls
```

Check issuance with `kubectl get certificate` — the Ready status should turn True.

## Common mistakes

- DNS doesn't point to the controller yet — the HTTP-01 challenge fails and no certificate is issued.
- Missing `ingressClassName` or the wrong class.
- The Ingress is in one namespace and the Service in another.
- The app expects paths without the `/api` prefix, but the Ingress passes them as is. Fix it in the app or with the controller's rewrite annotations.

## FAQ

### Can I do without Ingress?

Yes. If you have a single service, a Service of type LoadBalancer is enough. Ingress pays off when several domains or services sit behind one address.

### How is Ingress different from the Gateway API?

The Gateway API is a newer, more flexible Kubernetes routing standard with role separation. Ingress is simpler and supported almost everywhere; for a typical web project it is enough.

### Do I need to renew certificates manually?

No. cert-manager tracks expiry dates and renews certificates ahead of time, updating the Secret the Ingress uses.
