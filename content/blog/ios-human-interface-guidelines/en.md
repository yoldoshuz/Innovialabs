---
title: Apple Human Interface Guidelines: The Essentials for App Teams
description: A practical summary of Apple HIG: navigation, tab bars, typography, touch targets, safe areas and system gestures that iOS users expect and reviewers notice.
summary: The HIG is Apple's official guide to how an iOS app should look and behave; in practice what matters most is familiar navigation with a tab bar and Back button, Dynamic Type, touch targets of at least 44×44 pt, respecting safe areas and never hijacking system gestures.
---

## In short: what the HIG is and why it matters

The **Human Interface Guidelines (HIG)** are Apple's official design guide for iPhone, iPad and its other platforms. They are principles rather than law, but iOS users are so used to them that any deviation feels like "something is off with this app".

Keep two documents apart:

- The **HIG** describes how the interface should look and work.
- The **App Review Guidelines** are the rules that decide whether an app is accepted into the App Store.

Reviewers do not check every HIG point, but an awkward, broken or non-native interface raises the risk of rejection. The official version lives on [developer.apple.com](https://developer.apple.com/design/human-interface-guidelines).

## Navigation: three basic models

- **Hierarchical** — screens open deeper, with a **navigation bar** at the top showing a title and a Back button. Settings and Mail work this way.
- **Flat** — several equal sections switched with a **tab bar**.
- **Modal** — a separate task on top of the current screen (writing a note, paying) presented as a **sheet** with clear Cancel and Done buttons.

Most apps combine all three: a tab bar for sections, hierarchy within each section, modals for short tasks.

## Tab bar

- Sits at the **bottom of the screen** and leads to the main sections of the app.
- Keep the number of tabs small: on iPhone, extra tabs get pushed into a "More" tab, which is clumsy.
- Tabs are for **navigation, not actions**. A "Create" tab that opens a form breaks expectations.
- Every tab gets an icon and a short label. **SF Symbols**, Apple's system icon library, is the easy choice.
- Do not hide the tab bar without a reason: users should always be able to jump to another section.

## Typography

- The system font is **SF Pro**. A custom brand font is fine if it stays readable at small sizes.
- Support **Dynamic Type**, the system text size setting. Use text styles (Large Title, Headline, Body, Caption) instead of fixed sizes and the interface will scale on its own.
- Test screens at the largest text size: nothing should be clipped or overlap.
- Avoid very thin weights for body text.

## Touch targets

The HIG minimum hit area is **44×44 pt**. An icon can be smaller, but the tappable area cannot. Leave enough space between neighboring controls so people do not mis-tap.

## Safe areas and different screens

Modern iPhones have rounded corners, a notch or the Dynamic Island at the top and the **home indicator** at the bottom. The **safe area** is the region where content is guaranteed not to be covered.

- Backgrounds and images may extend to the edges.
- Text, buttons and input fields stay inside the safe area.
- Test layouts on a small and a large iPhone, and on iPad and in landscape if the app is universal.

SwiftUI respects the safe area by default; ignore it only for the background:

```swift
ZStack {
    Color("Background").ignoresSafeArea()
    ContentView()
}
```

## System gestures

iOS users rely on gestures your app must not break:

- **swipe from the left edge** — go back in the hierarchy;
- **swipe up from the bottom** — go home and switch apps;
- **swipe down from the top corners** — Control Center and notifications.

Do not place custom gestures or interactive controls near screen edges where they collide with system ones. Expected in-app patterns are pull to refresh, swipe actions on list rows and long press for a context menu.

## What often leads to App Store rejection

- Crashes, placeholder content, broken links and empty screens.
- An app that is essentially a wrapped website with no value of its own.
- Asking for camera, location or contacts access without a clear explanation of why.
- Account sign-up without a way to **delete the account** inside the app.
- Third-party social login only, without an equivalent privacy-focused option such as **Sign in with Apple**.

## Common team mistakes

- Porting the Android interface one to one: hamburger menu, floating action button, Material-style back arrow.
- Ignoring dark mode and Dynamic Type.
- Shipping tiny buttons "as in the mockup" without a proper hit area.
- Requesting every permission at first launch.

## FAQ

### Do we have to follow the HIG strictly?

No, your app can have its own visual style. But the basics — navigation, gestures, touch target sizes, safe areas, text size support — are worth respecting: users are used to them and reviewers notice when they are missing.

### Can we use one design for iOS and Android?

A shared brand style, yes: colors, illustrations, fonts, screen logic. But navigation, system controls and gestures are better adapted to each platform, or one of your audiences will feel out of place.

### How is the HIG different from the App Review Guidelines?

The HIG is design and behavior guidance. The App Review Guidelines are publishing rules for the App Store, and breaking them leads to rejection. Read both before design starts, not right before submission.
