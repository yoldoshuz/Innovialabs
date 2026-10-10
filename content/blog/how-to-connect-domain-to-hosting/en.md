---
title: How to Connect a Domain to Your Hosting or Server
description: Two ways to point a domain to hosting: change the nameservers or edit A and CNAME records. Step-by-step settings, checking with dig and common mistakes.
summary: Either switch the domain's nameservers to your host and manage DNS there, or keep DNS where it is and add an A record with the server IP plus a CNAME for www, then verify with dig.
---
## The short answer: two approaches

Connecting a domain to hosting means telling DNS where to send visitors. There are two ways:

1. **Change the nameservers.** At the registrar you set your host's DNS servers, and from then on the host manages the whole zone and creates the records your site needs.
2. **Add records yourself.** Nameservers stay the same; in the current zone you add an **A record** with the server IP (plus **AAAA** if it has IPv6) and a **CNAME** for `www` or for a cloud platform.

| | Change nameservers | A/CNAME records |
|---|---|---|
| Where DNS lives | at the host | where it is now |
| How fast it applies | slower, usually up to a day or two | within the record TTL, often minutes |
| Email and other records | must be recreated in the new zone | stay untouched |
| Best when | everything is at one host, new domain | email, services or several servers already exist |

If the domain already has business email, the second approach is safer: you only change the website records and lose nothing.

## Approach 1: change the nameservers

1. Add the domain in your hosting panel ("Domains" or "Sites"). The nameservers are listed there or in the welcome email, for example `ns1.hosting.example` and `ns2.hosting.example`.
2. **Before switching**, check whether the domain has email and other records. If it does, create the same MX, TXT (SPF, DKIM, DMARC) and other records in the host's zone.
3. In the registrar's panel find "Nameservers" or "DNS servers", replace the old values with the new ones and save.
4. Wait for the change to spread. Nameserver updates go through the top-level zone and resolver caches, so they usually apply within a day or two.

## Approach 2: A and CNAME records

1. Get the server IP from your hosting or cloud panel. For cloud platforms (Vercel, Netlify and similar), take the values from their docs — every service has its own.
2. A day ahead, lower the TTL of the current records to 300 seconds so the switch happens faster.
3. In the domain's DNS zone, create or update the records:

| Type | Name | Value |
|---|---|---|
| A | `@` | `203.0.113.10` |
| AAAA | `@` | server IPv6, only if it has one |
| CNAME | `www` | `example.com.` |

4. Delete old A and AAAA records for the same names, such as the registrar's parking records.

**Important:** a CNAME cannot sit on the root domain (`@`), only on subdomains. If a platform asks for a root CNAME, use **ALIAS/ANAME** or **CNAME flattening** if your DNS provider supports it, or the A record the platform provides.

## Don't forget the server

DNS only brings visitors to the server. The server must know which site to serve:

- on managed hosting, add the domain and `www` to the site in the panel;
- on your own server, list the names in the web server config, for example in Nginx:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example;
}
```

Then issue an SSL certificate, otherwise browsers will show a warning.

## How to verify the result

```bash
dig NS example.com +short
dig A example.com +short
dig CNAME www.example.com +short
dig @8.8.8.8 A example.com +short
curl -I http://example.com
```

On Windows, `nslookup example.com 8.8.8.8` works instead of `dig`. Check from the command line and public resolvers: your browser and ISP may still show a cached old answer.

## Common mistakes

- **Switched nameservers and lost email** — MX and TXT were not copied to the new zone.
- **Two A records**, old and new. The site loads from one server, then from the other.
- **Forgot `www`** — the bare domain works but `www` does not, or the other way round.
- **A stale AAAA record** — IPv6 visitors still land on the old server.
- **Domain not added on the server** — DNS is correct but the host's placeholder page appears.

## FAQ

### How long until the domain starts working?
A and CNAME changes usually apply within the record's TTL. Nameserver changes take longer, typically up to a day or two.

### Can the domain, website and email all be with different providers?
Yes. That is exactly what the second approach is for: DNS stays in one place and records point to different services — A to the host, MX to the mail provider.

### Which approach is better for a beginner?
If the domain is new and everything will live at one host, switching nameservers is simpler. If email or other services already exist, changing only A and CNAME is more reliable.
