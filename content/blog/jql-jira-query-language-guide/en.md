---
title: JQL Guide: Advanced Search and Filters in Jira
description: Learn JQL: operators, functions like currentUser() and startOfWeek(), saved filters, dashboards and subscriptions, plus ready-made queries for managers.
summary: JQL is Jira's query language: you combine fields, operators and functions into conditions like assignee = currentUser() AND resolution = Unresolved, save them as filters and reuse them in dashboards and email subscriptions.
---
## What JQL is

**JQL (Jira Query Language)** is the language of advanced search in Jira. A query is a set of conditions in the form **field, operator, value**, joined with `AND`, `OR`, `NOT` and optionally sorted with `ORDER BY`:

```text
project = APP AND type = Bug AND resolution = Unresolved ORDER BY priority DESC
```

Switch the issue search from basic to **JQL** mode and Jira will autocomplete fields, values and functions as you type.

## Operators you will use every day

| Operator | Meaning | Example |
|---|---|---|
| `=` `!=` | Equals, not equals | `status = "In Progress"` |
| `>` `>=` `<` `<=` | Comparison, often for dates | `created >= -7d` |
| `IN` `NOT IN` | One of a list | `priority IN (Highest, High)` |
| `~` `!~` | Contains text, does not contain | `summary ~ "payment"` |
| `IS EMPTY` `IS NOT EMPTY` | Field is filled or not | `assignee IS EMPTY` |
| `WAS` | The field had a value at some point | `status WAS "QA"` |
| `CHANGED` | The field changed, with optional details | `status CHANGED TO Done AFTER -14d` |

Tips:

- Put values with spaces in double quotes: `"In Progress"`.
- Relative dates use units: `-1d`, `-2w`, `-4h`.
- Use parentheses when you mix `AND` and `OR`: `project = APP AND (priority = Highest OR labels = hotfix)`.
- `statusCategory` (To Do, In Progress, Done) is more robust than listing every status name.

## Functions that make queries dynamic

Functions are calculated at the moment of search, so one saved query works for everyone and every week.

| Function | Returns |
|---|---|
| `currentUser()` | The person running the query |
| `now()` | Current date and time |
| `startOfDay()`, `startOfWeek()`, `startOfMonth()` | Start of the current period; accept offsets like `startOfWeek(-1)` |
| `endOfWeek()`, `endOfMonth()` | End of the current period |
| `openSprints()`, `closedSprints()` | Active or completed sprints |
| `membersOf("group")` | Users in a group |
| `unreleasedVersions()` | Versions not yet released |

Note that the start of the week depends on your Jira locale and time zone settings.

## Ready queries for managers

Replace `APP` with your project key.

What is left in the current sprint:

```text
project = APP AND sprint IN openSprints() AND statusCategory != Done ORDER BY Rank
```

Overdue work:

```text
project = APP AND duedate < now() AND resolution = Unresolved ORDER BY duedate ASC
```

Issues stuck in progress for five days or more:

```text
project = APP AND status = "In Progress" AND updated <= -5d
```

Critical bugs without an owner:

```text
project = APP AND type = Bug AND priority IN (Highest, High) AND assignee IS EMPTY AND resolution = Unresolved
```

Created this week and resolved last week:

```text
project = APP AND created >= startOfWeek()
project = APP AND resolved >= startOfWeek(-1) AND resolved < startOfWeek()
```

Returned from QA in the last two weeks:

```text
project = APP AND status CHANGED FROM QA TO "In Progress" AFTER -14d
```

What the team is working on right now:

```text
assignee IN membersOf("dev-team") AND statusCategory = "In Progress" ORDER BY assignee
```

## Saved filters

A query becomes a **filter** when you click **Save as** and give it a name. Then:

- **Share it** with a group, project or specific people; by default a filter is private.
- **Name it clearly**: "APP — overdue", not "my filter 3".
- **Reuse it** as the source for boards, dashboards and subscriptions. A board itself is built on a filter, so editing that filter changes what the board shows.

## Dashboards

A **dashboard** is a page of gadgets, and most gadgets take a saved filter as their source. Useful combinations:

- **Filter Results** — a list of issues from a filter, for example overdue work.
- **Two Dimensional Filter Statistics** — a table such as assignee by status.
- **Pie Chart** — distribution by priority, type or component.
- **Created vs Resolved** — whether the team keeps up with incoming work.

Share the dashboard with the same audience as its filters, otherwise people see empty gadgets.

## Subscriptions

A **subscription** emails the results of a filter on a schedule. Open the filter, choose to create a subscription, select recipients and frequency — for example, overdue issues every Monday morning. Keep subscriptions few and focused; a daily mail nobody reads is noise.

## Common mistakes

- Hardcoding names and dates instead of `currentUser()` and `startOfWeek()`.
- Using `status != Done` when the workflow has several final statuses; `statusCategory != Done` is safer.
- Forgetting parentheses around `OR`.
- Sharing a dashboard but not its filters.

## FAQ

### Why do colleagues see different results for the same filter?

JQL respects permissions, so people only see issues from projects they can access. The other common reason is a function like `currentUser()`, which returns a different person for each viewer.

### What is the difference between resolution and status?

Status is where the issue is in the workflow. Resolution says how it was finished. `resolution = Unresolved` reliably finds open issues if your workflow sets resolution on completion.

### Can I search by text in comments?

Yes. The `comment ~ "word"` condition searches comments, and `text ~ "word"` searches across the main text fields at once.
