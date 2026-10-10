---
title: "How to Speed Up a WordPress Site: Practical Guide"
description: "Step-by-step WordPress speed-up: measure, audit plugins, enable caching, optimise images, clean the database, lighten the theme, update PHP, add object cache."
summary: Measure first, then remove unneeded plugins, enable page caching, compress images, update PHP, lighten the theme and add an object cache — and re-measure after every step.
---

## The short answer

WordPress does not get faster from one magic checkbox. It gets faster through a sequence of steps in the right order:

1. Measure the current speed.
2. Audit plugins.
3. Enable page caching.
4. Optimise images.
5. Update PHP and check hosting.
6. Lighten the theme.
7. Clean the database.
8. Add an object cache.

Re-measure after each step. That way you see what actually helped.

## Step 1. Measure the baseline

Without measurement, optimisation is guesswork. Use:

- **PageSpeed Insights** — lab data and, with enough traffic, real Core Web Vitals: LCP, INP, CLS;
- **the Network and Performance panels** in browser DevTools — which files load and what blocks rendering;
- **the Query Monitor plugin** — slow database queries and heavy hooks.

Measure several typical pages: home, an article, a product page. Write the results down so you have something to compare against.

## Step 2. Audit plugins

Each plugin can add scripts, styles and database queries to every page. Go through the list:

- **Remove** unused and overlapping plugins.
- **Replace** heavy plugins that do one small thing with a few lines of code in a child theme.
- **Check** whether a plugin loads its files on pages that do not need them (a form only belongs on the contact page).

Disable plugins one by one on a staging copy and watch Query Monitor.

## Step 3. Page caching

Without a cache, WordPress runs PHP and database queries on every visit. A **page cache** stores the finished HTML and serves it instantly.

- Use one caching plugin, not several — they conflict.
- If your host offers server-level caching (for example via nginx or LiteSpeed), it is usually more effective than a plugin.
- Exclude the cart, checkout and user account pages from the cache.

## Step 4. Images

Images are a frequent cause of slow LCP.

- Upload images at the size they are displayed, not camera originals.
- Use modern formats such as **WebP** or **AVIF**.
- Enable **lazy loading** for images below the fold, but not for the main hero image.
- Set width and height to avoid layout shifts (CLS).

## Step 5. PHP and hosting

- Move to a **current supported PHP version**. Newer versions are faster and safer. Test theme and plugin compatibility on staging first.
- Enable **OPcache** — it keeps compiled PHP code in memory.
- If the server responds slowly even with caching (high TTFB), the host may be overloaded or the project has outgrown its plan.

## Step 6. A lighter theme

Multipurpose themes and visual page builders often load lots of CSS and JavaScript on every page. Options:

- switch to a lightweight or block theme;
- disable unused builder modules;
- drop extra fonts and icon sets, load only the weights you use.

## Step 7. Database cleanup

Over time the database collects junk:

- post revisions;
- spam and trashed comments;
- expired **transients**;
- leftover data from removed plugins;
- a bloated `wp_options` table with many autoloaded options.

Limit revisions in `wp-config.php`:

```php
define( 'WP_POST_REVISIONS', 5 );
```

Always back up the database before any cleanup.

## Step 8. Object cache

An **object cache** (Redis or Memcached) keeps database query results in memory between requests. It is especially useful for stores, user accounts and pages that cannot be fully page-cached. It needs server support and a connector plugin.

## Common mistakes

- Running several optimisation plugins at once.
- Turning on aggressive JS combining and deferring without testing — it breaks features.
- Optimising only the home page.
- Chasing one score in a report instead of real user metrics.

## FAQ

### Which step gives the biggest effect?

Most often page caching and cutting plugins, but it depends on the site. That is why you measure first and find the main bottleneck.

### Does WordPress need a CDN?

If visitors are far from the server or the site serves a lot of static files, a CDN helps. For a local audience with a nearby server, the effect may be small.

### Can I speed up the site without touching the theme?

Yes, caching, images, PHP and a plugin audit often give a noticeable result. But if the theme itself is heavy, you will hit a ceiling without replacing it.
