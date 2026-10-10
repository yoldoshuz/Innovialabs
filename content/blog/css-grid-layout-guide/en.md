---
title: CSS Grid Layout Guide: From Basics to Real Page Layouts
description: Tracks, the fr unit, named areas, auto-fit and minmax, the implicit grid, plus a step-by-step responsive page layout and card gallery built with CSS Grid.
summary: CSS Grid lays out elements in rows and columns at once: you define the grid tracks on the container and items drop into cells or named areas, which makes it ideal for page layouts.
---

## What CSS Grid is

**CSS Grid** is a two-dimensional layout system: it controls **rows and columns at the same time**. Flexbox lines items up in one direction; Grid places them into a table of cells you can rearrange without touching the HTML.

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}
```

That's two columns: the first is 200px, the second takes the rest. The container's direct children flow into the cells automatically.

## Key concepts

| Concept | What it is |
|---|---|
| **Track** | A row or column of the grid |
| **Line** | The boundary between tracks, numbered from 1 |
| **Cell** | Where a row and a column intersect |
| **Area** | A rectangle spanning several cells |
| **`gap`** | Space between tracks |

## The fr unit

`fr` is a fraction of the **free space** in the container. `1fr 2fr` splits space 1:2 after fixed sizes and `gap` are subtracted.

```css
grid-template-columns: 240px 1fr 1fr;
```

The first column is fixed; the other two share the rest equally. Use `repeat()` for repeated tracks:

```css
grid-template-columns: repeat(4, 1fr);
```

## Placing items by lines

You can stretch an item across several tracks by naming lines:

```css
.wide {
  grid-column: 1 / 3;  /* line 1 to line 3: two columns */
}
.tall {
  grid-row: span 2;    /* take two rows */
}
```

`-1` means the last line of the explicit grid, so `grid-column: 1 / -1` makes an item full width.

## Named areas

`grid-template-areas` lets you draw the layout right in CSS:

```css
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }
.page > main   { grid-area: main; }
.page > footer { grid-area: footer; }
```

The code reads like a page diagram, and you can rearrange the layout by editing only the area strings.

## auto-fit and minmax: responsive without media queries

```css
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

The browser decides how many columns fit: each is at least 240px and stretches to a share of the free space. One column on a narrow screen, four or more on a wide one.

- **`auto-fit`** collapses empty columns, so items stretch to fill the width.
- **`auto-fill`** keeps empty columns, so items stay at their size.

## The implicit grid

If there are more items than cells in the grid you defined, Grid creates **implicit** rows. Size them with `grid-auto-rows`:

```css
.grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(160px, auto);
}
```

Each new row is at least 160px tall and grows if the content needs more.

## Step by step: a responsive page layout

1. Start with mobile — everything in one column:

```css
.page {
  display: grid;
  gap: 16px;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
}
```

2. On wide screens, rearrange the areas:

```css
@media (min-width: 900px) {
  .page {
    grid-template-columns: 1fr 280px;
    grid-template-areas:
      "header header"
      "main sidebar"
      "footer footer";
  }
}
```

3. Assign `grid-area` to each element as in the example above. The HTML stays the same.

## Step by step: a card gallery

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.gallery img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

The cards reflow to fit the screen width, and `aspect-ratio` keeps the images consistent.

## Common mistakes

- **`1fr` with long content.** The minimum of `1fr` is `auto`, so wide content inflates the column. Use `minmax(0, 1fr)`.
- **Mismatched areas.** Every string in `grid-template-areas` needs the same number of columns, and each area must be a rectangle.
- **Grid for everything.** A simple row of buttons is easier with Flexbox.
- **Visual order vs HTML order.** Rearranging areas doesn't change the reading order for keyboard and screen reader users.

More details are in the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout).

## FAQ

### Grid or Flexbox — which should I use?

Grid when both rows and columns matter: page layouts, galleries, dashboards. Flexbox for one-dimensional tasks: navigation, button rows, alignment inside a card. Often the page skeleton uses Grid and the blocks inside use Flexbox.

### Do I still need media queries with Grid?

For galleries, `repeat(auto-fit, minmax(...))` is often enough. For rearranging a page layout, such as moving a sidebar, media queries are still handy.

### Do browsers support CSS Grid?

Core Grid features are supported by all modern browsers. For newer features, check the compatibility tables on MDN.
