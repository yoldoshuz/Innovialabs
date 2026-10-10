---
title: VS Code Remote SSH and Dev Containers Explained
description: How to develop in VS Code on a remote server over SSH and inside a reproducible dev container: devcontainer.json setup, performance tips and team benefits.
summary: Remote SSH opens a project on a remote machine as if it were local, while Dev Containers runs your development environment in a Docker container defined by devcontainer.json, so the whole team gets the same setup.
---
## The two modes in short

Both modes work the same way: the VS Code window stays on your computer, while files, the terminal, language servers and most extensions run **where the code lives**.

- **Remote SSH** — code and processes live on a remote server or a powerful workstation. You connect over SSH, and VS Code installs its server component there automatically.
- **Dev Containers** — the project opens inside a Docker container. What is installed in it is described by a `devcontainer.json` file in the repository.

You can combine them: connect to a server over SSH, then open the project in a container on that server.

## When to use which

| Situation | Good fit |
|---|---|
| Weak laptop, heavy project | Remote SSH to a stronger machine |
| Data or GPU live on the server | Remote SSH |
| A new developer should be productive in minutes | Dev Containers |
| Projects need different language and tool versions | Dev Containers |
| The team and CI must share one environment | Dev Containers |

## Setting up Remote SSH

1. Install the **Remote - SSH** extension from Microsoft.
2. Make sure you can connect to the server with a key from a regular terminal.
3. Add the host to `~/.ssh/config`:

```text
Host staging
    HostName 203.0.113.10
    User deploy
    IdentityFile ~/.ssh/id_ed25519
```

4. In the command palette, run **Remote-SSH: Connect to Host...** and pick `staging`.
5. Open the project folder on the server.

Ports your app listens on remotely can be forwarded to your machine from the **Ports** panel, so you can open the site at `localhost`.

Keep in mind that extensions working with code (linters, debuggers, language support) must be installed again on the remote side — VS Code will offer to do it.

## Setting up Dev Containers

You need the **Dev Containers** extension and Docker (Docker Desktop or Docker Engine). Create `.devcontainer/devcontainer.json` in the project root:

```json
{
  "name": "web-app",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "lts" }
  },
  "forwardPorts": [3000],
  "postCreateCommand": "npm ci",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
    }
  }
}
```

What each part does:

- **image** — the base image. You can point to your own `Dockerfile` through the `build` property instead.
- **features** — reusable add-ons that install tools: a language runtime, a CLI, database clients.
- **forwardPorts** — ports reachable from your machine.
- **postCreateCommand** — runs after the container is created, usually to install dependencies.
- **customizations.vscode.extensions** — extensions installed inside the container for everyone.

Then run **Dev Containers: Reopen in Container**. After changing the config, use **Rebuild Container**.

If the project needs a database and a cache, use `dockerComposeFile` and `service` instead of `image`: VS Code starts the whole Docker Compose stack and attaches to the service you name.

## Performance

- **Remote SSH** depends on the network. Typing is local and stays responsive, but file operations and the terminal go over the connection. Choose a server with a good link to you.
- **Dev Containers on macOS and Windows** run inside a virtual machine, and folders shared from the host can be slow for projects with many files (think `node_modules`). The **Clone Repository in Container Volume** command keeps the code in a Docker volume instead.
- **On Windows**, keep the project inside the WSL 2 file system rather than on the `C:` drive.
- Move heavy steps (installing system packages) into the image or features so they are cached instead of rerun on every start.

## Why teams adopt it

- **Onboarding in minutes**: clone, reopen in container, done.
- **No more "works on my machine"**: language, tool and extension versions are pinned in the repo.
- **Environment changes get reviewed** like any other code.
- The same `devcontainer.json` is understood by cloud environments such as GitHub Codespaces and by the `devcontainer` CLI for CI. The spec is open: [containers.dev](https://containers.dev).

## Common mistakes

- Putting secrets directly in `devcontainer.json`, which is committed to Git. Pass them through environment variables or local files outside the repo.
- Using a floating `latest` tag, so the environment changes without anyone noticing.
- Ignoring file ownership: working as root inside the container can leave files on the host you cannot edit without sudo. Set `remoteUser`.

## FAQ

### Does the server need Docker for Remote SSH?

No. Remote SSH needs only SSH access and a supported OS on the server. Docker is required only if you want to open the project in a container on that server.

### Can Dev Containers be used without VS Code?

Yes. Other tools support the spec too, and the `devcontainer` command-line tool can build and run these containers, for example in CI.

### How is a dev container different from a production container?

A dev container carries development tools: compilers, debuggers, linters. A production image should be minimal. They are usually two separate images, though they can share a common base.
