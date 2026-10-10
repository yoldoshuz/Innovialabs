---
title: Meta Conversions API: How to Set It Up and Deduplicate Events
description: Ways to connect Meta Conversions API, deduplicating with the pixel via event_id, Event Match Quality, hashing customer data and verifying in Events Manager.
summary: Conversions API sends events to Meta from your server alongside the pixel; to avoid double counting, both sources must send the same event_name and event_id, and good matching needs normalised, SHA-256 hashed customer data.
---
## The short answer: how it works

**Meta Conversions API (CAPI)** sends events (lead, purchase, sign-up) to Meta from a server instead of the browser. CAPI usually runs **alongside the pixel**:

- the pixel captures browser events and on-site behaviour;
- CAPI sends the same events from the server and delivers them even when the browser request is blocked or lost;
- Meta **deduplicates** the pairs and counts each event once — provided you send matching identifiers.

The server can also send events that never happen in the browser, such as a payment confirmed in the CRM.

## Integration options

| Method | When it fits | What to watch |
|---|---|---|
| **Partner integration** (CMS, site builders, e-commerce platforms) | Site runs on a popular platform | Limited flexibility; check that event_id is passed |
| **Conversions API Gateway** | Need it fast without backend development | Deploys in your cloud, requires hosting |
| **Server-side GTM** | Server-side tracking already in place | event_id must be passed correctly from the web container |
| **Direct integration** via Graph API | Custom development, events from backend and CRM | Maximum flexibility, but everything is on your side |

## Deduplication with event_id

Meta treats two events as duplicates when their **event_name** and **event_id** match and they belong to the same pixel. So the ID must be generated once and sent through both channels.

In the browser:

```js
const eventId = crypto.randomUUID();
fbq('track', 'Lead', { value: 0, currency: 'USD' }, { eventID: eventId });
// send the same eventId to your server together with the form data
```

On the server, the same value goes into `event_id`:

```json
{
  "data": [{
    "event_name": "Lead",
    "event_time": 1760000000,
    "event_id": "same-uuid",
    "action_source": "website",
    "event_source_url": "https://example.com/contacts",
    "user_data": {
      "em": ["<sha256 email>"],
      "ph": ["<sha256 phone>"],
      "client_ip_address": "203.0.113.10",
      "client_user_agent": "Mozilla/5.0 ...",
      "fbp": "fb.1.1700000000000.123456789",
      "fbc": "fb.1.1700000000000.AbCdEf"
    }
  }]
}
```

Common causes of duplicates: different event name spelling (`Lead` vs `lead`), event_id generated separately in the browser and on the server, or the server event sent with too long a delay.

## Event Match Quality

**Event Match Quality (EMQ)** is a score in Events Manager that shows how well Meta can match your server events to user accounts. The higher it is, the more accurate attribution and optimisation become.

How to improve it:

- send **email and phone** when the user has provided them;
- send **fbp** (the `_fbp` cookie) and **fbc** (the `_fbc` cookie or the `fbclid` URL parameter);
- include the client's **IP address and user agent**, not your server's;
- use **external_id** — your internal user ID, identical in the pixel and CAPI.

## Hashing customer data

Personal data (email, phone, name, city and so on) must be **normalised and hashed with SHA-256** before sending. Do not hash IP, user agent, fbp or fbc.

```js
import { createHash } from 'node:crypto';

const sha256 = (v) => createHash('sha256').update(v).digest('hex');

const em = sha256(' User@Example.com '.trim().toLowerCase());
const ph = sha256('+998 90 123-45-67'.replace(/\D/g, '')); // digits only, with country code
```

A normalisation mistake (a space, a capital letter, a plus sign in the number) produces a different hash and no match.

## Verifying in Events Manager

1. Open **Test Events**, copy the `test_event_code` and add it to server requests while debugging.
2. Perform an action on the site and confirm the event arrives from both the browser and the server.
3. In the event details, check the **deduplication** status: the pair should be shown as handled.
4. After a while, review **EMQ** and the **Diagnostics** tab for errors and recommendations.
5. Remove `test_event_code` before going to production.

Request format details are in the [Meta documentation](https://developers.facebook.com/docs/marketing-api/conversions-api).

## FAQ

### Can I use CAPI without the pixel?

Technically yes, but Meta recommends the combination: the pixel provides behavioural signals from the browser, CAPI provides reliable delivery and server-side events.

### Does CAPI require user consent?

Yes. Sending from the server does not change consent or personal data requirements. Only send events when you have a lawful basis to do so.

### Why is EMQ low even though everything is set up?

Most often email or phone are not sent, data is normalised incorrectly before hashing, or the server's IP is sent instead of the client's.
