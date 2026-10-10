---
title: GA4 BigQuery Export: Analyzing Raw Marketing Data
description: How to link GA4 to BigQuery, how the events table is structured, SQL examples for sessions, sources and funnels, and how to keep query costs under control.
summary: The GA4 BigQuery export writes every site event as its own row, with no sampling or interface thresholds. Linking takes minutes in the GA4 admin; the core skills are UNNEST for event parameters and filtering table dates so queries stay cheap.
---

## Why export GA4 to BigQuery

The GA4 interface shows aggregated reports with limits: data thresholds, cardinality caps, clunky explorations. The **BigQuery export** gives you raw events: every event as its own row with all parameters. You need it when you want to:

- build your own funnels and attribution;
- join site data with your CRM, ad spend and offline sales;
- keep history longer than GA4's retention setting allows;
- power Looker Studio or BI dashboards without API quotas.

## How to link GA4 to BigQuery

1. Create a **Google Cloud** project and enable the BigQuery API. The BigQuery sandbox works without a billing account to start, but its tables expire automatically and streaming export is not available.
2. In GA4, go to **Admin → Product links → BigQuery links** and create a link. You need Editor access in GA4 and Owner access in the GCP project.
3. Choose the **data location**; it cannot be changed later.
4. Pick the export type:
   - **Daily**: one `events_YYYYMMDD` table per day.
   - **Streaming**: `events_intraday_YYYYMMDD` during the day, billed separately.
5. Optionally exclude events you do not need to reduce volume.

Data starts arriving the next day, and the export contains no history from before the link was created. So connect it as early as possible, even if analysis comes later.

## The events table schema

One row is one event. Key fields:

| Field | Contents |
|---|---|
| `event_date`, `event_timestamp` | date and time in microseconds |
| `event_name` | `page_view`, `purchase`, etc. |
| `event_params` | repeated key–value array |
| `user_pseudo_id` | device/browser identifier |
| `user_id` | your user ID, if you send one |
| `traffic_source` | source of the user's **first** visit |
| `collected_traffic_source` | UTMs and click IDs captured on this event |
| `device`, `geo` | device and location |
| `ecommerce`, `items` | e-commerce data |

The main quirk is `event_params`. A parameter's value sits in one of `value.string_value`, `value.int_value` or `value.double_value`, and you can only reach it with `UNNEST`.

## Example: sessions per day

A session in the export is the pair of `user_pseudo_id` and the `ga_session_id` parameter.

```sql
SELECT
  event_date,
  COUNT(DISTINCT CONCAT(user_pseudo_id, CAST(
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id')
  AS STRING))) AS sessions
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261007'
GROUP BY event_date
ORDER BY event_date;
```

## Example: sessions by source

Newer exports include `session_traffic_source_last_click` with the last-click session source. For older data, rebuild the session source from `collected_traffic_source` on the session's first event.

```sql
SELECT
  session_traffic_source_last_click.manual_campaign.source AS source,
  session_traffic_source_last_click.manual_campaign.medium AS medium,
  COUNT(DISTINCT CONCAT(user_pseudo_id, CAST(
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id')
  AS STRING))) AS sessions
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261007'
GROUP BY source, medium
ORDER BY sessions DESC;
```

## Example: purchase funnel

A simple "open" funnel counts how many users completed each step in the period:

```sql
SELECT
  COUNT(DISTINCT IF(event_name = 'view_item', user_pseudo_id, NULL)) AS view_item,
  COUNT(DISTINCT IF(event_name = 'add_to_cart', user_pseudo_id, NULL)) AS add_to_cart,
  COUNT(DISTINCT IF(event_name = 'begin_checkout', user_pseudo_id, NULL)) AS begin_checkout,
  COUNT(DISTINCT IF(event_name = 'purchase', user_pseudo_id, NULL)) AS purchase
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261031';
```

If step order matters, compare the `event_timestamp` of each step within a user or session.

## How to control cost

With on-demand pricing, BigQuery charges for **bytes scanned**, not rows returned. The rules:

- **Always filter `_TABLE_SUFFIX`**; without it a query reads the entire history.
- **Avoid `SELECT *`**: BigQuery is columnar, so you only pay for the columns you select.
- Check the bytes estimate in the editor before running.
- Set a **maximum bytes billed** limit on queries and a budget with alerts in Cloud Billing.
- For dashboards, build **scheduled aggregate tables** instead of pointing BI at raw events.

## Why numbers differ from the GA4 interface

Differences are normal: the interface applies data thresholds, modeling and approximate distinct counts, while the export does not. The export also lacks Consent Mode modeled data. Compare trends, not exact values.

## FAQ

### How much does the GA4 BigQuery export cost?

The daily export itself is free for standard properties; streaming export is billed. You pay Google Cloud for storage and queries. The total depends on event volume, how long you keep data and how carefully queries are written.

### Can I export data from previous months?

No. The export starts when the link is created. You can get some history only in aggregated form through the GA4 Data API.

### Do I need a developer for this?

Not for linking. For analysis you need basic SQL and an understanding of the schema, especially `UNNEST`. Complex attribution and CRM joins are better handled by a data analyst.
