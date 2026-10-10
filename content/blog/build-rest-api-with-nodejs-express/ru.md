---
title: Как создать REST API на Node.js и Express
description: Пошаговое руководство по REST API на Node.js и Express: структура проекта, маршруты, контроллеры, валидация, обработка ошибок, база данных и тесты.
summary: Создайте проект с Express, разделите код на маршруты, контроллеры и слой работы с базой, проверяйте входные данные схемой, обрабатывайте ошибки в одном middleware и тестируйте эндпоинты HTTP-клиентом.
---
## Короткий план

REST API на Express собирается из пяти частей:

1. **Приложение** — создание Express и подключение middleware.
2. **Маршруты** — какие URL и методы доступны.
3. **Контроллеры** — что делать с запросом.
4. **Слой данных** — запросы к базе.
5. **Обработка ошибок** — единый формат ответа при сбоях.

Ниже — минимальный API для списка задач (`/tasks`) с PostgreSQL.

## Шаг 1. Подготовка проекта

```bash
mkdir tasks-api && cd tasks-api
npm init -y
npm install express pg zod dotenv
```

В `package.json` добавьте `"type": "module"`, чтобы использовать `import`. Структура:

```text
src/
  app.js
  db.js
  routes/tasks.js
  controllers/tasks.js
.env
```

В `.env` храните строку подключения: `DATABASE_URL=postgres://user:pass@localhost:5432/tasks`. Этот файл не коммитят в Git.

## Шаг 2. Подключение к базе

```javascript
// src/db.js
import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
```

Таблица:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
```

**Пул соединений** переиспользует подключения, а не открывает новое на каждый запрос.

## Шаг 3. Контроллеры и валидация

Контроллер получает запрос, проверяет данные и обращается к базе. Для валидации удобно использовать **zod**.

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

Обратите внимание на `$1`: это **параметризованный запрос**, он защищает от SQL-инъекций. Никогда не подставляйте данные пользователя в SQL через конкатенацию строк.

## Шаг 4. Маршруты

```javascript
// src/routes/tasks.js
import { Router } from "express";
import { listTasks, createTask } from "../controllers/tasks.js";

export const tasksRouter = Router();
tasksRouter.get("/", listTasks);
tasksRouter.post("/", createTask);
```

## Шаг 5. Приложение и обработка ошибок

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

Middleware с **четырьмя аргументами** Express считает обработчиком ошибок. Он должен идти последним. Клиенту возвращайте общее сообщение, а детали пишите в лог.

## Шаг 6. Проверка HTTP-клиентом

Запустите `node src/app.js` и проверьте эндпоинты через curl, Postman, Insomnia или REST Client в редакторе:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Написать документацию"}'

curl http://localhost:3000/tasks
```

Проверьте и негативные сценарии: пустой `title`, неверный JSON, несуществующий путь. Для автотестов подойдут **supertest** с тестовым раннером.

## Что добавить перед продакшеном

Минимальный API работает, но для реального проекта обычно нужно ещё несколько вещей:

- **Остальные операции CRUD**: `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id` с ответом `404`, если запись не найдена.
- **Пагинация**: параметры `limit` и `offset` или курсор, чтобы не отдавать всю таблицу за раз.
- **Аутентификация**: JWT или сессии, плюс проверка прав доступа к конкретным записям.
- **Безопасность**: заголовки через helmet, настройка CORS, ограничение частоты запросов.
- **Логирование**: структурированные логи вместо `console.log`, например через pino.
- **Миграции**: схема базы должна меняться через версионируемые миграции, а не вручную.
- **Версионирование**: префикс `/v1` упрощает изменения API без поломки старых клиентов.

## Частые ошибки

- **Вся логика в одном файле.** Разделяйте маршруты, контроллеры и доступ к данным.
- **Нет валидации.** Любые данные от клиента считайте недоверенными.
- **Неправильные статусы.** Создание — `201`, ошибка ввода — `400`, не найдено — `404`.
- **Секреты в коде.** Пароли и ключи — только в переменных окружения.
- **Стек ошибки в ответе.** Это раскрывает детали реализации.

## FAQ

### Нужен ли TypeScript для REST API на Express?

Не обязателен, но полезен в растущем проекте: типы помогают избежать ошибок при изменении структуры данных. Небольшой API вполне можно начать на JavaScript.

### Чем заменить ручные SQL-запросы?

Можно использовать ORM или query builder — например, Prisma, Drizzle или Knex. Они упрощают миграции и типизацию, но важно понимать, какие запросы они генерируют.

### Как задокументировать API?

Распространённый стандарт — OpenAPI (Swagger). Описание можно вести вручную или генерировать из схем валидации, а затем показывать интерактивную документацию.
