---
title: Mobile App Accessibility: Supporting VoiceOver and TalkBack
description: How to make an app work with screen readers: accessibility labels, focus order, dynamic type, contrast, touch target sizes and testing on real devices.
summary: An app is accessible when every interactive element has a clear label and role, focus moves in a logical order, text scales, contrast is sufficient and touch targets are large. Verify it with VoiceOver and TalkBack turned on, on a real phone.
---

## The short answer

**VoiceOver** (iOS) and **TalkBack** (Android) are the built-in screen readers. They announce the element in focus; users move with swipes and activate elements with a double tap. If a button has no label, the user hears "button" and has no idea what it does.

The minimum set of requirements:
- every interactive element has a **label** and a **role**;
- **focus order** follows the logic of the screen;
- text supports **dynamic type**;
- **contrast** is sufficient;
- **touch targets** meet the platform's recommended size.

This helps far beyond blind users: people with low vision turn on large text, and contrast matters to everyone in bright sunlight.

## Labels and roles

A **label** says what the element is, briefly and without the word "button" — the screen reader adds the role itself.

| Platform | Label | Role / heading |
|---|---|---|
| SwiftUI | `.accessibilityLabel("Delete")` | `.accessibilityAddTraits(.isHeader)` |
| UIKit | `accessibilityLabel` | `accessibilityTraits` |
| Jetpack Compose | `contentDescription` / `semantics` | `Modifier.semantics { heading() }` |
| Android View | `android:contentDescription` | `accessibilityHeading` |
| React Native | `accessibilityLabel` | `accessibilityRole` |

Rules of thumb:
- An icon-only button always needs a label: "Search", not "magnifying glass".
- Hide **decorative** images from the screen reader to avoid noise.
- Convey state explicitly: "Favorite, selected" rather than just changing the heart's color.
- Use a **hint** for non-obvious actions, not for every element.

```swift
Button(action: deleteItem) {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete order")
```

## Focus order and grouping

Screen readers move through elements roughly left to right, top to bottom. Problems start with non-standard layouts: absolute positioning, overlays, cards made of many small elements.

- **Group** related elements. A product card should be read as one focus stop — name, price and availability together — not three separate ones. In SwiftUI use `.accessibilityElement(children: .combine)`, in Compose `Modifier.semantics(mergeDescendants = true)`.
- When a modal opens, focus should move into it, and on close it should return to the element that opened it.
- Mark **headings** — screen reader users jump between them like a table of contents.

## Dynamic type and contrast

- **iOS:** use text styles (`.body`, `.headline`) or scaled fonts so text responds to the system size setting.
- **Android:** set text size in **sp**, not dp.
- Test screens at the largest size: text should wrap rather than truncate, and containers should grow in height.
- **Contrast** for normal text should be at least **4.5:1**, and **3:1** for large text, per WCAG. Color must not be the only carrier of meaning: back up a field error with text.

## Touch target sizes

- **Apple HIG:** at least **44×44 pt**.
- **Material Design:** at least **48×48 dp**.

An icon can look small while its touch area is expanded with padding. Leave space between adjacent targets to prevent mis-taps.

## Testing on real devices

1. Turn on **VoiceOver** (Settings → Accessibility) or **TalkBack** (Settings → Accessibility). Set up a shortcut — for example, triple-clicking the side button on iPhone.
2. Walk through key flows **using swipes only**, without looking at the screen: sign-up, search, checkout.
3. Check that every label makes sense without visual context.
4. Turn on the largest font size and repeat the same screens.
5. Use tools: **Accessibility Inspector** in Xcode and **Accessibility Scanner** on Android. They catch missing labels, small targets and weak contrast, but do not replace manual testing.

## FAQ

### Is accessibility required to publish in the stores?
Stores generally do not reject apps for incomplete accessibility, but some countries and industries have legal requirements. Either way, it widens your audience.

### Where do I start if the app is already built?
With key flows: go through them with VoiceOver and TalkBack and fix unlabeled elements, lost focus and truncated text. That gives the biggest effect for the least time.

### Are automated checks enough?
No. Scanners find technical issues but cannot tell whether a label is clear or the order is logical. You need a manual pass with a screen reader on.
