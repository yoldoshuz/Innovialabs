---
title: How to Make an Interactive Prototype in Figma
description: Build a clickable Figma prototype: flows, triggers, actions, transitions, Smart Animate, overlays and scrolling, then share and present it for testing.
summary: In Figma's Prototype tab you connect frames with interactions (trigger plus action plus animation), set a flow starting point, add overlays and scroll behavior, then share the prototype link with testers.
---

## The short answer

An interactive prototype in Figma is a set of frames linked by **interactions**. Each interaction has three parts: a **trigger** (what the user does), an **action** (what happens) and an **animation** (how it looks). You add them in the **Prototype** tab of the right panel, mark where the flow starts and press **Present**. No code is involved.

## Step 1. Prepare the frames

- Use top-level **frames**, not groups, for every screen.
- Pick a consistent frame size for the device you test (for example, a phone preset).
- Name frames clearly: `01 Home`, `02 Catalog`, `03 Product`. Names appear in the prototype and in links.
- Keep repeated elements (header, tab bar) as components, so changes apply everywhere.

## Step 2. Create a flow

A **flow** is a path through the prototype with a starting frame. Select the first screen, and in the Prototype tab add a **flow starting point**. One file can have several flows, for example "Sign-up" and "Checkout", each testable separately.

## Step 3. Connect screens with interactions

Switch to the Prototype tab, select a layer (a button, a card), and drag the connection handle to the target frame. Then set the details:

| Part | Common options | When to use |
|---|---|---|
| Trigger | On click / On tap, On drag, While hovering, While pressing, Mouse enter / leave, Key / Gamepad, After delay | Tap for most actions, hover for desktop states, after delay for splash screens |
| Action | Navigate to, Back, Scroll to, Open link, Open overlay, Swap overlay, Close overlay, Change to | Navigate for screens, Change to for component variants |
| Animation | Instant, Dissolve, Smart animate, Move in / out, Push, Slide in / out | Push and Slide for screen changes, Dissolve for subtle swaps |

Also choose **easing** and **duration**. Short durations with ease-out feel responsive; long animations make testing tedious.

Tip: add a **Back** action to a back arrow instead of linking to a specific frame, so it works from any path.

## Step 4. Use Smart Animate

**Smart Animate** finds layers with the **same name and hierarchy** in two frames and animates the difference in position, size, rotation, opacity and fill.

How to make it work:

1. Duplicate the frame.
2. Change the layer in the copy (move it, resize, fade it out).
3. Keep layer names identical in both frames.
4. Connect the frames with Smart Animate.

Good uses: expanding cards, toggles, tab indicators, onboarding carousels. If something "jumps" instead of moving, check layer names first.

For small state changes inside one element, use **interactive components**: create variants (Default, Hover, Pressed), connect them with **Change to**, and every instance becomes interactive.

## Step 5. Add overlays

**Overlays** show a frame on top of the current screen: modals, bottom sheets, dropdowns, toasts.

- Action: **Open overlay**, then pick the target frame.
- Set **position**: centered, top, bottom or manual.
- Enable **close when clicking outside** for modals and menus.
- Add a **background** dim to focus attention.
- Use **Swap overlay** to replace one overlay with another (step 1 to step 2 of a modal).

## Step 6. Set up scrolling

A frame scrolls in the prototype when its content is taller (or wider) than the frame and **clip content** is on.

- In the Prototype tab, set **overflow** to vertical, horizontal or both.
- For a long page, make the frame the device height and let content extend below it.
- For a horizontal carousel, put the cards in a nested frame with horizontal overflow.
- Set headers and tab bars to a **fixed** or **sticky** position so they stay in place while scrolling.
- Use **Scroll to** for anchor links like "Back to top".

## Step 7. Share and present for testing

- Click **Present** to run the prototype; choose the device frame and the flow.
- Use the **Share** button and give viewers access to the prototype; reviewers do not need edit rights.
- Testers can open the link in a browser or in the Figma mobile app to try it on a real phone.
- Hide hotspot hints during usability tests so participants explore on their own.
- Prepare a short **task script**: "Find a product and add it to the cart", not "Click the blue button".

## Common mistakes

- **Dead ends**: a screen with no way back. Walk every flow yourself before testing.
- **Mismatched layer names** breaking Smart Animate.
- **Prototyping everything**: link only the paths you actually test.
- **Wrong frame size**, so scrolling and fixed elements behave unpredictably.

## FAQ

### Can a Figma prototype replace a real app for testing?

For testing navigation, structure and copy, yes. It cannot reproduce real data, performance or complex logic, so test those later on a working build.

### Why does Smart Animate not animate my layers?

Most often the layers have different names or sit at different levels of hierarchy in the two frames. Make the names and nesting identical and try again.

### Do testers need a Figma account to open the prototype?

That depends on the file's sharing settings. With link access enabled for viewers, people can usually open the prototype in a browser; check the sharing options before sending the link.
