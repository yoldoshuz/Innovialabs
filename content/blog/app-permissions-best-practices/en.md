---
title: How to Request App Permissions on iOS and Android the Right Way
description: How to ask for camera, location, photo and notification access: runtime permissions, pre-permission screens, purpose strings, denial and limited access.
summary: Ask for a permission at the moment the user starts the action that needs it, and explain why. If access is denied the app must keep working, and limited photo or location access should be handled as a normal case.
---

## The core rule

On iOS the system permission dialog appears **only once**, and on Android the system stops showing it after repeated denials. Every request is an attempt you can easily waste.

A simple approach works:
- ask **in context** — when the user taps "Scan QR", not on first launch;
- ask **only for what you need** — do not request location "just in case";
- **explain the benefit** in plain language;
- **do not break the app** on denial.

## How runtime permissions work

**iOS.** Each protected resource needs a **purpose string** in `Info.plist` — the text the system shows in the dialog. Without it the app crashes when accessing the resource, and App Review rejects vague wording.

```xml
<key>NSCameraUsageDescription</key>
<string>The camera is used to scan the QR code on your receipt.</string>
```

A good purpose string answers "what do I get", not "the app needs access".

**Android.** Dangerous permissions are declared in the manifest and requested at runtime:

```kotlin
val requestCamera = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) openScanner() else showScannerFallback()
}

requestCamera.launch(Manifest.permission.CAMERA)
```

`shouldShowRequestPermissionRationale` tells you the user has already declined and you should explain the reason first. Newer Android versions added separate permissions — for example, for posting notifications — so check the requirements for your target API.

## The pre-permission screen

Before the system dialog you can show your own screen: an illustration, one sentence about the benefit, and a button that triggers the system request.

- Use "Continue" and "Not now". Do not imitate the system dialog or label a button "Allow" when it does not actually grant anything.
- "Not now" must genuinely skip the step without blocking.
- If the user declines on your screen, the system dialog is not used up — you can ask again later at a better moment.

## Denial and limited access

**Denial.** Offer an alternative: enter an address manually instead of location, pick a file instead of using the camera. If the feature is impossible without the permission, say so and offer a button to the app's settings.

**Photos.** Users can grant access to **selected photos only**, on iOS and on recent Android versions. Treat it as a normal case: show the available photos and let users pick more. If you only need an avatar upload, use the **system photo picker** — it requires no permission at all.

**Location.** There is **precise and approximate** location, plus "while using" and "always" access. Weather or nearest city only need approximate. Request background location separately and only if the feature truly does not work without it.

**Notifications.** Do not ask on first launch. Ask after an action where the value is obvious: "Notify you when your order is on the way?". iOS also offers **provisional** notifications that arrive quietly without a prompt, letting users decide whether to keep them.

## What the stores expect

- **App Store:** purpose strings must explain data use specifically. You may not force consent, block the app over a denial without real need, or mislead with pre-permission screens.
- **Google Play:** sensitive permissions (background location, all files access, SMS and call log, and others) require a declaration in Play Console proving the feature is core. Otherwise the update is rejected.
- Your permission list must match your Privacy Labels and Data Safety answers.

## Common mistakes

- A burst of requests on first launch.
- Leftover permissions from SDKs or retired features.
- Generic purpose strings like "The app needs camera access".
- A blank screen after denial instead of an alternative.

## FAQ

### Can I show the system dialog again after a denial?
On iOS, no — you can only send the user to Settings. On Android, after repeated denials the system also stops showing the dialog, leaving the settings route.

### Do I need a permission to let users pick one photo?
No. The system photo pickers on iOS and Android give access only to the selected files without a permission prompt.

### When is the best time to ask for notification permission?
After an action where the value is clear: placing an order, following an event. A context-free request on first launch is more likely to be declined.
