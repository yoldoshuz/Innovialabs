---
title: How HTTPS Works: TLS Handshake, Certificates and Keys Explained
description: A step-by-step look at what happens between browser and server in HTTPS: the TLS handshake, certificate chain, key exchange and session keys.
summary: HTTPS is ordinary HTTP sent inside a TLS tunnel: during the handshake the server proves its identity with a certificate, both sides agree on fresh session keys, and from then on all traffic is encrypted and protected from tampering.
---

## The short answer

**HTTPS = HTTP + TLS.** Before the browser sends a single byte of your request, it runs a short negotiation with the server called the **TLS handshake**. The handshake does three jobs:

1. **Authentication** — the server proves it really owns the domain, using a certificate.
2. **Key exchange** — browser and server agree on a secret that nobody watching the network can compute.
3. **Session keys** — from that secret both sides derive symmetric keys that encrypt and protect every request and response.

After that, the usual HTTP traffic flows through the encrypted channel.

## The handshake step by step (TLS 1.3)

TLS 1.3 is the current version of the protocol and needs only one round trip before data can flow.

1. **ClientHello.** The browser sends the TLS versions and cipher suites it supports, a random value, the domain name it wants (the **SNI** field) and a **key share** — its half of a Diffie-Hellman key exchange.
2. **ServerHello.** The server picks a version and cipher suite and sends its own key share. At this point both sides can already compute the same shared secret, and everything after this message is encrypted.
3. **Certificate and CertificateVerify.** The server sends its certificate chain and signs the handshake transcript with its private key. This proves it holds the key that matches the certificate.
4. **Finished.** Both sides exchange a checksum of the whole handshake. If anyone altered a message along the way, the checksums do not match and the connection is dropped.
5. **Application data.** The browser sends the actual HTTP request, encrypted with the session keys.

The older **TLS 1.2** follows the same idea but needs two round trips and allows weaker options, which is why modern configurations prefer 1.3.

## How the certificate chain is checked

A certificate binds a domain name to a public key and is signed by a **Certificate Authority (CA)**. The browser does not trust the server's certificate directly. It walks a chain:

| Level | Who holds it | What the browser checks |
|---|---|---|
| **Leaf certificate** | Your server | Domain matches the Subject Alternative Name, dates are valid |
| **Intermediate CA** | Sent by your server alongside the leaf | Its signature on the leaf is valid |
| **Root CA** | Built into the OS or browser trust store | Its signature on the intermediate is valid |

If any link is missing or invalid — expired certificate, wrong domain, intermediate not sent, unknown root — the browser shows a full-page warning instead of the site.

## Why there are two kinds of keys

- **Asymmetric keys** (the certificate's public key and the server's private key) are slow and used only to prove identity.
- **Ephemeral Diffie-Hellman keys** are generated fresh for every connection and thrown away afterwards. This gives **forward secrecy**: even if the server's private key leaks later, recorded old traffic cannot be decrypted.
- **Symmetric session keys** (for example AES-GCM or ChaCha20-Poly1305) are fast and do the bulk encryption. They also add an authentication tag to every record, so tampering is detected.

## What HTTPS protects and what it does not

**Protected:**

- Contents of pages, forms, cookies, headers and the full URL path and query string.
- Integrity: nobody on the network can inject ads or scripts or modify downloads unnoticed.
- Server identity: you are talking to the holder of a valid certificate for that domain.

**Not protected:**

- The **domain name** is usually visible through SNI and DNS queries, and IP addresses are always visible.
- **Traffic size and timing** can still reveal patterns.
- HTTPS says nothing about whether the site is **honest**: phishing sites get certificates too.
- It does not protect data **on the server** or on an infected device — only in transit.

## Common mistakes

- Serving the leaf certificate without the intermediate: some browsers cope, others fail.
- Forgetting to renew certificates — automate it.
- Mixing HTTP resources (images, scripts) into an HTTPS page.
- Keeping old protocol versions enabled "for compatibility".

## FAQ

### Does the padlock mean a site is safe?

It means the connection is encrypted and the server holds a valid certificate for that domain. It does not tell you whether the owner of the site is trustworthy, so still check the domain name carefully.

### Is HTTPS slower than HTTP?

The handshake adds a small delay on the first connection, but TLS 1.3, session resumption and HTTP/2 or HTTP/3 (which effectively require encryption in browsers) usually make HTTPS sites as fast or faster in practice.

### Can my internet provider see which pages I open over HTTPS?

It can usually see which domain you connect to, but not the specific pages, search queries or form contents.
