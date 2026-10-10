---
title: How to Connect a CRM to Your Website, Telephony and Messengers
description: How requests from forms, calls and chats reach your CRM automatically: connection options, contact deduplication, source tracking and a post-setup checklist.
summary: Each channel connects to the CRM through a ready connector or an API: forms send data via a webhook, telephony creates a record on each call, and messengers arrive through chat connectors. To keep the database clean you need phone normalization, duplicate checks and a recorded source for every request.
---
## The short answer

CRM integration comes down to one rule: **every client contact automatically becomes a CRM record** with a contact, a source and an owner. Three flows make that happen:

- **Website** — forms send data to the CRM through an API or webhook.
- **Telephony** — a cloud PBX passes call events and recordings.
- **Messengers** — chats arrive through the CRM's built-in connectors or an aggregator service.

On top of these you need **deduplication** and **source tracking**, otherwise the database quickly fills with repeats of unknown origin.

## Website forms

There are three ways to pass a request from your site:

| Option | How it works | When to choose |
|---|---|---|
| Built-in CRM form | The form is created in the CRM and embedded with a snippet | You need it fast and form design is not critical |
| Webhook or API | Your form posts to your server, the server creates the CRM record | Custom layout, validation, several CRM entities at once |
| CMS plugin | A ready module for your site engine | Your site runs on a popular CMS with a maintained module |

With an API, make sure the **server side** talks to the CRM: the CRM access key must never end up in code loaded by the browser. If the CRM is unavailable, store the request and retry instead of losing it.

## Telephony

A cloud PBX connects to the CRM through a ready app or an API. Typical logic:

1. Incoming call → the CRM looks up the contact by number.
2. Number found → the manager sees the client card in a pop-up.
3. New number → a lead or deal is created with the source "Call".
4. Missed call → a call-back task with a deadline.
5. After the call → the recording and duration are attached to the record.

Make outgoing calls from the CRM too, so the whole communication history stays in one place.

## Messengers and chats

Telegram, WhatsApp, Instagram and website live chat connect through the CRM's chat connectors or an aggregator. WhatsApp usually requires the official WhatsApp Business API through a provider.

Check that a conversation **attaches to an existing contact** instead of creating a new client on every message, and that replies sent from the CRM reach the client in the same messenger.

## Deduplication

The same person may fill in a form, call and write on Telegram. Without deduplication rules you get three records.

- **Normalize phone numbers** to one format with the country code: `+998901234567`, no spaces, brackets or dashes.
- **Lowercase emails** and trim whitespace.
- Look up the contact **before creating** a record: by phone first, then email, then messenger ID.
- If a match is found, attach the new request to the existing contact instead of creating a copy.
- Run the CRM's built-in **duplicate search** regularly for anything that slips through.

## Source tracking

To know which ads bring clients, every request must carry its source.

- **Forms**: capture UTM parameters when the visitor lands and pass them in hidden fields.
- **Calls**: use call tracking — separate numbers per channel or dynamic numbers per visit.
- **Chats**: the source is usually the channel itself (Telegram, Instagram); for ads, use a start parameter or a dedicated link.

A simple example of saving UTM parameters into hidden form fields:

```js
const params = new URLSearchParams(location.search);
for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
  const value = params.get(key);
  if (value) sessionStorage.setItem(key, value);
  const input = document.querySelector(`input[name="${key}"]`);
  if (input) input.value = sessionStorage.getItem(key) ?? "";
}
```

## What to check after setup

- Send a test request **through every channel**: form, call, each messenger.
- Confirm the **source** and UTM parameters are recorded.
- Contact again from the same number — no new record should appear.
- Make sure an **owner** is assigned and a task is created.
- A missed call turns into a call-back task.
- Break the CRM connection or use a wrong key — the request must not vanish.
- After a week, compare the number of requests in the CRM with telephony and website analytics.

## FAQ

### Do I need a developer if the CRM has ready-made integrations?

For standard scenarios, ready connectors are often enough. Development is needed for custom forms, complex deduplication, creating several CRM entities at once, or linking systems that have no ready integration.

### Why does the CRM show fewer requests than website analytics?

Common causes: failed submissions without retries, blocked scripts in the browser, forms that only send email, or analytics counting submissions that failed validation. Compare server and CRM logs for specific dates.

### Which field is best for finding duplicates?

Usually the normalized phone number, then email. Names do not work: different people share them and one person writes theirs in different ways.
