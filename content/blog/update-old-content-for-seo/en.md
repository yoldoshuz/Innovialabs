---
title: How to Update Old Content to Regain Rankings
description: How to find articles losing traffic, decide whether to update, merge or delete them, and what to change so an update actually moves rankings.
summary: Find pages with falling impressions and clicks, identify the cause, then rewrite for the current intent, merge duplicates with a 301 or remove useless pages — simply changing the date will not bring rankings back.
---

## Why old articles lose rankings

An article that once ranked well tends to slip over time. The main reasons:

- **Outdated facts**: prices, versions, regulations, interface screenshots.
- **Shifted intent**: people now want a step-by-step guide or a comparison instead of theory.
- **Better competitors**: more complete, better structured, more current.
- **Cannibalization**: several of your pages compete for the same query.
- **Technical issues**: broken links, slow loading, pages dropping out of the index.

An update works only if it fixes the specific cause.

## How to find decaying pages

1. In **Google Search Console**, open the Performance report and compare two periods of equal length (for example, the last three months against the same months a year ago to account for seasonality).
2. Sort pages by the drop in clicks and impressions.
3. Do the same in **Yandex Webmaster** in the queries section.
4. In web analytics, check organic traffic to those URLs.
5. For each page, look at the queries: which positions fell and who now ranks above you.

Separately flag pages with many impressions but low CTR: their problem is often the title and description rather than the text.

## Update, merge or delete

| Situation | Decision |
|---|---|
| Topic is relevant, page brings traffic but is declining | **Update** |
| Several articles answer the same question | **Merge** into one, 301 the rest to it |
| No traffic, links or value, topic is dead | **Delete** (410 or 404) or exclude from indexing |
| Outdated, but external sites link to it | Update, or redirect to the closest relevant page |
| Useful to people but not to search (e.g. archived news) | Keep it, add `noindex` if needed |

When merging, carry everything valuable into the final article and redirect to a relevant page, not to the homepage.

## What to change so the update works

### Check the intent

Look at the results for the main query. If the top pages are step-by-step guides and yours is an essay, restructure the format. That change usually matters more than adding new paragraphs.

### Update the substance, not the date

- Fix outdated facts, examples and screenshots.
- Add sections covering questions from "People also ask" and autocomplete.
- Cut filler and repetition: shorter and more precise often beats longer.
- Give a direct answer at the start of the article.

### Title and description

Rewrite the title and meta description for the current query. This matters most for pages with high impressions and low CTR.

### Internal links

- Link to the updated article from new and strong pages on your site.
- Check and fix broken links inside the article.
- Remove competing links with the same anchor pointing to different pages.

### Technical details

- Keep **the same URL** — changing it without need only adds risk.
- Update `dateModified` in structured data and `lastmod` in the sitemap.
- Request recrawling through the URL inspection tools in Search Console and Yandex Webmaster.

## Common mistakes

- Changing only the publication date — search engines compare content, not the number.
- Rewriting the whole article and throwing away what ranked well.
- Updating dozens of pages at once: afterwards you cannot tell what worked.
- Judging results after a few days. Search engines need time to recrawl and re-evaluate, so compare data after several weeks.

## How to run the process

Keep a spreadsheet: URL, last update date, main query, traffic before and after, decision taken. Once a quarter, go through the pages with the biggest drops. That turns updating into routine work instead of a scramble after a decline.

## FAQ

### How often should articles be updated?

There is no fixed interval. Update when traffic drops, facts become outdated or the search results change. Evergreen content can be reviewed less often; topics involving prices or versions, more often.

### Should I change the publication date after an update?

Show an updated date if the changes are substantial. Changing the date without changing the content is useless and misleads readers.

### Is it risky to delete old articles?

Removing pages with no traffic, links or value is usually safe and simplifies the site. Before deleting, check external backlinks and internal links — if there are any, a 301 to a closely related page is the better choice.
