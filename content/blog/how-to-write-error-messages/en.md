---
title: How to Write Error Messages Users Understand
description: A simple formula for clear error messages: what happened, why, and how to fix it. Tone rules, placement guidance and before/after rewrites of bad errors.
summary: A good error message says in plain language what happened, why, and what to do to fix it, with no blame, codes or jargon, and it appears where the user is already looking.
---

## The formula for a good error

An error message answers three questions:

1. **What happened** — specifically, not in general terms.
2. **Why** — when the reason helps the user understand.
3. **How to fix it** — a next step the user can take right now.

Example: "Couldn't save the file because the disk is full. Delete files you don't need or choose another folder."

You can drop the second part when the cause is obvious or useless to the user. Never drop the third: an error with no way out is a dead end.

## Tone rules

- **Don't blame.** "You entered the wrong password" → "That password doesn't match." An error is a situation, not the person's fault.
- **No tech talk.** Codes, exception names and "Error 500" mean nothing to users. Keep a code in small print for support if needed.
- **No drama, careful with jokes.** "Oops!" and exclamation marks grate when someone's payment just failed. Humour fits only harmless cases, like a 404 page.
- **Be specific.** Not "Something went wrong" but what went wrong and what to do.
- **Be brief.** One or two sentences. Put details behind a link if they're truly needed.
- **Be consistent.** Describe the same situation with the same words across the product.
- **Not just colour.** Pair red with an icon and text so people with colour vision deficiency and screen reader users get it too.

## Where to show the error

| Situation | Where to show it |
|---|---|
| Error in a form field | Below the field, right after the user leaves it |
| Several errors on submit | A summary at the top with links to fields + a message at each field |
| An action failed (not saved, not sent) | A notice near where the action happened, with a "Try again" button |
| No connection | An unobtrusive banner that disappears once the connection is back |
| Page not found or unavailable | A dedicated screen with ways forward: search, home, support |
| Critical error, data at risk | A modal dialog — only in this case |

The principle: an error appears where the user is already looking and doesn't vanish on its own before they've read it. Toasts that disappear after a couple of seconds are fine for confirmations, not for errors.

## Before and after

| Before | After |
|---|---|
| Invalid input | Enter the full phone number, for example +998 90 123 45 67 |
| Error 500. Internal Server Error | We couldn't load this page. Refresh in a minute, and if that doesn't help, contact support |
| Transaction declined | Your bank declined the payment. Check your card details or choose another payment method |
| Field required | Enter your email so we can send your order confirmation |
| Oops! Something went wrong :( | Couldn't send your message. Check your internet connection and try again |
| Password does not meet requirements | Use at least 8 characters, including at least one number |
| Unsupported file | Upload a JPG or PNG image up to 10 MB |

Notice that the better version almost always contains an **action verb**: enter, check, upload.

## Prevent rather than report

The best error is the one that never happens.

- Show requirements **upfront**: password rules and file size limits before input, not after.
- Accept different formats: phone numbers with spaces, dates with dots or dashes.
- Disable unavailable options with an explanation instead of letting users pick them and fail.
- Keep what the user entered so they don't have to start over after an error.

## Pre-release checklist

- Is it clear what happened without knowing how the system works inside?
- Is there a concrete next step?
- Is it free of blame, jargon and extra exclamation marks?
- Is the message next to the problem and visible without relying on colour?
- Is the user's input preserved?

## FAQ

### Should I show the error code?

Not to the user, if they can't do anything with it. But a short code or reference ID in small print helps when someone contacts support, because the team can find the problem in the logs faster.

### Can error messages be funny?

Carefully. A joke works when the error is harmless and nothing was lost. If a payment failed or data disappeared, humour reads as disrespect.

### Who should write error messages, developers or designers?

Ideally a UX writer or designer together with a developer. The developer knows which errors can occur and why, and the designer or writer phrases them in the user's language. A shared list of all messages keeps them consistent.
