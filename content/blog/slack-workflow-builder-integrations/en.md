---
title: Slack Workflow Builder and Integrations: Automate Routine
description: Build Slack workflows for requests, standups and onboarding, connect Jira, Google Drive and GitHub, and keep automated notifications from drowning your team.
summary: Workflow Builder turns repeated Slack routines into a trigger plus a few steps — a form, a message, a row in a sheet — while apps for Jira, Google Drive and GitHub bring events in; the rule is one dedicated channel and strict filters for every integration.
---
## The short answer

**Workflow Builder** is Slack's no-code tool for automating routine: a **trigger** (a link, a schedule, a new channel member, an emoji reaction, a webhook) starts a sequence of **steps** — show a form, post a message, add a row to Google Sheets, create a Jira issue. Separately, **apps** for Jira, Google Drive and GitHub send their events into channels and let you act without leaving Slack.

Three workflows pay off almost everywhere: **request intake**, **asynchronous standups** and **onboarding**. Workflow Builder is available on paid Slack plans; check the current plan details before you design around it.

## Workflow 1: request intake

Problem: requests to IT, design or accounting arrive in DMs, lack details and get lost.

1. Create a workflow with the trigger **From a link in Slack** and add it to the channel's bookmarks in `#help-it`.
2. Step **Collect info in a form**: type of request (dropdown), description, urgency, deadline.
3. Step **Send a message to a channel**: post a formatted card in `#help-it` with the answers and the requester's name.
4. Optional: a connector step adds a row to a Google Sheet or creates a Jira issue so the request is tracked.
5. Step **Send a message to a person**: confirm to the requester that the request was received.

Agree on a simple status convention with emoji reactions: eyes — taken, checkmark — done.

## Workflow 2: asynchronous standup

Problem: daily calls take time, and people in different schedules miss them.

1. Trigger **On a schedule**: weekdays, at the start of the working day.
2. Step: post a reminder in `#team-dev` with a button that launches the standup form.
3. Form: what I did yesterday, what I plan today, blockers.
4. Answers are posted to the channel; the team lead reads them and only blockers turn into a call.

Keep the form to three questions. Longer forms get skipped.

## Workflow 3: onboarding

1. Trigger **When someone joins a channel**, for example `#ann-company`.
2. Step: a welcome DM with links to the handbook, key channels and etiquette rules.
3. Step: notify the manager or buddy that a new person has joined.
4. Optionally a second scheduled workflow a few days later asking whether access to all tools works.

## Connecting Jira, Google Drive and GitHub

**Jira Cloud.** Install the official Jira Cloud app, connect your Atlassian account, then connect a project to a channel and set filters: only certain issue types, statuses or a JQL query. Issue links unfurl into previews, and you can create issues from messages.

**Google Drive.** The app notifies you about comments, access requests and shared files in DMs, shows file previews, and checks permissions when you share a link in a channel, offering to grant access to channel members.

**GitHub.** Install the GitHub app and subscribe a channel to a repository:

```text
/github subscribe owner/repo
/github subscribe owner/repo reviews comments
/github unsubscribe owner/repo commits
```

The first line enables the default events, the second adds reviews and comments, the third removes the noisy commit feed. Subscribe each repository only in the channel of the team that owns it.

## Keeping notification noise under control

Integrations are the fastest way to make Slack unbearable. Rules that help:

- **Dedicated channels for bots**: `#alerts-jira-backend`, `#alerts-deploys`. Humans discuss in team channels, bots post in `alerts-`.
- **Filter at the source.** Only statuses or events someone acts on: new critical bugs, failed deploys, PRs waiting for review.
- **One owner per integration** who adjusts filters and removes it when it stops being useful.
- **Discuss in threads** under the bot message, not in new messages.
- **Default to muted.** Members subscribe to `alerts-` channels with mentions only; the on-duty person follows them fully.
- **Review monthly.** If nobody reacted to a channel's alerts for a month, reduce or delete them.

## Common mistakes

- Automating a process the team has not agreed on yet — the workflow freezes the chaos.
- Forms with ten fields that nobody completes.
- Workflows built by one person in a personal account with no one else able to edit them. Add collaborators.
- Every integration posting into `#general`.

## FAQ

### Do I need a developer to build workflows?

No. Forms, messages, schedules and standard connector steps are configured visually. A developer is needed for custom steps, webhooks from your own systems or a Slack app with its own logic.

### Can Workflow Builder replace Zapier or Make?

For processes that start and end inside Slack, often yes. For chains across many external services with branching and data transformation, Zapier, Make or n8n are more flexible.

### How do we stop people from ignoring bot messages?

Send fewer of them. Keep only events someone must act on, tag the responsible person instead of the whole channel, and move everything informational into a muted channel or a daily digest.
