---
title: What Is HSTS and How to Enable It Safely
description: How HSTS stops SSL stripping, how to choose max-age and includeSubDomains, when to join the preload list and how to roll it out without breaking subdomains.
summary: HSTS is a response header that tells the browser to use only HTTPS for your domain for a set period, which blocks downgrade attacks; enable it gradually, raising max-age step by step and adding includeSubDomains and preload only after every subdomain works over HTTPS.
---

## The short answer

**HSTS (HTTP Strict Transport Security)** is a single response header:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

After a browser sees it over HTTPS, for the next `max-age` seconds it will:

- automatically turn every `http://` request to your domain into `https://` before anything leaves the device;
- refuse to let the user click through certificate errors on that domain.

## The attack HSTS prevents

A redirect from HTTP to HTTPS is not enough. When a user types `example.com` or follows an old `http://` link, the browser's **first request goes out unencrypted**. An attacker on the same Wi-Fi or a compromised router can intercept it and perform **SSL stripping**:

1. The attacker answers the user over plain HTTP.
2. Meanwhile it talks HTTPS to your real server and relays the pages.
3. The user sees a working site with no padlock and types a password, which the attacker reads.

With HSTS the browser never sends that first HTTP request, so there is nothing to intercept. The remaining gap is the very first visit, before the browser has seen the header — that is what the **preload list** closes.

## The directives

| Directive | What it does | Recommendation |
|---|---|---|
| `max-age` | How long, in seconds, the browser remembers the rule | Grow it gradually up to one year or two years |
| `includeSubDomains` | Applies the rule to every subdomain | Only after you have checked all subdomains |
| `preload` | Signals consent to be included in browsers' built-in lists | Only after a stable rollout; see below |

Browsers ignore the header when it arrives over plain HTTP, so it must be sent on HTTPS responses.

## A safe rollout plan

1. **Inventory subdomains.** DNS records, old admin panels, mail web interfaces, staging, internal tools, devices. Each must have a valid certificate and work over HTTPS.
2. **Start small:** `max-age=300` without `includeSubDomains`. Check the site, logins, payments, embedded widgets.
3. **Raise in steps:** one day (`86400`), one week (`604800`), one month (`2592000`). Watch error reports between steps.
4. **Add `includeSubDomains`** with a short max-age again, then raise it.
5. **Go to one year** (`31536000`) or two (`63072000`).
6. **Consider preload** only when you are sure the whole domain will stay on HTTPS.

If something breaks, send `max-age=0`. It clears the rule only for browsers that visit again — users who saw a long max-age and do not return stay locked to HTTPS until it expires. This is why the gradual steps matter.

## The preload list

Browsers ship a built-in list of domains that are HTTPS-only from the first visit. To submit a domain at hstspreload.org, it generally must:

- serve a valid certificate and redirect HTTP to HTTPS on the same host;
- serve all subdomains over HTTPS;
- send the header on the base domain with `max-age` of at least one year, plus `includeSubDomains` and `preload`.

Removal is possible but slow: it reaches users only with new browser releases. Treat preload as a long-term commitment for the entire domain, including subdomains you may create in the future.

## nginx setup and a common trap

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

- `always` makes nginx send the header on error responses too.
- If a `location` block has its own `add_header`, nginx **does not inherit** headers from the `server` level, and HSTS silently disappears there. Repeat it or move shared headers into an include file.

Verify:

```bash
curl -sI https://example.com | grep -i strict-transport-security
```

In Chrome you can inspect and delete a domain's stored policy at `chrome://net-internals/#hsts`.

## Common mistakes

- Enabling `includeSubDomains` with an HTTP-only intranet or legacy subdomain.
- Starting immediately with a one-year max-age.
- Submitting to preload "just in case" without planning for future subdomains.
- Setting the header only in the application, while static files and errors are served without it.
- Using `.dev` or `.app` for local development: these whole zones are preloaded, so they require HTTPS.

## FAQ

### Is a 301 redirect to HTTPS not enough?

No. The redirect itself travels over plain HTTP and can be intercepted. HSTS makes the browser skip the HTTP request entirely.

### What max-age should I end up with?

One year is a common target and the minimum for preload; two years is also widely used. Get there gradually, starting from minutes.

### Can I undo HSTS?

Yes, by sending max-age=0, but only browsers that visit again will forget the rule. For preloaded domains, removal from the list takes much longer.
