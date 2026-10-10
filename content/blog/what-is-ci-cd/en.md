---
title: What Is CI/CD: Continuous Integration and Delivery Explained
description: How continuous integration, delivery and deployment differ, what a typical pipeline looks like step by step, and what automated releases give a business.
summary: CI/CD is an automated pipeline that builds the project, runs tests and ships it to servers on every code change. Releases become frequent, small and predictable, and bugs are caught earlier.
---
## CI/CD in plain words

**CI/CD** is a practice where automation, not a person working from memory, moves code from the developer to users. Every change goes through the same conveyor — the **pipeline**: build, tests, checks, deployment.

The acronym covers three ideas:

- **Continuous Integration (CI)** — developers merge changes into a shared branch often, and every change automatically triggers a build and tests. The goal is to learn about a breakage in minutes, not a week later.
- **Continuous Delivery** — every version that passes the checks is ready to release. Going to production is one button, and a person makes the call.
- **Continuous Deployment** — one step further: a version that passes all checks goes to production automatically, with no manual approval.

## Delivery vs deployment

| | Continuous Delivery | Continuous Deployment |
|---|---|---|
| Build and tests | automatic | automatic |
| Release to staging | automatic | automatic |
| Release to production | by button | automatic |
| What it requires | reliable tests | very reliable tests and monitoring |
| Who it suits | most teams | mature teams with good test coverage |

You almost always start with CI and continuous delivery. Fully automatic deployment is the next step, once the team trusts its tests.

## A typical pipeline, step by step

1. **Trigger.** A developer pushes code or opens a pull request.
2. **Build.** Dependencies are installed, the project is compiled, a Docker image is built.
3. **Static checks.** Linters, formatting, type checks, scanning dependencies for known vulnerabilities.
4. **Tests.** Unit tests, then integration tests. If something fails, the pipeline stops and the author is notified.
5. **Artifact.** The finished build is stored with a unique version, for example an image tagged with the commit hash.
6. **Deploy to staging.** The same build goes to a test environment that resembles production.
7. **Acceptance checks.** Automated scenario tests or a manual review.
8. **Deploy to production.** By button or automatically, ideally gradually.
9. **Monitoring and rollback.** If metrics get worse, you quickly return to the previous version.

A minimal pipeline in GitHub Actions:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

Similar pipelines are built in GitLab CI, Jenkins and other systems — the principle is the same.

## What it gives the business

- **Faster feature delivery.** A finished feature reaches users as soon as it passes the checks instead of waiting for a "big release".
- **Lower risk.** Small, frequent releases are easier to verify and roll back than rare, large ones.
- **Less manual work.** Nobody copies files to a server by hand or skips a step from the instructions.
- **Predictability.** Every version is built the same way, and you always know what runs in production.
- **No single point of knowledge.** The release process lives in code, not in one developer's head.

## Common mistakes when adopting CI/CD

- **A pipeline without tests.** Automatically deploying unchecked code just ships bugs faster.
- **A slow pipeline.** If checks take too long, people start bypassing them. Cache dependencies and run steps in parallel.
- **Flaky tests.** Tests that fail at random teach the team to ignore a red status.
- **Secrets in the repository.** Passwords and keys belong in protected CI variables, not in code.
- **Different builds for staging and production.** Production should get the exact artifact that passed the checks.
- **No rollback plan.** Rolling back should be as simple as deploying.

Syntax reference: [GitHub Actions documentation](https://docs.github.com/en/actions).

## FAQ

### Does a small team need CI/CD?

Yes, at least the basics: automated tests on every pull request and deployment with a single command. A simple pipeline usually pays off quickly because it removes manual mistakes during releases.

### Which tool should I choose?

The easiest is the one built into your code hosting: GitHub Actions for GitHub, GitLab CI for GitLab. A separate server such as Jenkins makes sense with special infrastructure requirements.

### How is CI/CD related to DevOps?

DevOps is a broader approach to how development and operations work together. CI/CD is one of its core practices, automating the path of code to production.
