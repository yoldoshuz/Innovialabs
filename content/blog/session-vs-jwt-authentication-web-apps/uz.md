---
title: "Sessiya yoki JWT: veb-ilovada avtorizatsiyani qanday qilish"
description: Cookie-sessiyalar va JWT taqqoslanadi: refresh-tokenlar, tokenlarni qayerda saqlash, chiqish va kirishni bekor qilish hamda standart sxema tanlovi.
summary: Oddiy veb-ilova uchun ishonchli standart tanlov — httpOnly cookie’dagi server sessiyalari; refresh-tokenli JWT esa mobil klientlar, bir nechta servislar va tashqi API uchun o‘rinli.
---

## Qisqa javob

- **Sessiya**: kirishdan keyin server omborda (ma’lumotlar bazasi, Redis) yozuv yaratadi va brauzerga cookie’da tasodifiy ID beradi. Har bir so‘rovda server sessiyani shu ID bo‘yicha topadi.
- **JWT**: server foydalanuvchi ma’lumotlari va amal qilish muddati yozilgan imzolangan token beradi. Tekshiruv omborga murojaatsiz, imzo orqali bo‘ladi.

Agar sizda bitta sayt va o‘z backend’ingiz bo‘lsa, **httpOnly cookie’dagi sessiyalardan** boshlang. Ular soddaroq, oson bekor qilinadi va ularda xato qilish qiyinroq.

## Taqqoslash

| | Cookie-sessiya | JWT |
|---|---|---|
| Holat qayerda | Serverda | Token ichida |
| So‘rovni tekshirish | Omborda qidirish | Imzoni tekshirish |
| Chiqish va bekor qilish | Yozuvni o‘chirish kifoya | Muddat tugaguncha qiyin |
| Mobil ilovalar | Mumkin, lekin noqulayroq | Tabiiy |
| Bir nechta servis | Umumiy ombor kerak | Har biri imzoni o‘zi tekshiradi |
| Xato ehtimoli | Pastroq | Yuqoriroq: algoritmlar, muddat, saqlash |

## Refresh oqimi qanday ishlaydi

JWT’ning asosiy muammosi — uni muddati tugashidan oldin «o‘chirib» bo‘lmaydi. Shuning uchun ikki token ishlatiladi:

1. **Access token** — qisqa muddatli, har bir so‘rov bilan yuboriladi.
2. **Refresh token** — uzoq muddatli, ishonchli saqlanadi va faqat yangi access token olish uchun kerak.
3. Access muddati tugaganda klient `/auth/refresh`ni chaqiradi va yangi juftlik oladi.
4. **Rotatsiya**: har bir yangilanishda eski refresh yaroqsiz bo‘ladi. Kimdir ishlatib bo‘lingan refresh’dan foydalanmoqchi bo‘lsa — bu o‘g‘irlik belgisi, butun zanjirni bekor qilish kerak.

E’tibor bering: refresh-tokenlar bekor qilish mumkin bo‘lishi uchun serverda saqlanadi. Ya’ni JWT sxemasi baribir serverdagi holatga qaytadi.

## Brauzerda tokenlarni qayerda saqlash

- **httpOnly, Secure cookie** — JavaScript uni o‘qiy olmaydi, demak, XSS tokenni to‘g‘ridan-to‘g‘ri o‘g‘irlay olmaydi. CSRF’dan himoya kerak: `SameSite=Lax` yoki `Strict` va o‘zgartiruvchi so‘rovlar uchun CSRF-token yoki Origin tekshiruvi.
- **localStorage** — sahifadagi istalgan skript uchun ochiq. Bitta XSS zaiflik — va token sizib chiqdi. Uzoq muddatli tokenlar uchun tavsiya etilmaydi.
- **Ilova xotirasi** — qisqa access token uchun maqbul; refresh esa httpOnly cookie’da saqlanadi.

```http
Set-Cookie: sid=8f3c...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600
```

## Chiqish va kirishni bekor qilish

- **Sessiyalar**: yozuvni o‘chirasiz — foydalanuvchi qaroringizga ko‘ra bitta yoki barcha qurilmalardan chiqadi.
- **JWT**: serverdagi refresh’ni o‘chirasiz, access esa qisqa muddatini o‘tab bo‘ladi. Darhol bloklash uchun denylist yoki server tekshiradigan foydalanuvchi token versiyasi kerak.

Parol o‘zgarganda barcha sessiyalarni albatta bekor qiling va foydalanuvchiga faol qurilmalar ro‘yxatini bering.

## Standart tavsiya etiladigan arxitektura

1. Parollar faqat sekin algoritm bilan xeshlangan holda (bcrypt, scrypt, Argon2).
2. Veb-klient — server sessiyasi, ID `HttpOnly; Secure; SameSite=Lax` cookie’da.
3. Kirishdan keyin yangi sessiya ID’si (sessiya fiksatsiyasidan himoya).
4. Kirish urinishlarini cheklash.
5. Mobil ilova yoki tashqi integratsiyalar — qisqa access JWT + serverda saqlanadigan rotatsiyalanuvchi refresh.
6. Huquqlarni faqat interfeysda tugmalarni yashirish bilan emas, har bir so‘rovda serverda tekshirish.

Hammasini o‘zingiz yozmoqchi bo‘lmasangiz, freymvorkingiz uchun yetuk autentifikatsiya kutubxonasidan yoki tashqi identifikatsiya provayderidan foydalaning.

## Ko‘p uchraydigan xatolar

- localStorage’da muddatsiz JWT.
- JWT payload’ida maxfiy ma’lumotlar — u imzolangan, lekin shifrlanmagan, uni istalgan odam o‘qiy oladi.
- `alg: none` yoki algoritmni qat’iy tekshirmasdan tokenlarni qabul qilish.
- «Barcha qurilmalardan chiqish» imkoniyati yo‘q.

## FAQ

### JWT sessiyalardan tezroqmi?

Imzoni tekshirish bazaga murojaat talab qilmaydi, lekin Redis’da sessiyani qidirish ham odatda juda tez. Ko‘pchilik loyihalar uchun bu farq ishonchlilik va soddalikka nisbatan ahamiyatsiz.

### JWT’ni cookie’da saqlash mumkinmi?

Ha, brauzer uchun bu ko‘pincha eng yaxshi variant: httpOnly cookie tokenni skriptlardan himoya qiladi. Faqat CSRF himoyasini unutmang.

### Alohida API’li React SPA uchun nimani tanlash kerak?

API sizning domeningiz yoki subdomeningizda bo‘lsa, cookie’dagi sessiyalar a’lo ishlaydi. JWT o‘sha API mobil ilovalar yoki uchinchi tomon klientlariga ham xizmat qilganda mantiqli.
