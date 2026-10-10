---
title: Node.js va Express’da REST API qanday yaratiladi
description: Node.js va Express’da REST API bo‘yicha qadamma-qadam qo‘llanma: loyiha tuzilmasi, marshrutlar, kontrollerlar, validatsiya, xatolar, baza va testlash.
summary: Express loyihasini yarating, kodni marshrutlar, kontrollerlar va ma’lumotlar qatlamiga ajrating, kiruvchi ma’lumotlarni sxema bilan tekshiring, xatolarni bitta middleware’da qayta ishlang va endpoint’larni HTTP-klient bilan sinang.
---
## Qisqa reja

Express’dagi REST API besh qismdan yig‘iladi:

1. **Ilova** — Express’ni yaratish va middleware’larni ulash.
2. **Marshrutlar** — qaysi URL va metodlar mavjud.
3. **Kontrollerlar** — so‘rov bilan nima qilish kerak.
4. **Ma’lumotlar qatlami** — bazaga so‘rovlar.
5. **Xatolarni qayta ishlash** — nosozlikda yagona javob formati.

Quyida PostgreSQL bilan vazifalar ro‘yxati (`/tasks`) uchun minimal API.

## 1-qadam. Loyihani tayyorlash

```bash
mkdir tasks-api && cd tasks-api
npm init -y
npm install express pg zod dotenv
```

`import` ishlatish uchun `package.json`’ga `"type": "module"` qo‘shing. Tuzilma:

```text
src/
  app.js
  db.js
  routes/tasks.js
  controllers/tasks.js
.env
```

Ulanish satrini `.env`’da saqlang: `DATABASE_URL=postgres://user:pass@localhost:5432/tasks`. Bu fayl Git’ga commit qilinmaydi.

## 2-qadam. Bazaga ulanish

```javascript
// src/db.js
import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
```

Jadval:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
```

**Ulanishlar puli** har bir so‘rov uchun yangisini ochmasdan, ulanishlarni qayta ishlatadi.

## 3-qadam. Kontrollerlar va validatsiya

Kontroller so‘rovni qabul qiladi, ma’lumotlarni tekshiradi va bazaga murojaat qiladi. Validatsiya uchun **zod** qulay.

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

`$1`’ga e’tibor bering: bu **parametrlangan so‘rov**, u SQL-in’yeksiyalardan himoya qiladi. Foydalanuvchi ma’lumotlarini hech qachon satrlarni ulash orqali SQL’ga qo‘ymang.

## 4-qadam. Marshrutlar

```javascript
// src/routes/tasks.js
import { Router } from "express";
import { listTasks, createTask } from "../controllers/tasks.js";

export const tasksRouter = Router();
tasksRouter.get("/", listTasks);
tasksRouter.post("/", createTask);
```

## 5-qadam. Ilova va xatolarni qayta ishlash

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

Express **to‘rtta argumentli** middleware’ni xatolar ishlovchisi deb hisoblaydi. U oxirida turishi kerak. Klientga umumiy xabar qaytaring, tafsilotlarni esa logga yozing.

## 6-qadam. HTTP-klient bilan tekshirish

`node src/app.js` ni ishga tushiring va endpoint’larni curl, Postman, Insomnia yoki muharrirdagi REST Client orqali tekshiring:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Hujjatlarni yozish"}'

curl http://localhost:3000/tasks
```

Salbiy holatlarni ham tekshiring: bo‘sh `title`, noto‘g‘ri JSON, mavjud bo‘lmagan yo‘l. Avtotestlar uchun test vositasi bilan **supertest** mos keladi.

## Production’dan oldin nimalarni qo‘shish kerak

Minimal API ishlaydi, lekin haqiqiy loyihaga odatda yana bir nechta narsa kerak bo‘ladi:

- **CRUD’ning qolgan operatsiyalari**: `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id`, yozuv topilmasa `404` javobi bilan.
- **Paginatsiya**: butun jadvalni bir martada bermaslik uchun `limit` va `offset` parametrlari yoki kursor.
- **Autentifikatsiya**: JWT yoki sessiyalar, shuningdek aniq yozuvlarga kirish huquqini tekshirish.
- **Xavfsizlik**: helmet orqali sarlavhalar, CORS sozlamalari, so‘rovlar chastotasini cheklash.
- **Loglash**: `console.log` o‘rniga tuzilmali loglar, masalan, pino orqali.
- **Migratsiyalar**: baza sxemasi qo‘lda emas, versiyalangan migratsiyalar orqali o‘zgarishi kerak.
- **Versiyalash**: `/v1` prefiksi eski klientlarni buzmasdan API’ni o‘zgartirishni osonlashtiradi.

## Keng tarqalgan xatolar

- **Butun mantiq bitta faylda.** Marshrutlar, kontrollerlar va ma’lumotlarga kirishni ajrating.
- **Validatsiya yo‘q.** Klientdan kelgan har qanday ma’lumotni ishonchsiz deb hisoblang.
- **Noto‘g‘ri statuslar.** Yaratish — `201`, kiritish xatosi — `400`, topilmadi — `404`.
- **Koddagi sirlar.** Parollar va kalitlar — faqat muhit o‘zgaruvchilarida.
- **Javobdagi xato steki.** Bu amalga oshirish tafsilotlarini oshkor qiladi.

## FAQ

### Express’dagi REST API uchun TypeScript kerakmi?

Majburiy emas, lekin o‘sib borayotgan loyihada foydali: tiplar ma’lumotlar tuzilmasi o‘zgarganda xatolardan saqlaydi. Kichik API’ni JavaScript’da boshlash mumkin.

### Qo‘lda yozilgan SQL’ni nima bilan almashtirish mumkin?

ORM yoki query builder bilan — masalan, Prisma, Drizzle yoki Knex. Ular migratsiyalar va tiplashni soddalashtiradi, lekin ular qanday so‘rovlar yaratishini tushunish muhim.

### API’ni qanday hujjatlashtirish kerak?

Keng tarqalgan standart — OpenAPI (Swagger). Tavsifni qo‘lda yuritish yoki validatsiya sxemalaridan generatsiya qilish, so‘ng interaktiv hujjat sifatida ko‘rsatish mumkin.
