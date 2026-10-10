---
title: Material Design 3 for Android Apps: Core Principles
description: Material Design 3 basics: dynamic color, components, navigation, tonal elevation and adaptive layouts, plus when to follow Material strictly.
summary: Material Design 3 is Google's design system for Android: colors are defined as roles and can adapt to the user's wallpaper, navigation depends on screen width, depth is shown through surface tone, and a brand style sits on top of the system without breaking its behavior.
---

## In short: what Material 3 is

**Material Design 3** (also called Material You) is the current version of Google's design system. It covers color, typography, components, spacing, motion and interface behavior on Android and beyond.

For a team it means three practical things:

- **ready-made components** in Jetpack Compose and the Material Components library, with states and accessibility already handled;
- **a system of color roles** instead of a pile of random hex codes;
- **adaptation rules** for phones, tablets and foldables.

## Dynamic color

Since Android 12 the system can build a palette from the user's wallpaper, and apps can adopt it. That is why Material 3 defines colors as **roles**, not values:

- **primary / onPrimary** — main accents and the content on them;
- **secondary, tertiary** — supporting accents;
- **surface and surface container levels** — backgrounds for screens, cards and panels;
- **error** — errors;
- **container** variants — softer fills for buttons and chips.

When the design relies on roles, the app works correctly with dynamic color, with a brand palette and in dark theme. A brand scheme can be generated from one seed color in Material Theme Builder.

In Compose, choosing the scheme looks like this:

```kotlin
val context = LocalContext.current
val colorScheme = when {
    Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
    darkTheme -> BrandDarkColors
    else -> BrandLightColors
}
MaterialTheme(colorScheme = colorScheme, content = content)
```

If your brand needs recognizable colors, skipping dynamic color entirely is a perfectly normal choice.

## Components

The core set: buttons with several emphasis levels (filled, tonal, outlined, text), a **FAB** for the screen's primary action, the **top app bar**, cards, chips, dialogs, **bottom sheets**, snackbars and text fields.

Use library components instead of drawing your own: they already include pressed and focus states, screen reader support and correct sizing. The minimum touch target in Material is **48×48 dp**.

## Navigation

The navigation pattern depends on screen width and the number of destinations:

| Component | When to use |
|---|---|
| Navigation bar (bottom) | Phones, 3 to 5 top-level destinations |
| Navigation rail (side) | Tablets, unfolded foldables |
| Navigation drawer | Many destinations or wide screens |
| Top app bar | Screen title and its actions |

Then there is the **system Back button and gesture**. Android always has it, and the app must respond correctly. Newer versions add **predictive back**, an animation that previews where the gesture leads; support it.

## Elevation and depth

Material 3 expresses depth mainly through **tonal elevation**: the higher a surface, the more its tone differs from the background. Shadows are used sparingly, for elements that truly float above content, such as a FAB or dialogs. There is a fixed set of standard elevation levels; use them rather than inventing your own.

## Adaptive layouts

Material relies on **window size classes**:

- **compact** — under 600 dp, a regular phone;
- **medium** — 600 to 840 dp, a small tablet or unfolded foldable;
- **expanded** — 840 dp and up, tablets and desktop mode.

For large screens there are canonical layouts: **list-detail** (list and details side by side), **feed** (multi-column card feed) and **supporting pane** (main content plus a secondary panel). Also design **edge-to-edge**, drawing behind the system bars with correct insets.

## Strict Material or a custom style

| Follow Material strictly | Add a brand style |
|---|---|
| Internal and B2B apps | Consumer products with a strong brand |
| You need to ship an MVP fast | You can afford your own design system |
| Utilities that should "just work" | Visual style is part of the product's value |

The compromise that works in most cases: **behavior follows Material, appearance follows the brand**. Navigation, gestures, touch targets and states stay native; colors, fonts, corner shapes and illustrations are yours.

## Common mistakes

- Porting the iOS interface: labels on the Back button, ignoring the system back gesture.
- Hard-coding hex colors in components, which breaks dark theme.
- Shipping small touch targets.
- Never testing on a tablet or foldable.

## FAQ

### Do we have to use dynamic color?

No. It is optional, and many products use only their brand palette. What matters is building the design on color roles, so switching schemes never requires a redesign.

### Does Material 3 apply to a Flutter app?

Yes. Flutter ships Material 3 widgets, so the principles here apply to cross-platform apps too. For the iOS version, adapt navigation and gestures to that platform.

### If we have a strong brand, can we drop Material entirely?

You can, but then you solve yourself what Material already solved: accessibility, states, adaptivity. It is usually cheaper to use Material as the base and theme it for the brand.
