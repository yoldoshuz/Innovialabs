---
title: How to Monitor Website Uptime and Get Downtime Alerts
description: How to pick an external uptime checker, set check intervals, route alerts to Telegram or email and publish a status page your customers can trust.
summary: Use an external uptime service that checks your site from several regions every 1–5 minutes, alerts Telegram or email after 2–3 failed checks in a row, and hosts a public status page.
---
## The short answer

Uptime has to be checked **from the outside**, not from the server that runs the site. If the server goes down, monitoring on that same box goes down with it and tells nobody. That is why teams use external **uptime checkers**: every few minutes they send a request to your site from different locations and notify you when there is no response or the response is wrong.

A minimal setup that works:

- a check on the homepage plus one critical page (checkout, login or API);
- an interval of 1–5 minutes;
- alerts to **Telegram** and to the responsible person's email;
- a public **status page** for customers.

## Types of checks

| Check type | What it verifies | When you need it |
|---|---|---|
| HTTP(S) | Response status code (200, 301, etc.) | Always, the baseline |
| Keyword | A specific text is present on the page | When the site can return 200 with a broken page |
| Ping / TCP port | The server or a port responds | Servers, databases, mail |
| SSL | Certificate expiry date | So expiry never surprises you |
| Domain | Domain registration expiry | So the domain does not lapse |
| Heartbeat (cron) | A background job reported in on time | Backups, mailings, syncs |

A **keyword check** is often more useful than a plain HTTP check: a site can happily return 200 while showing a database error page.

## How to choose a service

There are many simple external services: UptimeRobot, Better Stack, Pingdom, Freshping, and Uptime Kuma (open source, self-hosted). Compare them on criteria rather than brand:

- **Minimum check interval** on the plan you will actually use.
- **Number of regions** checks run from. Confirmation from several locations cuts false alarms.
- **Notification channels**: Telegram, email, SMS, phone call, webhook.
- **Status page**: available or not, custom subdomain support.
- **History and reports** on monthly availability.

If you self-host something like Uptime Kuma, run it **on a different server with a different provider** than your main site.

## Setting intervals and alerts

**Interval.** For a commercial site, 1–3 minutes is reasonable; for internal tools, 5 minutes. Checking far more often adds little real value.

**Failure confirmation.** Alert after 2–3 consecutive failures or after confirmation from several regions, not after the first miss. Otherwise short network blips will wake you at night and the team will learn to ignore alerts.

**Timeout.** Set a sensible response timeout. A page that takes ages to load is nearly the same as a page that is down from the user's point of view.

**Telegram alerts.** Most services can post to Telegram directly or through a bot. A convenient pattern:

1. Create a dedicated chat or channel for alerts.
2. Add the monitoring service's bot (or your own bot via webhook).
3. Enable notifications for both "down" and "back up".

Keep **email** as a backup channel in case Telegram is the thing that is having a bad day.

If a service only supports webhooks, you can forward to Telegram with a call to the Bot API:

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d chat_id=<CHAT_ID> \
  -d text="example.com is down"
```

## A public status page

A status page reduces the flood of support questions during an outage: customers see that you know about the problem and are on it.

What it should include:

- a list of components (website, API, customer portal, payments);
- the current status of each;
- incident history with short explanations;
- scheduled maintenance announced in advance.

Host it on a subdomain like `status.example.com` and **on an external platform**, not on the same server. Otherwise an outage takes down both the site and the page announcing the outage.

## Common mistakes

- Monitoring runs on the same server as the site.
- Only the homepage is checked, while checkout is what breaks.
- Alerts go to a single person who happens to be on vacation.
- No recovery notifications, so nobody knows when the issue cleared.
- SSL and domain expiry dates are not tracked.

## FAQ

### What check interval should I choose?

For most sites, 1–5 minutes is enough. The more each minute of downtime costs the business, the shorter the interval, but always enable failure confirmation to avoid false alarms.

### Is a free plan enough?

For a small site, a free plan often covers basic HTTP checks and notifications. Paid plans usually add shorter intervals, more regions, SMS and phone alerts, and a branded status page.

### How is uptime monitoring different from server monitoring?

Uptime monitoring looks at the site the way a user does: does it open from the outside. Server monitoring (CPU, memory, disk) shows the causes from the inside. Having both is ideal, but start with the external check.
