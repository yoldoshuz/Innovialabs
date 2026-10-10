---
title: SSRF Attacks: How Server-Side Request Forgery Works
description: How a fetch-by-URL feature exposes internal services and cloud metadata, which tricks bypass naive filters, and how to defend: allowlists, isolation, IMDSv2.
summary: SSRF is a flaw where an attacker makes your server send a request to an address of their choosing, such as the internal network or the cloud metadata service. Defend in layers: URL allowlists, IP checks after DNS resolution, isolated egress and IMDSv2.
---

## What SSRF is

**SSRF (Server-Side Request Forgery)** is a vulnerability where an application sends an HTTP request from its server to an address supplied by the user. The attacker points it at something they cannot reach but the server can: `localhost`, the internal network, the cloud metadata service.

The server sits inside the perimeter, so its requests bypass the firewall and often authentication too: many internal services trust anything that comes "from inside".

## Where SSRF shows up

Any feature that accepts a URL and fetches something from it:

- uploading an avatar or image by link;
- link previews in chats and CMSs;
- webhooks with a user-defined target URL;
- PDF and screenshot generation from HTML (a headless browser loads resources from the page);
- importing feeds, RSS or files from an external URL;
- XML parsing with external entities (XXE often leads to SSRF).

## What an attacker can reach

| Target | Example address | What the attacker gets |
|---|---|---|
| Local services | `http://127.0.0.1:6379`, `http://localhost:9200` | Redis, Elasticsearch, admin panels without passwords |
| Internal network | `http://10.0.0.5/admin` | internal APIs, CI, monitoring |
| Cloud metadata | `http://169.254.169.254/` | temporary credentials of the server's role, config, user-data |
| Scanning | port sweeps | a map of internal infrastructure from timings and errors |

The most dangerous case is the **metadata endpoint**. On AWS, an instance gets temporary credentials for its IAM role at `169.254.169.254`. If the SSRF lets the attacker read the response, they walk away with keys and act in your cloud with the server's permissions.

Even **blind SSRF**, where the response is not returned, is useful to an attacker: they can scan the network and hit internal endpoints that change things.

## How filters get bypassed

Checking that the URL "does not contain `localhost` or `127.0.0.1`" does not work. Typical bypasses:

- **Alternative IP notation**: `2130706433`, `0x7f000001`, `0177.0.0.1`, `127.1`, `[::1]`, `[::ffff:127.0.0.1]`.
- **A domain that resolves to an internal IP** — one A record pointing to `127.0.0.1` in the attacker's own DNS is enough.
- **DNS rebinding**: the domain points to a public IP during validation and to an internal one during the actual request.
- **Redirects**: an allowed external URL answers `302` to `http://169.254.169.254/` and the HTTP client follows it.
- **Parser differentials**: `http://allowed.com@evil.com/`, backslashes, fragments — the validator and the HTTP client read the host differently.
- **Other schemes**: `file://`, `gopher://`, `dict://`, if the library supports them.

## How to defend

### 1. Allowlist, not blocklist

The best option is not to accept arbitrary URLs at all. If an integration talks to specific services, allow only their domains and the `https` scheme.

### 2. If you must accept arbitrary URLs

- Allow only `http` and `https` and standard ports.
- Resolve DNS yourself, check **every** resulting IP and reject private, loopback, link-local and reserved ranges.
- Connect to the validated IP itself instead of resolving the name again — this closes DNS rebinding.
- Disable automatic redirects or revalidate every hop.
- Do not return the raw response or detailed errors to the user; set timeouts and a size limit.

```python
import ipaddress, socket
from urllib.parse import urlparse

def resolve_public(url: str) -> set:
    u = urlparse(url)
    if u.scheme not in ("http", "https") or not u.hostname:
        raise ValueError("bad url")
    port = u.port or (443 if u.scheme == "https" else 80)
    ips = {ipaddress.ip_address(info[4][0])
           for info in socket.getaddrinfo(u.hostname, port)}
    if not all(ip.is_global for ip in ips):
        raise ValueError("internal address")
    return ips  # connect only to these IPs from here on
```

### 3. Network isolation

Code can be bypassed; the network is harder. Move fetching of external resources into a **separate service or egress proxy** with no route to the internal network or metadata. Add egress rules at the security group or firewall level, and put authentication on internal services even if they are "not exposed".

### 4. IMDSv2 and cloud permissions

On AWS, set **IMDSv2 to required**. It demands a token obtained first via a `PUT` request with a special header, which a plain `GET` through SSRF cannot do. Keep the hop limit low so containers cannot reach metadata unless they need to, and give the server an IAM role with minimal permissions. Other clouds also protect metadata with a mandatory header, but network isolation remains the main layer.

Detailed guidance: [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## FAQ

### Is a regex check on the domain enough?

No. The domain can resolve to an internal IP, and the validator and HTTP client may parse the same URL differently. You need to check the final IP the connection actually goes to.

### If the response is never shown to the user, is SSRF harmless?

No. Blind SSRF still lets an attacker scan the internal network and call internal endpoints that change data. The impact depends on what the server can reach.

### Does IMDSv2 fully solve SSRF?

No, it only stops credential theft from AWS metadata. Internal services and the network remain reachable, so you still need allowlists, IP checks and network isolation.
