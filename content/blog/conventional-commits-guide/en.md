---
title: How to Write Good Commit Messages: Conventional Commits
description: Rules for clear commit messages, the Conventional Commits format with examples, and how it powers automatic changelogs and version bumps.
summary: A good commit says what changed and why in one short line; Conventional Commits adds a type like feat or fix, and tools use those types to compute the next version and write the changelog.
---
## The short answer

A good commit message is a **short line in the imperative mood** that tells you, six months later, what changed, plus a body explaining "why" when it is not obvious. **Conventional Commits** is an agreement on the shape of that line:

```text
<type>(<scope>): <description>

<body - optional>

<footer - optional>
```

For example: `fix(cart): keep cart contents after page reload`.

## Basic rules for any commit

- **One commit, one logical change.** Do not mix a bug fix, a rename and a dependency update.
- **Keep the subject short**, roughly up to 50-72 characters, so it is not cut off in `git log --oneline` and UIs.
- **Imperative mood:** "add", "fix", "remove", as if giving a command to the codebase.
- **No period at the end of the subject.**
- **Blank line between subject and body.**
- **The body answers "why"**, not a retelling of the diff. What changed is visible in the code; why is not.
- **Issue references** go in the footer: `Refs: #123`.

Bad: `fix`, `changes`, `wip`, `update files`.
Good: `fix(auth): refresh token before expiry, not after`.

## The Conventional Commits format

The specification only mandates `feat` and `fix`; the other types are a widely used convention (suggested, for example, by commitlint configs):

| Type | When to use |
|---|---|
| `feat` | new user-facing functionality |
| `fix` | bug fix |
| `docs` | documentation only |
| `style` | formatting, no logic change |
| `refactor` | code change that is neither a feature nor a fix |
| `perf` | performance improvement |
| `test` | adding or fixing tests |
| `build` | build system, dependencies |
| `ci` | CI configuration |
| `chore` | other maintenance |

The **scope** in parentheses is optional and names the module: `feat(api)`, `fix(checkout)`.

### Breaking changes

An incompatible change is marked in two ways, with an exclamation mark or a footer:

```text
feat(api)!: remove deprecated /v1/orders endpoint

BREAKING CHANGE: clients must migrate to /v2/orders.
```

## Examples

```text
feat(search): add price filter
fix(payments): handle duplicate provider callbacks correctly
docs: describe running the project in Docker
refactor(user): move validation into a separate module
perf(catalog): cache the category list
```

## Why it matters: changelogs and versions

Structured messages can be parsed by machines. That ties commits to **semantic versioning** (SemVer):

| Commits since last release | New version |
|---|---|
| only `fix` | patch: 1.4.2 → 1.4.3 |
| at least one `feat` | minor: 1.4.2 → 1.5.0 |
| a `!` or `BREAKING CHANGE` | major: 1.4.2 → 2.0.0 |

Tools such as **semantic-release**, **release-please** or **standard-version** read the history, compute the next version, generate a `CHANGELOG.md` with "Features" and "Bug Fixes" sections and create a tag. Types like `docs`, `chore` and `style` usually stay out of the changelog.

A bonus: history becomes searchable, e.g. `git log --grep "^fix(payments)"`.

## How to roll it out in a team

1. **Agree on the list of types and scopes** and write them in the README or CONTRIBUTING.
2. **Add a check**: commitlint with `@commitlint/config-conventional`, via a git hook or in CI.
3. **If you squash merge**, validate the PR title, since it becomes the commit message on main.
4. **Turn on automated releases** once the format sticks.

## Common mistakes

- **Everything is `chore`.** The changelog stays empty and versions never move.
- **`feat` for internal changes.** `feat` is something a product or API user will notice.
- **Forgotten `BREAKING CHANGE`.** Consumers receive an incompatible update as a minor release.
- **A type with no meaning:** `fix: fix bug` is no better than plain `fix`.

## FAQ

### Do commit messages have to be in English?

No. The specification does not require a language, but the types (`feat`, `fix`) stay in English because tools rely on them. What matters is using one language across the project.

### What if one commit contains both a feature and a fix?

Split it into two commits if you can. If not, pick the type of the most significant change; for versioning, `feat` matters more.

### Is Conventional Commits worth it for small projects?

Yes. Even without automated releases it makes history readable. Start with `feat`, `fix`, `docs`, `refactor` and `chore` and add the rest when needed.
