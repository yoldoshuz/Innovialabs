---
title: Nielsen's 10 Usability Heuristics Explained
description: Jakob Nielsen's ten usability heuristics in plain language: what each means, good and bad interface examples, and how to use them for a quick self-review.
summary: Nielsen's heuristics are 10 general principles of usable interfaces: show system status, speak the user's language, allow undo, stay consistent, prevent errors and so on. With them you can find obvious problems in a design within an hour, without user testing.
---

## What Nielsen's heuristics are

**Usability heuristics** are ten principles formulated by Jakob Nielsen. They are not strict rules but rules of thumb: a handy lens for reviewing an interface and spotting problems that stop people from completing a task. They apply to websites, apps, CRMs and even Telegram bots.

## All 10 heuristics with examples

### 1. Visibility of system status

Users should always know what is going on.
**Good:** a file upload bar with a percentage. **Bad:** nothing changes after tapping "Pay", so the user taps again.

### 2. Match between the system and the real world

Use the user's words, not the developer's.
**Good:** "Couldn't save — no internet connection." **Bad:** "Error 503: upstream timeout."

### 3. User control and freedom

People need a clear emergency exit from a mistaken action.
**Good:** "Email deleted. Undo." **Bad:** a multi-step form with no Back button that loses data when you leave.

### 4. Consistency and standards

Same things should look and be named the same, and familiar patterns should work as they do elsewhere.
**Good:** the logo links to the home page. **Bad:** "Delete" on one screen and "Erase" on another for the same action.

### 5. Error prevention

Preventing a mistake beats a nice error message.
**Good:** a calendar that does not let you pick a past delivery date. **Bad:** a free text date field that accepts "31.02".

### 6. Recognition rather than recall

Do not make people keep information in their heads.
**Good:** recent searches shown under the search box. **Bad:** step 3 asks for a product code that was only visible on step 1.

### 7. Flexibility and efficiency of use

A simple path for newcomers, accelerators for experts.
**Good:** keyboard shortcuts, templates, bulk actions in a CRM. **Bad:** to change the status of 50 deals you must open each one.

### 8. Aesthetic and minimalist design

Every extra element competes with the important ones.
**Good:** the payment screen shows only the amount, payment method and button. **Bad:** banners, promos and five secondary links around the "Pay" button.

### 9. Help users recognize, diagnose and recover from errors

An error message should explain what happened and how to fix it.
**Good:** "Password must be at least 8 characters" next to the field. **Bad:** "Invalid data" at the top of the page and a cleared form.

### 10. Help and documentation

Ideally help is not needed, but when it is, it should be close and to the point.
**Good:** a tooltip on a tricky field, a short step-by-step guide. **Bad:** a link to a long PDF with no search.

## How to run a quick self-review

1. **Pick 2-3 key scenarios**: sign-up, checkout, submitting a request.
2. **Walk through each scenario** screen by screen and check each screen against all 10 heuristics.
3. **Log issues in a table**: screen, heuristic violated, description, severity.
4. **Rate severity**: blocks the task, seriously hinders, cosmetic.
5. **Bring in a second reviewer.** Different people notice different issues, so combining several independent reviews pays off.

| Screen | Heuristic | Issue | Severity |
|---|---|---|---|
| Checkout | 1. System status | No feedback after tapping the button | High |
| Sign-up | 9. Errors | Form clears on error | High |

## Common mistakes when using heuristics

- **Using them instead of testing.** Heuristics catch obvious problems but cannot tell you whether real users understand your product.
- **Arguing about the heuristic number.** One issue can break several principles. Describing the problem matters more than classifying it perfectly.
- **Fixing everything at once.** Start with problems that block key scenarios.

## FAQ

### Are Nielsen's heuristics outdated?

No. Interfaces have changed, but the principles describe human perception and behavior, so they apply to mobile apps as well as voice and chat interfaces.

### Who can run a heuristic evaluation?

A designer or UX specialist is ideal, but a product manager or developer can do a basic checklist review too. The key is to walk through real scenarios rather than just look at screens.

### How is heuristic evaluation different from usability testing?

In a heuristic evaluation, experts review the interface against a list of principles. In usability testing, real users perform tasks while you observe. The methods complement each other: heuristics are cheaper and faster, tests are more accurate.
