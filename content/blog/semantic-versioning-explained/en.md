---
title: Semantic Versioning (SemVer) Explained
description: MAJOR.MINOR.PATCH rules, pre-release tags, ^ and ~ ranges in package managers, and how lock files protect a project from breaking updates.
summary: SemVer is the MAJOR.MINOR.PATCH format, where MAJOR grows on incompatible changes, MINOR on backward-compatible features and PATCH on bug fixes; a lock file pins the exact dependency versions.
---
## SemVer in short

**Semantic versioning** is an agreement that a version number tells you how risky an update is. The format is `MAJOR.MINOR.PATCH`, for example `2.5.1`:

| Part | When it increases | What it means for users |
|---|---|---|
| **MAJOR** | incompatible public API changes | the update may break your code |
| **MINOR** | new backward-compatible functionality | safe to update, old code keeps working |
| **PATCH** | bug fixes without API changes | a safe update |

When a higher part increases, the lower ones reset to zero: `1.4.7` → `2.0.0`, `1.4.7` → `1.5.0`.

The key concept is the **public API**. SemVer only makes sense when it is clearly defined what counts as the "interface": library functions, endpoints, configuration format. Changing internal code that nobody calls from outside does not break compatibility.

## Special cases

- **Versions `0.x.y`** mean initial development. According to the spec anything may change at this stage, and no API stability is promised.
- **`1.0.0`** is the moment you declare the public API stable.
- **Pre-release** is a hyphen suffix: `2.0.0-alpha.1`, `2.0.0-beta.3`, `2.0.0-rc.1`. Such a version ranks *lower* than the final `2.0.0` and promises no stability.
- **Build metadata** is a plus suffix: `1.0.0+20261010`. It does not affect version order.

Pre-release ordering: `1.0.0-alpha` < `1.0.0-alpha.1` < `1.0.0-beta` < `1.0.0-rc.1` < `1.0.0`.

## The ^ and ~ ranges in package managers

In `package.json` (and its equivalents in other ecosystems) a dependency is often declared as a range rather than an exact version:

| Notation | What is allowed | Example for `1.4.2` |
|---|---|---|
| `1.4.2` | this version only | `1.4.2` |
| `~1.4.2` | PATCH updates | `>=1.4.2 <1.5.0` |
| `^1.4.2` | MINOR and PATCH updates | `>=1.4.2 <2.0.0` |
| `*` or `latest` | anything | not recommended |

An important npm detail: below `1.0.0` the `^` sign is more cautious. `^0.3.1` only allows `>=0.3.1 <0.4.0`, because in major version zero MINOR effectively plays the role of MAJOR.

The exact range rules are in the npm documentation: [semver ranges](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies).

## Lock files: protection against "it worked yesterday"

The range `^1.4.2` means a fresh install may give you `1.9.0`. If the library author accidentally broke compatibility in a MINOR release, your project fails without a single change in your code.

A **lock file** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`, `composer.lock`) records the exact versions of the whole dependency tree, including transitive ones. What matters in practice:

1. **Commit the lock file** to the repository for applications.
2. Use a strict install in CI: `npm ci` instead of `npm install` — it installs exactly what is in the lock file and fails if it does not match `package.json`.
3. Update dependencies **deliberately**: as a separate task, with tests and a read of the changelog for MAJOR versions.
4. Automated update tools such as Dependabot or Renovate open separate pull requests — convenient when the project has tests.

## How to version your own project

- Define what your public API is and document it.
- Keep a **CHANGELOG**: what was added, fixed and what breaks compatibility.
- Remove features in two steps: first mark them deprecated in a MINOR release, then remove them in the next MAJOR.
- Do not be afraid of MAJOR releases: an honest number beats a "silent" break in a PATCH.
- For websites and internal apps without external consumers strict SemVer is optional — a date or build number is often enough.

## FAQ

### Should a library commit its lock file?

For applications, always. For libraries the lock file does not affect those who install the package, but it is still useful for reproducible development and CI of the library itself.

### What if a dependency broke its API in a MINOR release?

Pin the last working version exactly, report the issue to the author and go back to a range once it is fixed. A lock file is what keeps this from hitting you unexpectedly.

### What is the difference between ^ and ~ in plain words?

`~` allows only bug fixes within the current MINOR version, while `^` also allows new features within the current MAJOR version.
