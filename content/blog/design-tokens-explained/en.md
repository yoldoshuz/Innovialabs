---
title: Design Tokens: What They Are and How to Structure Them
description: What design tokens are, how primitive, semantic and component tokens differ, how to name them and how to keep them in sync between Figma and code.
summary: Design tokens are named design values (colors, spacing, fonts) stored in one source and used in both Figma and code; they are built in three layers — primitives, semantics and components — so a theme or rebrand changes by editing a few references instead of hundreds of screens.
---

## The short answer

A **design token** is a name for a design value: `color.text.primary` instead of `#1F2937`, `space.4` instead of `16px`. Tokens live in a single source of truth and are turned into Figma variables, CSS custom properties, and iOS and Android resources.

Why it matters:

- **Consistency.** Designers and developers use the same names.
- **Theming.** Light and dark themes are different values for the same semantic tokens.
- **Controlled change.** A new brand shade is changed in one place and flows through the product.

## Three token layers

| Layer | What it holds | Example | Who uses it |
|---|---|---|---|
| **Primitive** (base, core) | Raw palette and scale values | `color.blue.600 = #2563EB` | Other tokens only |
| **Semantic** (alias) | The purpose of a value | `color.action.primary → color.blue.600` | Designers and developers in the UI |
| **Component** | Values for a specific component | `button.primary.bg → color.action.primary` | Code and the component library |

The key principle: **the interface references semantics, not primitives**. If a button uses `blue.600` directly, a dark theme or rebrand means hunting it down and changing it by hand.

The component layer is optional. It helps in large systems where a component needs to diverge from the shared semantics. Smaller products often get by with two layers.

## How to name tokens

A good name reads like a path from general to specific. A common scheme:

```text
{category}.{property}.{role}.{variant}.{state}

color.bg.surface
color.bg.surface.raised
color.text.secondary
color.border.danger
button.primary.bg.hover
space.inset.md
radius.control
```

Rules that prevent chaos:

- **Name by purpose, not appearance.** `color.text.danger`, not `color.red-text`. Red may become maroon; the purpose stays.
- **One segment order** across the whole system.
- **Predictable scales.** For sizes use `sm/md/lg` or a numeric scale, not a mix.
- **States at the end:** `hover`, `pressed`, `disabled`, `focus`.
- **No values in names.** `space.16` breaks the moment the value becomes 20.

## Format and example

JSON is a convenient storage format. A widely used convention is the W3C Design Tokens Community Group format, where each token has `$value` and `$type`, and references are written in curly braces:

```json
{
  "color": {
    "blue": {
      "400": { "$type": "color", "$value": "#60A5FA" },
      "600": { "$type": "color", "$value": "#2563EB" }
    },
    "action": {
      "primary": { "$type": "color", "$value": "{color.blue.600}" }
    }
  }
}
```

After a build step this becomes, for example, CSS custom properties with themes:

```css
:root {
  --color-blue-400: #60a5fa;
  --color-blue-600: #2563eb;
  --color-action-primary: var(--color-blue-600);
}

[data-theme="dark"] {
  --color-action-primary: var(--color-blue-400);
}
```

Components use only `--color-action-primary`, and the theme switches with a single attribute.

## Syncing Figma and code

A typical pipeline:

1. **In Figma**, tokens live as **Variables**: a primitives collection and a semantics collection with modes for light and dark themes. Semantic variables reference primitives through aliases.
2. **Export** to JSON via a plugin (such as Tokens Studio) or the Figma API, depending on your plan and process.
3. **The repository** holds the JSON as the source of truth. Changes go through pull requests, like code.
4. **The build** — a tool like Style Dictionary turns JSON into CSS variables, a Tailwind config, and iOS and Android resources.
5. **CI** checks that the build passes and that code contains no raw color values outside tokens.

The main decision is **where the source of truth lives**. If edits happen in Figma, code receives an export. If they happen in the repository, Figma syncs from it. Manual two-way editing almost always leads to drift.

## Common mistakes

- Using primitives directly in components.
- Hundreds of "just in case" semantic tokens nobody applies.
- Different names for the same thing in Figma and in code.
- A dark theme built as a separate set of primitives instead of new semantic values.
- No documentation of which token is for what.

## FAQ

### When does a product need design tokens?

As soon as there is a second theme, a second platform client or several people working on the interface at once. For one small site, well-named CSS variables are enough — and that is already the first step toward tokens.

### How are tokens different from Figma styles?

Styles describe ready-made property sets for mockups. Tokens are named values that live outside Figma and are used in code. Figma Variables are closer to tokens: they support aliases and modes and are easy to export.

### Do I need a component token layer?

Not always. It is justified when the component library is large and components need their own settings, for example in white-label products. Otherwise components can reference semantic tokens directly.
