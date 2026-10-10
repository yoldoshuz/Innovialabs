---
title: How to Get Featured Snippets and Quick Answers
description: Paragraph, list and table snippets explained: how to structure content for each format and how to find queries where your site can win the quick-answer box.
summary: Find queries where you already rank in the top 10 and a quick answer is shown, then place a short, precise answer right under a question heading in the matching format: paragraph, list or table.
---

## How it works

A **featured snippet** (in Yandex, the quick-answer block above the results) is a fragment of a page that the search engine shows separately to answer a query without a click. The source is almost always chosen from pages that already rank high.

Hence the main rule: **a featured snippet is not a way into the top results, it is a way to take the best spot once you are there**. No tag or markup guarantees it — the search engine picks the fragment from your text.

## Three formats and how to write for them

| Format | Typical queries | How to format on the page |
|---|---|---|
| Paragraph | "what is", "why", "how long" | A 1–3 sentence definition right under the heading |
| List | "how to", "steps", "best ways" | An ordered or unordered list, each item starting with an action |
| Table | comparisons, pricing tiers, specs | A real HTML table with clear column headers |

### Paragraph

Phrase the heading as the user's question and make the first sentence after it a direct answer that stands on its own. Bad: "As mentioned above, it depends on many factors." Good: "A canonical tag tells the search engine which version of a page is the main one among duplicates."

### List

- Use `<ol>` or `<ul>` tags, not paragraphs that start with numbers.
- Keep items short: verb plus object.
- If there are many steps, the search engine shows some and adds "more items" — that is fine and can even increase clicks.
- H3 subheadings for each step can also be assembled into a list.

### Table

A comparison built as an image or a set of div blocks will not become a table snippet. You need `<table>` markup with a header row. Keep it compact and avoid merged cells.

## How to find opportunities

1. Open the queries report in **Google Search Console** or **Yandex Webmaster**.
2. Filter queries with an average position in the top 10.
3. Check the results manually (incognito, correct region): is there a quick answer and whose is it?
4. Note the format of the current answer — that is the format to write for.
5. Add questions from "People also ask" and autocomplete: they are ready-made headings.

Prioritize queries where a snippet exists but is weak: outdated, incomplete or vaguely worded.

## What to change on the page

- **A question heading** (H2 or H3) close to the query wording.
- **The answer immediately below it**, with no lead-in. Details come after.
- **Answer length**: short but complete. A definition cut off mid-thought is less likely to be chosen.
- **Facts, not filler**: concrete steps, terms, conditions.
- **Clean HTML**: text is not hidden in tabs loaded by a script after a click.
- **An FAQ block** with short questions and answers covers several related queries at once.

## Common mistakes

- The answer is buried in the fifth paragraph after a backstory.
- Steps are written as one long paragraph.
- The comparison is a screenshot of a table.
- Optimizing a page that is not in the top 10: you need to rank first.
- Expecting more traffic no matter what: sometimes users get the answer in the results and do not click. Choose queries where a short answer naturally leads to wanting more detail.

## If you want to remove a snippet

Sometimes a quick answer takes clicks away. Google supports the `nosnippet` directive, the `data-nosnippet` attribute for specific fragments and `max-snippet` to limit length. Use them deliberately: they also affect the regular description in results.

## FAQ

### Do I need structured data to get a featured snippet?

No. Featured snippets are built from page text. Schema.org markup helps search engines understand content, but it neither guarantees nor is required for this block.

### Why does my featured snippet appear and disappear?

Search engines regularly re-evaluate the choice: competitor content, query wording and algorithms change. Keep the answer current and track your position, not a single appearance.

### Can a new page win a featured snippet?

Yes, but usually only after it reaches the top 10. Start with queries where your site is already strong.
