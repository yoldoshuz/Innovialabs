---
title: How to Publish an App on the App Store: Step-by-Step Guide
description: A step-by-step path: certificates and provisioning, App Store Connect setup, metadata and screenshots, build upload, review submission and phased release.
summary: You need an active Apple Developer Program membership, a signed build and a complete App Store Connect listing with screenshots and a privacy policy; once Apple approves it, you release immediately, on a date or in phases.
---

## The short answer: from Xcode to the App Store

Publishing on the App Store comes down to five steps:

1. **An account** in the Apple Developer Program (a paid annual membership).
2. **Signing**: a Bundle ID, a distribution certificate and a provisioning profile.
3. **An app record** in App Store Connect: name, description, screenshots, privacy details.
4. **Uploading a build** from Xcode or a CI pipeline.
5. **Review and release**: submit for review, then release manually, automatically or in phases.

The first release takes longer because of setup. After that, updates follow the same routine.

## Step 1. Certificates and provisioning

Apple needs proof that the build was signed by your team. That takes three things:

- **App ID (Bundle ID)**: a unique identifier such as `com.company.app`, created under Certificates, Identifiers & Profiles. It cannot be changed after release.
- **Apple Distribution certificate**: proves your team signed the build.
- **App Store provisioning profile**: ties the App ID, the certificate and enabled capabilities (push, Sign in with Apple, iCloud) together.

The easiest route is **Automatically manage signing** in Xcode, which creates the certificate and profile for you. Manual signing makes sense for CI and larger teams. A common mistake is losing the certificate's private key, so keep an exported `.p12` in your team's secure vault.

## Step 2. Set up App Store Connect

In App Store Connect go to **Apps → "+" → New App** and enter the platform, name, primary language, Bundle ID and SKU (an internal code users never see).

Then fill in:

- **App Information**: category, age rating questionnaire, privacy policy URL.
- **App Privacy**: what data the app and its third-party SDKs (analytics, ads, crash reporting) collect. Answers must match the app's real behavior.
- **Pricing and Availability**: price or free, and the countries where it is sold.

## Step 3. Metadata and screenshots

Each localization needs:

| Field | What matters |
|---|---|
| Name and subtitle | Short, no comma-separated keyword lists |
| Description | What the app does and who it is for |
| Keywords | Limited field, do not repeat the app name |
| Screenshots | Required for the mandatory iPhone display sizes (and iPad if supported) |
| Support URL | A working page with contact details |

Screenshots must show the actual app interface. Check App Store Connect Help for the current sizes, as Apple updates them from time to time.

## Step 4. Upload the build

1. In Xcode, pick a scheme with the Release configuration and the **Any iOS Device** destination.
2. Increment the **build number**, which must be unique for each upload.
3. Choose **Product → Archive**, then in Organizer **Distribute App → App Store Connect**.

The build is processed for a while and then appears in the TestFlight tab. Test it on real devices through TestFlight before submitting.

To automate uploads, fastlane works well:

```ruby
lane :release do
  build_app(scheme: "MyApp")
  upload_to_app_store(skip_screenshots: true, skip_metadata: true)
end
```

## Step 5. Review and phased release

On the version page, select the uploaded build and fill in **App Review Information**: contacts, notes for the reviewer and a **demo account** if the app has a login. Without working test credentials, a rejection is almost certain.

Answer the **export compliance** question (use of encryption) and choose how to release:

- **Manually release**: you press the button after approval.
- **Automatically release**: the version goes live right after approval.
- **Scheduled**: no earlier than a chosen date.

For updates you can turn on **Phased Release**: Apple gradually delivers the version to users with automatic updates over 7 days. You can pause the rollout if analytics or crash reports reveal a problem. Users who update manually get the version immediately.

## Common mistakes

- A missing demo account, or one with an expired password.
- A privacy policy link that does not open or does not mention the data collected.
- Screenshots made from mockups instead of real screens.
- A build number that was not incremented, so the upload is rejected.
- App Privacy answers that ignore third-party SDKs.

## FAQ

### How long does Apple's review take?

Usually from a few hours to a few days. It depends on the review team's workload and the app's complexity. After a rejection, the fixed build goes through review again.

### Can I publish an app without a Mac?

iOS builds are compiled and signed by Xcode, which runs only on macOS. Without your own Mac you can use cloud CI services with macOS machines, but a real Mac is still more convenient for debugging.

### How is TestFlight different from publishing?

TestFlight is beta testing: only invited testers get the build. External testing also goes through a short Apple review, but nothing is released publicly on the App Store.
