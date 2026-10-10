---
title: Helm Charts Guide: Packaging Kubernetes Applications
description: How a Helm chart is structured, how values and templates work, how to install public charts, create your own and manage releases, upgrades and rollbacks.
summary: Helm is a package manager for Kubernetes: a chart combines manifest templates with settings in values.yaml, and install, upgrade and rollback manage versions of the installed app as releases.
---

## The short answer

**Helm** packages a set of Kubernetes manifests into a **chart** — a parameterized application template. You install a chart with one command and describe differences between environments (replicas, domains, resources) in a **values** file. Every installation is a **release** with a version history, so upgrades and rollbacks are one command each.

Helm is useful when the same app has to be deployed to several environments, or when you install ready-made software — databases, monitoring, Ingress controllers.

## Chart structure

```text
mychart/
  Chart.yaml          # name, chart version and app version
  values.yaml         # default parameters
  templates/          # manifest templates
    deployment.yaml
    service.yaml
    _helpers.tpl      # shared template snippets
  charts/             # dependencies
```

- **version** in `Chart.yaml` is the version of the chart itself; **appVersion** is the version of the app inside it.
- Everything in `templates/` is rendered into plain YAML manifests.

## Values and templates

Templates use Go template syntax. Values come from `values.yaml`:

```yaml
# values.yaml
replicaCount: 2
image:
  repository: registry.example.com/shop/api
  tag: "1.0.0"
```

```yaml
# templates/deployment.yaml (excerpt)
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

Create a file per environment, for example `values-prod.yaml`, and pass it at install time. Individual values can be overridden with `--set`, but for permanent settings a file is better: it lives in Git.

## Installing public charts

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo redis
helm show values bitnami/redis > redis-values.yaml
helm install cache bitnami/redis -f redis-values.yaml -n data --create-namespace
```

Before installing, **read the default values**: they show what is enabled, which resources are requested and how data storage is configured.

## Your own chart

```bash
helm create mychart
helm lint mychart
helm template mychart -f values-prod.yaml
helm install api ./mychart -f values-prod.yaml -n shop
```

- `helm create` generates a scaffold you usually trim down.
- `helm lint` catches structural errors.
- `helm template` renders the final manifests without installing — your main debugging tool.

## Releases, upgrades and rollbacks

```bash
helm upgrade api ./mychart -f values-prod.yaml -n shop
helm upgrade --install api ./mychart -f values-prod.yaml -n shop
helm history api -n shop
helm rollback api 3 -n shop
helm uninstall api -n shop
```

- `upgrade --install` is handy in CI/CD: it installs the release if it doesn't exist and upgrades it if it does.
- `rollback` restores the configuration of a chosen revision from history.
- The `--atomic` flag rolls back a failed upgrade automatically.

## Common mistakes

- Storing passwords directly in `values.yaml` in Git. Use Secrets, encrypted values or an external store.
- Installing a public chart without pinning a version (`--version`) — the next install may pull a different one.
- Changing release resources via `kubectl edit` — the next `helm upgrade` overwrites those changes.
- Overloading templates with conditionals until they're unreadable. If the chart is more complex than the app, simplify.

## FAQ

### How is Helm different from Kustomize?

Helm works with templates and parameters and manages releases. Kustomize applies patches to plain YAML without templating. They can be combined; the choice depends on what your team finds easier to maintain.

### Where should I keep my charts?

In the same repository as the app or in a separate one. For distribution, use Helm repositories or OCI registries, which many container registries already support.

### Can I see what an upgrade will change before running it?

Yes. Compare the `helm template` output with the current manifests, or use the helm-diff plugin, which shows the difference before an upgrade.
