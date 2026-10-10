---
title: Vulnerable Dependencies: How to Find and Fix Them
description: How to find vulnerable dependencies with npm audit, pip-audit, Dependabot and Renovate, judge the real risk, and update without breaking production.
summary: Scan dependencies regularly (npm audit, pip-audit), automate updates with Dependabot or Renovate, commit your lockfiles, and fix first what is actually reachable and exploitable in your application.
---
## The short answer

Most of the code in a typical project is third-party libraries, and vulnerabilities in them are found all the time. A working setup:

1. A **scanner** finds known vulnerabilities: `npm audit`, `pip-audit` and similar tools.
2. An **update bot** (Dependabot or Renovate) opens pull requests with new versions for you.
3. A **lockfile** pins exact versions so production is built from exactly what you tested.
4. **Risk assessment** lets you fix what is truly dangerous first, rather than everything at once.

## Scanning: npm audit and pip-audit

**npm audit** checks your dependency tree against a database of known vulnerabilities:

```bash
npm audit                 # all dependencies
npm audit --omit=dev      # only what ships to production
npm audit fix             # update within allowed ranges
```

Be careful with `npm audit fix --force`: it may install a new **major** version with breaking changes. Use it deliberately and run your tests afterwards.

If a **transitive** dependency is vulnerable and the direct one has not been updated yet, you can force a version through `overrides` in `package.json`:

```json
{
  "overrides": {
    "vulnerable-lib": "^2.3.1"
  }
}
```

For Python there is **pip-audit**:

```bash
pip install pip-audit
pip-audit -r requirements.txt
```

Add scanning to CI so new vulnerabilities show up in a report on their own, not whenever someone remembers.

## Automated updates: Dependabot and Renovate

**Dependabot** is built into GitHub. A minimal setup:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      minor-and-patch:
        update-types: ["minor", "patch"]
```

Grouping bundles small updates into one pull request so the bot does not flood the team.

**Renovate** works with GitHub, GitLab and other platforms and is more configurable: schedules, rule-based automerge, grouping by any criteria.

```json
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true
    }
  ]
}
```

Automerge only makes sense with good test coverage and required CI checks.

## Judging real exploitability

A scanner shows a **severity level** (often a CVSS score), but it does not know how you use the library. Ask:

- **Does the package ship to production?** A flaw in a build or test tool is usually less urgent.
- **Is the vulnerable function actually called?** If the bug is in a YAML parser you never use, the risk is lower.
- **Does an attacker control the input?** A flaw in handling user uploads is more dangerous than one in parsing your own config.
- **Is it exploited in the wild?** Check whether the vulnerability is in the CISA KEV catalog and what its EPSS score — the estimated probability of exploitation — is.

If you decide not to fix something now, **record the decision** and the reason instead of silently ignoring the warning.

## Lockfiles

- Always commit `package-lock.json`, `pnpm-lock.yaml`, `poetry.lock` or the equivalent.
- In CI, install with `npm ci`: it installs strictly from the lockfile and fails on mismatches.
- In Python, pin versions with pip-tools, Poetry or uv; for extra protection, use package hashes.

Without a lockfile, the same commit builds with different versions on different days, and a vulnerability can arrive without a single code change.

## A sane update routine

1. **Security patches** for production dependencies — right away, once tests pass.
2. **Minor and patch versions** — in a batch every week or two.
3. **Major versions** — as a planned task: read the changelog, update the code, run the tests, deploy to staging.
4. Before release, **staging and smoke tests**; after release, error monitoring.
5. Remove unused dependencies: no package, no vulnerability.

## Common mistakes

- Ignoring the report because "there is always something red".
- Running `npm audit fix --force` right before a release.
- Not committing the lockfile.
- Letting updates pile up for years, then jumping several major versions at once.

## FAQ

### npm audit shows dozens of vulnerabilities. Where do I start?

Filter to production dependencies with `npm audit --omit=dev`, sort by severity and check whether the vulnerable code is reachable in your app. Usually only a few items are truly urgent.

### Dependabot or Renovate?

Dependabot is the easiest to enable if the project is on GitHub. Renovate is more convenient across multiple platforms, in monorepos and when you need fine-grained grouping and automerge rules.

### What if no fixed version exists yet?

Check the advisory for a workaround: disable the feature, validate input, restrict access. If the library is abandoned, plan to replace it.
