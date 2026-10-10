---
title: Why DNS Changes Take Time: Propagation and TTL
description: Why DNS changes do not show up instantly, how TTL and resolver caches cause the delay, how to check propagation and how to prepare a domain for a move.
summary: Resolvers cache DNS answers for the length of the TTL, so after you change a record some users keep seeing the old value until their cache expires; lowering the TTL in advance makes a planned switch fast.
---
## The short answer

DNS does not really "propagate". When you edit a record at your provider, the **authoritative servers** have the new value right away. The delay comes from millions of **resolvers** — your ISP's servers, public DNS like 8.8.8.8, plus browsers and operating systems — that have already stored the old answer and keep it until its **TTL** runs out.

Until the cache expires, a resolver does not ask again. That is why some people see the new site while others still see the old one.

## What TTL is

**TTL (time to live)** is a number of seconds attached to every record. It tells resolvers how long they may keep the answer.

- `300` — 5 minutes;
- `3600` — 1 hour;
- `86400` — 1 day.

The key detail: TTL applies **to the value already sitting in the cache**. If a record had a TTL of 86400 and you change the IP and set TTL 300 at the same time, resolvers holding the old answer will still keep it for up to a day.

## Other sources of delay

- **Browser and OS caches.** Even when the resolver knows the new address, the device may remember the old one.
- **Changing nameservers.** When you move DNS to another provider, the NS records in the top-level zone (.com, .uz and so on) have their own TTL that you do not control. This usually takes longer than editing an A record.
- **Negative caching.** If someone looked up a name before you created it, the resolver cached "does not exist" for the period set in the zone's SOA record.
- **Resolvers that ignore TTL.** Some keep answers longer than stated. You cannot fully control this.

## How to check whether the change is live

First confirm the **authoritative server** returns the new value — this rules out a mistake in the panel:

```bash
# find the domain's nameservers
dig example.com NS +short

# ask the authoritative server directly
dig @ns1.dns-provider.com example.com A +short
```

Then check public resolvers and see how much TTL they have left:

```bash
dig @8.8.8.8 example.com A
dig @1.1.1.1 example.com A
```

The number in the second column of the answer is the remaining cache time in seconds. For a broader view, online DNS checkers query resolvers in many regions at once.

To clear your local cache:

```bash
# Windows
ipconfig /flushdns
```

On macOS and Linux the command depends on the system version; checking with `dig` is simpler because it bypasses the browser cache.

## How to prepare a planned switch

If you know the migration date in advance, you can cut the delay to almost nothing.

1. **Check the current TTL** of the records you will change.
2. **Lower the TTL** to 300 seconds at least one old TTL before the move. If it was a day, lower it a day ahead (more is safer).
3. **Wait** for the old caches to expire. Now every resolver keeps the record for at most 5 minutes.
4. **Change the record** to the new address.
5. **Keep the old server running** for a while: some traffic may still arrive from stubborn caches.
6. **Restore the TTL** to its usual value once everything works.

## Common mistakes

- **Lowering TTL at the same moment as changing the IP.** It does nothing for resolvers that already cached the old value with a long TTL.
- **Shutting down the old server right after the switch.** Users with stale caches will get errors.
- **Keeping a very low TTL permanently.** It increases DNS queries and slightly slows the first visit. For stable records, an hour or more is reasonable.
- **Checking only in your own browser.** Your local cache does not show what everyone else sees.

## FAQ

### How long should I wait after changing DNS?

As long as the old record's TTL, plus a small buffer for device caches. When changing nameservers, go by the top-level zone's TTL, which is usually longer than for regular records.

### Can I force a specific ISP to update faster?

No, you cannot clear someone else's resolver cache. Some public DNS services offer a cache-flush form for their own resolver, but that only affects their users.

### What TTL should I use by default?

For records that rarely change, 3600 seconds or more. Before planned changes, temporarily lower it to 300.
