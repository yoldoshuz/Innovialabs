---
title: Hardening TLS: Protocols, Cipher Suites and an A+ SSL Labs Score
description: Which TLS versions and ciphers to disable, why forward secrecy and OCSP stapling matter, and how to read SSL Labs results and fix them in nginx.
summary: Allow only TLS 1.2 and 1.3, keep only ECDHE key exchange with AEAD ciphers, serve the full certificate chain and add HSTS — that combination removes the usual SSL Labs warnings and is the standard path to an A+ grade.
---

## The short answer

A hardened TLS setup comes down to four decisions:

1. **Protocols:** TLS 1.2 and TLS 1.3 only. SSL 2/3, TLS 1.0 and TLS 1.1 are formally deprecated and must be off.
2. **Ciphers:** only suites with **ECDHE** key exchange (forward secrecy) and **AEAD** encryption (AES-GCM, ChaCha20-Poly1305).
3. **Certificate:** a full chain (leaf plus intermediates) and a modern key — ECDSA P-256 or RSA of at least 2048 bits.
4. **HSTS:** a long-lived Strict-Transport-Security header. SSL Labs does not award A+ without it.

## What to disable and why

| Disable | Reason |
|---|---|
| SSLv2, SSLv3 | Broken by known attacks (POODLE and others) |
| TLS 1.0, TLS 1.1 | Deprecated, rely on weak constructions; SSL Labs caps the grade at B |
| RC4, 3DES, NULL, EXPORT, anonymous suites | Weak or no encryption, or no authentication |
| Static RSA key exchange (`AES128-GCM-SHA256` etc.) | No forward secrecy |
| CBC-mode suites | Not broken in modern stacks, but historically fragile; SSL Labs labels them weak |

TLS 1.3 removed all of these from the protocol, so its cipher list needs no tuning. Everything above applies to TLS 1.2.

## Forward secrecy

With **ECDHE** each connection uses a temporary key pair that is discarded afterwards. If the server's private key is stolen later, previously recorded traffic still cannot be decrypted.

Two things quietly weaken it:

- **Static RSA suites** left in the list for old clients.
- **Session tickets** encrypted with a key that is never rotated. Unless you rotate ticket keys, set `ssl_session_tickets off` and rely on the session cache.

## OCSP stapling

Browsers may check whether a certificate was revoked. With **OCSP stapling** the server fetches a signed revocation status from the CA and attaches it to the handshake, saving the browser a separate request and protecting user privacy.

Caveat: some CAs, including Let's Encrypt, have stopped running OCSP responders in favour of revocation lists. If your certificate has no OCSP URL, stapling does not apply, nginx will log a warning, and SSL Labs simply reports it as not available — this does not lower the grade.

## A working nginx configuration

This follows the "intermediate" profile popularised by Mozilla: secure and compatible with practically all browsers in use today.

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/ssl/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Only if your CA still provides OCSP
    # ssl_stapling on;
    # ssl_stapling_verify on;
    # resolver 1.1.1.1 8.8.8.8 valid=300s;

    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

`ssl_prefer_server_ciphers off` is intentional: every suite in the list is strong, so the client may pick the fastest one for its hardware (ChaCha20 on many phones). To generate a config for your exact server version, use the [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/).

Apply and verify:

```bash
nginx -t && systemctl reload nginx
openssl s_client -connect example.com:443 -tls1_1   # must fail
openssl s_client -connect example.com:443 -tls1_3   # must succeed
```

## Reading the SSL Labs report

Run the test on ssllabs.com and go through the report top to bottom:

- **Summary.** Grade plus yellow and red notes. The notes tell you exactly what capped the grade.
- **Certificate.** Look for "Chain issues: Incomplete" — fix by serving `fullchain.pem`, not only the leaf certificate.
- **Configuration → Protocols.** Anything other than TLS 1.2 and 1.3 marked "Yes" should be disabled.
- **Cipher Suites.** Lines marked WEAK or INSECURE come from your `ssl_ciphers` list.
- **Handshake Simulation.** Shows which real clients connect and with what. Use it to confirm you are not cutting off an audience you care about.
- **Protocol Details.** Check Forward Secrecy, OCSP stapling and Strict Transport Security.

## Common mistakes

- Editing one `server` block while another default block still serves old settings.
- Load balancer or CDN terminating TLS with its own settings — harden it there, not only on the origin.
- Setting a short HSTS `max-age` for testing and forgetting to raise it.
- Not reloading nginx after renewal hooks change certificate files.

## FAQ

### Will disabling TLS 1.0 and 1.1 break my site for some users?

Only for very old operating systems and browsers that have not received updates for years. Check the Handshake Simulation section and your analytics if you serve a specific legacy audience.

### Do I need to tune TLS 1.3 cipher suites?

Usually not. All TLS 1.3 suites are AEAD with forward secrecy, and the library defaults are safe.

### Why is my grade A but not A+?

In most cases HSTS is missing or its max-age is too short. Add a long-lived Strict-Transport-Security header once HTTPS works on the whole domain.
