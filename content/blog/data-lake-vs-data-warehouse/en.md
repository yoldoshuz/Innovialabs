---
title: Data Lake vs Data Warehouse vs Lakehouse
description: Data lakes, warehouses and lakehouses compared by structure, storage cost, users and use cases, plus signs that your company does not need any of them yet.
summary: A data warehouse stores cleaned, structured data for reporting, a data lake stores any raw data cheaply in its original form, and a lakehouse adds warehouse-style tables and transactions on top of a lake. Many small companies only need a regular database and a BI tool.
---

## The three approaches in short

- **Data warehouse** — structured tables with a predefined schema. Data is cleaned and consistent, and SQL reports run fast.
- **Data lake** — cheap object storage (S3, Google Cloud Storage, Azure Data Lake Storage) where everything lands in its original form: database dumps, logs, API JSON, files, images. The schema is applied when reading.
- **Lakehouse** — a data lake plus an open table format (Delta Lake, Apache Iceberg, Apache Hudi) that gives files in the lake transactions, versions and a schema. The idea is to combine the low cost of a lake with the reliability of a warehouse.

## Comparison

| Aspect | Data warehouse | Data lake | Lakehouse |
|---|---|---|---|
| Structure | Strict schema on write | Any format, schema on read | Tables on top of lake files |
| Data types | Tables | Tables, logs, JSON, text, media | All, but analytics mostly on tables |
| Storage cost | Higher, billing often tied to compute | Low, object storage | Low, same as a lake |
| Main users | Analysts, BI, management | Data engineers, data scientists | Analysts, engineers and ML teams |
| Typical use | Reports, dashboards, financial metrics | Raw data archive, ML, log processing | BI and ML on the same data without copies |
| Examples | BigQuery, Snowflake, ClickHouse | S3, GCS, ADLS | Databricks, Iceberg tables in various engines |
| Main risk | Costly as raw data volumes grow | A "data swamp" with no catalog or owners | Complexity to adopt and maintain |

## What fits when

**Warehouse** — when reports and dashboards are the main consumers, sources are mostly tabular (CRM, accounting, website database), and the team values simple SQL and predictable numbers.

**Lake** — when you have lots of unstructured or semi-structured data: logs, events, files, text; you want to store everything cheaply "for later"; you have machine learning tasks.

**Lakehouse** — when data is already large and varied, and running both a lake and a warehouse with copying between them has become expensive and complex. It is a solution for a mature data team, not a starting point.

In practice a common setup is both: raw data in the lake, a cleaned subset loaded into the warehouse for BI.

## Common mistakes

- **A lake with no order.** Files pile up without descriptions, owners or retention rules. A year later nobody knows what is inside, and the lake becomes a swamp.
- **Choosing by hype.** A lakehouse gets built where a single analytical database would do.
- **No shared definitions.** No architecture helps if "revenue" is calculated differently in different reports.
- **Uncontrolled personal data.** Raw exports easily end up containing phone numbers and ID data with access open far too widely.

## When you need none of them

A small or mid-sized company is often too early for a dedicated data architecture. Signs:

- only a few data sources, for example a CRM, an accounting system and a website;
- the data fits in a regular database and queries are fast;
- reports are needed daily or weekly, not in real time;
- no machine learning work and no large event streams.

What to do instead:

1. Set up a **read replica** of the production database or a separate analytics schema in PostgreSQL.
2. Connect a **BI tool** (Metabase, Looker Studio, Power BI) to that replica.
3. Write down **5–10 key metrics** and their definitions.
4. Revisit the decision when queries slow down or new sources appear.

## FAQ

### Can I start with a data lake and add a warehouse later?

You can, but for most business needs the reverse is more logical: start with reports on tabular data, then add a lake once logs, files and ML appear.

### Will lakehouses replace data warehouses?

The approaches are converging: warehouses are learning to read open table formats, and lakehouse platforms are getting faster at SQL. The choice depends on data volume, team skills and tasks rather than the architecture's name.

### Which is cheaper, a lake or a warehouse?

Storing data in object storage is usually cheaper. But the total cost includes storage, query compute and engineering time, so compare the full picture for your workload.
