---
title: Touch Target Size and Thumb Zone in Mobile Design
description: Recommended touch target sizes from Apple, Google and WCAG, how thumb reach works on large phones and where to place key actions in a mobile interface.
summary: Make tappable areas at least 44×44 pt on iOS and 48×48 dp on Android (WCAG's AA minimum is 24×24 CSS px), keep space between them, and put frequent and primary actions in the lower part of the screen where the thumb reaches easily.
---

## Recommended sizes

| Source | Minimum target | Notes |
|---|---|---|
| **Apple Human Interface Guidelines** | 44×44 pt | Applies to any tappable control |
| **Material Design (Google)** | 48×48 dp | Plus spacing between targets, around 8 dp |
| **WCAG 2.2, criterion 2.5.8 (AA)** | 24×24 CSS px | Or enough spacing around a smaller target; inline links in text are an exception |
| **WCAG 2.2, criterion 2.5.5 (AAA)** | 44×44 CSS px | Enhanced level |

Points, dp and CSS pixels are all logical units, not physical screen pixels, so these values are roughly comparable. A practical rule: **design for 44–48 units and treat 24 as an absolute floor**, not a target.

## Visual size and tappable area are different things

An icon can be 24×24 and still have a 48×48 tappable area. What matters for the finger is the **hit area**, not the drawing. On the web you can extend it with padding or a pseudo-element:

```css
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-button::after {
  content: "";
  position: absolute;
  inset: -12px; /* 24 + 12 + 12 = 48px hit area */
}
```

Make sure extended areas of neighboring elements **don't overlap**, otherwise a tap will hit the wrong control.

## Spacing matters as much as size

Two 44-pt buttons placed edge to edge still cause mis-taps. Leave a gap between targets, especially for:

- icon rows in toolbars;
- links in lists and menus;
- "Cancel" and "Delete" next to each other.

Dense layouts like tables or calendars are where small targets usually appear. If you can't make cells larger, make rows taller or open details on tap instead of placing several tiny controls in one row.

## How the thumb zone works

Most people often hold a phone in one hand and tap with their thumb. The thumb moves in an arc from the base of the hand, so the screen splits into zones:

- **Easy** — the lower and middle part of the screen.
- **Stretch** — the upper middle and the edges.
- **Hard** — the top corners, especially the one opposite the holding hand.

On larger phones the hard zone grows. People also change grips, switch hands and use both thumbs, and some are left-handed. That's why the **center and bottom** of the screen are the safest place, not one specific corner.

## Where to place key actions

- **Primary action of the screen** ("Pay", "Continue") — at the bottom, often as a full-width button.
- **Main navigation** — a bottom tab bar instead of a menu icon in the top corner.
- **Frequent actions** — in the lower half: bottom sheets, a floating action button, bottom toolbars.
- **Information** — at the top: title, status, totals. Reading doesn't require reaching.
- **Rare and dangerous actions** — can stay out of the easy zone. Deleting an account shouldn't be one easy thumb tap away; add confirmation as well.

If an important control has to stay at the top (for example, search in a header), give a second path: pull down to reveal it, or duplicate it closer to the bottom.

## Checklist before handoff

- All tappable elements are at least 44 pt / 48 dp, or their hit area is extended.
- Hit areas of neighbors don't overlap, and there's a gap between them.
- The primary action and navigation are in the lower part of the screen.
- Destructive actions are not right next to frequent ones.
- The layout has been tried on a real large phone, held in one hand, with both the left and the right hand.

In Figma it helps to make a simple 44×44 or 48×48 overlay component and drop it on top of icons to check sizes quickly.

## FAQ

### What minimum should I use for a website?

WCAG 2.2 AA requires at least 24×24 CSS px or enough spacing around smaller targets. For a comfortable mobile experience aim for 44–48 px; the WCAG value is the floor that keeps a site accessible, not a recommendation for comfort.

### Can a button look smaller than 44×44?

Yes. The visual element can be smaller as long as the tappable area around it reaches the recommended size and doesn't overlap neighboring targets.

### Is the thumb zone the same for left-handed users?

It's mirrored. That's why it's safer to place key actions in the lower center rather than pressing everything into one corner, and to test with both hands.
