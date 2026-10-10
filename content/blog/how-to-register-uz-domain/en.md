---
title: How to Register a .uz Domain: Requirements and Steps
description: Step by step .uz domain registration: choosing an accredited registrar, details for individuals and companies, renewal rules and common rejection reasons.
summary: A .uz domain is registered only through an accredited registrar: check the name is free, submit an application with accurate owner details, point it to working DNS servers, pay, and then renew on time.
---
## The short answer

The national .uz zone is run by a registry, while customers deal with **accredited registrars**. The process: choose a registrar, check that the name is available, fill in an application with accurate owner details, specify DNS servers, pay and wait for activation. After that, do not forget to renew.

The list of accredited registrars and the current zone rules are published on the registry's official site, cctld.uz. Check it before registering, as requirements can change.

## Step 1. Choose an accredited registrar

Registering through a random middleman is risky: if it is not accredited, it resells another registrar's service, and regaining control is harder when something goes wrong.

What to look for:
- the registrar is on the **official list** on the registry site;
- a convenient control panel for DNS, contacts and renewal;
- auto-renewal and expiry notifications;
- the renewal price, not just the first-year price;
- a formal contract if you are a company.

## Step 2. Check the name

Check availability with the WHOIS service on the registry or registrar site. Keep the general rules for second-level names in mind: Latin letters, digits and hyphens, with no hyphen at the start or end. Some names may be **reserved**, for example those linked to government bodies. If the name is for a brand, check trademarks in advance too.

## Step 3. Prepare the owner details

The domain owner is whoever is listed in the registry. That must be **you or your company**, not an employee, an agency or a friend.

| Owner | What is usually required |
|---|---|
| Individual | Full name, passport details, address, phone, email |
| Company | Full legal name, taxpayer number (STIR/INN), legal address, director details, contact person |
| Sole proprietor | Personal details and sole proprietor registration data |

The exact list is set by the registrar in line with the zone rules. Some ask for a scan of a signed application or of the company registration document. If you are a non-resident, ask your chosen registrar about the conditions in advance.

## Step 4. Specify DNS servers

During registration you need to provide the **DNS servers** that will serve the domain: your hosting provider's, the registrar's or a separate DNS provider's. They should be working and already configured for your domain, because incorrect delegation can delay activation.

You can check that the servers answer for the domain:

```bash
dig NS example.uz +short
dig @ns1.your-dns-provider.com example.uz SOA
```

## Step 5. Pay and wait for activation

After payment and verification the domain is activated. DNS changes do not spread across the internet instantly, so the site may not open for everyone right away.

## Renewal

- A domain is registered for a paid period, after which it must be **renewed**.
- Turn on **auto-renewal** and keep the owner's email up to date, since notifications go there.
- If you miss the renewal, the domain stops working, and after the grace period it can be released and taken by someone else. Exact timelines are in the zone rules and your registrar's terms.
- Renew early, especially if your site and email are business-critical.

## Common reasons for rejection and delays

- **Incomplete or inaccurate owner details**, or mismatches with documents.
- A typo in the company name or taxpayer number.
- The name is **taken, reserved** or breaks zone rules.
- **DNS servers not working** or not configured for the domain.
- The invoice is unpaid or the payment has not arrived.
- The name infringes someone's rights or contains prohibited words.

## FAQ

### Can I move a .uz domain to another registrar?

Yes, the zone rules allow changing registrars. Usually the domain must be paid up, the owner details must be current, and the owner must confirm the request. Ask the new registrar for the exact procedure.

### Can I change the owner of a .uz domain?

Yes, ownership can be transferred under the procedure set by the zone rules. As a rule, both the current and the new owner need to confirm it.

### Why does the site not open right after registration?

Most often because of DNS propagation: records update at different providers at different times. Also check that the DNS servers are correct and contain the records your site needs.
