---
title: How to Import CSV and Excel Data into PostgreSQL
description: Import CSV and Excel files into PostgreSQL with COPY, \copy, DBeaver and Python, handling encodings, delimiters, dates, duplicates and validation.
summary: Load the file into a staging table with text columns first using COPY, \copy, DBeaver or Python, then cast types, remove duplicates and move only validated rows into the real table.
---

## The short answer

One reliable workflow works with any tool:

1. **Load** the file as-is into a staging table where every column is `text`.
2. **Transform** types, dates and formats with SQL.
3. **Move** the rows into the real table, filtering out duplicates.
4. **Validate**: row counts, empty values, totals.

That way one broken line doesn't abort the whole import, and bad data never reaches production tables.

## Which tool to use

| Method | Good for |
|---|---|
| `COPY` | The file is already on the database server; speed and large volumes |
| `\copy` in psql | The file is on your machine and the database is remote |
| DBeaver | A one-off load without a command line, with visual column mapping |
| Python (pandas) | Excel with several sheets, complex cleanup, scheduled imports |

## Prepare a staging table

```sql
CREATE TABLE staging_clients (
  name    text,
  phone   text,
  city    text,
  created text
);
```

Text columns accept anything — "12.03.2026", "n/a", stray spaces — and SQL is the right place to deal with it.

## COPY and \copy

`COPY` reads a file **on the PostgreSQL server**. It needs superuser rights or the `pg_read_server_files` role.

```sql
COPY staging_clients (name, phone, city, created)
FROM '/var/lib/postgresql/import/clients.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'WIN1251');
```

`\copy` is a psql client command: the file is read **on your machine** and streamed to the server. It must be written on one line:

```text
\copy staging_clients (name, phone, city, created) FROM 'clients.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'WIN1251')
```

Key options:

- **DELIMITER** — Excel with many European and CIS locales saves CSV with semicolons rather than commas.
- **ENCODING** — older exports from Excel or 1C are often `WIN1251`. Garbled Cyrillic means the encoding is wrong. Saving as "CSV UTF-8" avoids the issue.
- **HEADER** — skip the header row.

## DBeaver

Handy for a one-off load without a console:

1. Right-click the staging table → **Import Data** → CSV.
2. Set the encoding, delimiter and date format in the import settings.
3. Check the mapping between file columns and table columns.
4. Run the import and review the error log.

Save Excel files as CSV first, or use Python.

## Python and Excel

pandas reads `.xlsx` sheets directly (it needs the `openpyxl` package):

```python
import pandas as pd
from sqlalchemy import create_engine

df = pd.read_excel("clients.xlsx", sheet_name="Clients", dtype=str)
df.columns = ["name", "phone", "city", "created"]

engine = create_engine("postgresql+psycopg://user:password@localhost:5432/shop")
df.to_sql("staging_clients", engine, if_exists="append", index=False, chunksize=1000)
```

`dtype=str` matters: without it, phone numbers turn into numbers, lose leading zeros and long values may end up in scientific notation. Keep the database password in environment variables, not in the code.

## Dates, formats and duplicates

Transform and move the data in one statement:

```sql
INSERT INTO clients (name, phone, city, created_at)
SELECT DISTINCT ON (phone_clean)
       trim(name),
       phone_clean,
       nullif(trim(city), ''),
       to_date(created, 'DD.MM.YYYY')
FROM (
  SELECT *, regexp_replace(phone, '\D', '', 'g') AS phone_clean
  FROM staging_clients
) s
WHERE phone_clean <> ''
ORDER BY phone_clean
ON CONFLICT (phone) DO NOTHING;
```

What happens here:

- `to_date` with an explicit format prevents mixing up day and month;
- phones are reduced to digits, so "+998 90 123-45-67" and "998901234567" count as one number;
- `DISTINCT ON` removes duplicates inside the file, `ON CONFLICT` skips rows that already exist (this needs a unique index on `phone`).

## Validate after the import

- Compare **row counts** in the file, staging and the target table. Any difference should be explained by duplicates and rejected rows.
- Count **NULLs** in required fields.
- Check **totals and ranges**: no dates in the future, no negative amounts.
- Eyeball a few random rows.

Once everything checks out, clear staging with `TRUNCATE`.

## FAQ

### What is the difference between COPY and \copy?

`COPY` runs on the server and reads from the server's disk, so it needs special privileges. `\copy` runs in psql on your computer and sends the data to the server, which makes it the usual choice for a remote database.

### What if the import fails on a single row?

Load into a staging table with text columns so nothing can fail on type conversion. Then find the problem rows with a query, for example dates that don't match the expected pattern, and decide whether to fix or drop them.

### How do I set up a recurring import?

Put the steps into a Python or SQL script, run it on a schedule (cron, Task Scheduler or an orchestrator) and log how many rows were loaded and rejected each time.
