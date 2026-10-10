---
title: Developer Portfolio: Which Projects to Include and How
description: Which pet projects impress employers, how to present them with READMEs, demos and write-ups, and why tutorial clones work against you in a job search.
summary: A portfolio needs 2–4 finished projects that solve a clear problem, each with a README, a working demo and a short write-up of your decisions — not a dozen copies of tutorials.
---
## What employers look for in a portfolio

A portfolio answers the question a resume leaves open: **can you take a task all the way to a result?** Employers look less at the number of projects and more at:

- **Completeness** — the project works and can be opened.
- **Independence** — your own decisions are visible, not a replayed lesson.
- **Code quality** — structure, clear names, no leftover junk.
- **Ability to explain** — why it was built this way.

Usually **2–4 strong projects** are enough. Three finished ones beat ten abandoned halfway.

## Projects that impress

A good project solves a clear problem and contains at least one non-trivial part.

| Project type | Why it works |
|---|---|
| A tool for a real problem | There is a user and meaningful requirements |
| A project with an external API and error handling | Shows work with real-world data |
| An app with authentication and a database | Full cycle: from UI to storage |
| An open-source contribution | Reading other people's code and following project rules |
| A project for a local business or organization | Real users and real feedback |

Match projects to the role you want. For frontend, interface quality, responsiveness and accessibility matter. For backend, API design, database work and tests. For data analysis, an investigation with conclusions and visualizations.

## What to avoid

- **One-to-one tutorial clones**: yet another to-do list or a famous-service clone built along with a video does not show your skills. If you build a clone, add meaningful features of your own and describe them.
- **Unfinished projects** with no description and a broken demo.
- **Keys and passwords in the repository**: an instantly visible red flag.
- **One giant "initial commit"** containing all the code.
- **Dozens of tiny study repos** up front, burying your strong work.

## How to present a project

### README

The README is the project's shop window. A recruiter may never open the code, but will read the README. Minimal structure:

```markdown
## Project name

One sentence: what it does and for whom.

Demo: link · Screenshot or GIF

## Features
- Key feature 1
- Key feature 2

## Stack
React, TypeScript, Node.js, PostgreSQL

## Getting started
npm install
npm run dev

## Decisions and challenges
Why this approach, what was hard and how it was solved.
```

### Demo

A working link removes the biggest barrier: people see the result in seconds. For frontend, free static hosting is enough; for mobile apps, a video or GIF of the main flows. If the demo needs a login, put a test account in the README.

### Project write-up

A short text, one or two screens long — in the README, a blog or your portfolio site:

- what problem you solved;
- which options you considered and why you chose this one;
- what went wrong and how you fixed it;
- what you would improve now.

A write-up like this often becomes a talking point in interviews and shows engineering thinking better than the code itself.

## Where to host your portfolio

- **GitHub** with your best repositories pinned — a must for developers.
- **A simple portfolio site** with project cards: name, description, stack, links to demo and code.
- **Links in your resume and LinkedIn** to specific projects, not just your profile.

The portfolio site does not need to be complex. It matters more that it loads fast, looks fine on a phone and gets to the projects in one click.

## FAQ

### How many projects should a portfolio have?

Usually 2–4 finished projects matched to the role you want are enough. Quality and presentation matter more than quantity.

### Can I include course projects?

Yes, if you have significantly extended them and the README honestly states what was the base and what you added. A project replayed from a lesson without changes should not be front and center.

### Do I need a design if I am a backend developer?

A polished interface is not required. A clear README, API documentation and, if possible, an easy way to try it — such as a request collection or a minimal client — are enough.
