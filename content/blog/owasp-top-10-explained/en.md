---
title: OWASP Top 10 Explained in Plain Language
description: All ten OWASP Top 10 categories with simple examples: what can go wrong in a web application and the one defense that addresses each risk first.
summary: The OWASP Top 10 is a list of the most common and dangerous classes of web application vulnerabilities. Start checking with access control, configuration, dependencies, injection and login.
---

## What the OWASP Top 10 is

**OWASP** is a nonprofit community focused on application security. Its **Top 10** ranks the most common and dangerous categories of vulnerabilities, based on data from real projects. The list is updated every few years; below is the 2025 edition. Numbering shifts between editions, but the risks themselves rarely go out of date.

It is not a standard or a complete checklist. Think of it as a map of where mistakes happen most often.

## The ten categories

### A01. Broken Access Control

**Example:** a user changes `/orders/1001` to `/orders/1002` in the URL and sees someone else's order. SSRF also lives here: tricking the server into requesting an internal address.
**Defense:** check permissions on the server for every request and deny by default.

### A02. Security Misconfiguration

**Example:** debug mode is on in production, the admin panel still uses the default password, a file bucket is public.
**Defense:** a hardening checklist for each environment and automated configuration checks.

### A03. Software Supply Chain Failures

**Example:** a popular npm package is compromised and malicious code ends up in your build.
**Defense:** lockfiles, dependency scanning for known vulnerabilities, fewer unnecessary packages.

### A04. Cryptographic Failures

**Example:** the site runs over HTTP and passwords are stored as MD5.
**Defense:** HTTPS everywhere, modern algorithms, slow hashes for passwords.

### A05. Injection

**Example:** SQL injection through a search field, or XSS through a comment.
**Defense:** parameterized queries and context-aware output encoding.

### A06. Insecure Design

**Example:** promo codes can be guessed without limits, and password recovery relies on a guessable "security question".
**Defense:** think through abuse cases at the design stage (threat modeling).

### A07. Authentication Failures

**Example:** the login form has no attempt limit, so an attacker replays leaked username and password pairs.
**Defense:** rate limiting, 2FA, checking passwords against breached lists.

### A08. Software or Data Integrity Failures

**Example:** the app installs updates without verifying signatures, or deserializes user-supplied objects.
**Defense:** verify signatures, secure the CI/CD pipeline, never trust serialized data from outside.

### A09. Security Logging and Alerting Failures

**Example:** a breach is discovered months later because nobody recorded failed logins.
**Defense:** log security events and alert on suspicious activity.

### A10. Mishandling of Exceptional Conditions

**Example:** when it errors, the authorization service lets the user through, and the error page shows a stack trace with server paths.
**Defense:** fail closed, show users a generic message, keep details in the logs.

## What to check first

Short on time? Start here:

1. **Access control:** can a user reach another user's data by swapping an ID?
2. **Production settings:** is debug off, are default passwords changed, are admin panels closed?
3. **Dependencies:** run `npm audit`, `pip-audit` or the equivalent for your stack.
4. **Input handling:** are all database queries parameterized?
5. **Login:** is there an attempt limit, and 2FA for admins?
6. **HTTPS and password storage.**

## Common mistakes

- Assuming the framework "handles security". It covers some risks but never your business logic.
- Enforcing permissions only in the UI. A hidden button does not stop a direct request.
- Running the checklist once and forgetting it. Security is an ongoing process.

## FAQ

### Is fixing everything in the Top 10 enough?

No. It is a baseline and a way to set priorities. For deeper verification there is the OWASP ASVS standard, plus audits and penetration tests.

### Who on the team needs to know this?

Developers, to avoid the mistakes in code; product owners, to budget time for security; QA engineers, to test abuse scenarios.

### Where is the official list?

On the [OWASP Top 10](https://owasp.org/www-project-top-ten/) project page, with a description of each category and links to detailed guides.
