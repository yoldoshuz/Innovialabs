---
title: Crash Reporting for Mobile Apps: Crashlytics vs Sentry
description: What crash-free rate means, why dSYM and mapping files matter, how to set up Firebase Crashlytics and Sentry, and how to prioritize crashes by user impact.
summary: Crashlytics is the free, fast option if you already use Firebase; Sentry is stronger for errors, performance and self-hosting but more complex and paid at volume. Either way, crash reports are unreadable without uploaded dSYM and mapping files.
---

## The short answer

**Firebase Crashlytics** is a sensible default for a mobile app: free, quick to set up and well integrated with Firebase Analytics and Remote Config. Teams pick **Sentry** when they need more: one error system for the app and the backend, performance tracing, flexible alert rules or hosting on their own servers.

| Criterion | Crashlytics | Sentry |
|---|---|---|
| Cost | Free | Free tier, then paid by event volume; can be self-hosted |
| Focus | Crashes and non-fatal errors on mobile | Errors, performance and releases across platforms |
| Platforms | iOS, Android, Flutter, Unity, React Native (via a third-party module) | iOS, Android, Flutter, React Native, web, backend |
| Alerts | Basic, including crash spikes | Flexible rules, Slack and webhook integrations |
| Data location | Google cloud only | Cloud or self-hosted |

## Crash-free rate: the core stability metric

**Crash-free users** is the share of users who had no crash in a period. **Crash-free sessions** is the share of sessions without a crash. The first tells you how many people were affected; the second tells you how often the app fails during normal use.

Track both and compare them per version. If a new version is clearly worse than the previous one, pause the staged rollout in App Store Connect or Google Play Console until a fix ships.

## Symbolication: why the stack trace is unreadable

Release builds are optimized and obfuscated, so instead of function names you see memory addresses or names like `a.b.c`. Turning them back into a readable stack trace requires **symbol files**:

- **iOS — dSYM**. Generated at build time when the Release configuration uses `DWARF with dSYM File`. They must be uploaded for every build.
- **Android — mapping.txt**. Produced by R8/ProGuard during minification. Without it, class names stay obfuscated.
- **Native code (NDK, C++)** — separate symbol files.
- **Flutter** — when you build with `--obfuscate --split-debug-info`, the debug info must be uploaded too.
- **React Native** — source maps for the JavaScript bundle.

The most common mistake is uploading symbols for one build and forgetting the next. Automate the upload in CI instead of doing it by hand.

## Setting up Crashlytics

1. Create a Firebase project and register your iOS and Android apps.
2. Add `GoogleService-Info.plist` and `google-services.json` to the project.
3. Add the Crashlytics SDK.
4. On Android, apply the Gradle plugin — it uploads the mapping file for you:

```kotlin
plugins {
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
}
```

5. On iOS, add the dSYM upload script from the Firebase docs to Build Phases.
6. Force a test crash and confirm it appears in the console with a readable stack trace.

Log **non-fatal errors** as well, such as API response parsing failures. Attach custom keys like screen name, user role or config version, but never personal data.

## Setting up Sentry

1. Create a Sentry project and copy its DSN.
2. Install the SDK and initialize it as early as possible at startup. A Flutter example:

```dart
await SentryFlutter.init(
  (options) {
    options.dsn = "https://<key>@<host>/<project>";
    options.tracesSampleRate = 0.2;
  },
  appRunner: () => runApp(const MyApp()),
);
```

3. Configure `sentry-cli` in CI to upload dSYMs, mapping files and source maps.
4. Set **release** and **environment** so you can separate production from test builds and compare versions.

## Alerts and prioritization

Not every crash deserves the same attention. Rank them by impact:

- **Users affected**, not event count. One device can produce hundreds of repeats.
- **Where it happens**: checkout, sign-up or app start is critical; a rarely used settings screen can wait.
- **New or regression**: a problem introduced in the latest version beats an old, stable one.
- **Trend**: a sharp rise after a release needs a same-day response.

Set up at least three alerts: a new issue in the latest version, a spike in crashes, and crash-free rate dropping below your threshold. Route them to the team channel, not an inbox nobody reads.

## FAQ

### Can I use Crashlytics and Sentry at the same time?

Technically yes, but two crash handlers can conflict, and the team ends up watching two dashboards. Most teams pick one tool for crashes.

### Why does Crashlytics show no crashes when users are complaining?

Common reasons: reports are sent on the next app launch, collection is disabled in debug builds, or the system kills the app for memory, which is not always recorded as a crash.

### Do I need user consent to collect crash reports?

It depends on what data you collect and which laws apply. Keep personal data out of reports and disclose diagnostics collection in your privacy policy and the stores' privacy sections.
