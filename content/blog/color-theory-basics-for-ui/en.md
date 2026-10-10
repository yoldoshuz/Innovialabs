---
title: Color Theory Basics for UI Designers
description: Color theory applied to interfaces: the color wheel, harmonies, HSL thinking, primary, neutral and semantic colors and the 60-30-10 rule for screens.
summary: In UI, color is a tool for meaning and focus, not decoration: pick one primary brand color, build a wide neutral scale for most of the interface, add semantic colors for statuses and keep accents rare. Thinking in HSL makes it easy to generate consistent shades.
---
## The short answer

Interface color has three jobs: **show the brand**, **guide attention** and **communicate meaning** (success, error, link, disabled). A working UI palette is usually simple:

- **one primary color** for brand and main actions;
- **a scale of neutrals** (grays) for text, backgrounds, borders — most of the screen;
- **semantic colors** for statuses: success, warning, error, info.

Color theory helps you choose these colors so they work together and stay readable.

## The color wheel and harmonies

The **color wheel** arranges hues in a circle. Relationships on the wheel give classic harmonies:

| Harmony | How it is built | Use in UI |
|---|---|---|
| Monochromatic | Shades of one hue | Calm, consistent interfaces; easiest to get right |
| Analogous | Neighboring hues | Soft gradients, illustrations, related categories |
| Complementary | Opposite hues | Strong accent against the main color; use sparingly |
| Split-complementary | One hue plus two neighbors of its opposite | Accent with less tension than pure complementary |
| Triadic | Three hues evenly spaced | Charts and illustrations; too loud for main UI |

In interfaces you rarely use a harmony "as is". Usually the base is **monochromatic** (primary plus neutrals), and one more hue from a harmony becomes a secondary accent.

## Think in HSL, not HEX

HEX codes like `#7C3AED` say nothing to a human. **HSL** describes color the way designers think:

- **Hue** — position on the wheel, 0-360 degrees;
- **Saturation** — from gray to vivid, 0-100%;
- **Lightness** — from black to white, 0-100%.

This makes palettes systematic. To get a lighter background tint, raise lightness; for a hover state, lower it slightly; for a muted variant, lower saturation. The hue stays the same, so the shades feel related.

```css
:root {
  --primary-600: hsl(262 83% 58%);  /* main buttons */
  --primary-700: hsl(262 70% 45%);  /* hover, pressed */
  --primary-100: hsl(262 90% 95%);  /* light backgrounds */
  --gray-900:    hsl(260 30% 13%);  /* main text */
  --gray-500:    hsl(260 8% 50%);   /* secondary text */
}
```

One caveat: HSL lightness does not match perceived brightness. Yellow and blue at the same lightness look very different. Always check results by eye and with a contrast checker. Newer perceptual color models such as OKLCH address this, and modern CSS supports them.

## Building a UI palette step by step

1. **Choose the primary color** from the brand. Make sure white text on it is readable.
2. **Generate a scale** of 9-10 shades from very light to very dark by changing lightness and adjusting saturation.
3. **Build neutrals.** Pure gray often looks dull; a slight tint of the primary hue in grays makes the palette feel unified.
4. **Add semantic colors**: green for success, amber for warning, red for error, blue for information. Each needs a light background shade and a strong text shade.
5. **Check contrast.** WCAG requires at least 4.5:1 for normal text and 3:1 for large text at level AA.
6. **Define a dark theme** separately. Simply inverting colors rarely works: saturated colors need to be softer on dark backgrounds.

## The 60-30-10 rule for interfaces

The rule comes from interior design: 60% dominant color, 30% secondary, 10% accent. On screens it translates like this:

- **60% — neutrals**: backgrounds and large surfaces, usually white, light gray or dark gray in a dark theme.
- **30% — secondary**: text, cards, sidebars, borders, secondary surfaces.
- **10% — accent**: primary buttons, active states, key links and highlights.

Treat the numbers as a guideline for balance, not an exact measurement. The point is that the accent stays rare, so it keeps its power to attract attention.

## Common mistakes

- Using the brand color everywhere, so primary actions stop standing out.
- Relying on color alone for meaning; add icons, text or shape so color-blind users understand statuses.
- Too many hues without a system, each picked "by eye" for one screen.
- Light gray text on white that looks elegant but fails contrast.
- Semantic colors that clash with the brand, for example a red brand color also used for errors without distinction.

## FAQ

### How many colors does an interface need?

Usually one primary color with its shades, a neutral scale and four semantic colors. A secondary accent is optional. Most complexity comes from shades, not from the number of hues.

### What if the brand color has poor contrast?

Keep it for large elements and decoration, and use a darker shade of the same hue for text and buttons with white labels. The brand stays recognizable while the interface remains readable.

### Should colors be defined in HEX, RGB or HSL?

Any format works in CSS. HSL or OKLCH is more convenient for building and adjusting scales, while HEX is common in brand books. Store the final values as design tokens so the whole team uses the same ones.
