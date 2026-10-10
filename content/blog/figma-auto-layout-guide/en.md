---
title: Figma Auto Layout: A Practical Guide
description: Direction, gap, padding, Hug, Fill and Fixed sizing, nesting and wrap in Figma Auto Layout, learned by building a button, a card and a responsive list.
summary: Auto Layout turns a frame into a container that arranges its content by the direction, spacing and sizing rules you set. Once you master Hug, Fill and Fixed plus nesting, you get buttons, cards and lists that adapt to their text and to the screen width on their own.
---

## What Auto Layout is

**Auto Layout** is a Figma frame property that arranges child elements automatically, in a row or a column, with set spacing. Change the text, add an item or resize the frame, and the layout updates itself. It works much like CSS flexbox, which makes these designs easier to hand off to developers.

To add Auto Layout, select elements or a frame and press **Shift + A**.

## Core settings

| Setting | What it does |
|---|---|
| **Direction** | Vertical, horizontal or wrapping (Wrap) |
| **Gap** | Space between items; Auto spreads them across the full width |
| **Padding** | Inner space from the frame edges, uniform or per side |
| **Alignment** | How items line up inside the frame |
| **Resizing** | How the frame and its items behave in width and height |

## Hug, Fill and Fixed

This is where most people stumble.

- **Hug contents** — size follows the content. A button grows wider when its label gets longer.
- **Fill container** — the item takes all available space in its parent Auto Layout. An input stretches to the full width of the form.
- **Fixed** — a set size in pixels, independent of both content and parent.

Rule of thumb: **outer** containers are usually Fixed or Fill, **inner** items are Hug or Fill. For flexibility, set **min width and max width** so a card neither shrinks into something unreadable nor stretches forever.

## Step 1: a button

1. Create a text layer "Send request".
2. Select it and press **Shift + A**. The text is now inside an Auto Layout frame.
3. Direction: **horizontal**; padding, for example, 12 vertical and 24 horizontal.
4. Add a fill, corner radius and an icon to the left of the text. Gap between icon and text: 8.
5. Frame width and height: **Hug**.

Test it: swap in a longer label — the button grows and the padding stays. For a full-width button, set its width to **Fill** inside the parent container and center the content.

## Step 2: a card

1. Gather the pieces: an image, a title, a description and the button from step 1.
2. Select them all and press **Shift + A**; direction **vertical**, gap 16, padding 24.
3. Card width **Fixed** (for example 320), height **Hug**.
4. Give the image, title and description **Fill** width so they span the card. Text layers get Hug height, so a longer description simply makes the card taller.
5. Title and description usually sit closer to each other than to the button. Wrap them in a **nested** Auto Layout with gap 8 — the proximity principle in action.

**Nesting** is the real power of Auto Layout: a complex screen is built from simple containers, each with its own spacing.

## Step 3: a responsive list with wrap

1. Make several cards and wrap them in an Auto Layout.
2. Set Direction to **Wrap**: items move to a new row when they run out of width.
3. Give the container a **Fixed** or **Fill** width so there is something to wrap against.
4. Set the horizontal gap and, separately, the spacing between rows.
5. Give the cards **Fill** width and a **min width** (for example 280). When the container narrows, the cards first shrink to the minimum and then drop to the next row.

Drag the container's edge: wide, and more cards fit in a row; narrow, and you get one per row. That is already a prototype of a responsive grid.

## Common mistakes

- **Fixed-width text inside a Hug button** — the button does not grow. Set text layers in buttons to Hug.
- **Fill on an item whose parent is Hug** — a conflict, and Figma switches the behavior. At least one level needs a defined width.
- **Spacing with spaces or empty rectangles** — use gap and padding instead.
- **An element meant to float on top** (a notification badge on an icon) breaks the layout. Turn on **Absolute position** for it.

## FAQ

### How is Auto Layout different from Constraints?

Constraints pin an element to the edges of a regular frame and define its resize behavior. Auto Layout controls how elements are positioned relative to each other. In practice, the main structure uses Auto Layout, while Constraints are for absolutely positioned items and simple frames.

### Should the whole design use Auto Layout?

Ideally all repeating and changing parts: buttons, cards, lists, forms, navigation. Illustrations and free-form compositions do not need it.

### How does Auto Layout help developers?

Gap, padding and sizing modes map directly to flexbox properties, so in inspect mode developers see clear spacing values rather than the coordinates of every element.
