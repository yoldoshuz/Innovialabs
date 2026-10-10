---
title: Figma for Beginners: Interface and First Layout
description: Figma from scratch: frames, layers, shapes, text, constraints and sharing, ending with a simple mobile screen you build step by step.
summary: Figma is a browser-based interface editor where everything is built from frames, shapes and text, and once you know these plus layers, constraints and the Share button, you can build your first mobile screen in an evening.
---

## The short answer

**Figma** is a tool for designing interfaces: websites, apps, presentations. It runs in the browser and as a desktop app, files live in the cloud, and several people can work on the same design at once.

To get started you only need an account, a new **Design file** and a handful of core concepts. Here's everything you need for your first layout.

## The interface in a minute

- **Canvas**: the infinite area in the middle where you draw.
- **Toolbar**: frame, shapes, pen, text, comments.
- **Left panel**: the file's pages and the layer tree.
- **Right panel**: properties of the selected object, such as size, color, font and spacing. The **Prototype** tab handles transitions between screens.

Hold the space bar to pan around the canvas, and use Ctrl (Cmd on Mac) with the mouse wheel to zoom.

## Frames: the foundation

A **Frame** is a container, usually a screen or a block of UI. Press **F** to select the tool. The right panel then shows ready-made sizes for phones, tablets and desktop.

How a frame differs from a rectangle:

- you can place other objects inside it;
- it supports **constraints** for its children, **layout grids** and **auto layout**;
- it can clip content to its bounds.

Frames can be nested: screen, then card, then button.

## Layers and groups

Every object is a **layer** in the left panel. Layer order decides what sits on top.

- **Ctrl/Cmd + G**: group the selection.
- **Ctrl/Cmd + Alt + G**: wrap the selection in a frame.
- Double-click a layer name to rename it.

Give layers meaningful names ("header," "button-primary") instead of leaving "Rectangle 47." It saves time for you and for the developer.

## Shapes and text

- **R** for rectangle, **O** for ellipse, **L** for line, **P** for the pen tool to draw custom paths.
- **T** for text. A click creates a single line; dragging creates a fixed-width text box.

In the right panel you set **Fill**, **Stroke**, corner radius, and shadows or blur under **Effects**. For text you set font, size, line height and alignment.

Save repeated colors and fonts as **styles** or **variables** so you can change them in one place later.

## Constraints: how elements react to resizing

**Constraints** define which side of the parent frame an object is pinned to. For example:

- a button at the bottom pinned to **Bottom** stays at the bottom edge when the screen gets taller;
- a header set to **Left & Right** stretches across the full width when the screen gets wider.

It's easy to check: select the frame and drag its edge to see how elements behave.

## Collaboration and Share

The **Share** button in the top right opens access to the file. You can invite someone by email or copy a link and choose permissions: **can view** or **can edit**. Teammates leave comments directly on the canvas (press **C**), and developers can inspect sizes and spacing.

## Practice: your first mobile screen

Let's build a simple sign-in screen.

1. Press **F** and pick a phone size in the right panel, for example 390 × 844. Rename the frame "Login."
2. Press **T** and type the heading "Sign in." Make it large and bold.
3. Draw a rectangle (**R**) for the input field: almost full width, about 48 high, corner radius 8, light gray stroke. Add placeholder text "Email" inside.
4. Duplicate the field (**Ctrl/Cmd + D**) and change the placeholder to "Password."
5. Make a button: a rectangle of the same width with a bright fill and white "Sign in" text centered on it. Select both layers and press **Shift + A** to turn them into an **auto layout** button that adapts to its text.
6. Align everything to the left and keep equal spacing between elements; the pink smart guides help while dragging.
7. Set constraints: **Left & Right** for the heading and fields, and **Left & Right** plus **Bottom** for the button if you want it pinned to the bottom.
8. Click **Share**, copy a view-only link and send it to get feedback.

## Common beginner mistakes

- Drawing screens directly on the canvas without a frame.
- Leaving layers unnamed and ungrouped.
- Eyeballing spacing so it's different every time.
- Using ten shades of the same color instead of styles.
- Ignoring constraints and auto layout, then moving everything by hand after a resize.

## FAQ

### Do I need to pay for Figma to get started?

For learning and personal projects the free plan is usually enough. Plans and limits change, so check the current terms on Figma's official website.

### What's the difference between a frame and a group?

A group simply bundles objects and has no properties of its own. A frame is a standalone container with its own size, background, constraints for its children, layout grids and auto layout.

### What should I learn after the basics?

Next up are **auto layout**, **components** and their variants, and then simple prototyping: linking screens with transitions in the Prototype tab.
