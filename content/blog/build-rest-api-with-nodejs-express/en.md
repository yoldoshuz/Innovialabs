---
title: How to Build a REST API with Node.js and Express
description: A step-by-step guide to a REST API with Node.js and Express: project structure, routes, controllers, validation, error handling, a database and testing.
summary: Create an Express project, split code into routes, controllers and a data layer, validate input with a schema, handle errors in a single middleware and test the endpoints with an HTTP client.
---
## The short plan

A REST API on Express is built from five parts:

1. **The app** — creating Express and wiring up middleware.
2. **Routes** — which URLs and methods are available.
3. **Controllers** — what to do with a request.
4. **Data layer** — database queries.
5. **Error handling** — one response format for failures.

Below is a minimal API for a task list (`/tasks`) with PostgreSQL.

## Step 1. Set up the project

```bash
mkdir tasks-api && cd tasks-api
npm init -y
npm install express pg zod dotenv
```

Add `"type": "module"` to `package.json` to use `import`. Structure:

```text
src/
  app.js
  db.js
  routes/tasks.js
  controllers/tasks.js
.env
```

Keep the connection string in `.env`: `DATABASE_URL=postgres://user:pass@localhost:5432/tasks`. This file is never committed to Git.

## Step 2. Connect to the database

```javascript
// src/db.js
import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
```

The table:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
```

A **connection pool** reuses connections instead of opening a new one for every request.

## Step 3. Controllers and validation

A controller receives the request, checks the data and calls the database. **zod** is a convenient validation library.

```javascript
// src/controllers/tasks.js
import { z } from "zod";
import { pool } from "../db.js";

const taskSchema = z.object({ title: z.string().min(1).max(200) });

export async function listTasks(req, res, next) {
  try {
    const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [parsed.data.title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}
```

Note the `$1`: this is a **parameterized query**, and it protects against SQL injection. Never insert user data into SQL through string concatenation.

## Step 4. Routes

```javascript
// src/routes/tasks.js
import { Router } from "express";
import { listTasks, createTask } from "../controllers/tasks.js";

export const tasksRouter = Router();
tasksRouter.get("/", listTasks);
tasksRouter.post("/", createTask);
```

## Step 5. The app and error handling

```javascript
// src/app.js
import "dotenv/config";
import express from "express";
import { tasksRouter } from "./routes/tasks.js";

const app = express();
app.use(express.json());
app.use("/tasks", tasksRouter);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(3000, () => console.log("API on http://localhost:3000"));
```

Express treats middleware with **four arguments** as an error handler. It must come last. Return a generic message to the client and write the details to the log.

## Step 6. Test with an HTTP client

Run `node src/app.js` and check the endpoints with curl, Postman, Insomnia or a REST Client in your editor:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write the docs"}'

curl http://localhost:3000/tasks
```

Test negative cases too: an empty `title`, invalid JSON, a non-existent path. For automated tests, use **supertest** with a test runner.

## What to add before production

The minimal API works, but a real project usually needs a few more things:

- **The rest of CRUD**: `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id`, returning `404` when the record does not exist.
- **Pagination**: `limit` and `offset` parameters or a cursor, so you never return the whole table at once.
- **Authentication**: JWT or sessions, plus permission checks on specific records.
- **Security**: headers via helmet, CORS configuration, rate limiting.
- **Logging**: structured logs instead of `console.log`, for example with pino.
- **Migrations**: the database schema should change through versioned migrations, not by hand.
- **Versioning**: a `/v1` prefix makes it easier to change the API without breaking old clients.

## Common mistakes

- **All logic in one file.** Separate routes, controllers and data access.
- **No validation.** Treat any client data as untrusted.
- **Wrong status codes.** Creation — `201`, bad input — `400`, not found — `404`.
- **Secrets in code.** Passwords and keys belong only in environment variables.
- **Stack traces in responses.** They expose implementation details.

## FAQ

### Do I need TypeScript for an Express REST API?

It is not required, but it helps in a growing project: types prevent mistakes when the data structure changes. A small API can start in JavaScript just fine.

### What can replace hand-written SQL?

An ORM or query builder such as Prisma, Drizzle or Knex. They simplify migrations and typing, but you should still understand the queries they generate.

### How do I document the API?

A common standard is OpenAPI (Swagger). You can maintain the spec by hand or generate it from validation schemas, then serve interactive documentation.
