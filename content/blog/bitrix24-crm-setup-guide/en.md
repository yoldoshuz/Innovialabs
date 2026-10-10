---
title: How to Set Up Bitrix24 CRM: A Practical Guide
description: A step-by-step Bitrix24 CRM setup: leads vs deals mode, pipelines, custom fields, automation rules and triggers, access roles, CRM forms and Open Channels.
summary: Pick a CRM mode first (with or without leads), map your deal pipelines, add only the fields you need, automate routine work with automation rules and triggers, assign rights by role, and connect forms and Open Channels so requests land in the CRM automatically.
---
## The short answer

Set up Bitrix24 CRM in this order:

1. **CRM mode** — classic (with leads) or simple (deals only).
2. **Pipelines and stages** — they mirror the real path from inquiry to payment.
3. **Fields** — only the ones you make decisions or build reports on.
4. **Automation rules and triggers** — tasks, notifications and stage changes.
5. **Access rights** — who sees and edits what.
6. **Lead sources** — CRM forms on your website and Open Channels for messengers and chat.

The order matters: automating an undefined process only locks in the chaos.

## Leads or straight to deals

Bitrix24 offers two CRM modes.

| Mode | How it works | Best for |
|---|---|---|
| **Classic** | A request becomes a lead first; after qualification it turns into a contact, company and deal | High inbound volume, many unqualified requests, a separate qualification step |
| **Simple** | Every request immediately creates a deal and a contact | Smaller volume, mostly qualified requests, one manager owns the client end to end |

If unsure, start with simple mode: fewer entities, less confusion. You can switch later, but do it before a large data import.

## Pipelines and stages

A **pipeline** (deal category) is the sequence of stages for one business process. Create separate pipelines only for genuinely different processes, such as new sales, repeat sales or service requests.

Rules for stages:

- Each stage is a **verifiable event**: "Proposal sent", "Invoice issued" — not "In progress".
- Five to eight stages are usually enough; long pipelines erode discipline.
- Always configure **loss reasons**, otherwise you cannot see where clients drop off.

## Custom fields

Fields are added in the settings of the lead, deal, contact or company form. Before creating one, ask: who fills it in, when, and which report uses it?

- Use **lists** instead of free text where values repeat (source, city, client type).
- Make a field **required at a specific stage**, not from the start: for example, "Amount" becomes required when moving to "Invoice issued".
- Do not duplicate fields: data about the person belongs to the contact, data about the purchase belongs to the deal.

## Automation rules and triggers

In the **automation** section, you configure actions for each pipeline stage.

- An **automation rule** (robot) runs when a deal enters a stage: create a task, message the client, change the responsible person, set a reminder.
- A **trigger** moves a deal to a stage after an external event: a form was submitted, the client wrote in chat, a call came in, an invoice was paid.

Good first scenarios:

- new request → a call task for the manager with a deadline;
- no activity on a deal for several days → notify the team lead;
- move to "Invoice issued" → automatic email to the client.

Add automation gradually and test every rule on a test deal.

## Access rights

Rights are managed through **roles** in CRM settings. A typical setup:

- **Manager** — sees and edits their own deals and contacts.
- **Department head** — sees the department's deals.
- **Administrator** — full access, including settings and export.

Restrict **export and deletion** separately: these are the riskiest actions for your client base.

## CRM forms and Open Channels

- **CRM forms** are created in the CRM section and embedded on your site with a code snippet or shared as a link. Every submission creates a lead or a deal with its source recorded.
- **Open Channels** collect conversations from messengers, social networks and website live chat in a single interface and link them to client records.

After connecting, send a test request through each channel and check: was a record created, was someone assigned, did the automation rules fire?

## Common mistakes

- Copying someone else's pipeline instead of describing your own process.
- Adding dozens of fields "just in case".
- Turning on automation before the team is comfortable working in the CRM manually.
- Giving everyone admin rights.

## FAQ

### Can I change the CRM mode after we start?

Yes, the mode can be switched in CRM settings. But switching changes how records are created, so decide before importing your database and training the team.

### How many pipelines does a small company need?

Usually one or two. Create a new pipeline only when a process truly has different stages, not just a different product.

### What is the difference between an automation rule and a business process?

An automation rule is a simple action tied to a stage. A business process is a complex scenario with conditions and branches; it is needed less often and takes more effort to build and maintain.
