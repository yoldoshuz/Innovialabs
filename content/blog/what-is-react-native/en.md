---
title: What Is React Native and How Does It Work
description: How React Native lets JavaScript drive native UI components, what Expo is for, how to share code with a React web team, and its main strengths and weaknesses.
summary: React Native is Meta's framework where you describe the UI in JavaScript or TypeScript using React, and real native iOS and Android components appear on screen. It pays off most for teams that already build their web with React.
---

## React Native in brief

**React Native** is an open-source framework from Meta for building iOS and Android apps from a single codebase. You write code in **JavaScript** or, as is now standard, **TypeScript**, using **React** concepts: components, state and hooks.

The key difference from a web wrapper: React Native does not show a web page inside the app. It creates **real native UI elements** — the same ones Swift and Kotlin developers would use.

## How JavaScript drives the native UI

In simple terms, the app has two parts:

1. **The JavaScript part** — your logic and UI description, executed by a JS engine bundled with the app.
2. **The native part** — real screens, buttons, lists and access to device features.

You describe the UI with components:

```tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={{ padding: 24 }}>
      <Text>Count: {count}</Text>
      <Pressable onPress={() => setCount(count + 1)}>
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}
```

When state changes, React works out exactly what changed and React Native updates the matching native elements. `View` becomes a native container and `Text` a native text element.

In React Native's modern architecture, JavaScript talks to native code directly, without the slow asynchronous "bridge" of earlier versions. That made the UI more responsive and native modules easier to write.

## The role of Expo

**Expo** is a set of tools and services on top of React Native. The official React Native documentation recommends starting new projects with a framework such as Expo.

What Expo gives you:

- **a fast start** without hand-configuring Xcode and Android Studio at first;
- **ready-made modules** for camera, notifications, files, location and more;
- **file-based routing** for screens (Expo Router);
- **cloud builds** and store submission (EAS);
- **over-the-air updates** for the JavaScript part without republishing — within store rules.

You can create a project with one command:

```bash
npx create-expo-app@latest my-app
```

Expo does not lock you in: if you need custom native code, you can add it to the project.

## Sharing code with a React web team

This is one of the main reasons to choose React Native.

**What you can usually reuse:**

- TypeScript types and data models;
- the API client, validation and business logic;
- state management and data fetching;
- team knowledge: patterns, tooling, code review.

**What does not transfer directly:** web markup. The web uses `div` and CSS; React Native uses `View`, `Text` and styles in JavaScript. Shared UI components are possible but need a dedicated architecture.

A convenient setup is a **monorepo** where the web app, the mobile app and a shared logic package live side by side.

## Strengths

- The huge JavaScript and React ecosystem.
- Easier to find and train developers, especially from web.
- Native components: the app feels at home on each platform.
- Fast iteration: changes appear almost instantly (Fast Refresh).
- JavaScript updates without waiting for store review.

## Weaknesses

- **Third-party library quality** varies widely; an abandoned package can block upgrades.
- **Framework upgrades** in large projects take time and testing.
- **Heavy scenarios** — complex animations, video processing, AR — need specialized libraries or native code.
- **iOS and Android differences** in native components must be checked on both platforms.
- **Web experience is not mobile experience:** publishing, performance and device work need separate knowledge.

## FAQ

### Should I use Expo from the start?

For most new projects, yes — it is the fastest and recommended path. If you later need non-standard native code, you can add it without giving up Expo.

### Can one codebase power both the app and the website?

Partly. Logic, types and API code are easy to share. A shared UI is possible too, but usually the web and mobile apps have their own screens optimized for each platform.

### How is React Native different from Flutter?

React Native uses native components and JavaScript/TypeScript; Flutter draws the UI itself and uses Dart. See our separate comparison of the two frameworks for details.
