---
title: Calling Native Code from Flutter and React Native
description: Platform channels in Flutter and native modules in React Native: when a cross-platform app needs native code and how to keep that layer maintainable.
summary: Flutter talks to native code through platform channels (ideally generated with Pigeon), React Native through native modules (TurboModules or the Expo Modules API). You need native code for SDKs, sensors and background work; keep it thin, typed and isolated in its own package.
---

## How it works

A cross-platform framework covers most needs, but not every iOS and Android API. When no package does what you need, you write a small piece of Swift or Kotlin and call it from shared code.

- **Flutter** uses **platform channels**. Dart sends a message over a named channel, the native side handles it and returns a result.
  - `MethodChannel` for a method call with a reply;
  - `EventChannel` for a stream of native events (sensors, connectivity);
  - **Pigeon** generates typed channel code so you do not juggle strings by hand.
  - For C libraries there is `dart:ffi`, a direct call with no channel.
- **React Native** uses **native modules**. In the New Architecture these are **TurboModules** with a TypeScript spec and Codegen. The alternative is the **Expo Modules API**: you describe a module in Swift and Kotlin with a declarative DSL, and it works in both Expo and plain React Native projects. Native UI elements are exposed as native components.

## Example: Flutter MethodChannel

Dart:

```dart
const _channel = MethodChannel("com.example.app/battery");

Future<int> getBatteryLevel() async {
  final level = await _channel.invokeMethod<int>("getBatteryLevel");
  return level ?? -1;
}
```

Kotlin:

```kotlin
class MainActivity : FlutterActivity() {
  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example.app/battery")
      .setMethodCallHandler { call, result ->
        if (call.method == "getBatteryLevel") {
          val manager = getSystemService(BATTERY_SERVICE) as BatteryManager
          result.success(manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY))
        } else {
          result.notImplemented()
        }
      }
  }
}
```

Channel and method names are strings, so a typo only shows up at runtime. For anything beyond a couple of methods, use **Pigeon**: you describe the interface in Dart and it generates Dart, Kotlin and Swift code.

```dart
@HostApi()
abstract class BatteryApi {
  int getBatteryLevel();
}
```

## Example: an Expo Modules API module

```kotlin
class BatteryModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Battery")

    Function("getLevel") {
      val manager = appContext.reactContext
        ?.getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
      manager?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: -1
    }
  }
}
```

```ts
import { requireNativeModule } from "expo-modules-core";

const Battery = requireNativeModule("Battery");
const level: number = Battery.getLevel();
```

A matching implementation is written in Swift for iOS.

## When you really need native code

- **Third-party SDKs with no plugin**: payment terminals, banking and identity SDKs, hardware and IoT SDKs.
- **Sensors and hardware** not covered, or only partly covered, by packages: Bluetooth profiles, NFC with custom protocols, special camera modes.
- **Background work**: `WorkManager` and foreground services on Android, `BGTaskScheduler` on iOS, background location.
- **System integrations**: home screen widgets, share extensions, CallKit, Live Activities, App Clips.
- **Performance**: image and audio processing, cryptography, work that runs better natively or in a C library.

Before writing your own, check pub.dev, npm and React Native Directory. A maintained package often already exists.

## Keeping the native layer maintainable

1. **Isolate it.** Put native code in its own plugin or package inside the repo, not in `MainActivity` and `AppDelegate`.
2. **Type the contract.** Pigeon, Codegen or the Expo Modules API instead of string names and dictionaries.
3. **Keep it thin.** Native code calls the SDK and converts data. Business logic stays in Dart or TypeScript.
4. **One contract for both platforms.** Same method names, types and error codes on iOS and Android. If a feature exists on only one platform, return an explicit "not supported".
5. **Do not block the main thread.** Channel and module handlers often run on the main thread by default; move heavy work to the background.
6. **Normalize errors.** Turn native exceptions into clear codes and messages for the shared layer.
7. **Test both sides.** Mock the channel or module in Dart/JS tests and write native unit tests for the implementation.
8. **Document** native SDK versions and setup steps: keys, permissions, manifest entries.

## Common mistakes

- Logic smeared between Dart/JS and native, so nobody knows where to look for a bug.
- An implementation for one platform only, while the other crashes without a clear message.
- A native SDK update breaks the build because its version was not pinned.
- Only one person on the team understands the native code.

## FAQ

### Do I need Swift and Kotlin to build with Flutter or React Native?

Not for most screens. But for SDK integrations, background work and store builds, a basic grasp of the native platforms helps a lot, and in complex projects it becomes essential.

### MethodChannel or Pigeon in Flutter?

A `MethodChannel` is fine for one or two simple calls. With more methods or complex data structures, Pigeon saves time and removes naming and type errors.

### If I need lots of native code, should I just build a native app?

Sometimes. If most of the app's value lives in platform features, native development may be simpler. If there are only a few native touchpoints, a cross-platform app with an isolated native layer is usually the better deal.
