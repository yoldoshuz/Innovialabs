---
title: "Web Forms Done Right: Validation, Errors and UX in Code"
description: How to build forms that are pleasant and reliable: native HTML validation, one schema for client and server, accessible error messages and anti-spam basics.
summary: A good form validates twice, on the client for convenience and on the server for safety, using one shared schema, and shows clear errors right next to the field.
---

## The main rule

**Client-side validation is for convenience; server-side validation is for security.** Anything coming from the browser can be forged, so the server must check data itself. Browser checks exist so people learn about mistakes immediately rather than after submitting.

Ideally, define the rules **once** in a shared schema and use it on both sides.

## Start with native HTML

Browsers do a lot without JavaScript:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" required>

<label for="phone">Phone</label>
<input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
```

- **`type`** (`email`, `tel`, `url`, `number`, `date`): the right keyboard on phones and basic checks.
- **`required`, `minlength`, `maxlength`, `pattern`, `min`, `max`**: simple rules with no code.
- **`autocomplete`**: the browser fills in saved data, which makes forms much faster.
- **`<label>`** for every field: a placeholder is not a label.

Default browser tooltips are not always pretty, so teams often add `novalidate` to the form and render errors themselves, keeping the attributes for semantics.

## One schema for client and server

In TypeScript projects, a schema library such as Zod works well:

```ts
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Check your email"),
  message: z.string().trim().max(2000, "Text is too long"),
});
```

On the client the schema gives instant errors; on the server the same check runs before saving:

```ts
const result = leadSchema.safeParse(body);
if (!result.success) {
  return Response.json(
    { errors: result.error.flatten().fieldErrors },
    { status: 422 },
  );
}
```

The server returns errors **per field** so the client can show them in the right places. Server-only checks (is the email taken, does the promo code exist) come back in the same format.

## When to show errors

- **Not on the first keystroke**: it is annoying. Validate a field when it loses focus (`blur`).
- **After the first error**, revalidate on every change so the message disappears as soon as it is fixed.
- **On submit**, check everything, show errors and move focus to the first invalid field.
- Never wipe the user's input when the server returns an error.

## Accessible error messages

```html
<input id="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Check your email: the @ symbol is missing</p>
```

- Put the error text **next to the field** and link it with `aria-describedby`.
- Set `aria-invalid="true"` on invalid fields.
- Do not rely on red alone: add text or an icon.
- Explain **how to fix it**, not just "Invalid value".
- For long forms, add an error summary at the top with links to the fields.

## Often forgotten UX details

- Keep fields to a minimum: every extra field reduces the desire to finish.
- Do not restrict formats you can normalize: strip spaces from phone numbers yourself.
- Disable the button while submitting to prevent duplicates, and show a loading state.
- Show a clear success message that says what happens next.

## Anti-spam basics

- **Honeypot**: a hidden field that people will not fill in, but bots will.
- **Timing check**: a form submitted a fraction of a second after page load is suspicious.
- **Rate limiting** by IP on the server.
- **CAPTCHA** only if the rest does not help, since it worsens the experience for real users.
- Sanitize and escape data before displaying it or writing it to the database.

## FAQ

### Is client-side validation enough?

No. It is easy to bypass by sending the request directly. Client checks are for convenience; only the server actually protects your data.

### Should I validate email with a regular expression?

A simple format check is enough; skip complex regexes. The only real confirmation is an email with a link or code.

### Do I need a form library?

For a couple of fields, native HTML and a little code are enough. For large forms with dynamic fields, a form library together with a schema saves time and reduces bugs.
