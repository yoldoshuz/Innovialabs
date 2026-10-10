---
title: SQL-inyeksiya nima va hujumchilar undan qanday foydalanadi
description: Satrlarni ulash foydalanuvchi kiritgan ma’lumotni SQL so‘rov qismiga qanday aylantiradi, klassik, ko‘r va UNION inyeksiyalar farqi va ular keltiradigan zarar.
summary: SQL-inyeksiya — foydalanuvchi ma’lumoti SQL so‘rovning bir qismiga aylanib, uning ma’nosini o‘zgartiradigan zaiflik. U orqali kirishni aylanib o‘tadi, bazani yuklab oladi va ma’lumotlarni o‘chiradi; sababi — parametrlangan so‘rovlar o‘rniga satrlarni ulash.
---

## SQL-inyeksiya nima

**SQL-inyeksiya** — ilova SQL so‘rovni satrlardan yig‘ib, unga foydalanuvchi kiritgan ma’lumotni o‘zgarishsiz qo‘yadigan zaiflik. Hujumchi kiritiladigan ma’lumotni shunday tanlaydiki, u «ma’lumot» bo‘lishdan to‘xtab, bazaga yuboriladigan **buyruqning bir qismiga** aylanadi.

Baza so‘rovning qaysi qismini dasturchi, qaysi qismini sayt tashrifchisi yozganini bilmaydi. U shunchaki yakuniy matnni bajaradi.

## Bu qanday ko‘rinadi

Tizimga kirishning odatiy zaif kodi:

```js
const sql = "SELECT * FROM users WHERE email = '" + email +
            "' AND password_hash = '" + hash + "'";
```

Foydalanuvchi email maydoniga quyidagini kiritadi:

```text
admin@example.com' --
```

So‘rov quyidagiga aylanadi:

```sql
SELECT * FROM users WHERE email = 'admin@example.com' --' AND password_hash = '...'
```

Qo‘shtirnoq satrni yopdi, `--` esa parol tekshiruvini izohga aylantirdi. Hujumchi parolni bilmasdan administrator sifatida kirdi.

Yana bir klassik kiritma — `' OR '1'='1`: shart jadvalning barcha qatorlari uchun rost bo‘lib qoladi.

## Asosiy turlari

| Turi | Qanday ishlaydi | Hujumchi nimani ko‘radi |
|---|---|---|
| **Klassik (in-band)** | Natija yoki baza xatosi to‘g‘ridan-to‘g‘ri javobda keladi | Ma’lumotlar yoki SQL xatosi matni |
| **UNION-based** | So‘rovga boshqa jadvaldan `UNION SELECT` qo‘shiladi | Sahifaning oddiy chiqishida begona ma’lumotlar |
| **Shart bo‘yicha ko‘r (boolean)** | Hujumchi «ha/yo‘q» savollarini beradi | Sahifa javobidagi farq |
| **Vaqt bo‘yicha ko‘r (time-based)** | Shart javobni kechiktiradi | Server javob vaqti |

### UNION-inyeksiya

Mahsulot sahifasi ID ni manzildan oladi: `/product?id=10`. Agar parametr so‘rovga to‘g‘ridan-to‘g‘ri qo‘yilsa, hujumchi qo‘shadi:

```text
/product?id=10 UNION SELECT email, password_hash FROM users
```

Ustunlar soni va turlari mos kelsa, sahifada mahsulot tavsifi o‘rniga email va parol xeshlari chiqadi.

### Ko‘r inyeksiya

Ba’zan sahifa na ma’lumot, na xatolarni ko‘rsatadi. Unda hujumchi javoblarni solishtiradi: `id=10 AND 1=1` mahsulotni ko‘rsatadi, `id=10 AND 1=2` — yo‘q. Demak, shart bajarilmoqda. Bazadagi belgilar haqida shunday savollar berib, ma’lumotlarni bittadan belgi bo‘yicha chiqarib olish mumkin. Javobda farq bo‘lmasa, kechikishdan foydalaniladi: MySQL’da `SLEEP()` yoki PostgreSQL’da `pg_sleep()` kabi funksiyalar.

Ko‘r inyeksiyalar sekin, lekin ular maxsus vositalar bilan avtomatlashtiriladi, shuning uchun «bizda hech narsa chiqmaydi» — himoya emas.

## U qanday zarar keltiradi

- **Ma’lumotlar sizib chiqishi:** mijozlarning shaxsiy ma’lumotlari, parol xeshlari, buyurtmalar, yozishmalar.
- **Autentifikatsiyani aylanib o‘tish:** istalgan foydalanuvchi, jumladan administrator nomidan kirish.
- **Ma’lumotlarni o‘zgartirish:** narxlar, rollar, balanslarni almashtirish.
- **Ma’lumotlarni o‘chirish:** drayver ketma-ket bir nechta so‘rovga ruxsat bersa, `DELETE` yoki `DROP TABLE`.
- **Serverga kirish:** baza foydalanuvchisi huquqlari keng bo‘lsa — fayllarni o‘qish, ba’zi DBMS’larda esa OT buyruqlarini bajarish.

To‘g‘ridan-to‘g‘ri zarardan tashqari, shaxsiy ma’lumotlarning sizib chiqishi yuridik javobgarlik va ishonchni yo‘qotishga olib keladi.

## Zaif joylarni qayerdan qidirish kerak

- Kataloglardagi qidiruv, filtrlar va saralash.
- URL parametrlari: `id`, `category`, `page`.
- Kirish, ro‘yxatdan o‘tish va parolni tiklash formalari.
- So‘rovlarga tushadigan sarlavhalar va cookie’lar (masalan, log yoki analitika uchun).
- Eski modullar va admin panel uchun «tezkor» skriptlar.
- ORM ichidagi xom so‘rovlar.

## Ko‘p uchraydigan noto‘g‘ri tasavvurlar

- **«Biz ORM ishlatamiz, demak himoyalanganmiz».** Faqat satr qo‘yib xom so‘rovlar yozmaguningizcha.
- **«Qo‘shtirnoqlarni ekranlash yetarli».** Raqamli parametrlar va ustun nomlari qo‘shtirnoqsiz qo‘yiladi, ekranlash yordam bermaydi.
- **«Bu ichki tizim».** Ichki foydalanuvchilar va buzilgan akkauntlar ham hujum qiladi.

## FAQ

### Sayt zaifligini qanday bilish mumkin?

Belgilari — qo‘shtirnoq kiritilganda sahifada SQL xatolari yoki filtrlarning g‘alati ishlashi. Ishonchli javobni kod-review va sqlmap kabi vositalar bilan testlash beradi — faqat o‘z tizimlaringizda yoki egasining yozma ruxsati bilan.

### WAF SQL-inyeksiyalardan himoya qiladimi?

Qisman. WAF odatiy hujum shablonlarini bloklaydi, lekin uni aylanib o‘tishadi. Bu qo‘shimcha qatlam, parametrlangan so‘rovlar o‘rnini bosmaydi.

### SQL-inyeksiyalar NoSQL bazalarda ham bormi?

U yerda SQL ishlatilmaydi, lekin o‘xshash hujumlar mavjud: masalan, MongoDB’da so‘rov operatorlarini qo‘yish. Himoya tamoyili bir xil — ma’lumotlar va buyruqlarni aralashtirmaslik.
