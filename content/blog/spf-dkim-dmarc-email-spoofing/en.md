---
title: SPF, DKIM and DMARC: Stop Email Spoofing of Your Domain
description: What SPF, DKIM and DMARC do, example DNS records, moving DMARC from none to reject, reading aggregate reports and avoiding mistakes with multiple senders.
summary: SPF lists the servers allowed to send mail for your domain, DKIM signs your messages, and DMARC tells receivers what to do with mail that fails those checks and sends you reports. Together they stop scammers from sending email in your domain's name.
---

## What each record does

Email itself does not verify who appears in the "From" field. Any server can send a message from `director@your-company.com`. Three DNS records fix this together:

| Record | What it checks | Analogy |
|---|---|---|
| **SPF** | Which server (IP) sent the message and whether it is allowed for the domain | A staff access list |
| **DKIM** | A cryptographic signature proving the domain owner sent it and it was not altered | A seal on a document |
| **DMARC** | Whether the verified domain matches the From address, and what to do on failure | Instructions for security plus a report |

The key DMARC concept is **alignment**. It is not enough for SPF or DKIM to pass — the domain they verified must match the domain in the From address. A message passes DMARC if at least one check passes **and** is aligned.

## Example DNS records

Say your company mail runs on Google Workspace and newsletters go through an email marketing service.

**SPF** — a single TXT record at the domain root:

```dns
example.com.  TXT  "v=spf1 include:_spf.google.com include:spf.newsletter-service.example ~all"
```

- `include:` adds a provider's servers;
- `~all` means "everything else is probably not ours" (softfail), `-all` is a hard fail. With DMARC in place, `~all` is usually enough.

**DKIM** — a public key issued by your mail service. The record name combines a **selector** and `_domainkey`:

```dns
google._domainkey.example.com.  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqh...IDAQAB"
```

Each service has its own selector, so having several DKIM records is normal.

**DMARC** — a record on the `_dmarc` subdomain:

```dns
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

## Moving DMARC from none to reject

Jumping straight to `p=reject` is risky: you will block your own legitimate mail from senders you forgot about. Go step by step:

1. **`p=none`** — nothing is blocked, but reports start arriving. Collect data for a few weeks and find everyone sending mail in your name.
2. Set up SPF and DKIM for every legitimate sender you find.
3. **`p=quarantine; pct=25`** — part of the failing mail goes to spam. Raise `pct` gradually to 100 while watching the reports.
4. **`p=reject`** — mail that fails DMARC is rejected. This is the goal.

The `sp=` tag sets policy for subdomains. For domains that never send mail, publish a strict policy right away:

```dns
parked.example.         TXT  "v=spf1 -all"
_dmarc.parked.example.  TXT  "v=DMARC1; p=reject"
```

## Reading aggregate reports

Reports sent to the `rua` address come from mailbox providers, usually once a day, as zipped XML. Reading them by hand is tedious, so most teams use a report analyzer or a script. In each report, look at:

- the **source IP** and how many messages came from it;
- the **SPF** and **DKIM** results and whether they are aligned;
- the **disposition applied**: delivered, quarantined or rejected.

How to interpret them:

- Unknown IP, everything fails — most likely spoofing. This is exactly what DMARC protects against.
- A known service (CRM, newsletter tool, helpdesk) fails alignment — configure its DKIM to sign with your domain.
- Forwarding often breaks SPF but preserves DKIM, which is why DKIM is essential.

## Common mistakes with multiple senders

- **Two SPF records** on one domain. This is invalid and returns `permerror`. Merge all `include` entries into one record.
- **More than 10 DNS lookups** in SPF. Every `include`, `a` and `mx` counts, including nested ones. Over the limit, SPF breaks — remove unused entries or move bulk mail to a subdomain.
- **SPF passes but is not aligned.** The newsletter service uses its own domain in the Return-Path. Fix it with DKIM signing on your domain or a custom return-path domain.
- **Forgotten senders**: a website sending notifications through the host's `mail()`, accounting software, billing, ticketing systems.
- **`+all` in SPF**, which authorizes anyone to send.
- **Reports sent to another company's domain** without authorization: if `rua` points to an external domain, that domain needs a special authorization record.
- **A long DKIM key in a single string.** TXT strings are limited to 255 characters, so a long key is split into several quoted strings; most DNS panels do this automatically.

## FAQ

### Is SPF alone enough?

No. SPF does not check the From address that people actually see, and it breaks with forwarding. Without DMARC, receivers do not know what to do with a message that fails SPF. Full protection means all three records together.

### Will DMARC affect our newsletter deliverability?

Usually for the better: major mailbox providers require bulk senders to have SPF, DKIM and DMARC in place. The only risk is moving to `reject` before all legitimate senders are configured.

### How do we check that everything is set up correctly?

Send a message to a Gmail or other major mailbox and open the original message source. The `Authentication-Results` header should show `spf=pass`, `dkim=pass` and `dmarc=pass`. You can also check record syntax with online validators.
