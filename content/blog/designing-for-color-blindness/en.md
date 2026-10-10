---
title: Designing for Color Blindness: Practical Techniques
description: Types of color vision deficiency, simulation tools and techniques with icons, patterns and labels that keep charts and interface states readable for everyone.
summary: Never carry meaning with color alone: back it up with an icon, text, shape or pattern and make sure colors differ in lightness. Check designs with protanopia, deuteranopia and tritanopia simulators and in grayscale.
---

## The short answer

The core rule is that **color must not be the only carrier of meaning**. WCAG states it directly in success criterion 1.4.1 Use of Color. If "error" and "success" differ only by red and green, some users will not tell them apart. Add a second channel, such as an icon, text, shape, pattern or position, and the interface works for everyone.

## Types of color vision deficiency

| Type | What happens | What gets confused |
|---|---|---|
| Protanopia / protanomaly | "red" cones are missing or weak | red, green, brown; red looks darker |
| Deuteranopia / deuteranomaly | "green" cones are missing or weak | red and green, olive and orange shades |
| Tritanopia / tritanomaly | "blue" cones are missing or weak | blue and green, yellow and pink |
| Monochromacy | little or no color perception | everything differs only by lightness |

Red-green deficiencies are the most common, and they are noticeably more common in men than in women. That makes the red-green pair the riskiest one in an interface.

## Simulation tools

- **Chrome DevTools**: the Rendering tab, Emulate vision deficiencies, for checking a live page.
- **Figma plugins**: simulate the main deficiency types directly on your frames.
- **OS filters**: color filters in macOS and Windows, including grayscale.
- **The grayscale test**: switch the screen to black and white. If states stop being distinguishable, you rely on hue alone.

Simulation is an approximation, not an exact copy of how a particular person sees. For critical products in health, finance or transport, add testing with real users.

## Techniques for interface states

- **Errors and success**: an icon (cross, check mark) and a message next to the field, not just a red border.
- **Links in body text**: an underline or a different weight, not color alone.
- **Required fields**: an explicit label or a symbol that is explained.
- **Toggles and tabs**: show the active state with shape, weight or position, not just a change of hue.
- **Contrast**: meaningful non-text elements such as input borders and icons need at least 3:1 contrast against the background under WCAG 1.4.11.

## Techniques for charts

Charts are the weakest spot because series are often encoded by color only.

1. **Direct labels** on lines and bars instead of a separate legend.
2. **Different markers and line styles**: circle, square, triangle; solid, dashed, dash-dot.
3. **Patterns and hatching** for areas and bars when there are more than two or three series.
4. **Lightness differences**: adjacent palette colors should differ in lightness, not only in hue.
5. **Proven palettes**: sequential palettes with steadily changing lightness, such as the viridis family, and categorical palettes designed for color blindness, such as Okabe–Ito.
6. **Hover highlighting** and a data table next to the chart as an alternative way to read it.

For "bad, neutral, good" scales, use something like orange to blue instead of red to green.

## Checklist before handoff

- [ ] Every state is clear in grayscale.
- [ ] No red/green pair appears without a second cue.
- [ ] Links differ by more than color.
- [ ] Chart series are labeled or use distinct markers.
- [ ] Designs have been checked against the three main deficiency types.
- [ ] Contrast of text and meaningful elements has been verified.

## FAQ

### Should I stop using red and green?

No. They are familiar signals and you can keep them. Just make sure a second cue such as an icon, text or shape is always present, and that the colors differ clearly in lightness.

### Is one simulator enough?

For a baseline check, yes, as long as you run all main types plus grayscale. Simulators are approximations, so for important flows it pays to test with people who have color vision deficiencies.

### What if our brand colors are hard to tell apart?

Keep them for accents and brand elements, and define a separate accessible palette in your design system for functional states and charts.
