---
title: Zapier for Beginners: How to Build Your First Zap
description: Build your first Zap step by step: triggers, actions, field mapping, filters, Paths and testing, plus how Zapier counts tasks toward your plan.
summary: A Zap is a trigger plus one or more actions: an event in one app runs steps in others, and you mostly pay for successful actions (tasks), so filter out unwanted runs as early as possible.
---
## How a Zap works

A **Zap** is an automated workflow in Zapier made of two parts:

- **Trigger** — the event that starts the Zap: a new form response, a new row in Google Sheets, a new email.
- **Action** — what Zapier does in response: creates a row, sends a message, adds a deal to your CRM.

Every Zap has exactly one trigger and one or more actions. In between you can add **filters**, **formatting** and **branches (Paths)**.

## Example: form response to a sheet and Slack

Goal: when a new response arrives in Google Forms, save it to Google Sheets and post a notification to a Slack channel.

1. **Create a Zap** and pick the trigger: Google Forms, event *New Form Response*. Connect your account and choose the form.
2. **Test the trigger.** Zapier pulls the latest response as sample data. If there are none, submit a test response yourself.
3. **Add an action:** Google Sheets → *Create Spreadsheet Row*. Choose the spreadsheet and worksheet.
4. **Map the fields.** Fill each column with data from the trigger: "Name" ← the form's Name field, "Phone" ← Phone, and so on.
5. **Add a second action:** Slack → *Send Channel Message*, again using trigger data in the message text.
6. **Test every step** and turn the Zap on.

## Field mapping: what matters

- You can mix **dynamic data** from earlier steps with plain text: `New lead from {Name}, phone {Phone}`.
- If data arrives in the wrong shape (dates, phone numbers, letter case), add a **Formatter by Zapier** step before the action.
- Do not hardcode values that change: spreadsheet IDs, employee names, links. When they change, the Zap silently starts writing to the wrong place.

## Filters and Paths

A **Filter** lets the Zap continue only when a condition is met — for example, send to Slack only if the lead marked "Urgent". If the condition fails, the Zap stops at that step.

**Paths** are if/then branches: different sets of actions for different conditions. For example:

- Path A: city is Tashkent → notify the Tashkent manager.
- Path B: any other city → notify the regional manager.

Paths are not available on every plan, so check yours.

| Tool | Use it when |
|---|---|
| Filter | You just need to stop unwanted runs |
| Paths | You need different actions depending on the data |
| Formatter | You need to reshape data before using it |

## How tasks are counted

Zapier plans limit the number of **tasks** per month. The core rule:

- **A task is one successfully completed action.** A Zap with a trigger and two actions that runs once typically uses two tasks.
- **The trigger does not count as a task.**
- Built-in utility steps such as Filter, Paths and Formatter generally do not use tasks, but the exact rules follow Zapier's current policy, so check the documentation.
- If a Zap stops at a filter, the actions after it do not run and are not counted.

The practical takeaway: **place filters as early as possible** so you do not spend tasks on leads you do not need.

The other factor is the **trigger polling interval**. Most triggers poll: Zapier checks the app every few minutes, and the frequency depends on your plan. If you need an instant reaction, look for instant triggers or webhooks.

## Common beginner mistakes

- **Testing on empty sample data.** A sample with blank fields hides mapping errors.
- **Forgetting to turn the Zap on** after setup.
- **Connecting an employee's personal account.** When they leave, the Zap breaks. Use a shared work account.
- **Ignoring Zap History.** It shows every run, every error and exactly what data went into each step.

## FAQ

### Can I build a Zap for free?

Yes, Zapier has a free plan with limits on tasks and features — multi-step Zaps and Paths, for example, may require a paid plan. It is usually enough for a first experiment.

### Why does my Zap run with a delay?

Most triggers check for new data on a schedule rather than instantly, and the interval depends on your plan. Instant triggers and webhooks react immediately.

### What happens if an action fails?

The run is marked as errored in Zap History, where you can see the cause and replay the step. Turn on error notifications so you do not hear about problems from customers first.
