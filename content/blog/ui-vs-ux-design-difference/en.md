---
title: UI vs UX Design: What Is the Difference
description: UI is how an interface looks and responds, UX is whether the product solves the user's task easily. Examples, overlaps and who does which work.
summary: UX design decides what the product does and in what order the user moves through it; UI design decides how each screen looks and reacts. UX without UI is a working skeleton, UI without UX is a beautiful screen that does not help anyone.
---
## The short answer

**UX (user experience) design** is about the path: what problem the user has, which steps they take to solve it, where they get stuck and what the product should do at each step. **UI (user interface) design** is about the surface: layout, buttons, typography, colors, icons, states and animations on every screen of that path.

A simple way to remember it: UX answers "**does this work and make sense?**", UI answers "**does this look clear, consistent and pleasant?**".

## Concrete examples

Take a food delivery app.

**UX decisions:**

- Let people browse the menu without registering and ask for a phone number only at checkout.
- Show the delivery fee before the cart, not as a surprise on the last screen.
- Remember the last address so a repeat order takes three taps.
- Decide what happens when a restaurant closes while the user is ordering.

**UI decisions:**

- The "Order" button is the brightest element on the screen and stays fixed at the bottom.
- Dish cards use the same image ratio, price style and spacing.
- Error messages are red with an icon, success states are green.
- Fonts, grid and touch target sizes work on small phones.

Notice that none of the UX decisions mention colors, and none of the UI decisions change the order of steps.

## Where they overlap

In a real product the line is blurry, and that is normal. A few typical overlap zones:

- **Forms.** How many fields to ask for is UX; how they are grouped, labeled and validated visually is UI. A badly styled form can ruin a well-thought flow.
- **Navigation.** The structure of sections is UX (information architecture); the tab bar, menu style and active states are UI.
- **Feedback.** Deciding that the user must see a confirmation after payment is UX; how that confirmation looks and animates is UI.
- **Microcopy.** Button labels and error texts belong to both: they guide the flow and shape the visual block.

Good UI can hide small UX flaws for a while, but it cannot fix a flow that asks for the wrong things in the wrong order.

## Who does what

| Task | UX | UI |
|---|---|---|
| User interviews, surveys, analytics review | yes | |
| User flows and information architecture | yes | |
| Wireframes (low-fidelity screens) | yes | |
| Usability testing | yes | supports |
| Visual style, color, typography | | yes |
| High-fidelity mockups and all screen states | | yes |
| UI kit and design system components | | yes |
| Interactive prototype | yes | yes |
| Handoff to developers | supports | yes |

In small teams one **product designer** usually does both. Larger companies split roles: UX researchers, UX designers, UI designers, sometimes separate motion and content designers.

## Common mistakes

- **Starting with visuals.** Picking colors before the user flow is clear leads to redrawing screens later.
- **Treating UX as "making it pretty".** UX is measured by whether tasks get done, not by how the screen looks.
- **Ignoring states.** UI is not just the happy path: empty, loading, error and disabled states are part of the job.
- **No testing.** Both UX and UI assumptions should be checked on real users, even with five quick sessions.

## How to tell which one you need

- Users **cannot complete a task** or drop off at a certain step: start with UX.
- Users complete tasks but the product **looks inconsistent or outdated**: start with UI.
- You are building **from scratch**: you need both, UX first, then UI on top of validated flows.

## FAQ

### Can one person do both UI and UX?

Yes, and in startups and small studios this is the usual setup. The title is often "product designer" or "UI/UX designer". What matters is that both kinds of work actually get done, not how roles are named.

### Is UX only about research?

No. Research is the input, but UX also includes flows, structure, wireframes, prototypes and testing. A UX designer turns findings into decisions about how the product works.

### Which comes first in a project?

UX usually comes first: you define tasks, flows and screen structure, then UI gives those screens a visual form. In practice they iterate together, because visual decisions sometimes reveal flow problems.
