---
title: Visual Hierarchy in Design: How to Guide the Eye
description: Visual hierarchy tells users what to look at first. How size, contrast, color, spacing and position build it, with a before and after fix of a cluttered screen.
summary: Visual hierarchy is the order in which the eye reads a screen, and you control it with size, contrast, color, spacing and position. Pick one main element per screen, make it the strongest, and deliberately weaken everything else.
---
## The short answer

**Visual hierarchy** is the arrangement of elements so that people see them in order of importance: first the main message, then supporting details, then everything else. Users scan interfaces rather than read them, so if every element shouts equally, nothing is heard and the key action gets lost.

The core rule: **decide what matters most on the screen, then make it visually strongest and make other things quieter.** Hierarchy is created as much by toning down secondary elements as by highlighting the main one.

## The five tools of hierarchy

**1. Size.** Bigger elements are noticed first. A heading noticeably larger than body text immediately signals structure. Use a limited type scale (for example, 4-6 sizes) instead of many slightly different ones.

**2. Contrast and weight.** Dark text on a light background, bold against regular, solid against outline. Secondary text in a softer gray steps back without disappearing. Keep enough contrast for readability: accessibility guidelines such as WCAG set minimum contrast ratios for text.

**3. Color.** A saturated accent color draws attention, so reserve it for one thing: the primary action or a key status. If links, icons, badges and backgrounds all use the accent, it stops working.

**4. Spacing and grouping.** Elements placed close together are perceived as related (the proximity principle). More space around an element makes it more prominent. Generous spacing between groups and tight spacing inside them makes a screen readable without extra lines and boxes.

**5. Position.** People tend to start at the top and, in left-to-right languages, at the left. Important things belong higher and in natural scanning paths. Common patterns are the **F-pattern** for text-heavy pages and the **Z-pattern** for simple landing screens.

## Before and after: fixing a cluttered screen

Imagine a pricing card for a subscription plan.

**Before:**

```text
PRO PLAN | NEW! | BEST VALUE | -20%
Everything you need for your team
$29/month   billed yearly   VAT included
[Start trial] [Compare plans] [Contact sales] [Learn more]
Feature 1  Feature 2  Feature 3  Feature 4  Feature 5  Feature 6
```

Problems: four labels compete with the plan name, price and conditions are the same size, four buttons look equal, features are a dense line with no grouping. The eye does not know where to land.

**After:**

```text
Pro
$29 / month
billed yearly, VAT included

[      Start free trial      ]
   Compare plans

  - Feature 1
  - Feature 2
  - Feature 3
  + 3 more
```

What changed:

- **Extra labels removed.** Only the plan name stays as the heading.
- **Price became the largest element**; conditions moved to small gray text below it.
- **One primary button** in the accent color; "Compare plans" became a quiet text link; "Contact sales" and "Learn more" moved elsewhere on the page.
- **Features became a short list** with space above it, showing the top three and hiding the rest.
- **Spacing grouped content** into three blocks: name and price, action, details.

The content is almost the same; only the hierarchy changed.

## Checklist for any screen

- Can you name the **single main element** of the screen?
- Is there only **one primary button** per view?
- Are there no more than a few **text sizes** and weights?
- Is the accent color used **sparingly**?
- Are related items **grouped by spacing**, not only by borders?
- Does the screen pass the **squint test**: when you blur your eyes, do the main blocks still stand out?

## Common mistakes

- Making everything bold or large "because it is important".
- Using color as the only way to show importance, which fails for color-blind users and in poor lighting.
- Equal spacing everywhere, so groups blend together.
- Adding boxes, lines and shadows to separate content instead of using space.

## FAQ

### How do I check hierarchy quickly?

Use the squint test or look at a small, blurred screenshot. You can also show the screen to someone for a few seconds and ask what they remember. If they name the wrong element, the hierarchy needs work.

### Can a screen have several focal points?

It can have several levels, but one element should clearly lead. Two or three equally strong elements make users hesitate, especially when they are competing actions.

### Does hierarchy matter for mobile screens?

Even more than on desktop. A small screen shows less at once, so the order of elements and a clear primary action decide whether users understand the screen without scrolling around.
