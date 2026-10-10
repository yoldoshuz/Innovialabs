---
title: How to Build a Company Wiki in Notion
description: A practical structure for a Notion company wiki: onboarding, processes, policies, permissions, templates, section owners and habits that keep it current.
summary: A working Notion wiki rests on three things: a simple structure with a handful of top-level sections, consistent page templates, and a named owner for every page with a date for its next review.
---
## The short answer

A good Notion knowledge base is not about having many pages. It is about a **clear structure**, **consistent templates** and an **owner** for every section. An employee should find an answer in a couple of clicks or via search, and every page should have someone accountable for keeping it accurate.

## Structure: where to start

Do not build a ten-level tree. Five to seven top-level sections that a newcomer understands are enough:

- **Start here** — what the company is, how the wiki works, who to ask.
- **Onboarding** — first day, first week, access requests, a role-based checklist.
- **Teams** — one page per department: responsibilities, contacts, current projects.
- **Processes** — how work gets done: releases, contract approval, purchasing, time off.
- **Policies** — the rules: security, remote work, expenses, handling personal data.
- **Tools** — which services you use and how to get access.
- **Glossary and FAQ** — company terms and answers to frequent questions.

A useful trick is to store articles in a **database** instead of plain nested pages. Each article then has properties — section, owner, last reviewed date, status — and you can filter on them.

### Example properties for an articles database

| Property | Type | Why |
|---|---|---|
| Section | Select | Group by topic |
| Owner | Person | Who keeps it accurate |
| Reviewed | Date | When it was last checked |
| Status | Status | Draft / Current / Needs update |
| Audience | Multi-select | Everyone, Engineering, Sales |

## Permissions

Notion handles access at the level of **teamspaces** and individual pages. Access levels include full access, edit, comment and view.

A setup that works:

- **Shared wiki** — an open teamspace: everyone reads, only section owners edit.
- **Restricted areas** (HR, finance, legal) — a separate closed teamspace or pages with limited access.
- **Comments for everyone** — others can suggest changes in comments without breaking the text.
- **Guests** — give contractors access to specific pages only, never the whole teamspace.

Watch inheritance: a nested page gets its parent's permissions by default. Put a confidential page inside a shared section and everyone will see it.

## Templates

Templates save time and keep the wiki consistent. In the database, create **page templates** via New → New template:

- **Process**: goal, when it applies, steps, owners, related documents.
- **Policy**: who it applies to, rules, exceptions, effective date, owner.
- **How-to**: outcome, prerequisites, steps with screenshots, common mistakes.
- **Team page**: members, areas of responsibility, communication channels.

Short templates beat long ones: if a template has fifteen mandatory sections, people will ignore it.

## Owners and keeping it current

The main problem with any wiki is that it goes stale. Process and accountability fix this, not the tool.

1. **Every page has an owner** (a Person property). No owner, no page.
2. **A review date.** A "Reviewed" property plus a "Due for review" view that filters pages not checked for a long time.
3. **Built-in verification.** On some plans Notion lets you mark a wiki page as verified for a set period; the badge expires when the period ends.
4. **Regular review.** Each quarter, owners walk through their sections: update, merge duplicates, archive what is no longer needed.
5. **Edit instead of answering in chat.** When a question comes up in a messenger, add the answer to the wiki and reply with the link.

## Common mistakes

- **Migrating everything** from old documents without curation. Twenty useful pages beat five hundred outdated ones.
- **No "Start here" page** — newcomers do not know where to look.
- **Duplicates**: the same guide in three places with three versions. Link instead of copying.
- **Titles nobody searches for**: name pages the way people look for them — "How to request time off", not "HR Policy 07".

## FAQ

### How long does it take to launch a wiki?

It depends on how much knowledge you have and how much is already written down. The fastest path is to launch a skeleton with "Start here", "Onboarding" and "Processes" and fill in the rest as questions come up.

### Who should run the wiki?

You need one overall owner of the structure plus section owners from the relevant teams. People who know a process write its content; the structure owner looks after order and templates.

### Can we open part of the wiki to clients?

Yes. Individual pages can be published to the web or shared with guests. Keep public material in a separate section so you never expose internal pages by accident.
