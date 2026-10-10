---
title: Motion Design in UI: Principles, Timing and Easing
description: How to design UI motion: purposeful movement, duration ranges, easing curves, choreography, reduced-motion support and clear animation specs for developers.
summary: UI motion should explain what happened, not decorate: short durations, ease-out for entering, ease-in for exiting and one focal point at a time. Always respect the reduced-motion setting and hand animations to developers as tokens with exact parameters.
---

## The short answer

Good UI motion is **functional**. It shows where an element came from, where it went, what changed and that the system responded to an action. If a movement cannot be justified by one of those jobs, remove or simplify it. The basics: keep it quick, use natural deceleration, avoid several movements competing at once and provide an alternative for people who turned motion off in their system settings.

## Why motion at all

- **Feedback**: a press, loading, a successful save.
- **Orientation**: a screen transition shows where the user is in the hierarchy.
- **Continuity**: a card expands into a detail page, so it is clearly the same object.
- **Attention**: gently drawing the eye to a new notification or an error.
- **Brand character**: only on top of the above, never instead of it.

## Duration

There are no universal exact values, but there are working guidelines:

| Type of motion | Guideline |
|---|---|
| Micro-interactions: hover, press, toggle | around 100–200 ms |
| Small elements appearing: tooltip, menu | around 150–250 ms |
| Large transitions: modal, screen change | around 250–400 ms |
| Complex scenes, onboarding | longer, without blocking the interface |

How to choose:

- the **larger the distance** and area, the longer the animation;
- **exits** are usually slightly faster than entrances;
- motion on phones is shorter than on large monitors;
- frequent actions need the fastest animations because people see them hundreds of times.

## Easing

Real objects do not start or stop instantly, so **linear** motion looks mechanical. It fits opacity fades, infinite loaders and progress bars.

- **ease-out** (decelerating) for entering: the element arrives fast and settles softly.
- **ease-in** (accelerating) for leaving: the element speeds up and exits.
- **ease-in-out** for moving from one point to another within the screen.
- **spring** physics for gestures and dragging, where momentum matters.

In code, curves are defined with `cubic-bezier()`. Keep 3 or 4 named curves in your design system instead of ad hoc values in every file.

## Choreography

When several elements move, they need an order:

- **one focal point** at a time: the main movement leads, the rest supports;
- **stagger**: a small delay between list items shows their sequence, but the total duration must not grow without limit;
- **consistent direction**: elements enter and leave in a way that matches the navigation;
- **shared element**: a common element flows between screens and connects them.

## Reduced motion

Some people enable the reduce motion setting in their OS because animation causes discomfort or dizziness. Respect it: replace slides and scaling with a soft opacity change, and turn off parallax and autoplay.

```css
:root {
  --motion-fast: 150ms;
  --motion-base: 250ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

.panel {
  transition: transform var(--motion-base) var(--ease-out),
              opacity var(--motion-base) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .panel { transition: opacity var(--motion-fast) linear; }
}
```

## How to spec animation for developers

A "make it like this" video is not enough. For each animation specify:

1. **Trigger**: what starts it.
2. **Properties**: what changes and from which value to which (position, scale, opacity).
3. **Duration and delay**: in milliseconds or as a token.
4. **Easing**: a named curve or a `cubic-bezier`.
5. **Interruption**: what happens if the user taps again mid-animation.
6. **Reduced-motion variant**.

A Figma prototype or video conveys the feel; a parameter table conveys precision. Animate `transform` and `opacity` where possible, because browsers handle them more efficiently than changes to size and spacing.

## FAQ

### Does a B2B or admin interface need motion?

Yes, but restrained: feedback, smooth expansions, transitions. People spend hours in these tools, so decorative motion quickly becomes annoying.

### Why does an animation stutter when it looked smooth in the prototype?

Often heavy properties such as width, height or shadows are animated, or too many elements move at once. Switch to `transform` and `opacity` and reduce the number of parallel movements.

### Can I turn animation off completely for prefers-reduced-motion?

You can, but replacing movement with a soft opacity change is usually better: feedback and the sense of change remain, while the discomfort goes away.
