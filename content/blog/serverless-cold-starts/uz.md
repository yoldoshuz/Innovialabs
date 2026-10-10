---
title: Serverless’da sovuq start: sabablari va uni qanday qisqartirish mumkin
description: Nega serverless funksiyalar ba’zan birinchi so‘rovga sekin javob beradi, sovuq start davomiyligiga nima ta’sir qiladi va uni qanday qisqartirish mumkin.
summary: Sovuq start — funksiyaning yangi nusxasini yaratish uchun ketadigan kechikish: kodni yuklash, runtime’ni ishga tushirish va initsializatsiya; uni yengil runtime, kichik bandl, dangasa initsializatsiya, provisioned concurrency va edge muhitlar qisqartiradi.
---
## Qisqa javob

**Sovuq start** — tayyor bo‘sh nusxa bo‘lmagani uchun platforma funksiyaning yangi nusxasini ishga tushirganda yuzaga keladigan qo‘shimcha kechikish. Bu bekor turish davridan keyin, trafik keskin oshganda va yangi versiya deploy qilingandan so‘ng sodir bo‘ladi. Allaqachon “iliq” nusxaga keladigan keyingi so‘rovlar tez bajariladi.

Sovuq startni ikki tomondan qisqartirish mumkin: **initsializatsiyani yengillashtirish** (runtime, kod hajmi, bog‘liqliklar) va **nusxalarni oldindan tayyor ushlab turish** (provisioned concurrency, edge muhitlar).

## Sovuq startning hayot sikli

1. **Muhit ajratish.** Platforma izolyatsiyalangan muhit yaratadi: konteyner, microVM yoki izolyat.
2. **Kodni yuklash.** Funksiya paketi yoki konteyner image’i yuklab olinadi.
3. **Runtime’ni ishga tushirish.** Node.js, Python, JVM, .NET va boshqalar ishga tushadi.
4. **Sizning kodingiz initsializatsiyasi.** Handler’dan tashqaridagi hamma narsa bajariladi: importlar, bazaga ulanish, konfiguratsiyani o‘qish, SDK mijozlarini yaratish.
5. **So‘rovni qayta ishlash.** Faqat shundan keyin handler chaqiriladi.

1–4-qadamlar aynan sovuq startdir. Agar keyin yangi so‘rovlar kelsa, nusxa qayta ishlatiladi va platforma uni o‘chirmaguncha 1–4-qadamlar o‘tkazib yuboriladi.

## Davomiylikka nimalar ta’sir qiladi

| Omil | Qanday ta’sir qiladi |
|---|---|
| Runtime | Yengil interpretatsiya qilinadigan runtime’lar odatda maxsus optimallashtirishsiz JVM yoki .NET’dan tezroq ishga tushadi |
| Bandl hajmi | Kod va bog‘liqliklar qancha ko‘p bo‘lsa, yuklash va parsing shuncha uzoq |
| Initsializatsiyadagi ish | Og‘ir importlar, bazaga ulanish, sirlarni yuklash startni sekinlashtiradi |
| Xotira hajmi | Ko‘p provayderlarda xotira bilan birga CPU ham oshadi, shu sababli initsializatsiya tezroq bo‘lishi mumkin |
| Xususiy tarmoqqa ulanish | Ayrim konfiguratsiyalarda muhit yaratishda kechikish qo‘shadi |
| Konteyner image’i | Katta image’lar ixcham paketlarga qaraganda uzoqroq yuklanadi |

## Sovuq startni qanday qisqartirish mumkin

**Bandlni kichraytiring.** Tree-shaking’li bandlerdan foydalaning, butun SDK emas, faqat kerakli modullarni import qiling. Ortiqcha bog‘liqliklarni olib tashlang.

**Dangasa initsializatsiya.** Og‘ir mijozlarni faqat haqiqatan kerak bo‘lganda yarating va ularni chaqiruvlar orasida qayta ishlating:

```js
let db;
async function getDb() {
  if (!db) db = await connect(process.env.DATABASE_URL);
  return db;
}

export async function handler(event) {
  const conn = await getDb();
  // ...
}
```

**Mos runtime tanlang.** Kechikishga sezgir funksiyalar uchun yengil runtime ko‘pincha yutadi. JVM’da bo‘lsangiz, initsializatsiyadan keyingi holat snapshot’lari (masalan, AWS Lambda’dagi SnapStart) yoki native kompilyatsiya kabi texnologiyalarni o‘rganing.

**Provisioned concurrency.** Platforma belgilangan miqdordagi initsializatsiya qilingan nusxalarni oldindan tayyor ushlab turadi. Shu hajm doirasida sovuq start bo‘lmaydi, lekin so‘rovlar kam bo‘lsa ham tayyorlik uchun to‘laysiz. Bashorat qilinadigan trafik va muhim API’lar uchun mos.

**Minimal nusxalar soni.** Konteynerli platformalarda (masalan, Cloud Run) doimiy ishlaydigan nusxalarning minimal sonini belgilash mumkin — bu kechikish va narx o‘rtasidagi xuddi shunday murosa.

**Edge runtime.** V8 izolyatlariga asoslangan edge muhitlar konteynerlardan ancha tez ishga tushadi, lekin cheklovlari bor: Node.js’ning barcha API’lari mavjud emas, vaqt va xotira limitlari qattiqroq.

**Ping orqali isitish.** Davriy so‘rovlar bitta nusxani iliq ushlab turadi, lekin yangi nusxalar kerak bo‘ladigan trafik o‘sishida yordam bermaydi. Bu yechim emas, vaqtinchalik chora.

## Ko‘p uchraydigan xatolar

- Har bir chaqiruvda bazaga ulanish va barcha sirlarni yuklash.
- Bitta metod uchun butun SDK’ni olib kirish.
- Provisioned concurrency’ni faqat muhimlari uchun emas, barcha funksiyalar uchun yoqish.
- Kechikishni faqat iliq chaqiruvlarda o‘lchash va real manzarani ko‘rmaslik.

## FAQ

### Kechikish aynan sovuq start sababli ekanini qanday bilish mumkin?

Platforma loglari va trassirovkasiga qarang: ko‘p provayderlar initsializatsiya vaqtini alohida ko‘rsatadi. Agar sekin so‘rovlar bekor turish, deploy yoki trafik o‘sishidan keyingi davrlarga to‘g‘ri kelsa, bu deyarli aniq sovuq start.

### Sovuq start sababli serverless’dan voz kechish kerakmi?

Shart emas. Fon vazifalari, webhook’lar va kamdan-kam bajariladigan amallar uchun kichik kechikish muhim emas. Kechikishga qattiq talablar qo‘yilgan API’lar uchun provisioned concurrency, minimal nusxalar soni, edge runtime yoki doimiy ishlaydigan serverdan foydalaning.

### Xotirani oshirish har doim sovuq startni tezlashtiradimi?

Har doim emas, lekin provayderda CPU xotira bilan birga oshsa, ko‘pincha yordam beradi. O‘z funksiyangizda tekshiring: bir nechta konfiguratsiyada initsializatsiya vaqtini o‘lchang va narxini solishtiring.
