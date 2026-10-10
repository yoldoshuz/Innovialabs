---
title: Gestalt Principles in UI Design With Examples
description: Proximity, similarity, closure, continuity, figure-ground and common region: how Gestalt principles work in interfaces and how to fix typical layout mistakes.
summary: Gestalt principles describe how the brain automatically groups elements by distance, likeness, shared containers and direction. In UI they let users understand what belongs together and where to look without any extra hints.
---

## What Gestalt means in plain words

**Gestalt principles** are findings from the psychology of perception about how people assemble separate elements into a whole. We do not inspect every button individually; we instantly see groups, blocks and relationships. An interface either supports that or fights it.

Six principles show up in UI design all the time:

| Principle | Idea | Where you see it |
|---|---|---|
| **Proximity** | Things close together are related | Forms, cards, menus |
| **Similarity** | Things that look alike are the same type | Links, buttons, tags |
| **Closure** | The brain fills in what is missing | Icons, carousels |
| **Continuity** | The eye follows a line | Tables, steppers, lists |
| **Figure-ground** | We separate an object from its background | Modals, menus |
| **Common region** | A shared border or background groups items | Cards, settings sections |

## Proximity

Elements placed closer together are perceived as a group. It is the strongest principle and the one most often broken.

**Mistake:** in a form, a field label sits the same distance from its own input and from the input above. Users cannot tell which field "Phone" belongs to.

**Fix:** make the gap between a label and its field clearly smaller than the gap between label-plus-field pairs. Simple rule: spacing inside a group is smaller than spacing between groups.

## Similarity

Elements sharing color, shape or size are read as the same type with the same behavior.

**Mistake:** links and ordinary highlighted text use the same violet. Users click the text and nothing happens.

**Fix:** reserve a distinct visual cue for interactive elements and never use it for decoration. All primary buttons look the same, and so do all secondary ones.

## Closure

The brain completes unfinished shapes. That is why minimal icons made of a few strokes still work.

**UI example:** in a horizontal carousel the last card is cut off by the screen edge. Users understand the list continues and swipe.

**Mistake:** cards fit the screen exactly, so nothing hints at more content. Fix: keep part of the next card visible.

## Continuity

The eye moves along lines and alignments and expects elements on one line to be related.

**Mistake:** numbers in a table are center-aligned, so digits jump around and values are hard to compare.

**Fix:** right-align numbers, left-align text and keep a consistent grid. In steppers, connect steps with a line to show the sequence.

## Figure-ground

We always separate the main object from the surface beneath it. When the boundary is unclear, the interface feels flat and confusing.

**Mistake:** a dropdown menu is the same color as the page, with no shadow or border. It blends into the content underneath.

**Fix:** add a shadow, a border or a dimmed backdrop. For modals, the darkened overlay signals that only the dialog matters right now.

## Common region

Elements inside the same border or on the same background are perceived as a group, even if they are of different types.

**UI example:** in settings, each section is its own card: "Profile", "Notifications", "Security".

**Mistake:** borders around everything. When each item sits in its own box, grouping loses meaning and the screen gets noisy. Proximity and spacing often do the job without extra outlines.

## How to apply this in practice

- Start with **spacing**: set up a scale (for example 4, 8, 16, 24, 32) and use small values inside groups, larger ones between them.
- Run the **blur test**: squint or blur a screenshot. Groups and key elements should still read without the text.
- One visual cue, **one meaning**: link color, button shape, tag style.
- Use borders and backgrounds only where proximity is not enough.

## FAQ

### Which Gestalt principle matters most for UI?

In practice, proximity. Most problems with confusing forms and cards are solved by correct spacing, before you even touch color or type.

### Are Gestalt principles rules you must never break?

No, they describe how perception works. You can break them on purpose, for example to make an element stand out, as long as you know users will read it as separate from the group.

### How can I check that my grouping works?

Show the screen to someone for a few seconds and ask them to describe the blocks they saw. If their answer matches your intent, the structure reads well.
