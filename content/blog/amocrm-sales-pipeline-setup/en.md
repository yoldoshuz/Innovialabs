---
title: How to Set Up a Sales Pipeline in amoCRM
description: How to build amoCRM pipeline stages from your real sales process, configure fields, automate tasks and messages per stage and connect lead sources.
summary: An amoCRM pipeline is built from your real sales process: each stage is a verifiable action by the customer or salesperson; then you add the fields you need, per-stage tasks and messages, and lead sources.
---

## The short answer: what makes a good pipeline

A pipeline in amoCRM is not a list of statuses copied from someone else — it is **a reflection of how customers actually reach a purchase**. Each stage should answer: "What has already happened with this deal?" If a salesperson cannot say clearly which stage a deal is in, the stages are wrong.

Setup order:

1. Map the sales process.
2. Create the stages.
3. Configure deal and contact fields.
4. Add per-stage automation.
5. Connect lead sources.

## Step 1. Stages from the real process

Take your recent deals and trace their path. A typical pipeline for services:

| Stage | What it means |
|---|---|
| New inquiry | Request received, nobody has contacted the customer yet |
| Qualification | A salesperson made contact and understood the need |
| Proposal sent | The customer received a quote |
| Negotiation | Terms are being discussed |
| Awaiting payment | Invoice issued |

amoCRM has system stages: **Incoming leads** for new requests, plus **Closed – won** and **Closed – lost** at the end. You do not delete them — your stages go in between.

Tips:

- 5-7 working stages are usually enough;
- name stages after a completed event, not an intention;
- if products are sold differently, create **separate pipelines** (for example wholesale and retail) instead of one long list.

## Step 2. Fields

Fields keep salespeople from digging through chats and let managers build reports.

- **Deal fields**: service or product, budget, loss reason, source.
- **Contact and company fields**: phone, messenger, city, tax ID for companies.
- Make **loss reason** a dropdown, not free text — otherwise you cannot analyze it.
- Do not add fields "just in case": every extra field lowers the chance the card gets filled in.

Some fields can be made **required to enter a stage** — for example, a deal cannot move to "Awaiting payment" without an amount.

## Step 3. Per-stage automation

In amoCRM automation is configured right in the pipeline, on each stage. Typical actions:

- **Create a task** for the salesperson when a deal enters the stage: "Contact within an hour".
- **Send a message** to the customer via messenger or email: inquiry confirmation, payment reminder.
- **Change the owner** or distribute leads among salespeople.
- **Run a Salesbot** — a dialog script that asks questions and fills in fields.
- **Send a webhook** to an external system, such as accounting or a warehouse.

Start with two or three automations that fix the main problem — usually forgotten inquiries. Add complex chains once the team is used to the system.

## Step 4. Lead sources

Every inquiry should land in Incoming leads automatically, tagged with its source:

- **website forms** — via amoCRM's built-in forms or the API;
- **messengers** — Telegram, WhatsApp, Instagram via integrations from the amoCRM marketplace;
- **telephony** — calls create deals and are logged in the card;
- **email** — incoming mail is linked to deals.

Pass **UTM tags** from your site into deal fields to see which ads bring sales.

## Common mistakes

- Stages named after departments instead of deal events.
- All products in one pipeline with a dozen stages.
- Automated customer messages without checking the text and send time.
- No rule for when to close a deal as lost, so the pipeline fills with dead deals.

## FAQ

### How many pipelines do I need in amoCRM?

As many as you have fundamentally different sales processes. If the customer journey is the same, one pipeline plus a "product" field is enough.

### Can I change stages when the pipeline already has deals?

Yes, stages can be renamed, added and reordered. Before deleting a stage, move its deals elsewhere so your reports stay clean.

### What if the integration I need is not in the marketplace?

amoCRM has an open API and webhooks — they are used to connect your own website, accounting system or any other service.
