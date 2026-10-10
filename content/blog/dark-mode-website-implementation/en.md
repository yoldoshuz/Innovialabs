---
title: How to Add Dark Mode to a Website the Right Way
description: Dark mode done properly: CSS variables, prefers-color-scheme, a toggle that remembers the choice and no flash of the wrong theme on page load.
summary: Define colors as CSS variables, follow the system theme via prefers-color-scheme by default, store the user's choice in localStorage and apply it with a tiny script in the head before the page paints.
---

## The short answer

A solid dark mode rests on three things:

- **CSS custom properties** for every color, so a theme switches variable values instead of hundreds of rules.
- **prefers-color-scheme**, so the site follows the operating system by default.
- **A manual toggle** that remembers the choice, plus a script in `<head>` that applies the theme before the first paint. Otherwise users see a flash of the light theme.

## Step 1. Colors as tokens

Do not hardcode `color: #1a1033` inside components. Create semantic variables: background, text, muted text, border, accent.

```css
:root {
  --bg: #ffffff;
  --text: #1a1033;
  --muted: #5f5873;
  --border: #e4e0ee;
  --accent: #7c3aed;
  color-scheme: light;
}

:root[data-theme="dark"] {
  --bg: #120b24;
  --text: #ede9fe;
  --muted: #a39cb8;
  --border: #2c2343;
  --accent: #a78bfa;
  color-scheme: dark;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

The **color-scheme** property tells the browser to restyle built-in UI: scrollbars, inputs, checkboxes. Without it you get light native controls on a dark background.

## Step 2. System theme by default

If the user has not chosen anything yet, respect the system setting. A convenient pattern: the `data-theme` attribute is set only on a manual choice, and without it the media query decides.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #120b24;
    --text: #ede9fe;
    /* the rest of the dark variables */
    color-scheme: dark;
  }
}
```

This gives three states: **system**, **light** and **dark**. That is fairer than a two-position switch that permanently stops following the system.

## Step 3. A toggle that remembers

```js
function setTheme(theme) {
  // theme: "light" | "dark" | "system"
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
}
```

Wrap `localStorage` access in `try/catch`: in private mode or with blocked site data it can throw.

## Step 4. Kill the flash on load

If the theme is applied after the main JavaScript loads, the page first renders light and then abruptly turns dark. The fix is a tiny **blocking script** in `<head>`, before styles and content:

```html
<script>
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
</script>
```

It runs before the first paint, so there is no flash. In React and Next.js, remember the server does not know the user's choice: the attribute on `<html>` changes before hydration and the framework may warn about a mismatch. The usual fix is `suppressHydrationWarning` on `<html>` or a ready-made theming library.

## Common mistakes

- **Inverting colors** with `filter: invert()`. Photos, logos and brand colors break.
- **Pure black background with pure white text.** Too much contrast tires the eyes; a deep dark tone and slightly softened light text read better.
- **Forgetting shadows.** Shadows barely show on dark backgrounds, so convey depth with lighter surfaces instead.
- **Skipping contrast checks.** Muted text and accent buttons often fail WCAG requirements in dark mode.
- **Forgetting images and charts.** Illustrations with white backgrounds need a separate version or a backdrop; charts need their own colors.

## Pre-release checklist

- Every color in components goes through variables.
- `color-scheme` is set for both themes.
- Without a manual choice the site follows the system.
- The choice is saved and applied without a flash.
- Contrast is checked for text, links, buttons and focus states.
- Logo, icons and images are legible on both backgrounds.

## FAQ

### Is dark mode mandatory?

No. It is a usability improvement, not a requirement. But if you ship it, it must be complete: a half-done dark mode with unreadable blocks is worse than none.

### Where should the choice live: localStorage or a cookie?

For a static site, localStorage plus a head script is enough. A cookie helps when the server renders HTML and wants to send the right theme immediately, without a client script.

### Do I need separate brand colors for dark mode?

Often yes. A saturated accent that works on white can look too dark or too loud on a dark background. Teams usually switch to a lighter shade of the same color from the brand palette.
