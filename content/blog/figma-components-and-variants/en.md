---
title: Figma Components and Variants: How to Set Them Up
description: Main components, instances, variants, component properties and naming conventions in Figma, shown with a button and an input field, plus common setup mistakes.
summary: A Figma component is a main element whose copies (instances) update when you change it. Variants bundle states and sizes into one set, and component properties (text, boolean, instance swap) let you configure instances without detaching them.
---

## Components, instances and variants

- **Main component** — the source element. You edit it, and changes flow to every copy.
- **Instance** — a copy of a component in your design. You can change text, colors and other allowed things (these are **overrides**), but the structure stays linked to the main component.
- **Component set** — a group of related components, for example every button: primary and secondary, in several sizes and states.
- **Component properties** — settings shown in the right panel for an instance: switch variant, edit text, hide an icon, swap an icon.

Without components, each button is edited by hand, and a month later the file has ten slightly different buttons.

## Step 1: the main button component

1. Build the button with **Auto Layout**: text, icon, padding, Hug width.
2. Select the frame and press **Ctrl + Alt + K** (on Mac **Cmd + Option + K**) or click "Create component" in the toolbar.
3. Name it `Button`.
4. To create an instance, drag the component from the **Assets** panel or copy it while holding Alt.

Keep main components on a separate page, such as "Components", and use only instances in your screens.

## Step 2: variants

1. Select `Button` and click **Add variant** in the right panel. A set with a purple dashed border appears.
2. Add variant properties with meaningful names:

| Property | Values |
|---|---|
| `Type` | Primary, Secondary, Ghost |
| `Size` | S, M, L |
| `State` | Default, Hover, Pressed, Disabled |

3. Create a variant for each combination you actually need and style it.
4. In an instance you can now switch type, size and state from dropdowns.

You do not need every combination. If ghost buttons only come in size M, skip the rest.

## Step 3: component properties

Variants describe **appearance**; properties describe **content**. This cuts the number of variants dramatically.

- **Text** — bind the text layer to a `Label` property. The button label is edited right in the right panel.
- **Boolean** — a `Has icon` property shows or hides the icon. Without it you would double every variant.
- **Instance swap** — an `Icon` property lets you pick any icon from the library without digging into the button.

Create properties with "+" in the Properties section of the main component or set, then bind them to a layer using the button next to the relevant setting.

## Step 4: an input field

The same approach for `Input`:

- **Variants:** `State` = Default, Focus, Error, Disabled; add `Size` if needed.
- **Text properties:** `Label`, `Placeholder`, `Helper text`.
- **Boolean:** `Has helper`, `Has left icon`.
- **Instance swap:** `Left icon`.

The Error state changes more than the border color: it also shows error text with an icon so meaning is not carried by color alone. The Focus state should be clearly visible.

## Naming conventions

- Properties and values should be short and clear to developers: `Type`, `Size`, `State`, not "Variant 1".
- Shared properties have the same names across components: if the button has `State=Disabled`, so does the input.
- Use slashes to group items in Assets: `Form/Input`, `Form/Checkbox`, `Navigation/Tab`.
- Name the layers inside components too: `Label`, `Icon`, `Container`. It helps with overrides and handoff.
- Match names with code. If the code calls the variant `primary`, do not call it "Main" in Figma.

## Common mistakes

- **Detaching instances** for every tweak. A detached instance no longer updates. If a setting is missing, add a property to the main component.
- **Variants instead of properties.** Separate "with icon" and "without icon" variants for each size and type bloat the set. Use a Boolean.
- **Editing an instance instead of the main component** when the system design itself changes.
- **Components without Auto Layout** — they break when the text changes.

## FAQ

### How is a variant different from a separate component?

A variant is a component inside a set, linked to the others by shared properties. That lets you switch between them on an instance without swapping the element manually. Separate components are not linked this way.

### Will my instance overrides survive an update to the main component?

Usually yes: text, color and visibility overrides persist as long as the layer structure and names stay the same. If you rename or delete a layer in the main component, overrides on that layer may be lost.

### How do I share components with other files?

Publish the file with components as a library and enable it in your team's other files. Library changes then arrive in those files as updates you can accept.
