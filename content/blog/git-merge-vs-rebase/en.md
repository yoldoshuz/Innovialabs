---
title: Git Merge vs Rebase: Differences and When to Use Each
description: How merge, squash and rebase shape commit history, why you should never rebase shared branches, and which merge policy a development team should adopt.
summary: Merge keeps history as it happened and adds a merge commit, while rebase rewrites commits into a straight line. Rebase only your own local branches and merge shared ones.
---

## The short answer

Both `merge` and `rebase` solve the same problem: bringing changes from one branch into another. The difference is **what history looks like** afterwards:

- **Merge** keeps the real history and adds a dedicated merge commit.
- **Rebase** replays your commits on top of another branch, so history becomes a straight line.
- **Squash merge** collapses all commits of a branch into one and adds it to the main branch.

The key rule: **never rebase branches other people are already using**.

## What history looks like

Starting point: you branched `feature` off `main` and made commits D and E, while `main` got commits B and C in the meantime.

```text
          D---E  feature
         /
    A---B---C  main
```

### After merge

```bash
git switch main
git merge feature
```

```text
          D---E
         /     \
    A---B---C---M  main
```

A merge commit **M** with two parents appears. You can see the work happened in parallel, and no existing commit changed.

### After squash merge

```bash
git switch main
git merge --squash feature
git commit -m "Add feature"
```

```text
    A---B---C---S  main
```

All branch changes are packed into one commit **S**. The `main` history is clean, but the intermediate steps of the branch are not visible there.

### After rebase

```bash
git switch feature
git rebase main
```

```text
                  D'--E'  feature
                 /
    A---B---C  main
```

Commits D and E are recreated as **D'** and **E'** on top of C, with new hashes. Now `git merge feature` into `main` is a simple fast-forward and history stays linear.

## Comparison

| Criterion | Merge | Squash merge | Rebase |
|---|---|---|---|
| Rewrites history | no | no (for main) | yes |
| History shape | branching | linear | linear |
| Keeps individual branch commits | yes | no | yes |
| Safe for shared branches | yes | yes | no |
| Conflicts resolved | once | once | per commit |

## The golden rule of rebase

**Do not rebase commits that have been pushed and that others rely on.**

Rebase creates new commits in place of the old ones. If a teammate has already built on the old commits, their history diverges from yours after your `push --force`: duplicates, conflicts and confusion follow.

Rebase is safe for:

- your local branch before pushing;
- your personal branch that nobody else works on;
- `git pull --rebase`, to avoid extra merge commits when updating.

If you must overwrite a pushed personal branch, use `git push --force-with-lease`. It refuses to push if someone else's commits have appeared on the server.

## When to use which

- **Merge** for combining shared long-lived branches (`develop` into `main`, release branches) and when exact chronology matters.
- **Squash merge** for pull requests full of small commits like "fix typo": `main` gets one meaningful entry.
- **Rebase** to refresh your branch with the latest `main` before a pull request and to tidy local commits (`git rebase -i`).

## A team policy

A simple scheme that works for most teams:

1. Each task gets its own short-lived branch from `main`.
2. Before opening a pull request, the developer updates the branch with `git rebase main` (it is their personal branch, so this is safe).
3. Changes land in `main` via **squash merge** or a regular merge. Pick one and enforce it in the repository settings.
4. Force pushes to `main` and other shared branches are blocked by branch protection.
5. Developers can set `pull.rebase = true` in their Git config so local updates do not create merge commits.

The specific choice matters less than **consistency**: a mix of approaches makes history harder to read than either one alone.

## FAQ

### Which is safer for a beginner, merge or rebase?

Merge. It never rewrites existing commits, so it is harder to get wrong. Move to rebase once you clearly understand which branches are personal and which are shared.

### How do I undo a bad rebase?

If the rebase is still in progress, run `git rebase --abort`. If it already finished, find the previous branch state in `git reflog` and return to it with `git reset --hard <hash>`, after saving any uncommitted changes.

### Is history lost with squash merge?

`main` keeps one commit, but the intermediate commits usually remain visible in the pull request on GitHub or GitLab as long as the source branch or PR exists.
