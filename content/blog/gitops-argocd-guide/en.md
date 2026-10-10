---
title: What Is GitOps and How to Implement It with Argo CD
description: GitOps explained: Git as the source of truth, pull-based deployment, installing Argo CD, structuring environment repos and promoting releases.
summary: GitOps means the desired state of your infrastructure lives in Git, and an in-cluster agent such as Argo CD pulls changes and keeps the cluster matching that state.
---

## What GitOps is in a nutshell

**GitOps** is a way to manage applications and infrastructure where **Git is the single source of truth**. Every Kubernetes manifest, Helm chart or Kustomize overlay lives in a repository. Changing an environment means a commit or pull request, not a manual `kubectl apply`.

The key difference from classic CI/CD is the **pull model**:

- **Push model:** the CI pipeline gets cluster credentials and deploys changes itself.
- **Pull model:** an agent inside the cluster watches Git and applies changes. CI only builds the image and updates the manifest.

Benefits of pulling: cluster credentials never leave the cluster, any manual change shows up as **drift**, and a rollback is just `git revert`.

## How Argo CD works

**Argo CD** is a Kubernetes controller that continuously compares the live cluster with what Git describes.

- **Application** — a resource linking a repository path to a namespace in a cluster.
- **Sync** — bringing the cluster to the Git state, manually or automatically.
- **Self-heal** — automatically reverting manual edits made in the cluster.
- **Prune** — deleting resources that no longer exist in Git.

## Quick installation

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Then describe the application declaratively, also in Git:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: shop-api-staging
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/acme/deploy.git
    targetRevision: main
    path: apps/shop-api/overlays/staging
  destination:
    server: https://kubernetes.default.svc
    namespace: shop-staging
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

See the [official Argo CD documentation](https://argo-cd.readthedocs.io/) for details.

## How to structure repositories

Keep **application code and deployment manifests separate**. Otherwise every code commit triggers needless syncs and access rights get mixed up.

A typical deployment repo layout with Kustomize:

```text
apps/
  shop-api/
    base/
    overlays/
      dev/
      staging/
      production/
```

| Approach | When it fits |
|---|---|
| Folder per environment on one branch | Most teams: everything is visible, diffs between environments are clear |
| Branch per environment | Rarely justified: merging is painful and drift creeps in |
| Separate repository for production | When you need strict access control over prod |

For many applications use the **App of Apps** pattern or an **ApplicationSet** instead of creating each Application by hand.

## Promotion between environments

Promotion means moving a verified version from one environment to the next. In GitOps it is always a change in Git:

1. CI builds an image with an immutable tag, such as the commit SHA.
2. CI or a tool like Argo CD Image Updater bumps the tag in the `dev` overlay.
3. After checks, the same tag moves to `staging` via a pull request.
4. For `production`, a separate PR with mandatory review and, if needed, a manual sync.

The core rule: **production gets exactly the artifact that passed staging**, never a fresh rebuild.

## Common mistakes

- **Plain-text secrets in Git.** Use Sealed Secrets, SOPS or External Secrets Operator.
- **The `latest` tag.** Argo CD will not notice changes, and rollbacks become impossible.
- **Manual edits in the cluster** with self-heal on — they will be silently reverted.
- **One giant Application** for everything: slow syncs and hard troubleshooting.

## FAQ

### Does a small team need GitOps?

If you already run Kubernetes, yes: Argo CD installs quickly and gives you a transparent change history and easy rollbacks. Without Kubernetes, GitOps in this form is usually overkill.

### How is Argo CD different from Flux?

Both implement pull-based GitOps. Argo CD offers a rich web UI and the Application model, while Flux is closer to a set of controllers without a mandatory UI. The choice usually comes down to team preference.

### How do I roll back a bad release?

Run `git revert` on the commit that changed the version, and Argo CD syncs the cluster. Rolling back from the UI also works, but with auto-sync enabled Git will restore its own state again.
