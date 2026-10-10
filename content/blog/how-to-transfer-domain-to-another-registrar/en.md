---
title: How to Transfer a Domain to Another Registrar Safely
description: A step-by-step domain transfer: unlocking, auth codes, timing, keeping DNS working during the move and what to check before the domain expires.
summary: First make sure your DNS does not depend on the old registrar, then unlock the domain, get the auth code and start the transfer well before expiry, not a few days before.
---
## The short answer

A transfer only changes **which company manages your domain registration** and bills you for renewals. Websites and email break not because of the transfer itself but because of DNS: if your zone is hosted on the old registrar's nameservers, those may stop answering once the domain leaves.

The order that almost always works:

1. Move the DNS zone to an independent DNS provider or to the new registrar, and confirm it answers correctly.
2. Remove the **transfer lock** at the old registrar.
3. Get the **authorization code** (auth code, EPP code).
4. Start the transfer at the new registrar and approve it.
5. Check the domain, DNS and expiry date afterwards.

## Step 0: confirm the domain can be transferred

- **Recent registration or transfer.** Generic TLDs (.com, .net, .org and others) block transfers for a period after registration or a previous transfer — traditionally 60 days. Ask your registrar for the exact rule.
- **Owner changes.** After you update registrant details, the registrar may temporarily lock transfers.
- **Country-code TLDs** (.uz, .ru, .kz and others) follow their own registry rules. Some use auth codes, others need a written request or email confirmation. Check the procedure with the new registrar first.
- **Owner email.** Confirmation emails go to the domain's contact address. If that mailbox lives on the same domain or is no longer used, change it before you start.

## Step 1: make DNS independent of the old registrar

Check which nameservers the domain uses:

```bash
dig NS example.com +short
```

If they belong to the old registrar, that is your main downtime risk. Move the zone to an independent DNS service (Cloudflare, your hosting or cloud DNS) or to the new registrar.

To do it without downtime:

1. Copy **every record**: A, AAAA, CNAME, MX, TXT (SPF, DKIM, DMARC, service verifications), SRV. Forgotten MX and TXT records are what usually breaks email.
2. Compare answers from the new and old DNS before switching:

```bash
dig @ns1.new-dns.example MX example.com +short
dig @ns1.old-dns.example MX example.com +short
```

3. Only then change the nameservers and wait for caches to refresh. For NS records this usually takes up to a day or two, so keep the old zone in place for now.

**DNSSEC.** If it is enabled, doing things in the wrong order makes the domain unreachable for validating resolvers. The simplest safe path: disable DNSSEC (remove the DS record at the registrar), wait for the TTL to expire, switch DNS, then enable DNSSEC again with the new provider.

## Steps 2–3: unlock and get the auth code

In the old registrar's panel:

- turn off **Transfer Lock / Registrar Lock** — the `clientTransferProhibited` status should disappear;
- request the **auth code**. Some registrars show it right away, others email it to the owner.

You can check the status via WHOIS:

```bash
whois example.com | grep -i status
```

## Step 4: start the transfer

At the new registrar choose "Transfer a domain", enter the name and auth code, and pay. For generic TLDs a transfer usually **adds one year** to the registration and keeps the remaining term.

Timing: the old registrar may approve right away or stay silent, in which case the transfer is approved automatically, typically within five days. You can speed it up by approving the transfer in the email or panel of the old registrar.

## Step 5: what to check afterwards

- the domain appears in the new registrar's panel with the correct expiry date;
- nameservers are exactly the ones you configured;
- the website loads and email is sent and received;
- the transfer lock is turned back on;
- auto-renewal is enabled with a working payment method;
- owner contact details are up to date.

## Common mistakes

- **Transferring a few days before expiry.** If the process stalls, the domain can expire. Start at least two to three weeks ahead. If the domain has already expired, many registrars will refuse the transfer — renew it first.
- **DNS left at the old registrar.** The most common cause of downtime.
- **Forgotten TXT records.** Mail starts landing in spam and service verifications fail.
- **Unreachable owner email.** The confirmation goes nowhere and the transfer hangs.

## FAQ

### Will my website go down during the transfer?
No, as long as the DNS zone already sits with an independent provider or the new registrar with the same records. Moving the registration itself does not affect the site.

### Will I lose the years I already paid for?
For generic TLDs, no: the remaining term is kept and a transfer usually adds a year. Country-code TLDs have their own rules, so confirm with the registrar.

### Can I transfer a domain right after buying it?
Usually not. Generic TLDs block transfers for some time after registration, so pick a registrar you plan to stay with from the start.
