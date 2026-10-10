---
title: "E-commerce SEO: Optimizing Category and Product Pages"
description: How to optimize online store categories and product pages - category text, filters, unique descriptions, out-of-stock items, Product markup and reviews.
summary: Target broad queries with categories and specific models with product pages; control filter indexing, write your own descriptions, keep temporarily unavailable items live and add Product markup with reviews.
---

## The essentials

An online store has two main page types, each with its own job:

- A **category page** captures broad queries: "running shoes", "Samsung refrigerators".
- A **product page** captures precise queries: a specific model, SKU, or model plus a feature.

Most store SEO problems come down to filter duplicates, identical supplier descriptions and poor handling of out-of-stock items.

## Category pages

### Text

Category text isn't there "for the robot" — it should help people choose. A short block works well:

- how product types in this category differ;
- what to look at when choosing;
- answers to 2–3 common buyer questions.

Place the main text **below** the product grid so it doesn't push the catalog down. At the top, an H1 and a sentence or two are enough.

### Title and H1

A category title combines the main query with a commercial modifier: "Running Shoes — Buy in Tashkent". The H1 is shorter and simpler: "Running Shoes".

### Filters

Filters generate thousands of URLs with near-identical content. The rule is simple:

| Filter page type | What to do |
|---|---|
| Has its own demand ("Nike running shoes") | Make it a full landing page: own URL, title, H1, text |
| No demand (sorting, price ranges, 3+ filter combinations) | Keep out of the index, canonical to the category |

Don't open every combination — it bloats the index with thin pages and wastes crawl budget.

### Pagination

Pages like `?page=2` and `?page=3` should stay crawlable so search engines find products deep in the catalog. Don't canonicalize them to page one — their content is different.

## Product pages

### Unique descriptions

The supplier's description already sits on dozens of sites. Your own description gives search engines a reason to show you. What to add:

- who the product is for and which tasks it suits;
- how it differs from neighboring models;
- real specifications in a table;
- answers to questions customers ask your managers.

With thousands of products, start with those that bring the most sales and impressions.

### Out-of-stock products

| Situation | Solution |
|---|---|
| Temporarily out of stock | Keep the page, show the status and similar products |
| Discontinued, replacement exists | 301 redirect to the new model or category |
| Discontinued, no replacement | Return 404 or 410, or keep the page with a note if it has lots of traffic and links |

The biggest mistake is deleting a product page every time stock hits zero and recreating it on restock. Accumulated rankings get lost.

### Product markup

Structured data helps search engines understand price, availability and rating, and can earn a rich result. A minimal example:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Example Run 2 Running Shoes",
  "image": "https://example.com/img/run2.jpg",
  "offers": {
    "@type": "Offer",
    "price": "650000",
    "priceCurrency": "UZS",
    "availability": "https://schema.org/InStock"
  }
}
```

Markup data must match what users see on the page. Requirements are in [Google's Product structured data documentation](https://developers.google.com/search/docs/appearance/structured-data/product).

### Reviews

Reviews add unique text, answer buyer questions and build trust. Keep in mind:

- publish real reviews, including critical ones;
- render them in the page HTML, not only on click;
- add ratings to markup only if reviews are collected on your own site.

## Common mistakes

- Identical titles across hundreds of product pages.
- Sorting pages and internal search results open for indexing.
- A product reachable via several category URLs without a canonical.
- Images without alt text and heavy photos slowing down the page.

## FAQ

### Does every category need text?

Not a long one, but a short useful block helps both people and search. An empty category with just a product grid often loses to competitors.

### What if I have thousands of descriptions to write?

Prioritize: start with the best-selling and most-viewed products, and use templates with unique specifications for the rest.

### Can I just block all filters from indexing?

You can, but you'll miss demand for "category + brand" queries. It's better to open only the combinations people actually search for.
