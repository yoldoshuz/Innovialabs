---
title: Design Handoff to Developers With Figma Dev Mode
description: How to prepare a Figma file for handoff — naming, states, spacing, exports and annotations — and how developers use Dev Mode to inspect a design.
summary: Good handoff starts before Dev Mode: name layers and components, build with auto layout and variables, design every state, mark assets for export and annotate behavior; then developers open ready sections in Dev Mode and read sizes, spacing, tokens and notes directly.
---

## How handoff works with Dev Mode

**Dev Mode** is a separate view in Figma built for developers. Instead of editing tools, it shows an inspect panel with sizes, spacing, typography, colors, code snippets and assets. Designers mark finished parts as **Ready for dev**, developers open them and take everything they need.

But Dev Mode only shows what is in the file. If the layers are called "Frame 2481", spacing is random and states are missing, developers will still have to ask. So most of good handoff is **file preparation**.

Note that access to Dev Mode depends on your Figma plan and seat type.

## Preparing the file: checklist

### 1. Structure

- Separate pages for work in progress, ready screens and archive.
- Group screens of one flow into **sections** — this is what you'll mark as ready.
- Name frames by screen and state: `Checkout / Payment / Error`.

### 2. Naming

- No default names like "Rectangle 12" on meaningful layers.
- Name components and variant properties the way they're named in code:

```text
Button
  variant = primary | secondary | tertiary
  size    = sm | md | lg
  state   = default | hover | focus | disabled | loading
```

When names match, developers map the design to existing components immediately.

### 3. Spacing and layout

- Build with **auto layout**: then padding and gaps are read as exact values, not guessed from pixel distances.
- Use a **spacing scale** (for example, 4, 8, 12, 16, 24, 32) and avoid one-off values like 13 or 27.
- Set resizing rules (fill, hug, fixed) so it's clear how elements stretch.
- Show key **breakpoints** if the layout changes between mobile and desktop.

### 4. Tokens

Use **variables and styles** for colors, typography, radii and spacing. In Dev Mode developers then see token names like `color/text/primary` instead of a raw hex value, and can use the same token in code.

### 5. States

For components: default, hover, focus, pressed, disabled, loading.
For screens: empty, loading, error, success, long text, validation messages, no permissions. Missing states are the most common reason for back-and-forth questions.

### 6. Exports

- Mark icons, logos and images as **exportable** with the right format: SVG for icons and vector graphics, raster formats at needed scales for photos.
- Give exportable layers clear names — they become file names.
- Remove hidden and unused layers from export groups.

### 7. Annotations

Write down what can't be seen in a static frame:

- interactions and transitions;
- animation timing and easing;
- validation rules and limits (max length, allowed formats);
- accessibility: focus order, labels for icon buttons, alt text;
- edge cases: what happens with very long names or zero items.

Dev Mode supports annotations and measurements attached to elements, so notes stay next to what they describe.

## How developers use Dev Mode

1. **Open the file and switch to Dev Mode**, then filter by sections marked Ready for dev.
2. **Select an element** — the inspect panel shows size, padding, gap, typography and colors with token names.
3. **Measure distances** by hovering over neighboring elements while one is selected.
4. **Read code snippets** as a reference. They show values, but the structure of real code should follow your components and conventions — don't copy them blindly.
5. **Download assets** from the export section of the panel.
6. **Read annotations** and the comments thread.
7. **Use compare changes** to see what was edited after a section was marked ready.

## Common mistakes

- Marking a section ready and then quietly editing it.
- Detached component instances that no longer match the library.
- Values outside the spacing scale and hex colors outside the palette.
- Only the happy path designed, with no error or empty states.
- Multiple outdated versions of a screen next to each other without labels.

## FAQ

### Can developers copy the generated code from Dev Mode?

Use it as a reference for values, not as production code. Generated snippets don't know your component structure, naming or framework conventions. Tokens and exact numbers are the useful part.

### Is handoff possible without Dev Mode?

Yes. A well-structured file with auto layout, variables, states and annotations, plus a short written spec, still works. Dev Mode makes inspection faster and keeps notes and statuses in one place.

### Who should mark sections as Ready for dev?

The designer responsible for the screen, after review. Agree as a team that "ready" means stable: any later change should be communicated, and compare changes helps developers check what exactly moved.
