---
title: How to Build a Color Palette for a Brand or Product
description: Build a working color palette step by step: choose a primary color, generate tints and shades, add neutrals and semantic colors, then test on real UI.
summary: Pick one primary color with a clear meaning, expand it into a scale of tints and shades, add a tinted neutral scale and semantic colors for status, name them as tokens and test everything on real screens and contrast checks.
---

## The short answer

A usable palette is not five pretty swatches. It is a **system** with four layers:

1. **Primary** color: the brand's main recognizable hue.
2. **Scale** of tints and shades for that color, from very light to very dark.
3. **Neutrals**: grays for text, backgrounds, borders.
4. **Semantic** colors: success, warning, error, info.

Add a **secondary or accent** color only if the product really needs it.

## Step 1. Choose the primary color

Start from meaning and context, not from a favorite color.

- **Associations**: blue often reads as calm and reliable, green as growth or money, red as energy or danger. Associations vary by culture and industry, so check them for your audience.
- **Competitors**: put your competitors' logos side by side. A color that nobody in your niche uses is easier to own.
- **Practicality**: the color must work as a button background with white or dark text, and on both light and dark surfaces.

Pick a single base value and write it down, for example in HEX and OKLCH.

## Step 2. Generate tints and shades

You need a scale, usually **10–12 steps** (often named 50, 100, 200 … 900). Lighter steps are for backgrounds and hover states, the middle for buttons and links, darker for text on light backgrounds and pressed states.

How to generate it well:

- Work in a **perceptual color space** such as **OKLCH**. Steps then look evenly spaced to the eye, unlike simple HSL lightness changes.
- Keep the **hue** roughly constant, but let **chroma** drop at the very light and very dark ends, otherwise colors look neon or muddy.
- Slight hue shifts help: many palettes shift darker steps slightly cooler and lighter steps slightly warmer.
- Tools: Adobe Leonardo, Radix Colors, Coolors, or the color scale generator plugins in Figma.

```css
:root {
  --brand-50:  oklch(97% 0.02 270);
  --brand-100: oklch(93% 0.04 270);
  --brand-300: oklch(78% 0.11 270);
  --brand-500: oklch(58% 0.20 270);
  --brand-700: oklch(45% 0.18 270);
  --brand-900: oklch(28% 0.10 270);
}
```

## Step 3. Add neutrals

Neutrals do most of the work in an interface: text, backgrounds, dividers, disabled states.

- Build a gray scale with the same number of steps as the brand scale.
- Tint grays slightly toward the primary hue (very low chroma). Pure gray next to a saturated brand color can look dead.
- Make sure there is a dark enough step for **body text** and a light enough one for **page backgrounds**.

## Step 4. Define semantic colors

Users expect certain meanings:

| Role | Typical hue | Used for |
|---|---|---|
| Success | green | confirmations, completed states |
| Warning | amber / orange | risky actions, attention needed |
| Error | red | validation errors, destructive actions |
| Info | blue | neutral notices, tips |

Each semantic color needs at least a **background**, a **border** and a **text** step. If your brand color is red or green, adjust the semantic shades so an error never looks like a regular button.

## Step 5. Turn colors into tokens

Separate **raw values** from **roles**:

- primitive tokens: `brand-500`, `gray-100`;
- semantic tokens: `color-bg`, `color-text`, `color-primary`, `color-danger-bg`.

Components use only semantic tokens. Then a dark theme or a rebrand changes the mapping, not every component.

## Step 6. Test on real UI

Swatches lie; screens do not. Build a test page with:

- primary, secondary and ghost buttons in all states (default, hover, pressed, disabled);
- form fields with error and success messages;
- cards, tables, navigation, alerts;
- a chart with several series;
- the same page in **dark mode**.

Check **text contrast** against WCAG for every text and background pair you actually use. Look at the page on a phone in daylight and on a cheap monitor. Ask: is the primary action still the most visible thing?

A common distribution guideline is **60-30-10**: mostly neutrals, some secondary surfaces, and a small amount of brand accent. Use it as a starting point, not a rule.

## Common mistakes

- Using the pure brand color for everything, including large backgrounds.
- Too many accent colors competing for attention.
- Lightening by adding opacity, which changes the color on different backgrounds.
- Forgetting dark mode until the end.
- Checking contrast only for the logo, not for real text.

## FAQ

### How many colors should a brand palette have?

Usually one primary with its scale, one neutral scale and four semantic colors. Add one accent only when there is a clear job for it.

### Should the logo color be the button color?

Often yes, but not always. If the logo color fails contrast as a button, use a darker step of the same hue for interactive elements.

### Why OKLCH instead of HEX or HSL?

HEX is fine for storing values, but OKLCH changes lightness in a way that matches human perception, so generated scales look more even.
