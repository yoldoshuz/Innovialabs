---
title: Alternative App Stores: Huawei AppGallery, RuStore and Others
description: When an Android app should go beyond Google Play, what AppGallery and RuStore require, and how to replace dependencies on Google Mobile Services.
summary: Publishing outside Google Play pays off when a noticeable share of your users are on Huawei devices without Google services or in Russia; it requires separate builds that swap push, payments, maps and sign-in for each platform's equivalents.
---

## When it makes sense

For an audience in Uzbekistan, **Google Play usually remains the main store**. Alternatives are not about "more reach" but about specific situations:

- **Huawei phones without Google services.** Many recent Huawei models ship without Google Mobile Services (GMS) and without Google Play. If your analytics show a noticeable share of such devices, you lose them without AppGallery.
- **An audience in Russia.** Google Play restricted payments for Russian users, and **RuStore** is preinstalled on many smartphones sold there. To monetize in that market, RuStore is practically required.
- **Extra promotion.** Samsung Galaxy Store and Xiaomi GetApps are preinstalled on their brands' devices. Their users usually have Google Play too, so these are more of a promotion channel than a necessity.

Do not go multi-store if nobody can maintain separate builds and ship updates in sync: an outdated version in a store is worse than none.

## What stores require

The basics are similar everywhere:

- a **developer account** with individual or company verification;
- a signed **release build** (APK or AAB — check supported formats in each store's console);
- a **store listing**: icon, screenshots, descriptions in the languages you need;
- a **privacy policy** and an age rating;
- **review**, which is often stricter about formal details than Google's.

Key differences between the main stores:

| Store | Where it matters | Payments | Push |
|---|---|---|---|
| Huawei AppGallery | Huawei devices without GMS | HMS In-App Purchases | HMS Push Kit |
| RuStore | audience in Russia | RuStore payments SDK | RuStore Push SDK |
| Galaxy Store | Samsung devices | Samsung IAP | FCM works, GMS present |
| Xiaomi GetApps | Xiaomi devices | per store rules | FCM works, GMS present |

AppGallery tests apps on devices without GMS: if your app crashes or blocks sign-in without Google services, it will be rejected. RuStore's requirements on developer residency and monetization have changed over time, so check the current terms before registering.

## What breaks without Google services

On a device without GMS, everything that relies on Google Play services stops working:

| Feature | Google | Huawei | Other options |
|---|---|---|---|
| Push notifications | Firebase Cloud Messaging | Push Kit | RuStore Push SDK |
| In-app purchases | Google Play Billing | In-App Purchases | RuStore payments SDK |
| Maps | Google Maps SDK | Map Kit | Yandex MapKit, 2GIS, OpenStreetMap-based maps |
| Location | Fused Location Provider | Location Kit | system LocationManager |
| Sign-in | Google Sign-In | Account Kit | VK ID, phone, email |
| Integrity checks | Play Integrity API | Safety Detect | server-side checks |

Some Firebase SDKs work without Play services, but do not rely on that: test every dependency on a real device without GMS.

## How to support several stores

1. **Hide services behind interfaces.** App code talks to `PushService`, `BillingService`, `MapProvider`, not to specific SDKs.
2. **Build variants with product flavors.** One codebase, several builds with their own dependencies.
3. **Teach the server to handle several providers:** different push tokens and purchase verification per store.
4. **Automate releases in CI** so every store gets the update at the same time.

```kotlin
// build.gradle.kts of the app module
android {
    flavorDimensions += "store"
    productFlavors {
        create("google") { dimension = "store" }
        create("huawei") { dimension = "store" }
        create("rustore") { dimension = "store" }
    }
}
```

Implementations go into `src/google/`, `src/huawei/` and `src/rustore/`, and dependencies are added per variant with `googleImplementation`, `huaweiImplementation` and so on. In Flutter and React Native the same approach uses flavors and platform-specific plugins.

## Common mistakes

- **Uploading the Google build to AppGallery as is.** On Huawei without GMS, push notifications do not arrive, maps do not load and sign-in fails.
- **Different signing keys in different stores.** A user who installed the app from one store cannot update it from another.
- **Updates not shipped everywhere.** Versions drift apart, and support hears about bugs fixed long ago.
- **One payment rule for all stores.** Each store has its own policy for digital goods, so check each one separately.

## FAQ

### Can I upload the same APK to AppGallery as to Google Play?

Technically yes, but on devices without GMS any feature that depends on Google services will not work. If your app does not depend on them, a separate build may not be needed.

### Do I need a separate build for RuStore?

If the app has no paid digital features, the same build often works. Monetization requires the RuStore payments SDK, which means a separate build variant.

### How many stores should I start with?

Google Play plus the store that covers a noticeable segment of your audience. Add others when analytics show real demand.
