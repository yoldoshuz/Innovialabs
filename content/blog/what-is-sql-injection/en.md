---
title: What Is SQL Injection and How Attackers Exploit It
description: How string concatenation turns user input into part of a SQL query, how classic, blind and UNION-based injections differ, and the damage they can cause.
summary: SQL injection is a vulnerability where user input becomes part of a SQL query and changes what it does. Attackers use it to bypass login, dump the database and delete data; the root cause is string concatenation instead of parameterized queries.
---

## What SQL injection is

**SQL injection** is a vulnerability where an application builds a SQL query out of strings and drops user input into it as is. An attacker crafts the input so it stops being "data" and becomes **part of the command** sent to the database.

The database has no idea which part of the query the developer wrote and which part came from a visitor. It simply executes the final text.

## What it looks like

A typical vulnerable login:

```js
const sql = "SELECT * FROM users WHERE email = '" + email +
            "' AND password_hash = '" + hash + "'";
```

The user types this into the email field:

```text
admin@example.com' --
```

The query becomes:

```sql
SELECT * FROM users WHERE email = 'admin@example.com' --' AND password_hash = '...'
```

The quote closes the string and `--` comments out the password check. The attacker is logged in as admin without knowing the password.

Another classic input is `' OR '1'='1`, which makes the condition true for every row in the table.

## The main variants

| Variant | How it works | What the attacker sees |
|---|---|---|
| **Classic (in-band)** | Results or database errors come back in the response | Data or SQL error text |
| **UNION-based** | A `UNION SELECT` from another table is appended | Someone else's data in the normal page output |
| **Boolean-based blind** | The attacker asks yes/no questions | Differences in the page response |
| **Time-based blind** | A condition triggers a delay | Server response time |

### UNION-based injection

A product page takes an ID from the URL: `/product?id=10`. If the parameter is inserted into the query directly, the attacker appends:

```text
/product?id=10 UNION SELECT email, password_hash FROM users
```

If the number and types of columns match, the page shows emails and password hashes instead of the product description.

### Blind injection

Sometimes the page shows neither data nor errors. The attacker then compares responses: `id=10 AND 1=1` shows the product, `id=10 AND 1=2` does not, so the condition is evaluated. By asking such questions about characters in the database, data can be extracted one character at a time. If even the response does not differ, attackers use delays: functions like `SLEEP()` in MySQL or `pg_sleep()` in PostgreSQL.

Blind injection is slow, but dedicated tools automate it, so "we do not display anything" is not a defense.

## The damage

- **Data leaks:** customer personal data, password hashes, orders, messages.
- **Authentication bypass:** logging in as any user, including admins.
- **Data tampering:** changing prices, roles, balances.
- **Data deletion:** `DELETE` or `DROP TABLE` if the driver allows stacked queries.
- **Server access:** with broad database privileges, reading files and, in some database systems, running OS commands.

Beyond the direct harm, a personal data leak brings legal liability and lost trust.

## Where to look for weak spots

- Search, filters and sorting in catalogs.
- URL parameters: `id`, `category`, `page`.
- Login, registration and password reset forms.
- Headers and cookies that end up in queries (for logging or analytics, for example).
- Old modules and quick admin scripts.
- Raw queries inside an ORM.

## Common misconceptions

- **"We use an ORM, so we are safe."** Only until you write raw queries with string interpolation.
- **"Escaping quotes is enough."** Numeric parameters and column names go in without quotes, so escaping does not help.
- **"It is an internal system."** Internal users and compromised accounts attack too.

## FAQ

### How can I tell if a site is vulnerable?

Warning signs include SQL errors after typing a quote, or odd filter behavior. A reliable answer comes from code review and testing with tools like sqlmap, only on your own systems or with the owner's written permission.

### Does a WAF stop SQL injection?

Partly. A WAF blocks common attack patterns, but it can be bypassed. It is an extra layer, not a replacement for parameterized queries.

### Does this apply to NoSQL databases?

They do not use SQL, but similar attacks exist, such as injecting query operators in MongoDB. The defense principle is the same: never mix data and commands.
