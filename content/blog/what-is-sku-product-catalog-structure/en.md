---
title: What Is an SKU and How to Structure a Product Catalog
description: What an SKU is, how products differ from variants, and how to set up attributes and categories so filters, stock tracking and marketplace exports just work.
summary: An SKU is a unique code for one stock-tracked item, such as a T-shirt in a specific color and size; a catalog is built from products, their SKU variants, attributes and categories, and that structure decides how well filters, stock and exports work.
---
## The short answer

An **SKU** (Stock Keeping Unit) is an internal, unique code a store gives to every item it needs to count and sell separately.

Example: the "Basic" T-shirt is a **product**. A white Basic in size M is an **SKU**. A black one in size L is another SKU. They share a description and model photos, but each has its own stock level and sometimes its own price.

Don't confuse an SKU with other codes:

- **Barcode (EAN, UPC)**: a global manufacturer code, identical for every seller.
- **Manufacturer part number**: the code in the brand's own catalog.
- **SKU**: your own code, and you decide its format.

## The building blocks of a catalog

A solid catalog rests on four entities:

| Entity | What it is | Example |
|---|---|---|
| **Category** | A node in the catalog tree | Clothing → T-shirts |
| **Product (model)** | A shared card with the description | Basic T-shirt |
| **Variant (SKU)** | A specific combination of options | Basic, white, M |
| **Attribute** | A property with a value | Color: white, Material: cotton |

Attributes come in two kinds:

- **Variant attributes** create separate SKUs: color, size, storage capacity.
- **Descriptive attributes** are shared by all variants: material, country of origin, brand.

Mix up these roles and you end up either with a hundred duplicate cards or with one product whose stock can't be counted per size.

## Designing an SKU format

A good SKU is human-readable and stays stable over time:

- **Latin letters, digits and hyphens only.** Spaces, non-Latin characters and symbols cause trouble in exports and spreadsheets.
- **A fixed order of segments**: category, model, color, size.
- **No price, date or supplier.** Those change; the code should not.
- **Never reuse an SKU** for a different item, even after the old one is discontinued.

```text
TSH-BASIC-WHT-M
TSH-BASIC-BLK-L
```

## How a clean structure pays off

**Filters.** A "Color" or "Size" filter only works when values are stored as attributes from a fixed list, not as text in the product name. To a filter, "White", "white" and "wht" are three different values.

**Stock tracking.** Stock is counted per SKU. If variants aren't split out, the warehouse knows there are 40 T-shirts but not how many are size M, and the store ends up selling items it doesn't have.

**Marketplace exports.** Uzum, Wildberries, Ozon and Amazon all ask you to fill in required properties for their categories and to group variants under one listing. If your attributes are already structured, exporting is a matter of mapping your fields to theirs. If properties are buried in description text, every listing has to be filled in by hand.

**Integrations.** CRM, ERP or 1C, the warehouse and the website exchange data by SKU. A single code is the key that tells every system it's the same item.

## Common mistakes

- **A category tree that's too deep.** Shoppers and filters do better with a few levels, with attributes doing the rest.
- **Properties in the name** instead of attributes: "T-shirt white M cotton".
- **Free-text values** with no reference list, which leads to duplicates and typos.
- **One product split across several cards** instead of one card with variants.
- **Changing SKUs on every update**, which breaks links to stock, orders and marketplaces.

## Checklist before launching a catalog

1. List your categories and the attribute set for each one.
2. Mark which attributes are variant attributes and which are descriptive.
3. Create reference lists of values: colors, sizes, brands.
4. Agree on an SKU format and the rules for assigning it.
5. Check the requirements of the marketplaces you plan to sell on and add missing fields up front.

## FAQ

### Does an SKU have to match the barcode?

No. A barcode is assigned by the manufacturer or a labeling system, while the SKU is your internal code. It's convenient to store both on the variant and link them.

### Do I need an SKU if a product has no variants?

Yes. The product simply has exactly one SKU. That keeps stock, orders and integrations consistent.

### Can I change the catalog structure after launch?

You can, but it affects filters, page URLs, stock and marketplace links. Treat it as a migration: map old fields to new ones and test the exports before switching over.
