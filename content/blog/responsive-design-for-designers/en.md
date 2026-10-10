---
title: Responsive Design for Designers: Breakpoints and Layouts
description: What mobile-first means, which breakpoints to start with, how layouts reflow between them and how to hand off responsive designs developers can build.
summary: Design the mobile version first, set 3-4 breakpoints where your content breaks, define the grid and block behavior for each range, and build frames with auto layout in Figma so developers see rules, not just pictures.
---

## The short answer

**Responsive design** is not three separate mockups — it is a set of rules for how the interface changes as screen width changes. Developers implement rules, so your job is to describe them rather than draw every possible width.

The basic approach:

1. Start with the **mobile version**.
2. Define **breakpoints** — widths where the layout changes.
3. Set a **grid** and block behavior for each range.
4. Hand off auto layout components plus short notes.

## Why mobile-first

**Mobile-first** means deciding what matters on the narrowest screen first, then adding space and detail.

- A narrow screen forces **content priorities**: what users see first.
- Adding columns as space grows is easier than cutting things as it shrinks.
- It matches how CSS is usually written: base styles for mobile, then `min-width` media queries.

Mobile-first does not mean desktop is secondary. It is an order of thinking, not an audience priority. For internal tools used on desktops it can make sense to start there — but still check how each screen shrinks.

## Which breakpoints to use

There are no universal breakpoints. Devices come in every width, so base your choices on **where your content breaks**, not on specific phone models. A convenient starting scale:

| Range | Width | Typical grid |
|---|---|---|
| Mobile | up to 640 px | 4 columns, 16-20 px margins |
| Tablet | 640-1024 px | 8 columns, 24-32 px margins |
| Laptop | 1024-1440 px | 12 columns |
| Wide | 1440 px and up | 12 columns, capped content width |

If the team uses Tailwind or another framework, adopting its breakpoint scale is simpler than inventing your own — developers will not need to override it.

For wide screens, set a **maximum container width**. A line of text stretched across a monitor is hard to read.

## How layouts reflow

The main patterns, worth naming directly in your file:

- **Stacking.** Three cards in a row become a single column on mobile.
- **Reordering.** Image on the left on desktop, below the heading on mobile.
- **Hiding and collapsing.** A sidebar becomes a drawer, filters become a separate screen.
- **Horizontal scrolling.** A row of cards or tabs scrolls sideways instead of wrapping.
- **Changing density.** A table becomes a list of cards on mobile.

Plan **typography** separately: a 64 px heading on desktop will not fit on a phone. Define sizes per range, or describe fluid scaling if the team uses `clamp()`.

## How to hand off to developers

The most common problem is mockups at three widths with no explanation of what happens in between. What helps:

- **Auto layout and constraints in Figma.** Resize the frame — if the design breaks, the code will break the same way.
- **Components with variants** for breakpoints, not redrawn copies.
- **Key widths**: the minimum (for example 360 px), each breakpoint and a wide screen.
- **Behavior notes**: "columns stack below 768", "max content width 1200".
- **Spacing tokens** instead of arbitrary values, so spacing scales systematically.
- **Mobile states**: open menu, keyboard over a form, long text.

A good check is showing the design to a developer before you finalize it and asking what is unclear between breakpoints.

## Common mistakes

- Designing only for 375 and 1440 px and forgetting tablets and small laptops.
- Hiding important content on mobile instead of reordering it.
- Making tap targets too small for a finger.
- Fixed block heights that make text overflow after translation or font scaling.
- Ignoring landscape orientation and screens with notches.

## FAQ

### Do I need mockups for every breakpoint or just mobile and desktop?

For key screens, cover all main ranges. For standard pages, mobile and desktop are enough if component behavior in between is described as rules and built with auto layout.

### Is adaptive design the same as responsive design?

Strictly speaking, adaptive design switches between fixed layouts while responsive design stretches fluidly. In practice most products combine both: fluid layouts within a range and structural changes at breakpoints.

### What minimum width should a mobile mockup start at?

Usually 360 or 375 px, then check that nothing breaks at 320 px. The exact number matters less than making sure the narrowest screens never get horizontal scrolling.
