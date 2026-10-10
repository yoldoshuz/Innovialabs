---
title: What Is Jira and How Does It Work
description: Jira explained simply: projects, issue types, epics, boards and workflows, who the tool suits, and how Jira Software differs from Jira Work Management.
summary: Jira is Atlassian's work tracker: every task is an issue inside a project, issues are grouped into epics, shown on Scrum or Kanban boards and moved through a workflow of statuses; it suits teams that need structure, reports and a traceable process.
---
## Jira in one paragraph

**Jira** is a work tracking tool from Atlassian. Originally it was a bug tracker, and today it is one of the most common tools for managing software development. The core idea is simple: every piece of work is an **issue**, issues live in **projects**, are displayed on **boards** and move through a **workflow** — a set of statuses from "To Do" to "Done".

## The building blocks

### Projects

A **project** is a container for issues of one product, team or client. Each project has a short **key**, for example `APP`, and every issue gets an ID based on it: `APP-123`. These IDs are used everywhere — in commits, chats and documents.

Jira has two kinds of projects:

- **Team-managed** — the team configures everything itself, quickly and without an administrator. Good for a start.
- **Company-managed** — settings (workflows, fields, permissions) are shared between projects and managed by admins. Good for standardizing processes across many teams.

### Issue types

An issue type tells what kind of work it is. Typical set for software teams:

| Type | Meaning |
|---|---|
| **Epic** | A large goal or feature that takes many tasks and often several sprints |
| **Story** | A piece of value from the user's point of view |
| **Task** | Technical or organizational work |
| **Bug** | Something that works incorrectly |
| **Sub-task** | A smaller step inside a story, task or bug |

You can add your own types, but every new type adds complexity, so do it only when the work really differs.

### Epics and hierarchy

**Epics** group related issues: "Online payment", "Push notifications", "Admin panel". Stories, tasks and bugs sit under an epic, and sub-tasks sit under them. This hierarchy lets you see progress on a big feature without opening dozens of separate issues.

### Boards

A **board** is a visual view of issues as cards in columns.

- **Scrum board** — work is planned in fixed periods called **sprints**. There is a backlog, sprint planning and reports like burndown and velocity.
- **Kanban board** — continuous flow without sprints. Good for support, operations and teams with a steady stream of requests.

### Workflows

A **workflow** describes which statuses an issue can have and which moves between them are allowed. The simplest one is To Do, In Progress, Done. Real teams add steps like Code Review or QA, and can restrict who moves issues and what must be filled in before a move.

## Who Jira suits

Jira fits well when:

- a team develops software and works with sprints or a structured Kanban process;
- several teams need a common process, permissions and reporting;
- you need traceability: who did what, when, and how a task is linked to code and releases;
- integrations with Git hosting, CI/CD, Confluence and other tools matter.

Jira may be too heavy when a small team just needs a simple to-do board. In that case Trello or a similar tool is often enough.

## Jira Software vs Jira Work Management

For a long time Atlassian sold two separate products:

- **Jira Software** — for development teams: Scrum and Kanban boards, backlog, sprints, development integrations and agile reports.
- **Jira Work Management** — for business teams such as marketing, HR, legal and finance: simpler templates, list, calendar and timeline views, forms for incoming requests, no sprint-heavy terminology.

Both run on the same platform, so issues, workflows and search work the same way. Atlassian has since been merging them into a single Jira product, where the difference shows up as project templates rather than separate licenses. The practical rule stays the same: choose **software templates** for development work and **business templates** for request-driven or operational work.

## Common mistakes when starting

- Copying a large enterprise configuration into a small team.
- Creating dozens of custom fields that nobody fills in.
- Using epics as permanent categories instead of finite goals.
- Leaving issues without an assignee or a clear "done" criterion.

## FAQ

### Is Jira only for programmers?

No. Development teams are the main audience, but marketing, HR, support and operations teams use Jira with business templates and simpler boards.

### Should I choose a team-managed or company-managed project?

If one team is starting and wants to configure things itself, choose team-managed. If the company needs the same process and rules across many projects, choose company-managed.

### What is the difference between an epic and a label?

An epic is a finite piece of work with its own progress and end. A label is just a tag for filtering, and it does not have a status or a deadline.
