---
title: Trello Automation with Butler: Rules, Buttons and Examples
description: How to automate Trello with Butler: rules, scheduled and due date commands, buttons, plus ready recipes for moving cards, assigning people and reminders.
summary: Butler is Trello's built-in no-code automation: rules react to events, scheduled and due date commands run on time, and buttons run actions on click; start with two or three rules that remove repetitive clicks and test each one on a copy of the board.
---
## What Butler does

**Butler** is the automation engine built into Trello, now usually shown in the board menu simply as **Automation**. It performs actions instead of you: moves cards, adds members, sets due dates, posts comments. No code is required — you build each command from ready blocks in the editor.

There are four types of automation:

| Type | When it runs | Typical use |
|---|---|---|
| **Rule** | When something happens on the board | A card moved to "Done" gets its due date marked complete |
| **Scheduled command** | On a calendar: daily, weekly, monthly | A weekly planning card appears every Monday |
| **Due date command** | Relative to a card's due date | A reminder one day before the deadline |
| **Button** | When someone clicks it | "Take it" assigns you and moves the card to "In Progress" |

Buttons come in two kinds: **card buttons** appear on the back of every card, **board buttons** sit in the board header and act on many cards at once.

## How to create a rule

1. Open the board and choose **Automation** in the board menu.
2. Go to **Rules** and click to create a new rule.
3. Pick a **trigger**: a card is moved, added, labeled, a checklist is completed, a due date is set, and so on.
4. Narrow the trigger with filters: which list, by whom, with which label.
5. Add one or more **actions** in the order they should run.
6. Save and test it by doing the trigger yourself.

The editor shows every command as a readable sentence. The recipes below are written the same way, so you can recreate them block by block.

## Recipes: moving cards

Close a task properly when it reaches "Done":

```text
when a card is moved into list "Done" by anyone,
mark the due date as complete and remove all the members from the card
```

Send a card to review as soon as its checklist is finished:

```text
when all the checklists in a card are completed,
move the card to the top of list "Review"
```

A board button for a weekly cleanup:

```text
archive all the cards in list "Done"
```

## Recipes: assigning members

Route new bugs to the person who triages them:

```text
when a card with the "bug" label is added to list "Inbox" by anyone,
add member @qa-lead to the card
```

A card button for picking up work:

```text
join the card, move the card to the top of list "In Progress"
```

Variables make actions personal. For example, `{username}` inserts the name of the person who triggered the command, which is handy in comments like "Taken by {username}".

## Recipes: reminders and routines

A due date command that warns the card's members:

```text
1 day before a card is due,
post comment "@card the deadline is tomorrow"
```

Here `@card` mentions everyone who is a member of the card, so they get a notification.

A scheduled command for a recurring meeting:

```text
every monday at 9:00 am,
create a new card with title "Weekly planning" in list "To Do"
```

## Common mistakes

- **Rules that trigger each other.** Rule A moves a card into a list, rule B reacts to that list and moves it back. Check chains before saving.
- **Triggers that are too broad.** "When a card is moved by anyone" without a list filter fires on every drag.
- **Renaming lists and labels.** Commands refer to names, so after renaming, check that the rules still match.
- **Ignoring the quota.** Every plan has a monthly limit of command runs. A noisy rule can use it up; the Automation panel shows your usage.
- **Automating an unclear process.** If the team has not agreed on what "Review" means, a rule will only make the confusion faster.

## How to start

Watch a week of your team's work and write down the clicks people repeat most. Automate the top two or three, give them clear names and tell the team what each one does. Unexpected card moves confuse people more than manual work does.

## FAQ

### Is Butler available on the free plan?

Yes, automation is included on the free plan, but with a smaller monthly limit of command runs than paid plans. Check the current limits on the official pricing page.

### Can Butler connect Trello to other services?

Automation includes a few actions for external services, such as sending an email or posting to Slack, depending on your plan. For complex integrations across several systems, tools like Zapier, Make or n8n are usually more flexible.

### Do I need programming skills to use Butler?

No. Every command is assembled from triggers and actions in a visual editor. What matters more is a clear process: know which lists exist, what each one means and who is responsible for moving cards.
