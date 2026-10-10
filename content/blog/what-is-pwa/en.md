---
title: What Is a PWA (Progressive Web App) and What It Can Do
description: PWAs in plain words: home screen install, offline mode, push notifications, iOS and Android limits, and which businesses benefit from the format.
summary: A PWA is a website you can install on a phone or computer like an app, open without the address bar and partly use offline; it costs less than two native apps but does not get full access to device capabilities.
---

## The short answer

A **PWA (Progressive Web App)** is a regular website with three additions:

- a **manifest** (`manifest.json`) — name, icons, colours and display mode, so the browser can offer installation;
- a **service worker** — a script that intercepts network requests, caches files and lets the app work without internet;
- **HTTPS** — required for service workers.

Once installed, a PWA sits on the home screen, opens in its own window without browser UI and updates itself on the next launch — no app stores involved.

## What a PWA can do

| Capability | How it works |
|---|---|
| Installation | Home screen icon, separate window |
| Offline mode | Service worker serves saved pages and data |
| Push notifications | Via the Push API, with user permission |
| Background work | Limited; sync depends on the browser |
| Device access | Camera, geolocation, clipboard, sharing — via web APIs |
| Updates | Instant, no store review |

## Offline mode in practice

The service worker decides where a response comes from: the network or the cache. Typical strategies:

- **Cache first** — for static files: fonts, icons, scripts.
- **Network first** — for data that must be fresh, with a cached fallback.
- **Stale-while-revalidate** — show the cached version immediately and refresh it in the background.

Minimal registration:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

Offline has to be designed: what to show without a connection, how to save an order or form and send it later. "Making a PWA" does not by itself mean the whole app works without internet.

## Limits on iOS and Android

**Android (Chrome and other Chromium browsers)** has the best PWA support: install prompts, push notifications, system integration. You can also publish a PWA to Google Play via a Trusted Web Activity wrapper.

**iOS and iPadOS** support PWAs with caveats:

- installation is manual only, via Share → Add to Home Screen; there is no automatic prompt;
- push notifications work only for PWAs added to the home screen and on relatively recent iOS versions;
- storage and background work are more restricted, and the system may clear data after long inactivity;
- some APIs available in Chrome are missing in Safari.

Platform policies change, so check current support for the features you need on target devices before you start.

## Which businesses benefit from a PWA

- **Online stores and catalogues** — fast repeat loads and a home screen icon without a store install.
- **Delivery and booking services** — ordering in a couple of taps, status notifications.
- **Internal company tools** — CRM, inventory, apps for couriers and field staff who need to work on poor connections.
- **Media and content** — reading saved materials offline.
- **MVPs** — test an idea on one codebase before investing in native apps.

A PWA is a weaker fit if you need complex Bluetooth or hardware work, heavy graphics, constant background processing, or App Store presence as an acquisition channel.

## Common mistakes

- **Caching everything** and then being unable to ship updates to users.
- **Not planning service worker versioning** — users get stuck on an old build.
- **Expecting Android behaviour on iOS** and discovering the limits after launch.
- **Asking for notification permission on first visit** — users decline more often.

## FAQ

### Can an existing website become a PWA?

Yes, if it runs on HTTPS. You add a manifest, icons and a service worker, then design the offline scenarios. The effort depends on how dynamic the site is.

### Will a PWA replace a native app?

For many tasks, yes: catalogues, ordering, customer accounts, internal services. If you need deep device integration or App Store presence, a native or cross-platform app remains the safer choice.

### Do search engines index PWAs?

Yes, it is a regular website with page URLs. Make sure content is reachable without JavaScript errors and rendered on the server where needed, as with any modern site.
