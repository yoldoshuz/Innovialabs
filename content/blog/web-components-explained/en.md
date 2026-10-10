---
title: Web Components Explained: Custom Elements and Shadow DOM
description: How custom elements, Shadow DOM, templates and slots work, how Web Components fit with React and Vue, and when native components are the right call.
summary: Web Components are browser standards for building your own HTML tags with isolated styles; they shine in design systems and widgets that must work in any framework.
---

## What Web Components are

**Web Components** are not a library. They are a set of browser standards that let you create your own HTML tag, such as `<price-tag>`, and use it like any built-in element. No framework is required.

The set has three parts:

- **Custom Elements** — register a tag and its behavior with a JavaScript class.
- **Shadow DOM** — an isolated subtree with its own styles that do not leak out and are not broken by global CSS.
- **Templates and slots** — markup blueprints and "windows" where the component's user inserts their own content.

## Custom Elements: your own tag in a few lines

An element is a class extending `HTMLElement`, registered with `customElements.define`. The name must contain a hyphen.

```js
class PriceTag extends HTMLElement {
  static observedAttributes = ["amount"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const amount = Number(this.getAttribute("amount") || 0);
    this.textContent = amount.toLocaleString("en-US") + " UZS";
  }
}

customElements.define("price-tag", PriceTag);
```

The main lifecycle hooks:

- `connectedCallback` — the element was added to the document;
- `disconnectedCallback` — it was removed (clean up listeners and timers here);
- `attributeChangedCallback` — an attribute listed in `observedAttributes` changed.

## Shadow DOM: style isolation

Shadow DOM creates a separate tree inside the element. Styles inside do not affect the page, and page styles barely affect it.

```js
class UiCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host { display: block; border-radius: 12px; padding: 16px; }
        ::slotted(h3) { margin: 0; }
      </style>
      <slot name="title"></slot>
      <slot></slot>
    `;
  }
}
customElements.define("ui-card", UiCard);
```

What matters in practice:

- **Inherited properties** (`color`, `font-family`) pass through, which is handy for theming.
- **CSS custom properties** (`--brand-color`) also cross the boundary — the main way to customize a component.
- For targeted styling from outside there is `::part()`, if the author marked an element with the `part` attribute.

## Templates and slots

The `<template>` tag holds markup that is not rendered until it is cloned. **Slots** decide where content passed into the component ends up:

```html
<ui-card>
  <h3 slot="title">Starter plan</h3>
  <p>Plan description</p>
</ui-card>
```

The heading lands in the named `title` slot, everything else in the default slot.

## Working with frameworks

Web Components run anywhere there is a DOM, with a few caveats:

| Aspect | What to keep in mind |
|---|---|
| Attributes | Always strings; pass complex data through properties |
| Events | The component dispatches a `CustomEvent`, the framework listens to it |
| React | Recent versions pass properties and events to custom elements better; older ones need wrappers |
| Vue, Angular, Svelte | Good support; sometimes you must declare which tags are custom |
| SSR | Shadow DOM renders on the client; Declarative Shadow DOM exists for the server, but tooling is still maturing |

For events leaving the component, use `bubbles: true` and `composed: true`, otherwise the event will not cross the Shadow DOM boundary.

## When Web Components make sense

**Good fit** when:

- you need a **design system** used by teams on different frameworks;
- you build an **embeddable widget** (chat, form, calculator) for other people's sites;
- components must live a long time without being tied to a framework version;
- the project is a CMS or server-rendered site where a heavy framework is overkill.

**Not the best choice** when the whole app already runs on one framework: its own components give you more convenient state, routing and SSR. For complex UIs, teams often use a light library on top of the standard, such as **Lit**, which removes manual rendering.

## Common mistakes

- Heavy work in the `constructor` instead of `connectedCallback`.
- Passing objects through attributes with `JSON.stringify`.
- Forgetting to remove listeners in `disconnectedCallback`.
- Missing accessibility: a custom button with no role, focus or keyboard handling.
- Calling `customElements.define` twice with the same name, which throws an error.

## FAQ

### Does every component need Shadow DOM?

No. A custom element can work without Shadow DOM, in which case global styles apply to it. Use Shadow DOM when isolation matters, for example in embeddable widgets.

### Can Web Components be used with React?

Yes. The component renders as a regular tag, data goes in through attributes or properties, and you react to actions by listening for `CustomEvent`s.

### Do search engines index content inside Shadow DOM?

Content passed through slots stays in the regular DOM and is the most visible. Keep SEO-critical text in the light DOM rather than generating it only inside the shadow tree.
