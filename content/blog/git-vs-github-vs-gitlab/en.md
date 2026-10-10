---
title: Git vs GitHub vs GitLab: What's the Difference
description: Git is a version control tool; GitHub, GitLab and Bitbucket are platforms that host repositories. Here is how they differ and when to self-host.
summary: Git is a program that records the history of your code on your machine; GitHub, GitLab and Bitbucket are online services that host Git repositories and build team collaboration around them.
---

## The short answer

- **Git** is a **version control system**: a program that records every change to your files, lets you work on parallel branches and merge them. It runs locally and needs no internet.
- **GitHub, GitLab, Bitbucket** are **platforms** that store Git repositories on a server and add what a team needs: pull/merge requests, code review, issues, CI/CD, access control.

An analogy: Git is the engine and the format, like a text editor, while GitHub is cloud storage with collaboration built on top. You can use Git without GitHub, but not GitHub without Git.

## What Git does on its own

- stores the commit history and lets you return to any version;
- supports **branches** for features and fixes;
- combines changes (`merge`, `rebase`) and shows conflicts;
- syncs with remote repositories via `push` and `pull`.

```bash
git init
git add .
git commit -m "First commit"
git remote add origin <repository URL>
git push -u origin main
```

The last two commands are where the platform comes in. Everything before them works completely offline.

## What the platforms add

- **Pull request / merge request** — discussing and reviewing changes before merging.
- **CI/CD** — running tests and deployments automatically on every push.
- **Issues and boards** — tracking work next to the code.
- **Permissions** — who can read, push and approve merges.
- **Branch protection** — no direct pushes to `main`, required reviews.
- **Wiki, releases, package and container registries**.

## GitHub vs GitLab vs Bitbucket

| | GitHub | GitLab | Bitbucket |
|---|---|---|---|
| Strength | Largest community, open source | Full DevOps lifecycle in one product | Integration with Jira and Atlassian tools |
| CI/CD | GitHub Actions | GitLab CI/CD | Bitbucket Pipelines |
| Review | Pull requests | Merge requests | Pull requests |
| Self-hosting | GitHub Enterprise Server (paid) | Self-managed, free Community Edition available | Data Center (paid) |
| Best for | Open source, most teams | Teams wanting all-in-one and self-hosting | Teams living in Jira |

Pricing and free-tier limits change regularly, so check current terms on each platform's site before choosing.

## How to choose a platform

1. **Where does your team already live?** If tasks are in Jira, Bitbucket gives handy links. If community and open source matter, GitHub.
2. **Do you need CI/CD out of the box?** All three provide it, but configs are not compatible: moving means rewriting pipelines.
3. **Data requirements.** If code cannot be stored in someone else's cloud, look at self-hosted options.
4. **Integrations.** Check that your messengers, trackers and deployment services work with the platform.

The good news: a Git repository moves between platforms with its full history. Issues, reviews and pipelines are harder to move.

## When self-hosting makes sense

Self-hosting is justified when:

- **regulatory or client requirements** forbid keeping code with an external provider;
- you need to work **in a closed network** without internet access;
- you need full control over backups, updates and access.

The downsides are real too: you are responsible for the server, security updates, backups and monitoring. For a small team without special requirements, a cloud option is usually simpler and more reliable. Besides GitLab self-managed, there are lightweight open source options such as **Gitea** and **Forgejo** that suit small installations.

## FAQ

### Can I use Git without GitHub?

Yes. Git works fully locally. A remote can be any server, a network folder or another platform.

### Is it hard to move from GitHub to GitLab or back?

The code and its history move with a simple `git push` to a new repository, and the platforms have import tools. Most of the work is usually migrating CI/CD configs and integrations.

### Which should a beginner choose?

Learn Git itself first, and pick any popular platform for hosting — the core skills transfer to all three.
