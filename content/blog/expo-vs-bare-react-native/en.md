---
title: Expo vs Bare React Native: Which Workflow to Choose
description: Expo vs bare React Native compared: development speed, native modules, EAS Build and Update, config plugins, and when prebuild or ejecting is really needed.
summary: For most new projects, start with Expo: it does not block native code, it plugs it in through development builds and config plugins. Bare React Native makes sense when you actively hand-edit the native projects.
---

## The short answer

The choice used to be "convenient but limited Expo" versus "flexible but laborious React Native". That is no longer accurate. Expo works with any native module through **development builds** and generates the native projects from configuration.

- **Expo** is a good default for a new app: fast start, ready-made modules, cloud builds and over-the-air updates.
- **Bare React Native** fits when the team maintains the `ios/` and `android/` folders itself, heavily customizes native code, or embeds React Native into an existing native app.

The React Native docs themselves recommend starting new projects with a framework, and Expo is the main one.

## Side-by-side comparison

| Criterion | Expo (managed + prebuild) | Bare React Native |
|---|---|---|
| Project start | Minutes, no Xcode or Android Studio setup | Native environment must be configured |
| Native modules | Any, via a development build | Any, linked manually |
| Native projects | Generated from `app.json` and plugins | Stored in the repo and edited by hand |
| Upgrading RN | Bump the SDK, regenerate projects | Manually port changes in native files |
| Builds | EAS Build in the cloud or locally | Locally or your own CI |
| OTA updates | EAS Update out of the box | Needs a separate setup |

## Expo Go vs development builds

**Expo Go** is a store app that runs your project without a build. It is handy for prototypes, but it only contains the native modules bundled into Expo Go.

As soon as you need a library with its own native code, switch to a **development build** — your own debug build of the app with the modules you need. The workflow stays just as convenient: fast refresh and debugging, now with your native code.

## Config plugins and prebuild

**Prebuild** (`npx expo prebuild`) generates the `ios/` and `android/` folders from configuration. Expo calls this **Continuous Native Generation**: native projects are a build output, not source code you have to maintain.

Changes to native files (Info.plist, AndroidManifest, Gradle) are described with **config plugins**:

```json
{
  "expo": {
    "plugins": [
      ["expo-camera", { "cameraPermission": "Camera is used to scan QR codes" }]
    ]
  }
}
```

If no existing plugin covers your setting, you can write your own — a small JavaScript function that modifies the native configuration during prebuild.

## EAS Build and EAS Update

- **EAS Build** builds iOS and Android in the cloud and manages certificates and provisioning profiles. You do not need a Mac for iOS builds.
- **EAS Submit** uploads builds to App Store Connect and Google Play.
- **EAS Update** ships JavaScript and asset updates without a new store release. Important: an update only applies to builds with the same **runtime version**. If native code changed, you need a new store build.

```bash
eas build --platform all --profile production
eas update --branch production --message "Fix checkout"
```

OTA updates must not change what the app fundamentally is — stores allow bug fixes and content updates this way, not bypassing review.

## When prebuild or "ejecting" is really needed

The term **eject** is outdated: instead you run prebuild and, if you choose, commit the generated folders. Doing that and maintaining native projects by hand makes sense when:

- you need native changes that are awkward to express as a config plugin;
- you are embedding React Native into an existing iOS or Android app;
- your team has native developers who prefer working in Xcode and Gradle directly.

Even a bare project can use Expo modules and EAS — the options are not mutually exclusive.

## FAQ

### Can Expo use any native library?
Yes, through a development build. The limitation only applies to Expo Go, where the set of native modules is fixed.

### Can I move from bare back to the Expo workflow?
Yes, but you will need to move your manual native edits into config plugins. The more edits you have, the longer the migration.

### Is EAS Update suitable for critical bug fixes?
Yes, if the bug is in JavaScript code or assets. Native bugs cannot be fixed this way — they need a new build and store review.
