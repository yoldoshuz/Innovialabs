---
title: Why Marketing Emails Go to Spam and How to Fix Deliverability
description: Why marketing emails land in spam: SPF, DKIM and DMARC, sender reputation, domain warm-up, list hygiene, Gmail and Yahoo bulk sender rules and content triggers.
summary: Emails go to spam when mailbox providers cannot verify the sender (no SPF, DKIM or DMARC) or do not trust it because of complaints, dead addresses and sudden volume spikes; the fix is domain authentication, gradual warm-up and a clean list.
---
## The short answer

Mailbox providers decide where your email goes by asking three questions:

1. **Is this really you?** Checked through SPF, DKIM and DMARC.
2. **Can you be trusted?** Your domain and IP reputation: complaints, bounces, sending history.
3. **Do people want this?** Do recipients open, reply or hit "spam"?

Content matters too, but usually less than the first two. If your campaigns suddenly started landing in spam, start with authentication and your list, not with rewriting subject lines.

## SPF, DKIM and DMARC in plain words

- **SPF** lists the servers allowed to send mail on behalf of your domain.
- **DKIM** is a digital signature: the receiver checks that the message was not altered and was sent by the domain owner.
- **DMARC** tells receivers what to do with mail that fails the checks and where to send reports. **Alignment** matters: the domain in the From field must match the domain that passed SPF or DKIM.

All three are DNS TXT records. An example for a domain that sends through an email service provider:

```dns
example.com.                 TXT  "v=spf1 include:_spf.esp-example.com ~all"
s1._domainkey.example.com.   TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkq..."
_dmarc.example.com.          TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

Your provider gives you the exact SPF and DKIM values. Key details:

- A domain must have **only one** SPF record; combine several services with multiple `include` entries.
- SPF has a limit on DNS lookups, so do not add services you no longer use.
- Start DMARC at `p=none`, read the reports, then tighten to `quarantine` and `reject`.

## Gmail and Yahoo bulk sender requirements

Since 2024, Gmail and Yahoo enforce mandatory rules for high-volume senders (for Google, roughly 5,000 messages a day to Gmail addresses):

- **SPF and DKIM** configured and a **DMARC** record published (at least `p=none`) with domain alignment;
- **one-click unsubscribe** via the `List-Unsubscribe` and `List-Unsubscribe-Post` headers, with unsubscribe requests honoured promptly;
- a low **spam complaint rate**: Google sets a threshold of 0.3% and recommends staying below 0.1%;
- valid forward and reverse DNS for sending IPs, and TLS connections.

Even if you send less, meet these rules anyway: they have become the baseline.

## Reputation and domain warm-up

Providers do not know a new domain or IP, and a sudden large send looks like spam. **Warm-up** means increasing volume gradually:

- start with your most engaged subscribers, those who opened and clicked recently;
- raise volume step by step while watching bounces and complaints;
- if complaints rise, hold at the current level.

Using a **subdomain** for marketing (for example, `news.example.com`) keeps campaign problems away from your business mail. **Google Postmaster Tools** helps you monitor reputation with Gmail.

## List hygiene

- Remove **hard bounces** immediately: a non-existent address is a strong negative signal.
- Use **double opt-in** so you do not collect typos and other people's addresses.
- Send a **re-engagement** campaign to inactive subscribers and remove those who do not respond.
- Never buy lists: they can contain **spam traps**, addresses created specifically to catch bad senders.

## Content red flags

- Misleading or shouting subject lines: all caps, lots of exclamation marks.
- An email that is a single image with no text.
- Shortened links and links to domains with a poor reputation.
- Heavy attachments instead of links.
- No clear sender, no company postal address, no unsubscribe link.

## FAQ

### How do I check whether SPF, DKIM and DMARC are set up?

Send an email to a Gmail inbox and open "Show original": it shows whether SPF, DKIM and DMARC passed. You can also inspect the DNS records with any online DNS lookup tool.

### Why do emails go to spam even though everything is configured?

Authentication only proves the email is from you. If recipients complain, ignore your emails or your list has many dead addresses, reputation drops. Reduce sending to inactive subscribers and check whether people actually expect your emails.

### Should I set DMARC to reject right away?

No. Start with `p=none` and collect reports: they reveal every service sending on behalf of your domain. Tighten the policy once you are sure legitimate mail passes.
