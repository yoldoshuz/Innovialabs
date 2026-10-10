---
title: What Is a Container Registry: Docker Hub, GHCR and Private Registries
description: How Docker images are stored, tagged and pulled in a registry, how popular registries compare, and how to set up tagging and cleanup of old images.
summary: A container registry stores Docker images so servers and CI can pull ready-made builds of your app. Pick a registry close to your CI or cloud, tag images by commit or version and set up automatic cleanup of old ones.
---

## The short answer

A **container registry** is a server that stores **Docker images** and serves them on request. The flow is simple:

1. CI builds the application image.
2. The image is sent to the registry with `push`.
3. A server or Kubernetes downloads it with `pull` and runs the container.

The registry is the bridge between build and run: the exact same image goes to staging and to production.

## How images are stored

A full image name looks like this:

```text
ghcr.io/my-org/api:1.4.2
└registry┘└repository┘└tag┘
```

- **Repository** — the collection of versions of one image.
- **Tag** — a human-readable version label. It can be overwritten.
- **Digest** (`sha256:...`) — an immutable fingerprint of the content. When you need a guarantee that exactly the same image runs, reference the digest.
- **Layers.** An image is made of layers; shared layers are stored and downloaded once, which is why repeated pulls are fast.

A typical cycle:

```bash
docker build -t ghcr.io/my-org/api:1.4.2 .
docker push ghcr.io/my-org/api:1.4.2
docker pull ghcr.io/my-org/api:1.4.2
```

## Popular registries compared

| Registry | Best when | Watch out for |
|---|---|---|
| **Docker Hub** | Public images, open source | Pull rate limits for anonymous and free accounts |
| **GitHub Container Registry (GHCR)** | Code and CI already on GitHub | Access is tied to your GitHub organization |
| **GitLab Container Registry** | Projects on GitLab | Built into the project, convenient with GitLab CI |
| **Cloud (AWS ECR, Google Artifact Registry, Azure ACR)** | Infrastructure in that cloud | Fast pulls inside the cloud, access via IAM |
| **Self-hosted (Harbor, Distribution)** | Data must stay inside the company | Maintenance, backups and updates are on you |

The general rule: keep the registry **close to where images run** — it is faster and usually cheaper on traffic.

## Tagging strategies

- **Do not rely on `latest`.** It is unclear which version is actually running, and rollbacks become guesswork.
- **Commit tag** (`api:3f9c2ab`) — an exact link between image and code.
- **Semantic version** (`api:1.4.2`) — convenient for releases and changelogs.
- **Environment tag** (`api:staging`) is fine as a moving pointer, but deploy by an immutable tag or digest.
- A good practice is to put several tags on one image: the version and the commit hash.

## Cleanup and retention

Every CI run adds an image, so registries grow quickly. Set up a **retention policy**:

- delete untagged images;
- keep the last N builds for development branches;
- never touch images with release tags;
- remember that the image running in production must stay available for rollback.

Most cloud registries and Harbor support such rules out of the box.

## Security

- Private images belong only in private repositories.
- Give CI separate tokens with minimal permissions, not a personal password.
- Never bake secrets into an image: they are visible in the layers.
- Enable vulnerability scanning if your registry supports it.

## FAQ

### Can I do without a registry?

With a single server, you can build the image directly on it. As soon as you have CI, several servers or need fast rollbacks, a registry becomes essential.

### What is the difference between a tag and a digest?

A tag is a movable label that can be overwritten. A digest is a hash of the content and always points to the same image.

### Which registry should a small team choose?

The one built into your Git hosting or cloud: GHCR for GitHub, GitLab Registry for GitLab, ECR for AWS. That means less access configuration and faster pulls.
