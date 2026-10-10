---
title: Ma’lumotlar bazasi migratsiyalari: sxemani xavfsiz o‘zgartirish
description: Flyway, Liquibase, Prisma va Alembic’da versiyali migratsiyalar, orqaga qaytarishni rejalash, migratsiyalarni review qilish va muhitlarni sinxron ushlash.
summary: Sxemani faqat repozitoriydagi raqamlangan migratsiyalar orqali o‘zgartiring, ularni deployda avtomatik qo‘llang va xavfli o‘zgarishlarni mos qadamlarga bo‘ling, shunda eski va yangi kod bazada bir vaqtda ishlay oladi.
---

## Qisqa javob

**Migratsiya** — bu sxema o‘zgarishi (jadval yaratish, ustun yoki indeks qo‘shish) yozilgan va versiya raqamiga ega fayl. Vosita bazada qo‘llangan versiyalar ro‘yxatini saqlaydigan xizmat jadvalini yuritadi va har ishga tushganda faqat yangi fayllarni tartib bilan bajaradi.

Xavfsiz ishlash qoidalari:

- sxema serverda qo‘lda hech qachon o‘zgartirilmaydi — faqat Git’dagi migratsiya orqali;
- qo‘llangan migratsiya tahrirlanmaydi, yangisi yoziladi;
- bitta migratsiyalar zanjiri dev, staging va production’da bajariladi;
- xavfli o‘zgarishlar bir necha qadamga bo‘linadi.

## Qaysi vositani tanlash kerak

| Vosita | Ekotizim | Migratsiyalar qanday yoziladi |
|---|---|---|
| **Flyway** | Java, CLI orqali istalgan stek | SQL fayllar `V1__init.sql`, `V2__add_orders.sql` |
| **Liquibase** | Java, CLI orqali istalgan stek | XML/YAML/JSON yoki SQL changelog, ichki rollback bloklari bor |
| **Prisma Migrate** | Node.js / TypeScript | `schema.prisma`ni o‘zgartirasiz, vosita SQL yaratadi |
| **Alembic** | Python / SQLAlchemy | `upgrade()` va `downgrade()` funksiyali Python fayllar |

O‘z stekingizga mosini tanlang: ORM loyihalari odatda o‘z mexanizmidan foydalanadi (Prisma, Alembic, Django yoki Laravel migratsiyalari). Flyway va Liquibase bitta bazadan turli tillardagi servislar foydalanganda qulay.

Alembic migratsiyasi misoli:

```python
def upgrade():
    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))

def downgrade():
    op.drop_column("users", "phone")
```

## Sxemani to‘xtalishsiz o‘zgartirish

Deploy vaqtida ilovaning eski va yangi versiyasi bir muddat birga ishlaydi. Shuning uchun har bir migratsiya eski kod bilan **orqaga mos** bo‘lishi kerak. Buning uchun **expand / contract** usuli qo‘llanadi.

Misol: `name` ustunini `full_name` deb qayta nomlash.

1. **Expand.** NULL’ga ruxsat beruvchi yangi `full_name` ustunini qo‘shing.
2. Kod ikkala ustunga yozadi, eskisidan o‘qiydi.
3. Eski ma’lumotlarni alohida vazifa bilan qismlab ko‘chiring.
4. Kod `full_name`dan o‘qishga o‘tadi.
5. **Contract.** Keyingi relizda `name` ustunini o‘chiring.

Bitta migratsiyada nima xavfli:

- joriy kod o‘qiyotgan ustunni qayta nomlash yoki o‘chirish;
- katta jadvalga sukut qiymatisiz `NOT NULL` qo‘shish;
- jadvalni qayta yozishni talab qiladigan ustun turini o‘zgartirish;
- yozishni bloklovchi indeks yaratish — PostgreSQL’da `CREATE INDEX CONCURRENTLY` ishlating.

## Orqaga qaytarish strategiyalari

Ikki yondashuv bor va ularni birga ishlatish mumkin.

- **Down-migratsiyalar** (`downgrade()`, Liquibase rollback). Dev’da qulay, lekin production’da o‘chirilgan ustunni qaytarish ma’lumotlarni qaytarmaydi.
- **Roll forward.** Xato yangi migratsiya bilan tuzatiladi. Production uchun bu ko‘pincha ishonchliroq.

Minimal kafolat: **har bir xavfli migratsiyadan oldin zaxira** va migratsiya yarmida to‘xtab qolsa nima qilish bo‘yicha tekshirilgan reja. Yodda tuting: MySQL’da DDL amallari tranzaksiya bilan orqaga qaytarilmaydi, PostgreSQL’da esa ko‘pchilik DDL tranzaksion.

## Migratsiyalarni review qilish

Migratsiyani oddiy koddan ko‘ra diqqat bilan tekshiring, chunki uni shunchaki commit bilan qaytarib bo‘lmaydi. Tekshiruvchi uchun ro‘yxat:

- hozir production’dagi kod bilan mosmi;
- jadvalda qancha qator bor va uzoq bloklash bo‘ladimi;
- DDL migratsiya ichida ma’lumot ko‘chirish bormi (alohida ajratgan ma’qul);
- ORM yaratgan SQL ko‘z bilan o‘qilganmi;
- real hajmdagi ma’lumotli nusxada sinab ko‘rilganmi.

## Muhitlarni sinxron ushlash

- Migratsiyalar yangi versiya ishga tushishidan oldin **CI/CD’da avtomatik** qo‘llanadi, qo‘lda emas.
- CI’da bo‘sh baza ko‘tariladi va barcha migratsiyalar noldan bajariladi — buzilgan zanjirlar shunda aniqlanadi.
- Drift tekshiruvini yoqing: Flyway `validate`, Prisma `migrate diff` va shunga o‘xshash buyruqlar fayllar bilan haqiqiy sxema orasidagi farqni ko‘rsatadi.
- Production’da sxemani qo‘lda o‘zgartirishga yo‘l qo‘ymang; agar shunday bo‘lgan bo‘lsa, uni migratsiya sifatida rasmiylashtiring.

## Ko‘p uchraydigan xatolar

- Qo‘llangan migratsiyani tahrirlash — nazorat summalari mos kelmaydi, muhitlar farqlanib ketadi.
- Ikki dasturchi turli branchlarda bir xil raqamli migratsiya yaratgan.
- Migratsiya va unga bog‘liq kod noto‘g‘ri tartibda deploy qilingan.
- Migratsiya ichida millionlab qatorlarni bitta `UPDATE` bilan yangilash.

## FAQ

### Migratsiyalarni ilova ishga tushganda bajarish mumkinmi?

Bitta nusxada ishlaydigan kichik loyihalar uchun mumkin. Nusxalar bir nechta bo‘lsa, migratsiyalar parallel boshlanmasligi uchun ularni deployning alohida qadamida bajaring; ko‘p vositalar bloklash ishlatadi, lekin alohida qadamni nazorat qilish osonroq.

### Roll forward qilsak, down-migratsiyalar kerakmi?

Ular lokal ishlab chiqish va testlar uchun foydali. Production’da, ayniqsa o‘zgarish ma’lumotni o‘chirsa, zaxira va tuzatuvchi migratsiyaga tayaning.

### Migratsiya production’da xato bersa nima qilish kerak?

Deployni to‘xtating va vositaning xizmat jadvalida qaysi versiya muvaffaqiyatsiz deb belgilanganini ko‘ring. Sxema holatini qo‘lda yoki yangi migratsiya bilan tuzating, so‘ng versiyani vosita buyrug‘i bilan to‘g‘ri belgilang (masalan, `flyway repair`).
