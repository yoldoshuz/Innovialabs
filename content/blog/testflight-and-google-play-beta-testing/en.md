---
title: Beta Testing Apps with TestFlight and Google Play Testing Tracks
description: How internal, closed and open testing work in TestFlight and Google Play, how to invite testers, collect feedback and crashes, and ship the build.
summary: On iOS you distribute betas through TestFlight (internal and external testers); on Android through Play Console tracks (internal, closed, open). The verified build is then promoted to production without rebuilding.
---

## The short answer

A beta test means handing a nearly finished build to a limited group of people through the stores' official tools. Testers install it like a normal app, and you collect feedback and crash reports before the public release.

- **iOS** uses **TestFlight** inside App Store Connect. Testers install the TestFlight app and receive your builds through it.
- **Android** uses **testing tracks** in Google Play Console: internal, closed and open. A tester opts in through a link and installs the app straight from Google Play.

The key benefit on both platforms: you test the exact build that will later go to production.

## Three levels of testing

| Level | iOS (TestFlight) | Android (Play Console) |
|---|---|---|
| Internal | App Store Connect team members; build available right after processing | Internal testing: email list, fast availability without full review |
| Closed | External testers by email or groups; requires Beta App Review | Closed testing: email lists or Google Groups; reviewed by Google |
| Open | Public TestFlight link with a tester cap | Open testing: anyone can join from the Google Play listing |

A sensible order: internal circle first (team and client), then closed (loyal users, partners), and open testing only if you need a wide range of devices.

**Note for new Google Play accounts:** for new personal developer accounts, Google requires a closed test with a minimum number of testers over a set period before production access is granted. The exact terms change, so check them in Play Console early and plan for the time.

## Inviting testers

**TestFlight:**
1. Upload the build from Xcode or CI and wait for processing.
2. For internal testers, add people to your App Store Connect team and assign them to a group.
3. For external testers, create a group, add emails or enable a **public link**, fill in "What to Test" and submit the build for Beta App Review.

**Google Play:**
1. Upload the AAB to the chosen track and create a release.
2. Add an email list or a Google Group.
3. Send testers the **opt-in link** — until they join, they will not see the app in the store.

Keep in mind that TestFlight builds expire after a set period and stop launching. For long tests, upload fresh builds regularly.

## Collecting feedback and crashes

- **TestFlight** lets testers take a screenshot and send feedback from inside the app. Feedback and crash reports appear in App Store Connect and Xcode Organizer.
- **Google Play** collects crashes and ANRs in **Android vitals**, and the **pre-launch report** automatically runs your build on a set of real devices and flags errors and accessibility issues.
- For deeper insight, add **Crashlytics** or Sentry: symbolicated stack traces, versions, devices and the steps leading up to a crash.

Tip: give testers a short checklist of scenarios ("sign up, pay, receive a push") and a single feedback channel. Otherwise feedback arrives scattered and incomplete.

## From beta to production

- **iOS:** pick the tested build in the app version in App Store Connect and submit it for App Review. No rebuild needed. Use **phased release** so the update reaches users gradually.
- **Android:** in Play Console you **promote** the release from a testing track to production. Use a **staged rollout**: start with a small share of users and expand while watching crashes in Android vitals.

## Common mistakes

- Sending a raw build to external testers without internal checks first.
- Not incrementing the build number — stores reject a re-upload with the same build number / versionCode.
- Testing a debug build with different keys and environment than production.
- Forgetting demo accounts and reviewer notes for external tests.
- Rolling out to everyone at once instead of a staged release.

## FAQ

### Does Apple review beta builds?
Not for internal testers. For external testers the build goes through Beta App Review; it is usually faster than full review, but plan time for it, especially for the first build of a version.

### Can I test in-app purchases in a beta?
Yes. In TestFlight purchases run in a sandbox with no real charges; in Google Play they work through licensed testers added in Play Console.

### How long should a beta last?
It depends on the app's complexity and store requirements. Aim for an outcome rather than a number of days: key scenarios pass on a range of devices and there are no critical crashes.
