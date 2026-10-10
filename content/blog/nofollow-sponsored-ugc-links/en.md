---
title: Nofollow, Sponsored and UGC Links: When to Use Each
description: What rel="nofollow", "sponsored" and "ugc" mean, how Google and Yandex treat them and which one to use for ads, comments and partner links.
summary: Use sponsored for paid and advertising links, ugc for links in comments and forums, and nofollow for any other link you do not vouch for. Regular editorial links need no attribute at all.
---
## The short answer

The `rel` attribute on a link tells the search engine how you relate to the page you link to:

| Attribute | When to use it |
|---|---|
| `rel="sponsored"` | Paid placements, ads, affiliate links |
| `rel="ugc"` | Links added by users: comments, forums, reviews |
| `rel="nofollow"` | Any link you do not want to endorse or associate with your site |
| no attribute | Regular editorial links you vouch for |

Values can be combined with a space: `rel="ugc nofollow"`.

## Where the three attributes came from

For a long time there was only `nofollow`. In 2019 Google added `sponsored` and `ugc` so site owners could describe a link's nature more precisely. At the same time, Google began treating all three as **hints** rather than strict commands: the search engine may still consider such a link in its analysis or use it to discover new pages.

For Google, `nofollow` is still acceptable for both ads and comments. The new values simply add precision.

**Yandex** documentation has historically focused on `nofollow`. To avoid depending on how each search engine interprets the newer values, it is convenient to mark ad links with `rel="sponsored nofollow"` — every engine will understand it the same way.

## Typical situations

**Paid article or banner.** Any link paid for with money, goods or services must have `sponsored` or `nofollow`. Without it, search engines see it as an attempt to buy rankings — a direct path to a manual action in Google and the Minusinsk filter in Yandex.

```html
<a href="https://partner.example/" rel="sponsored nofollow">Partner</a>
```

**Affiliate program.** Referral links to products are a commercial relationship too, so `sponsored` fits.

**Comments and forums.** If users can post links, apply `ugc` (or `ugc nofollow`) by default. It discourages spammers and protects your site's reputation. Links from trusted long-time members can later be left without an attribute.

**Source links in an article.** If you chose the source yourself and recommend it, no attribute is needed. Adding `nofollow` to every external link "just in case" is a bad habit: it makes the site look unnatural.

**Internal links.** Do not put nofollow on links to your own pages. It will not redistribute weight between pages, and the crawler will understand your site structure worse. If a page should not be indexed, use `noindex`.

## What these attributes do not do

- **They do not block indexing.** If other links point to the page, it can still be indexed. Use `noindex` for that.
- **They are not about security.** `noopener` and `noreferrer` are different `rel` values that protect users when a link opens in a new tab; they do not affect SEO.
- **They do not penalize the target site.** A nofollow link simply passes fewer signals or none at all.

## Site checklist

1. Find all paid and affiliate links and add `sponsored` to them.
2. Configure your CMS so links in comments and reviews automatically get `ugc`.
3. Remove nofollow from internal links and from editorial links to good sources.
4. Check templates: widgets and counters should not inject hidden paid links.
5. Write a rule for authors and the ad team so new content is marked up correctly from the start.

## FAQ

### Does a nofollow link bring any value?

It can bring visits and brand awareness. For ranking, Google treats it as a hint, so there is no guaranteed transfer of signals.

### What happens if a paid link is not marked?

The search engine may treat it as buying rankings. Both sides are at risk: the linking site and the site being linked to.

### Should I replace old nofollow links with sponsored and ugc?

It is not necessary: Google still supports nofollow. Using the new values for new links is enough.
