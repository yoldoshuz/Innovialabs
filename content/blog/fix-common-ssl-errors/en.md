---
title: Common SSL Errors and How to Fix Them
description: How to diagnose and fix an expired certificate, a name mismatch, an incomplete chain, mixed content and redirect loops on an HTTPS website.
summary: Nearly every SSL problem comes down to five causes: the certificate expired, does not cover the site name, is served without its intermediate chain, the page loads resources over HTTP or HTTP and HTTPS redirect to each other in a loop.
---
## The short answer: five typical errors

| Browser symptom | Cause | Fix |
|---|---|---|
| `NET::ERR_CERT_DATE_INVALID` | certificate expired | renew and reload the web server |
| `ERR_CERT_COMMON_NAME_INVALID` | site name not in the certificate | reissue with the right names |
| fails only on some devices or in `curl` | incomplete chain | serve the full chain |
| "Not secure" or a warning on the padlock | mixed content | move resources to HTTPS |
| `ERR_TOO_MANY_REDIRECTS` | redirect loop | one place for redirects, correct proxy mode |

The exact messages differ between browsers, but the causes are the same.

Start by checking what the server actually serves:

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

It shows which names the certificate covers, who issued it and when it expires.

## 1. Expired certificate

**How to tell:** the `notAfter` date in the output above is in the past.

**Fix:**

- renew the certificate (for Let's Encrypt, `sudo certbot renew`);
- **reload the web server** — a common situation is a new file on disk while the server keeps serving the old one from memory;
- set up automatic renewal and external expiry monitoring.

If only one user sees the error, check the date and time on their device: a wrong clock produces the same message.

## 2. Name mismatch

**How to tell:** the `subjectAltName` list does not include the name the visitor opened. Classic case: the certificate is for `example.com`, but people visit `www.example.com`.

**Fix:**

- reissue the certificate with every name you need: `-d example.com -d www.example.com`;
- remember that a wildcard `*.example.com` covers neither `example.com` itself nor nested names like `a.b.example.com`;
- if several sites share an IP, make sure each `server_name` has its own certificate: on a mismatch the server falls back to the default site's certificate.

## 3. Incomplete certificate chain

**How to tell:** the site works in a desktop browser but fails on some phones, in `curl` or in integrations with errors like "unable to get local issuer certificate". Browsers sometimes complete the chain themselves; other clients do not.

```bash
openssl s_client -connect example.com:443 -servername example.com -showcerts </dev/null
```

If the output shows only one certificate, the intermediate is missing.

**Fix:** point your config at the full-chain file. For Let's Encrypt that is `fullchain.pem`. For a paid certificate, concatenate your certificate and the CA's intermediate into one file — yours first, then the intermediate.

```nginx
ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

## 4. Mixed content

**How to tell:** the certificate is fine, but the browser flags the page and the developer console shows **Mixed Content** warnings. An HTTPS page loads images, scripts or styles over `http://`.

**Fix:**

- change links to `https://` or relative paths;
- in a CMS, update the site address in settings and replace old URLs stored in the database;
- as a temporary safety net, add this header:

```nginx
add_header Content-Security-Policy "upgrade-insecure-requests";
```

It asks the browser to load resources over HTTPS, but a resource that is not available over HTTPS will still fail.

## 5. Redirect loops

**How to tell:** `ERR_TOO_MANY_REDIRECTS`. Trace the chain:

```bash
curl -sIL http://example.com | grep -i -E "^(HTTP|location)"
```

Typical causes:

- **A CDN or proxy in "Flexible" mode** (for example, in Cloudflare): the visitor arrives over HTTPS, the proxy talks to your server over HTTP, the server redirects to HTTPS — and round it goes. Fix: install a certificate on the server and switch to **Full (strict)**.
- **An app behind a proxy doesn't see HTTPS.** Pass the `X-Forwarded-Proto` header and configure the app to trust it.
- **Redirects configured in two places** — the web server and a CMS or plugin — that contradict each other (for example, `www` versus non-`www`). Keep one rule.

## FAQ

### I renewed the certificate, but the browser still shows the old date. Why?
Most often the web server wasn't reloaded or the config points to a different file. Less often a CDN in front of the site serves its own, separately managed certificate.

### How do I check the whole setup instead of one error at a time?
Use an online SSL configuration checker — it shows the chain, names, dates and protocols. From the command line, `openssl s_client` and `curl -v` cover the essentials.

### Can I just ask visitors to click "Proceed"?
No. It trains people to ignore warnings, and many browsers, apps and APIs won't let them proceed at all. The error has to be fixed on the server.
