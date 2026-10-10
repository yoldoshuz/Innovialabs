---
title: Figma Variables and Modes for Themes and Brands
description: How to set up Figma color, number and string variables with modes for light and dark themes and multiple brands, and bind them to your components.
summary: Figma variables store color, number, string and boolean values, and modes give each variable several values. Split primitives, brands and themes into separate collections, bind components only to semantic variables, and switching a theme or brand becomes a single mode change.
---

## The short answer

A **variable** in Figma is a named value you can bind to a layer property. Variables live in **collections**, and a collection can have **modes**: the same `bg/surface` variable holds white in the Light mode and near-black in the Dark mode. Change the mode on a frame and everything inside it updates.

Variable types:

| Type | Stores | Binds to |
|---|---|---|
| Color | a color | fill, stroke, text color, effects |
| Number | a number | width, height, padding, gap, radius, stroke width, font size |
| String | text | text layer content, font family and weight |
| Boolean | true/false | layer visibility, boolean variant properties |

## Collection structure

The most common mistake is putting everything into one collection. A durable setup for theming and multi-brand work has three levels:

1. **Primitives**: the palette, with no modes: `violet/600`, `gray/50`, `space/4`. Hide these from publishing so designers do not use them directly.
2. **Brand**: one mode per brand (Brand A, Brand B). Variables like `brand/primary` alias different primitives.
3. **Theme**: Light and Dark modes. Semantic variables such as `bg/surface`, `text/primary`, `action/primary` alias Brand or Primitive variables.

Components bind **only to the semantic level**. Brand and theme then switch independently, so a frame can use Brand B + Dark.

## Setup, step by step

1. Open the Variables panel and create a Primitives collection. Use slashes for groups: `violet/100`, `violet/600`.
2. Create a Brand collection and add one mode per brand. For each value pick an alias to a primitive rather than a hex code.
3. Create a Theme collection with Light and Dark modes and fill the semantic variables with aliases.
4. Put numbers in their own collection, for example Density with Default and Compact modes, so spacing and radii can change together.
5. String variables help with localization: RU, EN and UZ modes show whether the layout survives long words.
6. Configure **scoping** to limit where a variable appears. A text color should not be offered for background fills, and spacing should not show up for radii.
7. Add **code syntax** for web, iOS and Android so developers see the code token name in Dev Mode.

## Binding to components

- Select a layer and click the variable icon next to a property: fill, padding, gap, radius.
- For text, bind size, line height and weight, not only color.
- Boolean variables pair well with component properties, such as showing an icon.
- Set the mode on a frame, section or page from the modes control in the right panel. Nested instances inherit the parent mode by default, and you can override it locally.

A quick test: build one screen, duplicate it and switch modes. Any color that stays "wrong" is a hard-coded hex instead of a variable.

## Common mistakes

- **Components bound to primitives.** A dark theme then means repainting by hand.
- **Names based on color instead of role.** `blue-button` breaks when the brand turns violet.
- **No tokens for states.** Hover, pressed and disabled need their own semantic variables.
- **Forgotten effects and strokes.** Shadows and dividers need their own dark-theme values too.
- **Drift from code.** Variable names in Figma and token names in code should match.

## FAQ

### How are variables different from styles?

A style stores a bundle of properties, such as a shadow or a gradient, while a variable stores a single value with modes and aliases. In practice you combine them, building styles from variables wherever that is supported.

### How many modes can I create?

The limit depends on your Figma plan. If you have many brands, check your plan's limits early and design the collection structure around them.

### How do developers get the variables?

Developers see bound variables and their code syntax in Dev Mode. Automated export to code tokens is done with plugins or the Figma API, and the right option depends on your plan and front-end build.
