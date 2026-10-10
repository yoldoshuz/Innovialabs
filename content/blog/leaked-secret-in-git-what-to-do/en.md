---
title: Committed a Secret to Git? What to Do Right Now
description: A step-by-step plan for a key or password pushed to a repo: revoke and rotate, check access logs, purge history with git-filter-repo, prevent it with gitleaks.
summary: Revoke and replace the leaked key first, then check the logs for suspicious use, then purge the history with git-filter-repo, and add gitleaks to pre-commit and CI so it does not happen again.
---
## The response order

If a key, password or token ended up in a commit, act in exactly this order:

1. **Revoke and rotate the secret.** This is the first and most important step.
2. **Check the access logs** for the period since the commit.
3. **Purge the repository history.**
4. **Set up prevention** so it does not happen again.

Cleaning the history without replacing the key achieves almost nothing: the secret may already have been copied.

## Step 1. Revoke and rotate

Treat the secret as **compromised**, even if the repository is private and the commit was removed a minute later. Copies remain with everyone who cloned or pulled, in forks, in CI caches and with bots that scan public repositories.

- Create a new key in the service's dashboard.
- Update it in your secret store and deploy.
- Confirm everything works, then **revoke the old key**.
- If you cannot switch quickly (for example, a database password used by many clients), restrict network access temporarily and rotate as soon as possible.

Deleting the line in a new commit is not a fix: the secret stays in history.

## Step 2. Check the logs

Find out whether anyone else used the key since the commit:

- the service's access and audit logs (in clouds, audit trails such as AWS CloudTrail);
- requests from unfamiliar IP addresses or at unusual hours;
- new resources, users or webhooks you did not create;
- unexpected growth in bills or quota usage.

If you find traces, it is now an incident: determine which data was accessed. If **personal data** is involved, check whether your jurisdiction requires notifying users or a regulator.

## Step 3. Purge the history

**The commit has not been pushed yet** — just rewrite it locally:

```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit --amend
```

If the secret is in an older commit, you will need a rebase or the tool below.

**The commit is already on the remote** — use **git-filter-repo**. Work in a fresh clone:

```bash
git clone git@github.com:org/repo.git repo-clean
cd repo-clean

# remove a file from the entire history
git filter-repo --path .env --invert-paths

# or replace the secret string in every file
git filter-repo --replace-text ../replacements.txt
```

`replacements.txt` contains lines like `old_value==>REMOVED`. Keep it outside the repository and delete it afterwards.

As a safety measure, git-filter-repo removes the `origin` remote, so add it back and push the rewritten history:

```bash
git remote add origin git@github.com:org/repo.git
git push origin --force --all
git push origin --force --tags
```

Then:

- Tell the team: everyone must **re-clone** the repository rather than pull. Otherwise the old history comes back with the next merge.
- Verify that all branches and tags were rewritten.
- On GitHub and similar platforms, old commits may still be reachable by direct link, in forks and in pull requests. Contact the platform's support to have them removed.

## Step 4. Prevent repeats

**gitleaks** as a pre-commit hook checks changes before they are committed. The easiest way is through the pre-commit framework:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0 # use the current release
    hooks:
      - id: gitleaks
```

Run `pre-commit install` and the hook will run on every commit.

A local hook can be skipped with `--no-verify`, so add a **CI check** too: the same gitleaks over every pull request. For a one-off scan of the full history, use `gitleaks git -v` (in older versions, `gitleaks detect`).

Also:

- Put `.env` and similar files in `.gitignore` from day one; commit only `.env.example`.
- Turn on secret scanning and push protection if your platform supports them.
- Keep secrets in a secret manager or the CI secret store, not in project files.

## Common mistakes

- Starting with history cleanup and forgetting to rotate the key.
- Running `git rm` in a new commit and calling it done.
- Not warning the team, so someone pushes the old history again.
- Relying on a local hook alone without a CI check.

## FAQ

### The repository is private. Do I still need to rotate the key?

Yes. Employees, contractors, CI systems and integrations all have access to a private repository, and local copies can leak along with a laptop. Rotating a key is cheaper than figuring out who has seen it.

### Why git-filter-repo instead of git filter-branch?

git-filter-repo is faster, easier to use and is recommended over filter-branch in Git's own documentation. For simple cases, BFG Repo-Cleaner is an alternative.

### Should I purge history if the key is already rotated?

It is still a good idea. The old key no longer works, but the history may contain other data, and scanners and auditors will keep finding the string and raising alarms.
