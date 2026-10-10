---
title: How to Set Up a Scrum Board and Sprints in Jira
description: Step by step: create a Scrum project in Jira, groom the backlog, estimate in story points, start and close sprints, and read burndown and velocity charts.
summary: Create a project from the Scrum template, fill and prioritize the backlog, estimate issues in story points, start a sprint with a clear goal and realistic scope, close it honestly, and use burndown and velocity to plan the next one.
---
## The short version

A working Scrum setup in Jira takes five steps: **create a Scrum project**, **build and prioritize the backlog**, **estimate in story points**, **start a sprint**, and **close it and review the reports**. The tool part takes minutes; the discipline around it is what makes it useful.

## Step 1. Create a Scrum project

1. Create a new project and choose the **Scrum** template from the software templates.
2. Pick the project type. **Team-managed** is faster to configure for one team; **company-managed** is better when workflows and fields must be shared across projects.
3. Give the project a clear name and a short key, for example `APP`.

Jira creates a board with a **Backlog** view, an **active sprint** view and reports.

## Step 2. Groom the backlog

The **backlog** is an ordered list of everything the team might do. Grooming (backlog refinement) keeps it useful:

- **Order by priority.** Drag the most important issues to the top. The order is the plan.
- **Make top items ready.** Issues for the next one or two sprints need a clear description and **acceptance criteria**.
- **Split large items.** If a story cannot be finished in one sprint, break it into smaller ones and keep them under one epic.
- **Remove noise.** Close duplicates and ideas that nobody will ever do.

A good rule: refine regularly in a short session rather than in a long meeting before each sprint.

## Step 3. Estimate with story points

**Story points** measure the relative size of work — effort, complexity and uncertainty together — not hours. A 5-point story is roughly twice as big as a 2 or 3-point one.

How to set it up and use it:

- Make sure the board's **estimation** setting uses story points. In company-managed projects this is in the board settings, in team-managed projects it is in the project features.
- Use a short scale, often based on Fibonacci: 1, 2, 3, 5, 8, 13.
- Estimate as a team, for example with planning poker, so different views come up early.
- Anything at the top of the scale is a signal to split the issue.

Do not convert points to hours and do not compare points between teams: each team's scale is its own.

## Step 4. Start a sprint

1. In the Backlog view, **create a sprint**.
2. Drag issues from the top of the backlog into it. Use the sum of story points shown on the sprint as a check against your usual pace.
3. Click **Start sprint** and set the **name**, **duration**, **start and end dates** and a **sprint goal** — one sentence that explains why this sprint matters.
4. Work from the active sprint board and update statuses as work moves.

Avoid adding new issues in the middle of a sprint. If something urgent appears, take something of a similar size out.

## Step 5. Close the sprint

At the end, click **Complete sprint**. Jira asks what to do with unfinished issues: move them to the **backlog** or to the **next sprint**. Choose consciously — unfinished work should be re-prioritized, not carried over automatically.

Then hold a **review** of what was delivered and a **retrospective** on how the team worked.

## Reading burndown and velocity

| Report | What it shows | What to look for |
|---|---|---|
| **Sprint burndown** | Remaining work in the sprint day by day against an ideal line | A flat line followed by a drop at the end means work is not finished in small pieces. A line going up means scope was added mid-sprint |
| **Velocity** | Committed versus completed story points for recent sprints | A stable completed value is your planning baseline. Regular large gaps between committed and completed mean overplanning |
| **Sprint report** | What was completed, not completed and added during the sprint | Shows scope changes and carry-over at a glance |

Velocity is a planning tool for the team, not a performance score. Once it becomes a target, estimates inflate and the numbers stop meaning anything.

## Common mistakes

- Starting sprints with an unordered backlog.
- Estimating in hours disguised as points.
- Closing a sprint by moving everything forward without discussion.
- Judging people by their story point totals.

## FAQ

### How long should a sprint be?

Many teams use one or two weeks. Shorter sprints give faster feedback; longer ones suit work that is hard to split. Pick one length and keep it stable so velocity is comparable.

### What if the burndown chart is empty?

Usually the issues in the sprint have no estimates, or the board uses a different estimation statistic. Check the estimation setting and make sure sprint issues have story points.

### Can I run Scrum without story points?

Yes. Some teams count issues instead and keep items similar in size. What matters is a consistent measure so you can compare sprints.
