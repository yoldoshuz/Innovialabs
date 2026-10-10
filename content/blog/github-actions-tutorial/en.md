---
title: GitHub Actions Tutorial: Your First CI Pipeline
description: What workflows, triggers, jobs and steps are in GitHub Actions, and how to build your first CI pipeline that installs, lints, tests and builds.
summary: GitHub Actions runs a YAML file from .github/workflows when something happens in your repository; a first CI pipeline is one job that checks out the code, installs dependencies, then runs the linter, tests and build on every push and pull request.
---

## What GitHub Actions is

**GitHub Actions** is the automation system built into GitHub. You describe in a YAML file what should happen on a repository event, and GitHub runs it on its own virtual machine. The most common use is **CI** (continuous integration): every change is automatically checked by a linter and tests, so broken code does not slip into the main branch unnoticed.

## Core concepts

| Concept | What it is |
|---|---|
| **Workflow** | A `.yml` file in `.github/workflows`. A repository can have several |
| **Trigger** (`on`) | The event that starts the workflow: push, pull request, schedule, manual run |
| **Job** | A set of steps that runs on one machine. Jobs run in parallel by default |
| **Step** | A single command (`run`) or a ready-made action (`uses`) |
| **Runner** | The machine that executes a job, such as `ubuntu-latest` |
| **Action** | A reusable step from the Marketplace, such as `actions/checkout` |

## Your first pipeline, step by step

Here is an example for a Node.js project. Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

What happens here:

1. **on** — the pipeline runs on a push to `main` and on every pull request.
2. **actions/checkout** — downloads the repository code onto the runner. Without it, the machine is empty.
3. **actions/setup-node** — installs Node.js and caches npm packages so later runs are faster.
4. **npm ci** — a clean install strictly from `package-lock.json`. For CI it is a better choice than `npm install`.
5. Lint, tests and build. If any step exits with a non-zero code, the job fails and GitHub shows a red cross next to the commit.

Commit and push — the run appears in the repository's **Actions** tab.

## Useful improvements

**Cancel outdated runs.** If you push several times in a row, there is no point checking older commits:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

**Version matrix.** Test several Node.js versions with one configuration:

```yaml
strategy:
  matrix:
    node: [18, 20, 22]
```

and use `node-version: ${{ matrix.node }}` in the setup-node step.

**Job dependencies.** The `needs: check` key makes, for example, a deploy job wait for a successful check.

**Branch protection.** In the repository settings, add a rule for `main` that requires CI to pass before a pull request can be merged. That is what turns CI from notifications into real protection.

## How to pick Marketplace actions

- Prefer official actions (`actions/*`) and actions published by the tool's own authors.
- Pin versions: at least the major version (`@v4`), or the full commit SHA for maximum safety.
- Check what an action does with secrets: do not hand tokens to third-party code without a reason.

## Common mistakes

- The file is not in `.github/workflows`, or the YAML indentation is wrong.
- `actions/checkout` is missing, so commands cannot find the project files.
- `npm install` instead of `npm ci` — the build may differ from your local one.
- Secrets printed to the log with `echo`. Store them in **Settings → Secrets** and reference them as `${{ secrets.NAME }}`.

## FAQ

### Is GitHub Actions free?

Standard runners are free for public repositories. Private repositories get a monthly minutes allowance depending on the plan, with paid usage beyond it. Check GitHub's documentation for the current terms.

### Can I run a workflow manually?

Yes, add the `workflow_dispatch` trigger under `on`. A manual run button then appears in the Actions tab.

### How is GitHub Actions different from GitLab CI or Jenkins?

The idea is the same — the pipeline is described in a file next to the code. The main advantage of Actions is its tight GitHub integration and a large Marketplace of ready-made actions. Jenkins needs its own server, and GitLab CI makes sense when your code lives in GitLab.
