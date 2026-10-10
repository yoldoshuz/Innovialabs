---
title: JOIN в SQL: INNER, LEFT, RIGHT и FULL на примерах
description: INNER, LEFT, RIGHT и FULL JOIN на двух маленьких таблицах с результатами запросов, а также дубли строк, self join и соединение трёх и более таблиц.
summary: JOIN объединяет строки двух таблиц по условию совпадения: INNER оставляет только совпадения, LEFT — все строки левой таблицы, RIGHT — все строки правой, а FULL — всё из обеих, заполняя пробелы значением NULL.
---

## Коротко о главном

**JOIN** ставит строки двух таблиц рядом, когда выполняется условие — обычно когда внешний ключ равен первичному. Тип соединения решает, что делать со строками **без пары**:

| JOIN | Строки без совпадения |
|---|---|
| `INNER JOIN` | Отбрасываются с обеих сторон |
| `LEFT JOIN` | Остаются из левой таблицы, колонки правой — `NULL` |
| `RIGHT JOIN` | Остаются из правой таблицы, колонки левой — `NULL` |
| `FULL JOIN` | Остаются с обеих сторон |

## Две маленькие таблицы

**customers**

| id | name |
|---|---|
| 1 | Азиз |
| 2 | Малика |
| 3 | Бобур |

**orders**

| id | customer_id | total |
|---|---|---|
| 101 | 1 | 50 |
| 102 | 1 | 30 |
| 103 | 2 | 20 |
| 104 | NULL | 15 |

У Бобура нет заказов. Заказ 104 — гостевой, без клиента.

## INNER JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Азиз | 101 | 50 |
| Азиз | 102 | 30 |
| Малика | 103 | 20 |

Только совпавшие пары. Бобур и заказ 104 пропадают. Просто `JOIN` означает `INNER JOIN`.

## LEFT JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Азиз | 101 | 50 |
| Азиз | 102 | 30 |
| Малика | 103 | 20 |
| Бобур | NULL | NULL |

Все клиенты на месте. Это основной JOIN для задач «все X и Y, если он есть», а также для поиска строк без пары:

```sql
-- клиенты, которые ни разу не заказывали
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## RIGHT JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Азиз | 101 | 50 |
| Азиз | 102 | 30 |
| Малика | 103 | 20 |
| NULL | 104 | 15 |

Все заказы на месте. RIGHT JOIN — это LEFT JOIN с переставленными таблицами, поэтому многие команды ради читаемости пишут только LEFT.

## FULL JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
FULL JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Азиз | 101 | 50 |
| Азиз | 102 | 30 |
| Малика | 103 | 20 |
| Бобур | NULL | NULL |
| NULL | 104 | 15 |

Всё с обеих сторон. Полезно для сравнения двух списков, например при сверке платежей со счетами. MySQL не поддерживает `FULL JOIN` — там объединяют LEFT и RIGHT JOIN через `UNION`.

## Дубли строк: почему растут суммы

Азиз выше встречается дважды, потому что у него два заказа. Это правильно, но превращается в ловушку, когда вы соединяете **две таблицы «один ко многим»** сразу:

```sql
-- неверно: заказы и платежи перемножаются
SELECT c.name, SUM(o.total)
FROM customers c
JOIN orders o   ON o.customer_id = c.id
JOIN payments p ON p.customer_id = c.id
GROUP BY c.name;
```

Если у Азиза 2 заказа и 3 платежа, каждая строка заказа повторится 3 раза, и сумма будет завышена. Решение — сначала агрегировать каждую таблицу отдельно:

```sql
SELECT c.name, o.orders_total, p.paid_total
FROM customers c
LEFT JOIN (SELECT customer_id, SUM(total)  AS orders_total FROM orders   GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, SUM(amount) AS paid_total   FROM payments GROUP BY customer_id) p ON p.customer_id = c.id;
```

Если `DISTINCT` добавлен только чтобы спрятать дубли, сначала проверьте условия соединения.

## Self join

Таблица соединяется сама с собой под двумя псевдонимами. Классика — сотрудники и их руководители в одной таблице:

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;
```

LEFT JOIN сохраняет главного руководителя, у которого `manager_id` равен `NULL`.

## Соединение трёх и более таблиц

JOIN применяются по очереди, каждый добавляет к результату ещё одну таблицу:

```sql
SELECT o.id, c.name, p.title, oi.qty
FROM orders o
JOIN customers   c  ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products    p  ON p.id = oi.product_id;
```

Советы: давайте каждой таблице короткий псевдоним, пишите условие `ON` рядом со своей таблицей и индексируйте колонки внешних ключей, по которым идут соединения.

## Частые ошибки

- **Фильтр по правой таблице в WHERE** после LEFT JOIN: `WHERE o.total > 10` убирает строки с `NULL` и незаметно превращает запрос в INNER JOIN. Переносите такое условие в `ON`.
- **Забытое условие ON** или не та колонка — в результате огромное декартово произведение.
- **Сравнение с NULL через `=`**: `NULL = NULL` не истинно, поэтому строки с `NULL` в ключе никогда не совпадут.

## FAQ

### Есть ли разница в скорости между INNER и LEFT JOIN?

Иногда у оптимизатора больше свободы с INNER JOIN, но главный фактор — индексы на колонках соединения. Выбирайте тип JOIN по нужному результату, а не по скорости.

### Что такое CROSS JOIN?

Он возвращает все комбинации строк двух таблиц без условия. Три клиента и четыре заказа дают двенадцать строк. Полезно для генерации сочетаний, например каждый товар на каждую дату, и опасно, если получилось случайно.

### Условия писать в ON или в WHERE?

Для INNER JOIN результат одинаковый. Для LEFT, RIGHT и FULL JOIN — разный: условия в `ON` определяют, какие строки совпадают, а условия в `WHERE` фильтруют итоговый результат и могут удалить строки с `NULL`.
