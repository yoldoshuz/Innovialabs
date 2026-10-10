---
title: What Are Rich Snippets and How to Get Them
description: The types of rich results (ratings, prices, breadcrumbs, FAQ), the structured data behind them and why valid markup does not guarantee they show.
summary: A rich snippet is a search result with extra data such as star ratings, prices or breadcrumbs. You need valid Schema.org structured data (preferably JSON-LD) to get one, but the search engine still decides whether to show it.
---
## What a rich snippet is

A **snippet** is your site's block in search results: title, URL and description. A **rich snippet** (or rich result) shows more: a rating, a price, availability, a breadcrumb path, an event date.

Such a result takes up more space and answers part of the user's question right away. It does not raise your ranking by itself, but it helps you stand out from neighboring results.

Search engines take this data from **structured data** — special markup on the page based on the Schema.org vocabulary.

## Main types

| Type | What appears in results | Schema.org type |
|---|---|---|
| Ratings and reviews | Stars and number of ratings | `Review`, `AggregateRating` |
| Product | Price, availability, rating | `Product`, `Offer` |
| Breadcrumbs | A path instead of a long URL | `BreadcrumbList` |
| FAQ | Questions and answers under the snippet | `FAQPage` |
| Article | Date, author, image | `Article` |
| Organization | Logo, contacts | `Organization`, `LocalBusiness` |
| Events | Date and venue | `Event` |
| Recipes | Time, calories, photo | `Recipe` |

Keep in mind that Google keeps narrowing the set of types it displays. FAQ rich results, for example, are now shown only for a limited group of authoritative sites. Check the current documentation before implementing.

## Which markup format to use

There are three formats: **JSON-LD**, **Microdata** and **RDFa**. Google recommends JSON-LD because it sits in a separate block and does not mix with your HTML. Yandex supports Schema.org too, including JSON-LD.

A breadcrumb example:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Catalog", "item": "https://site.uz/catalog/" },
    { "@type": "ListItem", "position": 2, "name": "Laptops", "item": "https://site.uz/catalog/laptops/" }
  ]
}
</script>
```

## Step-by-step implementation

1. **Pick types** that match the page content: `Product` for a product page, `Article` for a blog post.
2. **Fill in required and recommended fields** from the search engine's documentation.
3. **Generate markup from the same data** the page displays — from the CMS or database, not by hand.
4. **Test** the page in Google's Rich Results Test and in the Yandex Webmaster structured data validator.
5. **Monitor the enhancement reports** in Search Console — they show errors and warnings across the whole site.

## Why you have markup but no rich snippet

Valid markup only makes a page **eligible** for a rich result. Display is not guaranteed because:

- the search engine decides whether a rich view improves a particular results page;
- some types are restricted to certain kinds of sites;
- the markup does not match the visible content;
- the page has not been recrawled since the change;
- the site has broader quality issues or policy violations.

## Common mistakes

- **Marking up content that is not on the page.** A rating or price in JSON-LD must be visible to users.
- **Self-serving reviews.** Google does not show stars for reviews a business publishes about itself in `Organization` and `LocalBusiness` types.
- **Identical markup on every page**, such as a templated FAQ.
- **Stale data:** the price on the page changed but the markup still has the old one.

Manipulative markup can lead to a manual action, after which rich results stop showing for the site.

## FAQ

### Does structured data affect rankings?

Not directly. It helps the search engine understand the content and can make your snippet more noticeable, which affects click-through rate.

### How long until a rich snippet appears?

There is no fixed timeline. The page must be recrawled first, then the search engine decides whether to show a rich view. Track the status in Search Console reports.

### Do I need separate markup for Yandex?

Usually not: Yandex understands Schema.org. It is enough to test the pages in its validator and make sure there are no errors.
