---
title: Advanced Git: Interactive Rebase, Cherry-Pick and Bisect
description: How to clean up history with interactive rebase, move fixes between branches with cherry-pick and find the commit that introduced a bug with git bisect.
summary: Interactive rebase rewrites your local commits (squash, reword, reorder), cherry-pick copies a single commit to another branch, and bisect uses binary search to find the commit that broke the code.
---
## Three tools and when you need them

- **`git rebase -i`** — tidy up your commits before colleagues see them: fold "fix typo" into the main commit, rewrite a message, change the order.
- **`git cherry-pick`** — take one specific commit from another branch, such as a hotfix from `develop` to `release`, without merging the whole branch.
- **`git bisect`** — find the commit after which something broke, by binary-searching history instead of checking every commit.

The key rule: **rebase and any history rewriting are only for commits that have not reached a shared branch yet**. If commits are already pushed and others build on them, rewritten history causes conflicts for the whole team.

## Interactive rebase: cleaning up history

To edit the last 4 commits:

```bash
git rebase -i HEAD~4
```

Git opens an editor with the list of commits (oldest on top) and commands:

| Command | What it does |
|---|---|
| `pick` | keep the commit as is |
| `reword` | keep the changes, change the message |
| `edit` | stop at the commit so you can amend its content |
| `squash` | merge into the previous commit, combining messages |
| `fixup` | merge into the previous commit, discarding the message |
| `drop` | remove the commit |

You can reorder the lines, and commits will be applied in the new order.

**Handy trick:** when fixing something, run `git commit --fixup <hash>`, then `git rebase -i --autosquash <base>` — Git will place the `fixup` lines next to the right commits automatically.

If something goes wrong during a rebase:

- `git rebase --continue` — after resolving a conflict;
- `git rebase --abort` — return everything to the state before the rebase;
- `git reflog` — find the branch state before the rebase if it is too late to abort.

After rebasing an already pushed *personal* branch you need a force push. Use the safe option `git push --force-with-lease`: it refuses to overwrite if someone else's commits appeared on the server.

## Cherry-pick: moving a fix

```bash
git switch release/2.0
git cherry-pick a1b2c3d
```

Git creates a **new commit** with the same changes but a different hash. Useful flags:

- `-x` — append "cherry picked from commit …" to the message so the origin is visible;
- `A..B` — apply a range of commits (excluding A itself);
- `--no-commit` — apply the changes without committing right away.

**When cherry-pick is a bad idea:** if you regularly move many commits between branches, that signals a problem with your branching process. Duplicate commits make later merges harder. It is better to fix the issue in a common base branch and merge it wherever it is needed.

## Bisect: hunting down the bad commit

Say tests fail now, but everything worked at tag `v1.4`:

```bash
git bisect start
git bisect bad            # current commit is broken
git bisect good v1.4      # this one worked
```

Git checks out a commit in the middle. Test it and mark it with `git bisect good` or `git bisect bad`. Each step halves the range, so even among hundreds of commits you only need a handful of checks. At the end Git shows the first bad commit. Finish with `git bisect reset`.

**Automation:** if the check can be a script that exits with 0 on success and non-zero on failure, Git runs the search for you:

```bash
git bisect run npm test
```

If a commit cannot be tested (for example, it does not build), use `git bisect skip`.

## Common mistakes

- Rebasing a shared branch (`main`, `develop`) — breaks history for colleagues.
- Plain `--force` instead of `--force-with-lease`.
- Bisecting with a flaky test: an unstable result sends the search the wrong way.
- Huge commits: bisect finds the culprit, but it touches 40 files. Small, meaningful commits make all three tools more useful.

## FAQ

### Can I undo a failed rebase?

Yes. Open `git reflog`, find the entry from before the rebase started and run `git reset --hard <hash>`. Local history in Git is almost never lost immediately.

### What is the difference between squash and fixup?

Both merge a commit into the previous one. `squash` lets you edit the combined message, while `fixup` simply discards the message of the commit being folded in.

### Does bisect work with merge commits?

Yes, Git considers the whole history, including merges. If you only want to walk the main line, use `git bisect start --first-parent`.
