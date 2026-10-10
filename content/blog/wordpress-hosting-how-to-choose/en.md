---
title: How to Choose Hosting for a WordPress Site
description: What to check when choosing WordPress hosting: PHP and database versions, managed versus regular hosting, caching, staging and backups.
summary: WordPress hosting should support current PHP and MySQL or MariaDB versions, offer page and object caching, a staging copy and automatic off-server backups. Managed WordPress saves maintenance time, while regular hosting or a VPS gives more control.
---

## The short answer

Good WordPress hosting passes five checks:

1. **Current PHP and database versions**, with the option to switch.
2. **Caching** at the server level, not just through a plugin.
3. **Staging** — a copy of the site for testing updates.
4. **Automatic backups** stored off the server, with easy restore.
5. **SSH and WP-CLI access**, so you are not tied to the control panel alone.

The type of hosting — managed WordPress, regular shared or a VPS — depends on how much maintenance you are willing to take on.

## Technical requirements

WordPress runs on **PHP** with a **MySQL** or **MariaDB** database and needs HTTPS support. Recommended versions change over time, so check the official [WordPress requirements](https://wordpress.org/about/requirements/) page and choose hosting where you can switch the PHP version yourself.

What else to look at:

- **PHP extensions**: mysqli, curl, mbstring, xml, zip, intl, plus imagick or gd for image processing.
- **PHP limits**: memory_limit, max_execution_time, upload_max_filesize. Heavy plugins, page builders and online stores need more memory.
- **OPcache** — the compiled PHP code cache; it should be enabled.
- **Number of PHP workers**: this determines how many uncached requests the site can handle at once.

You can check the current configuration in the dashboard under Tools → Site Health.

## Managed WordPress, shared or VPS

| | Shared hosting | Managed WordPress | VPS |
|---|---|---|---|
| Who maintains the server | Provider | Provider, tuned for WordPress | You |
| Caching | Depends on the plan | Usually built in | You set it up |
| Staging and backups | Not always | Usually one click | You set them up |
| Limitations | Resources shared with neighbors | Some plugins may be banned | Only the server's resources |
| Fits | Brochure sites and small blogs | Business sites and stores without their own admin | Projects with special requirements and a team |

## Caching

Without a cache, WordPress runs PHP and queries the database for every request. The layers of caching:

- **Page cache** — ready-made HTML is served without running PHP. Best done at the server level: Nginx FastCGI cache, Varnish or LiteSpeed with its plugin.
- **Object cache** — Redis or Memcached store database query results. Especially useful for stores and sites with user accounts, where page caching is limited.
- **OPcache** — speeds up PHP execution itself.
- **CDN** — serves images, CSS and JS from servers close to the user.

Ask the provider which of these layers are available on your plan.

## Staging and backups

**Staging** lets you update core, the theme and plugins on a copy and only then move changes to the live site. One important catch: pushing the database from staging to production overwrites new orders, comments and inquiries that arrived in the meantime. For stores, push only files or use selective sync tools.

Backup requirements:

- automatic, at least daily;
- stored **off the main server**;
- a clear retention period;
- restore in a few clicks;
- a regular test restore.

Keep your own copy that does not depend on the host as well. With WP-CLI it takes a couple of commands:

```bash
wp core version
wp plugin list --update=available
wp db export backup.sql
wp search-replace 'https://staging.example.com' 'https://example.com' --dry-run
```

## Common mistakes

- Choosing the cheapest plan without checking backups and the PHP version.
- Relying only on a caching plugin on an overloaded shared server.
- Updating plugins directly on the live site.
- Keeping the only copy of the site with the same provider.
- Sending email through the server's PHP mail function instead of SMTP or a transactional service — those messages land in spam more often.

## FAQ

### Does a small site need managed WordPress?

Not necessarily. For a brochure site or a blog, good shared hosting with current PHP, backups and SSL is enough. Managed hosting pays off when the site makes money and no one is available to look after updates, security and performance.

### Where should I host a WordPress site for an audience in Uzbekistan?

Close to your users, which lowers latency. If the site collects personal data, such as inquiries with names and phone numbers, keep in mind the requirement to store it on servers in Uzbekistan.

### How do I know my current hosting is not coping?

Signs include slow server response even on cached pages, 502 and 503 errors during traffic spikes and warnings about exceeded resource limits. Check caching and heavy plugins first; if that does not help, move to a plan or hosting type with more resources.
