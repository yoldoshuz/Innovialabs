---
title: CSS Flexbox Guide: Properties and Layout Examples
description: Every flex container and flex item property with examples, plus ready solutions for common layouts: navbar, centering, a row of cards and a sticky footer.
summary: Flexbox lays elements out along one axis: a container with display: flex controls direction, alignment and gaps, while items control how they grow and shrink.
---

## What Flexbox is and when to use it

**Flexbox** is a CSS layout mode that arranges elements in **one line**: a row or a column. It's a good fit for navigation, rows of buttons, centering and equal-height cards.

You turn it on with one property on the parent:

```css
.container {
  display: flex;
}
```

The parent becomes a **flex container**, and its direct children become **flex items**. Flexbox has two axes: the **main axis** (where items flow) and the **cross axis** (perpendicular to it).

## Container properties

| Property | What it does | Common values |
|---|---|---|
| `flex-direction` | Direction of the main axis | `row`, `column`, `row-reverse`, `column-reverse` |
| `flex-wrap` | Wrapping onto new lines | `nowrap`, `wrap` |
| `flex-flow` | Shorthand for direction + wrap | `row wrap` |
| `justify-content` | Alignment on the main axis | `flex-start`, `center`, `space-between`, `space-around`, `space-evenly` |
| `align-items` | Alignment on the cross axis | `stretch`, `center`, `flex-start`, `flex-end`, `baseline` |
| `align-content` | Distribution of wrapped lines | `flex-start`, `center`, `space-between` |
| `gap` | Space between items | `16px`, `1rem 2rem` |

Note: with `flex-direction: column` the axes swap, so `justify-content` starts working vertically.

## Item properties

| Property | What it does |
|---|---|
| `flex-grow` | Share of free space the item takes (default 0) |
| `flex-shrink` | How much it shrinks when space runs out (default 1) |
| `flex-basis` | Starting size before space is distributed |
| `flex` | Shorthand: grow, shrink, basis |
| `align-self` | Its own alignment on the cross axis |
| `order` | Display order |

The most useful shorthands:

- `flex: 1` — the item grows and shares space equally with siblings;
- `flex: none` — it neither grows nor shrinks;
- `flex: 0 0 200px` — a fixed 200px width.

## Common layouts

### Navbar: logo left, menu right

```html
<header class="nav">
  <a href="/" class="logo">Logo</a>
  <nav class="menu">
    <a href="/about">About</a>
    <a href="/contacts">Contacts</a>
  </nav>
</header>
```

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}
.menu {
  display: flex;
  gap: 24px;
}
```

### Centering a block

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

The block sits exactly in the middle on both axes.

### A row of cards

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 260px;
}
```

Each card aims for 260px, grows to fill the row and wraps when space runs out. Cards in the same row get equal height thanks to the default `align-items: stretch`.

### Sticky footer

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}
main {
  flex: 1;
}
```

`main` takes all the free space, so the footer stays at the bottom even on a short page.

## Common mistakes

- **Properties on the wrong element.** `justify-content` goes on the container, `flex: 1` goes on the item.
- **Long text breaks the layout.** Flex items default to `min-width: auto`, so a long word or a table stops the item from shrinking. `min-width: 0` fixes it.
- **Margins instead of `gap`.** `gap` doesn't add stray space at the outer edges.
- **Flexbox for a 2D grid.** If you need alignment by rows and columns at once, CSS Grid is easier.
- **Using `order` to change meaning.** It changes only the visual order; keyboard and screen reader users follow the HTML order.

The full property reference is on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout).

## FAQ

### How is Flexbox different from Grid?

Flexbox works in one dimension: a row or a column. Grid works in two at once. Navigation and button rows usually use Flexbox; page layouts and galleries use Grid. They're often combined.

### Why doesn't justify-content work?

Check that the property is on a container with `display: flex` and that there's free space left. If an item with `flex: 1` already takes all the room, there's nothing to distribute.

### How do I make equal-width columns?

Give each item `flex: 1`. If the content varies in length, add `min-width: 0` so long text doesn't stretch a column.
