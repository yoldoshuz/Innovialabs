---
title: What Is a Domain Name: Zones, Registrars and Ownership
description: How a domain name is structured, generic TLDs vs country zones like .uz, the roles of registry and registrar, and why your company must own its domain.
summary: A domain name is a human-friendly site address that you lease from a registry through a registrar; register it to your own company, because legally it belongs to whoever is listed as the owner.
---
## The short answer

Every server on the internet has a numeric **IP address** such as `203.0.113.10`. Numbers are hard to remember, so we use **domain names**, readable addresses like `example.com`. The **DNS** system translates the name into an IP address, and the browser finds the right server.

One key detail: you **do not buy a domain forever**. You get the right to use it for the registration term, usually from one year, and you renew it.

## How a domain name is structured

A domain reads right to left, from general to specific. Take `shop.example.uz`:

- **`.uz`** is the **top-level domain** (TLD, or zone).
- **`example`** is the **second-level domain**, the name you actually register.
- **`shop`** is a **subdomain**. You create these yourself in DNS settings, for free and in any number.

Technically every name also ends with a dot, the DNS root, but browsers do not show it.

## Types of zones

| Zone type | Examples | Notes |
|---|---|---|
| **Generic (gTLD)** | `.com`, `.net`, `.org` | International, open to almost anyone |
| **New generic** | `.app`, `.dev`, `.shop`, `.tech` | Thematic; some have special rules, such as mandatory HTTPS on `.app` and `.dev` |
| **Country code (ccTLD)** | `.uz`, `.kz`, `.de`, `.uk` | Tied to a country; registration rules are set by the national administrator |

**How to choose a zone:**

- If you mainly operate in Uzbekistan, **`.uz`** signals a local business and feels familiar to local users.
- If you target international markets, use **`.com`** or a fitting thematic zone.
- Consider registering your key name in several zones so competitors cannot take it, and redirect them to the main site.

## Registry and registrar: who does what

- **ICANN** is the international organization that coordinates the domain name system overall.
- A **registry** manages a specific zone and keeps its database. For example, Verisign operates `.com`, and the `.uz` zone is administered by the UZINFOCOM Center.
- A **registrar** is an accredited company through which you register a domain. It passes data to the registry, takes payment and gives you a control panel.
- A **reseller** is a registrar's partner, often a hosting provider, that sells domains on the registrar's behalf.

As the owner, you are the domain's **registrant** (in some zones called the administrator).

## Why the domain must be registered to your company

Legally, a domain belongs to whoever is listed as the registrant. A common story: a developer, a former employee or an agency registers the domain in their own name. While relations are good, nothing happens. But in a dispute or when a contractor leaves, the company can lose access to its own website and email.

**Owner's checklist:**

1. **The registrant is your legal entity,** not a private person or contractor.
2. **The registrar account** uses a corporate email that several responsible people can access.
3. **Two-factor authentication is on** for the registrar account.
4. **Auto-renewal is on** and the contact email is current, so reminders arrive.
5. **Credentials are documented** and kept in a corporate password manager.

If the domain is already registered to someone else, it can be transferred to a new registrant. The procedure depends on the registrar and zone and usually requires confirmation from the current owner.

## What happens if you do not renew

When a domain expires, it is usually not released immediately: the registrar suspends it and gives you time to renew. After that there may be a period when the domain can only be restored for an extra fee. If it is still not renewed, the name is released and anyone can register it. Exact timelines depend on the zone and registrar.

## FAQ

### Can I change my registrar?

Yes. Generic zones use a transfer procedure with an authorization code (auth code or EPP code) issued by the current registrar. Country zones may follow different rules. Transfers are often temporarily locked right after registration or a previous transfer.

### What is WHOIS?

A public database of domain information: registration date, expiry date, registrar and DNS servers. Personal details of individual owners are often hidden, but you can always check a domain's expiry and registrar via WHOIS.

### Is a subdomain a separate domain?

No. A subdomain is created inside your domain with DNS records and needs no separate registration or payment. For example, `blog.example.uz` can point to a completely different server than the main site.
