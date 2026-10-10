---
title: Server Log File Analysis for SEO: How Bots Crawl Your Site
description: How to extract search bot hits from server logs, verify real Googlebot and YandexBot, and find wasted crawl and important pages bots miss.
summary: Server logs show which URLs Googlebot and YandexBot actually crawl: filter by user-agent, confirm bots with reverse DNS, and compare crawled URLs with your list of important pages.
---
## Why logs when you have Search Console

Search Console and Yandex Webmaster show samples and aggregates. A **server log** records every request: which URL, when, with what status code and from which bot. Only logs can tell you precisely:

- which sections bots crawl most and which they ignore;
- how many requests go to junk URLs: parameters, duplicates, redirects;
- whether bots see new and important pages, and how quickly;
- which URLs return 4xx and 5xx errors to bots.

## Step 1. Get and prepare the logs

Usually these are nginx or Apache access logs in combined format. You need: IP, timestamp, method, URL, status code, size and user-agent.

- Take at least several weeks of data — bots crawl unevenly.
- If a CDN or load balancer sits in front of the site, make sure the log stores the **real client IP**, not the proxy IP.
- Logs can contain users' personal data, so keep only bot lines for SEO analysis.

## Step 2. Filter bot requests

The command line is enough for a first look:

```bash
# Lines from Googlebot and YandexBot
grep -E "Googlebot|YandexBot" access.log > bots.log

# Top URLs by bot requests
awk '{print $7}' bots.log | sort | uniq -c | sort -rn | head -50

# Status code distribution
awk '{print $9}' bots.log | sort | uniq -c | sort -rn
```

For ongoing work, load logs into a dedicated log analyzer, a spreadsheet or a database and report by site section.

## Step 3. Verify the bot is real

User-agents are trivial to fake: scrapers and spam bots often claim to be Googlebot. Verification takes two steps:

1. **Reverse DNS** on the IP: the hostname must end in `googlebot.com` or `google.com` for Google, and `yandex.ru`, `yandex.net` or `yandex.com` for Yandex.
2. **Forward DNS** on that hostname must return the same IP.

```bash
host 66.249.66.1
# ... domain name pointer crawl-66-249-66-1.googlebot.com.
host crawl-66-249-66-1.googlebot.com
# ... has address 66.249.66.1
```

Google also publishes the IP ranges of its crawlers, which is handy for bulk checks; see [Google's documentation](https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot). Exclude requests that fail verification from your SEO analysis.

## Step 4. Find wasted crawl

Group URLs by pattern and see where requests go:

| What to look for | Sign of a problem |
|---|---|
| Parameter URLs | Sorting, filters, utm take a noticeable share of crawl |
| 301/302 redirects | Bots keep hitting old addresses and chains |
| 404 errors | Broken internal links or an outdated sitemap |
| 5xx errors | The server struggles under load or fails on certain templates |
| Technical URLs | Site search, cart, service pages |

Each cluster is a reason to fix links, block parameters in robots.txt, update the sitemap or speed up the server.

## Step 5. Find important pages bots miss

Take the list of URLs that should be indexed (from the sitemap or the site database) and compare it with the URLs in bot logs:

- **In sitemap, not in logs** — bots cannot find the page. Check internal links and click depth.
- **In logs, not in sitemap** — bots spend time on things you do not consider important.
- **Important pages crawled rarely** — add internal links from sections bots visit often.

Watch **response time** as well: when it grows, bots often reduce crawl rate.

## Common mistakes

- Skipping DNS verification, so fake bots end up in the report.
- A period too short — conclusions from a couple of days.
- Logs from only one server when several nodes sit behind a load balancer.
- Lumping all Google crawlers (images, ads, the main crawler) into one number.

## FAQ

### How often should logs be analyzed?

For large sites it makes sense to automate the report and review it regularly, and always after a migration, redesign or bulk URL changes. For small sites a one-off check is enough when you suspect indexing problems.

### Can I analyze logs if the site is behind Cloudflare or another CDN?

Yes, but you need the real client IP. Pass the original IP in a header and write it to the log, or use the CDN's own logs if your plan includes them.

### What matters more: the number of bot requests or their distribution?

Distribution. A high request count means nothing if it goes to duplicates and redirects. The goal is for most of the crawl to land on pages that should rank.
