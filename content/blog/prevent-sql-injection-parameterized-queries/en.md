---
title: How to Prevent SQL Injection: Parameterized Queries and ORMs
description: Parameterized queries in PHP, Python and Node.js, ORM raw-query pitfalls, safe ORDER BY and LIKE, least-privilege database users and testing with sqlmap.
summary: Parameterized queries prevent SQL injection: the query text and the data reach the database separately, so input can never become a command. Take column names from an allowlist and run the app as a least-privilege database user.
---

## The main rule

Never build a SQL query by concatenating strings with data. Use **parameterized queries** (prepared statements): the query contains placeholders and the values travel separately. The database parses the query structure first and only then plugs in the data, as values rather than code.

Manual quote escaping, "dangerous word" filters and frontend validation are not a defense.

## Examples in different languages

### PHP (PDO)

```php
$pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

$stmt = $pdo->prepare('SELECT id, name FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();
```

### Python (psycopg)

```python
cur.execute(
    "SELECT id, name FROM users WHERE email = %s",
    (email,),
)
```

Here `%s` is the driver's placeholder. The mistake is formatting the value in yourself with an f-string or the `%` operator.

### Node.js (pg)

```js
const { rows } = await pool.query(
  "SELECT id, name FROM users WHERE email = $1",
  [email]
);
```

## ORM pitfalls

ORMs generate parameterized queries for you, but almost every one has a "raw" mode where safety is your job.

| ORM | Safe | Unsafe |
|---|---|---|
| Prisma | `` $queryRaw`... ${email}` `` (tagged template) | `$queryRawUnsafe` with a string built from data |
| Django | `.raw("... %s", [email])` | `.raw(f"... {email}")`, `.extra()` with data |
| SQLAlchemy | `text("... :email")` with params | an f-string inside `text()` |
| Laravel | `whereRaw('email = ?', [$email])` | `DB::raw("... $email")` |
| Sequelize | `query(sql, { replacements })` | a template string with data |

Search your code for `raw`, `Unsafe` and `execute` next to string interpolation. Those are your first review candidates.

## Dynamic ORDER BY

Placeholders work only for **values**. You cannot pass a column name or sort direction as a parameter, so use an **allowlist**:

```js
const SORT = { name: "name", date: "created_at", price: "price" };
const column = SORT[req.query.sort] ?? "created_at";
const dir = req.query.dir === "asc" ? "ASC" : "DESC";

const sql = `SELECT id, name FROM products ORDER BY ${column} ${dir} LIMIT $1`;
await pool.query(sql, [20]);
```

The user picks a key, and only a known string reaches the query. Treat table names and column lists the same way.

## LIKE searches

Pass the pattern as a parameter too. Also escape `%` and `_` in the input, or users can inject their own wildcards and load the database:

```js
const term = input.replace(/[\\%_]/g, "\\$&");
await pool.query(
  "SELECT id, name FROM products WHERE name ILIKE $1",
  [`%${term}%`]
);
```

In PostgreSQL and MySQL the backslash is the default LIKE escape character; in other databases set it explicitly with `ESCAPE`.

## Least-privilege database users

Even if an injection slips through, database permissions limit the damage:

- the app connects as a dedicated user, never a superuser;
- that user has only `SELECT`, `INSERT`, `UPDATE`, `DELETE` on the tables it needs, no `DROP` or `ALTER`;
- migrations run as a different user, only during deploys;
- reporting and analytics get a read-only user;
- SQL errors go to logs, never to visitors.

```sql
CREATE ROLE app_user LOGIN PASSWORD 'from-secrets-manager';
GRANT CONNECT ON DATABASE shop TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

## Testing with sqlmap

**sqlmap** is an open-source tool that automatically detects and exploits SQL injection. Run it only against your own systems, ideally a staging copy: it sends many requests and can modify data.

```bash
sqlmap -u "https://staging.example.com/product?id=10" --batch
sqlmap -u "https://staging.example.com/search" --data="q=test" --cookie="session=..." --batch
```

Alongside sqlmap, add static analysis (Semgrep, CodeQL) to CI and review every raw query.

## Checklist

1. Every query is parameterized, with no string concatenation.
2. ORM raw queries are reviewed by hand.
3. Sorting, table and column names come from an allowlist.
4. `%` and `_` are escaped in LIKE input.
5. The database user has minimal privileges.
6. SQL errors are hidden from visitors.
7. Regular checks with sqlmap and static analysis.

## FAQ

### Do stored procedures prevent injection?

Only if they contain no dynamic SQL built by concatenation. A procedure that assembles a query from its parameters is just as vulnerable.

### Do I still need input validation with parameterized queries?

Yes, as an extra layer: checking type and format (number, email, length) filters junk and simplifies logic. But the protection against injection comes from parameterization.

### Can I run sqlmap in production?

Better not: it generates load and can change data. Use a copy of the environment with test data.
