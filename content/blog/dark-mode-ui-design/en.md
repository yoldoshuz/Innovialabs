---
title: How to Design Dark Mode for an App or Website
description: Dark mode done right: dark grey instead of pure black, elevation through lighter surfaces, desaturated accents, contrast checks and light/dark design tokens.
summary: A dark theme is not inverted colors: use dark grey instead of pure black, show depth with lighter surfaces, switch accents to lighter and less saturated tints, check contrast in both themes and build everything on semantic tokens with light and dark values.
---

## The short answer

A good dark theme is designed, not generated. Five rules cover most of the work:

1. **Dark grey background**, not pure black.
2. **Depth through lighter surfaces**, not shadows.
3. **Lighter, less saturated accent colors.**
4. **Contrast checked** in both themes.
5. **Semantic tokens** so components switch themes automatically.

## Avoid pure black and pure white

White text on `#000000` creates very sharp contrast. For some readers letters start to blur or glow, and long reading gets tiring. Pure black also leaves no room for depth: you can't go darker for the background, and shadows disappear.

Start with a **dark grey** base — Material Design, for example, uses `#121212` as its baseline dark surface. For text use **slightly dimmed white** instead of `#FFFFFF`, and a softer grey for secondary text.

Pure black still has a place: some apps offer a separate "true black" option for OLED screens. Just don't make it the default without testing.

## Elevation with lighter surfaces

In a light theme, depth comes from shadows. On a dark background shadows are barely visible, so the logic changes: **the higher the surface, the lighter it is**.

| Level | Example elements | Surface |
|---|---|---|
| 0 | Page background | Darkest |
| 1 | Cards, list items | Slightly lighter |
| 2 | Headers, sticky bars | Lighter still |
| 3 | Menus, dialogs, popovers | Lightest |

Keep the steps small and consistent. Thin borders in a subtle light tone also help separate surfaces where lightness alone isn't enough.

## Desaturated accents

Bright, saturated colors that look fine on white tend to "vibrate" on a dark background and often fail contrast. Use **lighter and less saturated tints** of the same hue: if a palette has shades from 50 to 900, a dark theme typically uses lighter steps than the light theme does.

The same applies to status colors: error red, success green and warning yellow all need dark-theme versions. Check that the brand still reads as the brand — the hue stays, only lightness and saturation shift.

## Check contrast in both themes

WCAG thresholds are the same for both themes:

- **4.5:1** for normal text;
- **3:1** for large text;
- **3:1** for UI component boundaries, icons and meaningful graphics.

Commonly missed in dark mode: secondary and placeholder text, input borders, focus rings, dividers, chart colors and disabled states. Also review **images**: logos with dark elements on a transparent background disappear, so prepare light variants.

## Set up light and dark tokens

Build two layers:

- **Primitive tokens** — the raw palette: `violet-300`, `grey-900`.
- **Semantic tokens** — roles: `bg`, `surface`, `text`, `text-muted`, `border`, `accent`. Each has a value for light and for dark.

Components use **only semantic tokens**. Then switching themes means swapping values, not redrawing screens. In Figma this maps to Variables with Light and Dark modes; in code — to CSS custom properties:

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --surface: #f4f3f7;
  --text: #1a1033;
  --text-muted: #5c5670;
  --accent: #7c3aed;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --surface: #1e1e22;
    --text: #ececf1;
    --text-muted: #a3a1ad;
    --accent: #a78bfa;
  }
}
```

`color-scheme` tells the browser to adapt native controls and scrollbars too. For a manual switch, add the same overrides under an attribute such as `[data-theme="dark"]`.

## Switching behavior

- Default to the **system setting**.
- Offer a **manual override** (Light / Dark / System) and remember the choice.
- On the web, apply the theme **before the first render** so the page doesn't flash the wrong colors on load.

## Common mistakes

- Automatically inverting colors instead of designing the theme.
- Pure black backgrounds with pure white text.
- The same saturated brand colors as in the light theme.
- Relying on shadows for depth.
- Hardcoded hex values inside components that ignore the theme.
- Forgotten logos, illustrations and charts.

## FAQ

### Does every product need a dark mode?

No, but many users expect it, especially in apps used in the evening or for long sessions. If you're not ready to support it well, it's better to ship one polished theme than a dark mode with unreadable corners.

### Does dark mode save battery?

On OLED screens darker pixels use less power, so a dark interface can help. On LCD screens the backlight is always on, so the difference is small. Treat it as a bonus, not the main reason.

### Should I design the light or the dark theme first?

Start with the theme most of your users will see, but define semantic tokens from day one. Then the second theme is a matter of choosing values and checking contrast, not reworking every screen.
