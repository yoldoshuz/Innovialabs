---
title: How to Resolve Merge Conflicts in Git
description: Why Git merge conflicts happen, how to read conflict markers, resolve them in the terminal and VS Code, abort safely and prevent them next time.
summary: A conflict happens when two branches change the same lines differently; you pick the final version, remove the markers, run git add and finish the merge.
---
## The short answer

A merge conflict is not an error. It is Git asking you: "both branches changed the same place differently, which version should stay?" The procedure is always the same:

1. Run `git status` and find files under **Unmerged paths**.
2. Open each file and find the `<<<<<<<`, `=======`, `>>>>>>>` markers.
3. Keep the correct code and delete the markers.
4. Run `git add <file>` for every fixed file.
5. Finish the operation: `git commit` for a merge or `git rebase --continue` for a rebase.

## Why conflicts happen

Git merges changes automatically when they touch different lines or different files. A conflict appears when:

- both branches changed **the same lines** of a file;
- one branch **deleted** a file the other branch modified;
- both branches **created a file with the same name** and different content.

The longer a branch lives apart from the main branch, the more likely someone else edits the same code.

## How to read conflict markers

Inside the file Git shows both versions:

```text
<<<<<<< HEAD
const timeout = 3000;
=======
const timeout = 5000;
>>>>>>> feature/retry
```

- Between `<<<<<<< HEAD` and `=======` is **your current branch** (the one you merge into).
- Between `=======` and `>>>>>>> feature/retry` are the **incoming changes**.

One catch: during a `rebase` the roles flip. `HEAD` is the branch you are rebasing onto, and "incoming" are your own commits.

If you enable the `diff3` style (or `zdiff3` in newer Git), you also see the original version before either change, which makes it much easier to understand who changed what:

```bash
git config --global merge.conflictStyle diff3
```

## Resolving in the terminal

```bash
git merge feature/retry
# CONFLICT (content): Merge conflict in src/config.js

git status                 # list conflicted files
# edit the file by hand
git add src/config.js
git commit                 # Git suggests a merge commit message
```

To take one side entirely for a file:

```bash
git checkout --ours src/config.js    # keep the current branch version
git checkout --theirs src/config.js  # take the incoming version
git add src/config.js
```

Remember the role swap during rebase: `--ours` and `--theirs` flip there too.

## Resolving in VS Code

VS Code highlights conflicts and shows actions above each one:

- **Accept Current Change** keeps your version;
- **Accept Incoming Change** takes theirs;
- **Accept Both Changes** keeps both (often needs manual cleanup after);
- **Compare Changes** opens a diff.

For harder cases there is the **Merge Editor**: three panes with incoming, current and the final result. After editing, save the file and click "+" (stage) in the Source Control panel.

## How to abort safely

If you get lost, go back to where you started:

```bash
git merge --abort    # cancel the merge
git rebase --abort   # cancel the rebase
git cherry-pick --abort
```

These commands return the branch to its state before the operation. Before merging, commit or stash (`git stash`) unfinished work so an abort cannot touch it.

## Common mistakes

- **Leftover markers.** Code with `<<<<<<<` gets committed and the build breaks. Search for markers or run `git diff --check` before committing.
- **"Accept Both" without reading.** Two versions of a function side by side are usually a duplicate or broken logic.
- **Skipping tests.** The conflict is resolved syntactically, but behavior may have changed. Run the tests and build the project.
- **Guessing.** If you do not understand why a teammate changed the code, ask. It is faster than hunting the bug later.

## How to get fewer conflicts

- **Small PRs.** Fewer changes merged sooner means fewer overlaps.
- **Pull the main branch often** into yours (`git pull --rebase` or merging `main`).
- **Shared formatting.** Prettier, Black and similar tools remove conflicts caused by whitespace and quotes.
- **Do not mix refactoring with features.** Put mass renames into a separate, quickly merged PR.
- **Agree on ownership** when several people work in the same module.

## FAQ

### Is merge or rebase better for conflicts?

The conflicts are the same; the history differs. Merge resolves them once in a merge commit, rebase resolves them on each replayed commit. Rebase is convenient for your local branches, merge for shared ones.

### Can I commit a file that still has conflict markers?

Technically yes, Git will not stop you. But the code will almost certainly not compile. Use `git diff --check` or a pre-commit hook to catch it.

### How do I avoid resolving the same conflict again and again?

Run `git config --global rerere.enabled true`. Git records how you resolved a conflict and reapplies that resolution when it shows up again.
