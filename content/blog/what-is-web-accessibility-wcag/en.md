---
title: What Is Web Accessibility and the WCAG Standard
description: A plain explanation of web accessibility: who relies on it, the POUR principles, WCAG levels A, AA and AAA, and why businesses should care about it.
summary: Accessibility means everyone can use a site, including people with visual, hearing and motor impairments; WCAG is the international standard with testable criteria, and level AA is the usual target.
---
## In short: what accessibility is

**Web accessibility (a11y)** means an interface can be used regardless of limitations: without a mouse, without sight, with impaired hearing, with shaky hands, or in bright sunlight on a phone screen.

**WCAG (Web Content Accessibility Guidelines)** is an international standard from the W3C consortium. It defines testable criteria: how much text contrast is needed, how keyboard interaction should work, what to do with video and forms. The standard evolves in versions 2.0, 2.1 and 2.2, each one extending the previous.

## Who relies on accessibility

People often think only of blind users, but the group is much wider:

- **People with visual impairments** — use screen readers, magnification and high-contrast themes.
- **People with hearing impairments** — need captions and transcripts.
- **People with motor impairments** — navigate using only a keyboard, voice or assistive devices.
- **People with cognitive differences** — benefit from plain language, predictable navigation and no distracting motion.
- **Temporary and situational limits** — a broken arm, a child in one hand, a noisy street, a slow connection.
- **Older users** — often face several of these factors at once.

The key takeaway: an accessible interface is easier for everyone, not just one group.

## The four POUR principles

All WCAG criteria are grouped under four principles:

| Principle | Meaning | Examples |
|---|---|---|
| **Perceivable** | Information can be perceived by at least one sense | Alt text for images, captions, sufficient contrast |
| **Operable** | The interface can be operated in different ways | Keyboard support, enough time for actions, no flashing |
| **Understandable** | Content and behavior are predictable | Clear form errors, page language set, consistent navigation |
| **Robust** | The site works correctly with assistive technologies | Valid markup, correct roles and names for elements |

## Conformance levels A, AA and AAA

Each WCAG criterion belongs to one of three levels:

- **A** — the baseline. Without it some users cannot use the site at all. Example: images have a text alternative.
- **AA** — the working standard. It is what laws, tenders and corporate requirements most often reference. Example: normal text contrast of at least **4.5:1**.
- **AAA** — the highest level. It is rarely required for an entire site because some criteria cannot be met for all content. Example: contrast of at least **7:1**.

Levels are cumulative: to conform to AA you must meet all A and AA criteria.

## Why businesses should care

- **More customers.** If someone cannot check out with a keyboard or read faint text, they leave for a competitor.
- **Legal requirements.** Many countries regulate the accessibility of digital services by law, especially for the public sector, banking, transport and online stores. If you work with foreign markets or large clients, WCAG AA conformance may appear in the contract.
- **SEO and code quality.** Semantic markup, alt text and clear headings help search engines and AI search understand the page.
- **Better usability for everyone.** Good contrast, large buttons and clear forms reduce errors for all users.
- **Cheaper to build in early.** Fixing accessibility in a finished product usually costs more than planning it into design and markup.

## Where to start

1. Go through key user flows **with the keyboard only**: Tab, Shift+Tab, Enter, Space, Esc.
2. Check text and button **contrast** with any contrast checker.
3. Run an automated audit such as **Lighthouse** or **axe**. It catches some problems, not all.
4. Listen to the site with a **screen reader**: VoiceOver on macOS and iOS, NVDA on Windows, TalkBack on Android.
5. Add accessibility checks to design reviews and the task acceptance checklist.

The official standard text and quick references for each criterion are published by [W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/).

## Common misconceptions

- **"We don't have those users"** — you just don't see them in analytics because they could not use the site.
- **"An accessibility widget is enough"** — overlays don't fix problems in the code and can even interfere with assistive technologies.
- **"Accessible sites are ugly"** — WCAG does not ban bold design; it requires readability and operability.

## FAQ

### Which WCAG level should we target?

For most commercial and public sites the target is **WCAG AA**. Individual AAA criteria can be met where it is easy to do so.

### Can accessibility be tested with automated tools only?

No. Automation finds technical errors such as missing alt text and low contrast, but navigation logic, clarity of text and screen reader behavior must be checked manually.

### Is accessibility a one-time task?

No, it is part of the process. Every new page and component can break accessibility, so checks belong in design, development and testing.
