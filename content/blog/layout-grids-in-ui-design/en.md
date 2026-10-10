---
title: Layout Grids in UI Design: Columns, Gutters, Margins
description: How layout grids work in UI design: column, baseline and 8pt grids, common desktop and mobile setups, and why a grid makes layouts easier to build.
summary: A layout grid is an invisible structure of columns, gutters and margins that every element aligns to, and it keeps designs consistent while making the move to code predictable.
---

## The short answer

A **layout grid** is a set of invisible guides a designer uses to place interface elements. It defines where content starts and ends, how wide blocks can be and how much space sits between them.

Without a grid every screen is laid out by eye, and a month later the project has a dozen different spacings. With a grid you make the decisions once, and elements simply snap into place from then on.

## Parts of a column grid

- **Columns**: vertical strips that divide the content width. A block can span one column or several.
- **Gutters**: the gaps between columns. Content doesn't go in them; they provide breathing room.
- **Margins**: the space between the screen edge and the first and last columns.

The container width adds up as columns, plus the gutters between them, plus the margins on both sides. Columns are usually fluid and stretch, while gutters and margins stay fixed.

## Three grids that work together

| Grid | What it controls | Why you need it |
|---|---|---|
| **Column** | Horizontal placement and block width | Alignment to vertical lines, responsiveness |
| **Baseline** | The vertical rhythm of text, the step that lines sit on | Even lines and consistent spacing between paragraphs |
| **8pt** | All sizes and spacing are multiples of 8 (sometimes 4 for small details) | One spacing system with no random numbers |

### Why 8

Eight divides cleanly by 2 and 4, and common screen sizes divide well by 8. Values like 8, 16, 24, 32, 48 and 64 are visually distinct and form a clear scale. For small details such as icons or padding inside buttons, a step of 4 is often allowed.

The real benefit isn't the number itself but **limiting choice**: the designer picks from a short scale instead of any number from 1 to 100, and the developer doesn't have to guess whether a gap was 13 or 15.

## Common setups

These aren't standards, just typical starting points. Material Design's responsive layout grid, for example, also uses 4, 8 and 12 columns for different screen widths.

| Device | Columns | Gutter | Margins |
|---|---|---|---|
| Phone | 4 | 16 | 16–24 |
| Tablet | 8 | 16–24 | 24–32 |
| Desktop | 12 | 24–32 | auto, with content capped at a max width |

Why 12 columns are popular on desktop: 12 divides by 2, 3, 4 and 6, so it's easy to build rows of two, three, four or six cards.

## How a grid helps development

A grid in the design translates directly into CSS. Developers don't need to measure every gap; they only need the column count, gutter and margins for each breakpoint.

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
  max-width: 1280px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .container { grid-template-columns: repeat(8, 1fr); gap: 24px; padding: 0 32px; }
}

@media (min-width: 1200px) {
  .container { grid-template-columns: repeat(12, 1fr); }
}
```

If the design uses an 8pt system, it's convenient to express it as variables or tokens (`--space-1: 8px`, `--space-2: 16px` and so on), so the design and the code speak the same language.

## How to set up a grid in Figma

1. Select a frame and add a **Layout grid** in the right panel.
2. Choose **Columns**, set the column count, **Gutter** and **Margin**, and pick the **Stretch** type.
3. Add a second grid of type **Rows** or **Grid** with a step of 4 or 8 for vertical rhythm.
4. Save the setup as a style so you can apply it to every screen of the same size.

## Common mistakes

- Placing text and images in the gutters.
- Adding a grid for show and not aligning anything to it.
- Using different grids on screens of the same size.
- Breaking the 8pt scale with random values like 13 or 22.
- Forgetting the mobile grid and trying to squeeze the desktop one.

## FAQ

### Do I have to follow the grid strictly?

A grid is a tool, not a law. Sometimes an element intentionally breaks out of it, such as a full-bleed background image. What matters is that exceptions are deliberate and the main content stays aligned.

### How many columns should a landing page use?

On desktop, 12 columns are usually enough for any layout. On mobile, switch to 4 columns, where most blocks span the full width.

### How is an 8pt grid different from a column grid?

A column grid handles horizontal placement and block width. An 8pt grid is a system for all sizes and spacing, including vertical. They complement each other.
