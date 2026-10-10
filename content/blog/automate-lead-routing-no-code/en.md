---
title: How to Automate Lead Collection from Site Forms Without Code
description: Build a no-code flow for website leads: save to a spreadsheet, notify the team in a messenger, assign a manager, block duplicates and alert on failures.
summary: The site form sends a webhook to Zapier, Make or n8n; the workflow normalizes contacts, checks the sheet for duplicates, assigns a manager in rotation or by rule, saves the lead, posts to the team chat and sends a separate alert whenever something fails.
---
## The flow in one paragraph

Form submission → **webhook** into your automation platform → **normalize** phone and email → **check for a duplicate** in the sheet → assign a **manager** → append a row to **Google Sheets** → post to the **team chat** (Telegram, Slack) → on failure, send an **alert** to a separate channel.

You can build it in Zapier, Make or n8n: the logic is identical, only the step names differ.

## What to prepare first

**A "Leads" sheet** with these columns:

| Column | Why |
|---|---|
| Date | When the lead arrived |
| Name | How to address the person |
| Phone | Normalized, the duplicate key |
| Email | Normalized, a second key |
| Source | Page or UTM tag |
| Manager | Who it is assigned to |
| Status | New, in progress, closed |
| Event ID | So one event is never processed twice |

**A "Settings" sheet**: the list of managers with their messenger handles, an "active" flag and a counter cell for rotation.

**A team chat** for leads and a **separate chat** for technical alerts, so errors do not drown among leads.

## Step-by-step build

### 1. Receive the lead

Use a **webhook**: many site builders and form tools can send data to a URL. The lead arrives immediately, without polling. If the form does not support webhooks, use the platform's built-in integration for that form.

### 2. Normalize

Before any comparison, bring data to one format:

- phone — digits only with the country code, e.g. `998901234567`;
- email — lowercase, trimmed;
- missing required fields — stop the run with a filter and log it.

Without this step, `+998 90 123-45-67` and `998901234567` look like two different people.

### 3. Check for duplicates

Search the sheet for a row with the same phone or email:

- **Found** within the last few days — do not create a new lead; mark it as a repeat inquiry and notify the manager already assigned.
- **Not found** — continue.

Also check the **event ID**: if the app resent the same webhook, simply skip it.

### 4. Assign a manager

Options from simple to advanced:

- **Round-robin:** read the counter, pick the manager with that position from the active list, increment the counter. Note that simultaneous leads can read the counter at the same moment; for high volume, the platform's data store is more reliable than a spreadsheet.
- **By rule:** city, product, language — via a router or Paths.
- **By working hours:** outside the schedule the lead goes to whoever is on duty.

Read the manager list from the settings sheet instead of hardcoding it, so replacing a person means editing one row.

### 5. Save and notify

- Append a row with all fields and the assigned manager.
- Post to the team chat: name, phone, source and a mention of the assignee. A link to the sheet row speeds things up.

### 6. Failure alerts

- In **Make**, add error handlers to key modules; in **n8n**, an Error Workflow; in **Zapier**, error notifications and a fallback path where possible.
- Send the alert to the technical chat with the error message and the lead data so it can be handled manually.
- Add a **heartbeat check**: if no leads arrive for a long stretch during working hours, the workflow says so — the form itself may be broken.

## Common mistakes

- **No normalization** — duplicates slip through.
- **Managers hardcoded in steps** — after a staff change, leads go nowhere.
- **Errors and leads in one chat** — alerts get lost.
- **An open spreadsheet** — anyone with the link sees customers' personal data. Restrict access and check personal data storage requirements in your country.

## FAQ

### Why a spreadsheet and not a CRM right away?

A spreadsheet is a fast start: easy to set up and easy to read. When volume grows or you need a sales pipeline, point the same workflow at a CRM by swapping the write step.

### Which platform should I use for this flow?

Zapier is enough for a simple linear flow. If you need branching, array handling and flexible error handling, Make is more convenient. n8n fits when your own server and control over data matter.

### What about leads that arrived during an outage?

If alerts include the lead data, they are handled manually. Many apps also retry failed webhooks, and platforms keep run history where failed executions can be replayed.
