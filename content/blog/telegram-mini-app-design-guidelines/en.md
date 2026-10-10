---
title: Telegram Mini App Design: Theme, Buttons and Native Feel
description: How to make a Mini App feel at home in Telegram: theme colors, viewport and safe areas, MainButton, haptics, fullscreen mode and fast loading.
summary: A Mini App feels native when it takes colors from the Telegram theme, respects safe areas, uses MainButton and BackButton instead of custom controls, adds haptic feedback and opens almost instantly.
---
## What makes a Mini App feel native

Users should not notice they opened a website. To get there, a Mini App:

- **takes its colors from the Telegram theme**, not entirely from your brand book;
- **respects the window size and safe areas** — notches, system bars, Telegram controls;
- **uses the built-in buttons** — MainButton, BackButton, SettingsButton;
- **responds with haptics** to important actions;
- **loads fast** and calls `Telegram.WebApp.ready()` right away.

All of this comes from the `window.Telegram.WebApp` object provided by the official `telegram-web-app.js` script.

## Theme colors

Telegram passes `themeParams` to your app — the colors of the user's current theme: `bg_color`, `text_color`, `hint_color`, `link_color`, `button_color`, `button_text_color`, `secondary_bg_color` and more. They are also exposed as CSS variables.

```css
body {
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
.card { background: var(--tg-theme-secondary-bg-color); }
.hint { color: var(--tg-theme-hint-color); }
```

Practical rules:

- **Backgrounds, text and hints** come from the theme only. Otherwise dark-theme users get a white flash.
- **Keep your brand in accents**: logo, illustrations, one or two branded surfaces.
- Listen to the `themeChanged` event — users can switch themes without closing the app.
- Set the header and window colors with `setHeaderColor()` and `setBackgroundColor()` so they match your first screen without a visible seam.
- Always provide **fallback values** for the CSS variables: opened in a regular browser, there is no theme.

## Viewport and safe areas

The Mini App window height changes as users drag the sheet or open the keyboard, so `100vh` is unreliable here.

- `--tg-viewport-height` is the current height and changes during animations.
- `--tg-viewport-stable-height` is the height after changes settle. Use it for elements pinned to the bottom.
- `expand()` opens the window to its maximum height — call it if your interface needs room.

**Safe areas** are the zones covered by device system elements and Telegram's own interface. There are two sets of insets:

- `--tg-safe-area-inset-*` — from system elements (notch, gesture bar);
- `--tg-content-safe-area-inset-*` — from Telegram controls drawn over your content.

```css
.screen {
  padding-top: calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px));
  padding-bottom: var(--tg-safe-area-inset-bottom, 0px);
}
```

This matters most in fullscreen mode: without insets, your header slides under the camera cutout.

## Buttons: MainButton and BackButton

**MainButton** is the large Telegram-style button at the bottom of the screen. Use it for the screen's primary action: "Checkout", "Pay", "Next".

```js
const tg = window.Telegram.WebApp;
tg.MainButton.setParams({ text: "Checkout", is_visible: true });
tg.MainButton.onClick(async () => {
  tg.MainButton.showProgress();
  await submitOrder();
  tg.MainButton.hideProgress();
});
```

- **One primary action per screen.** For a secondary one there is `SecondaryButton`.
- Disable the button (`disable()`) until the form is valid, and show `showProgress()` during requests.
- Use **BackButton** in the header instead of your own back arrow, and wire it to your router.
- Do not duplicate MainButton with a button in your layout — users end up with two identical buttons.
- Remove handlers with `offClick()` when switching screens, or one tap will fire several times.

## Haptic feedback

`HapticFeedback` makes the interface feel physical:

- `impactOccurred("light" | "medium" | "heavy" | "rigid" | "soft")` — taps and drags;
- `notificationOccurred("success" | "warning" | "error")` — the result of an action;
- `selectionChanged()` — a change of selection in a list or toggle.

Use it sparingly: confirmations, errors and selection. Vibrating on every tap gets tiring.

## Fullscreen mode

`requestFullscreen()` expands the Mini App to the whole screen — good for games, media and maps. Keep in mind:

- **safe areas** are mandatory, or content ends up under system elements;
- listen to `fullscreenChanged` and `fullscreenFailed` — not every client supports it;
- regular shops and forms usually do not need fullscreen.

If your app relies on vertical gestures (swipes, sliders), `disableVerticalSwipes()` prevents accidentally collapsing the window.

## Fast loading

Speed is the first impression. Checklist:

- call `ready()` **as early as possible**, once the first screen is rendered;
- show a **skeleton** in theme colors, not a blank white screen;
- keep the initial bundle small and lazy-load heavy screens;
- serve static assets from a CDN with caching;
- do not block the first screen on API calls — render the layout first, data second;
- test on an inexpensive Android phone and a slow network, not only on your laptop.

## Common mistakes

- Hard-coded white background and dark text.
- `100vh` and fixed blocks that jump when the keyboard opens.
- A custom "Back" button in the corner instead of BackButton.
- No version checks: before calling newer methods, use `isVersionAtLeast()`.

## FAQ

### Do I have to drop my brand colors entirely?

No. Take base surfaces and text from the Telegram theme, and use your brand color for accents, illustrations and, if you like, the MainButton via `setParams({ color })`.

### Why do newer methods fail for some users?

People run different versions of Telegram clients. Check `isVersionAtLeast()` and provide a fallback when a method is unavailable.

### How do I test the design without a phone?

Telegram Desktop and the web clients let you open a Mini App and enable debugging. Still, do the final check of safe areas, keyboard behavior and haptics on real iOS and Android devices.
