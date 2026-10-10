---
title: Google Penalties and Yandex Filters: How Sites Get Sanctioned
description: Manual actions vs algorithmic demotions, how Yandex filters Minusinsk, AGS and Baden-Baden work, and how to figure out which one hit your site.
summary: A site loses rankings either through a manual action that the search engine reports in its webmaster panel, or through an algorithm that silently demotes spam, paid links and over-optimized text. Check Search Console and Yandex Webmaster first, then match the drop date to your own changes.
---
## The short answer: two kinds of sanctions

Search engines sanction sites in two ways:

- **Manual actions** — a human reviewer checked the site and demoted it or removed pages. You learn about it from a notice in the webmaster panel.
- **Algorithmic demotions** — an automated system decided the site breaks the rules or is simply less useful than competitors. There is usually no notice, just a traffic drop.

The difference matters: a manual action is lifted through a reconsideration request, while an algorithmic demotion only goes away once the algorithm re-evaluates the fixed site.

## Google: manual actions and algorithms

**Manual actions** appear in Google Search Console under "Security & Manual Actions". Typical reasons:

- unnatural inbound or outbound links (paid, exchanged);
- hidden text and keyword stuffing;
- cloaking — showing different content to bots and users;
- auto-generated or scraped content with no added value;
- a hacked site or user-generated spam.

**Algorithmic demotions** come from ranking updates: core updates and spam updates. They do not "punish" a specific violation — they recalculate which pages are more useful. That is why a site can drop without breaking any rule.

## The main Yandex filters

| Filter | Triggered by | What happens |
|---|---|---|
| **Minusinsk** | Buying SEO links to manipulate rankings | The site is demoted |
| **AGS** | Low-quality content, sites built to sell links | Pages drop out of the index, outgoing links stop counting |
| **Baden-Baden** | Over-optimized text stuffed with keywords | Individual pages or the whole host are demoted |

Yandex also demotes sites for **manipulating behavioral signals**, for deceiving users (clickunders, malicious code) and for excessive ads. Violations are reported in Yandex Webmaster under "Diagnostics" → "Security and violations".

## How to tell what actually happened

1. **Check notices.** Search Console (manual actions, security issues) and Yandex Webmaster (security and violations). If both are empty, it is most likely an algorithm or a technical issue.
2. **Rule out technical causes.** An accidental `noindex`, a robots.txt block, URL changes without redirects or server downtime often look like a "filter" but are not.
3. **Find the drop date.** Match it against your site changes, link buying and the search engines' public update announcements.
4. **Check the scope.** Did the whole site drop or only certain pages? Baden-Baden, for example, can target only over-optimized pages.
5. **Compare search engines.** A drop only in Yandex points to its filters; a drop only in Google points to its algorithms or a manual action.

## How to recover

- **Links:** remove paid links where possible. For Google, the remaining spammy links can be disavowed with the Disavow tool.
- **Text:** rewrite pages for people — remove repeated keywords, hidden blocks and long "SEO text" at the bottom of pages.
- **Content:** delete or merge thin and copied pages.
- **Security:** clean up hacks and malicious code, update the CMS and passwords.
- **Request a review:** after fixing, submit a reconsideration request in Search Console or report the fix in Yandex Webmaster.

## Common mistakes

- Treating every traffic drop as a filter without checking the technical side.
- Removing all inbound links, including natural ones.
- Requesting a review after only partially fixing the issue.
- Repeating the same practices on a new domain — history repeats too.

## FAQ

### How long does it take to get out of a filter?

A manual action is lifted after a successful review; timing depends on the search engine's queue. An algorithmic demotion disappears when the algorithm re-evaluates the site, so there is no fixed timeline — what matters is fixing the cause completely.

### Can I be penalized for links a competitor bought?

Search engines say they can ignore most spammy links. If you notice a mass of suspicious links, watch the notices and use the Disavow tool in Google if needed.

### Does moving to a new domain help?

Usually not. If you move the same content and the same practices, the problem returns, and you lose the domain's accumulated history.
