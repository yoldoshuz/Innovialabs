---
title: CommerceML and the 1C Exchange Protocol Explained
description: How 1C syncs with a website via CommerceML: the request sequence, import.xml, offers.xml and order structure, incremental exchange and debugging failures.
summary: 1C calls your site over HTTP (checkauth, init, file, import), sends the catalog in import.xml, prices and stock in offers.xml, and pulls orders via mode=query; most failures come from auth, upload limits and mismatched IDs.
---
## How the exchange works in short

**CommerceML** is an XML format for exchanging products, prices and orders. The **exchange protocol** is a set of HTTP requests that 1C sends to a single site endpoint (for example `/1c_exchange.php` or `/api/1c`). 1C is always the initiator; the site only responds. The `type` parameter sets the exchange kind (`catalog` for products, `sale` for orders) and `mode` sets the step.

Site responses are plain text: the first line is `success`, `progress` or `failure`, followed by extra data.

## Catalog upload sequence

```text
GET  ?type=catalog&mode=checkauth
GET  ?type=catalog&mode=init
POST ?type=catalog&mode=file&filename=import.xml
GET  ?type=catalog&mode=import&filename=import.xml
POST ?type=catalog&mode=file&filename=offers.xml
GET  ?type=catalog&mode=import&filename=offers.xml
```

1. **checkauth** — 1C sends login and password via HTTP Basic Auth. The site replies `success`, then the session cookie name and value. Every following request carries that cookie.
2. **init** — the site states whether it accepts archives (`zip=yes`/`zip=no`) and the maximum chunk size (`file_limit=...`). This is also the place to clear the temp folder from the previous run.
3. **file** — 1C sends files as the POST body. A large file may arrive in chunks: **append** them, do not overwrite. Images arrive the same way, usually with paths like `import_files/...`.
4. **import** — the site parses the file. If processing is long, answer `progress`: 1C repeats the request and you continue where you stopped. When done, reply `success`; on error, `failure` plus the reason.

## File structure

Element names in CommerceML are in Russian, so keep them as-is in your parser.

**import.xml** holds the classifier and the catalog:

```xml
<КоммерческаяИнформация ВерсияСхемы="2.05">
  <Классификатор>
    <Группы>...</Группы>
    <Свойства>...</Свойства>
  </Классификатор>
  <Каталог СодержитТолькоИзменения="false">
    <Товары>
      <Товар>
        <Ид>b1f2...</Ид>
        <Наименование>Kettle</Наименование>
        <Группы><Ид>a7c3...</Ид></Группы>
        <Картинка>import_files/b1/b1f2.jpg</Картинка>
      </Товар>
    </Товары>
  </Каталог>
</КоммерческаяИнформация>
```

Here `Классификатор` is the classifier with `Группы` (categories) and `Свойства` (properties), and `Товар` is a product with `Ид` (ID), `Наименование` (name) and `Картинка` (image).

**offers.xml** holds `ПакетПредложений` (offer package): a list of `ТипыЦен` (price types) and `Предложения` (offers). Each `Предложение` has `Ид`, `Цены` (with `ИдТипаЦены`, `ЦенаЗаЕдиницу`, `Валюта`) and `Количество` (quantity). When a product has variants (size, color), the offer `Ид` usually looks like `productId#variantId` — split it on `#`.

**Orders** are `Документ` elements inside `КоммерческаяИнформация`: `Ид`, `Номер`, `Дата`, `ХозОперация`, `Валюта`, `Сумма`, `Контрагенты` (customers), `Товары` (line items) and `ЗначенияРеквизитов` (payment status, delivery method and so on).

The exact element set depends on the schema version and the 1C configuration, so save real files from the exchange and build the parser against them.

## Order exchange

1. `checkauth` and `init` with `type=sale` — same as for the catalog.
2. `mode=query` — the site returns XML with new or changed orders.
3. `mode=success` — 1C confirms receipt. Only then mark orders as exported.
4. Some configurations then send `mode=file` with updated order statuses.

## Full vs incremental exchange

The **`СодержитТолькоИзменения`** ("contains only changes") attribute on `Каталог` and `ПакетПредложений` sets the mode:

| Mode | Value | What the site should do |
|---|---|---|
| Full | `false` | Sync everything; products missing from the file can be deactivated |
| Incremental | `true` | Update only the received items, leave the rest alone |

A common mistake is deactivating missing products during an incremental run. After a small change in 1C, almost the entire catalog disappears.

## Debugging common failures

- **Auth fails.** When PHP runs via CGI/FastCGI, the `Authorization` header may not reach the script — pass it through explicitly in the web server config.
- **Session is lost.** The site must return a cookie on `checkauth` and accept it afterwards; a caching proxy or CDN must not interfere with this endpoint.
- **Large files break.** Check the request body limit (for example `client_max_body_size` in nginx), timeouts and `file_limit`. Split long imports into steps via `progress`.
- **Duplicate products.** Match records only by the 1C `Ид`, not by name or SKU.
- **Orders exported repeatedly.** `mode=success` is not handled.
- **Garbled text.** Check the encoding in the XML declaration and the encoding of your responses.

For diagnostics, log every request: `type`, `mode`, `filename`, body size and your response. Keep copies of received files — they make reproducing a bug locally much easier.

## FAQ

### Can the site start the exchange instead of 1C?

In the standard protocol 1C is the initiator: it sends requests on a schedule or manually. The site can only respond correctly.

### Is the zip archive required?

No, it is optional. An archive reduces transfer size but adds an unpacking step. For small catalogs you can reply `zip=no`.

### Why are prices not updating although import.xml loaded fine?

Prices and stock come separately in offers.xml. Check that it reached the `import` step and that offer IDs match product IDs on the site.
