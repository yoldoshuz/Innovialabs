---
title: Database Migrations: How to Change Schema Safely
description: How versioned database migrations work in Flyway, Liquibase, Prisma and Alembic, how to plan rollbacks, review migrations and keep environments in sync.
summary: Change the schema only through numbered migrations in your repository, apply them automatically on deploy, and split risky changes into compatible steps so old and new code can both work with the database.
---

## The short answer

A **migration** is a file with a schema change (create a table, add a column, add an index) and a version number. The tool keeps a bookkeeping table in the database with the versions already applied and, on each run, executes only the new files in order.

Rules for doing it safely:

- never change the schema by hand on a server — only through a migration in Git;
- never edit a migration that has been applied — write a new one;
- the same chain of migrations runs on dev, staging and production;
- risky changes are split into several steps.

## Which tool to choose

| Tool | Ecosystem | How migrations are written |
|---|---|---|
| **Flyway** | Java, any stack via CLI | SQL files `V1__init.sql`, `V2__add_orders.sql` |
| **Liquibase** | Java, any stack via CLI | changelogs in XML/YAML/JSON or SQL, with built-in rollback blocks |
| **Prisma Migrate** | Node.js / TypeScript | you edit `schema.prisma`, the tool generates SQL |
| **Alembic** | Python / SQLAlchemy | Python files with `upgrade()` and `downgrade()` functions |

Pick what fits your stack: ORM-based projects usually use the native mechanism (Prisma, Alembic, Django or Laravel migrations). Flyway and Liquibase shine when one database is shared by services in different languages.

An Alembic migration:

```python
def upgrade():
    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))

def downgrade():
    op.drop_column("users", "phone")
```

## Changing the schema without downtime

During a deploy, the old and new versions of the app run side by side for a while. So every migration must be **backward compatible** with the old code. The standard pattern is **expand / contract**.

Example: rename column `name` to `full_name`.

1. **Expand.** Add a nullable `full_name` column.
2. Code writes to both columns and reads from the old one.
3. Backfill old rows in batches as a separate job.
4. Code switches to reading `full_name`.
5. **Contract.** In a later release, drop `name`.

What is dangerous in a single migration:

- renaming or dropping a column the current code reads;
- adding `NOT NULL` to a large table without a default;
- changing a column type in a way that rewrites the table;
- building an index that blocks writes — in PostgreSQL use `CREATE INDEX CONCURRENTLY`.

## Rollback strategies

There are two approaches, and you can use both.

- **Down migrations** (`downgrade()`, Liquibase rollback). Handy in development, but on production rolling back a dropped column will not bring the data back.
- **Roll forward.** Fix the problem with a new migration. On production this is usually the more reliable path.

Minimum safety net: **a backup before every risky migration** and a tested plan for a migration that fails halfway. Keep in mind that MySQL DDL statements cannot be rolled back in a transaction, while most PostgreSQL DDL is transactional.

## Reviewing migrations

Review migrations more carefully than regular code, because you cannot simply revert them with a commit. A reviewer checklist:

- is it compatible with the code currently in production;
- how many rows are in the table, and will there be a long lock;
- is there a data backfill inside a DDL migration (better to separate it);
- has the ORM-generated SQL been read, not taken on faith;
- has it run against a copy with a realistic data volume.

## Keeping environments in sync

- Migrations run **automatically in CI/CD** before the new version starts, never by hand.
- CI spins up an empty database and applies every migration from scratch, which catches broken chains.
- Turn on drift detection: Flyway `validate`, Prisma `migrate diff` and similar commands show differences between your files and the real schema.
- Do not allow manual schema edits on production; if one happened, capture it as a migration.

## Common mistakes

- Editing an applied migration, so checksums no longer match and environments drift apart.
- Two developers creating migrations with the same number in different branches.
- Deploying the migration and the code that depends on it in the wrong order.
- Updating millions of rows with one `UPDATE` inside a migration.

## FAQ

### Can I run migrations on application startup?

For small projects with a single instance, yes. With several instances, run migrations as a separate deploy step so they never start in parallel; many tools take a lock, but a dedicated step is easier to control.

### Do I need down migrations if I roll forward?

They are useful for local development and tests. On production, rely on a backup and a corrective migration, especially when a change removes data.

### What if a migration fails on production?

Stop the deploy and check the tool's bookkeeping table to see which version is marked as failed. Fix the schema state manually or with a new migration, then mark the version correctly with the tool's command (for example, `flyway repair`).
