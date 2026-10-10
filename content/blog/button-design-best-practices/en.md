---
title: Button Design in UI: Sizes, States and Labels
description: How to design interface buttons: primary, secondary and tertiary hierarchy, every interactive state, comfortable sizes and labels that say what happens.
summary: A good button shows its importance through hierarchy, reacts visibly in every state (hover, focus, pressed, disabled, loading), is big enough to hit and is labeled with a verb that names the result.
---

## What makes a button work

A button has one job: show that an action is available and make clear what happens after the click. To do that it needs four things:

- **Hierarchy** — the most important action stands out, the rest step back.
- **States** — the button visibly reacts to hover, keyboard focus, pressing and waiting.
- **Size** — it is easy to hit with a mouse or a finger.
- **Label** — a short verb phrase that names the result.

If any of these is missing, users hesitate, click the wrong thing or click twice.

## Hierarchy: primary, secondary, tertiary

| Level | How it looks | When to use |
|---|---|---|
| **Primary** | Filled, brand color, highest contrast | The main action of the screen: "Pay", "Create project" |
| **Secondary** | Outline or light tinted fill | Alternatives: "Save draft", "Preview" |
| **Tertiary** | Text only, no container | Low-priority actions: "Skip", "Learn more" |
| **Destructive** | Red or another warning color | Deleting or irreversible actions |

Rules that keep hierarchy readable:

- **One primary button per screen or section.** If everything is primary, nothing is.
- **Keep the order consistent.** In dialogs choose where the primary action sits and repeat it across the product. Native apps should follow their platform's convention.
- **Don't give "Cancel" the same weight as "Delete".** The safe option should not look like the dangerous one, and destructive actions need confirmation or undo.

## States every button needs

| State | What changes | Watch out for |
|---|---|---|
| **Default** | Base style | — |
| **Hover** | Background slightly darker or lighter | Desktop only; touch screens have no hover |
| **Focus** | Clearly visible ring or outline | Never remove the outline without a replacement |
| **Pressed** | Darker shade or slight scale-down | Confirms the tap instantly |
| **Disabled** | Lower contrast, no pointer cursor | Users need to know why it is disabled |
| **Loading** | Spinner, label like "Saving…" | Keep the width fixed and block repeat clicks |

A grey **disabled** button without explanation is frustrating: the user doesn't know what is missing. Often it's better to keep the button active and show validation errors on click, or to place a short hint next to it.

A minimal CSS baseline for focus and loading:

```css
.btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.btn[aria-busy="true"] {
  pointer-events: none;
  opacity: 0.8;
}
```

## Sizing

- **Touch targets.** Apple's guidelines recommend at least 44×44 pt, Material Design — 48×48 dp. The visible button may be smaller if the tappable area is extended around it.
- **A size scale.** Define two or three sizes (small, medium, large) in the design system and use only them instead of inventing a new height for every screen.
- **Padding.** Horizontal padding is larger than vertical; text never touches the edges.
- **Spacing.** Leave enough room between neighboring buttons so a finger doesn't hit the wrong one.
- **Width.** Full-width buttons work well for the main action of a mobile form. On wide desktop screens, avoid stretching a button across the whole layout.

## Writing labels

- **Start with a verb:** "Send invoice", not "Invoice".
- **Name the result, not the mechanism:** "Download report" is clearer than "Submit" or "OK".
- **Be specific in dialogs:** "Delete project" and "Keep project" instead of "Yes" and "No".
- **Keep it short:** usually one to three words.
- **Match the next step:** if the button says "Continue to payment", the next screen should be payment.
- **Use one capitalization style.** Sentence case is easier to read than ALL CAPS.
- **Icon-only buttons need a name.** Add an accessible label (`aria-label`) and ideally a tooltip.

## Common mistakes

- Several primary buttons competing on one screen.
- Links styled as buttons and buttons styled as links. A **button performs an action**, a **link navigates** somewhere.
- Removing the focus outline "because it looks ugly".
- Ghost buttons with a border so faint it disappears. WCAG asks for at least 3:1 contrast for the visual parts that identify a control and 4.5:1 for normal-size text.
- The button changes width when a spinner appears, and the layout jumps.
- Generic labels that hide consequences.

## FAQ

### Should I use disabled buttons in forms?

Sparingly. A disabled button hides the reason for the block. For short forms, it's usually better to keep the button active and highlight what needs fixing after the click. If you do disable it, show a hint about what is missing.

### What is the difference between a button and a link?

A button triggers an action on the current page: saves, sends, opens a dialog. A link takes the user to another page or URL. Using the correct element matters for keyboard users and screen readers, even if both look similar.

### How many button sizes does a design system need?

Most products manage with two or three sizes. More variants make the interface inconsistent and harder to maintain, so add a new size only when an existing one clearly doesn't fit.
