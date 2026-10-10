---
title: How to Switch Development Vendors Mid-Project
description: A step-by-step plan for changing your software vendor: secure access and code, audit the project, onboard a new team and keep the product running.
summary: First bring every account and the source code under your control, then order an independent audit, and only then hand the project to a new team with a period of overlap and a rollback plan.
---

## The short answer

You can change vendors mid-project without taking the product down if you follow the order: **control of assets → audit → handover → overlap → full transition**. The main mistake is ending the contract before you actually hold the access, the source code and the documentation.

## Step 1. Secure access and code

Before any difficult conversation, make sure everything critical belongs to you, not to the vendor:

- **Repository** (GitHub, GitLab, etc.) — your account should own the organization.
- **Hosting and cloud** — the account is registered to your company and paid with your card.
- **Domain and DNS** — the registrar and the control panel.
- **Databases and backups** — you have a fresh copy.
- **Third-party services**: payment providers, email, SMS, analytics, app stores, API keys.
- **Design files** and documentation.

Build a simple table: service, owner, who has access, date checked. Keep passwords in a company password manager. After the handover, **rotate every key and password** the previous vendor could see.

## Step 2. Run an independent audit

Before the new team writes any code, it needs to know what it is inheriting. An audit answers:

- Does the project build and run from scratch using the instructions?
- Does the code in the repository match what runs on the server?
- Are there tests, CI/CD and an architecture description?
- Which vulnerabilities and outdated dependencies exist?
- Which tasks are really done, and which are only marked as done?

The result is an honest picture: what to keep, what to rewrite and how much work is actually left.

## Step 3. Organize the knowledge transfer

Even if the relationship is strained, try to agree on a **handover period**: a few sessions where the previous team walks through deployment, architecture and known issues. Put it in the contract or an addendum.

A minimal handover package:

| Item | Why it matters |
|---|---|
| Deployment guide | The new team can run the project |
| Architecture and integrations map | Clear view of how parts connect |
| Known bugs and technical debt | No need to rediscover them |
| Environment variables (no secrets in chat) | The project works on a new server |

## Step 4. Avoid downtime

- **Do not change infrastructure and team at the same time.** Let the new team work on the current servers first; migration is a separate stage.
- **Freeze big releases** during the handover and ship only fixes.
- **Prepare a rollback plan**: a fresh backup and a way to restore the previous version.
- **Give the new team small starter tasks** so they learn the codebase with little risk.

## Common mistakes

- Terminating the contract before getting access.
- Expecting the new team to move at full speed from day one.
- Not checking intellectual property: the contract should transfer the rights to the code.
- Leaving old access active "just in case".

## FAQ

### Should I tell the current vendor in advance?

Yes, but only after the key access and a copy of the code are already yours. A fair notice and an agreed handover period usually save more time than a sudden break.

### What if the vendor refuses to hand over the code?

Check the contract: who owns the results and what it says about delivering materials. If the rights are yours, involve a lawyer. Next time, require code delivery at every milestone.

### Can the new team just rewrite everything?

They may suggest it, but decide based on the audit. A full rewrite is justified only when fixing the existing code would cost more and carry more risk.
