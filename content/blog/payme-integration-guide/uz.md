---
title: Payme’ni saytga qanday ulash: dasturchi uchun qo‘llanma
description: Payme Merchant API’ni ulash: kassani ro‘yxatdan o‘tkazish, JSON-RPC metodlari, tranzaksiya holatlari, sinov muhiti, so‘rovlarni qayta ishlash va tipik xatolar.
summary: Payme serveringizni JSON-RPC orqali o‘zi chaqiradi: siz Merchant API’ning oltita metodini amalga oshirasiz, avtorizatsiya va tiyindagi summani tekshirasiz, tranzaksiyalarni 1, 2, -1, -2 holatlari bilan saqlaysiz va jangovar kalitga o‘tishdan oldin sinov muhitidagi barcha ssenariylardan o‘tasiz.
---
## Qisqa javob

Payme integratsiyasi «teskari» ishlaydi: saytingiz Payme’ga so‘rov yubormaydi, aksincha **Payme sizning endpoint’ingizni chaqiradi** — to‘lovni qabul qilish mumkinligini so‘raydi, tranzaksiya yaratadi, uni o‘tkazadi va kerak bo‘lsa bekor qiladi. Sizga kerak:

1. Merchant sifatida ro‘yxatdan o‘tish va kassa yaratish.
2. Serveringizda **Merchant API** metodlarini amalga oshirish.
3. Mijozni buyurtma havolasi bilan Payme to‘lov sahifasiga yuborish.
4. Sinov muhitida testlardan o‘tib, jangovar kalitga o‘tish.

## Merchant sifatida ro‘yxatdan o‘tish

- Biznesingizni Payme Business kabinetida ro‘yxatdan o‘tkazing va shartnoma tuzing.
- Sayt uchun **kassa** yarating. Siz kassa ID (merchant ID), **sinov kaliti** va **jangovar kalit** olasiz.
- Kassa sozlamalarida endpoint URL’ini va Payme buyurtmani qidiradigan hisob maydonini, masalan `order_id`, ko‘rsating.

Kalitlarni repozitoriyda emas, muhit o‘zgaruvchilarida saqlang.

## Payme serveringizni qanday chaqiradi

Har bir chaqiruv — `Authorization: Basic ...` sarlavhali JSON-RPC 2.0 POST so‘rovi, unda `Paycom:<kassa kaliti>` kodlangan. Har doim HTTP 200 bilan javob bering, xatoni esa javob tanasida uzating.

```ts
function isPaymeAuthorized(header: string | null, key: string): boolean {
  if (!header?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString();
  const sep = decoded.indexOf(":");
  return decoded.slice(0, sep) === "Paycom" && decoded.slice(sep + 1) === key;
}
```

Avtorizatsiya noto‘g‘ri bo‘lsa, `-32504` xatosini qaytaring.

## Merchant API metodlari

| Metod | Serveringiz nima qiladi |
|---|---|
| `CheckPerformTransaction` | Buyurtma mavjud, to‘lanmagan va summa mos kelishini tekshiradi |
| `CreateTransaction` | 1-holatda tranzaksiya yaratadi yoki shu `id` bilan mavjudini qaytaradi |
| `PerformTransaction` | Tranzaksiyani o‘tkazadi: 2-holat, buyurtma to‘langan |
| `CancelTransaction` | Tranzaksiyani bekor qiladi: -1 yoki -2 holat |
| `CheckTransaction` | Joriy holat va hodisalar vaqtini qaytaradi |
| `GetStatement` | Solishtirish uchun davr bo‘yicha tranzaksiyalar ro‘yxatini beradi |

Summalar **tiyinda**, vaqt millisekundlarda keladi.

## Tranzaksiya holatlari

- **1** — yaratilgan, o‘tkazilishini kutmoqda.
- **2** — o‘tkazilgan, pul yechilgan, buyurtmani bajarish mumkin.
- **-1** — o‘tkazilishidan oldin bekor qilingan.
- **-2** — o‘tkazilgandan keyin bekor qilingan (qaytarish).

Jadvalingizda saqlang: Payme tranzaksiya ID, buyurtma ID, summa, holat, `create_time`, `perform_time`, `cancel_time` va bekor qilish sababi. Metodlarning barcha javoblari shu maydonlardan quriladi.

## Qayta ishlashning asosiy qoidalari

- **Idempotentlik.** Shu `id` bilan takroriy `CreateTransaction` yoki `PerformTransaction` yangi yozuv yaratmasdan, xuddi shu natijani qaytarishi kerak.
- **Bitta buyurtma — bitta faol tranzaksiya.** Buyurtmada 1-holatdagi tranzaksiya bo‘lsa, boshqa `id` bilan yangisini hisob diapazonidagi xato bilan rad eting.
- **Taym-aut.** Hujjatlarda belgilangan vaqt ichida o‘tkazilmagan tranzaksiya bekor qilinadi va u bo‘yicha `PerformTransaction` xato qaytaradi.
- **O‘tkazilgandan keyin bekor qilish** faqat biznes jarayoningiz qaytarishga ruxsat bersa mumkin. Tovarni qaytarib bo‘lmasa, bekor qilish mumkin emasligi haqidagi xato bilan javob bering.
- **Fiskal ma’lumotlar.** Kassa fiskalizatsiyani talab qilsa, chek pozitsiyalarini IKPU kodlari bilan hujjatdagi formatda uzating.

## To‘lov havolasi

Mijoz Payme to‘lov sahifasiga yuboriladi. Havolada kassa ID, hisob maydoni va tiyindagi summa, xohishga ko‘ra qaytish URL’i kodlanadi. Muhim: mijozning saytga qaytishi **to‘lovni tasdiqlamaydi**. «To‘langan» holati faqat `PerformTransaction`da qo‘yiladi.

## Sinov muhitida tekshirish

Payme’da sinov muhiti bor: unda endpoint URL’ingiz va sinov kalitini ko‘rsatib, ssenariylarni o‘tkazasiz — noto‘g‘ri avtorizatsiya, mavjud bo‘lmagan buyurtma, noto‘g‘ri summa, yaratish, o‘tkazish, o‘tkazishdan oldin va keyin bekor qilish, takroriy chaqiruvlar. Jangovar kalitni barcha ssenariylar o‘tgandan keyingina ulang.

Batafsil spetsifikatsiya — [Payme dasturchilar hujjatlarida](https://developer.help.paycom.uz/).

## Tipik integratsiya xatolari

- Summa tiyinda emas, so‘mda: har bir buyurtmada summa tekshiruvi yiqiladi.
- Xato obyekti bilan HTTP 200 o‘rniga HTTP 401 yoki 500 javobi.
- Takroriy `CreateTransaction`da mavjudini qaytarish o‘rniga yangi yozuv yaratish.
- Buyurtmani `PerformTransaction`da emas, `CreateTransaction`da to‘langan deb belgilash.
- Vaqt millisekundlarda emas, soniyalarda.
- Ishga tushirilgandan keyin prodakshnda sinov kalitining qolib ketishi.

## FAQ

### Payme callback’isiz to‘lov holatini tekshirsa bo‘ladimi?

Merchant API modelida haqiqat manbai — Payme’ning serveringizga chaqiruvlari. Solishtirish uchun o‘z tranzaksiyalar jadvalingiz va Payme sizda chaqiradigan `GetStatement` metodidan foydalaning.

### Payme allaqachon bekor qilingan buyurtma uchun metodni chaqirsa nima qilish kerak?

Bazangizda saqlangan holatga qarab javob bering: `CheckTransaction` uchun joriy holatni qaytaring, bekor qilingan tranzaksiya bo‘yicha `PerformTransaction` uchun esa operatsiyani bajarib bo‘lmasligi haqidagi xatoni.

### Har bir metod uchun alohida endpoint kerakmi?

Yo‘q. Barcha metodlar bitta URL’ga keladi, kerakli ishlovchi so‘rov tanasidagi `method` maydoni bo‘yicha tanlanadi.
