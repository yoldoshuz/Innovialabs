---
title: Mobile Navigation Patterns: Tab Bar, Hamburger and More
description: Bottom tab bar, hamburger menu, top tabs and gestures compared: strengths, weaknesses and simple rules for choosing navigation based on your app's structure.
summary: If an app has 3–5 main sections that people switch between often, use a bottom tab bar; put rarely used items in a menu or a Profile tab, use top tabs to split content inside one section, and treat gestures only as shortcuts.
---

## The short answer

Navigation should match how often people visit each part of the app:

- **3–5 main sections used regularly** — a **bottom tab bar**.
- **Many secondary items** (settings, help, documents) — a **menu**: a drawer, a "More" or "Profile" tab.
- **Several views inside one section** ("All / Unread", "Week / Month") — **top tabs** or a segmented control.
- **Gestures** — only as accelerators on top of visible controls, never as the only way.

Most good apps combine these: a tab bar for the main sections, stack navigation with a back button inside each, and a menu for the rest.

## Bottom tab bar

**Pros:**

- Always visible: the user sees where they are and what else exists.
- One tap to switch sections.
- Sits at the bottom of the screen, within easy reach of the thumb.

**Cons:**

- Fits only 3–5 items.
- Takes vertical space on every screen.

**Rules:**

- Use **icon plus a short label**: icons alone are often ambiguous.
- Clearly highlight the active tab.
- Tabs are **destinations, not actions**. "Log out" or "Share" don't belong there. A central "Create" button is an acceptable exception if creating content is the core of the product.
- Keep each tab's state: if the user goes deep into Catalog, switches to Cart and comes back, they should return to the same place.
- Don't change the set of tabs depending on context.

## Hamburger menu and navigation drawer

**Pros:** holds many items and keeps the screen clean.

**Cons:**

- Items are hidden, so people use them less — out of sight, out of mind.
- Every switch costs an extra tap.
- The icon usually sits in the top corner, which is hard to reach one-handed on a large phone.

**When it fits:** secondary items (settings, support, legal pages), apps where users mostly stay in one area and rarely switch (for example, mail folders), and mobile versions of websites with a large structure.

## Top tabs

**Pros:** quickly switch between related views of the same level; often support swiping between them.

**Cons:** located at the top, so harder to reach; with many items they have to scroll and some get hidden; horizontal swipes can conflict with other gestures on the screen.

**Rules:** use them **inside** a section, not instead of main navigation. Combining a bottom tab bar (sections) with top tabs (views within a section) is a normal setup.

## Gestures

Swipe back, swipe between tabs, pull to refresh, swipe a row to delete — gestures are fast, but **invisible**. Users don't know they exist until someone shows them. They can also conflict with system gestures: both iOS and Android use edge swipes for going back.

The rule is simple: every gesture should **duplicate a visible control**. Swipe to delete is fine if there is also a delete option in the item's menu.

## Comparison

| Pattern | Items | Visibility | Reach on large phones | Best for |
|---|---|---|---|---|
| Bottom tab bar | 3–5 | Always visible | Easy | Main sections |
| Hamburger / drawer | Many | Hidden | Hard (top corner) | Secondary items |
| Top tabs | 2–5, more if scrollable | Visible in section | Harder | Views inside a section |
| Gestures | — | Invisible | Depends | Shortcuts for experienced users |

Other patterns you'll use alongside these: **stack navigation** (drill-down with a back button), **bottom sheets** for short tasks, **search-first** navigation for large catalogs, and a **navigation rail** on tablets and wide screens.

## How to choose for your app

1. **List all destinations** and estimate how often each is used — from analytics, interviews or at least an honest guess.
2. **Pick the 3–5 most frequent** for the tab bar.
3. **Move the rest** into a "Profile" / "More" tab or a drawer.
4. **Split large sections** with top tabs or segmented controls.
5. **Add gestures** only as shortcuts.
6. **Test with a clickable prototype:** give users tasks like "find your order history" and see whether they find it on the first try.

## Common mistakes

- A tab bar and a hamburger menu that duplicate the same items.
- Icons without labels.
- Actions mixed with destinations in the tab bar.
- Deep hierarchies where the user loses track of where they are.
- Important features hidden only behind a gesture.

## FAQ

### Is the hamburger menu always a bad choice?

No. It's a poor choice for the main, frequently used sections because it hides them. For secondary items or apps with a very large structure, a drawer is a reasonable and familiar solution.

### What if the app has more than five main sections?

Revisit the structure first: some sections can often be merged or moved inside others. If that's not possible, keep the four most important in the tab bar and make the fifth a "More" or "Profile" tab with the rest.

### Should the tab bar hide while scrolling?

It can, to give more room to content, but it must reappear as soon as the user scrolls back up. On screens where switching sections is frequent, keeping it always visible is usually simpler and clearer.
