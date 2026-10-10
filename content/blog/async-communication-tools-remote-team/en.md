---
title: Async Communication in Teams: Tools and Rules
description: How to combine Notion docs, Slack threads and short Loom videos to cut meetings, with team rules, update and decision templates, and common mistakes.
summary: Put context and decisions in documents, discuss them in chat threads, show complex things in short videos, and agree on response times, and most status meetings become unnecessary.
---
## The short answer

**Asynchronous communication** means people exchange information without having to be online at the same time. Everyone replies within their own working window instead of reacting to every ping.

A working setup rests on three channels, each with a clear job:

- **Documents (Notion, Google Docs)**: long-lived context such as tasks, specs and decisions. This is the source of truth.
- **Chat threads (Slack)**: short discussion of one specific question. One question, one thread.
- **Short video (Loom)**: when showing is easier than describing, such as a UI demo, a code walkthrough or a design review.

Meetings remain for what truly needs a live conversation: conflicts, tough negotiations, getting to know each other, brainstorming.

## Which channel to use

| Situation | Channel | Why |
|---|---|---|
| Describe a task or feature | Document | People will come back to it in a month |
| Clarify a detail on a task | Chat thread | Fast and close to the context |
| Show a bug or prototype | Video under 5 minutes | Replaces paragraphs of text |
| Record a decision | Document plus a link in chat | The decision does not get lost in the feed |
| Emotionally charged topic | Call | Text amplifies misunderstandings |
| Urgent incident | Chat mention or phone call | Async is the wrong tool here |

A simple rule: **if the information will be needed later, it belongs in a document**, even if the discussion happened in chat.

## The rules that keep it working

Tools alone change nothing. You need agreements written down in one place:

1. **Expected response time.** For example: regular questions within the working day, urgent ones through a mention or a call. Nobody waits for instant replies or gets anxious.
2. **One thread, one topic.** Reply in the thread, not in the main channel. A new question gets a new message.
3. **Self-contained messages.** Instead of "hi, got a minute?", write the question, context, links and the outcome you need.
4. **An explicit next step.** Every request ends with who responds and by when.
5. **Status and working hours.** Show your time zone and availability in your profile.
6. **Decisions live in documents.** Chat is a conversation, not an archive.

## Weekly update template

This replaces a status meeting. Everyone posts it to a shared thread or Notion page on an agreed day:

```markdown
**Done:** what was finished, with links to tasks
**In progress:** current work and expected date
**Blockers:** what is in the way and whose help is needed
**Decision needed:** questions for the team (with a reply deadline)
```

The key field is **Blockers**. When it is filled in, the team lead reacts the same day instead of waiting for the next meeting.

## Decision record template

A short decision record, in the spirit of an Architecture Decision Record, prevents repeated debates about why something was done a certain way:

```markdown
# Decision: <short name>
Date: <date>   Status: proposed / accepted / reversed
Owner: <who makes the call>

## Context
The problem we are solving and the constraints.

## Options
1. Option A: pros / cons
2. Option B: pros / cons

## Decision
What we chose and why.

## Consequences
What changes and what needs to happen next.
```

The process: the author publishes the doc, shares the link in chat with a comment deadline, discussion happens in doc comments, and after the deadline the owner records the outcome and updates the status.

## How to record a useful video

- **Keep it under 5 minutes.** If it runs longer, split it or write a document.
- **Open with the goal:** "I will show the payment bug and two ways to fix it."
- **Add a text summary** below the video with the main takeaway and the question for the viewer. Video is hard to search; text is easy.
- **Save the link** in the task or document, not only in chat.

## Common mistakes

- **Moving every meeting into chat without rules.** The result is an endless feed and the feeling that you must always be online.
- **Discussing in direct messages.** Knowledge stays with two people and the rest of the team never sees it.
- **Decisions only in Slack.** A month later nobody can find them.
- **Video instead of a document.** Nobody rewatches a spec; it needs to be read and searched.
- **Dropping meetings entirely.** Regular live contact is still needed to build trust.

## Where to start

1. Pick one place for documents and one for chat.
2. Write your communication rules on a single page.
3. Replace one status meeting with a written update and review the result after a few weeks.
4. Use the decision template for every notable technical or product choice.

## FAQ

### Do we need to pay for all three tools?
Not necessarily. Notion, Slack and Loom all have free plans with limits, and many teams manage with Google Docs and built-in screen recording. The roles of the channels and the rules matter more than specific products.

### What if people still expect instant replies?
Write down the expected response time and set up a separate channel for urgent matters. Leaders should set the example by not demanding immediate reactions and by replying within the agreed window.

### Does async work for a small team in one office?
Yes. Even in an office, written decisions and updates save time and help newcomers get up to speed faster. Scale it to your needs and start with the decision template.
