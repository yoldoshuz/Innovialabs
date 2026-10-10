---
title: Kirish nazoratining buzilishi va IDOR: qanday topish va tuzatish
description: URL’dagi ID’ni almashtirish begona ma’lumotlarni qanday ochadi, nega bu OWASP Top 10’da birinchi va serverda huquq tekshiruvi hamda testlarni qanday qurish.
summary: IDOR — server obyektni ID bo‘yicha joriy foydalanuvchiga tegishli ekanini tekshirmasdan qaytarishi. Davosi: har bir so‘rovda serverda huquq tekshiruvi, egasi bo‘yicha filtrlangan so‘rovlar va «B foydalanuvchi A’ning ma’lumotlarini ko‘rmaydi» turidagi avtotestlar.
---

## IDOR nima

**Broken Access Control** — foydalanuvchi huquqi bo‘lmagan amalni bajara oladigan xatolarning umumiy nomi. **IDOR (Insecure Direct Object Reference)** — uning eng ko‘p uchraydigan turi: server so‘rovdagi identifikator bo‘yicha obyektni topadi va kimniki ekanini tekshirmasdan qaytaradi.

Klassik misol. Foydalanuvchi o‘z hisob-fakturasini ochadi:

```
GET /api/invoices/1042
```

Raqamni `1041`ga o‘zgartiradi va ism, manzil va summa ko‘rsatilgan boshqa birovning hisobini ko‘radi. Hech qanday buzish yo‘q: oddiy brauzer va bitta raqam.

Xuddi shu narsa o‘zgartirish va o‘chirishda (`PUT /api/orders/77`), fayllarni yuklab olishda (`/files/report-883.pdf`), so‘rov tanasidagi parametrlarda (`"user_id": 15`) va formaning yashirin maydonlarida ham ishlaydi.

## Nega bu OWASP Top 10’dagi birinchi xavf

OWASP Top 10’da kirish nazoratining buzilishi birinchi o‘rinda (A01). Sabablari amaliy:

- **Freymvork buni siz uchun qilmaydi.** Autentifikatsiya bir qator bilan ulanadi, lekin «hisobni faqat egasi va kompaniya buxgalteri ko‘radi» qoidasini faqat sizning kodingiz biladi.
- **Tekshiruvni har bir endpoint’da takrorlash kerak.** Uni bittasida, masalan CSV eksportida unutish yetarli.
- **Skanerlar uni deyarli topmaydi:** ular qaysi ma’lumot kimga tegishli ekanini bilmaydi.
- **Frontend yolg‘on xavfsizlik hissini beradi:** interfeysda «O‘chirish» tugmasi yo‘q, lekin API so‘rovni qabul qiladi.

## Buzilish turlari

| Tur | Misol |
|---|---|
| Gorizontal eskalatsiya | mijoz boshqa mijozning buyurtmalarini o‘qiydi |
| Vertikal eskalatsiya | oddiy foydalanuvchi `/admin/users`ni chaqiradi |
| Multitenantlik | A kompaniya xodimi B kompaniya ma’lumotlarini ko‘radi |
| Mass assignment | so‘rov tanasida `"role": "admin"` yuboriladi va server uni saqlaydi |
| Metodlar orqali aylanib o‘tish | `GET` tekshirilgan, xuddi shu resursga `DELETE` esa yo‘q |

## Qanday tuzatish kerak

### Tanlovni egasi bo‘yicha filtrlang

«ID bo‘yicha topib, keyin tekshirish» emas, balki darhol foydalanuvchiga ruxsat etilgan doirada qidiring:

```js
// Yomon: istalgan hisobni qaytaradi
const invoice = await db.invoice.findUnique({ where: { id } });

// Yaxshi: faqat joriy foydalanuvchining hisoblari orasidan qidiramiz
const invoice = await db.invoice.findFirst({
  where: { id, ownerId: session.userId },
});
if (!invoice) return res.status(404).end();
```

Multitenant tizimlarda xuddi shu qoida **har bir** so‘rovda `tenantId` bilan qo‘llanadi. PostgreSQL’da baza darajasidagi zaxira qatlam sifatida **Row-Level Security** qo‘shish mumkin.

### Qoidalarni markazlashtiring

Kirish qoidalari kontrollerlar bo‘ylab tarqalib ketmasligi kerak. Ularni bir joyga chiqaring — policy’lar, middleware, `can(user, "edit", invoice)` kabi funksiyalar. Shunda ularni o‘qish, review’da tekshirish va test qilish osonroq.

### Standart bo‘yicha taqiqlang

Aniq qoidasi yo‘q yangi endpoint ochiq emas, yopiq bo‘lishi kerak. Rol va huquqlarni so‘rov parametrlaridan yoki imzosi tekshirilmagan JWT’dan emas, server sessiyasidan oling.

### Yashirishni himoya bilan adashtirmang

- **Raqamli ID o‘rniga UUID** taxmin qilishni qiyinlashtiradi, lekin tekshiruvni almashtirmaydi: ID’lar havolalar, xatlar va loglar orqali sizib chiqadi.
- Interfeysda tugma yo‘qligi hech narsani himoya qilmaydi.
- Mass assignment’ni yopish uchun yozishga faqat aniq ro‘yxatdagi maydonlarga ruxsat bering.

Boshqalarning obyektlari uchun `403` o‘rniga `404` qaytarish — odatiy amaliyot: hujumchi obyekt mavjudligini bilib olmaydi.

## Qanday izlash va test qilish kerak

1. **Ikki foydalanuvchi, bitta ssenariy.** A va B yarating, A nomidan amallarni bajaring, keyin so‘rovlarni B sessiyasi bilan takrorlang. Har bir muvaffaqiyatli javob — topilma.
2. **Kirish matritsasi.** «Rol × endpoint × metod» jadvali va kutilgan natija. U testlar uchun ham asos bo‘ladi.
3. **Rad etishga avtotestlar.** Har bir resurs uchun begona foydalanuvchi o‘qish, o‘zgartirish va o‘chirishda `404` yoki `403` olishini tekshiruvchi test.
4. **Kod review.** Egasi yoki tenant sharti bo‘lmagan, ID bo‘yicha bazaga so‘rovlarni qidiring.
5. **Rad etishlarni loglash.** Bitta akkauntdan `403`/`404`ning keskin ko‘payishi — saralash belgisi.

```js
it("user B cannot read user A's invoice", async () => {
  const invoice = await createInvoice(userA);
  const res = await api.as(userB).get(`/api/invoices/${invoice.id}`);
  expect(res.status).toBe(404);
});
```

Batafsil tavsiyalar — [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## FAQ

### UUID IDOR’dan qutqaradimi?

Faqat qisman. UUID’ni taxmin qilish qiyin, lekin u havolalar, xatlar, loglar yoki boshqa endpoint orqali sizib chiqishi mumkin. Serverda huquqni tekshirish baribir majburiy.

### Middleware’da rol bo‘yicha tekshirish yetarlimi?

Yo‘q. Rol «foydalanuvchi umuman hisoblar bilan ishlay oladimi» degan savolga javob beradi, IDOR esa aniq obyekt haqida. Aynan shu hisob foydalanuvchiga yoki uning kompaniyasiga tegishli ekanini tekshirish kerak.

### Begona obyektga so‘rovga nima qaytarish kerak — 403 yoki 404?

Odatda `404`: shunda obyekt mavjudligini tasdiqlamaysiz. `403` foydalanuvchi obyekt haqida biladigan, lekin aniq amalga huquqi bo‘lmagan holatda o‘rinli.
