---
title: Over-the-Air Updates: Shipping Fixes Without a Store Release
description: How OTA updates work: Expo Updates, CodePush replacements, Shorebird for Flutter, what App Store and Google Play allow, rollbacks and forced update screens.
summary: OTA updates deliver new JavaScript or Dart code without store review, but they cannot change the native layer. Expo Updates is the main option for React Native and Shorebird for Flutter; you also need version compatibility, staged rollouts, rollback and a forced update screen.
---

## What can be updated over the air

A cross-platform app has two layers:

- the **native shell**: compiled code, SDKs, permissions, the icon, `Info.plist` and `AndroidManifest.xml`;
- the **app code**: the JavaScript bundle in React Native or Dart code in Flutter, plus assets.

An OTA update replaces only the second layer. Fixing a logic bug, a text or a screen layout is fine. Adding a native SDK, a camera permission or upgrading React Native itself is not; that still needs a regular store release.

## What the stores allow

**Apple.** The App Review Guidelines (section 2.5.2) forbid downloading executable code that changes functionality. The Apple Developer Program License Agreement makes an exception for interpreted code such as JavaScript, as long as the update does not change the app's primary purpose, does not create a storefront for other code and does not bypass review. OTA tools rely on that exception.

**Google Play.** The policy forbids downloading executable code (dex, JAR, `.so`) from anywhere other than Google Play, but it does not apply to code running in a virtual machine or interpreter with indirect access to Android APIs.

In practice: **fixes and small improvements, yes; major new features that dodge review, no**. Ship significant changes through the store.

## Comparing the tools

| | Expo Updates (EAS Update) | CodePush alternatives | Shorebird |
|---|---|---|---|
| Platform | React Native (Expo and bare projects with `expo-updates`) | React Native | Flutter |
| What it updates | JS bundle and assets | JS bundle and assets | Dart code |
| Compatibility | `runtimeVersion` | Target binary version | Patch tied to a specific release |
| Hosting | Expo cloud or your own server via the protocol | Self-hosted or third-party service | Shorebird cloud |

**CodePush** was the React Native standard for years, but it ran inside Microsoft App Center, which has been retired. The options now: move to EAS Update, run a compatible self-hosted server, or pick a third-party service. New projects usually go with EAS Update.

**Shorebird** brings code push to Flutter. You ship a release with `shorebird release` and fixes with `shorebird patch`:

```bash
shorebird release android
shorebird patch android
```

With Expo, publishing an update is one command:

```bash
eas update --channel production --message "Fix checkout crash"
```

## Version compatibility is rule number one

The most dangerous mistake is shipping a JS bundle that calls a native module the installed binary does not have. The result is a crash on launch.

Expo solves this with **runtimeVersion**: only builds with a matching runtime version receive the update.

```json
{
  "expo": {
    "runtimeVersion": { "policy": "appVersion" }
  }
}
```

The rule is simple: **if the native layer changed, bump the runtime version and ship a new store release**.

## Rollback strategies

- **Staged rollout.** Send the update to a share of users, watch crashes and errors, then widen it.
- **Fast rollback.** Be able to republish the previous stable update or roll back a patch in the console. Rehearse it before an incident, not during one.
- **Built-in safety net.** OTA libraries can fall back to the bundle embedded in the build if an update fails to launch. Do not disable it.
- **Monitoring.** Tag crash reports with the update ID so you can see exactly which update broke things.
- **Separate channels.** `staging` for testers, `production` for everyone.

## Forced update screens

When a fix needs native changes, OTA cannot help. You have to get users to update through the store.

1. Keep a **minimum supported version** on your server or in remote config.
2. On launch, the app compares it with its own version.
3. If it is lower, show a screen that links to the store. A soft prompt can be dismissed; a hard one cannot.

Android offers the **In-App Updates API** with immediate and flexible modes. iOS has no equivalent, so send users to the App Store page.

Use hard blocking only when you truly must: an incompatible API, a security vulnerability or a legal requirement.

## FAQ

### Can Apple reject my app for using OTA updates?

Using OTA for fixes is common practice. The risk appears when updates change the app's purpose or add major functionality that bypasses review.

### How quickly do users get an OTA update?

Typically the update downloads in the background and applies on the next launch. You can configure it to check on startup and apply immediately, at the cost of a slower launch.

### Can OTA updates replace store releases entirely?

No. Native dependencies, permissions, framework upgrades and store requirements still call for regular releases. OTA is for fast fixes in between.
