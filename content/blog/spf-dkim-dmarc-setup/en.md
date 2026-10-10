---
title: How to Set Up SPF, DKIM and DMARC for Your Domain
description: What SPF, DKIM and DMARC records do, example values for Google Workspace, Microsoft 365 and other providers, and how to test them so mail stays out of spam.
summary: SPF lists the servers allowed to send mail for your domain, DKIM signs every message with a key, and DMARC tells receivers what to do with mail that fails those checks. All three are DNS records, and you verify them by reading the headers of a real message.
---
## The short answer

- **SPF** (Sender Policy Framework) is a TXT record on your domain listing the servers and services allowed to send email on its behalf.
- **DKIM** (DomainKeys Identified Mail) is a digital signature. Your mail service signs each message with a private key, the public key is published in DNS, and the receiver checks the signature.
- **DMARC** is a policy on top of SPF and DKIM. It tells receivers whether to deliver, quarantine or reject mail that fails, and where to send reports.

Without these records, Gmail, Outlook and other providers are far more likely to send your mail to spam, and large mailbox providers require authentication from bulk senders.

## Step 0: list every sender

Before touching DNS, write down every service that sends email from your domain:

- your mailbox provider (Google Workspace, Microsoft 365, Zoho Mail and so on);
- marketing and transactional email services (SendGrid, Mailgun, Mailchimp and others);
- CRM, helpdesk and billing tools;
- the website itself, if its forms send mail through your SMTP.

Each one must be covered by SPF and, ideally, sign with DKIM for your domain.

## SPF: one record per domain

SPF is a TXT record on the root domain. Common `include` values:

| Service | Add to SPF |
|---|---|
| Google Workspace | `include:_spf.google.com` |
| Microsoft 365 | `include:spf.protection.outlook.com` |
| Zoho Mail | `include:zohomail.com` |
| SendGrid | `include:sendgrid.net` |
| Mailgun | `include:mailgun.org` |

Example for a domain on Google Workspace that also sends newsletters through SendGrid:

```dns
example.com.  TXT  "v=spf1 include:_spf.google.com include:sendgrid.net ~all"
```

Rules that matter:

- **Exactly one `v=spf1` record** per domain. Two records break the check entirely. Adding a service means editing the existing record.
- **No more than 10 DNS lookups** during evaluation. Every `include` costs at least one, and nested includes count too.
- **`~all` or `-all`.** `~all` (softfail) is gentler while you are setting things up; `-all` is strict. Once DMARC is in place the difference matters less.

## DKIM: the provider generates the key

You never invent a DKIM key. The sending service generates it and you publish it:

- **Google Workspace.** Admin console → Apps → Google Workspace → Gmail → Authenticate email. Generate a key, add the TXT record at `google._domainkey.example.com`, then click Start authentication.
- **Microsoft 365.** In the Microsoft Defender portal, under DKIM settings, you get two CNAME records for `selector1._domainkey` and `selector2._domainkey`. Publish both, then enable signing.
- **Email services** such as SendGrid or Mailgun show their own selectors and records in the domain authentication section of their dashboard.

The key is long. Copy it completely, without extra spaces or line breaks.

## DMARC: start in monitoring mode

DMARC is a TXT record on the `_dmarc` subdomain. A safe starting point:

```dns
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com"
```

- **`p=none`** blocks nothing and only sends reports to the `rua` address.
- **`p=quarantine`** sends failing mail to spam.
- **`p=reject`** refuses it.

DMARC checks **alignment**: the domain in the visible From address must match the domain that passed SPF or the domain in the DKIM signature (`d=`). A newsletter tool that signs with its own domain can pass DKIM and still fail DMARC, so configure it to sign with yours.

The usual path: a few weeks on `p=none`, read the reports, fix every legitimate sender, move to `quarantine`, then `reject`.

## How to test

Check what is actually published:

```bash
dig +short TXT example.com
dig +short TXT google._domainkey.example.com
dig +short TXT _dmarc.example.com
```

On Windows, `nslookup -type=TXT _dmarc.example.com` does the same.

Then send a message to a Gmail inbox, open it and choose "Show original". You want to see **SPF: PASS, DKIM: PASS, DMARC: PASS**. In other clients, look for the `Authentication-Results` header. Repeat this for every sending service, not only your mailbox.

DMARC aggregate reports arrive as zipped XML files. They are hard to read by hand, so use a DMARC report analyzer.

## Common mistakes

- Two SPF records instead of one.
- A forgotten newsletter tool or CRM sending as your domain.
- More than 10 DNS lookups in SPF.
- Jumping straight to `p=reject` without monitoring, so legitimate mail disappears.
- Adding records at an old DNS host while the domain's nameservers point somewhere else.

## FAQ

### How long until the records start working?

Usually minutes to a few hours, depending on record TTL and DNS caching. If a checker still cannot see a record after a day, it was most likely added in the wrong place or with a typo.

### Do I need DMARC if I never send newsletters?

Yes. DMARC protects your domain from spoofing, making it harder for scammers to send mail in your name. Its reports also show who is really sending mail with your domain.

### Everything passes, but mail still lands in spam. Why?

Authentication is required but not sufficient. Deliverability also depends on domain and IP reputation, recipient complaints, content, links and domain age. A new domain should ramp up sending volume gradually.
