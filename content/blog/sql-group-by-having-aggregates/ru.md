---
title: GROUP BY, HAVING и агрегатные функции в SQL
description: Как строить отчёты по продажам в SQL с COUNT, SUM, AVG, MIN и MAX, чем WHERE отличается от HAVING, как группировать по датам и каких ошибок избегать.
summary: GROUP BY собирает строки в группы, агрегатные функции считают по каждой группе одно значение, WHERE фильтрует строки до группировки, а HAVING фильтрует уже готовые группы.
---

## Короткий ответ

- **GROUP BY** объединяет строки с одинаковыми значениями в группы.
- **Агрегатные функции** (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) возвращают одно значение на группу.
- **WHERE** отбрасывает строки до группировки.
- **HAVING** отбрасывает группы после подсчёта.

```sql
SELECT city, COUNT(*) AS orders, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY city
HAVING SUM(total) > 1000000
ORDER BY revenue DESC;
```

Читается так: взять оплаченные заказы, сгруппировать по городу, посчитать количество и выручку, оставить города с выручкой больше миллиона.

## Пять агрегатных функций на примере продаж

Таблица `orders(id, customer_id, city, total, status, created_at)`.

```sql
SELECT
  COUNT(*)                     AS orders_count,
  COUNT(DISTINCT customer_id)  AS customers,
  SUM(total)                   AS revenue,
  AVG(total)                   AS avg_check,
  MIN(total)                   AS min_order,
  MAX(total)                   AS max_order
FROM orders
WHERE status = 'paid';
```

Без `GROUP BY` вся выборка — одна группа, и вы получаете одну строку с общими цифрами. Добавьте `GROUP BY city` — получите такую строку для каждого города.

Важные детали:

- `COUNT(*)` считает все строки, `COUNT(column)` — только где значение **не NULL**.
- `SUM`, `AVG`, `MIN`, `MAX` **игнорируют NULL**. `AVG` по колонке с пропусками считает среднее только по заполненным значениям.
- `SUM` по пустой группе возвращает `NULL`, а не 0. Используйте `COALESCE(SUM(total), 0)`.

## WHERE или HAVING

| | WHERE | HAVING |
|---|---|---|
| Когда работает | до группировки | после группировки |
| Что фильтрует | отдельные строки | группы |
| Можно ли агрегаты | нет | да |

Правило: если условие касается отдельной строки (статус, дата, город), пишите его в **WHERE** — так база обработает меньше данных. В **HAVING** оставляйте только условия на агрегаты.

```sql
-- Клиенты, сделавшие 3+ оплаченных заказа в 2026 году
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE status = 'paid'
  AND created_at >= '2026-01-01' AND created_at < '2027-01-01'
GROUP BY customer_id
HAVING COUNT(*) >= 3;
```

## Группировка по датам

Отчёт по месяцам — самая частая задача. Дату нужно привести к началу периода:

```sql
-- PostgreSQL
SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- MySQL
SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

Учтите: если в каком-то месяце продаж не было, его строки в результате **не будет**. Чтобы показать нули, соедините результат с календарём (`generate_series` в PostgreSQL или отдельная таблица дат) через `LEFT JOIN`.

Также следите за часовым поясом: заказ в 01:00 по Ташкенту может оказаться в предыдущих сутках, если даты хранятся в UTC.

## Частые ошибки

- **Колонка в SELECT не входит в GROUP BY и не агрегирована.** PostgreSQL выдаст ошибку, а MySQL без режима `ONLY_FULL_GROUP_BY` вернёт случайное значение из группы.
- **Агрегат в WHERE** — `WHERE SUM(total) > 100` не работает, нужен `HAVING`.
- **Двойной подсчёт после JOIN.** Если соединить заказы с позициями, каждая сумма заказа повторится столько раз, сколько в нём позиций. Сначала агрегируйте, потом соединяйте, или считайте `SUM` по позициям.
- **Целочисленное деление.** В PostgreSQL `AVG` по целым вернёт дробь, но выражение `SUM(a) / COUNT(*)` с целыми может обрезать дробную часть.
- **Алиас в HAVING.** MySQL разрешает `HAVING revenue > 100`, PostgreSQL — нет: повторите выражение `SUM(total)`.

## FAQ

### Можно ли использовать HAVING без GROUP BY?

Да. Тогда вся выборка считается одной группой, и `HAVING` решает, вернуть ли эту единственную строку. На практике это встречается редко.

### Почему COUNT(column) меньше, чем COUNT(*)?

`COUNT(column)` не учитывает строки, где значение колонки `NULL`. Если нужно количество строк, используйте `COUNT(*)`, если количество заполненных значений — `COUNT(column)`.

### Как сгруппировать по нескольким колонкам?

Перечислите их через запятую: `GROUP BY city, DATE_TRUNC('month', created_at)`. Группа образуется для каждой уникальной комбинации значений, например «город и месяц».
