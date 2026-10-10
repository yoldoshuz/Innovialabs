---
title: How to Create a Wireframe Step by Step
description: A practical wireframing process: define goals, inventory content, sketch low-fidelity layouts, annotate behavior and review, with a homepage example.
summary: Start from the page goal and a list of real content, sketch rough grayscale layouts that order that content by priority, annotate how things behave, and review with the team before any visual design.
---

## The short answer

A **wireframe** is a grayscale skeleton of a screen: what blocks exist, in what order, and how big they are relative to each other. It is not about colors or fonts. To make one, you move through five steps: **goal → content inventory → low-fidelity layout → annotations → review**. Skipping the first two is the most common reason wireframes turn into pretty but useless pictures.

## Step 1. Define the goal of the page

Write one sentence: who comes to this page and what should they do next. For a studio homepage it might be: "A business owner understands what we build and leaves a request."

Then list the **key actions** in priority order:

- primary: submit a request;
- secondary: view cases, open a service page;
- tertiary: read the blog, switch language.

This list decides what gets the most space later.

## Step 2. Make a content inventory

Collect everything that must appear on the page, using **real text** where possible, not lorem ipsum. Real headings show you whether a block needs two lines or six.

| Content item | Source | Priority |
|---|---|---|
| Value proposition, 1–2 lines | marketing | high |
| Services list | services pages | high |
| Selected cases | portfolio | medium |
| Process steps | sales team | medium |
| Contact form | product | high |
| Footer links | legal, social | low |

If a piece of content does not exist yet, mark it as a gap instead of inventing it.

## Step 3. Sketch low-fidelity layouts

Start on paper or a whiteboard: it is fast and nobody gets attached. Draw **two or three different variants** of the page, then move the strongest one into a tool.

Rules for low fidelity:

- grayscale only, one neutral font;
- boxes with a cross for images, lines for body text;
- real headings and button labels;
- a simple grid (12 columns for desktop, 4 for mobile);
- mobile version from the start, not as an afterthought.

**Homepage example**, top to bottom:

1. Header: logo, navigation, language switch, "Contact" button.
2. Hero: big headline, one sentence of explanation, primary button.
3. Services: grid of 4–6 cards, each with a title and one line.
4. Cases: 2–3 large cards with project name and task.
5. Process: 4 steps in a row (a vertical list on mobile).
6. Request form: name, contact, short description.
7. Footer.

## Step 4. Add annotations

A wireframe without notes leaves developers and designers guessing. Add short annotations next to blocks:

- **behavior**: "cards scroll horizontally on mobile", "header becomes sticky after scroll";
- **data**: "cases come from CMS, show the latest 3";
- **states**: empty, loading, error, success for the form;
- **rules**: "headline max 60 characters".

Number the annotations and keep them outside the frame so the layout stays readable.

## Step 5. Review and iterate

Show the wireframe to the people who own the goal and the content: the client, a developer, someone from sales. Ask concrete questions:

- Is the primary action obvious within a few seconds?
- Is anything missing from the content inventory?
- Can this be built with the current tech and budget?

Collect comments, update, and only then move to a clickable prototype or visual design.

## Tools

| Tool | Good for |
|---|---|
| Paper, whiteboard | first variants, workshops |
| Figma, Penpot | shared wireframes, reuse of components, later prototype |
| Balsamiq | deliberately sketchy look, quick for non-designers |
| Miro, FigJam | user flows and wireframes on one board with the team |

In Figma, a small set of gray components (button, input, card, image placeholder) speeds up wireframing a lot.

## Common mistakes

- **Starting with visuals.** Colors and photos distract the review from structure.
- **Lorem ipsum everywhere.** Real copy changes block sizes.
- **Desktop only.** Mobile layouts often need a different order.
- **No annotations.** Interactions get decided by whoever builds first.
- **Too much detail too early.** Pixel-perfect wireframes are slow to change.

## FAQ

### What is the difference between a wireframe, a mockup and a prototype?

A wireframe shows structure in grayscale, a mockup adds the final visual style, and a prototype makes screens clickable so you can test the flow.

### How detailed should a wireframe be?

Detailed enough that everyone agrees on content, order and key behavior. If the team is arguing about colors or icons, you have gone too far.

### Do I need a wireframe for a small landing page?

Yes, even a quick paper sketch helps. It takes little time and prevents rebuilding the page after the design is already polished.
