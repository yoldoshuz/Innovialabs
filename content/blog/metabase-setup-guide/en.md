---
title: How to Set Up Metabase for Business Dashboards
description: Install Metabase with Docker, connect a read-only database user, build questions and dashboards, configure permissions and scheduled email reports.
summary: Run Metabase in Docker with its own PostgreSQL application database, connect your data through a read-only user, build questions into dashboards, restrict access with groups and send dashboards by email on a schedule.
---

## What you get

**Metabase** is an open-source BI tool: managers ask questions about data through a visual query builder, analysts write SQL, and results become charts and dashboards. A basic setup takes a few steps: run the container, connect a database safely, build the first dashboard, set permissions and subscriptions.

## Step 1. Install with Docker

For a quick test, one command is enough:

```bash
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

By default Metabase keeps its own settings, users and dashboards in an embedded H2 file, which is **not recommended for production**. For real use, give it a separate PostgreSQL application database:

```yaml
services:
  metabase:
    image: metabase/metabase
    ports:
      - "3000:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: metabase-db
      MB_DB_PORT: 5432
      MB_DB_DBNAME: metabase
      MB_DB_USER: metabase
      MB_DB_PASS: ${METABASE_DB_PASSWORD}
      JAVA_TIMEZONE: Asia/Tashkent
    depends_on:
      - metabase-db
  metabase-db:
    image: postgres:16
    environment:
      POSTGRES_DB: metabase
      POSTGRES_USER: metabase
      POSTGRES_PASSWORD: ${METABASE_DB_PASSWORD}
    volumes:
      - metabase-db-data:/var/lib/postgresql/data
volumes:
  metabase-db-data:
```

Then put it behind a reverse proxy with HTTPS, open the site and create the first admin account. Back up the application database: it stores all your questions and dashboards. Pin the image to a specific version tag and update deliberately.

## Step 2. Connect a read-only user

Never connect Metabase as the database owner. Create a dedicated role that can only read:

```sql
CREATE ROLE metabase_ro WITH LOGIN PASSWORD 'use-a-strong-password';
GRANT CONNECT ON DATABASE shop TO metabase_ro;
GRANT USAGE ON SCHEMA public TO metabase_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_ro;
ALTER ROLE metabase_ro SET statement_timeout = '60s';
```

- `ALTER DEFAULT PRIVILEGES` covers tables created later, but only those created by the role that runs it. Run it as the role your migrations use.
- `statement_timeout` stops a heavy query from hanging the database.
- Better still, connect to a **read replica**, so reports never compete with the application.
- Hide tables with personal or secret data (password hashes, tokens) or do not grant access to them at all.

In Metabase go to **Admin settings → Databases → Add database**, enter the host and the read-only credentials. Check the report timezone in the localization settings, so "today" means the same day for everyone.

## Step 3. Build questions and dashboards

- **Question** — a single query: through the visual builder (filter, summarize, group) or as native SQL.
- **Model** — a cleaned dataset (for example, "Paid orders") that others build questions on, with clear column names and descriptions.
- **Dashboard** — a set of questions with shared **filters** (date range, city, manager) connected to the matching columns.

A practical first dashboard: revenue by day, number of orders, average check, top products, orders by status. Name everything in business language and add short descriptions, so people trust the numbers.

## Step 4. Permissions

Metabase manages access by **groups**:

- **Data permissions** decide which databases and tables a group can view and whether it can write SQL.
- **Collection permissions** decide who can view or edit saved questions and dashboards.

A simple scheme: analysts can write SQL; managers can only view curated collections; nobody outside admins sees raw tables with personal data. Remove extra rights from the default "All Users" group, because every user is in it. Some advanced options, such as row-level restrictions, are available only in paid editions.

## Step 5. Scheduled email reports

1. In **Admin settings → Email**, configure SMTP and send a test email.
2. Open a dashboard, choose **Subscriptions**, add recipients and a schedule (for example, every Monday morning).
3. For a single question, set an **alert**: Metabase sends a message when results appear or cross a goal line.

Set the site URL in the general settings, so links in emails lead to the right address.

## FAQ

### Is Metabase free?

The open-source edition is free to self-host. Paid plans add a managed cloud version and advanced features such as row-level permissions and extended SSO.

### Will Metabase slow down my production database?

Heavy dashboards can. Use a read replica or a separate analytics database, set query timeouts and enable caching of results for frequently opened dashboards.

### Metabase, Power BI or Looker Studio?

Metabase suits teams that want a self-hosted, simple tool on top of SQL databases. Power BI fits companies in the Microsoft ecosystem with complex data modeling, and Looker Studio fits teams working mostly with Google services.
