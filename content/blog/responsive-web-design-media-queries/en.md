---
title: Responsive Web Design: Media Queries, Breakpoints and Mobile First
description: How to build a responsive site: viewport meta, mobile-first CSS, choosing breakpoints, fluid type with clamp(), container queries and real testing.
summary: Responsive design starts with the viewport tag and base styles for mobile, which media queries then extend for larger screens. Set breakpoints where content breaks, scale type with clamp() and adapt components with container queries.
---
## The idea in one paragraph

A responsive site is a single layout that adapts to screen width. It relies on three things: **the viewport tag**, **flexible sizes** (percentages, `fr`, `clamp()`) and **media queries** that change the layout at certain widths. The most reliable order is **mobile first**: styles for narrow screens come first, additions for wider screens come after.

## Step 1. The viewport tag

Without it, a mobile browser renders the page as a desktop page and shrinks it. Your media queries will not behave as expected.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Do not disable zoom with `user-scalable=no`. It hurts people who need to enlarge text.

## Step 2. Mobile first

Base styles target mobile with no media query. Larger screens get extra rules through `min-width`.

```css
.layout {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 240px 1fr;
  }
}
```

Why this works better:

- The mobile version stays **simple**: one column, few overrides.
- Complexity is **added**, not undone, so the CSS is shorter.
- You think about the core content from the start, not decoration.

## Step 3. Choosing breakpoints

Targeting specific phone models is pointless; there are too many devices. The right approach: **put a breakpoint where the content breaks**.

1. Open the page and slowly widen the window from narrow to wide.
2. When lines get too long, cards get cramped or empty space appears, that is where a breakpoint belongs.
3. Keep **few** of them: two to four usually cover a whole project.
4. Store values in one place, such as preprocessor variables or framework config.

Use `em` or `rem` in media queries if you want the layout to respect the user's font size.

## Step 4. Fluid typography with clamp()

Instead of several font sizes at different breakpoints, set smooth scaling with limits:

```css
h1 {
  font-size: clamp(2rem, 1.2rem + 4vw, 4.5rem);
}
```

`clamp(min, preferred, max)` lets the heading grow with the screen but never below the minimum or above the maximum. Adding `rem` to `vw` matters: it keeps the text responsive to browser zoom.

## Step 5. Container queries

Media queries look at the window width, but a component often cares about **the width of its container**. The same card may sit in a narrow sidebar and in a wide main column.

```css
.card-wrap {
  container-type: inline-size;
}

@container (min-width: 420px) {
  .card {
    display: grid;
    grid-template-columns: 160px 1fr;
  }
}
```

A simple rule: **media queries for page layout, container queries for components**.

## Easy things to forget

- **Images**: `max-width: 100%; height: auto;`, plus `srcset` and `sizes` for different screens.
- **Tap targets**: buttons and links must be large enough for a finger.
- **Hover**: touch devices have no hover; guard it with `@media (hover: hover)`.
- **Tables**: wrap them in a horizontally scrollable container.
- **Screen height**: on mobile `100vh` can behave unexpectedly because of browser bars; `dvh` and `svh` units exist for that.

## How to test

1. **DevTools** device mode is handy for quick checks, but it is emulation.
2. **Real devices**: at least one budget Android phone and one iPhone. Only they show real speed, fonts, keyboard and gestures.
3. **In-between widths**, not just popular ones.
4. **Landscape orientation and enlarged system font**.

## FAQ

### How many breakpoints do I need?

As many as the content requires. Most sites need two to four. If the number keeps growing, revisit the layout or switch to flexible grids and container queries.

### Is mobile first mandatory?

No, but it simplifies CSS and forces you to prioritize content. If a project is desktop-centric, desktop first with `max-width` also works; just do not mix both styles in one file.

### Will container queries replace media queries?

No, they complement each other. Media queries are still needed for the overall page structure and for user preferences such as dark mode or reduced motion.
