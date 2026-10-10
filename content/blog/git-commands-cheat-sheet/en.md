---
title: Essential Git Commands: A Cheat Sheet for Daily Work
description: A Git cheat sheet grouped by task: start, save, branch, sync and inspect history, with short examples for each command and a practical .gitignore primer.
summary: Daily Git work needs only about twenty commands, such as clone, status, add, commit, switch, merge, pull, push, log and diff, plus a well-configured .gitignore file.
---

## The short answer

Most Git work follows one loop: **get the latest changes → create a branch → edit files → add → commit → push**. The commands below are grouped by task so you can find the one you need quickly.

## Start

| Command | What it does |
|---|---|
| `git init` | creates a new repository in the current folder |
| `git clone <url>` | downloads an existing repository with its full history |
| `git config --global user.name "Name"` | sets the commit author name |
| `git config --global user.email "mail"` | sets the author email |

```bash
git clone https://github.com/user/project.git
cd project
```

## Save changes

| Command | What it does |
|---|---|
| `git status` | shows modified, staged and new files |
| `git add <file>` | adds a file to the staging area |
| `git add -p` | lets you pick individual chunks of changes |
| `git commit -m "message"` | records the staged changes |
| `git commit --amend` | fixes the last commit (only if not pushed yet) |
| `git restore <file>` | discards unsaved changes in a file |
| `git restore --staged <file>` | unstages a file but keeps your edits |

```bash
git status
git add src/cart.js
git commit -m "Fix discount calculation in cart"
```

**Tip:** `git add -p` is the best way to keep commits clean when one file mixes unrelated edits.

## Branch

| Command | What it does |
|---|---|
| `git branch` | lists local branches |
| `git switch -c <branch>` | creates a branch and switches to it |
| `git switch <branch>` | switches to an existing branch |
| `git merge <branch>` | merges the given branch into the current one |
| `git branch -d <branch>` | deletes a branch that is already merged |
| `git stash` / `git stash pop` | temporarily shelves uncommitted edits and brings them back |

```bash
git switch -c feature/login-form
# ...work...
git switch main
git merge feature/login-form
```

`switch` and `restore` are newer, clearer replacements for the overloaded `git checkout`, which still works.

## Sync with the server

| Command | What it does |
|---|---|
| `git remote -v` | shows connected remote repositories |
| `git fetch` | downloads changes without touching your branches |
| `git pull` | downloads and merges changes into the current branch |
| `git push` | sends your commits to the server |
| `git push -u origin <branch>` | first push of a new branch, linking it to the remote |

```bash
git pull
git push -u origin feature/login-form
```

If you are unsure what the server will bring, run `git fetch` first and review the difference.

## Inspect history and changes

| Command | What it does |
|---|---|
| `git log --oneline --graph` | compact history with branches |
| `git diff` | changes not yet staged |
| `git diff --staged` | changes that will go into the commit |
| `git show <hash>` | contents of a specific commit |
| `git blame <file>` | who changed each line and in which commit |

```bash
git log --oneline --graph --all
git diff --staged
```

## A .gitignore primer

A `.gitignore` file in the project root lists what Git should not track: dependencies, build output, logs and secrets.

```gitignore
# dependencies and build output
node_modules/
dist/

# environment variables and secrets
.env
.env.local

# OS and editor files
.DS_Store
.idea/
*.log
```

Things to remember:

- `.gitignore` does not affect files that are **already tracked**. To stop tracking one, run `git rm --cached <file>` and commit.
- If a secret is already in history, `.gitignore` is not enough: revoke the key and replace it.
- Ready-made templates for many languages live in the official `github/gitignore` repository.

## Common mistakes

- **`git add .` without `git status`.** It is easy to commit something extra, so check what changed first.
- **`--amend` after pushing.** It rewrites history that others already have.
- **Working for days without `pull`.** The longer a branch lives apart, the more conflicts you get at merge time.

## FAQ

### What is the difference between git fetch and git pull?

`git fetch` only downloads changes from the server and updates remote branches; your files stay the same. `git pull` runs fetch and then merges the changes into your current branch.

### How do I undo the last commit?

If it is not pushed yet, `git reset --soft HEAD~1` removes the commit but keeps the changes staged. If it is already on the server, `git revert <hash>` is safer: it creates a new commit that reverses the changes.

### Why does a file listed in .gitignore still get committed?

Most likely it was added to the repository before the rule existed. Remove it from the index with `git rm --cached <file>` and commit.
