---
title: ETL vs ELT: How Data Pipelines Work
description: What happens during extract, transform and load, why cloud data warehouses made ELT the default, and what Airflow, dbt and Airbyte each do in a pipeline.
summary: ETL transforms data first and then loads it into the warehouse, while ELT loads raw data first and transforms it inside the warehouse. Cloud warehouses usually favor ELT because their compute is cheap to scale.
---

## The difference in short

A **data pipeline** is an automated process that takes data from sources and delivers it to where it is analyzed. It has three steps:

- **Extract** — pull data from the CRM, the app database, ad platform APIs, files.
- **Transform** — clean it, fix types, remove duplicates, join tables, calculate metrics.
- **Load** — write the result into the data warehouse.

The two approaches differ in the order:

- **ETL**: extract → transform on a separate server → load the finished data.
- **ELT**: extract → load as-is → transform with SQL inside the warehouse.

## What each stage involves

**Extract.** Data is pulled in full (full load) or only the changes since the last run (incremental). Incremental loads are faster but need a reliable change marker: an `updated_at` column, an auto-increment ID, or the database change log (CDC).

**Transform.** This is where business logic lives: what counts as an active customer, how to convert currencies, how to link a lead to a payment. It is the stage that breaks most often and needs tests.

**Load.** Data is appended, fully overwritten or updated by key (upsert). A rerun must not create duplicates — this property is called **idempotency**.

## Why cloud warehouses moved to ELT

Warehouses used to be expensive and slow, so data was prepared in advance on a dedicated ETL server and only the necessary parts were loaded. Cloud columnar warehouses such as BigQuery, Snowflake and ClickHouse changed the math:

- **Compute scales** — heavy transformations run faster inside the DWH than on a separate machine.
- **Raw data is kept** — if calculation logic changes, marts can be rebuilt without re-extracting from sources.
- **Transformations are SQL** — analysts can write and review them, not only engineers.
- **Adding sources is easier** — loading becomes a standard job for ready-made connectors.

ETL is not obsolete. It still fits when data has to be **cleaned before loading**: stripping personal data that must not be stored in the DWH, or heavily reducing volume before sending it.

## Tools

| Tool | Role | Where it fits |
|---|---|---|
| **Airbyte** | Ready-made connectors for extracting and loading (E and L) | ELT: moving data from many sources into the warehouse |
| **dbt** | Transformations as SQL models with tests, docs and dependencies (T) | ELT: the transformation layer inside the DWH |
| **Apache Airflow** | Orchestrator: schedules tasks, enforces order, handles retries | Both ETL and ELT: runs the whole pipeline |

A typical ELT stack: Airbyte loads raw tables, dbt builds marts from them, and Airflow runs both steps in the right order and alerts on failures.

A dbt model is just a SQL file:

```sql
-- models/marts/revenue_by_day.sql
SELECT
  DATE(paid_at) AS day,
  SUM(amount)   AS revenue
FROM {{ ref('stg_payments') }}
WHERE status = 'paid'
GROUP BY 1
```

## How to choose

- **Cloud DWH and common sources** — ELT with ready-made connectors.
- **Strict personal-data requirements** — ETL, or ELT with masking during loading.
- **A couple of sources and small volumes** — a scheduled script is enough; Airflow can come later.

Common mistakes: no monitoring, so the pipeline silently fails for a week; business logic scattered across untested scripts; non-repeatable runs that create duplicates after a failure.

## FAQ

### Do I need Airflow for a small project?

Not necessarily. For two or three jobs, cron or the connector's built-in scheduler is enough. An orchestrator pays off once you have many jobs with dependencies between them.

### Can ETL and ELT be combined?

Yes, and it is common. For example, personal data is masked before loading, while the main calculations happen inside the warehouse.

### How is dbt different from plain SQL scripts?

dbt adds dependency-based execution order, data tests, documentation and Git versioning on top of SQL. The logic stays in SQL but becomes manageable.
