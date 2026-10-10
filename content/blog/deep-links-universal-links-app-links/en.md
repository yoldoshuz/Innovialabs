---
title: Deep Links in Mobile Apps: Universal Links and App Links Setup
description: URI schemes vs verified links, how to set up Universal Links and App Links, what deferred deep linking is, and how to test links from email, ads and chats.
summary: For reliable deep links, use regular https links verified by a file on your domain: Universal Links on iOS and App Links on Android. Keep URI schemes like myapp:// as a fallback.
---

## The short answer

A **deep link** opens a specific place inside the app instead of the home screen: a product, an order, a profile. There are two fundamentally different approaches.

| | URI scheme (`myapp://`) | Verified link (`https://`) |
|---|---|---|
| Example | `myapp://product/42` | `https://example.com/product/42` |
| App not installed | Error or nothing happens | The website opens |
| Who can intercept it | Any app registering the same scheme | Only the app verified by the domain |
| Support in chats and email | Often not clickable | Works like any link |

Bottom line: make **https** your primary link and keep the URI scheme for internal navigation and integrations.

## Universal Links on iOS

1. In Xcode, add the **Associated Domains** capability with the entry `applinks:example.com`.
2. Host the `apple-app-site-association` file (no extension) at `https://example.com/.well-known/apple-app-site-association`.
3. Handle the incoming URL in the app and route to the right screen.

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["TEAMID.com.example.app"],
        "components": [{ "/": "/product/*" }]
      }
    ]
  }
}
```

File requirements: **HTTPS with no redirects**, valid JSON, no authentication. Apple fetches the file through its CDN, so changes do not apply instantly.

## App Links on Android

1. In `AndroidManifest.xml`, add an intent filter with `android:autoVerify="true"`, the `https` scheme and your domain.
2. Host `assetlinks.json` at `https://example.com/.well-known/assetlinks.json`.

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.app",
    "sha256_cert_fingerprints": ["AA:BB:..."]
  }
}]
```

A common trap is the **certificate fingerprint**. With Play App Signing you need the SHA-256 of the app signing key from Play Console, not just your upload key. Otherwise links work in debug but not in the store version.

## Deferred deep linking for new installs

A **deferred deep link** covers users who do not have the app yet: they tap a link, land in the store, install, and on first launch arrive at the intended screen.

Neither iOS nor Android fully solves this natively:

- On Android you can pass parameters through the **Play Install Referrer API**.
- On iOS there is no direct mechanism. Teams usually rely on attribution and deep linking services (Branch, AppsFlyer, Adjust) or their own backend that matches the click to the first install.

For promos, referrals and ad campaigns, deferred deep links are close to essential: without them, a new user sees the home screen and loses context.

## How to test

- **iOS Simulator:** `xcrun simctl openurl booted "https://example.com/product/42"`.
- **Android:** `adb shell am start -a android.intent.action.VIEW -d "https://example.com/product/42"`, plus `adb shell pm get-app-links com.example.app` to check verification status.
- **Real channels.** Test the link everywhere users will come from:
  - **email** — email services wrap links in a click-tracking redirect, so the link opens in the browser. Associate the tracking domain with the app or disable wrapping for deep links;
  - **ads** — ad networks add redirects too;
  - **messengers and social apps** — in-app browsers (Instagram, Telegram and others) may open the website instead of the app.

Mind the iOS specifics: a link **pasted into the Safari address bar** will not open the app — only a tap does. Navigating to a link on the same domain also stays in the browser.

## Common mistakes

- The association file is served with a redirect or requires authentication.
- `assetlinks.json` contains the wrong certificate fingerprint.
- The app opens but ignores the path and shows the home screen.
- No fallback web page for people without the app.

## FAQ

### Do I still need a URI scheme with Universal Links and App Links?
Not necessarily, but it helps for jumps between your own apps, OAuth redirects and some SDKs. Use https for public links.

### Why does the link open the website even though everything is set up?
Usually it is a tracking redirect, a messenger's in-app browser or a cached association file. Test the raw link without wrappers and check the domain verification status.

### Can I build deferred deep links without third-party services?
Yes, but it requires your own backend to match clicks to installs, and on iOS the accuracy of that matching is limited. For marketing campaigns, teams usually choose an established service.
