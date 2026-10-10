---
title: How to Build a Simple ETL Pipeline in Python
description: Extract data from an API and CSV, transform it with pandas, load it into PostgreSQL, schedule runs and handle errors, retries and incremental loads.
summary: A simple Python ETL is three functions (extract, transform, load) plus four reliability rules: retries on network failures, idempotent loading via upsert, incremental extraction by timestamp, and scheduled runs with logs.
---

## The short answer

For modest data volumes you do not need Airflow or Spark. A **Python + pandas + SQLAlchemy** script is enough, as long as it:

1. **Extracts** data from an API and a CSV file.
2. **Transforms** and joins it in pandas.
3. **Loads** it into PostgreSQL with an upsert.
4. Runs on **cron** and writes logs.

The example below pulls orders from an API and a product list from a CSV, and writes the result into an `orders` table in PostgreSQL.

## Setup

```bash
pip install pandas requests sqlalchemy "psycopg[binary]"
```

The target table needs a unique key — without one, an upsert is impossible:

```sql
CREATE TABLE IF NOT EXISTS orders (
  order_id    bigint PRIMARY KEY,
  product_id  bigint,
  category    text,
  amount      numeric(12, 2) NOT NULL,
  updated_at  timestamptz NOT NULL
);
```

Keep the connection string in an environment variable, not in the code.

## Extract: an API with retries, plus a CSV

Networks fail, so retries with backoff are mandatory. urllib3's `Retry` provides them:

```python
import os, logging
import pandas as pd
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from sqlalchemy import create_engine, text

log = logging.getLogger("etl")
engine = create_engine(os.environ["DATABASE_URL"])  # postgresql+psycopg://...

def http_session():
    retry = Retry(total=5, backoff_factor=1,
                  status_forcelist=[429, 500, 502, 503, 504],
                  allowed_methods=["GET"])
    s = requests.Session()
    s.mount("https://", HTTPAdapter(max_retries=retry))
    return s

def extract_orders(since):
    resp = http_session().get(os.environ["ORDERS_API_URL"],
                              params={"updated_since": since.isoformat()},
                              timeout=30)
    resp.raise_for_status()
    return pd.DataFrame(resp.json()["items"])

def extract_products(path="products.csv"):
    return pd.read_csv(path, dtype={"product_id": "Int64"})
```

If the API is **paginated**, loop through every page — fetching only the first one is a classic bug.

## Transform: clean and join

```python
def transform(orders, products):
    df = orders.merge(products[["product_id", "category"]],
                      on="product_id", how="left")
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["updated_at"] = pd.to_datetime(df["updated_at"], utc=True)
    df = df.dropna(subset=["order_id", "amount"])
    df = df.drop_duplicates("order_id", keep="last")
    return df[["order_id", "product_id", "category", "amount", "updated_at"]]
```

Transformation rules:

- **Cast types explicitly** — do not rely on inference.
- When you drop rows, **log how many**: silent data loss is worse than a crash.
- Check invariants: amounts are not negative, keys are not empty.

## Load: an idempotent upsert

Loading must be **idempotent**: rerunning with the same data creates no duplicates. Write to a staging table, then `INSERT ... ON CONFLICT`, in one transaction:

```python
def load(df):
    with engine.begin() as conn:
        df.to_sql("orders_stage", conn, if_exists="replace", index=False)
        conn.execute(text("""
            INSERT INTO orders (order_id, product_id, category, amount, updated_at)
            SELECT order_id, product_id, category, amount, updated_at FROM orders_stage
            ON CONFLICT (order_id) DO UPDATE SET
              product_id = EXCLUDED.product_id,
              category   = EXCLUDED.category,
              amount     = EXCLUDED.amount,
              updated_at = EXCLUDED.updated_at
        """))
```

`engine.begin()` rolls everything back on failure, so the table never holds half a load.

## Incremental loads

Do not pull the full history every time. Use a **watermark** — the maximum `updated_at` in the target table — and request only what changed after it:

```python
from datetime import timedelta

def run():
    with engine.connect() as conn:
        wm = conn.execute(text(
            "SELECT coalesce(max(updated_at), '1970-01-01') FROM orders")).scalar()
    since = wm - timedelta(minutes=10)  # overlap for late-arriving records
    orders = extract_orders(since)
    if orders.empty:
        log.info("no new orders"); return
    df = transform(orders, extract_products())
    load(df)
    log.info("loaded %d rows", len(df))

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(message)s")
    run()
```

A small **overlap** in the window is safe thanks to the upsert: rows that arrive twice are simply updated.

## Scheduling and errors

The simplest scheduler is **cron**. `flock` prevents a second instance from starting while the first is still running:

```bash
*/30 * * * * cd /opt/etl && flock -n /tmp/etl.lock .venv/bin/python etl.py >> /var/log/etl.log 2>&1
```

Reliability checklist:

- An unhandled exception exits with a non-zero code, which monitoring can detect.
- Alerts to Telegram or email on failure and on a suspiciously empty result.
- Secrets live only in environment variables.
- Log rotation, so the disk does not fill up.

Once you have many pipelines with dependencies between them, move to an orchestrator: **Airflow**, **Prefect** or **Dagster**.

## FAQ

### What is the difference between ETL and ELT?

In ETL, data is transformed before loading. In ELT, it is loaded as-is and transformed inside the warehouse, usually with SQL. For small volumes and messy sources, ETL with pandas is simpler.

### What if the data does not fit in memory?

Read and load in chunks: `pd.read_csv(..., chunksize=...)` and paginated API requests. If volumes keep growing, move transformations into SQL inside the database.

### How do I handle records deleted in the source?

An incremental load by `updated_at` cannot see deletions. You need a "deleted" flag in the source, a separate deletions endpoint, or a periodic full comparison of keys.
