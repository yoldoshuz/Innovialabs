---
title: Icons in UI Design: Styles, Sizes and Icon Sets
description: How to choose between outline and filled icons, which grid and size scale to use, how to keep icons consistent and which free icon libraries fit real products.
summary: Pick one icon library with one style and stroke weight, use it on a 24 px grid with a fixed scale of 16, 20, 24 and 32 px, and add a text label whenever the meaning is not obvious to everyone.
---

## The short answer

Good UI icons are not about individual pictures — they are about a **consistent system**. Users should recognize an action in a split second and never notice that icons came from different sources.

Three rules solve most problems:

- **One library and one style** across the whole product.
- **One grid and a fixed size scale.**
- **A label next to the icon** when its meaning is not universally clear.

## Outline vs filled

| Style | Works well for | Risks |
|---|---|---|
| **Outline** | Dense interfaces, navigation, toolbars | Thin strokes get lost at small sizes |
| **Filled** | Active states, small sizes, strong accents | Many filled icons together make a screen heavy |
| **Duotone** | Marketing pages, illustrative blocks | Harder to theme and adapt to dark mode |

A common pattern is **outline for the default state, filled for the active one**. Many mobile apps do this in the bottom navigation: the selected tab becomes filled. The key is to switch styles on purpose, not by accident in different places.

## Grid and sizes

Most icon sets are drawn on a **24×24 px grid** with roughly 2 px of padding. Inside that live area sit keyline shapes: a circle, a square, and portrait and landscape rectangles. This makes a round icon and a square icon look equally large.

A practical size scale:

- **16 px** — inline with dense text, badges, small inputs.
- **20 px** — buttons and menu items in compact interfaces.
- **24 px** — the default for navigation and actions.
- **32 px and up** — empty states, large cards.

Details that matter:

- **Stroke weight** must be the same across all icons: usually 1.5 or 2 px at 24 px. When scaling down to 16 px you often need a heavier stroke, or the icon falls apart.
- **The tap target** is bigger than the icon. Apple recommends at least 44×44 pt, Material Design 48×48 dp. A 24 px icon inside that area is normal.
- **Align to the pixel grid** so lines stay crisp on standard-density screens.

## Consistency

Signs that your icons do not belong together:

- different stroke weights and corner radii;
- some shapes closed, others open;
- mixed perspectives: some flat, some isometric;
- the same metaphor used for different actions.

If an icon is missing from your set, draw it by the set's rules: same grid, stroke, radii and line caps. The worst option is borrowing a missing icon from another library "for now".

## Labels and meaning

Only a handful of icons are truly universal: search, close, home, settings, delete. Almost everything else is a guess. So:

- **Label icons in navigation.** A bottom bar with labels is clearer than one without.
- **Do not replace a unique action with an icon**, such as "Export to accounting" — text is more reliable here.
- **Tooltips do not help on mobile**: there is no hover.
- **An icon-only button** needs an accessible name (`aria-label`) so screen readers can announce it.
- **Color is not the only carrier of meaning**: show an error state with shape and text, too.

## Free icon libraries worth considering

| Library | What stands out |
|---|---|
| **Material Symbols** | Huge range, variable axes for weight, fill and optical size |
| **Lucide** | Clean outline style, convenient packages for React and other frameworks |
| **Phosphor** | Several weights of one set: thin, light, regular, bold, fill, duotone |
| **Heroicons** | Compact set with outline and solid, pairs well with Tailwind |
| **Tabler Icons** | Large outline set with a uniform stroke |

Before using any of them, check the **license** of that specific set and its terms for commercial use — they differ and can change.

## Common mistakes

- Mixing two or three libraries in one interface.
- Decorative icons on every list item that explain nothing.
- Arbitrary sizes like 18, 22 and 26 px on the same screen.
- An unlabeled icon for an action users see for the first time.
- Exporting icons as raster images instead of SVG.

## FAQ

### How many icons does a product need?

As many as the interface actually uses. It is usually easier to install an existing library and import only the icons you need than to draw a custom set from scratch. A custom set makes sense when icons become part of the brand.

### What format should icons be handed off in?

SVG: it scales without loss and lets developers change color via `currentColor`. Before handoff, remove unnecessary groups, outline strokes if your pipeline requires it and name files with a single convention.

### Do I need a label if the icon has a tooltip?

For key navigation, yes. A tooltip only appears on hover, does not exist on touch screens, and users first have to guess that hovering will reveal anything.
