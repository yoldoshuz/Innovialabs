---
title: Webflow CMS: How to Build a Blog or Catalog
description: A step-by-step guide to Webflow CMS: collections and fields, item templates and lists, filtering, reference fields, plan limits and editor access.
summary: To build a blog or catalog in Webflow, create a collection with fields, design the collection template page, and display items on any page with a Collection List that has sorting and filters.
---
## Short answer

Webflow CMS follows a simple pattern:

1. **Collection** — a content type: articles, products, case studies.
2. **Fields** — what each item consists of: title, cover image, body, price.
3. **Template page** — one layout Webflow uses to generate a page for every item.
4. **Collection List** — an element that displays items on any page: the blog feed, the home page, a catalog.

You design once, and from then on a content manager simply adds items.

## Step 1. Plan the structure

Before creating collections, write down which entities you have and how they relate. A typical blog setup:

- **Posts** — title, slug, cover, excerpt, body, date, author, category.
- **Categories** — name, slug, description.
- **Authors** — name, photo, role.

For a catalog: **Products**, **Categories**, sometimes **Brands**. Move anything that repeats and could have its own page into a separate collection. It saves rework once you have many items.

## Step 2. Create the collection and fields

In the CMS panel, create a new collection, set the singular and plural names and the base path (for example, `/blog`). The **Name** and **Slug** fields are created automatically.

Main field types:

| Field type | Used for |
|---|---|
| Plain text | Titles, short captions |
| Rich text | Article body with formatting and images |
| Image, Multi-image | Cover, product gallery |
| Number, Date | Price, publication date |
| Switch | Flags such as Featured or Out of stock |
| Option | A choice from a fixed list |
| Reference, Multi-reference | Links to items in another collection |

Mark essential fields as required and add help text — it noticeably reduces editor mistakes.

## Step 3. Design the item template

Every collection has a **Collection Template Page**. Build it like a normal page, then bind elements to fields: the heading to Name, the image to the cover, a Rich Text element to the body. This is done in the element settings by connecting it to a collection field.

Do not forget the template's SEO settings: the title and description can also be built from item fields, such as the title and excerpt.

## Step 4. Display items with a Collection List

Add a **Collection List** to a page, choose the collection and style one card — the rest repeat automatically. List settings include:

- **sorting** by date, name or any field;
- **limit** and offset, for example the three latest posts on the home page;
- **pagination** for long feeds;
- **filters** that decide which items appear.

## Filtering and reference fields

Collection List filters are set in the Designer: Featured is on, Category equals X, Date is after now. On a template page you can filter by the **current item** — that is how you build blocks like "More in this category" or "Related products".

A **Reference** field links an item to one item in another collection (post → author), a **Multi-reference** field to several (product → several tags). Thanks to references, each category gets its own page with its posts, and inside a list you can show data from the linked item, such as the author's name or category title.

Note that these filters are set by the designer; visitors cannot change them. Interactive catalog filters (buttons, search, live sorting) require custom code or third-party libraries.

## Plan limits

The CMS has limits tied to the **site plan**: total number of items, number of collections, fields per collection, plus the number of items per list and nested lists. The figures change over time, so check the official documentation before you start, especially if the catalog will grow to thousands of items.

## Access for content managers

Editors do not need access to the design. Webflow offers restricted roles for them: they can add and edit CMS items and page text, save drafts and schedule publishing, but cannot break layout or styles. The number of editor seats depends on the plan.

Items can be imported from **CSV**, and the **CMS API** is available for syncing with external systems.

## Common mistakes

- Putting everything into one Rich Text field instead of separate fields, which makes filters and cards impossible later.
- Storing the category as text rather than a Reference, so typos split categories.
- Skipping alt text and SEO fields in the template.
- Not checking plan limits before filling the catalog.

## FAQ

### Can visitors search and filter in Webflow?

Built-in site search is available. Interactive catalog filters are not configurable out of the box; they are added with custom code or third-party libraries on top of a Collection List.

### How do I move posts from another CMS to Webflow?

Export the items to CSV with columns matching the collection fields and import them. For large volumes or regular syncing, use the CMS API.

### How many items can a collection hold?

It depends on the site plan and changes from time to time. Current limits are listed on Webflow's pricing page and in its documentation.
