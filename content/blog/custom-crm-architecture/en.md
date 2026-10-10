---
title: How to Design a Custom CRM: Architecture and Data Model
description: Core entities, pipelines, permissions, activity history and an integrations layer: how to design a custom CRM that grows with the business.
summary: A sustainable custom CRM rests on a small set of core entities, pipelines defined as data rather than code, row-level permissions, an append-only activity history and a separate integrations layer driven by events.
---
## The short answer

A custom CRM that lasts is built around five decisions:

1. **A small, stable core data model**: contacts, companies, deals, activities, users.
2. **Pipelines and statuses stored as data**, so managers can change them without a release.
3. **Permissions designed from day one**, down to the record level.
4. **An append-only activity history** that records every change and touch.
5. **An integrations layer** separated from the core and driven by events.

Get these right and new features become configuration, not rewrites.

## Core entities

Start with entities every sales process shares:

| Entity | What it holds | Key relations |
|---|---|---|
| Contact | A person: name, phones, emails, messengers | Belongs to zero or more companies |
| Company | A legal entity or customer account | Has contacts and deals |
| Deal (lead, order) | A sales opportunity with amount and stage | Linked to contact, company, pipeline, owner |
| Activity | Call, message, meeting, task, note | Linked to any record |
| User and team | Employees and their structure | Own records, belong to teams |
| Product line | What was sold, quantity, price | Belongs to deal |

Practical rules:

- **Store phones and emails in normalized form** in a separate table. Deduplication and incoming-call matching depend on it.
- **Separate lead and deal only if the process really differs.** Many businesses are fine with one entity and an early "qualification" stage.
- **Use soft delete.** Sales data is often needed later for disputes and analytics.

## Pipelines and statuses

Hardcoded statuses are the first thing that breaks when the business changes. Model them as data:

- `pipelines` — sales funnels (retail, wholesale, partners).
- `stages` — ordered steps inside a pipeline, each with a type: open, won or lost.
- `stage_transitions` — optional rules about which moves are allowed.
- **Required fields per stage**: for example, an amount is mandatory before "Invoice sent".
- **Loss reasons** as a reference list, not free text, so they can be analyzed.

Record every stage change with a timestamp. Funnel conversion and time-in-stage reports are built from this log, not from the current status.

## Permissions

Plan access with three layers:

- **Roles** define actions: view, create, edit, delete, export.
- **Scope** defines which records: own, own team, whole company.
- **Field-level rules** hide sensitive fields such as margin or purchase price.

Enforce permissions in the backend on every query, not only in the interface. Log exports and bulk operations: they are the most common route for data leaks.

## Activity history

The timeline is what managers open first. Make it reliable:

- **Append-only events table**: who did what, to which record, when, with old and new values.
- **One timeline per record** that merges calls, messages, emails, tasks and field changes.
- **Store integration events too**: payment received, order shipped, message delivered.

This table grows fastest, so plan indexes by record and date, and an archiving policy.

## Integrations layer

Telephony, messengers, website forms, payment gateways, 1C and marketplaces should not talk to core tables directly.

- **Inbound adapters** convert external payloads into internal commands such as "create lead" or "add activity".
- **Outbound events** (deal won, stage changed) go through a queue to webhooks and connectors.
- **Store external IDs** in a mapping table to avoid duplicates and allow re-sync.
- **Make handlers idempotent and retryable**: external systems send duplicates and go offline.

## Extensibility

The business will ask for fields and entities you cannot predict. Options:

- **Custom fields** via a typed definitions table plus a JSON column for values. Simple and flexible; index the fields you filter on.
- **Custom entities** only when real demand appears; they add complexity everywhere.
- **Automation rules** (trigger, condition, action) so routine tasks do not need developers.
- **A public API** with the same permission checks as the interface.

## Common mistakes

- Copying the full feature list of a boxed CRM instead of your real process.
- Statuses as enums in code.
- Permissions checked only on the frontend.
- Integrations writing straight into core tables.
- No plan for duplicates of contacts and companies.

## FAQ

### When does a custom CRM make sense instead of AmoCRM or Bitrix24?

When your process does not fit standard pipelines, when you need deep integration with your own systems, or when per-user licensing becomes a constraint. If a boxed CRM covers the process with settings, start there.

### Should custom fields be stored as columns or JSON?

For a stable set of fields, real columns are simplest. For user-defined fields, a definitions table plus a JSON value column is a common compromise; add indexes only for fields used in filters and reports.

### What should be built first?

Contacts, deals with one pipeline, the activity timeline and basic roles. Integrations and automation come next, once the core model has been checked against real work.
