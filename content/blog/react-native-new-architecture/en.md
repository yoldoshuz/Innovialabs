---
title: React Native New Architecture: Fabric, TurboModules and JSI
description: What replaced the React Native bridge: JSI, TurboModules, Fabric and Codegen, where the performance gains come from, migration steps and library risks.
summary: The New Architecture replaces the async, JSON-serialized bridge with direct calls through JSI: native modules load lazily and are typed via Codegen, and the Fabric renderer supports React's concurrent features. Migration starts with a dependency audit.
---

## What changed and why

In the old architecture, JavaScript and native code talked through the **bridge**: every message was serialized to JSON, queued and delivered asynchronously. It worked, but it had limits:

- serialization overhead whenever data moved back and forth often;
- every call was async, so you could not synchronously ask native code for anything;
- all native modules were initialized at startup, needed or not;
- the renderer could not support React's concurrent features.

The New Architecture has three parts that remove these limits.

## The three building blocks

**JSI (JavaScript Interface)** is a C++ API that lets the JavaScript engine hold direct references to native objects and call their methods. No JSON, no queue. Calls can be synchronous when that makes sense.

**TurboModules** are the new native module system built on JSI:

- modules load **lazily**, on first use;
- the interface is written in TypeScript or Flow, and **Codegen** generates native scaffolding, so type mismatches fail at build time instead of at runtime.

**Fabric** is the new renderer. Its core is written in C++ and shared between iOS and Android. It can measure and update layout synchronously and supports concurrent React: `Suspense`, transitions and a correct `useLayoutEffect`.

Alongside them came **bridgeless mode**, where the old bridge is not created at all. Recent React Native versions enable the New Architecture by default, and the legacy one is being phased out.

## Where the gains show up

Actual numbers depend on the app, so look at the mechanisms:

- **Startup**: modules are not all initialized at once.
- **Chatty native communication** (gestures, animations, sensors, file work): no serialization cost.
- **UI responsiveness**: urgent updates do not wait behind heavy renders, thanks to concurrent rendering.
- **Synchronous operations** such as measuring a view before showing a tooltip, without flicker.

If your app mostly renders lists from an API, the difference may be hard to notice. Profile on real devices with release builds.

## What a Codegen module looks like

A TurboModule spec in TypeScript:

```ts
// specs/NativeDeviceInfo.ts
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getDeviceName(): string;
  getBatteryLevel(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("DeviceInfo");
```

Codegen is configured in `package.json`:

```json
"codegenConfig": {
  "name": "AppSpecs",
  "type": "modules",
  "jsSrcsDir": "specs",
  "android": { "javaPackageName": "com.example.app" }
}
```

You then implement the generated interfaces in Kotlin/Java and Objective-C++/Swift.

## Migrating an existing app

1. **Audit dependencies.** List every library with native code and check its status in React Native Directory or its repository.
2. **Upgrade React Native** to a current version. Go step by step with the Upgrade Helper; jumping many versions at once makes problems hard to isolate.
3. **Turn the architecture on** if your version does not enable it by default: `newArchEnabled=true` in `android/gradle.properties`, reinstall pods with the New Architecture on iOS, or set the matching flag in the Expo app config.
4. **Port your own code**: native modules to TurboModules and native views to Fabric components (spec, Codegen, implementation).
5. **Test both platforms in release mode**: navigation, gestures, keyboard handling, modals and third-party SDKs.
6. **Ship gradually** with staged rollouts in the stores and crash monitoring.

## Library compatibility

This is the main migration risk.

- The **interop layer** lets many legacy modules and components work without rewrites, but not all of them, and not always perfectly.
- Libraries that reach into the bridge object directly, rely on `setNativeProps` or use unusual `UIManager` tricks are the most likely to break.
- **Abandoned libraries** are a signal to switch to a maintained alternative, fork, or write a small module yourself.
- Upgrade libraries to versions with explicit New Architecture support before you flip the switch, not after.

## FAQ

### Do I have to migrate right now?

If the app is stable, there is no emergency, but postponing for long is risky: new React Native and library releases target the New Architecture, and the legacy one is losing support.

### Do I need to rewrite my JavaScript code?

Usually not. Most of the work is in dependencies and your own native code. Components and business logic in JavaScript generally stay the same.

### What if a library does not support the New Architecture?

First check whether it works through the interop layer. If it does not, look for a maintained alternative or a patched fork, or implement the feature you need as your own TurboModule.
