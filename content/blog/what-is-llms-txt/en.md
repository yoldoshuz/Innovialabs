---
title: What Is llms.txt and Does Your Website Need One
description: llms.txt is a proposed file that briefly describes a website for language models. Learn its format, who reads it, its limits, and a minimal example.
summary: llms.txt is a Markdown file at the site root that summarizes the project and links to key pages for language models; it is a voluntary proposal, not a standard, and major search engines have not officially confirmed supporting it.
---
## What llms.txt is

**llms.txt** is a Markdown text file placed at `/llms.txt` in the site root. It briefly explains what the project is and lists links to the most important pages with short notes.

The idea was proposed in 2024 as a way to help language models understand a site quickly. HTML pages are cluttered with menus, scripts and ads, while a model's context window is limited. A short structured file solves this: the model gets a "table of contents" in a format it can easily use.

Important: this is a **community proposal**, not a W3C or IETF standard and not a search engine requirement.

## How it differs from robots.txt and sitemap.xml

| File | Audience | What it does |
|---|---|---|
| robots.txt | search crawlers | controls crawling |
| sitemap.xml | search crawlers | lists URLs for indexing |
| llms.txt | language models and AI tools | briefly explains what the site is about and where the key content is |

llms.txt neither allows nor blocks anything. It does not replace robots.txt: if you want to restrict AI crawlers, you do that in robots.txt.

## The file format

The specification defines a simple structure:

1. **An H1 with the project name** — the only required element.
2. **A blockquote** with a short summary.
3. Optional paragraphs with details.
4. **H2 sections** with lists of links in the form `[name](url): note`.
5. An **Optional** section — links that can be skipped when context is limited.

A minimal example:

```markdown
# Example Studio

> A development studio: websites, mobile apps and integrations for business.

## Services

- [Web development](https://example.com/services/web): websites and web apps
- [Mobile apps](https://example.com/services/mobile): iOS and Android

## Contacts

- [Contact us](https://example.com/contacts): request form and address

## Optional

- [Blog](https://example.com/blog): articles about development
```

The proposal also describes an extended **llms-full.txt** with full documentation text, and Markdown versions of pages at the same URL with `.md` appended.

## Who actually reads it

It is worth being honest here:

- Major search engines and AI assistants have **not officially confirmed** using llms.txt for crawling or ranking.
- The file is most useful where it is handed to a model **directly**: a developer gives a coding assistant a link to llms.txt, or documentation tools load it as context.
- Some documentation platforms can generate llms.txt automatically.

In other words, the file works when someone deliberately uses it, not as a search signal.

## Does your site need one

**It makes sense** if:

- you have technical documentation, an API or an SDK that developers use through AI tools;
- the site is large, and a short map of the essentials genuinely helps;
- creating the file takes an hour and needs no complex maintenance.

**There is no rush** if you have a small brochure site: the effect on search visibility is unproven.

Either way, llms.txt **does not replace** the basics: crawlable HTML, a clear structure, structured data and quality content. Those are what help both classic and AI search.

## Common mistakes

- Expecting a traffic boost right after publishing the file.
- Copying the whole site into it: the point is brevity.
- Forgetting to update links after structural changes.
- Listing pages that are blocked from crawling.

## FAQ

### Will llms.txt affect rankings in Google or Yandex?

There is no evidence of that. Search engines have not officially stated that they use llms.txt, so treat it as an extra tool, not a ranking factor.

### Can llms.txt stop AI from using my site's content?

No. The file does not block anything. To restrict AI crawlers, use robots.txt rules for their user agents.

### How many links should it include?

Only the key ones: main sections, core services or products, documentation and contacts. Move secondary pages into the Optional section.
