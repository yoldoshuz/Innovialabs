---
title: Serverless nima: afzalliklari, kamchiliklari va qo‘llanish holatlari
description: Serverless va FaaS nima, chaqiruvlar uchun to‘lov qanday ishlaydi, qaysi vazifalar mos keladi va qanday cheklovlar bor: taymautlar, sovuq start, holatsizlik.
summary: Serverless — siz funksiya kodini yuklaysiz, bulut esa uni hodisa bo‘yicha o‘zi ishga tushiradi, masshtablaydi va haqiqiy chaqiruvlar uchun haq oladigan model; u notekis yuklama va fon vazifalari uchun qulay, lekin uzoq jarayonlar va doimiy ulanishlarga mos emas.
---
## Qisqa javob

**Serverless** serverlar yo‘q degani emas. Bu ularni **siz boshqarmasligingizni** anglatadi. Siz funksiya yozasiz, uni bulutga yuklaysiz, provayder esa o‘zi:

- hodisa kelganda (HTTP so‘rov, navbatdagi xabar, fayl yuklanishi, jadval) uni ishga tushiradi;
- yuklamaga qarab kerakli miqdordagi nusxalarni yaratadi;
- so‘rovlar bo‘lmasa, ularni to‘xtatadi.

Serverless’ning eng keng tarqalgan shakli — **FaaS (Functions as a Service)**: AWS Lambda, Google Cloud Functions / Cloud Run functions, Azure Functions, Cloudflare Workers, Vercel Functions.

## Funksiya qanday ko‘rinadi

Funksiya — hodisani qabul qilib, natija qaytaradigan ishlov beruvchi. Masalan, Node.js’da AWS Lambda uslubidagi oddiy HTTP funksiya:

```javascript
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? "world";
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}` }),
  };
};
```

Na veb-server, na operatsion tizim, na balanslovchini sozlash kerak — faqat kod.

## To‘lov qanday tuzilgan

Klassik model — **pay-per-execution**: siz chaqiruvlar soni va ajratilgan xotirani hisobga olgan holda bajarilish vaqti uchun to‘laysiz. So‘rov yo‘q — hisob ham deyarli yo‘q.

Narx nimalardan tashkil topadi:

- **chaqiruvlar soni**;
- har bir chaqiruvning **davomiyligi**;
- **xotira hajmi** (ko‘pincha ajratiladigan protsessor ham unga bog‘liq);
- **yondosh xizmatlar**: API shlyuz, ma’lumotlar bazasi, xotira, chiquvchi trafik, loglar.

Shuning uchun serverless notekis yoki kichik yuklamada foydali. Doimiy yuqori yuklamada oddiy server yoki konteynerlar arzonroq bo‘lishi mumkin — buni o‘z raqamlaringiz asosida hisoblash kerak.

## Qaysi vazifalar mos keladi

- O‘zgaruvchan yuklamali **saytlar va mobil ilovalar uchun API va backend**.
- **Vebxuklar**: to‘lov tizimlari, CRM, Telegram botlardan hodisalarni qabul qilish.
- **Fayllarni qayta ishlash**: xotiraga yuklangandan keyin rasmlarni siqish, prevyu yaratish, konvertatsiya.
- **Fon va rejali vazifalar**: xabarnomalar, hisobotlar, jadval bo‘yicha ma’lumotlarni tozalash.
- **Navbatlar va hodisalar oqimini qayta ishlash.**
- Infratuzilmasiz tez ishga tushish muhim bo‘lgan **prototiplar va MVP**.

## Cheklovlar

| Cheklov | Amalda nimani anglatadi |
|---|---|
| **Taymautlar** | Funksiyaning maksimal bajarilish vaqti bor. Uzoq vazifalarni bo‘laklash yoki boshqa xizmatlarga chiqarish kerak. |
| **Holatsizlik** | Chaqiruvlar orasida xotira yoki mahalliy diskka tayanib bo‘lmaydi. Ma’lumotlar tashqi baza, kesh yoki xotirada saqlanadi. |
| **Sovuq start** | Funksiya uzoq vaqt chaqirilmagan bo‘lsa, birinchi so‘rov muhit ishga tushishini kutadi. |
| **Bazaga ulanishlar** | Ko‘plab parallel nusxalar klassik bazaning ulanishlar limitini tugatib qo‘yishi mumkin. Ulanishlar puli yoki mos baza kerak. |
| **Provayderga bog‘lanib qolish** | Har bir bulutda triggerlar, huquqlar va yondosh xizmatlar o‘ziga xos, ko‘chish qayta ishlashni talab qiladi. |
| **Debug va monitoring** | Bulut muhitini mahalliy qayta yaratish qiyinroq, loglar va trassirovka kerak. |

Aniq limitlar (vaqt, xotira, paket hajmi) provayderlarda farq qiladi va o‘zgarib turadi — ularni tanlangan bulut hujjatlaridan tekshiring.

## Qisqacha afzallik va kamchiliklar

**Afzalliklari:**

- serverlar va OT’ni boshqarish shart emas;
- avtomatik masshtablash;
- haqiqiy foydalanish uchun to‘lov;
- loyihani tez boshlash.

**Kamchiliklari:**

- vaqt va holat bo‘yicha cheklovlar;
- sovuq start;
- yuklama o‘sganda hisobni oldindan bilish qiyinroq;
- provayder ekotizimiga bog‘liqlik.

## Serverless mos kelishini qanday aniqlash

O‘zingizga bir necha savol bering:

1. **Yuklama notekismi** yoki uzoq bo‘sh turish davrlari bormi? — Serverless foydasiga.
2. **Vazifalar qisqami** va vaqt limitlariga sig‘adimi? — Foydasiga.
3. **Doimiy ulanishlar kerakmi** (WebSocket server, uzoq ishlaydigan vorkerlar)? — Ko‘proq qarshi.
4. **Har bir so‘rovda minimal kechikish muhimmi?** — Sovuq startni hisobga oling.
5. **Yuklama yuqori va barqarormi?** — Narxni konteynerlar yoki VPS bilan solishtiring.

Ko‘pincha eng yaxshi variant — aralash: asosiy ilova konteynerlarda, vebxuklar, fayllarni qayta ishlash va jadval bo‘yicha vazifalar esa funksiyalarda.

## FAQ

### Serverless har doim serverdan arzonmi?

Yo‘q. Kichik yoki sakrab turuvchi yuklamada odatda ha, chunki bo‘sh turish uchun to‘lanmaydi. Doimiy yuqori yuklamada ijaraga olingan server yoki konteynerlar arzonroq tushishi mumkin. O‘z trafik profilingiz bo‘yicha solishtiring.

### Sovuq start bilan qanday kurashish mumkin?

Paket hajmi va bog‘liqliklar sonini kamaytiring, tez ishlaydigan muhitlarni tanlang, muhim funksiyalar uchun esa nusxalarni «isitilgan» holda ushlab turuvchi provayder opsiyalaridan foydalaning — ular odatda pullik.

### Serverless’da butun veb-ilovani ishga tushirish mumkinmi?

Ha, ko‘plab freymvorklar aynan shunday ishlaydi — masalan, Vercel’dagi Next.js’da har bir server qismi funksiyaga aylanadi. Asosiysi, holatsizlikni hisobga olish va ma’lumotlarni tashqi xizmatlarda saqlash.
