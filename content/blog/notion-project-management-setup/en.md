---
title: How to Run Project Management in Notion
description: A working Notion project management setup: projects, tasks and sprints databases, statuses, owners, timeline, dashboards and limits versus trackers.
summary: Project management in Notion runs on three linked databases — Projects, Tasks and Sprints — with clear statuses, owners and dates; a timeline and dashboards sit on top, while complex engineering processes are better served by a dedicated tracker.
---
## The short answer

To manage projects in Notion you need **three linked databases**:

- **Projects** — larger goals with dates and an owner.
- **Tasks** — concrete work with an assignee, due date and status.
- **Sprints** — short periods in which the team commits to tasks.

The databases are connected with **relations**, and views are built on top: a task board, a project timeline and a dashboard for every member. The Notion Projects template and the built-in sprint setup give you a similar structure out of the box — below is the logic to build it yourself or to check what you have.

## The Projects database

| Property | Type | Note |
|---|---|---|
| Name | Title | "Website redesign" |
| Status | Status | Planning, Active, On hold, Done |
| Owner | Person | One person accountable for the outcome |
| Dates | Date (range) | Start and end for the timeline |
| Priority | Select | High, Medium, Low |
| Tasks | Relation | Two-way link to Tasks |
| Progress | Rollup | Percent of tasks in the Complete group |

## The Tasks database

| Property | Type | Note |
|---|---|---|
| Name | Title | Verb + result: "Build the lead form" |
| Status | Status | Backlog, To do, In progress, In review, Done |
| Assignee | Person | One owner |
| Due | Date | Deadline |
| Project | Relation | Link to Projects |
| Sprint | Relation | Link to Sprints |
| Estimate | Number or Select | Hours or story points |
| ID | ID | Task number for referencing in chat |

Rule: **one assignee** per task. If two people work on it, split the task.

## The Sprints database

| Property | Type | Note |
|---|---|---|
| Name | Title | "Sprint 12" |
| Dates | Date (range) | Usually one or two weeks |
| Tasks | Relation | Link to Tasks |
| Current | Formula | Flags the active sprint |
| Completed | Rollup | Percent of tasks done |

Formula for the "Current" property:

```js
dateStart(prop("Dates")) <= today() and dateEnd(prop("Dates")) >= today()
```

Then this formula in Tasks flags tasks in the active sprint, which makes the board easy to filter:

```js
prop("Sprint").filter(current.prop("Current")).length() > 0
```

## Views you need every day

- **Sprint board** — tasks grouped by status, filtered to the current sprint.
- **My tasks** — filter `Assignee contains Me`, status is not Done, sorted by due date.
- **Backlog** — tasks without a sprint, sorted by priority. Planning pulls work from here.
- **Project timeline** — the Projects database in a Timeline view using "Dates". The timeline can show dependencies between records.
- **Deadline calendar** — tasks placed by their due date.

## Dashboards

A dashboard is a regular page with **linked views** (`/linked view of database`). A version for a manager:

- active projects with progress;
- overdue tasks across all projects;
- tasks waiting for review;
- workload by person — a table of current-sprint tasks grouped by assignee.

For a team member: "My tasks", "Today and overdue", "My projects". If your plan includes chart views, they work well for status and workload.

## The working rhythm

1. **Planning**: move tasks from the backlog into a sprint via the Sprint property.
2. **Daily**: everyone updates statuses on the sprint board.
3. **Review**: unfinished tasks roll into the next sprint or go back to the backlog.
4. **Database automations** (on paid plans) take care of routine, such as setting a date when a task moves to Done or notifying the assignee.

## Limits versus dedicated trackers

Notion covers a lot, but dedicated trackers like Jira, Linear or YouTrack offer things Notion lacks or only handles through workarounds:

- **Enforced workflows**: Notion cannot stop someone from moving a task straight from Backlog to Done.
- **Agile reporting**: burndown, velocity and cycle time must be built by hand or in external tools.
- **Code integration**: branches, commits and pull requests are less tightly connected.
- **Scale**: very large task databases make the interface slower.
- **Per-task permissions** are limited compared with enterprise trackers.

Notion works well for small teams, agencies, marketing and operations. With many developers and a strict process, use a tracker for tasks and Notion for documentation.

## FAQ

### Do we need sprints if we do not use Scrum?

No. Skip the Sprints database and run Kanban: a backlog, a status board and due dates. Sprints help when you want a regular planning rhythm.

### How do we avoid drowning in setup?

Start with the Tasks database and a single board. Add Projects and Sprints when tasks pile up or parallel streams appear. Every new property should answer a specific question.

### Can clients be given access to a project in Notion?

Yes, through guest access to a specific project page. Create a dedicated client page with a linked view filtered to their project rather than opening the whole task database.
