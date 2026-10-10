---
title: How to Publish an App on Google Play: Step-by-Step Guide
description: The step-by-step path to Google Play: Play Console setup, closed testing for new personal accounts, store listing, content rating, Data Safety and releases.
summary: Publishing on Google Play means a verified Play Console account, a signed AAB, completed declarations (rating, Data Safety, privacy policy), a store listing, testing tracks and a reviewed release; new personal accounts must pass closed testing first.
---

## The short answer

The path from a finished build to an app on Google Play looks like this:

1. Register a **Play Console** account and complete verification.
2. Create the app and prepare a signed **AAB**.
3. Fill in the **App content** section: privacy policy, rating, Data Safety and other declarations.
4. Set up the **store listing**.
5. Go through **testing tracks**. New personal accounts must run closed testing before getting production access.
6. Ship the release, wait for review and roll it out gradually.

## Step 1. Developer account

Choose an account type:

- **Personal** — for an individual developer. New personal accounts have a closed testing requirement (see below).
- **Organization** — for a company. You need a **D-U-N-S** number, and the store shows the company name.

Registration includes a one-time fee, email and phone confirmation, and identity or organization verification. Register with a company email rather than an employee's personal one, and give the team access through user management.

## Step 2. The build

- Format: an **AAB** signed with the upload key; Play App Signing signs what users receive.
- **applicationId** is unique and cannot change after publishing.
- **versionCode** increases with every upload.
- **targetSdk** meets the current Google Play requirement.
- Debug logs, test API addresses and stubs are removed.

## Step 3. App content

These declarations must be complete before a release can go to review:

- **Privacy policy** — a public page at a URL describing how data is actually handled.
- **App access** — if sign-in is required, give the reviewer a test account and instructions.
- **Ads** — whether the app contains ads.
- **Content rating** — the IARC questionnaire; regional ratings are assigned automatically from your answers. Answer honestly: mismatches lead to removal.
- **Target audience** — if it includes children, additional Families policy requirements apply.
- **Data Safety** — what data is collected and shared, why, whether it is encrypted in transit and whether it can be deleted. Account for every SDK: analytics, crash reporting, ads, payments.
- **Account deletion** — if users can create an account, they need a way to delete it both in the app and via a web link.
- **Sensitive permissions** — access to SMS, call logs, background location and similar data requires separate declarations with a justification.

## Step 4. Store listing

- **App name** up to 30 characters, **short description** up to 80, **full description** up to 4000.
- **Icon** 512×512 PNG, **feature graphic** 1024×500, phone screenshots and tablet ones if needed.
- **Translations** of the listing into your audience's languages: Russian, Uzbek, English.
- Category and contact email.

Avoid words like "best" or "#1", emojis and other brands in the name: metadata is reviewed under a separate policy.

## Step 5. Testing tracks

| Track | Purpose | Notes |
|---|---|---|
| Internal testing | quick team checks | a small tester list, builds available fast |
| Closed testing | testing with invited users | a required step for new personal accounts |
| Open testing | public beta | anyone can join from the store page |
| Production | all users | can be rolled out gradually |

**The rule for new personal accounts:** at the time of writing, you must run a closed test with at least 12 testers who stay opted in for at least 14 consecutive days, and only then apply for production access by answering questions about how the test went. The terms can change, so check the current ones in the [Play Console Help Center](https://support.google.com/googleplay/android-developer).

Recruit testers early, collect feedback and ship updates during the test: the application asks about it.

## Step 6. Release and review

- Create a production release, upload the AAB, add release notes and send it for review.
- **Review time** is usually from a few hours to a few days; first releases and new accounts take longer. Do not schedule a marketing launch for the day you submit.
- **Managed publishing** lets you decide when approved changes go live.
- **Staged rollout**: start with a small share of users, watch crashes and ANRs in Android vitals and expand. You can halt a rollout.

## Common reasons for rejection

- The reviewer cannot sign in because there is no test account.
- Data Safety does not match what the SDKs actually collect.
- The privacy policy is unavailable or generic.
- Sensitive permissions are requested without a declaration and a clear reason.
- Testers are recruited at the last minute, and the launch slips.

## FAQ

### How long does publishing from scratch take?

It adds up from account verification, the closed test for a personal account (at least two weeks) and release review. An organization account moves faster because the closed testing requirement does not apply to it.

### Personal or organization account?

If a company ships the app, use an organization account: the store shows the company name and no mandatory closed test is needed. A personal account suits individual developers.

### Is every update reviewed?

Yes, updates and store listing changes are reviewed too, usually faster than the first release.
