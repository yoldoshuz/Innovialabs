---
title: Technical Due Diligence: What Investors Check in a Startup
description: What technical due diligence covers before investment or acquisition: code, architecture, security, IP ownership, key-person risk and documentation.
summary: Investors check whether the product can scale and whether it hides risks: code and architecture quality, security, clean ownership of the code, dependence on key people and documentation.
---

## The short answer

Technical due diligence answers two questions: **can the product handle growth** and **does it hide risks that would devalue the deal**. Reviewers look at six areas: code, architecture, security, intellectual property rights, people dependencies and documentation. The goal is not to find perfect code but to understand how critical the problems are and what fixing them will cost.

## What gets reviewed

### Code quality

- Readability, consistent style, a code review process.
- Automated tests on key logic and whether they actually run in CI.
- Technical debt: outdated dependencies, abandoned modules, "temporary" hacks.
- Git history: regular meaningful commits or rare giant changes.

### Architecture and scalability

- Whether the system can handle more load without a full rewrite.
- How the database, queues, caches and external services are set up.
- Whether there are single points of failure.
- What infrastructure costs and how it grows with the user base.

### Security

- How passwords and secrets are stored (not in code, not in plain text).
- Employee access to production and data.
- Handling of personal data and compliance with legal requirements.
- Backups and tested restore procedures.
- Known vulnerabilities in dependencies.

### Intellectual property rights

One of the most sensitive points:

- Have all employees, freelancers and contractors assigned their rights in the code to the company?
- Which open-source libraries are used, and are their licenses compatible with the business model?
- Was any code written by a founder before the company existed, without a later transfer of rights?

A gap here can stop a deal even if the product is technically excellent.

### Dependence on people

- How many people understand the key parts of the system.
- What happens if the technical co-founder or the only backend developer leaves.
- Who owns access to domains, cloud and repositories — the company or individuals.

### Documentation and processes

- An architecture overview and instructions to deploy from scratch.
- Release process, monitoring, incident response.
- A roadmap and the team's own understanding of its tech debt.

## How to prepare

| Step | What to do |
|---|---|
| Access | Move all accounts to company ownership, remove personal ones |
| Rights | Collect contracts and IP assignment documents from every code author |
| Licenses | List dependencies with their licenses |
| Security | Remove secrets from the repository, update vulnerable packages |
| Documentation | Describe architecture, deployment and key decisions |
| Tech debt | Honestly list known problems and the plan to address them |

## Common mistakes

- Hiding known problems: they will be found anyway, and trust will be lost.
- Keeping source code or cloud accounts on founders' personal accounts.
- Having no signed documents with freelancers who built early versions.
- Starting preparation in the last week before the deal.

## FAQ

### Do I need perfect code to pass?

No. Investors know startups carry tech debt. What matters more is that the team is aware of it and that there are no critical risks in security and ownership.

### Who performs technical due diligence?

Usually external technical experts or consultants hired by the investor, sometimes the fund's own technical staff. They get access to the code and interview the team.

### How long does it take?

It depends on the size of the product and the stage of the deal. Having documents and access ready speeds it up considerably.
