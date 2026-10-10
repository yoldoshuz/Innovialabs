---
title: How to Build a Design System From Scratch
description: A step-by-step roadmap for building a design system: interface audit, foundations and tokens, core components, documentation, governance and team adoption.
summary: Build a design system in stages: audit the current interface, define foundations as tokens, create core components, document when to use them and set clear rules for change. Without adoption by the team, even a perfect library stays a dead file.
---

## The short answer

A design system is not a button library in Figma. It is an agreement between design and engineering: shared **tokens**, **components** that exist in both design files and code, **documentation**, and a **process** for changing all of it. Do not start by drawing components. Start by auditing what already exists and by picking one real problem the system should solve.

A workable sequence:

1. Interface audit.
2. Foundations and tokens.
3. Core components.
4. Documentation.
5. Governance: who approves changes and how.
6. Adoption across the product and the team.

## Step 1. Audit the interface

Put screenshots of every screen into one file and group elements by type: buttons, inputs, headings, colors, shadows, icons. You will usually find several slightly different "blues" and a dozen buttons that differ by a couple of pixels.

Record the outcome:

- which elements repeat most often, since they go into the system first;
- which differences are accidental and which are justified by context;
- which components already exist in code and in which framework.

## Step 2. Foundations and tokens

**Foundations** are the base decisions everything else is built from: color, typography, grid, spacing, radii, elevation, motion. Store them as **design tokens** in two layers:

- **primitives** hold raw values (`violet-600`, `space-4`);
- **semantic tokens** hold meaning (`color-bg-primary`, `color-text-danger`, `space-inset-md`).

Components reference only the semantic layer. A dark theme or a new brand then means swapping values, not redrawing screens.

```json
{
  "color": {
    "violet": { "600": { "value": "#7C3AED" } },
    "bg": { "primary": { "value": "{color.violet.600}" } }
  }
}
```

## Step 3. Core components

Start with the 10 to 15 most frequent elements from the audit: button, text field, checkbox, select, link, status badge, card, modal, toast. For each one define:

- **variants** (primary, secondary, ghost) and **sizes**;
- **states**: default, hover, focus, active, disabled, loading, error;
- behavior with long text, with an icon and on mobile;
- accessibility requirements: contrast, visible focus, keyboard support.

The Figma component and the code component should share names and properties. Otherwise designers and developers end up speaking different languages.

## Step 4. Documentation

Documentation answers "when do I use this", not just "what does it look like". The minimum per component: purpose, do and don't examples, properties, states, accessibility notes and a link to the code. Storybook works well for code, paired with a guidelines page in Figma or an internal site.

## Step 5. Governance

A system survives only with a clear change process. Decide on:

- an **owner**, a person or small team accountable for the system;
- **how to propose** a new component or change (a request template);
- **acceptance criteria**, such as whether the pattern is used in several places;
- **versioning** and a changelog so products upgrade deliberately.

## Step 6. Adoption

The best way to drive adoption is to rebuild one real screen or one new feature with the system and show that the work went faster. Migrate the rest gradually rather than in a big bang. Listen to developers: an awkward component API kills a system faster than weak visuals.

## Common pitfalls

| Pitfall | Do this instead |
|---|---|
| Drawing components "for the future" | Include only what already repeats in the product |
| Colors with no semantic meaning | Add a semantic token layer |
| A system that lives only in Figma | Keep it in sync with code from day one |
| No owner | Assign one and define a change process |
| Documenting only visuals | Describe use cases and restrictions |

## FAQ

### When does a product really need a design system?

When more than one or two designers or several engineering teams work on the interface and identical elements start drifting apart. A small landing page is fine with a UI kit and a set of styles.

### Can we adopt an existing system instead of building our own?

Yes, open-source component libraries are a solid base. You will still need your own tokens, rules and documentation for your brand and product.

### How long does it take?

It depends on the number of products and platforms, the size of the audit and whether components already exist in code. Plan a first version with foundations and core components, then grow the system in iterations.
