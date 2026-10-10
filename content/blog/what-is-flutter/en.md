---
title: What Is Flutter and How Does It Work
description: A plain explanation of Flutter: the Dart language, the widget tree, its own rendering engine and hot reload, which apps it fits and where its limits are.
summary: Flutter is Google's framework for building iOS, Android and other apps from one Dart codebase. It draws the entire UI with its own engine, so the app looks the same everywhere.
---

## Flutter in brief

**Flutter** is an open-source framework from Google for building apps from a single codebase. Its main focus is mobile apps for iOS and Android, but the same code can also be built for the web and desktop (Windows, macOS, Linux).

Flutter's key ideas:

- the **Dart** language;
- a UI made of **widgets** arranged in a tree;
- its **own rendering engine** instead of system components;
- **hot reload** — code changes show up in the running app almost instantly.

## The Dart language

Dart is a strongly typed language from Google with familiar syntax: developers who know Java, Kotlin, C# or TypeScript usually feel at home within days.

An important feature is its two compilation modes:

- **during development**, code runs in a way that lets changes be loaded on the fly;
- **in release builds**, code is compiled ahead of time (AOT) to the device's machine code, so the app starts and runs fast.

Dart has built-in **null safety**: the compiler prevents you from accidentally using an empty value, which removes a whole class of bugs.

## The widget tree

In Flutter everything is a widget: text, a button, padding, a screen and the app itself. Widgets nest inside each other to form a tree. Here is a minimal app:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Hello')),
        body: const Center(child: Text('Flutter')),
      ),
    );
  }
}
```

The UI is **declarative**: you describe how the screen should look for the current data, and Flutter works out what to redraw when the data changes. There are two basic types:

- **StatelessWidget** — no state of its own (a title, an icon);
- **StatefulWidget** — has state that changes (a counter, a form, a list that loads).

In larger apps, state usually lives in a separate layer managed by a state-management library.

## Its own rendering engine

Most frameworks use the system's buttons and lists. Flutter takes a different path: it **paints every pixel itself** using its own graphics engine.

What that gives you:

- the same look on iOS and Android, with no surprises from different OS versions;
- full control over design and animation;
- smooth rendering of complex interfaces.

The trade-off: if you want a "system" look, it has to be reproduced too. Flutter ships ready-made widget sets for this: **Material** (Google's style) and **Cupertino** (iOS style).

## Hot reload

A developer edits code, saves the file and sees the result in the running app within a second, **without losing current state**: the open screen and entered data stay in place. This greatly speeds up UI work and design fixes.

For changes that affect app initialization, there is **hot restart** — a quick restart that resets state.

## What kinds of apps Flutter fits

- Business apps: online stores, delivery, booking, customer accounts.
- Apps with a bold branded design and rich animations.
- MVPs that need to ship on iOS and Android quickly.
- Internal corporate apps for employees.

## Limits

- **App size.** The engine is bundled with the app, so a minimal app is larger than its native equivalent.
- **New OS features** arrive with a delay: you wait for plugins or connect them yourself through native code (platform channels).
- **Specific hardware** and rare SDKs may require a native module in Swift or Kotlin.
- **The web build** suits app-like experiences, not content sites where SEO and fast first load matter.
- **Dart** is rarely used outside Flutter, so you hire specifically for this stack.

## FAQ

### Do I need Swift or Kotlin to write Flutter apps?

For most tasks, no. But for publishing, build configuration and rare native integrations, basic iOS and Android knowledge on the team is highly desirable.

### Is Flutter suitable for large apps?

Yes, if architecture is planned from the start: modules, state management and tests. Problems in big projects usually come from architecture, not the framework itself.

### Where should I learn Flutter?

The best starting point is the official documentation at [docs.flutter.dev](https://docs.flutter.dev), which covers installation, tutorials and publishing guides.
