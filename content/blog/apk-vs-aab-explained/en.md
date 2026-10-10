---
title: APK vs AAB: Android App Formats Explained
description: What is inside an APK and an AAB, why Google Play only accepts App Bundles, how split APKs shrink downloads and how Android app signing works.
summary: An APK is the package that gets installed on a device, while an AAB is a publishing format: Google Play builds lighter, device-specific APKs from it and signs them with the app signing key.
---

## The short answer

- **APK** (Android Package) is a ready-to-install file. You can copy it to a phone and install it.
- **AAB** (Android App Bundle) is a publishing format. It cannot be installed on a device: Google Play takes the AAB and generates a set of **split APKs** optimized for each specific phone.

New apps on Google Play are published as AAB only. APKs are still needed for installs outside the store, internal testing and some other app stores.

## What is inside an APK

An APK is a ZIP archive with a standard layout:

- `AndroidManifest.xml` — the binary manifest: package, permissions, components;
- `classes.dex` — the compiled app code;
- `resources.arsc` and `res/` — resources: strings, layouts, images;
- `assets/` — arbitrary files the app reads as is;
- `lib/<abi>/` — native libraries for each CPU architecture;
- `META-INF/` and the signing block — the developer's signature data.

The problem with a classic **universal APK** is that it contains everything at once: libraries for every architecture, images for every screen density, strings in every language. Users download things their device will never use.

## What is inside an AAB

An AAB is also a ZIP archive, but organized by modules:

- `base/` — the main module with its manifest, code (`dex/`), resources, `lib/` and `assets/`;
- **feature module** folders, if the app is split into parts;
- `BundleConfig.pb` and build metadata.

There is no signature for end devices inside an AAB — Google Play adds it when generating APKs.

## How split APKs reduce download size

From the AAB, Google Play builds a base APK plus **configuration splits**:

| Split | Contents | Example |
|---|---|---|
| ABI | native libraries | only `arm64-v8a` |
| Screen density | images | only `xxhdpi` |
| Language | strings and resources | only `ru` and `uz` |

The device gets the base APK and only the splits that match it. On top of that you can use **Play Feature Delivery** (modules downloaded on demand) and **Play Asset Delivery** (large game assets).

## How app signing works

Every APK must be signed, or Android will not install it. An update is accepted only if its signature matches the installed version.

With AAB, **Play App Signing** is mandatory, and there are two keys:

- **upload key** — you sign the AAB with it before uploading to Play Console;
- **app signing key** — Google stores it and signs the APKs users receive.

The benefit: if the upload key is lost or compromised, you can reset it through Play Console, and the app signing key stays safe.

One caveat: if you also distribute the app outside Google Play, the signatures may differ, and users will not be able to update over a version from another source. When enrolling in Play App Signing you can upload your own signing key to use the same key everywhere.

## How to build both formats

```bash
# AAB for Google Play
./gradlew bundleRelease

# APK for direct installs and testing
./gradlew assembleRelease

# Test an AAB locally: build APKs for the connected device and install them
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app.apks --connected-device
java -jar bundletool.jar install-apks --apks=app.apks
```

In Flutter the equivalents are `flutter build appbundle` and `flutter build apk`. More details are in the [Android App Bundle documentation](https://developer.android.com/guide/app-bundle).

## Common mistakes

- **The keystore lives only on a developer's laptop.** Keep a backup and store passwords in the company password manager.
- **Sending an AAB straight to testers.** It will not install — use internal testing in Play Console or a universal APK.
- **Treating AAB size as download size.** Check the real size users get in the app size report in Play Console.
- **Keys and passwords committed to the repository.** Keep them in CI secrets, not in `build.gradle`.

## FAQ

### Can I still upload a plain APK to Google Play?

Not for new apps — an AAB is required. APKs are still used for installs outside the store, enterprise scenarios and some alternative app stores.

### What happens if I lose the key?

If you lose the upload key, you reset it through Play Console, because Google holds the app signing key. If the app is signed only with your own key and that key is lost, you can no longer ship updates with the same signature.

### Does AAB make the app faster?

No, the format does not affect runtime speed. It reduces download size and storage use, which indirectly helps installs on slow connections and low-cost devices.
