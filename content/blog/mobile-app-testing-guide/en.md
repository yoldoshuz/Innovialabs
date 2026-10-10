---
title: How to Test a Mobile App: Manual, Automated and Device Farms
description: How mobile app testing works: unit, UI and end-to-end tests, Espresso, XCTest, Detox and Maestro, plus emulators, real devices and cloud device farms.
summary: A reliable setup is many fast unit tests, fewer UI component tests and a handful of end-to-end flows, plus manual checks before release. Emulators are fine for daily development, while real devices and cloud farms verify the app on what your users actually own.
---

## The short answer: the test pyramid

A mobile app is tested on three levels:

- **Unit tests** — many, fast, checking logic without UI.
- **UI component tests** (widget tests in Flutter) — fewer, checking screens and elements.
- **End-to-end (E2E)** — a few, checking key flows end to end: sign-in, payment, checkout.

On top of automation sits **manual testing**: exploring new features and regression before release.

## Test levels

| Level | What it checks | Speed | When to run |
|---|---|---|---|
| Unit | Business logic, calculations, data mapping | Seconds | On every commit |
| UI components / widget | Screen rendering, taps, states | Fast | On every pull request |
| E2E | A flow from launch to result, with network and navigation | Slow | On pull requests or nightly |

The higher the level, the more a test costs to maintain and the more often it turns **flaky**. Cover core logic at the bottom and keep E2E for the most important paths.

## Tools

| Tool | Platform | Used for |
|---|---|---|
| **XCTest / XCUITest** | iOS | Unit and UI tests, built into Xcode |
| **Espresso** | Android | In-process UI tests, synchronized with the main thread |
| **flutter_test, integration_test** | Flutter | Unit, widget and integration tests |
| **Detox** | React Native | Gray-box E2E: waits until the app is idle |
| **Maestro** | iOS, Android, cross-platform | E2E flows in YAML, quick to start without deep code knowledge |
| **Appium** | iOS, Android | Cross-platform E2E via WebDriver |

A Maestro flow example:

```yaml
appId: com.example.app
---
- launchApp
- tapOn: "Sign in"
- inputText: "test@example.com"
- tapOn: "Continue"
- assertVisible: "Home"
```

## Manual testing

Automation doesn't fully replace people. Check manually:

- **new features** — exploratory testing while flows are still changing;
- **visual details**: fonts, spacing, dark mode, different screen sizes;
- **interruptions**: an incoming call, backgrounding the app, losing network, denied permissions;
- **checklist regression** before each release.

Distribute builds to testers via **TestFlight** on iOS and **internal testing** in Google Play Console.

## Emulators or real devices

| | Emulators and simulators | Real devices |
|---|---|---|
| Cost | Free | Must be bought or rented |
| Startup | Fast, CI-friendly | Slower to set up |
| Accuracy | Don't reproduce real performance, camera, sensors | Real behavior, vendor skins |
| Use for | Daily development, unit and UI tests | Pre-release checks, performance, hardware |

Real Android devices matter most: vendor skins handle background work, notifications and battery saving differently.

## Cloud device farms

If buying a fleet of phones is too expensive, use a farm: **Firebase Test Lab**, **AWS Device Farm**, **BrowserStack**, **Sauce Labs**. They run your tests on real devices in the cloud and return logs, videos and screenshots.

How to pick devices:

- Take the **most popular models and OS versions** among your users from analytics.
- Add your **minimum supported OS version**.
- Include a **small screen** and a **low-end device** with little memory.

## Common mistakes

- Fixed `sleep` pauses instead of waiting for a state — the main source of flaky tests.
- Testing only the happy path, without network errors or empty data.
- Checking the app only on the developer's own phone.
- Running E2E by hand instead of in CI, so they get forgotten.

## FAQ

### Which tests should I write first if there are none?

Unit tests for the riskiest logic: price calculations, authentication, data handling. Then add one or two E2E flows for the main scenario, such as sign-in and checkout.

### Can I skip manual testing?

Rarely completely. Automated tests catch regressions well, but visual issues, awkward UX and device-specific surprises are better spotted by a person.

### Maestro or Detox for React Native?

Detox integrates more deeply with React Native and can wait for the app to become idle. Maestro is easier to learn and works with any app. The choice depends on who writes the tests and how much you value one tool across platforms.
