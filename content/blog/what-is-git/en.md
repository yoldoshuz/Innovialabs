---
title: What Is Git and How Version Control Works
description: A plain explanation of Git: why version control exists, what commits, branches and the staging area are, and how to make your first repository and commit.
summary: Git is a version control system that records your code history as snapshots called commits, lets you work in branches and safely combines the work of several people.
---

## What Git is, in plain words

**Git** is a program that remembers every saved state of your project. Instead of folders named "project_final", "project_final_2" and "project_really_final", you have one folder and a full history: who changed what, and when.

Git is **distributed**: every developer has a complete copy of the history on their own machine. You can work offline and sync with a server (GitHub, GitLab, Bitbucket or your own) later.

## Why version control exists

Without version control, teams quickly run into the same problems:

- **Lost work.** Someone overwrites a colleague's file and the changes are gone.
- **No rollback.** An update breaks the site and there is no clean way back to the working version.
- **Unknown bug origin.** You cannot see which change introduced the problem.
- **Parallel work collides.** Two people edit the same module and block each other.

Git solves all of these: any state can be restored, every change is signed by its author, and parallel work happens in separate branches.

## Git's model: three key ideas

### Commit

A **commit** is a snapshot of all tracked files at a specific moment, plus a message, an author and a date. Each commit has a unique hash (for example `a3f9c21`) and a reference to the previous commit, so history becomes a chain.

### Staging area (index)

Between your files and the history sits an intermediate zone, the **staging area**. You choose which changes go into the next commit. This lets you keep commits clean: one for the bug fix, another for the style tweak, even if you made both at the same time.

A file in Git moves through three states:

| State | Where it lives | How it gets there |
|---|---|---|
| Modified | working directory | you edit the file |
| Staged | staging area | `git add` |
| Committed | repository history | `git commit` |

### Branch

A **branch** is simply a movable pointer to a commit. The main branch is usually called `main`. When you start a new task, you create a branch, work in it and then merge it back. Branches in Git are created instantly and cost almost nothing, so it is normal to make one per task.

## Your first repository: from init to first commit

Install Git and set your name and email once. They will sign your commits:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Now create a project and the first commit:

```bash
mkdir my-project
cd my-project
git init                      # creates the hidden .git folder with history
echo "# My project" > README.md
git status                    # README.md shows up as untracked
git add README.md             # move the file to the staging area
git commit -m "Add README"    # record the snapshot
git log --oneline             # view the history
```

After `git init`, a `.git` directory appears in the folder. That is the repository with all its history. Delete it and the project stops being a Git repository, while your files stay in place.

To push the project to a server, create an empty repository on GitHub or GitLab and run:

```bash
git remote add origin <repository-url>
git push -u origin main
```

## Common beginner mistakes

- **One giant commit at the end of the day.** Commit in small, logical steps so mistakes are easy to find and revert.
- **Messages like "fix" or "update".** Say what changed and why: "Fix price rounding in cart".
- **Passwords and keys in the repository.** Secrets must never enter history. Use `.gitignore` and environment variables.
- **Working directly in `main`.** Even solo, branches keep the main version working.
- **Confusing Git with GitHub.** Git is the tool; GitHub is a service for hosting repositories and collaborating.

## FAQ

### What is the difference between Git and GitHub?

Git is the version control program running on your computer. GitHub, GitLab and Bitbucket are online services that host Git repositories and add code review and CI/CD on top.

### Do I need Git if I work alone?

Yes. It gives you change history, an easy way back to a working version, a backup on a server and a habit you will need as soon as you join a team.

### Can I store things other than code in Git?

Any text files work well: documentation, configs, content. Large binary files such as videos or archives are stored inefficiently, and the Git LFS extension exists for them.
