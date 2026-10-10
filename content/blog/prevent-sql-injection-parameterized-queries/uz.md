---
title: SQL-inyeksiyalardan himoya: parametrlangan so‘rovlar va ORM
description: PHP, Python va Node.js’da parametrlangan so‘rovlar, ORM’dagi xom so‘rov tuzoqlari, xavfsiz ORDER BY va LIKE, bazada minimal huquqlar va sqlmap bilan tekshirish.
summary: SQL-inyeksiyalardan parametrlangan so‘rovlar himoya qiladi: so‘rov matni va ma’lumotlar bazaga alohida yuboriladi, kiritilgan ma’lumot buyruqqa aylana olmaydi. Ustun nomlari oq ro‘yxatdan olinadi, ilova esa minimal huquqli DB foydalanuvchisi ostida ishlaydi.
---

## Asosiy qoida

Hech qachon SQL so‘rovni satrlarni ma’lumotlar bilan ulab yig‘mang. **Parametrlangan so‘rovlardan** (prepared statements) foydalaning: so‘rovda plaseholderlar turadi, qiymatlar esa alohida uzatiladi. Baza avval so‘rov tuzilmasini tahlil qiladi va shundan keyingina ma’lumotlarni qo‘yadi — kod sifatida emas, qiymat sifatida.

Qo‘shtirnoqlarni qo‘lda ekranlash, «xavfli so‘zlar» filtrlari va frontenddagi tekshiruvlar himoya emas.

## Turli tillardagi misollar

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

Bu yerda `%s` — drayverning plaseholderi. Xato — qiymatni o‘zingiz f-satr yoki `%` operatori orqali qo‘yish.

### Node.js (pg)

```js
const { rows } = await pool.query(
  "SELECT id, name FROM users WHERE email = $1",
  [email]
);
```

## ORM tuzoqlari

ORM parametrlangan so‘rovlarni o‘zi yaratadi, lekin deyarli har birida «xom» rejim bor va u yerda himoya sizning zimmangizda.

| ORM | Xavfsiz | Xavfli |
|---|---|---|
| Prisma | `` $queryRaw`... ${email}` `` (teglangan shablon) | ma’lumotdan yig‘ilgan satr bilan `$queryRawUnsafe` |
| Django | `.raw("... %s", [email])` | `.raw(f"... {email}")`, ma’lumot bilan `.extra()` |
| SQLAlchemy | parametrlar bilan `text("... :email")` | `text()` ichida f-satr |
| Laravel | `whereRaw('email = ?', [$email])` | `DB::raw("... $email")` |
| Sequelize | `query(sql, { replacements })` | ma’lumotli shablon satr |

Kodda satr interpolyatsiyasi yonidagi `raw`, `Unsafe`, `execute` so‘zlarini qidiring — ular review uchun birinchi nomzodlar.

## Dinamik ORDER BY

Plaseholderlar faqat **qiymatlar** uchun ishlaydi. Ustun nomi yoki saralash yo‘nalishini parametr orqali uzatib bo‘lmaydi, shuning uchun **oq ro‘yxatdan** foydalaning:

```js
const SORT = { name: "name", date: "created_at", price: "price" };
const column = SORT[req.query.sort] ?? "created_at";
const dir = req.query.dir === "asc" ? "ASC" : "DESC";

const sql = `SELECT id, name FROM products ORDER BY ${column} ${dir} LIMIT $1`;
await pool.query(sql, [20]);
```

Foydalanuvchi kalitni tanlaydi, so‘rovga esa faqat oldindan ma’lum satr tushadi. Jadval nomlari va ustunlar ro‘yxati bilan ham xuddi shunday yo‘l tutiladi.

## LIKE orqali qidiruv

Shablon ham parametr sifatida uzatiladi. Qo‘shimcha ravishda kiritilgan ma’lumotdagi `%` va `_` ni ekranlang, aks holda foydalanuvchi o‘z niqoblarini qo‘yib, bazani yuklashi mumkin:

```js
const term = input.replace(/[\\%_]/g, "\\$&");
await pool.query(
  "SELECT id, name FROM products WHERE name ILIKE $1",
  [`%${term}%`]
);
```

PostgreSQL va MySQL’da teskari slesh LIKE uchun standart escape-belgi; boshqa DBMS’larda uni `ESCAPE` orqali aniq ko‘rsating.

## Bazada minimal huquqlar

Inyeksiya topilgan taqdirda ham zararni DB foydalanuvchisining huquqlari cheklaydi:

- ilova superfoydalanuvchi ostida emas, alohida foydalanuvchi ostida ulanadi;
- unda kerakli jadvallarga faqat `SELECT`, `INSERT`, `UPDATE`, `DELETE` bor, `DROP` va `ALTER` yo‘q;
- migratsiyalarni boshqa foydalanuvchi, faqat deploy vaqtida bajaradi;
- hisobotlar va analitika uchun — faqat o‘qish huquqli foydalanuvchi;
- SQL xatolari tashrifchiga ko‘rsatilmaydi, logga yoziladi.

```sql
CREATE ROLE app_user LOGIN PASSWORD 'from-secrets-manager';
GRANT CONNECT ON DATABASE shop TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

## sqlmap bilan tekshirish

**sqlmap** — SQL-inyeksiyalarni avtomatik qidiradigan va ulardan foydalanadigan ochiq vosita. Uni faqat o‘z tizimlaringizda, yaxshisi staging nusxasida ishga tushiring: u ko‘p so‘rov yuboradi va ma’lumotlarni o‘zgartirishi mumkin.

```bash
sqlmap -u "https://staging.example.com/product?id=10" --batch
sqlmap -u "https://staging.example.com/search" --data="q=test" --cookie="session=..." --batch
```

sqlmap’dan tashqari CI’da statik tahlil (Semgrep, CodeQL) va har bir xom so‘rovni review qilish foydali.

## Chek-list

1. Barcha so‘rovlar parametrlangan, satrlarni ulash yo‘q.
2. ORM’ning xom so‘rovlari qo‘lda tekshirilgan.
3. Saralash, jadval va ustun nomlari — faqat oq ro‘yxatdan.
4. LIKE uchun kiritilgan ma’lumotda `%` va `_` ekranlangan.
5. DB foydalanuvchisi minimal huquqlarga ega.
6. SQL xatolari tashrifchilarga ko‘rinmaydi.
7. sqlmap va statik tahlil bilan muntazam tekshiruv.

## FAQ

### Saqlanadigan protseduralar inyeksiyalardan himoya qiladimi?

Faqat ularning ichida satrlarni ulash orqali dinamik SQL bo‘lmasa. Parametrlardan so‘rov yig‘adigan protsedura ham xuddi shunday zaif.

### So‘rovlar parametrlangan bo‘lsa, kiritishni validatsiya qilish kerakmi?

Ha, qo‘shimcha qatlam sifatida: tur va formatni tekshirish (raqam, email, uzunlik) keraksiz ma’lumotlarni chetlatadi va mantiqni soddalashtiradi. Lekin inyeksiyalardan himoyani aynan parametrlash beradi.

### sqlmap’ni production’da ishga tushirsa bo‘ladimi?

Yaxshisi yo‘q: vosita yuklama yaratadi va ma’lumotlarni o‘zgartirishi mumkin. Test ma’lumotlari bilan muhit nusxasidan foydalaning.
