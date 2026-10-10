---
title: Accessibility in Design: Basics Every Designer Should Know
description: WCAG from a designer's side: text contrast, font size, focus states, not relying on color alone, alt text and readable layouts you can build into every mockup.
summary: Accessible design means an interface people can use with low vision, color blindness, without a mouse or with a screen reader. The designer's foundation: enough contrast, readable text, visible focus, meaning beyond color, alt text and a clear structure.
---

## What accessibility is and why it is a designer's job

**Accessibility (a11y)** is the quality of an interface that people with different abilities can use: with low vision, color vision deficiency, motor limitations, a screen reader or only a keyboard. It also covers someone using a phone in bright sunlight or with one hand busy.

The main standard is **WCAG** (Web Content Accessibility Guidelines) from the W3C. It has three levels: A, AA and AAA. **AA** is the usual target for most products. Many requirements are decided in the mockup, and fixing them later in code costs more. The full standard is on the [W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/) site.

## Contrast

The most common problem in mockups: light gray text on white looks elegant but is hard to read.

| What to check | WCAG AA minimum |
|---|---|
| Regular text | **4.5:1** |
| Large text (24px+ regular or 18.66px+ bold) | **3:1** |
| Icons, input borders, UI controls | **3:1** against adjacent color |

In practice:

- Check contrast with a Figma plugin or any online calculator while you work, not at the end.
- Placeholder text is text too, and it often fails.
- Put text over photos on a darkening overlay.
- Check both light and dark themes.

## Text size and readability

- Keep body text on the web from getting small: **16px** is a common, sensible starting point.
- Paragraph line height of about **1.4-1.6** times the font size.
- Limit line length so the eye does not get lost moving to the next line.
- Avoid long passages in ALL CAPS and justified text, which creates "rivers" of white space.
- The layout should survive **text zoom up to 200%**: do not fix the height of text containers.

## Focus states

Keyboard users move through a page with the Tab key. They need to see where they are.

- Design a **focus state** for every interactive element: buttons, links, inputs, checkboxes, cards.
- Make focus obvious: a contrasting outline offset from the element works better than a subtle background change.
- Never ask developers to "remove that blue outline" without providing a replacement.
- Plan the **focus order**: it should match the visual reading order.

## Not by color alone

Color vision deficiencies are common, especially among men, and anyone can confuse colors on a glaring screen or in poor light. So meaning must not depend on color alone.

- **Input error:** not just a red border, but also an icon and text like "Enter your email".
- **Charts:** lines differ by markers, patterns or labels as well as color.
- **Links in text:** underline or another clear cue besides color.
- **Statuses:** "Paid" and "Failed" as text or icons, not only a green and a red dot.

Quick check: switch the mockup to grayscale. Everything important should still make sense.

## Alt text

A screen reader reads **alt text** in place of an image. The designer knows why an image is on screen, so they are best placed to write it.

- Informative image: describe the meaning, not the look. Not "chart" but "Sales grew in the second quarter".
- Decorative image: mark it as decorative in the spec; it needs an empty alt.
- Icon-only button: it needs a text label, such as "Close".

## Clear structure

- An explicit **heading hierarchy**: one main heading, then levels in order.
- Field labels **above the input**, not just a placeholder that disappears on typing.
- **Touch target size**: WCAG 2.2 level AA asks for at least 24×24 CSS pixels, and larger is better on mobile.
- Links and buttons with meaningful text: not "Learn more" but "Learn more about pricing".

## FAQ

### Is accessibility only needed if some users have disabilities?

No. Contrast, large text and clear errors help everyone: older people, people reading on a phone outdoors, people in a hurry. And almost every audience includes people with disabilities, even if you do not notice them.

### Where do I start if the product is already built?

With the most widespread issues: check text contrast, focus visibility and form error messages. That delivers a noticeable improvement for modest effort.

### Will accessible design make the interface boring?

No. The constraints concern contrast and structure, not style. A bold palette and expressive typography fit WCAG fine once you pick shades with enough contrast.
