---
title: What Is WordPress and What Sites You Can Build with It
description: A plain explanation of WordPress: themes, plugins, the Gutenberg editor, hosting needs, strengths, limitations and typical projects it fits.
summary: WordPress is a free PHP and MySQL content management system that works well for blogs, company sites, landing pages and small stores, but fits complex business logic and heavy load less well.
---

## The short answer

**WordPress** is an open-source content management system (CMS). It is written in PHP, stores data in a MySQL or MariaDB database and gives you an admin panel where you can add pages, posts, images and menus without writing code.

There are two different products with the same name:

- **WordPress.org** — the free software you install on your own hosting and fully control.
- **WordPress.com** — a paid hosted service where the software runs for you, with features limited by plan.

When developers say "a WordPress site", they usually mean the first one.

## What a WordPress site is made of

### Core

The core handles users, content, the media library, URLs and updates. You never edit it directly — changes would be lost on the next update.

### Themes

A **theme** controls the look: page templates, styles, layout. Options include:

- **ready-made themes** — fast, but your site looks like thousands of others;
- **block themes** — customised right in the editor through Full Site Editing;
- **custom themes** — built for your design, slower to make but cleaner and lighter.

### Plugins

A **plugin** adds features: forms, SEO settings, caching, multilingual support, a store. The plugin directory is huge, and that is the platform's main strength. But every plugin is third-party code that affects speed and security.

### The Gutenberg editor

**Gutenberg** is the block editor introduced in WordPress 5.0. A page is assembled from blocks: paragraph, heading, image, columns, button. You can create custom blocks and patterns so editors cannot break the design.

## What you need to run it

- **Hosting with PHP and MySQL/MariaDB.** Shared hosting works for a small site; a VPS suits a project with real traffic.
- **A current PHP version** — newer versions are noticeably faster and still receive security fixes.
- **An HTTPS certificate** — the standard today.
- **Scheduled backups** of both database and files.
- **Caching** — without it, every page is rebuilt on every request.

## What sites it is used for

| Site type | Fit | Note |
|---|---|---|
| Blog, media | Excellent | What WordPress was built for |
| Company website | Good | Service pages, news, contacts |
| Landing page | Good | Especially with a block theme |
| Small store | Good | Via the WooCommerce plugin |
| Multilingual site | Fair | Requires a dedicated plugin |
| Service with user accounts | Weak | Logic quickly hits limits |
| High-load project | Weak | Needs serious optimisation |

## Strengths

- **Fast start.** A typical site can launch without custom development.
- **Friendly admin.** Content editors learn it quickly.
- **Huge ecosystem.** There is a plugin for almost any task.
- **Large talent pool.** Finding a developer for maintenance is easy.

## Limitations

- **Security depends on updates.** Outdated plugins and themes are a common entry point for attacks.
- **Performance.** A heavy theme plus a dozen plugins easily slows the site down.
- **Complex logic.** Non-standard flows, integrations and user dashboards turn into a pile of workarounds.
- **Plugin dependency.** An author may abandon a plugin, leaving you to find a replacement.

## Common mistakes

1. Installing a plugin for every small thing instead of a few lines of code.
2. Buying an "everything theme" with dozens of unused features.
3. Not updating core and plugins for months.
4. Running without backups.
5. Giving every employee administrator rights.

## FAQ

### Is WordPress free?

The software itself is free. You pay for hosting, a domain and sometimes premium themes, paid plugins and developer time.

### Can I build an online store on WordPress?

Yes, with WooCommerce. It works well for small and medium catalogues, but with a very large assortment and complex integrations it is worth considering specialised platforms.

### Is WordPress good for SEO?

Yes. It produces clean URLs, and plugins help with meta tags and sitemaps. But rankings depend mainly on content, speed and the technical quality of the site.
