---
title: Wildcard vs Multi-Domain SSL: When You Need Each
description: Which names wildcard and SAN certificates cover, how DNS validation works for wildcards and how to plan certificates for dozens of subdomains.
summary: A wildcard *.example.com covers any single-level subdomain but not the bare domain or nested names; a multi-domain SAN certificate covers an explicit list of names, even across domains. You can combine them, and the choice depends on how often new names appear and where the key lives.
---
## The short answer

- **Wildcard** (`*.example.com`) — one certificate for all subdomains **at one level** of one domain: `shop.example.com`, `api.example.com` and any new ones.
- **Multi-domain, or SAN certificate** — an explicit list of names in the Subject Alternative Name field: `example.com`, `www.example.com`, `example.uz`, `brand.org`. The domains can differ.
- They are not mutually exclusive: a single SAN certificate can hold regular names and several wildcards.

| | Wildcard | SAN |
|---|---|---|
| New subdomains | covered without reissuing | reissue needed |
| Different domains | no | yes |
| Bare `example.com` | only if added as a separate name | yes, if listed |
| Validation | usually DNS only | HTTP or DNS |
| Name visibility | certificate shows only `*.example.com` | every name is public |

## Coverage rules

- The asterisk replaces **exactly one label**, and only the **leftmost** one. `*.example.com` matches `a.example.com` but not `a.b.example.com`.
- A wildcard **does not cover the bare domain**. For both `example.com` and its subdomains to work, add both names to the certificate.
- Partial patterns like `api-*.example.com` are not issued by certificate authorities.
- A second level needs its own wildcard: `*.eu.example.com`.
- EV certificates are not available as wildcards.
- The number of SAN names is limited by each CA's rules. Let's Encrypt allows up to 100 names per certificate.

## DNS validation for wildcards

Let's Encrypt issues wildcards only via the **DNS-01** challenge: the CA gives you a token, you publish it in a TXT record at `_acme-challenge.example.com`, and the CA checks it. Paid CAs also usually validate wildcards via DNS or email.

You can do this by hand with `--manual`, but such a certificate will not renew itself. The right way is a plugin for your DNS provider's API, for example Cloudflare:

```bash
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  -d example.com -d '*.example.com'
```

```ini
# /root/.secrets/cloudflare.ini, permissions 600
dns_cloudflare_api_token = <token with Zone:DNS:Edit for this zone only>
```

Things to know:

- `example.com` and `*.example.com` are both validated at the **same name**, `_acme-challenge.example.com`, so two TXT records will exist there at once. That is expected.
- **Scope the token** to one zone and DNS edits only. An account-wide key sitting on a web server is unnecessary risk.
- **CNAME delegation.** You can make `_acme-challenge.example.com` a CNAME to a name in a separate utility zone that your automation controls. The server then never gets rights to your main zone.
- Validation can fail if the TXT record has not reached every authoritative server yet. Plugins have a propagation wait setting.

## Planning certificates for many subdomains

Group names not by convenience but by **where the private key lives and who is responsible for it**.

**Choose a wildcard when:**

- subdomains are created automatically, such as `client1.app.example.com` per customer;
- TLS terminates in one place — a load balancer, ingress or reverse proxy;
- you prefer not to reveal subdomain names: SAN names appear in public Certificate Transparency logs, while a wildcard shows only the pattern.

**Choose SAN or separate certificates when:**

- one project uses different domains — `example.com`, `example.uz`;
- services run on different servers or are managed by different contractors;
- there are few names and they rarely change.

**A workable layout:**

1. `example.com` + `www.example.com` — a regular two-name certificate.
2. `*.app.example.com` — a wildcard on the load balancer for customer subdomains.
3. `*.staging.example.com` — a separate certificate and key for staging, never shared with production.
4. Internal services — their own certificates or an internal CA.
5. An inventory of all certificates plus external expiry monitoring. In Kubernetes, cert-manager handles issuing and renewal well.

## Common mistakes

- Expecting `*.example.com` to cover `example.com` or `a.b.example.com`.
- Copying one wildcard key to every server, contractors included: a leak in one place compromises every subdomain.
- Issuing a wildcard manually and forgetting that it will not renew itself.
- Packing unrelated projects into one SAN certificate: if one domain moves away or fails validation, renewal of the whole certificate breaks.

## FAQ

### Which is cheaper, wildcard or SAN?
With Let's Encrypt both are free. With paid CAs it depends on the pricing model: SAN is often charged per name, a wildcard per pattern. Compare based on how many names you expect to have a year from now.

### Can I get `*.*.example.com`?
No. Each level needs its own wildcard, but several such patterns can go into one SAN certificate.

### Can I get a wildcard with HTTP validation?
Not with Let's Encrypt — only DNS-01. Plan your DNS automation before you need a wildcard.
