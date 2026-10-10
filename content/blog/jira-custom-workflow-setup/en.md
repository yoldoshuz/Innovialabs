---
title: How to Create a Custom Workflow in Jira
description: Build a custom Jira workflow: statuses, transitions, conditions, validators and post-functions, mapped to a real dev, QA and release process.
summary: A Jira workflow is a set of statuses connected by transitions; conditions decide who can move an issue, validators check data before the move and post-functions act after it, and a good workflow mirrors your real process with as few statuses as possible.
---
## How a workflow is built

A **workflow** is the path an issue takes from creation to completion. It has five building blocks:

| Element | What it does | Example |
|---|---|---|
| **Status** | Where the issue is now | In Progress, QA |
| **Transition** | An allowed move between statuses | "Send to QA": In Progress to QA |
| **Condition** | Who can see and use the transition | Only the QA group can mark testing as passed |
| **Validator** | What must be true before the move | Fix version must be filled in |
| **Post-function** | What happens automatically after the move | Set the resolution, assign to a person |

Every status also belongs to a **status category**: To Do, In Progress or Done. Boards, reports and searches rely on these categories, so pick them carefully.

## Where to edit workflows

- **Company-managed projects**: an admin edits workflows in the global Jira settings under issues and workflows. A workflow is attached to a project through a **workflow scheme**, which maps issue types to workflows. Changes are saved as a draft and then published.
- **Team-managed projects**: open project settings, choose an issue type and edit its workflow. Instead of the classic three rule types you get simpler rules: restrict who can move an issue, validate fields and perform actions after a move.

The logic is the same in both; only the depth of configuration differs.

## Mapping a real dev, QA and release process

Start from how work actually moves, not from Jira's options. A typical product team:

```text
To Do -> In Progress -> Code Review -> QA -> Ready for Release -> Done
             ^              |           |
             +--------------+-----------+
          (changes requested / QA failed)
```

Now turn it into transitions with rules:

| Transition | From to | Rules |
|---|---|---|
| **Start work** | To Do to In Progress | Post-function: assign to the current user |
| **Submit for review** | In Progress to Code Review | None, keep it fast |
| **Request changes** | Code Review to In Progress | Validator: a comment is required |
| **Approve** | Code Review to QA | Condition: users with the developer role |
| **QA failed** | QA to In Progress | Validator: a comment describing the problem |
| **QA passed** | QA to Ready for Release | Condition: QA group only. Validator: Fix version is set |
| **Release** | Ready for Release to Done | Condition: release manager role. Post-function: set resolution to Done |

Status categories: To Do in **To Do**, the four middle statuses in **In Progress**, Done in **Done**.

## Step by step

1. **Draw the process** on paper or a whiteboard with the team. Agree on what each status means and who is responsible.
2. **Copy an existing workflow** instead of editing the default one directly. You keep a fallback.
3. **Add statuses** and set the right category for each.
4. **Create transitions** with clear verb names: "Send to QA", not "Next".
5. **Add rules** only where they prevent real mistakes.
6. **Attach the workflow** to issue types through the workflow scheme and publish. If existing issues are in statuses that disappear, Jira asks you to map them to new ones.
7. **Update the board columns** so every new status appears in the right column.
8. **Test** with a few issues and accounts with different roles.

## Avoiding overcomplicated workflows

- **Fewer statuses.** Add one only if someone acts differently in it. "Waiting for review by Anna" is not a status — it is an assignee.
- **No status per department.** Statuses describe the state of work, not the org chart.
- **Limit "any status to any status" transitions.** They are convenient, but they make the process invisible.
- **Every validator needs a reason.** Each required field makes the move slower. Keep the ones that protect releases and reports.
- **Do not forget resolution.** In company-managed projects, if nothing sets the resolution on the way to Done, issues stay "Unresolved" and filters and reports become wrong.
- **One workflow for many projects.** Shared workflows are easier to maintain than a unique one for every team.

## FAQ

### What is the difference between a condition and a validator?

A condition decides whether the transition is even available to a user, so the button may simply not appear. A validator lets the user try and then blocks the move if the data is incomplete, showing an error.

### Can I change a workflow on a project that is already in use?

Yes. When you publish changes or switch the workflow, Jira asks you to map issues from removed statuses to new ones. Do it at a calm moment and tell the team beforehand.

### Should Code Review be a separate status?

If reviews regularly take time and you want to see that queue on the board, yes. If they are quick and done right away, a separate status only adds clicks.
