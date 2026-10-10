---
title: Software Maintenance and Support: Models and Pricing
description: Retainer, hourly or per-ticket software support: what each model covers, what drives the price and how to choose the right volume for your product.
summary: A retainer fits products the business depends on daily, hourly billing fits irregular changes, and per-ticket pricing fits rare small requests. Choose the volume by how often things change and what downtime costs you.
---

## Which support model to choose

There are three main models: **retainer**, **hourly** and **per-ticket**. The short answer:

- the product earns money every day and downtime is expensive — take a **retainer** with an SLA;
- changes come in waves and the system is stable in between — **hourly** billing works;
- requests are few and similar — **pay per ticket** is enough.

Many companies combine them: a small retainer for monitoring and incidents plus hourly billing for larger improvements.

## Support vs maintenance

These terms are often mixed up, and the contract depends on the difference.

- **Support** reacts to problems: bugs, outages, user questions, recovery after incidents.
- **Maintenance** is planned work: updating dependencies and servers, security patches, backups, monitoring, small improvements.

If the contract covers only support, the system slowly ages: libraries stay outdated, certificates expire, vulnerabilities pile up.

## Comparing the models

| Model | How you pay | Pros | Cons |
|---|---|---|---|
| Retainer | Fixed monthly fee for a block of hours or a scope of responsibility | Guaranteed response time, the team knows the system | You pay in quiet months too |
| Hourly | For hours actually worked | You pay only for work done | No speed guarantees, the vendor may be busy |
| Per-ticket | Fixed price per request type | Predictable cost per task | Non-standard tasks are hard to classify |

## What drives the cost

Instead of ready-made numbers, look at the factors that move the price:

- **Response time and coverage hours.** A one-hour response around the clock costs noticeably more than business-hours coverage.
- **Complexity and age of the system.** Old code without documentation or tests takes longer per change.
- **Number of integrations.** Payment providers, ERP, CRM, external APIs — each can break regardless of your own code.
- **Security and data requirements.** Personal and payment data raise process requirements.
- **Who owns the infrastructure.** If the vendor also runs the servers, the scope grows.

## How to size the volume

1. **Look at history.** How many requests and changes did you have in recent months? Which were urgent?
2. **Estimate the cost of downtime.** What do you lose per hour if the site or CRM is down? That defines the SLA you need.
3. **Separate urgent from planned.** Incidents go into the retainer, product development into a separate budget.
4. **Start with a trial period.** After two or three months you will see whether the package is enough.
5. **Review regularly.** Unused hours or constant overruns are a signal to adjust the contract.

## What to put in the contract

- **SLA**: response and resolution times for each severity level.
- **Incident classification**: what counts as critical and what is a planned task.
- **What is in and out of scope**, and how work beyond the package is billed.
- **What happens to unused hours**: they expire or roll over.
- **Access and handover**: all passwords, repositories and documentation stay with you.
- **Reporting**: a monthly list of completed work and hours spent.

## Common mistakes

- Having no contract at all and searching for a developer during an outage.
- Buying a 24/7 SLA for an internal system used only during the day.
- Mixing support and development in one budget, so new features eat incident time.
- Not asking for reports and not knowing what you pay for.

## FAQ

### Can a different team support the product, not the one that built it?

Yes, but you need a handover phase: code audit, documentation, access and infrastructure. The better the project is documented, the faster a new team becomes effective.

### Do I need support if the system runs without errors?

Yes, at least maintenance. Security updates, certificate renewals, backups and monitoring are needed by any live system, even a stable one.

### Which is better value: retainer or hourly?

It depends on how regular the work is and what downtime costs. If requests come every month and downtime is critical, a retainer is usually more convenient. If work is rare, hourly billing is fairer.
