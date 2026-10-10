---
title: How to Run a Usability Test: Step-by-Step Guide
description: Step-by-step usability testing: writing realistic tasks, recruiting participants, running a think-aloud session and turning findings into prioritized fixes.
summary: A usability test means real users complete typical tasks in your interface while you quietly watch where they struggle. You need four to six well-matched participants, scenario-based tasks, a neutral moderator and a findings list ranked by frequency and severity.
---

## How the method works

**Usability testing** shows not what people think of a design, but how well they can use it. You give a participant a task, ask them to think aloud, and watch. Every hesitation, extra click or wrong guess is a finding.

You can test almost anything: a clickable Figma prototype, a live website, a mobile app or even a paper sketch. The earlier you test, the cheaper the fixes.

## Step 1. Define the goal and tasks

Decide what you are checking first: checkout, sign-up, finding specific information. One test should cover three to five key scenarios.

Write each task as a **real-life situation**, not an instruction:

| Weak | Better |
|---|---|
| Click "Catalog" and find sneakers | You need running shoes under a certain budget. Find a pair that suits you |
| Sign up | You want to save your cart so you can come back to it tomorrow |

Avoid words that appear on buttons and menus. Otherwise you are testing word matching, not whether the interface makes sense.

## Step 2. Recruit participants

- Participants should match your **real audience** in tasks and experience, not just be "anyone."
- For a qualitative test, **four to six people per user group** is usually enough: the main problems start repeating after the first few sessions.
- Do not use colleagues or anyone involved in building the product. They know too much.
- A short screener of three to five questions filters out poor fits: how often they do this task, which services they use.
- Offer a thank-you for their time and get consent to record the screen and voice.

## Step 3. Prepare the session script

A session takes 30 to 60 minutes. A simple moderator script:

```text
1. Welcome (2 min)
   "We are testing the website, not you. You can't get anything wrong.
   If something is unclear, that is a design problem and we want to know."
2. Think-aloud request (1 min)
   "Please say out loud what you see, what you look for and what you expect."
3. Warm-up questions (5 min)
   How do you usually handle this task today?
4. Tasks (20-40 min)
   One at a time, task text on a card or in chat.
5. Wrap-up questions (5 min)
   What was hardest? What would you change?
```

Run a **pilot session** with one person to check wording and timing.

## Step 4. Observe without leading

The moderator's main rule is **do not lead**. Common slips and what to say instead:

- "See the button on the right?" → stay quiet and wait.
- "Was that easy?" → "Tell me what just happened."
- "Why didn't you use the menu?" → "What did you expect to find here?"
- Participant asks "Where do I click?" → "Where do you think?"

If someone is stuck for a long time, mark the task as failed and gently move on. Record **behaviour**, not opinions: where they paused, what they looked for, where they made mistakes, what they said. It helps to have a separate note-taker besides the moderator.

## Step 5. Turn findings into fixes

Write down problems right after each session while details are fresh. Then combine them into one table:

| Problem | Participants | Severity | Fix |
|---|---|---|---|
| Can't find the pay button on mobile | 4 of 5 | Blocks task | Pin the button to the bottom of the screen |
| Confuse two pricing plans | 2 of 5 | Slows down | Add a plan comparison |

A simple three-level severity scale works well: **blocks** the task, **slows** it down, **annoys**. Fix frequent blockers first. After the changes, run a short retest on the same scenarios.

## Common mistakes

- Testing everything at once instead of a few key scenarios.
- Asking "Do you like it?" instead of watching actions.
- Explaining the interface when a participant gets it wrong.
- Drawing conclusions from a single participant.
- Writing a report and never turning findings into backlog tasks.

## FAQ

### Can I run a usability test remotely?

Yes. A video call with screen sharing and a prototype link is enough. Remote sessions make recruiting easier, but facial cues are harder to read, so the think-aloud request matters even more.

### What is the difference between moderated and unmoderated tests?

In a moderated test, a moderator is present and can ask follow-up questions. In an unmoderated test, the participant completes tasks alone through a testing service. Unmoderated tests are faster and scale better but explain the reasons behind errors less well.

### Should I test before or after development?

Ideally both. Testing a prototype catches problems while they are cheap to fix, and testing the finished product reveals issues that only appear with real data and devices.
