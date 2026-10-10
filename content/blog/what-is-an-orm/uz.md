---
title: ORM nima: afzalliklari, kamchiliklari va mashhur yechimlar
description: Obyekt-relyatsion moslashtirish Prisma, Django ORM, SQLAlchemy va Hibernate misolida qanday ishlaydi, N+1 muammosi nima va qachon oddiy SQL yozgan ma’qul.
summary: ORM — ma’lumotlar bazasi jadvallari bilan koddagi obyektlar kabi ishlash imkonini beradigan va SQL’ni o‘zi generatsiya qiladigan kutubxona. U odatiy ishlab chiqishni tezlashtiradi, lekin bazaga qanday so‘rovlar ketayotganini tushunishni talab qiladi, aks holda N+1 muammosi va sekin sahifalar paydo bo‘ladi.
---

## ORM nima

**ORM (Object-Relational Mapping)** — ilova kodi va relyatsion ma’lumotlar bazasi o‘rtasidagi qatlam. Siz modellarni tasvirlaysiz — `User`, `Order`, `Product` — ORM esa ularni jadvallarga moslashtiradi, metod chaqiruvlarini SQL’ga aylantiradi va natijani obyektlar ko‘rinishida qaytaradi.

`SELECT * FROM users WHERE is_active = true` qatori o‘rniga siz `User.objects.filter(is_active=True)` kabi narsa yozasiz, ORM esa so‘rovni o‘zi yig‘adi, parametrlarni qo‘yadi va obyektlarni yaratadi.

## Mashhur ORM’lar

| ORM | Til | Xususiyatlari |
|---|---|---|
| **Prisma** | TypeScript, JavaScript | Sxema alohida faylda, generatsiya qilingan tiplashtirilgan klient, o‘rnatilgan migratsiyalar |
| **Django ORM** | Python | Django freymvorkining bir qismi, migratsiyalar va admin panel tayyor holda |
| **SQLAlchemy** | Python | Moslashuvchan kutubxona: ham yuqori darajali ORM, ham SQL-ifodalar konstruktori |
| **Hibernate** | Java | JPA standartining amalga oshirilishi, modellar `@Entity` annotatsiyalari bilan tasvirlanadi |

«Buyurtmalari bilan faol foydalanuvchilar» so‘rovi Prisma’da shunday ko‘rinadi:

```ts
const users = await prisma.user.findMany({
  where: { isActive: true },
  include: { orders: true },
});
```

## Afzalliklari

- **Ishlab chiqish tezligi.** Yaratish, o‘qish va yangilashning odatiy amallari bir qatorda yoziladi.
- **Xavfsizlik.** Parametrlar avtomatik qo‘yiladi, bu oddiy foydalanishda SQL-in’eksiyalardan himoya qiladi.
- **Migratsiyalar.** Sxemadagi o‘zgarishlar kodda qayd etiladi va barcha muhitlarda bir xil qo‘llaniladi.
- **Tiplashtirish va avtoto‘ldirish.** Ayniqsa Prisma va SQLAlchemy’ning zamonaviy versiyalarida: maydon nomlaridagi xatolar ishga tushirishdan oldin ko‘rinadi.
- **Ko‘chiriluvchanlik.** PostgreSQL’ni MySQL’ga almashtirish osonroq, garchi amalda bu kamdan-kam hollarda bepul bo‘ladi.

## Kamchiliklari

- **Yashirin so‘rovlar.** Bir qator kod o‘nlab SQL-so‘rovlarni keltirib chiqarishi mumkin.
- **Murakkab hisobotlar**, oyna funksiyalari va bazaning o‘ziga xos imkoniyatlari uchun nooptimal SQL.
- **Yana bir abstraksiya.** Unumdorlikni tuzatish uchun baribir SQL va indekslarni tushunish kerak.

## N+1 muammosi

ORM’ning eng mashhur tuzog‘i. Siz N ta yozuv ro‘yxatini bitta so‘rov bilan olasiz, keyin siklda bog‘langan obyektga murojaat qilasiz — ORM esa har bir yozuv uchun yana bitta so‘rov yuboradi. Natijada bir-ikkita o‘rniga N+1 ta so‘rov.

```python
# Django: buyurtmalar uchun 1 so‘rov + har bir mijoz uchun bittadan so‘rov
for order in Order.objects.all():
    print(order.customer.name)

# Tuzatilgan: buyurtmalar va mijozlar JOIN bilan bitta so‘rovda yuklanadi
for order in Order.objects.select_related("customer"):
    print(order.customer.name)
```

O‘nta buyurtmali lokal bazada farq sezilmaydi. Minglab qatorlar va tarmoq kechikishi bor prodakshenda esa sahifa soniyalab yuklana boshlaydi.

Turli ORM’larda bu qanday hal qilinadi:

- **Django** — «birga-bir» va «ko‘pga-bir» bog‘lanishlar uchun `select_related`, «birga-ko‘p» uchun `prefetch_related`.
- **SQLAlchemy** — `selectinload` va `joinedload` yuklash opsiyalari.
- **Prisma** — bog‘langan modellar bilan `include` yoki `select`.
- **Hibernate** — JPQL-so‘rovda `JOIN FETCH` yoki entity graph’lar.

Asosiysi — ishlab chiqishda **SQL loglashni yoqish** va har bir sahifa nechta so‘rov yuborishini kuzatish.

## Qachon oddiy SQL yaxshiroq

- **Hisobotlar va tahlil**: murakkab agregatsiyalar, oyna funksiyalari, CTE.
- **Ommaviy amallar**: yuz minglab qatorlarni bir vaqtda yangilash yoki qo‘shish.
- **Bazaning o‘ziga xos imkoniyatlari**: to‘liq matnli qidiruv, JSONB-operatorlar, maxsus shartli upsert.
- **Tezlik muhim bo‘lgan so‘rovlar**, bunda bajarilish rejasi ustidan to‘liq nazorat kerak.

Deyarli barcha ORM’lar kerakli joyda xom SQL bajarishga ruxsat beradi. Sog‘lom yondashuv: odatiy ishlarning asosiy qismi uchun ORM, tor joylar uchun SQL.

## FAQ

### ORM ishlatsangiz, SQL’ni bilish kerakmi?

Ha. ORM so‘rovlarni yozishni osonlashtiradi, lekin ularni bekor qilmaydi. SQL’siz sahifa nega sekinlashayotganini tushunish va indekslarni to‘g‘ri qo‘shish qiyin.

### Yangi loyiha uchun qaysi ORM’ni tanlash kerak?

Odatda stekingizda qabul qilinganini: TypeScript uchun Prisma yoki shunga o‘xshashlari, Django loyihalari uchun Django ORM, boshqa Python servislari uchun SQLAlchemy, Java uchun Hibernate. Migratsiyalar sifati va generatsiya qilingan so‘rovlarni tekshirish qulayligiga e’tibor bering.

### Mavjud loyihada N+1’ni qanday topish mumkin?

SQL loglashni yoki Django Debug Toolbar kabi profilerni yoqing va sekin sahifani oching. Faqat ID bilan farqlanadigan takroriy bir xil so‘rovlar — N+1’ning aniq belgisi.
