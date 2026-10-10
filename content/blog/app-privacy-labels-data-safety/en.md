---
title: App Store Privacy Labels and Google Play Data Safety: How to Fill Them
description: What data you must declare in the App Store and Google Play, how third-party SDKs affect answers, privacy manifests and the account deletion requirement.
summary: In both forms you declare what data the app and all its SDKs collect, why, and whether it is shared with third parties. Answers must match the app's real behavior and privacy policy, or the store may reject updates or remove the app.
---

## The short answer

- **App Privacy** (privacy labels, "nutrition labels") in App Store Connect powers a section on your App Store page showing what data is collected and whether it is linked to the user's identity.
- **Data Safety** in Google Play Console is the equivalent on your Google Play page: what data is collected, what is shared, whether it is encrypted and whether it can be deleted.

The developer fills in both forms and is responsible for their accuracy. Stores compare the answers with the app's behavior, and users and journalists compare them with real network traffic.

## What must be declared

Both forms ask about **data types** and the **purposes** they are used for.

| Data type | Examples |
|---|---|
| Contact info | Name, email, phone, address |
| Identifiers | User ID, device advertising ID |
| Location | Precise or approximate |
| Financial | Payment info, purchase history |
| User content | Photos, messages, files |
| Usage | Taps, screen views, search |
| Diagnostics | Crashes, performance |

Purposes include app functionality, analytics, personalization, advertising, fraud prevention and others.

Key terminology differences:
- **Apple** asks whether data is **linked to the user** and whether it is used for **tracking** — combining it with other companies' data for advertising. If you track, you need an **App Tracking Transparency** prompt.
- **Google** separates **collection** from **sharing** with third parties. Transfers to a service provider acting on your behalf usually do not count as sharing — check the definitions in the Play help center.

## How SDKs affect your answers

The form describes **the whole app**, including third-party code. Analytics, crash reporting, ads, social sign-in and payment SDKs all collect data, even if your own code sends nothing.

Steps to follow:
1. List every SDK in your dependencies.
2. For each, find the App Store and Google Play data disclosure section in its docs — major vendors publish one.
3. Account for configuration: disabling advertising ID or IP collection changes the answers.
4. Inspect real traffic through a proxy when the documentation is vague.

## The iOS privacy manifest

A **privacy manifest** (`PrivacyInfo.xcprivacy`) is a file in the app and in SDKs that describes collected data, tracking domains and the reasons for using certain system APIs (**required reason APIs**, such as UserDefaults or file timestamps).

- Commonly used third-party SDKs on Apple's list must ship their own manifest and signature.
- Xcode can generate a **privacy report** from all manifests in an archive — a handy starting point for your labels.
- Missing reasons for required reason APIs lead to warnings or rejected uploads in App Store Connect.

## Account deletion

If users can **create an account** in your app, both platforms require a way to **delete** it:
- **Apple** — deletion must be initiated inside the app, not only by emailing support.
- **Google Play** — you need an in-app deletion path and a **web link** where users can request deletion without installing the app. The link goes into the Data Safety form.

Deletion means deleting data, not just deactivating the account. If some data must be retained by law, say so.

## Consequences of inaccurate disclosures

- Updates rejected until the form is corrected.
- A deadline to fix the declaration.
- Removal of the app, and for repeated violations, action against the developer account.
- Lost user trust if outsiders find the mismatch.

Review both forms whenever you add an SDK or a feature that touches data.

## FAQ

### Do I need to fill in the forms if the app collects nothing?
Yes. Both stores let you declare that, but the section still has to be completed. Check your SDKs first — "collects nothing" is rarer than it seems.

### Do crash reports count as data collection?
Usually yes — they are diagnostic data if they leave the device for a server. Declare them under analytics or app functionality according to the store's definitions.

### How often should privacy labels be updated?
Whenever data collection changes: a new SDK, a new feature, a different analytics vendor. Making the form review a release checklist item works well.
