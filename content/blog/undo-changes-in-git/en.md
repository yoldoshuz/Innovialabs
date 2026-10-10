---
title: How to Undo Changes in Git: reset, revert, restore
description: Which Git command fits each common mistake - a bad commit, a bug pushed to main, a lost branch. A practical guide to reset, revert, restore and reflog.
summary: restore undoes edits in files, reset moves a branch back in local history, revert adds a new undo commit for code already shared, and reflog brings back what seems lost.
---
## The short answer

The right command depends on two questions: **what** you want to undo and **whether it is already pushed**.

| Situation | Command |
|---|---|
| Broke a file, have not run `git add` | `git restore <file>` |
| Staged something by mistake | `git restore --staged <file>` |
| Last commit is wrong, not pushed | `git reset --soft HEAD~1` |
| Need to fix the last commit message | `git commit --amend` |
| A bug is already on a shared branch | `git revert <hash>` |
| Deleted a branch or ran `reset --hard` by accident | `git reflog` + `git branch` / `git reset` |

The key rule: **do not rewrite history others have already pulled**. For published commits, use `revert`.

## restore: undoing edits in files

`git restore` works with files, not commits.

```bash
git restore src/app.js           # reset the file to the last commit
git restore --staged src/app.js  # unstage, keep the edits
git restore --source=HEAD~2 src/app.js  # take the version from two commits ago
```

Careful: `git restore <file>` without `--staged` **permanently** discards uncommitted edits in that file. Git never stored them, so reflog cannot help.

## reset: moving the branch back

`git reset` moves the current branch pointer to another commit. The three modes differ in what happens to the changes from the "dropped" commits:

| Mode | Branch | Index (staged) | Working files |
|---|---|---|---|
| `--soft` | moves | changes stay staged | untouched |
| `--mixed` (default) | moves | cleared | changes stay in files |
| `--hard` | moves | cleared | **overwritten** |

In practice:

- `git reset --soft HEAD~1` "uncommits" so you can redo a commit or squash several into one.
- `git reset HEAD~1` does the same, but you re-add changes with `git add`; handy for splitting a commit.
- `git reset --hard origin/main` throws away all local changes and matches the remote branch. Uncommitted work is lost.

If the branch was already pushed, after a `reset` you need `git push --force-with-lease`. Acceptable on a personal branch, almost never on `main`.

## revert: safely undoing published work

`git revert` does not delete a commit. It creates a **new commit with the inverse changes**. History stays intact and teammates have nothing to fix.

```bash
git revert a1b2c3d          # undo one commit
git revert HEAD~3..HEAD     # undo the last three commits
git revert -m 1 <merge-hash> # undo a merge commit
```

For a merge commit, `-m 1` tells Git which parent is the mainline (usually the first, the branch you merged into). Note: if you later merge the same branch again, Git considers its changes already applied, and you will need to "revert the revert".

## reflog: the safety net

Git records every move of `HEAD` in the **reflog**. It is a local journal and it rescues almost any commit-level mistake.

```bash
git reflog
# 9f8e7d6 HEAD@{0}: reset: moving to HEAD~3
# 4c5d6e7 HEAD@{1}: commit: add payment form
# ...

git reset --hard 4c5d6e7        # put the branch back where it was
git branch recovered 4c5d6e7    # or restore a deleted branch
```

Limits: the reflog exists only on your machine, old entries are eventually removed by garbage collection, and it contains nothing that was never committed.

## Common mistakes

- **`reset --hard` with uncommitted work.** Before a risky operation, run `git stash` or make a temporary commit.
- **Force-pushing a shared branch.** It breaks history for everyone else. Use `revert`.
- **Mixing up `revert` and `reset`.** Revert adds a commit; reset moves the branch.
- **Panicking.** If something was committed even once, it can almost always be recovered via reflog.

## FAQ

### How is `git restore` different from `git checkout`?

`git checkout` historically did both branch switching and file restoring. Since Git 2.23 those roles are split between `git switch` and `git restore` so they are harder to confuse. The old form still works.

### How do I undo a commit that is already pushed to main?

Use `git revert <hash>` and push the new commit. It is safe for everyone who already pulled the changes.

### Can I recover files after `git reset --hard`?

Committed ones, yes, through `git reflog`. Uncommitted edits in working files were never stored by Git, so Git usually cannot bring them back; your editor's local history sometimes can.
