---
title: How to Find Toxic Backlinks and Use the Disavow Tool
description: How to audit your backlink profile, spot spam patterns, decide when disavowing is actually needed and prepare a correct disavow file.
summary: Most sites never need to disavow — Google ignores spammy links on its own; disavow only links you bought or built yourself, or when you have a manual action for unnatural links.
---
## Do you need to disavow at all

Direct answer: **in most cases, no**. Google states openly that it can ignore random spammy links, and junk from odd sites usually does not hurt on its own. The disavow tool is a last resort.

Disavowing makes sense when:

- Search Console shows a **manual action** for unnatural inbound links;
- you or a previous contractor **bought links** or joined link schemes, and they cannot be removed;
- you see a massive wave of low-quality links together with a ranking drop that has no other explanation.

A careless disavow can hurt: if you disavow good links, the site loses their value.

## How to audit your backlink profile

1. **Export links.** In Google Search Console open the Links report and export external links. Add data from third-party SEO tools for completeness — each has its own index.
2. **Group by domain.** Domains are easier to review than individual URLs.
3. **Mark the obviously good ones** — media, partners, industry directories, well-known sites — and exclude them.
4. **Review the rest** against the spam signals below.
5. **Recall the history.** Were links bought, were there mass link blasts, who did SEO before.

## Signs of toxic links

| Signal | What it looks like |
|---|---|
| Irrelevant topic | casino, pharma or adult sites linking to a coffee shop |
| Site network | dozens of domains with the same template and texts |
| Commercial anchor | exact "buy windows Tashkent" from random sites |
| Generated content | incoherent text, machine translations |
| Link dumps | hundreds of outbound links on one page |
| Hacked sites | hidden links in the code of other people's pages |

One signal alone is not a reason. Be concerned when several **combine** and when there is a clear connection to paid links.

A "toxicity score" in third-party tools is that tool's estimate, not Google's opinion. Do not disavow links just because a report shows a high number.

## Try removal first

If a link exists because of a purchase or arrangement, first ask the site owner to remove it. This matters especially for manual actions: in a reconsideration request it helps to show that you tried to clean up the profile, not only disavowed.

## How to prepare the disavow file

The file is a plain `.txt` in UTF-8, one entry per line:

```text
# Paid links, removal failed
domain:spam-example.com
domain:another-spam.net

# A single page
https://forum-example.org/thread/123
```

Rules:

- `domain:` disavows all links from a domain — more reliable than listing URLs;
- lines starting with `#` are comments and are ignored;
- **one file per property** — a new upload replaces the previous one, so extend the existing file rather than uploading only new lines.

Upload it through Google's disavow links tool for the right property in Search Console. Details are in [Google's documentation](https://support.google.com/webmasters/answer/2648487). The effect is not instant: links are reprocessed as pages are recrawled.

Yandex Webmaster has no equivalent tool — Yandex decides on its own which links to count.

## Common mistakes

- Disavowing every link with a high "toxicity" score from a third-party tool.
- Uploading a new file without the old entries — previous disavows are lost.
- Wrong format: extra characters, a file not in UTF-8.
- Expecting an instant ranking boost after the upload.
- Disavowing without fixing the cause — and continuing to buy links.

## FAQ

### Can a competitor hurt me with spammy links?

Google says its systems usually ignore such links. If the attack is massive and you see a manual action or a clear link to a ranking drop, then preparing a disavow file makes sense.

### How often should I audit backlinks?

For most sites a periodic check, for example quarterly, is enough, plus an extra review after a sharp traffic drop or a change of SEO contractor.

### Can I undo a disavow?

Yes — upload an updated file without those lines or remove the file. Links will be counted again only after search engines reprocess the pages, which takes time.
