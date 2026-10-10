---
title: How to Prepare Your GitHub Profile for a Job Search
description: Set up a profile README, pin the right repositories, write clear project descriptions and learn which commit history signals recruiters notice.
summary: Fill in your profile header, add a short profile README, pin 4–6 of your best repositories with clear descriptions and READMEs, and let your commits show steady, meaningful work.
---
## What people look at on a GitHub profile

A recruiter or tech lead usually spends little time on your profile. In that time they want to understand:

- **who you are** and which stack you use;
- **which projects** to open first;
- **how you write code** and present your work;
- **how regularly** you build things.

The profile's job is to answer these quickly and lead people to your best work.

## Step 1. Basic profile details

In your profile settings, fill in:

- **Name** — the same as on your resume.
- **Photo** — neutral, with your face visible.
- **Bio** — one line: role and stack, for example "Backend developer: Python, Django, PostgreSQL".
- **City or time zone**.
- **Links** to your portfolio site and LinkedIn.
- **Email** for contact, if you are comfortable showing it.

## Step 2. Profile README

GitHub shows a README on your profile page if you create a **public repository with the same name as your username** and add a `README.md` file to it.

Keep it short. An example structure:

```markdown
### Hi, I'm Aziz — a frontend developer

I build fast, accessible interfaces with React and TypeScript.

**Currently:** learning UI testing and accessibility.

**Stack:** React, TypeScript, Next.js, Tailwind CSS, Git

**Projects:**
- [Project name](link) — what it does, in one sentence
- [Project name](link) — what it does, in one sentence

**Contact:** email · LinkedIn · Telegram
```

Avoid dozens of technology badges, animated counters and stats widgets: they fill the screen but say nothing about your skills.

## Step 3. Pinned repositories

You can pin up to six repositories on your profile — this is your shop window. Choose **4–6 of your best projects** that fit the role you want. Do not pin study exercises or unchanged forks.

Each pinned repository needs:

- **A clear name** instead of "test-project-2" or "final-final".
- **An About description** — one sentence on what the project does.
- **A demo link** in the Website field.
- **Topics** — stack tags such as `react`, `typescript`, `postgresql`.

## Step 4. A README for every project

When someone opens a repository, they should understand within seconds what it is and how to see it working:

1. What the project does and for whom.
2. A screenshot, GIF or demo link.
3. The stack.
4. How to run it locally — commands that actually work.
5. Key decisions and what was hard.

Also make sure there are no `.env` files, keys or passwords in the repository, and that `.gitignore` excludes dependencies and build output.

## Step 5. Commit history

Recruiters and engineers notice how you work with Git.

| Good signal | Bad signal |
|---|---|
| Small commits with clear messages | One commit with the whole project |
| Messages like "Add search filter by date" | "fix", "asdf", "update" |
| Branches and pull requests | Everything straight to main, no history |
| The project evolves over time | All commits in a single evening |

Examples of clear messages:

```bash
git commit -m "Add pagination to product list"
git commit -m "Fix crash when cart is empty"
git commit -m "Refactor auth service into separate module"
```

Your contribution graph does not need to be green every day — meaningful work matters more than volume. If you mostly work in private repositories, you can enable private contributions in your profile settings: the content stays hidden, but the graph becomes more accurate.

## Common mistakes

- A profile with no name, photo or bio.
- Pinned forks of other people's projects with no changes of your own.
- Repositories with no README or the default one.
- Secret keys in commit history. Deleting the file in a new commit does not remove it from history — revoke the key and issue a new one.

## FAQ

### Do I need GitHub if all my code is under NDA?

It helps. Build one or two small public projects that show your stack and polish your profile, so an employer has at least some sample of your code.

### Do stars matter in a job search?

Stars are nice, but for junior and mid-level roles, code quality, presentation and clear project descriptions matter more.

### Should I contribute to open source?

If you have time, yes. Even small documentation or bug fixes show you can work with someone else's code and a review process.
