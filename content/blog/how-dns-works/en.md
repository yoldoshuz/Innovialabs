---
title: How DNS Works: From Typing a URL to Loading a Site
description: How DNS turns a site address into an IP, step by step: resolver, root, TLD and authoritative servers, caching and TTL, and what can break on the way.
summary: DNS is the internet's distributed directory: a resolver asks a root server, then the zone's server, then the domain's authoritative server, gets the IP address and caches the answer for the TTL.
---
## The short answer

Computers talk using **IP addresses**, while people remember **names**. **DNS (Domain Name System)** translates a name like `example.com` into a server's IP address. It is not a single database but a **distributed hierarchy of servers**: each one knows only its part and points you to where to ask next.

## The resolution chain, step by step

Say you open `www.example.uz` for the first time.

1. **Local cache.** The browser and operating system check whether they already know the address. If they do, the lookup stops here.
2. **Recursive resolver.** If not, the query goes to a resolver, usually your ISP's or a public one such as `1.1.1.1` or `8.8.8.8`. The resolver does the legwork and returns a final answer.
3. **Root server.** The resolver asks one of the root servers, "Where do I find `.uz`?" The root does not know the site's IP, but it replies with the servers responsible for the `.uz` zone.
4. **TLD server.** The resolver asks the `.uz` server, "Who is responsible for `example.uz`?" It returns the domain's **NS servers**, the ones set at the registrar.
5. **Authoritative server.** The resolver queries the domain's NS server, which gives the definitive answer: the IP address of `www.example.uz`.
6. **Caching and reply.** The resolver stores the answer and passes it to the browser, which connects to the server by IP.

The whole chain usually takes milliseconds, and repeat lookups are even faster thanks to caching.

## Main DNS record types

| Record | Purpose |
|---|---|
| **A** | Maps a name to an IPv4 address |
| **AAAA** | Maps a name to an IPv6 address |
| **CNAME** | Makes a name an alias of another name |
| **MX** | Lists the domain's mail servers |
| **TXT** | Text data: SPF, DKIM, domain ownership verification |
| **NS** | Lists the domain's authoritative servers |

## Caching and TTL

Every record has a **TTL (time to live)**: how many seconds resolvers may keep the answer before asking again. A TTL of `3600`, for example, is one hour.

- **A high TTL** reduces load and speeds up repeat lookups, but changes reach users more slowly.
- **A low TTL** lets you switch quickly but increases the number of queries.

Practical tip: **lower the TTL of relevant records ahead of a server migration,** wait for the old TTL to expire, then change the IP. Raise the TTL again afterwards.

What people call "DNS propagation" is really waiting for old cached answers around the world to expire.

## How to check DNS yourself

The `dig` tool (Linux, macOS) and `nslookup` (also on Windows) show what DNS returns:

```bash
# The domain's A record
dig example.com A +short

# Mail servers
dig example.com MX +short

# Walk the full chain from the root
dig www.example.com +trace
```

```bash
nslookup example.com
```

## What can break along the way

- **Wrong NS at the registrar.** Records are configured at one DNS provider, but the domain is delegated to another.
- **A typo in a record,** or a record still pointing to the old IP after a migration.
- **A high TTL during a move:** some users keep hitting the old server for a long time.
- **A CNAME conflict** with other records on the same name, which the standard forbids.
- **An expired domain:** the registry removes the delegation and both the site and email stop working.
- **DNSSEC errors:** wrong signatures or keys, so validating resolvers reject the answers.
- **A resolver outage** at a user's ISP: everything works for you but not for some visitors.
- **Broken email:** missing or wrong MX, SPF or DKIM records, so mail bounces or lands in spam.

## FAQ

### How long until DNS changes take effect?

It depends on the TTL of the old records: in the worst case, as long as that TTL was before the change. Changing NS servers at the registrar can take longer because zone delegation records have their own TTLs.

### Why change the DNS resolver on my computer?

Public resolvers can be faster and more reliable than an ISP's, and some support encrypted queries. It does not affect how your site works for visitors, though, since each of them uses their own resolver.

### Can DNS be hosted somewhere other than the registrar?

Yes. Many teams move DNS to a dedicated provider such as Cloudflare or a cloud DNS service for speed, protection and easier management. You do this by setting the new provider's NS servers at the registrar.
