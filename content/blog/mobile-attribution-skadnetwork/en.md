---
title: Mobile Install Attribution: MMPs, SKAdNetwork and Privacy Limits
description: How install attribution works, what App Tracking Transparency and SKAdNetwork changed, what is happening on Android and how to choose an MMP for your app.
summary: Attribution links an install to the ad that drove it. Android still offers the advertising ID and Install Referrer; on iOS, without ATT consent, you get aggregated and delayed SKAdNetwork data. An MMP combines these sources into one report.
---

## What attribution is and how it works

**Install attribution** answers one question: which ad brought the user who installed and opened the app. Without it you cannot tell which campaigns pay off.

The classic flow:

1. A user sees or clicks an ad. The ad network or an **MMP** (mobile measurement partner) records that touchpoint.
2. The user installs the app from the store.
3. On first launch, the MMP SDK sends device and install data.
4. The MMP matches the install to a touchpoint and credits the source, usually with a **last-click** model inside an attribution window.

Matching methods:

- **Advertising ID** — IDFA on iOS, GAID on Android. Precise, but depends on user consent.
- **Google Play Install Referrer** — Google Play hands the app the parameters of the link that led to the install. Precise for installs from Google Play.
- **SKAdNetwork / AdAttributionKit** — Apple's aggregated attribution without user identifiers.
- **Self-attributing networks** (Meta, Google Ads and others) tell the MMP themselves that an install is theirs.

## App Tracking Transparency

On iOS, the IDFA is available only if the user allows tracking in the system ATT prompt. Without consent, the IDFA comes back as zeros.

```swift
import AppTrackingTransparency

ATTrackingManager.requestTrackingAuthorization { status in
    // .authorized means the IDFA is available; otherwise it is not
}
```

What matters:

- `Info.plist` needs an `NSUserTrackingUsageDescription` text that honestly explains the purpose;
- do not show the prompt on the first screen; show it once the user understands the app's value. A custom explainer screen before the system prompt is fine, without pressure or deception;
- **fingerprinting** — identifying a device by IP, model and other signals — is banned by Apple regardless of the ATT answer.

Many users decline, so on iOS SKAdNetwork becomes the backbone of measurement.

## SKAdNetwork

**SKAdNetwork (SKAN)** is Apple's mechanism in which the system itself performs attribution and the ad network receives an anonymized report, a **postback**.

How it works:

- `Info.plist` lists the ad network IDs you work with under `SKAdNetworkItems`;
- after install, the app updates a **conversion value** — a number encoding user actions such as sign-up, purchase or a revenue range;
- the postback arrives with a delay and without user-level data;
- SKAN 4 sends up to three postbacks for different windows after install, with a fine value and a coarse value (low, medium, high);
- the level of detail depends on **crowd anonymity**: with low install volume you get less campaign data.

Usually the MMP SDK sets the conversion value according to a schema you configure in its dashboard. The real work is **designing that schema**: which early events best predict user value.

Apple is also developing **AdAttributionKit**, a newer framework that works alongside SKAdNetwork. Keep an eye on Apple's documentation.

## Android: advertising ID and Privacy Sandbox

- **GAID** is still available, but users can delete their advertising ID in settings, after which the app receives zeros.
- Apps targeting Android 13 and above must declare the `com.google.android.gms.permission.AD_ID` permission if they use the advertising ID.
- **Install Referrer** works independently of the advertising ID.
- **Privacy Sandbox on Android** is Google's initiative with APIs such as Attribution Reporting meant to replace advertising ID tracking. Its timeline and status have changed several times, so check current documentation and what your MMP supports.

## Choosing an MMP

Well-known providers include AppsFlyer, Adjust, Singular, Branch and Kochava. For Yandex ads and CIS audiences, teams often consider **AppMetrica**, which also offers install attribution.

| Criterion | What to check |
|---|---|
| Integrations | Support for your actual ad networks, including local ones |
| SKAN | How easy it is to set up the conversion value schema and reports |
| Raw data | Export of events to your own warehouse or BI |
| Fraud protection | Filtering bots and install hijacking |
| Deep links | Deferred deep links and onboarding links |
| Pricing | Per attributed install, per event or flat fee |
| SDK | Size, startup impact, compliance with store privacy requirements |

## Common mistakes

- Expecting MMP numbers to match App Store Connect and Play Console: they count differently.
- Leaving the conversion value schema unconfigured and getting empty SKAN reports.
- Starting data collection before consent where the law requires it.
- Not declaring tracking in the App Store privacy section and Google Play Data safety form.

## FAQ

### Do I need an MMP if I advertise through only one channel?

Not always. With a single network, its own analytics and SKAN reports may be enough at the start. An MMP becomes necessary when you run several channels and need to compare them in one place.

### Can I get around ATT by identifying devices with other data?

No. Apple explicitly bans fingerprinting, and it can get the app rejected or removed.

### Why does SKAdNetwork data arrive late?

The delay and aggregation are built in on purpose, so a postback cannot be tied to a specific user or the moment of their actions.
