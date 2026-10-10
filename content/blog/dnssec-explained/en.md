---
title: What Is DNSSEC and Should You Enable It
description: How DNSSEC signs DNS records to prevent spoofing, how the DS record chain of trust works, how to enable it at your registrar and what can break.
summary: DNSSEC adds digital signatures to DNS records so a resolver can verify the answer was not tampered with; enable it if your DNS provider and registrar support it without manual hassle, but handle the DS record carefully when changing providers.
---
## The short answer

**DNSSEC** is a DNS extension that adds **digital signatures** to records. A validating resolver can confirm that an answer came from the real zone owner and was not altered on the way. This protects against DNS spoofing and cache poisoning, where an attacker feeds users a different IP instead of yours.

Should you enable it? If your DNS provider signs the zone automatically and your registrar lets you add a DS record, yes: it is relatively cheap extra protection. The key is understanding what breaks if you change providers carelessly.

## What DNSSEC does not do

- It **does not encrypt** DNS queries. DNS-over-HTTPS and DNS-over-TLS handle that.
- It **does not replace HTTPS.** You still need a certificate.
- It **does not help** if an attacker gets into your registrar or DNS provider account. Protect those with two-factor authentication.

## How it works

A signed zone gets new record types:

| Record | Purpose |
|---|---|
| **DNSKEY** | The zone's public keys. Usually two: a key-signing key (KSK) and a zone-signing key (ZSK) |
| **RRSIG** | A signature for each record set (A, MX, TXT and so on) |
| **DS** | A hash of the KSK, stored in the **parent** zone (for example, the `.com` zone) |
| **NSEC / NSEC3** | Signed proof that a requested record does not exist |

## The chain of trust through DS

A signature alone proves nothing: an attacker could sign a forgery with their own key. That is why keys are linked into a **chain of trust**:

1. The resolver trusts the root zone key, which is built into its configuration.
2. The root zone holds a signed DS record for the top-level domain, such as `.com`.
3. The `.com` zone holds a signed DS record for `example.com`.
4. That DS record matches the hash of `example.com`'s DNSKEY.
5. That key signs every record in `example.com`.

If a signature fails at any step, a validating resolver returns **SERVFAIL** instead of an answer. That is what blocks spoofing, and it is also the main cause of outages.

## How to enable DNSSEC

1. **Check support.** Your top-level domain, registrar and DNS provider all need to support DNSSEC.
2. **Turn on signing at your DNS provider.** Usually a single toggle. The provider generates keys and shows the DS record details: key tag, algorithm, digest type and the digest itself.
3. **Add the DS record at your registrar.** Paste the values into the DNSSEC section. If DNS and registration are with the same provider, this step is often automatic.
4. **Verify** once the parent zone updates:

```bash
dig DS example.com +short
dig example.com A +dnssec
delv example.com A
```

A validating resolver should set the `ad` flag in the `dig +dnssec` response, and `delv` should report a fully validated answer. Online DNSSEC chain analyzers help too.

## What can break

- **Changing DNS providers.** The most common problem. If you switch nameservers while the old DS record stays at the registrar, validating resolvers see mismatched keys and the domain stops resolving for some users.
- **A wrong DS record.** A typo or wrong algorithm breaks the chain as soon as it is published.
- **Expired signatures.** RRSIGs have validity periods. Managed providers refresh them automatically; on your own DNS server it is your job.
- **Key rollovers.** Replacing the KSK requires updating the DS at the registrar in the correct order.

**Safe provider change:** remove the DS record at the registrar first, wait for its TTL in the parent zone to expire, then move the nameservers, enable signing at the new provider and add the new DS. A more advanced option that keeps protection on throughout is a migration with both key sets, if both providers support it.

## FAQ

### Does a small website need DNSSEC?

It is not mandatory, but it is useful protection, especially if the domain handles email, payments or logins. If your provider enables it in a couple of clicks, turn it on, and note in your project documentation that the DS record must be removed before any DNS provider change.

### Why does my site fail for some users after enabling DNSSEC?

Most likely the chain of trust is broken: the DS at the registrar does not match the zone's keys. Validating resolvers reject the answer while non-validating ones keep working, so only some users see the problem. Compare DS and DNSKEY and fix the mismatch.

### Does DNSSEC slow down my site?

DNS responses get larger because of signatures and the resolver does extra validation, but thanks to caching this is usually not noticeable to users in practice.
