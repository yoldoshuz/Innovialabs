---
title: Form Design Best Practices for Web and Mobile
description: UX best practices for web and mobile forms: labels over placeholders, field order, input types, inline validation, required fields and shorter forms.
summary: A usable form asks only for what is necessary, gives every field a visible label above it, uses the right input types for mobile keyboards, and reports errors right after a field is completed, next to it, in plain language.
---

## The core rules

A form is where users pay for a result with their time and data. The less effort it takes, the more often people finish it.

- **Ask only for what you need.** Every field must be required for the current step.
- **A visible label above every field**, not just a placeholder.
- **One column** and a logical field order.
- **Correct input types** so phones open the right keyboard.
- **Errors appear promptly, next to the field, with a hint on how to fix them.**

## Labels and placeholders

A placeholder (the grey text inside a field) disappears as soon as the user starts typing. If it replaces the label, people forget what they are entering and can't tell fields apart when reviewing a filled form. Light grey text is also often hard to read.

| Approach | When to use |
|---|---|
| Label above the field | Always — it's the foundation |
| Placeholder | Only for a format example: "+998 90 123 45 67" |
| Helper text below | For requirements: "At least 8 characters" |
| Floating label | Acceptable if it stays visible after input |

Labels above fields work better than labels on the left: they are easier to connect with the field and don't break on narrow screens.

## Field order and grouping

- Put fields **in a single column** so the eye moves in a straight line and nothing is missed.
- Order from simple to complex and from familiar to personal: name first, then contacts, then details.
- Group related fields under headings: "Contact," "Delivery address," "Payment."
- Short related fields (city and postcode, card expiry) can share a row.
- Split a long form into steps with a progress indicator.

## Input types and autofill

The right `type`, `inputmode` and `autocomplete` save users more time than any visual trick.

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email">

<label for="phone">Phone</label>
<input id="phone" type="tel" autocomplete="tel">

<label for="code">SMS code</label>
<input id="code" inputmode="numeric" autocomplete="one-time-code">

<label for="name">First name</label>
<input id="name" type="text" autocomplete="given-name">
```

- `type="email"` and `type="tel"` open a keyboard with `@` or digits on phones.
- `autocomplete` lets the browser fill in saved data.
- For short lists of up to five or six options, radio buttons beat a dropdown.
- Don't split a phone number or date into several fields unless you must.

The full list of `autocomplete` values is in the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).

## Validation

- **Validate a field after the user leaves it**, not on every keystroke, or the error appears while they are still typing.
- Once the user starts correcting, clear the error as soon as the input becomes valid.
- Put the message **below the field**, in red **and** with an icon or text, so people with colour vision deficiency notice it too.
- The error text explains how to fix it: not "Invalid format" but "Enter an email like name@example.com."
- On submit with errors, move focus to the first invalid field.
- Be tolerant of formats: accept phone numbers with spaces, brackets and dashes, and normalize them yourself.

## Required fields

If almost all fields are required, mark the **optional** ones with "(optional)." If only a few are required, mark those. A lone asterisk isn't clear to everyone, so explain it at the top of the form.

## How to shorten a form

Example: a consultation request form.

| Before | After |
|---|---|
| First name, last name, middle name | First name |
| Email, phone, Telegram | One contact method of the user's choice |
| Company, job title, company size | Clarified on the call |
| City, country | Not needed for a request |
| Message (required) | Message (optional) |

Ask of each field: is it needed right now? Can it be collected later or detected automatically?

## FAQ

### Should the submit button be disabled until the form is complete?

Better not. Users can't tell why the button doesn't work or what they missed. Keep it active and, on click, show which fields need fixing.

### Does every form need a CAPTCHA?

Not necessarily. A visible CAPTCHA adds friction. Try invisible protection first: a hidden honeypot field, rate limiting and server-side checks.

### How many fields are acceptable?

There is no universal number. The guideline is only the fields without which the next step is impossible. If a form has to be long, split it into stages and save what the user has entered.
