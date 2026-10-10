---
title: Empty State Design: Turning Blank Screens Into Guidance
description: Types of empty states — first use, no results, errors and cleared screens — what each should say and do, with ready copy patterns and layout examples.
summary: An empty state should explain what belongs on the screen, why it's empty right now and what to do next, with one clear action; first use, no results, errors and cleared screens each need their own message.
---

## What an empty state is for

An empty screen is a moment when the user doesn't know what to do. A good empty state answers three questions:

1. **What is this place?** What will appear here.
2. **Why is it empty?** No data yet, nothing matched, something broke or everything is done.
3. **What next?** One clear action.

A simple formula covers most cases: **heading + one sentence + primary button**. An icon or illustration is optional.

## The four types

| Type | When it happens | What to say | Action |
|---|---|---|---|
| **First use** | The user hasn't created anything yet | What will appear here and why it's useful | Create the first item, import, use a template |
| **No results** | Search or filters returned nothing | That nothing matched, and how to widen the search | Clear filters, change the query |
| **Error** | Data didn't load, no connection, no access | What went wrong in plain words | Try again, request access |
| **Cleared** | The user finished or deleted everything | That this is a good or expected state | Often none, or a light next step |

Mixing them up is a common mistake: a user who filtered a list down to zero should not see "Create your first project".

## First use

This is the user's first impression of a feature, so it works almost like onboarding.

```text
[ icon ]
No projects yet
Create a project to keep tasks, files and people in one place.
[ Create project ]   Import from a file
```

- Show the **benefit**, not just the absence.
- Offer a **shortcut**: a template, sample data or import.
- One primary button; secondary options as links.

## No results

```text
Nothing found for "desk lamp"
Check the spelling or try a broader word.
[ Clear filters ]
```

- **Repeat the query** so the user sees what was searched.
- **Show active filters** and let them be removed in one tap.
- If possible, **suggest alternatives**: popular items, similar categories, corrected spelling.

## Errors

```text
Couldn't load your orders
Check your internet connection and try again.
[ Try again ]
```

- Say what happened **in plain language**, without blaming the user.
- Technical details and error codes can go in small text below, not in the heading.
- For missing permissions, name the next step: "You don't have access to this folder" — **Request access**.
- Keep navigation and the header visible so the user isn't stuck.

## Cleared or completed

```text
All caught up
New messages will appear here.
```

- A calm, positive tone fits, but don't overdo jokes.
- An action isn't always needed. If there is a natural next step, offer it softly.

## Layout rules

- Show the empty state **inside the area where content would be**, not as a full-screen takeover. The header, tabs and filters stay in place.
- Order of elements: icon or illustration (optional, modest size) → heading → one or two lines of text → primary button → secondary link.
- The illustration must **not push the button out of view**, especially on mobile.
- **Loading is not empty.** While data loads, show a skeleton or spinner. Flashing "No data" for a second before content appears confuses users.

## Copy rules

- Be specific: "No invoices yet" instead of "No data".
- Explain the reason and the next step in one or two short sentences.
- Start the button label with a verb: "Create invoice", "Clear filters".
- In errors, keep the tone neutral and helpful; save playful copy for first use and completed states.

## Common mistakes

- A bare "No data" with no explanation or action.
- The same message for first use and for no results.
- An empty state shown while data is still loading.
- A huge illustration and a tiny or missing button.
- Dead ends: nothing to click, no way back.
- Filters hidden, so the user can't undo what caused zero results.

## FAQ

### Do empty states need illustrations?

No. An illustration can add character to first-use screens, but the heading, text and button do the real work. In errors and no-results states, a small icon or nothing at all is often better.

### How is an empty state different from onboarding?

Onboarding is a planned tour or set of steps, while an empty state appears in context when a specific screen has no content. A first-use empty state can act as lightweight onboarding: it explains one feature exactly when the user meets it.

### Where should empty states live in a design system?

Make them a component with variants for each type: first use, no results, error and cleared. Then every screen gets consistent structure and copy patterns, and designers remember to include them in mockups.
