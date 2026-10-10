---
title: How to Start Selling on Ozon: Step-by-Step Guide
description: Ozon seller onboarding, catalog upload, choosing FBO, FBS or realFBS, pricing and promotion tools, and connecting your systems through the Seller API.
summary: Sign up in the Ozon seller portal, upload your catalog manually, via a template or the API, choose a fulfillment scheme (FBO, FBS or realFBS), set prices with a minimum price for promotions and automate stock, prices and orders through the Seller API.
---
## The short answer: five steps to your first orders

1. **Sign up** in the seller portal: country, company details, bank details, acceptance of the offer. Ozon works with sellers outside Russia too — the terms for your country are shown during registration.
2. **Catalog:** product cards, photos, attributes, brand rights and certificates where required.
3. **Fulfillment scheme:** Ozon warehouse, your warehouse or your own delivery.
4. **Pricing and promotion:** price, minimum price, promotions, ads.
5. **Automation:** once you have more products than you can comfortably manage by hand, connect the Seller API or a ready-made integration with your accounting system.

## Seller onboarding

- Prepare **registration documents**, bank details and a contact person.
- Pass **verification**. You can prepare product cards while it runs.
- Learn the **portal sections**: products, prices, logistics, orders, finance, analytics. You will spend most of your time in Products and Finance.
- For brands and regulated categories, upload **brand rights** and **conformity documents** in advance, or cards will not pass moderation.

## Catalog upload

There are three ways, and you can combine them:

| Method | Best when |
|---|---|
| Manually in the portal | A few products, testing the marketplace |
| Category XLS template | Dozens or hundreds of items already in a spreadsheet |
| Seller API | Large catalog, frequent changes, an ERP or 1C in place |

If your product is already sold on Ozon by other sellers, you can **join the existing product card** instead of creating a new one.

What to check on every card:

- **category and product type** — they define required attributes and the commission;
- **seller SKU** — unique and stable, since you will sync stock and prices by it;
- **barcode** for each variant;
- **packed weight and dimensions** — they drive logistics costs, and mistakes are expensive;
- **photos, description and attributes** — search and filters run on them.

## Choosing a fulfillment scheme

| Scheme | Who stores | Who delivers | Fits when |
|---|---|---|---|
| FBO | Ozon | Ozon | Fast movers, quick delivery, minimal operations |
| FBS | You | Ozon (you hand over packed orders) | Wide assortment, you want control over stock |
| realFBS | You | You or your courier service | Bulky goods, special delivery terms, own logistics |

Schemes can be combined: the same product can ship from both Ozon's warehouse and yours.

## Pricing and promotions

- **Price and pre-discount price.** The crossed-out price must be honest — the marketplace checks discounts.
- **Minimum price.** The floor below which a product will not drop when it is automatically added to promotions. Derive it from unit economics, not intuition.
- **Promotions.** Ozon regularly offers campaigns. They bring traffic but cut margin — add only products that stay profitable after the discount.
- **Price index.** Ozon compares your price with other marketplaces, and this affects product visibility.
- **Ads.** Promotion in search and on product pages, paid per click or per order. Start with a small budget on your best-converting products.

## Connecting via the Seller API

The **Seller API** lets you manage products, prices, stock and orders and pull financial reports from your own system. The key is created in the portal settings. Every request is a POST with a JSON body and two auth headers:

```bash
curl -X POST "https://api-seller.ozon.ru/<method-from-docs>" \
  -H "Client-Id: <your-client-id>" \
  -H "Api-Key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d "{}"
```

What sellers usually automate first:

1. **Stock sync** with the accounting system, so you never sell what you do not have.
2. **Price updates** based on rules.
3. **Receiving and processing FBS orders.**
4. **Exporting financial reports** for reconciliation.

Methods and their versions get updated — check the [official Seller API documentation](https://docs.ozon.ru/api/seller/) and store the key as carefully as a password.

## FAQ

### Can I sell on Ozon from Uzbekistan?

Yes, the marketplace works with sellers from several countries, including Uzbekistan. Available schemes, payout currency and document requirements depend on your country of registration — check them when signing up.

### Which scheme should a beginner start with?

With a few fast-moving products, start with FBO: less operational work. With a wide range or untested demand, start with FBS so cash is not frozen in a shipment.

### Do I have to use the API?

No. For a small catalog, the portal and XLS templates are enough. The API becomes necessary when manual stock and price updates start causing errors and cancelled orders.
