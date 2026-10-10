---
title: How to Check Color Contrast for WCAG Compliance
description: WCAG contrast ratios for text and UI elements at AA and AAA, the tools and Figma plugins to check them, and practical ways to fix brand colors that fail.
summary: Under WCAG 2, normal text needs at least 4.5:1 contrast (AA) or 7:1 (AAA), large text 3:1 or 4.5:1, and UI components and meaningful graphics 3:1; check every real text and background pair with a contrast tool and darken or resize what fails.
---

## The short answer

**Contrast ratio** compares the relative luminance of two colors on a scale from **1:1** (identical) to **21:1** (black on white). WCAG 2 sets these minimums:

| What | AA | AAA |
|---|---|---|
| Normal text | 4.5:1 | 7:1 |
| Large text | 3:1 | 4.5:1 |
| UI components and graphical objects | 3:1 | not defined separately |

**Large text** means at least 18 pt (about 24 px) regular, or 14 pt (about 18.5 px) bold. Most laws and contracts that reference WCAG require level **AA**.

Ratios are not rounded: **4.49:1 fails** a 4.5:1 requirement.

## What exactly must pass

**Text (success criterion 1.4.3, AA; 1.4.6, AAA):**

- body text, labels, placeholders that carry meaning, links;
- text on buttons, badges, tooltips;
- text over images or gradients, checked at the weakest point.

**Non-text contrast (1.4.11, AA) at 3:1** against adjacent colors:

- input borders, when the border is the only thing showing where the field is;
- checkbox and radio outlines, toggle states;
- **focus indicators**;
- icons that convey meaning without a text label;
- essential parts of charts, such as lines and segments.

**Exceptions:** disabled controls, pure decoration, logos and brand names, and text that is not visible or is part of a picture with significant other content.

## How the ratio is calculated

Each color is converted to **relative luminance** L, then:

`ratio = (L_lighter + 0.05) / (L_darker + 0.05)`

```js
function luminance(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

contrast("#767676", "#ffffff"); // about 4.54, passes AA for normal text
```

You rarely need to compute it by hand, but knowing the formula explains why a "medium" gray can fail.

## Tools to check contrast

**In the browser:**

- **WebAIM Contrast Checker**: enter two colors, get the ratio and pass/fail for each level.
- **Browser DevTools**: the color picker in the styles panel shows the contrast ratio of the selected text.
- **Lighthouse** and **axe DevTools**: automated audits that flag low-contrast text across a page.

**On the desktop:**

- **Colour Contrast Analyser** by TPGi: an eyedropper for any pixel on screen, useful for images and gradients.

**In Figma:**

- Plugins such as **Stark**, **Contrast** and **A11y – Color Contrast Checker** check selected layers or whole frames.
- Workflow: run the check on component states (default, hover, disabled, error) in your library, not only on finished screens.

Automated tools cannot judge text over photos reliably. Check those areas manually with an eyedropper on the lightest pixel behind the text.

## How to fix failing brand colors

Brand colors are often bright and fail as text on white. You do not have to change the brand; change **how** the color is used.

1. **Use a darker step for text and links.** Keep the bright brand color for large areas and decoration, and use a darker shade of the same hue for text.
2. **Flip the text color.** If white text on a bright button fails, dark text on the same background may pass.
3. **Make text large.** A heading at large-text size only needs 3:1 at AA. Do not rely on this for body text.
4. **Add a second cue.** Underline links, add borders or icons, so meaning does not rely on color alone.
5. **Put overlays on images.** A dark gradient behind text on photos keeps contrast predictable.
6. **Create accessible tokens.** Define `text-brand`, `bg-brand`, `border-brand` tokens that are already checked, so designers do not reach for the raw color.

## Common mistakes

- Light gray placeholder text used as the only label.
- Checking only the default state and forgetting hover, focus and error.
- Assuming a pass in light mode means a pass in dark mode.
- Thin font weights at small sizes: they technically pass but read worse.

## FAQ

### Is AA enough, or do I need AAA?

AA is the common target for websites and is what most regulations reference. AAA for all text is hard to reach with brand colors, so apply it where reading matters most, such as long articles.

### Does contrast apply to disabled buttons?

No. WCAG excludes inactive components from contrast requirements, but they should still be recognizable as disabled.

### What about APCA and WCAG 3?

APCA is a newer contrast method proposed for future WCAG versions. It is useful for exploration, but compliance today is measured against WCAG 2 ratios.
