---
title: Bulutdagi regionlar va mavjudlik zonalari: oddiy tushuntirish
description: Bulutda region va mavjudlik zonasi nima, region tanlovi kechikish, narx va ma’lumot talablariga qanday ta’sir qiladi, zonalarga taqsimlash nega kerak.
summary: Region — bulutning geografik maydoni, mavjudlik zonalari esa uning ichidagi izolyatsiyalangan data-markazlar. Region foydalanuvchilarga yaqinlik, narx va qonun talablariga qarab tanlanadi, bir nechta zona esa xizmat bitta data-markaz ishdan chiqqanda ham ishlashi uchun kerak.
---

## Qisqa javob

Yirik bulut provayderlari infratuzilmani ikki darajaga ajratadi:

- **Region** — geografik maydon, masalan, «Frankfurt» yoki «Mumbay». Unda bir nechta data-markaz bor.
- **Mavjudlik zonasi** (availability zone) — region ichidagi mustaqil elektr ta’minoti, sovutish va tarmoqqa ega bir yoki bir nechta data-markaz. Zonalar bir-biridan yetarlicha uzoqda joylashgan, shunda mahalliy avariya qo‘shnilarga ta’sir qilmaydi, va yetarlicha yaqin, shunda ular o‘rtasidagi aloqa tez bo‘ladi.

Virtual mashina yoki ma’lumotlar bazasi kabi resurslar aniq regionning aniq zonasida yaratiladi. Alohida CDN’ning **edge-tugunlari** ham bor — keshni tarqatish nuqtalari. Ular ancha ko‘p, lekin u yerda serverlar va bazalar joylashtirilmaydi.

## Region kechikishga qanday ta’sir qiladi

Optik tolada signal fizik cheklovlardan tezroq yura olmaydi, shuning uchun foydalanuvchi va server orasidagi masofa har bir so‘rovga kechikish qo‘shadi. Bitta sahifada o‘nlab so‘rov yuboradigan saytda bu sezilarli.

Amaliy qoidalar:

- jamoa ofisiga emas, **asosiy auditoriyaga** eng yaqin regionni tanlang;
- kechikishni real testlar bilan o‘lchang — trafik yo‘nalishi har doim ham xaritaga mos kelmaydi;
- statika va mediani CDN orqali tarqating, shunda uzoq region kamroq seziladi;
- ilova va ma’lumotlar bazasini **bitta regionda** saqlang: bazaga regionlararo so‘rovlar ishni keskin sekinlashtiradi.

## Region narxga qanday ta’sir qiladi

Bir xil resurslar turli regionlarda turlicha turadi. Bunga elektr energiyasi, yer va aloqa kanallarining mahalliy narxi ta’sir qiladi. Bundan tashqari:

- har bir regionda barcha xizmatlar va mashina turlari mavjud emas, ayniqsa yangi regionlarda;
- **regionlar o‘rtasidagi** trafik odatda pullik;
- ayrim provayderlarda bitta region ichidagi **zonalar o‘rtasidagi** trafik ham pullik — buni arxitekturada hisobga olish kerak.

Provayder kalkulyatorida aniq konfiguratsiyangiz narxini bir nechta mos regionlar uchun solishtiring.

## Region va ma’lumotlarga oid talablar

Ma’lumotlar jismonan qayerda saqlanishi — yuridik masala. Ko‘plab mamlakatlarda shaxsiy ma’lumotlarni lokalizatsiya qilish qoidalari amal qiladi. Xususan, O‘zbekiston qonunchiligi mamlakat fuqarolarining shaxsiy ma’lumotlarini O‘zbekistonda joylashgan serverlarda saqlashni talab qiladi. Agar bunday talablar sizga taalluqli bo‘lsa, xorijiy region bu ma’lumotlar uchun yaramaydi va mahalliy provayder yoki gibrid sxema kerak bo‘ladi.

Bunday masalalar bo‘yicha qarorni yurist bilan birga qabul qilgan ma’qul: texnik tafsilotlar aynan qanday ma’lumotlarni qayta ishlashingizga bog‘liq.

## Mavjudlik zonalari nima uchun kerak

Alohida data-markaz ishdan chiqishi mumkin: elektr o‘chishi, tarmoq nosozligi, yong‘in. Agar butun xizmat bitta zonada bo‘lsa, u zona bilan birga to‘xtaydi. Zonalarga taqsimlash bu xavfni kamaytiradi:

- Yuklama balanslovchisi ortida turli zonalarda **ilovaning bir nechta nusxasi**.
- Boshqa zonada **replikasi bor ma’lumotlar bazasi** va avtomatik almashinish (boshqariladigan bazalarda odatda Multi-AZ opsiyasi).
- Zonalar o‘rtasida o‘zi replikatsiya qilinadigan xotirada **zaxira nusxalar**.

Keyingi daraja — **bir nechta region**. Bu butun region ishdan chiqishidan himoya qiladi, lekin ancha murakkab: ma’lumotlarni uzoq masofaga replikatsiya qilish, muvofiqlik, narx. To‘xtash juda muhim bo‘lgan xizmatlar uchun o‘zini oqlaydi.

## Ko‘p uchraydigan xatolar

- Regionni odat bo‘yicha yoki qo‘llanmaga qarab, foydalanuvchilargacha kechikishni tekshirmay tanlash.
- Ilova va bazani turli regionlarga joylashtirish.
- Hammasini bitta zonada joylashtirib, xizmatni nosozlikka chidamli deb hisoblash.
- Zonalar va regionlar o‘rtasidagi pullik trafikni byudjetda hisobga olmaslik.
- Qonun talablarini tekshirmay shaxsiy ma’lumotlarni xorijda saqlash.

## FAQ

### Kichik loyihaga nechta mavjudlik zonasi kerak?

Boshlash uchun ko‘pincha muntazam zaxira nusxalari bilan bitta zona yetarli. To‘xtash pulga tusha boshlaganda, hech bo‘lmasa baza va ilova uchun ikki-uchta zonaga o‘tish oqilona.

### Keyinchalik regionni almashtirsa bo‘ladimi?

Bo‘ladi, lekin bu migratsiya: ma’lumotlarni ko‘chirish, tarmoq, DNS va integratsiyalarni qayta sozlash. Ma’lumotlar va xizmatlar qancha ko‘p bo‘lsa, shuncha qiyin, shuning uchun regionni boshidanoq ongli ravishda tanlagan yaxshi.

### Mavjudlik zonasi edge-lokatsiyadan nimasi bilan farq qiladi?

Mavjudlik zonasi — serverlar, bazalar va xotiralar uchun to‘laqonli maydon. Edge-lokatsiya — kontentni keshlash va tez tarqatish uchun CDN nuqtasi; u yerda faqat kesh va edge-funksiyalar kabi yengil vazifalar bajariladi.
