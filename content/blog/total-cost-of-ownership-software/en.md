---
title: Total Cost of Ownership of Software: Beyond the Build Price
description: What makes up software total cost of ownership after launch: hosting, licenses, support, updates, staff and downtime, and how to estimate it upfront.
summary: The build price is only the first part of what software costs. After launch you pay for hosting, licenses, support, updates, people and downtime, so compare options by total cost of ownership (TCO) over several years.
---

## What TCO is and why it matters

**Total Cost of Ownership (TCO)** is all the money you will spend on a system over its entire life: building or buying it, launch, operation, development and, at the end, replacement or retirement.

Many projects make the mistake of comparing only the development estimate. A cheap solution can be expensive to maintain, while one that costs more upfront can be cheaper over several years. Build-vs-buy decisions, vendor selection and stack choices should all be made on TCO.

## What you pay for after launch

### Infrastructure and hosting

- servers or cloud, databases, file storage;
- CDN, domains, SSL certificates;
- backups and their storage;
- monitoring and logging.

Cloud costs grow with load and often become more noticeable than expected at launch.

### Licenses and third-party services

- paid libraries, SDKs, fonts;
- SaaS tools: email, SMS, maps, analytics;
- usage-based APIs for payments and AI models;
- app store and developer accounts.

Subscriptions pile up quietly: each one looks small on its own.

### Support and fixes

- fixing bugs users find;
- incident response, including outside working hours;
- user support.

### Updates and compatibility

- updating frameworks and dependencies, patching vulnerabilities;
- adapting mobile apps to new iOS and Android versions;
- changes in external APIs you depend on;
- legal requirements, for example on storing personal data.

Skipping updates does not save money; it defers it. Over time the system ages and migration becomes more expensive.

### People

- developers, DevOps, QA, in-house or on a support contract;
- the product manager's time;
- training staff who use the system;
- knowledge transfer when the team changes.

### Downtime and risk

- lost revenue while the service is unavailable;
- manual work by staff during an outage;
- reputational damage;
- data recovery after an incident.

### Ongoing development

A working product almost always needs new features. The development budget is part of ownership, not a separate project.

## How to estimate TCO upfront

1. **Choose a horizon**, usually the several years you plan to use the system.
2. **List the cost items** above for each option.
3. **Separate one-time costs** (development, migration, rollout) from recurring ones (hosting, subscriptions, support).
4. **Account for growth**: more users mean more load, storage and support requests.
5. **Assess risk**: what an hour of downtime costs your business.
6. **Compare options by the total**, not the starting price.

| Option | Usually cheaper at start | Where costs accumulate |
|---|---|---|
| Off-the-shelf SaaS | Yes | Per-user subscription, limitations, vendor lock-in |
| Custom development | No | Support, updates, team |
| Customized open source | Often | Integration, expertise, maintaining the fork |

## How to lower TCO

- **Simple architecture** over fashionable: fewer components, less maintenance.
- **A mainstream stack**: easier to hire developers.
- **Automation**: CI/CD, automated tests and monitoring lower the cost of each change.
- **Documentation and access** held by you, not only by the vendor.
- **Regular audits** of subscriptions and cloud resources.
- **A support agreement** with clear response times.

## Common mistakes

- budgeting only for development and nothing for the first year of operation;
- choosing the cheapest vendor without assessing code quality;
- postponing updates until they become urgent;
- ignoring the time staff spend working around the system's shortcomings.

## FAQ

### What share of the budget should go to post-launch support?

There is no universal figure. It depends on system complexity, number of integrations, load and pace of development. It is more reliable to list concrete cost items and ask the vendor to estimate support separately from development.

### Which is cheaper: off-the-shelf SaaS or custom development?

Compare TCO over the same horizon. SaaS is usually cheaper at the start, but subscriptions grow with users. Custom development costs more upfront but can pay off when processes are unique or the user count is large.

### Can I save money by skipping updates?

Only temporarily. Outdated dependencies accumulate vulnerabilities and incompatibilities, and a later upgrade or rewrite will cost more than regular maintenance.
