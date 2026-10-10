---
title: UX Audit Checklist: How to Review a Website or App
description: A structured UX audit checklist covering navigation, content, forms, accessibility, mobile and trust, plus how to report findings and set priorities.
summary: A UX audit means walking through key user scenarios with a checklist for navigation, content, forms, accessibility, mobile and trust; log each issue with a screenshot, severity and recommendation, and fix whatever blocks the target action first.
---

## The short answer

A **UX audit** is an expert review of an interface for problems that stop people from reaching their goals. It does not replace testing with real users, but it quickly finds obvious barriers.

A working order:

1. **Define goals**: what users must be able to do (buy, submit a request, find information).
2. **Pick 3-5 key scenarios** and walk through them yourself on desktop and phone.
3. **Check each scenario against the checklist** below.
4. **Cross-check with data** if you have it: analytics, session recordings, support tickets.
5. **Write a report** with priorities.

## Navigation and structure

- Is it clear from the first screen what the product is and who it is for?
- Do menu labels describe content rather than internal company jargon?
- Do users always know where they are: active menu item, page title, breadcrumbs?
- Can key pages be reached in a few clicks?
- Does search handle typos and offer something useful when nothing is found?
- Is there a 404 page with a way back to home and search?
- Does the logo link to the home page?

## Content and visual hierarchy

- Is the primary action on each screen more prominent than secondary ones?
- Can headings and subheadings be scanned in a few seconds?
- Is the copy short, plain and specific instead of generic?
- Are prices, timelines and conditions visible before users start checking out?
- Do links look like links, and does non-clickable text avoid looking like a button?
- Are button, spacing and font styles consistent across pages?

## Forms

- Does the form ask only for what this step needs?
- Does every field have a visible label, not just a placeholder?
- Are required fields marked consistently?
- Do errors appear next to the field, in plain language, with a hint on how to fix them?
- Is entered data preserved after an error or going back?
- Does the right mobile keyboard open for phone, email and number fields?
- After submitting, do users see what happened and what comes next?

## Accessibility

- Is text contrast sufficient (WCAG level AA is a good target)?
- Can every interactive element be used with a keyboard, with visible focus?
- Do meaningful images have alt text?
- Is information conveyed by more than color alone?
- Does the page hold up when text is zoomed?
- Do icon-only buttons have accessible names for screen readers?

## Mobile

- No horizontal scrolling or clipped content?
- Are tap targets large enough and not crammed together?
- Can pop-ups be closed, and do they avoid covering the entire screen?
- Are key actions reachable without excessive scrolling?
- Do pages load acceptably on mobile networks?

## Trust

- Are there contacts, company details or an address that confirm the business is real?
- Does the site use HTTPS without browser warnings?
- Are delivery, return and payment terms easy to find?
- Are manipulative patterns absent: hidden fees, pre-checked subscriptions, fake countdown timers?
- Do reviews and portfolio examples look genuine and verifiable?
- Is a privacy policy linked near forms that collect personal data?

## How to report and prioritize

Each finding in the report is a separate card:

| Field | What to include |
|---|---|
| Where | Screen or page, scenario |
| Problem | What is wrong, with a screenshot |
| Why it matters | How it hurts the user |
| Severity | Critical / high / medium / low |
| Recommendation | A concrete proposed fix |

For prioritization, a simple **impact × effort** matrix works well:

- **High impact, low effort** — fix first (error messages, contrast, field labels).
- **High impact, high effort** — plan it (navigation overhaul, new checkout flow).
- **Low impact, low effort** — handle along the way.
- **Low impact, high effort** — postpone.

Treat as critical anything that **blocks the target action**: a form that does not submit, a button hidden on mobile, a payment that fails.

## FAQ

### How is a UX audit different from usability testing?

An audit is done by an expert using a checklist and principles; testing means watching real users complete tasks. Audits are faster and cheaper, while testing uncovers problems an expert may miss. They work best together: an audit before testing removes the obvious issues.

### Can a team audit its own product?

Yes, but fresh eyes matter: teams get used to their interface and stop seeing its flaws. Bring in a colleague from another department or run a cross-audit where everyone reviews someone else's screens.

### How often should you run a UX audit?

Sensible moments are before a major redesign, after significant product changes and when conversion metrics drop unexpectedly. Small checks of key scenarios are worth building into the regular release process.
