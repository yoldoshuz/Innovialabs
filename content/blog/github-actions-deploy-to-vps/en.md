---
title: How to Deploy to a VPS with GitHub Actions over SSH
description: Set up automatic VPS deployment: SSH keys and repository secrets, a workflow that pulls, builds and restarts the app, and production protection rules.
summary: Create a dedicated deploy user and SSH key, store the private key in GitHub secrets, and let a workflow on push to main connect to the server, update the code, build and restart the service; protect the production environment with rules.
---

## How it works

The setup is simple: on a push to `main`, GitHub Actions starts a job that connects to your VPS over **SSH** and runs a deploy script there — update the code, install dependencies, build and restart the app. You need three things: access keys, repository secrets and the workflow itself.

## Step 1. A user and keys on the server

Do not deploy as `root`. Create a dedicated user, for example `deploy`, with access only to the application directory.

You will need two keys, and they are easy to mix up:

| Key | From → to | Where it lives |
|---|---|---|
| **CI key** | GitHub Actions → your server | Private part in GitHub secrets, public part in the `deploy` user's `~/.ssh/authorized_keys` |
| **Deploy key** | Your server → GitHub | Private part on the server, public part in the repository's **Settings → Deploy keys** (read-only) |

The deploy key is needed when the repository is private and the server runs `git pull` itself. Generate a key like this:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ./deploy_ci -N ""
```

Use a separate key for each purpose so you can revoke it without touching other access.

## Step 2. Repository secrets

In **Settings → Secrets and variables → Actions**, add:

- `SSH_PRIVATE_KEY` — the contents of the CI private key;
- `SSH_HOST` and `SSH_USER` — the server address and user name;
- `SSH_KNOWN_HOSTS` — the output of `ssh-keyscan your-server.com`, ideally checked against the key fingerprint you see on the server itself.

The last one is often skipped by turning off host checking. Don't do that: without it you won't notice if the server is impersonated.

## Step 3. A deploy script on the server

Keep the deploy logic in a script on the server, for example `/srv/app/deploy.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /srv/app
git pull --ff-only origin main
npm ci
npm run build
sudo systemctl restart app
```

`set -euo pipefail` stops the script at the first error, so the service is not restarted with a half-built app. To let `deploy` restart the service without a password, allow only that command via `visudo`:

```text
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart app
```

Check the path to `systemctl` with `which systemctl`.

## Step 4. The deploy workflow

The `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          echo "${{ secrets.SSH_KNOWN_HOSTS }}" > ~/.ssh/known_hosts

      - name: Run deploy script
        run: ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "/srv/app/deploy.sh"
```

- **concurrency** prevents two deploys from running at once; `cancel-in-progress: false` lets the current deploy finish.
- **workflow_dispatch** adds a manual run button, useful for redeploying.
- If you have CI checks, put them in a separate job and add `needs` so the deploy only runs after green tests.

## Step 5. Protecting the production environment

The `environment: production` line ties the job to an environment. Under **Settings → Environments** you can configure:

- **Required reviewers** — the deploy waits for manual approval from a responsible person;
- **Wait timer** — a delay before the job starts;
- **Deployment branches** — only `main` can deploy;
- **Environment secrets** — store SSH keys at the environment level so only jobs using that environment receive them.

Availability of some of these rules for private repositories depends on your GitHub plan.

## Common mistakes

- Deploying as `root`, or with a key that has access to the whole server.
- `StrictHostKeyChecking=no` instead of known_hosts.
- No `set -e`: the build failed, but the service restarted anyway.
- Manual edits on the server that make `git pull --ff-only` refuse to run.

## FAQ

### Why not build in GitHub Actions and copy the result?

You can, and it is often better: the server does not spend resources on building, and it receives an already tested artifact. Transfer it with `rsync` or `scp` over the same SSH connection. The `git pull` approach is simply easier to start with.

### How do I deploy without downtime?

`systemctl restart` causes a short gap. To avoid it, use process managers with graceful reloads, switch between two release directories via a symlink, or run containers behind a load balancer.

### How do I roll back if a deploy breaks the site?

The simplest way is to revert the commit in `main`: the workflow will deploy the previous version. For faster rollbacks, keep several recent releases on the server and switch between them.
