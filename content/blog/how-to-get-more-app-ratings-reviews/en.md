---
title: How to Get More App Ratings and Reviews Without Breaking Store Rules
description: Native review APIs on iOS and Android, when to ask for a rating, replying to reviews, the ban on incentivized reviews and how to recover from a low rating.
summary: Ask for ratings only through native APIs (StoreKit on iOS, In-App Review on Android) right after a user succeeds at something, reply to reviews and fix what people complain about. Rewarding ratings or filtering out unhappy users is banned by both stores.
---

## The core rule

Three things bring more ratings: a **native in-app review prompt**, the **right moment** to show it, and **working with reviews** once they are published. Anything that looks like buying or filtering ratings breaks App Store and Google Play rules and can lead to removed reviews or action against the app.

## Native APIs: StoreKit and In-App Review

**iOS.** Apple requires the system API for rating requests — `requestReview` from StoreKit (in SwiftUI, `@Environment(\.requestReview)`). Custom pop-ups asking for an App Store rating are not allowed. The system decides whether to show the prompt and caps how often one user sees it per year. Calling the API is a request, not a guarantee.

**Android.** The Google Play In-App Review API shows a rating card on top of your app, so the user never leaves it. The flow looks like this:

```kotlin
val manager = ReviewManagerFactory.create(context)
manager.requestReviewFlow().addOnCompleteListener { task ->
    if (task.isSuccessful) {
        manager.launchReviewFlow(activity, task.result)
    }
}
```

The API has a display quota and does not tell you whether the user left a rating. So do not wire it to a "Rate us" button — the tap may show nothing. For a settings button, open the app's store page instead.

**Flutter and React Native** use the same system mechanisms through plugins such as `in_app_review`.

## When to ask

Timing matters more than wording. Ask after a **positive experience**, not at launch:

- an order was delivered, a payment went through, a task was completed;
- the user has come back several times and finished the key flow;
- a level, workout or lesson was finished.

What to avoid:

- asking on first launch or right after install;
- asking in the middle of a task, such as on the payment screen;
- asking right after an error, a crash or a long loading screen;
- frequent repeats — system limits will cut them anyway.

Simple logic works: count successful actions and sessions, set a threshold, and skip the prompt if the current session had an error.

## What is not allowed

- **Incentivized reviews**: bonuses, discounts, in-game currency or unlocked features in exchange for a rating.
- **Review gating**: asking "Do you like the app?" first and sending only the happy users to the store. Google explicitly forbids asking questions before showing the review card, including questions about the user's opinion. Apple requires the system API.
- **Manipulation**: paid reviews, reviews from staff or friends on request, rating exchange services.
- **Pressure in copy**: "rate us 5 stars", or hints that a feature stays locked without a rating.

If you want feedback inside the app, build a separate "Report a problem" form that is not tied to the rating prompt.

## Replying to reviews

Both App Store Connect and Google Play Console let you reply to reviews. The effect on rating is indirect: users can update their rating once a problem is solved.

- Reply to negative reviews quickly and to the point, without template apologies.
- If the issue is fixed, say in which version.
- Do not argue, and never offer anything in exchange for changing a rating.
- Collect recurring complaints in your backlog — it is free user research.

## Recovering from a low rating

1. **Find the cause.** Group recent reviews by topic: crashes, payments, a specific feature, ads.
2. **Fix the main issue** and verify stability with your crash-free rate.
3. **Ship an update** and tell affected reviewers that the problem is resolved.
4. **Use store mechanisms.** In App Store Connect you can reset the summary rating when releasing a new version — do it only when the version is genuinely better. Google Play weights recent ratings more than old ones, so improvements show up over time.
5. **Return to the review prompt** through the native API after positive moments.

## FAQ

### Can I ask "Do you like the app?" before the rating prompt?

Not if the answer decides whether you show the rating prompt. That is review gating, and it is banned. You can ask about the experience separately, as long as it is not linked to the store rating.

### Why does the iOS rating prompt not appear?

The system limits how often it is shown and may skip it entirely. In development builds the prompt always appears but cannot submit a rating, and in TestFlight it does not appear at all.

### Can I delete a bad review?

No. You can only report reviews that break store rules, such as spam or abuse. Everything else is fixed only by improving the product and replying.
