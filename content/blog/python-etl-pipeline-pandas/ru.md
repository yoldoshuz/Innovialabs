---
title: Как построить простой ETL-конвейер на Python
description: Берём данные из API и CSV, преобразуем в pandas, загружаем в PostgreSQL, запускаем по расписанию и обрабатываем ошибки, повторы и инкрементальную загрузку.
summary: Простой ETL на Python — это три функции (extract, transform, load) плюс четыре правила надёжности: повторы при сбоях сети, идемпотентная загрузка через upsert, инкрементальная выборка по отметке времени и запуск по расписанию с логами.
---

## Короткий ответ

Для небольших объёмов не нужен Airflow или Spark. Хватает скрипта на **Python + pandas + SQLAlchemy**, который:

1. **Extract** — забирает данные из API и CSV.
2. **Transform** — чистит и объединяет их в pandas.
3. **Load** — записывает в PostgreSQL через upsert.
4. Запускается по **cron** и пишет логи.

Пример ниже: заказы приходят из API, справочник товаров — из CSV, результат — таблица `orders` в PostgreSQL.

## Подготовка

```bash
pip install pandas requests sqlalchemy "psycopg[binary]"
```

Целевая таблица с уникальным ключом — без него upsert невозможен:

```sql
CREATE TABLE IF NOT EXISTS orders (
  order_id    bigint PRIMARY KEY,
  product_id  bigint,
  category    text,
  amount      numeric(12, 2) NOT NULL,
  updated_at  timestamptz NOT NULL
);
```

Строку подключения храните в переменной окружения, а не в коде.

## Extract: API с повторами и CSV

Сеть ненадёжна, поэтому повторы с паузой — обязательны. Их даёт `Retry` из urllib3:

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

Если API отдаёт данные **постранично**, пройдите по всем страницам в цикле — частая ошибка забирать только первую.

## Transform: чистим и объединяем

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

Правила трансформации:

- **Явно приводите типы** — не полагайтесь на автоопределение.
- Отбрасывая строки, **логируйте их количество**: тихая потеря данных хуже падения.
- Проверяйте инварианты: сумма не отрицательная, ключ не пустой.

## Load: идемпотентный upsert

Загрузка должна быть **идемпотентной**: повторный запуск с теми же данными не создаёт дублей. Схема — во временную таблицу, затем `INSERT ... ON CONFLICT` в одной транзакции:

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

`engine.begin()` откатит всё, если что-то пойдёт не так, — в таблице не останется половины загрузки.

## Инкрементальная загрузка

Не тяните всю историю каждый раз. Берите **водяной знак** (watermark) — максимальный `updated_at` из целевой таблицы — и запрашивайте только то, что изменилось после него:

```python
from datetime import timedelta

def run():
    with engine.connect() as conn:
        wm = conn.execute(text(
            "SELECT coalesce(max(updated_at), '1970-01-01') FROM orders")).scalar()
    since = wm - timedelta(minutes=10)  # перекрытие на случай поздних записей
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

Небольшое **перекрытие** окна безопасно благодаря upsert: повторно пришедшие строки просто обновятся.

## Расписание и ошибки

Самый простой планировщик — **cron**. `flock` не даст запустить второй экземпляр, пока идёт первый:

```bash
*/30 * * * * cd /opt/etl && flock -n /tmp/etl.lock .venv/bin/python etl.py >> /var/log/etl.log 2>&1
```

Чек-лист надёжности:

- Необработанное исключение завершает скрипт с ненулевым кодом — это видно мониторингу.
- Оповещение в Telegram или почту при падении и при подозрительно пустом результате.
- Секреты — только в переменных окружения.
- Ротация логов, чтобы диск не заполнился.

Когда конвейеров станет много и появятся зависимости между ними, переходите на оркестратор: **Airflow**, **Prefect** или **Dagster**.

## FAQ

### Чем ETL отличается от ELT?

В ETL данные преобразуются до загрузки, в ELT сначала загружаются «как есть», а трансформации выполняются уже внутри хранилища, обычно на SQL. Для небольших объёмов и грязных источников ETL на pandas проще.

### Что делать, если данных слишком много для памяти?

Читайте и загружайте частями: `pd.read_csv(..., chunksize=...)`, постраничные запросы к API. Если объёмы растут постоянно, переносите трансформации в SQL внутри базы.

### Как учесть удалённые в источнике записи?

Инкрементальная загрузка по `updated_at` удаления не видит. Нужен флаг «удалено» в источнике, отдельный эндпоинт удалений или периодическая полная сверка ключей.
