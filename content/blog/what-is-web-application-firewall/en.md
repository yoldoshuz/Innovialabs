---
title: What Is a Web Application Firewall (WAF) and Do You Need One
description: What a WAF blocks and what it cannot, cloud vs self-hosted options like ModSecurity, false positives, and when a WAF is worth it for a business website.
summary: A WAF is a filter in front of your site that inspects HTTP requests and blocks common attacks such as SQL injection and XSS. It lowers risk but does not replace updates or secure code, and it pays off mainly for sites with forms, user accounts, payments or high visibility.
---

## The short answer

A **Web Application Firewall (WAF)** is a firewall that works at the application level. It sits between visitors and your website and looks at the content of HTTP requests: the URL, query parameters, headers and form bodies. When a request looks like an attack, the WAF blocks it, rate-limits it or logs it.

A regular server firewall solves a different problem: it allows or denies connections by IP address and port, and does not care what is inside. A WAF reads the contents, which is why it can spot someone injecting SQL into your search box.

## What a WAF blocks well

- **Common injections**: SQL injection, XSS, OS commands smuggled into parameters.
- **Scanners and bots**: mass probing of paths like `/wp-admin` or `/.env`, known malicious user agents.
- **Brute force and abuse**: rate limiting on login pages, APIs and forms.
- **Known vulnerabilities**: many providers ship **virtual patches** — rules that shield a hole in a popular CMS before you have had time to update.
- **Application-layer DDoS** (L7): cloud WAFs are usually bundled with DDoS protection and can filter request floods.

## What a WAF cannot do

- **It does not fix your code.** Business logic flaws are invisible to it: a user changes an `id` in the URL and sees someone else's order. That request looks perfectly normal.
- **It does not stop weak passwords**, leaked keys or phishing of your staff.
- **It does not replace updates.** A virtual patch is a stopgap, not a reason to skip CMS and plugin updates.
- **It is useless if traffic goes around it.** If your origin server's real IP is known, attackers can hit it directly. Configure the server to accept traffic only from the WAF.
- **It needs to see decrypted traffic.** To inspect requests, the WAF must terminate TLS. Cloud services do this on their side, which matters when you handle sensitive data.

## Cloud or self-hosted

| Criterion | Cloud WAF | Self-hosted (e.g. ModSecurity) |
|---|---|---|
| How it connects | Change DNS, traffic flows through the provider | Web server module or separate reverse proxy |
| Getting started | Fast, managed rule sets | Installation and tuning required |
| Maintenance | Handled by the provider | Rule updates and log review are on you |
| DDoS protection | Usually included | Limited by your own server capacity |
| Data control | Traffic is decrypted at the provider | Everything stays in your infrastructure |

**ModSecurity** is an open-source WAF engine typically paired with the **OWASP Core Rule Set (CRS)**. It is flexible and free, but it takes experience: rules must be tuned to your specific application. The rule set documentation lives at [coreruleset.org](https://coreruleset.org/docs/).

## False positives

The main day-to-day pain of a WAF is **false positives**: a legitimate request that looks like an attack. Typical cases are a blog post with code samples saved from the admin panel, HTML from a rich text editor, or unusual characters in names.

How to roll it out without hurting the business:

1. Start in **monitoring mode** (log only).
2. Review logs for a week or two to see which rules fire on normal users.
3. Add narrow exceptions — for a specific URL and parameter, not by disabling a rule globally.
4. Switch to blocking mode and watch support requests and form conversion.
5. Repeat the review after major site changes.

## When a WAF is worth it

You most likely need one if:

- your site has **user accounts, payments or forms** collecting personal data;
- it runs on a **popular CMS** with plugins that are not always updated promptly;
- you have already dealt with bots, password guessing or DDoS;
- partners or regulators expect web application protection.

You can postpone it for a static brochure site with no forms or admin panel — HTTPS, updates and backups matter more there. That said, an entry-level cloud plan with DDoS protection often takes minutes to set up and rarely gets in the way.

## FAQ

### If I have a WAF, do I still need a penetration test?

Yes. A WAF stops common attack patterns, while a pentest looks for logic and configuration flaws that a filter will let through. The two complement each other.

### Will a WAF slow my site down?

Inspection adds a small delay. Cloud WAFs are often combined with a CDN, so thanks to caching the site may end up loading faster overall.

### Is the WAF from my hosting provider enough?

For a small site it is a good starting point. Check which mode it runs in and whether you can read logs and add exceptions — without that, dealing with false positives is hard.
