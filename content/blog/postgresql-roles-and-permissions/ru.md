---
title: Пользователи, роли и права доступа в PostgreSQL
description: Как настроить в PostgreSQL отдельные роли для приложения, аналитиков и админов: GRANT, default privileges, read-only пользователь для BI и основы RLS.
summary: Правильная схема прав в PostgreSQL — групповые роли без входа (владелец, приложение, аналитика) и отдельные логины, которые в них входят; права выдаются через GRANT и ALTER DEFAULT PRIVILEGES, BI получает только чтение, а изоляцию строк обеспечивает Row-Level Security.
---

## Короткий ответ

Не работайте под суперпользователем `postgres` из приложения. Рабочая схема:

- **app_owner** — владеет схемой и таблицами, под ним идут миграции.
- **app_rw** — чтение и запись данных, без права менять структуру. Под ним работает приложение.
- **analytics_ro** — только чтение, для аналитиков и BI.
- **Админы** — персональные учётные записи, не общий пароль.

В PostgreSQL пользователь и группа — это одно и то же: **роль**. Роль с `LOGIN` — пользователь, без `LOGIN` — группа прав.

## Шаг 1. Создаём групповые роли и схему

```sql
REVOKE ALL ON DATABASE shop FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

CREATE ROLE app_owner NOLOGIN;
CREATE ROLE app_rw NOLOGIN;
CREATE ROLE analytics_ro NOLOGIN;

CREATE SCHEMA app AUTHORIZATION app_owner;
```

Первые две строки убирают права, которые по умолчанию есть у всех (`PUBLIC`). В новых версиях PostgreSQL создавать объекты в схеме `public` всем уже запрещено, но явная команда не помешает.

## Шаг 2. Выдаём права через GRANT

```sql
GRANT CONNECT ON DATABASE shop TO app_owner, app_rw, analytics_ro;
GRANT USAGE ON SCHEMA app TO app_rw, analytics_ro;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_rw;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_rw;

GRANT SELECT ON ALL TABLES IN SCHEMA app TO analytics_ro;
```

Важно: `ON ALL TABLES` касается **только уже существующих** таблиц. Для будущих нужен следующий шаг.

## Шаг 3. Default privileges для новых таблиц

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT USAGE, SELECT ON SEQUENCES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT SELECT ON TABLES TO analytics_ro;
```

Главная ловушка: default privileges срабатывают только для объектов, которые создаёт **указанная роль** (`FOR ROLE app_owner`). Если миграции выполняются под логином `migrator` и он создаёт таблицы от своего имени, правила не применятся. Решение — начинать миграции с `SET ROLE app_owner;`.

## Шаг 4. Создаём логины

```sql
CREATE ROLE migrator  LOGIN PASSWORD 'change-me' IN ROLE app_owner;
CREATE ROLE app_user  LOGIN PASSWORD 'change-me' IN ROLE app_rw;
CREATE ROLE bi_reader LOGIN PASSWORD 'change-me' IN ROLE analytics_ro;
```

Пароли генерируйте случайные и храните в менеджере секретов. Так при увольнении сотрудника или утечке достаточно отключить один логин, не трогая права.

## Read-only пользователь для BI

Права `analytics_ro` уже не дают писать. Добавьте страховку от тяжёлых запросов:

```sql
ALTER ROLE bi_reader SET default_transaction_read_only = on;
ALTER ROLE bi_reader SET statement_timeout = '60s';
ALTER ROLE bi_reader CONNECTION LIMIT 5;
```

- `default_transaction_read_only` — дополнительная защита, но не замена правам: пользователь может переключить её сам.
- **Чувствительные данные** (телефоны, паспортные данные) не отдавайте целыми таблицами. Сделайте отдельную схему `reporting` с представлениями только нужных столбцов и дайте BI доступ только к ней.
- По возможности подключайте BI к **реплике**, а не к основной базе.

Для быстрой настройки есть встроенная роль `pg_read_all_data` (PostgreSQL 14+), но она открывает чтение **всех** таблиц, включая чувствительные.

## Основы Row-Level Security

**RLS** ограничивает, какие строки видит роль. Типичный случай — SaaS с несколькими клиентами в одной таблице:

```sql
ALTER TABLE app.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON app.orders
  FOR ALL TO app_rw
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::bigint)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::bigint);
```

Приложение в начале каждой транзакции задаёт клиента:

```sql
SELECT set_config('app.tenant_id', '42', true);
```

Что нужно помнить:

- Если значение не задано, политика вернёт пустой результат — это безопасное поведение по умолчанию.
- Роль без подходящей политики не видит **ни одной строки** таблицы с включённым RLS — аналитикам нужна своя политика.
- Владелец таблицы и суперпользователи обходят RLS. Для владельца включите `FORCE ROW LEVEL SECURITY`, если это нужно.

## Администраторы и проверка

- Персональная роль для каждого админа, с `CREATEROLE` и `CREATEDB` вместо `SUPERUSER`, если суперправа не нужны.
- Вход по `scram-sha-256` в `pg_hba.conf`, доступ только с нужных адресов.
- Проверка в psql: `\du` — роли, `\dp app.*` — права на таблицы, `\ddp` — default privileges.

## FAQ

### Почему приложение получает «permission denied» на новую таблицу?

Почти всегда таблицу создала не та роль, для которой настроены default privileges. Проверьте владельца таблицы через `\dt app.*` и выполняйте миграции после `SET ROLE app_owner`.

### Чем USER отличается от ROLE?

Ничем принципиальным: `CREATE USER` — это `CREATE ROLE` с атрибутом `LOGIN` по умолчанию. Используйте роли без входа как группы, а логины — как членов этих групп.

### Нужен ли RLS, если фильтрация уже есть в коде?

RLS — второй уровень защиты: он сработает, даже если в коде забыли условие `WHERE tenant_id = ...`. Для систем с данными разных клиентов в одной базе это оправданная страховка.
