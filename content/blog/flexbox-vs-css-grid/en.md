---
title: Flexbox vs CSS Grid: When to Use Which
description: How Flexbox differs from CSS Grid, how to choose between one- and two-dimensional layout, and when combining both gives the cleanest code.
summary: Flexbox lays items out along one axis, a row or a column, while Grid controls rows and columns at the same time. Use Flexbox for components, Grid for page structure and grids, and combine them freely.
---
## The short answer

**Flexbox** is one-dimensional layout: items line up along a single axis, either a row or a column. Their size comes from their content, and the container distributes the free space.

**CSS Grid** is two-dimensional layout: you define rows and columns, and items are placed into the cells of that grid. Structure comes first, content goes into it.

A practical rule: **if alignment along one line matters, use Flexbox; if items must line up both horizontally and vertically, use Grid**.

## The key difference: content-first vs layout-first

- In Flexbox, an item's size grows out of its content. Three buttons with different labels get different widths, and that is fine.
- In Grid, the container decides sizes. Product cards in a catalog get equal widths even when their text differs.

So before writing CSS, ask one question: **what leads here, the content or the grid?**

## Comparison

| Criterion | Flexbox | CSS Grid |
|---|---|---|
| Direction | one axis | two axes |
| Logic | content-driven | grid-driven |
| Wrapping | `flex-wrap`, each row independent | columns align across all rows |
| Overlapping items | awkward | place items in the same cells |
| Typical tasks | menus, buttons, toolbars, centering | page shells, galleries, catalogs, forms |

## When to choose Flexbox

- **Navigation and toolbars**: logo on the left, menu on the right.
- **Button groups, tags, icon plus label**.
- **Centering** a single element.
- **A row where one item stretches** while the others take only what they need.

```css
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.toolbar .search {
  flex: 1; /* takes all remaining space */
}
```

## When to choose CSS Grid

- **Page shell**: header, sidebar, content, footer.
- **Catalogs and galleries** where cards must sit in even rows.
- **Forms** with aligned labels and fields.
- **Overlapping** text and an image without `position: absolute`.

A responsive card grid without media queries:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
```

## The best option: both together

The cleanest layouts usually use both tools at different levels:

1. **Grid builds the skeleton**: the page, sections, the card grid.
2. **Flexbox arranges content inside** a cell: title, price and button inside a card.

```css
.card {
  display: flex;
  flex-direction: column;
}
.card .button {
  margin-top: auto; /* button sticks to the bottom in every card */
}
```

Another useful technique is **subgrid**: a nested grid inherits the parent's tracks, so titles in neighboring cards align to the same height. Modern browsers support it, but check support for your audience.

## Common mistakes

- **Building a grid with Flexbox** using `calc()` widths and negative margins, when Grid does it in one line.
- **Using Grid for a simple row of buttons**, which adds needless complexity.
- **Spacing with margins** instead of `gap`, which works in both tools.
- **Changing visual order** with `order` or Grid placement without changing the HTML. This breaks the order for keyboard and screen reader users.

## Deciding in a minute

1. Items in one line, sized by their content? Use **Flexbox**.
2. Need even rows and columns at once? Use **Grid**.
3. Have an outer structure and inner content? **Grid outside, Flexbox inside**.

## FAQ

### Has Grid replaced Flexbox?

No. They solve different problems and both are mature standards. Grid does not make Flexbox obsolete, and most projects use both.

### Which one is faster?

For typical interfaces the difference is negligible. Choose based on the shape of the layout, not speed: DOM size and heavy animations matter far more for performance.

### Can I build a responsive layout with Grid alone?

Yes, `auto-fill`, `minmax()` and named areas cover a lot without media queries. But for small components inside cells, Flexbox usually stays simpler and shorter.
