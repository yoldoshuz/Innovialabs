---
title: How to Speed Up a Mobile App: Startup Time, Frames and Memory
description: Measure cold start, jank and memory with Android and iOS profilers, then apply the common fixes: lazy loading, image caching and list virtualization.
summary: Measure first, on a real device with a release build, then optimize. The usual wins are deferring work at startup, caching and resizing images, virtualizing lists and moving heavy work off the main thread.
---

## Measure first, then optimize

Optimizing by feel often speeds up the wrong thing. The workflow:

1. Pick a metric: startup time, smoothness or memory.
2. Measure on a **real mid-range device** with a **release** (or profile) build — debug builds are much slower.
3. Find the bottleneck with a profiler.
4. Fix one thing and measure again.

## What to measure

- **Cold start** — launching when the app process isn't in memory. The slowest and most important case. Warm and hot starts are faster and worth tracking separately.
- **Smoothness (jank)** — dropped frames. At 60 Hz each frame has about **16.7 ms**, at 120 Hz about **8.3 ms**. Miss the budget and scrolling and animations stutter.
- **Memory** — peak usage and leaks. They cause the system to kill the app in the background or crash it.

## Tools by platform

| Platform | Startup | Smoothness | Memory |
|---|---|---|---|
| Android | Macrobenchmark, `adb`, Android Studio Profiler | Profiler, Perfetto, JankStats | Memory Profiler, LeakCanary |
| iOS | Instruments: App Launch, Xcode Organizer | Instruments: Time Profiler, Hitches | Instruments: Allocations, Leaks |
| Flutter | DevTools (profile mode) | DevTools: Performance | DevTools: Memory |
| React Native | Native platform profilers | Perf Monitor, Hermes profiler | Native profilers |

A quick cold start check on Android:

```bash
adb shell am force-stop com.example.app
adb shell am start -W -n com.example.app/.MainActivity
```

Look at `TotalTime` in the output. For stable numbers use Macrobenchmark with several runs. For production, real-user data helps: Android vitals in Google Play Console and metrics in Xcode Organizer.

## Common fixes

### Faster startup

- **Lazy initialization**: analytics, ads, support chat and other SDKs aren't needed before the first frame. Start them after rendering or on demand.
- Don't run network calls or heavy database work **synchronously at launch**. Show cached data or a skeleton.
- On Android, use **Baseline Profiles** — they speed up code execution on first runs.
- On iOS, watch the number of dynamically linked libraries: each adds work at load time.

### Images and caching

- Load images **at display size**, not original resolution.
- Use libraries with disk and memory caching: Coil or Glide on Android, Kingfisher or SDWebImage on iOS, `cached_network_image` in Flutter.
- Choose efficient formats (WebP, for example) and compress assets.

### List virtualization

- Render long lists **lazily**: `RecyclerView` or `LazyColumn`, `UICollectionView` or SwiftUI lazy containers, `ListView.builder` in Flutter, `FlatList` in React Native.
- Give items **stable keys** so the whole list isn't re-rendered.
- Simplify cell layouts: less nesting, fewer heavy effects.

### Offload the main thread

- JSON parsing, database work, image processing — **on a background thread**: coroutines on Android, Swift Concurrency on iOS, isolates in Flutter.
- In React Native, avoid heavy computation on the JS thread during animations.
- Don't recreate objects or recompute data on every render.

### Memory

- Unsubscribe listeners and timers when a screen closes.
- Watch for long-lived objects holding references to screens — a classic leak.
- Cap cache sizes.

## Common mistakes

- Measuring in a debug build or only on a flagship phone.
- Initializing every SDK in the first milliseconds.
- Loading full-size camera photos into list thumbnails.
- Optimizing without re-measuring and never knowing if it helped.

## FAQ

### Why is the app fast for developers but slow for users?

Developers usually test on powerful devices with fast internet. Users may have budget phones, little free memory and slow networks. Test on a mid-range device and check real-user metrics in the store consoles.

### Is a cross-platform app always slower than native?

Not necessarily. Flutter and React Native can deliver smooth interfaces, but you need to know their profiling tools. Most performance problems come from architecture and unnecessary work, not the choice of framework.

### Where do I start if everything feels slow?

With cold start and the home screen: every user sees them. Profile the launch, remove extra initialization and synchronous work, then move on to scrolling the main lists.
