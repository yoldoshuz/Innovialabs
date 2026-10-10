---
title: Android Fragmentation: Choosing Min OS Version and Test Devices
description: How to choose minSdk from your audience data, what supporting old Android versions really costs, and how to build a realistic device test matrix.
summary: Pick the minimum Android version from your own audience data by weighing lost users against the cost of supporting old versions, then test on a small matrix: oldest and newest versions, popular models, a low-end device and different vendor skins.
---

## The short answer

Android fragmentation means thousands of models, several active OS versions and dozens of vendor skins. Testing everything is impossible, so two decisions do the work:

1. **Choose minSdk from data**, not "so it runs everywhere": see how many users you lose by dropping an old version and compare that with the cost of supporting it.
2. **Test on a matrix** that covers the key differences: versions, vendors, hardware power and screen sizes.

## Three SDK settings people mix up

```kotlin
android {
    compileSdk = 36        // the SDK the project compiles against
    defaultConfig {
        minSdk = 26        // the oldest supported Android version
        targetSdk = 36     // the version whose behavior the app is adapted to
    }
}
```

The values are just an example. The difference matters:

- **minSdk** decides which devices can install the app at all. It is a business and audience decision.
- **targetSdk** must be raised to a recent level regularly for Google Play, or you cannot ship updates. It is an obligation, not a choice.
- **compileSdk** usually matches the latest stable version.

## Where to get the data

- **Android Studio** shows the API version distribution when you create a project — the global picture.
- **Play Console** shows the Android versions and device models of your actual users for a published app.
- **Your analytics** — models and OS versions from mobile analytics, or from your website if there is no app yet.
- **Regional statistics** — a rough market guide.

In regions with many budget devices, older versions may be more common than global statistics suggest. Rely on data for your region and your audience.

## What supporting old versions costs

| Decision | Pros | Cons |
|---|---|---|
| Low minSdk | more potential users | more code branches, workarounds and tests; outdated WebView and system components |
| High minSdk | modern APIs, fewer tests and bugs | part of the audience cannot install the app |

There is an external factor too: Jetpack libraries, Firebase and Google Play services periodically raise their own minimum level. Holding on to a very old version may become impossible even if you are willing to support it.

A practical rule: if dropping a version loses a small share of your users but saves a noticeable amount of work, raise minSdk.

## Screens and vendor skins

**Screens.** Compact and large phones, tablets, foldables, camera cutouts, gesture and button navigation. Test the **large system font** separately: it breaks more interfaces than anything else. For adaptive layouts, use window size classes instead of targeting specific resolutions.

**Skins.** Samsung One UI, Xiaomi HyperOS and MIUI, ColorOS on OPPO and realme, and the skins from vivo, Huawei and Honor all behave differently. Typical problems:

- aggressive battery saving kills background tasks and delays push notifications;
- extra permissions for autostart and background work;
- custom permission dialogs and notification settings;
- differences in camera, file and WebView behavior.

Build background work on WorkManager, and at the right moment explain to users how to turn off battery optimization for the app.

## How to build a realistic device matrix

1. List the **most popular models** among your audience from analytics.
2. Cover the key dimensions: minimum and latest OS versions, main vendors, a low-end device, small and large screens.
3. Split into tiers: **a few physical devices** for core scenarios, **emulators** for OS versions and screens, **cloud device farms** such as Firebase Test Lab for the long tail.
4. Revisit the matrix when your analytics change.

An example set:

| Device | What it checks |
|---|---|
| Budget phone on the minimum version | lower bound for speed and APIs |
| A popular Samsung model among your users | One UI, mass segment |
| A popular Xiaomi or Redmi model | skin, battery saving, push |
| Phone on the latest Android version | new permissions and system behavior |
| Emulator with a small screen and large font | layout |
| Tablet or foldable, if you support them | adaptivity |

## Common mistakes

- **minSdk left at the template value** without checking against the audience.
- **Testing only on a developer's flagship** while users are on budget models.
- **targetSdk not updated in time**, which blocks updates.
- **Large font and dark theme never checked.**

## FAQ

### Which minSdk should I choose if I have no data yet?

Start with the value Android Studio suggests for new projects and adjust it after the first weeks of analytics, or based on your company website's data.

### Do I need to buy lots of devices?

No. A few physical devices covering the main vendors and low-end hardware, plus emulators and a cloud farm for the rest, is enough.

### Does this apply to Flutter and React Native?

Yes. Frameworks and plugins have their own minimum Android level, and your minSdk cannot go below it. Cross-platform tools do not remove skin and screen issues either.
