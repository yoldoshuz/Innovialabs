---
title: How to Turn a Website into a PWA: Manifest and Service Worker
description: A step-by-step guide to turning a site into a PWA: web app manifest, icons, service worker registration, caching strategies, offline page and testing.
summary: A site becomes a PWA with three things: HTTPS, a manifest file with name and icons, and a service worker that caches assets and serves an offline page without a network.
---
## What a website needs to become a PWA

A **PWA (Progressive Web App)** is a regular website that the browser can install like an app: with a home screen icon, its own window and the ability to work offline. Technically it needs three parts:

- **HTTPS** — service workers only run on secure connections (`localhost` is allowed during development).
- **Web app manifest** — a JSON file with the name, icons and launch settings.
- **Service worker** — a script that intercepts network requests and manages the cache.

Here are the steps in order.

## Step 1. Manifest and icons

Create `manifest.webmanifest` at the site root:

```json
{
  "name": "My Service",
  "short_name": "Service",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#7c3aed",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Link it in `<head>`:

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#7c3aed">
<link rel="apple-touch-icon" href="/icons/192.png">
```

What matters:

- **192 and 512 px icons** — the minimum set for installation in Chrome.
- **A maskable icon** — with safe padding so Android can crop it into a circle or rounded square without cutting the logo.
- **display: standalone** — the app opens without the address bar.
- **start_url** must sit inside the service worker scope.

## Step 2. Register the service worker

Put `sw.js` at the root: by default a service worker's scope is limited to the folder it lives in. Register it on the page:

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

Register after the `load` event so it does not compete with the main page load.

## Step 3. Caching strategies

Pick the strategy by resource type:

| Strategy | How it works | Good for |
|---|---|---|
| **Cache first** | Cache first, network only on a miss | Fonts, icons, hashed file names |
| **Network first** | Network first, cache when offline | HTML pages, data that must be fresh |
| **Stale-while-revalidate** | Serves cache instantly, refreshes in the background | Avatars, non-critical API responses |
| **Network only** | Network only | Payments, auth, POST requests |

## Step 4. Offline page

A minimal working service worker: cache the offline page on install, use network first for navigation with a fallback.

```js
const CACHE = 'app-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
```

`offline.html` should be self-contained: inline styles, no external dependencies.

For larger projects, instead of writing everything by hand, use **Workbox** — it provides strategies and cache versioning as ready-made modules.

## Step 5. Test installability

- Open Chrome DevTools → **Application**: the **Manifest** panel shows manifest errors, **Service workers** shows the worker status.
- In the same panel, enable **Offline** mode and check that the offline page appears.
- Run a **Lighthouse** audit — it points out what is missing for a PWA.
- Test on a real phone: Android and iOS behave differently, and on iOS installation goes through Share → Add to Home Screen.

## Common mistakes

- **sw.js in a subfolder** — the worker does not control other pages.
- **No cache version** — users see old files for ages. Rename the cache on release and delete old ones in `activate`.
- **HTML cached with cache first** — new site versions never reach users.
- **Caching responses with personal data** — on a shared device this is a leak.
- **The server caches `sw.js` for a long time** — serve it with `Cache-Control: no-cache`.

## FAQ

### Does a PWA have to work offline?

Full offline mode is not required, but even a simple offline page noticeably improves the experience: users see a clear message instead of a browser error.

### Can a PWA be published in app stores?

On Google Play, yes, via Trusted Web Activity. The App Store is harder: you usually need a native wrapper that meets Apple's guidelines.

### Will a PWA replace a mobile app?

For catalogs, customer accounts and content services, often yes. If you need deep device access or background work, a native app remains more reliable.
