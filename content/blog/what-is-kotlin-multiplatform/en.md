---
title: What Is Kotlin Multiplatform and When Does It Make Sense
description: Kotlin Multiplatform explained: shared business logic for iOS and Android with native UI, Compose Multiplatform, maturity and how it compares to Flutter.
summary: Kotlin Multiplatform (KMP) lets you write business logic, networking and data handling once in Kotlin and use it on iOS and Android while keeping the UI native. It makes sense when native UX matters and you already have Android expertise.
---

## What Kotlin Multiplatform is

**Kotlin Multiplatform (KMP)** is a JetBrains technology for writing shared Kotlin code and compiling it for several platforms: Android, iOS, desktop, web and server.

The core idea: **share what does not depend on the platform** and keep native what does. Typically shared:

- business logic and rules;
- API calls and networking;
- data models, validation, caching and the local database;
- analytics and error handling.

The UI can stay native: **Jetpack Compose** on Android and **SwiftUI** on iOS. For iOS, the shared code compiles into a regular native framework that you add in Xcode like any other dependency.

## How it works

A project is split into **source sets**: `commonMain` for shared code and `androidMain`, `iosMain` for platform-specific code. When you need something platform-specific, you use `expect`/`actual`: shared code declares an expectation and each platform provides an implementation.

```kotlin
// commonMain
expect fun platformName(): String

// androidMain
actual fun platformName(): String = "Android"

// iosMain
actual fun platformName(): String = "iOS"
```

A library ecosystem has grown around KMP: **Ktor** for networking, **kotlinx.serialization** for JSON, **kotlinx.coroutines** for async work, **SQLDelight** and Room for databases.

## Compose Multiplatform

**Compose Multiplatform** goes one step further: it shares the UI as well as the logic. It is a JetBrains framework built on Jetpack Compose that renders interfaces on Android, iOS, desktop and web.

That gives you two modes:

- **Shared logic only**, native UI. The closest fit to each platform, but you build the UI twice.
- **Shared logic and UI** with Compose Multiplatform. Less code, but on iOS the interface will not feel fully native without extra work.

You can mix both: some screens in Compose, others in SwiftUI.

## How mature it is

Kotlin Multiplatform has been declared stable, Google officially supports it for sharing logic between Android and iOS, and Compose Multiplatform for iOS has also reached stable status. Many large companies run KMP in production.

Still, keep in mind:

- the library ecosystem is smaller than Flutter's or React Native's;
- iOS developers need to get used to Kotlin code and the Gradle build system;
- iOS build times and debugging shared code from Xcode take some setup.

## How it differs from Flutter and React Native

| Criterion | Kotlin Multiplatform | Flutter | React Native |
|---|---|---|---|
| Language | Kotlin | Dart | JavaScript / TypeScript |
| What is shared | Logic, optionally UI | Logic and UI | Logic and UI |
| UI | Native or Compose | Own rendering engine | Native components via JS |
| Adoption | Gradually into an existing app | Usually a new app | Per screen, but harder |
| Learning curve | Low for an Android team | Need to learn Dart | Low for a web team |

The key difference: KMP **does not force a UI approach on you**. You can adopt it gradually, starting with a single module such as the networking layer.

## When KMP makes sense

- You already have **native apps** and their logic keeps drifting apart.
- Your team has strong **Android expertise**.
- **Native UX** and performance matter, but you do not want to duplicate business logic.
- The logic is complex: finance, offline sync, calculations — where bugs from two separate implementations are costly.

## When another option fits better

- You need a fast MVP from a small team with no Kotlin experience — Flutter or React Native may get you there sooner.
- Your team is strong in web and TypeScript — React Native is closer to home.
- The app is simple and has almost no shared logic.

## FAQ

### Do I still need iOS developers with KMP?

Yes. If the UI stays native, it is written in Swift. Even with Compose Multiplatform you need someone who understands iOS builds, publishing and platform specifics.

### Can KMP be added to an existing app?

Yes. Teams usually start with one shared module, such as the networking layer or data models, and gradually move more logic into it.

### Is KMP the same as Compose Multiplatform?

No. KMP is the foundation for shared code, and Compose Multiplatform is a UI framework on top of it. You can use KMP without Compose and keep a native UI.
