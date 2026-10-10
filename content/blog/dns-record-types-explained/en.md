---
title: DNS Records Explained: A, AAAA, CNAME, MX, TXT, NS
description: What the A, AAAA, CNAME, MX, TXT and NS DNS records do, their typical values and which ones you need for a website, email and domain verification.
summary: DNS records tell the internet where to send requests for your domain: A and AAAA point to a server IP, CNAME points to another name, MX points to a mail server, TXT holds verifications and email policies, and NS defines who manages the zone.
---
## The short answer

DNS is the directory that turns a domain name into an address computers can reach. A **DNS record** is a single line in that directory: a name, a type, a value and a **TTL** (how many seconds the answer may be cached).

All records for a domain live in its **DNS zone** at your DNS provider, which may be your registrar, your host or a separate service such as Cloudflare. There are many record types, but a typical business only needs six.

## The six common types

| Type | What it does | Example value |
|---|---|---|
| **A** | Points a name to an IPv4 address | `203.0.113.10` |
| **AAAA** | Points a name to an IPv6 address | `2001:db8::10` |
| **CNAME** | Makes a name an alias of another name | `myapp.hosting-provider.com` |
| **MX** | Says which server receives email | `10 mx.mail-provider.com` |
| **TXT** | Stores free text: verifications, SPF, DKIM, DMARC | `v=spf1 include:_spf.mail-provider.com ~all` |
| **NS** | Says which servers are authoritative for the zone | `ns1.dns-provider.com` |

### A and AAAA

**A** is the most basic record: "example.com lives on the server with this IP". **AAAA** does the same for IPv6. If your server has no IPv6 address, you do not need AAAA — and a wrong AAAA record can make the site unreachable for some visitors.

### CNAME

**CNAME** says "this name is the same as that one". It is the usual way to connect `www` or a subdomain to a cloud platform that changes its own IPs. Two limits matter:

- By the standard, a CNAME cannot sit on the root domain (`example.com`). Providers offer ALIAS, ANAME or "CNAME flattening" for that case.
- If a name has a CNAME, it cannot have any other records.

### MX

**MX** points to the mail server for the domain. The number before the host is the **priority**: lower means preferred. The MX value must be a hostname, not an IP address and not a CNAME.

### TXT

**TXT** is a general-purpose text field. In practice it holds:

- **domain ownership verification** for Google Search Console, email services and SSL providers;
- **SPF** — the list of servers allowed to send mail for the domain;
- **DKIM** — a public key used to sign messages (usually on a name like `selector._domainkey`);
- **DMARC** — the policy for messages that fail checks (on the `_dmarc` name).

### NS

**NS** records define which DNS servers are authoritative for the domain. You change them at the registrar when moving DNS management to another provider. Without a clear reason, leave them alone.

## Which records you need for common tasks

**To get a website online:**

- A (plus AAAA if you have IPv6) for `example.com`;
- CNAME for `www` pointing to the main domain or the platform address.

**To run email on your domain:**

- MX from your mail provider;
- TXT with SPF;
- TXT with the DKIM key;
- TXT with DMARC on `_dmarc`.

**To verify a domain in a service:**

- TXT (sometimes CNAME) with the value the service gives you.

A minimal zone looks like this:

```text
example.com.          3600  A      203.0.113.10
www.example.com.      3600  CNAME  example.com.
example.com.          3600  MX     10 mx.mail-provider.com.
example.com.          3600  TXT    "v=spf1 include:_spf.mail-provider.com ~all"
_dmarc.example.com.   3600  TXT    "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

## Common mistakes

- **Two SPF records** on one domain. There must be exactly one; combine senders with `include:` in a single line.
- **CNAME on the root domain.** Many panels will refuse it, and if one allows it, email may break.
- **The trailing dot.** Some panels expect names relative to the zone (`www`), others fully qualified (`www.example.com.`). Mixing them up produces `www.example.com.example.com`.
- **Deleting MX records when moving a website.** Site and mail are independent; leave mail records alone when changing hosts.
- **Expecting instant results.** Changes respect TTL, so old values can stay in caches for a while.

## How to check your records

To see what DNS actually returns:

```bash
dig example.com A +short
dig example.com MX +short
dig example.com TXT +short
```

On Windows, use `nslookup -type=MX example.com`.

## FAQ

### Should a subdomain use an A record or a CNAME?

If it should point to a specific server with a fixed IP, use A. If it points to a platform that manages its own addresses (cloud hosting, website builder, CDN), use CNAME so you do not have to update anything when their IPs change.

### Can my website and email be with different providers?

Yes, that is very common. A and CNAME records point to the website host, while MX and email TXT records point to the mail service. They do not interfere with each other.

### Should I delete the TXT record after verifying a domain?

It depends on the service. Some re-check ownership periodically and will revoke verification if the record disappears. If in doubt, keep it — an extra TXT record does no harm.
