---
title: PostgreSQL Users, Roles and Permissions Done Right
description: Set up separate PostgreSQL roles for the app, analysts and admins: GRANT, default privileges, a read-only user for BI and the basics of row-level security.
summary: A sound PostgreSQL permission model uses group roles without login (owner, application, analytics) and separate login roles that are members of them; privileges come from GRANT and ALTER DEFAULT PRIVILEGES, BI gets read-only access, and Row-Level Security isolates rows.
---

## The short answer

Never run your application as the `postgres` superuser. A working layout:

- **app_owner** — owns the schema and tables; migrations run as this role.
- **app_rw** — reads and writes data but cannot change structure. The application uses it.
- **analytics_ro** — read-only, for analysts and BI.
- **Admins** — personal accounts, never a shared password.

In PostgreSQL, users and groups are the same thing: a **role**. A role with `LOGIN` is a user; a role without `LOGIN` is a group of privileges.

## Step 1. Create group roles and a schema

```sql
REVOKE ALL ON DATABASE shop FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

CREATE ROLE app_owner NOLOGIN;
CREATE ROLE app_rw NOLOGIN;
CREATE ROLE analytics_ro NOLOGIN;

CREATE SCHEMA app AUTHORIZATION app_owner;
```

The first two lines remove privileges everyone has by default (`PUBLIC`). Recent PostgreSQL versions already stop everyone from creating objects in `public`, but the explicit command does no harm.

## Step 2. Grant privileges

```sql
GRANT CONNECT ON DATABASE shop TO app_owner, app_rw, analytics_ro;
GRANT USAGE ON SCHEMA app TO app_rw, analytics_ro;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_rw;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_rw;

GRANT SELECT ON ALL TABLES IN SCHEMA app TO analytics_ro;
```

Note: `ON ALL TABLES` covers **only existing** tables. Future tables need the next step.

## Step 3. Default privileges for new tables

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT USAGE, SELECT ON SEQUENCES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT SELECT ON TABLES TO analytics_ro;
```

The main trap: default privileges apply only to objects created by **the specified role** (`FOR ROLE app_owner`). If migrations log in as `migrator` and create tables under that name, the rules do not apply. The fix is to start migrations with `SET ROLE app_owner;`.

## Step 4. Create login roles

```sql
CREATE ROLE migrator  LOGIN PASSWORD 'change-me' IN ROLE app_owner;
CREATE ROLE app_user  LOGIN PASSWORD 'change-me' IN ROLE app_rw;
CREATE ROLE bi_reader LOGIN PASSWORD 'change-me' IN ROLE analytics_ro;
```

Generate random passwords and keep them in a secrets manager. When someone leaves or a credential leaks, you disable one login without touching any privileges.

## A read-only user for BI

`analytics_ro` already cannot write. Add guard rails against heavy queries:

```sql
ALTER ROLE bi_reader SET default_transaction_read_only = on;
ALTER ROLE bi_reader SET statement_timeout = '60s';
ALTER ROLE bi_reader CONNECTION LIMIT 5;
```

- `default_transaction_read_only` is an extra safety net, not a replacement for privileges: the user can switch it off.
- Do not expose **sensitive data** (phone numbers, ID documents) as whole tables. Create a separate `reporting` schema with views of only the needed columns and give BI access to that schema alone.
- Where possible, connect BI to a **replica** rather than the primary.

For quick setups there is the built-in `pg_read_all_data` role (PostgreSQL 14+), but it grants read access to **every** table, sensitive ones included.

## Row-Level Security basics

**RLS** limits which rows a role can see. The classic case is a SaaS app with many customers in one table:

```sql
ALTER TABLE app.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON app.orders
  FOR ALL TO app_rw
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::bigint)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::bigint);
```

At the start of each transaction, the application sets the tenant:

```sql
SELECT set_config('app.tenant_id', '42', true);
```

Keep in mind:

- If the setting is missing, the policy returns no rows — a safe default.
- A role with no matching policy sees **no rows at all** in an RLS-enabled table, so analysts need their own policy.
- Table owners and superusers bypass RLS. Use `FORCE ROW LEVEL SECURITY` if the owner must be restricted too.

## Admins and auditing

- A personal role for each admin, with `CREATEROLE` and `CREATEDB` instead of `SUPERUSER` when full rights are not needed.
- `scram-sha-256` authentication in `pg_hba.conf`, access only from the addresses that need it.
- Check in psql: `\du` lists roles, `\dp app.*` shows table privileges, `\ddp` shows default privileges.

## FAQ

### Why does the app get "permission denied" on a new table?

Almost always the table was created by a role other than the one the default privileges are defined for. Check the table owner with `\dt app.*` and run migrations after `SET ROLE app_owner`.

### What is the difference between USER and ROLE?

Nothing fundamental: `CREATE USER` is `CREATE ROLE` with `LOGIN` by default. Use roles without login as groups and login roles as their members.

### Do I need RLS if the code already filters by tenant?

RLS is a second line of defense: it still works when someone forgets `WHERE tenant_id = ...` in the code. For systems that store several customers' data in one database, it is a worthwhile safeguard.
