---
title: Chrome DevTools Guide for Web Developers
description: How to use the Elements, Console, Network, Performance, Application and Lighthouse panels in Chrome DevTools through real debugging scenarios.
summary: Chrome DevTools is a toolkit built into the browser: Elements for layout, Console for errors, Network for requests, Performance for speed, Application for storage and Lighthouse for audits.
---

## What DevTools is and how to open it

**Chrome DevTools** is the set of developer tools built into Chrome and other Chromium-based browsers. Open it with **F12**, **Ctrl+Shift+I** (**Cmd+Option+I** on macOS), or by right-clicking and choosing "Inspect".

Learn the **Command Menu** right away: **Ctrl+Shift+P** (**Cmd+Shift+P**). It lets you find any feature by name — take a screenshot, disable JavaScript, switch the theme.

Below are six panels that cover most tasks, each with a concrete scenario.

## Elements: markup and styles

Shows the live DOM and the CSS rules applied to it.

**Scenario: a button has drifted to the right.**

1. Pick the element with the inspector (the arrow icon or **Ctrl+Shift+C**).
2. In **Styles**, see which rules apply and which are struck through — those were overridden by a more specific rule.
3. In **Computed**, check the final `margin`, `width` and `display`.
4. For flex and grid containers, toggle the overlay via the badge next to the element to see grid lines right on the page.

Edits in Styles last only until reload, which makes them handy for experiments.

## Console: errors and quick checks

Shows JavaScript errors, warnings and your `console.log` output.

**Scenario: a form does not submit.**

- Find the red error and click the link on the right — it opens the exact line in the source.
- Select an element in Elements, then type `$0` in the console to get a reference to it.
- `console.table(array)` displays arrays of objects neatly.
- The level filter (Errors, Warnings) removes noise.

## Network: requests to the server

Shows every request: status, size, timing, headers and response body.

**Scenario: data does not appear on the page.**

1. Open Network and reload the page.
2. Filter by **Fetch/XHR**.
3. Find the request and check its **status**: 4xx means a problem with the request or permissions, 5xx means a server-side problem.
4. Check what was sent in **Payload** and what came back in **Response**.
5. A CORS error shows up in the Console, and the request itself is marked as failed in Network.

Useful options: **Disable cache** to see the page as a first-time visitor, and **Throttling** to emulate a slow network. Right-click a request and choose **Copy as cURL** to replay it from a terminal.

## Performance: why it is slow

Records everything the browser does: script execution, layout, paint.

**Scenario: scrolling is janky.**

1. Start recording, reproduce the problem, stop.
2. On the **Main** track, look for long tasks — they have a red corner.
3. Click a task: **Bottom-Up** or **Call Tree** shows which function took the most time.
4. Repeated purple Layout blocks right after a script are a sign of layout thrashing.

Turn on **CPU throttling** for honest measurements: a powerful laptop hides the problems of slower phones.

## Application: storage and cache

Shows cookies, localStorage, sessionStorage, IndexedDB, Service Workers and Cache Storage.

**Scenario: a user still appears logged in after logging out.**

- In **Cookies**, check whether the session cookie was removed, and look at its `HttpOnly`, `Secure`, `SameSite` flags and expiry.
- In **Local Storage**, check whether a token was left behind.
- **Clear site data** in the Storage section resets everything for the current site.
- In **Service Workers**, you can unregister an old worker that keeps serving a cached version.

## Lighthouse: automated audit

Checks performance, accessibility, best practices and SEO.

**Scenario: you need to know where to start optimizing.**

- Run it in an incognito window so extensions do not skew results.
- Look beyond the score at **Diagnostics** and the specific recommendations.
- Compare reports before and after changes under the same conditions.

Lighthouse is a lab measurement. Real user experience can differ, so check field data too when it is available. The full feature list is in the [official documentation](https://developer.chrome.com/docs/devtools).

## Common mistakes

- Fixing styles in Elements and forgetting to move the changes into code.
- Measuring speed with cache enabled on a fast connection.
- Ignoring Console warnings until they turn into errors.
- Judging a site only by its Lighthouse score without analyzing causes.

## FAQ

### Do other browsers have DevTools?

Yes. Edge, Opera and other Chromium-based browsers have almost the same set. Firefox and Safari have their own tools with similar panels but a different interface.

### Can I debug the mobile version of a site?

Yes. The **Device Toolbar** (**Ctrl+Shift+M**) emulates screen sizes and touch. For a real Android device, there is remote debugging via `chrome://inspect` over USB.

### Is it risky to change things in DevTools?

No. Changes apply only in your browser and disappear after reload. The server and other users never see them — which is also why DevTools is no substitute for server-side validation.
