---
title: What Is an SSL Certificate: DV, OV and EV Types
description: What an SSL certificate proves, how DV, OV and EV validation differ, what a certificate authority is and which certificate a business site really needs.
summary: An SSL certificate proves a site belongs to whoever controls the domain and enables HTTPS encryption; DV checks only domain control, OV and EV also verify the organization, and encryption is identical across all three, so most sites need only DV.
---
## The short answer

An **SSL certificate** (technically TLS, but the old name stuck) is a digital document a server presents to the browser when it connects. It does two jobs:

- **Proves identity**: the browser confirms it is really talking to `example.com`, not an impostor.
- **Enables encryption**: everything between the visitor and the site — passwords, forms, payment details — cannot be read in transit.

Without a certificate, a site runs on plain HTTP and browsers label it "Not secure". Many modern browser features are also available only over HTTPS.

## Who issues certificates

Certificates are issued by **certificate authorities (CAs)**. Browsers and operating systems ship with a list of trusted root authorities. If a site's certificate is signed by one of them (usually through an intermediate certificate), the browser trusts it.

A self-signed certificate still encrypts, but browsers do not recognise it and show a warning. It is not suitable for a public website.

## Validation levels: DV, OV and EV

The real difference between types is **what the authority checked** before issuing.

| Type | What is checked | How it is issued | What visitors see |
|---|---|---|---|
| **DV** (Domain Validation) | Domain control only | Automatically, via a DNS record, a file on the site or email | Padlock and HTTPS |
| **OV** (Organization Validation) | Domain + the organization exists | Review of company documents | Padlock; organization details inside the certificate |
| **EV** (Extended Validation) | Domain + extended legal-entity checks | Stricter review of documents and contacts | Padlock; organization details inside the certificate |

The key point: **encryption is the same for DV, OV and EV**. The only difference is how much about the owner the authority has verified.

EV certificates used to show a prominent green bar with the company name. Major browsers dropped that, so today DV, OV and EV look almost identical to an ordinary visitor.

## Which certificate a business needs

For most sites, **DV**:

- landing pages, corporate sites, blogs;
- online stores where payments go through a payment provider;
- web apps and APIs.

You can get DV for free — for example from **Let's Encrypt** — with automatic renewal. Many hosts, CDNs and platforms such as Vercel or Cloudflare issue one for you with no effort on your side.

Consider **OV or EV** when:

- a regulator, partner bank or contract requires it;
- you need verified organization details in the certificate for corporate or B2B integrations.

## Other options

- **Wildcard** (`*.example.com`) covers all subdomains at one level. Handy when you have many subdomains.
- **Multi-domain (SAN)** covers several different domains with one certificate.

These are formats, not validation levels: wildcard and SAN certificates can be DV or OV.

## Common mistakes

- **Expired certificate.** The most common cause of sudden browser warnings. Set up auto-renewal and expiry monitoring.
- **Incomplete chain.** The server sends the certificate without the intermediate, so it works in some browsers and fails in others.
- **Mixed content.** The page loads over HTTPS but images or scripts load over HTTP. Browsers block them or drop the padlock.
- **No HTTP to HTTPS redirect.** Some visitors keep landing on the insecure version.
- **Wrong hostname.** Issued for `example.com`, but the site is opened at `www.example.com`. Include both names.

You can inspect a certificate by clicking the padlock, or with:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

## FAQ

### Is a free certificate worse than a paid one?

Not in terms of protection. A free DV certificate from Let's Encrypt encrypts exactly like a paid DV one. Paid options differ in validation level (OV, EV), validity period, support or the authority's warranties.

### Does HTTPS affect SEO?

Google has stated that HTTPS is a ranking signal, although a small one. The bigger effect is that without HTTPS browsers show a warning and some visitors leave.

### How often do I need to renew a certificate?

Public certificates have a limited validity period, and it keeps getting shorter. Rather than renewing by hand, set up automatic renewal through your host, CDN or an ACME client such as Certbot.
