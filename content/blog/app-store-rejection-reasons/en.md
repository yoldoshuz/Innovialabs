---
title: Common App Store and Google Play Rejection Reasons and How to Fix Them
description: Crashes, incomplete info, login walls, payments outside the store, privacy gaps and minimum functionality: how to fix each rejection and how to appeal.
summary: Most rejections come from crashes, missing demo access, wrong payment flows, privacy issues and thin functionality; nearly all of them are prevented by a pre-submission checklist and fixed with a precise, polite reply to the reviewer.
---

## The short answer: why apps get rejected

Rejections are rarely random. Apple and Google reject apps for the same groups of reasons:

- the app **crashes or does not work** for the reviewer;
- the reviewer **cannot log in** or reach the core features;
- digital goods are sold **outside in-app purchases**;
- **privacy**: no policy, inaccurate data declarations, unnecessary permissions;
- the app is **too thin** or just repeats a website;
- the **metadata** does not match the app.

The rejection message always cites a guideline. Start there, not with rewriting code.

## Reasons and fixes

| Reason | How to fix it |
|---|---|
| Crash or freeze on launch | Test the release build on a clean device and the latest OS, add crash reporting |
| Placeholders, "coming soon", broken links | Remove unfinished screens or hide them behind a feature flag |
| No access for the reviewer | Provide a working demo account with data; in Google Play fill in App access |
| Digital content sold outside the store | Use StoreKit and Google Play Billing for subscriptions and digital goods |
| Missing or empty privacy policy | Publish a page describing the data collected, purposes and contacts |
| Data declarations do not match reality | Check App Privacy and Data safety against every SDK in the project |
| Account cannot be deleted | Add in-app account deletion if users can sign up in the app |
| Minimum functionality | Add value a website lacks: offline mode, push, native features |
| Screenshots and description misrepresent the app | Show real screens, no third-party brands or empty promises |

## Apple specifics

- **Guideline 2.1 (App Completeness)**: the most common group, covering crashes, bugs and missing demo access. Run the build through TestFlight before submitting.
- **Guideline 4.2 (Minimum Functionality)**: a website wrapper with no value of its own.
- **Guideline 3.1.1 (In-App Purchase)**: unlocking digital features or content must go through in-app purchase. Physical goods and real-world services use regular payment methods.
- **Guideline 4.8 (Login Services)**: if the only logins are third-party social accounts, Apple may require an additional privacy-focused option such as Sign in with Apple.
- **Guideline 5.1.1**: data collection, meaning justified permission requests, clear `Info.plist` usage strings and account deletion.

## Google Play specifics

- **Data safety**: the Play Console form must match the behavior of the app and its SDKs.
- **Permissions**: SMS, call log, background location and all-files access need a separate justification and fit only specific use cases.
- **Target API level**: Google regularly raises the minimum target API level for new apps and updates.
- **Payments**: Google Play Billing applies to digital goods.
- **Deceptive behavior**: hidden features, fake buttons, functionality that differs from the listing.

## How to reply and appeal

1. **Read the full guideline**, not just the reviewer's message.
2. If the reviewer made a mistake, **reply in Resolution Center** (App Store Connect) or file an **appeal** in Play Console: brief, factual, with screenshots or a video.
3. If demo access or clarification is needed, **add it to the review notes** and resubmit.
4. If you disagree with an Apple decision, the **App Review Board** handles formal appeals.
5. Do not argue emotionally and do not resubmit the same build unchanged.

## Pre-submission checklist

- The release build is tested on a real device.
- The demo account works and does not expire.
- The privacy policy opens and is up to date.
- Data declarations cover all SDKs.
- Every requested permission is actually used.
- Digital purchases go through the store.
- Account deletion is available inside the app.

## FAQ

### How many times can I resubmit after a rejection?

There is no hard limit, but resubmitting without fixes slows everything down. Fix the cause, explain the changes in the review notes, then resubmit.

### Can Google remove an app that is already published?

Yes. If an app violates the policies, Google can reject an update, suspend or remove the app, and restrict the developer account after repeated violations. Watch the notifications in Play Console.

### Do I have to use in-app purchases for a subscription?

For digital content and features used in the app, generally yes. For physical goods and real-world services, no. Rules for specific categories and regions change, so check the current guidelines of both stores.
