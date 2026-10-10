---
title: ARIA Attributes Guide: When and How to Use Them
description: A practical ARIA guide: roles, states and properties, the first rule of ARIA, and correct patterns for modals, tabs, menus and live regions.
summary: ARIA tells assistive technologies an element's role, name and state but adds no behavior; use it only where no suitable native HTML element exists.
---
## What ARIA is and the main rule

**ARIA (Accessible Rich Internet Applications)** is a set of HTML attributes that tell screen readers what an element is and what state it is in. ARIA only changes how an element is **described** in the accessibility tree. It **adds no behavior**: it doesn't make an element focusable and doesn't handle keys.

**The first rule of ARIA:** if a native HTML element with the semantics and behavior you need exists, use it instead of ARIA.

```html
<!-- Bad: you must add tabindex, Enter and Space handling yourself -->
<div role="button" onclick="save()">Save</div>

<!-- Good: everything is built in -->
<button type="button" onclick="save()">Save</button>
```

Wrong ARIA is worse than no ARIA: it can give the screen reader false information.

## Three kinds of attributes

| Kind | What it describes | Examples |
|---|---|---|
| **Roles** | What the element is | `role="dialog"`, `role="tab"`, `role="alert"` |
| **Properties** | Stable characteristics and relationships | `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-controls` |
| **States** | What changes during interaction | `aria-expanded`, `aria-selected`, `aria-checked`, `aria-hidden` |

States must be **updated from JavaScript** whenever the interface changes — otherwise the screen reader announces stale information.

## The most useful attributes

- **`aria-label`** — names an element with no visible text, such as an icon button.
- **`aria-labelledby`** — takes the name from another element by `id`, such as a modal heading.
- **`aria-describedby`** — adds a description: a hint or an error message.
- **`aria-expanded`** — whether the related block is open: an accordion, a dropdown.
- **`aria-hidden="true"`** — hides an element from screen readers. Never put it on focusable elements.
- **`aria-current="page"`** — marks the current page in navigation.

## Pattern: modal dialog

Today the simplest option is the native `<dialog>` opened with `showModal()`: the browser makes the background inert and closes it on Esc.

```html
<dialog aria-labelledby="dlg-title">
  <h2 id="dlg-title">Delete the project?</h2>
  <p>This cannot be undone.</p>
  <button type="button">Cancel</button>
  <button type="button">Delete</button>
</dialog>
```

For a custom `div` dialog you need `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, moving focus inside on open, trapping focus, closing on Esc and returning focus to the trigger button.

## Pattern: tabs

```html
<div role="tablist" aria-label="Plans">
  <button role="tab" id="t1" aria-selected="true" aria-controls="p1">Monthly</button>
  <button role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">Yearly</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
<div role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
```

Keyboard behavior: **Tab** moves focus to the active tab and then into the panel, **arrow keys** switch tabs. Update `aria-selected` and `tabindex` on every switch.

## Pattern: menus and dropdowns

A common mistake is putting `role="menu"` on regular site navigation. The `menu` role is meant for desktop-style application menus and requires arrow-key handling. For navigation or a simple disclosure list of links, this is enough:

```html
<button type="button" aria-expanded="false" aria-controls="nav-list">Services</button>
<ul id="nav-list" hidden>
  <li><a href="/web">Websites</a></li>
  <li><a href="/mobile">Apps</a></li>
</ul>
```

When opening, set `aria-expanded` to `true` and remove `hidden`.

## Pattern: live regions

A **live region** announces changes that happen without moving focus: "Added to cart", "Saved", form submission errors.

```html
<div aria-live="polite" id="status"></div>
```

- **`aria-live="polite"`** — the screen reader finishes the current phrase, then announces the change. Right for almost every case.
- **`role="alert"`** (equivalent to `assertive`) — interrupts speech. Only for urgent errors.
- The region must **already exist in the DOM**, and only its text should change. An element inserted together with its text is often not announced.

## Common mistakes

- `aria-label` on a `div` or `span` with no role — many screen readers ignore it.
- `aria-hidden="true"` on a container that has buttons inside.
- A role without behavior: `role="button"` with no key handling.
- States not updated: `aria-expanded="false"` on an open menu.
- Duplication: `<button aria-label="Button Send">Send</button>` — the name should match the visible text.

Full patterns with keyboard behavior are described in the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).

## FAQ

### Do I need ARIA if I use React or Vue?

A framework doesn't change the rules. Use native elements, and for complex widgets rely on proven accessible component libraries or APG patterns.

### What is the difference between aria-label and aria-labelledby?

`aria-label` sets the name as a string in the attribute, `aria-labelledby` points to the visible text of another element. If suitable visible text exists, prefer `aria-labelledby`.

### How do I check that ARIA works correctly?

Automated tools like axe catch invalid attributes and roles, but real behavior can only be verified with a screen reader: NVDA, VoiceOver or TalkBack.
