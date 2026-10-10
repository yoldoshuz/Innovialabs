---
title: Notion Databases: Properties, Views and Relations Explained
description: Step by step: create a Notion database, pick the right property types, build table, board and calendar views with filters and link databases with relations.
summary: A Notion database is a set of pages with typed properties; well-chosen properties enable filtering and sorting, views show the same data for different jobs, and relations connect databases without duplicating anything.
---
## The essentials in one minute

A Notion database is a collection of pages that all share the same set of **properties**. The same records can be shown in different **views**: a table for bookkeeping, a board for status, a calendar for deadlines. **Relations** connect records across databases, such as tasks to projects, so you never copy data.

The rule of thumb: design the properties first, then build the views.

## Step 1. Create the database

1. On an empty page, type `/database` and pick **Database – Full page** or **Database – Inline**.
2. A full-page database works as a standalone section ("Tasks", "Clients"). Inline fits when the table lives inside a document.
3. Give it a clear plural name: "Tasks", "Projects", "People".

Each row is a full page: you can write text, add checklists and attach files inside it.

## Step 2. Choose property types

The property type decides how you can filter and sort. The main ones:

| Type | Use it for | Example |
|---|---|---|
| **Title** | Record name, always present | "Build landing page" |
| **Status** | Work stages grouped as To-do / In progress / Complete | Backlog, Doing, Done |
| **Select** | One value from a list | Priority: High |
| **Multi-select** | Several tags | Frontend, Design |
| **Person** | A workspace member | Assignee |
| **Date** | A date or a range | Due, Sprint period |
| **Number** | Numbers with formats like currency or percent | Budget |
| **Checkbox** | Yes/no | Paid |
| **Files & media** | Attachments | Contract PDF |
| **URL / Email / Phone** | Links and contacts | Client website |
| **Relation / Rollup / Formula** | Links and calculations | Project, Progress |

There are also system properties: **Created time**, **Created by**, **Last edited time** and **ID** for unique numbers.

Practical rules:

- Use **Status**, not Select, for work stages: it groups values and works better with boards.
- Never store the assignee as text — use **Person**, or you lose the "My tasks" filter.
- If a list has more than a dozen values and keeps growing, it probably deserves its own database and a relation rather than a Select.

## Step 3. Build views

Click **+** next to the current view name and pick a type. Each view has its own filters, sorts, grouping and visible properties, while the data stays shared.

- **Table** — full overview and bulk editing.
- **Board** — a Kanban board grouped by Status or Select. Dragging a card between columns updates its status.
- **Calendar** — records placed by a Date property. Good for deadlines and content plans.
- **Timeline** — bars across a date range, handy for roadmaps.
- **List** and **Gallery** — a compact list and cards with covers.

### Filters worth creating right away

- "My tasks": `Assignee` → `contains` → `Me`. Every member sees their own work.
- "Overdue": `Due` → `is before` → `Today` and `Status` → `is not` → `Done`.
- "This week": `Due` → `is within` → `This week`.

Combine conditions into **AND / OR** groups with the advanced filter. Name views by purpose: "My tasks", "Team board", "Deadlines".

## Step 4. Link databases with relations

Example: a "Projects" and a "Tasks" database.

1. In "Tasks", add a **Relation** property and select the "Projects" database.
2. Turn on the option to show it on the related database so the relation is **two-way**: each project now lists its tasks.
3. Set a limit of one project per task if that is how your process works.

On top of the relation you can add a **Rollup** in "Projects", for example the number of tasks or the percentage completed.

### Linked views

On a project page, insert `/linked view of database`, choose "Tasks" and filter by the current project. The project now has its own task board inside it.

## Common mistakes

- **One database for everything.** Tasks, clients and notes in one table quickly become unmanageable.
- **A copy of the database per team.** Use one database with filtered views instead.
- **Too many properties.** Show only what each view needs and hide the rest.
- **Text instead of a proper type.** Dates typed as text and people typed as names cannot be filtered.

## FAQ

### What is the difference between Status and Select?

Status is a dedicated type for work stages: its values are grouped into To-do, In progress and Complete, and boards, templates and automations rely on those groups. Select is just one value from a list, such as priority.

### Can I relate databases from different teamspaces?

Yes, relations work between any databases in the same workspace. A member will only see the related records they have access to.

### If I delete a view, do I lose data?

No. A view is only a way of displaying data. Data disappears only if you delete the records or the database itself.
