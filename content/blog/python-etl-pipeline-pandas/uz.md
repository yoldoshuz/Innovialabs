---
title: Python da oddiy ETL konveyerini qanday qurish mumkin
description: API va CSV dan ma’lumot olamiz, pandas da o‘zgartiramiz, PostgreSQL ga yuklaymiz, jadval bo‘yicha ishga tushiramiz va xatolar, qayta urinishlarni boshqaramiz.
summary: Python dagi oddiy ETL — uchta funksiya (extract, transform, load) va to‘rtta ishonchlilik qoidasi: tarmoq uzilishida qayta urinish, upsert orqali idempotent yuklash, vaqt belgisi bo‘yicha inkremental olish va loglar bilan jadval bo‘yicha ishga tushirish.
---

## Qisqa javob

Kichik hajmlar uchun Airflow yoki Spark shart emas. **Python + pandas + SQLAlchemy** skripti yetarli, agar u:

1. **Extract** — API va CSV dan ma’lumot olsa.
2. **Transform** — ularni pandas da tozalab, birlashtirsa.
3. **Load** — PostgreSQL ga upsert orqali yozsa.
4. **cron** bo‘yicha ishga tushib, log yozsa.

Quyidagi misolda buyurtmalar API dan, mahsulotlar ma’lumotnomasi CSV dan keladi, natija esa PostgreSQL dagi `orders` jadvaliga yoziladi.

## Tayyorgarlik

```bash
pip install pandas requests sqlalchemy "psycopg[binary]"
```

Maqsad jadvalda noyob kalit bo‘lishi shart — usiz upsert mumkin emas:

```sql
CREATE TABLE IF NOT EXISTS orders (
  order_id    bigint PRIMARY KEY,
  product_id  bigint,
  category    text,
  amount      numeric(12, 2) NOT NULL,
  updated_at  timestamptz NOT NULL
);
```

Ulanish satrini kodda emas, muhit o‘zgaruvchisida saqlang.

## Extract: qayta urinishli API va CSV

Tarmoq ishonchsiz, shuning uchun pauzali qayta urinishlar majburiy. Ularni urllib3 dagi `Retry` beradi:

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

API ma’lumotlarni **sahifalab** bersa, siklda barcha sahifalarni aylanib chiqing — faqat birinchisini olish keng tarqalgan xato.

## Transform: tozalaymiz va birlashtiramiz

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

Transformatsiya qoidalari:

- **Turlarni aniq belgilang** — avtomatik aniqlashga tayanmang.
- Qatorlarni tashlab yuborsangiz, **sonini logga yozing**: jimgina yo‘qolgan ma’lumot skript qulashidan yomonroq.
- Invariantlarni tekshiring: summa manfiy emas, kalit bo‘sh emas.

## Load: idempotent upsert

Yuklash **idempotent** bo‘lishi kerak: xuddi shu ma’lumotlar bilan qayta ishga tushirish dublikat yaratmaydi. Sxema — avval vaqtinchalik jadvalga, so‘ng bitta tranzaksiyada `INSERT ... ON CONFLICT`:

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

Biror narsa noto‘g‘ri ketsa, `engine.begin()` hammasini orqaga qaytaradi — jadvalda yarim yuklangan ma’lumot qolmaydi.

## Inkremental yuklash

Har safar butun tarixni tortmang. **Suv belgisi** (watermark) — maqsad jadvaldagi eng katta `updated_at` ni oling va faqat undan keyin o‘zgarganlarini so‘rang:

```python
from datetime import timedelta

def run():
    with engine.connect() as conn:
        wm = conn.execute(text(
            "SELECT coalesce(max(updated_at), '1970-01-01') FROM orders")).scalar()
    since = wm - timedelta(minutes=10)  # kech kelgan yozuvlar uchun ustma-ustlik
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

Oynaning kichik **ustma-ustligi** upsert tufayli xavfsiz: qayta kelgan qatorlar shunchaki yangilanadi.

## Jadval va xatolar

Eng oddiy rejalashtiruvchi — **cron**. `flock` birinchi nusxa ishlayotganda ikkinchisini ishga tushirmaydi:

```bash
*/30 * * * * cd /opt/etl && flock -n /tmp/etl.lock .venv/bin/python etl.py >> /var/log/etl.log 2>&1
```

Ishonchlilik chek-listi:

- Qayta ishlanmagan istisno skriptni noldan farqli kod bilan yakunlaydi — monitoring buni ko‘radi.
- Qulaganda va shubhali darajada bo‘sh natijada Telegram yoki pochtaga ogohlantirish.
- Maxfiy kalitlar faqat muhit o‘zgaruvchilarida.
- Disk to‘lib qolmasligi uchun loglar rotatsiyasi.

Konveyerlar ko‘payib, ular orasida bog‘liqliklar paydo bo‘lganda orkestratorga o‘ting: **Airflow**, **Prefect** yoki **Dagster**.

## FAQ

### ETL ning ELT dan farqi nimada?

ETL da ma’lumotlar yuklashdan oldin o‘zgartiriladi, ELT da esa avval «boricha» yuklanadi, transformatsiyalar keyin ombor ichida, odatda SQL da bajariladi. Kichik hajmlar va iflos manbalar uchun pandas dagi ETL soddaroq.

### Ma’lumotlar xotiraga sig‘masa nima qilish kerak?

Qismlab o‘qing va yuklang: `pd.read_csv(..., chunksize=...)`, API ga sahifali so‘rovlar. Hajm doimiy o‘sib borsa, transformatsiyalarni baza ichidagi SQL ga ko‘chiring.

### Manbada o‘chirilgan yozuvlarni qanday hisobga olish mumkin?

`updated_at` bo‘yicha inkremental yuklash o‘chirishlarni ko‘rmaydi. Manbada «o‘chirilgan» belgisi, o‘chirishlar uchun alohida endpoint yoki kalitlarni davriy to‘liq solishtirish kerak.
