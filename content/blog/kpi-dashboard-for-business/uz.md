---
title: Biznes uchun KPI dashboardini qanday qurish
description: Bo‘limlar uchun KPI tanlash, CRM, 1C va jadvallardan ma’lumotni bir joyga yig‘ish, tushunarli dashboard maketini tuzish va yangilanishni sozlash.
summary: Dashboard qo‘llab-quvvatlashi kerak bo‘lgan qarorlardan boshlang, har bir bo‘lim uchun bir nechta KPI tanlang, CRM, 1C va jadvallar ma’lumotini umumiy ma’lumotnomalar bilan bitta omborga yig‘ing, so‘ng «natijalar — dinamika — tafsilotlar» ekranini aniq yangilanish jadvali bilan quring.
---

## Qisqa javob

Yaxshi KPI dashboardi quyidagi tartibda quriladi:

1. **Qarorlar** — rahbar ekranga qarab qaysi savollarga javob olishi kerak.
2. **Ko‘rsatkichlar** — har bir bo‘lim uchun aniq formulali bir nechta KPI.
3. **Ma’lumotlar** — har bir raqam qayerdan olinadi va manbalar o‘zaro qanday bog‘lanadi.
4. **Maket** — asosiydan tafsilotlarga.
5. **Yangilanish** — qanchalik tez-tez va ma’lumot yangiligini qanday bilish.

Eng keng tarqalgan xato — vosita va chiroyli grafiklarni tanlashdan boshlash. Ko‘rsatkichlar kelishilmasa, dashboard hech kim ishonmaydigan raqamlar to‘plamiga aylanadi.

## 1-qadam. Bo‘limlar bo‘yicha ko‘rsatkichlar

Har bir bo‘lim uchun qarorlarga haqiqatan ta’sir qiladigan bir nechta ko‘rsatkich yetarli:

| Bo‘lim | KPI misollari |
|---|---|
| Sotuv | Tushum, bitimlar soni, liddan bitimga konversiya, o‘rtacha chek, voronkadagi summa |
| Marketing | Kanallar bo‘yicha lidlar, lid narxi, mijozni jalb qilish narxi (CAC) |
| Moliya | Pul oqimi, debitorlik qarzi, yalpi marja |
| Operatsiyalar va ombor | Buyurtmani bajarish muddati, qoldiqlar, xatoli buyurtmalar ulushi |
| Qo‘llab-quvvatlash | Birinchi javob vaqti, murojaatlar soni, birinchi murojaatda hal qilinganlar ulushi |

Har bir KPI uchun alohida hujjatda qayd eting:

- **formula** — aynan nima hisoblanadi va nima chiqarib tashlanadi (qaytarishlar, bekor qilingan bitimlar, QQS);
- **manba** — qaysi tizimdan olinadi;
- **mas’ul** — ko‘rsatkich uchun kim javob beradi;
- **maqsadli qiymat**, agar bo‘lsa.

Busiz CRM’dagi va buxgalteriyadagi «tushum» albatta farq qiladi.

## 2-qadam. Ma’lumotlarni bir joyga yig‘ish

Odatiy holat: bitimlar CRM’da (amoCRM, Bitrix24 va boshqalar), pul va jo‘natmalar 1C’da, rejalar va reklama xarajatlari Excel yoki Google Sheets’da.

**Ularni qanday birlashtirish:**

- **CRM** — jadval bo‘yicha API orqali eksport.
- **1C** — standart OData interfeysi, HTTP-servislar yoki hisobotlarni faylga muntazam eksport qilish. Tanlov konfiguratsiyaga va uni kim qo‘llab-quvvatlashiga bog‘liq.
- **Jadvallar** — Google Sheets API orqali ulanish yoki ustunlari qat’iy belgilangan shablon bo‘yicha fayl yuklash.

Ma’lumotlarni BI-vositani har bir tizimga to‘g‘ridan-to‘g‘ri ulash o‘rniga **alohida analitik bazaga** (masalan, PostgreSQL) yig‘ish qulay. Shunda ishchi tizimlarga yuk tushmaydi va tarixni saqlash mumkin bo‘ladi.

Asosiy nuqta — **umumiy ma’lumotnomalar**. CRM’dagi mijoz va 1C’dagi kontragent STIR, telefon yoki ichki kod bo‘yicha moslashtirilishi kerak. Menejerlar, filiallar va tovarlar ham. Busiz turli tizimlardagi raqamlar bitta manzaraga birlashmaydi.

## 3-qadam. Dashboard maketi

O‘quvchi bir necha soniyada hammasi joyidami-yo‘qmi tushunishi kerak. Yuqoridan pastga ishlaydigan tuzilma:

1. **KPI kartochkalari** — joriy qiymat, o‘tgan davr va reja bilan solishtirish.
2. **Dinamika** — kunlar yoki haftalar bo‘yicha chiziqli grafiklar.
3. **Kesimlar** — kanallar, menejerlar, filiallar, tovarlar bo‘yicha.
4. **Tafsilotlar** — grafikdan o‘tib ko‘rish mumkin bo‘lgan jadval.

Yordam beradigan qoidalar:

- **bitta dashboard — bitta auditoriya**: egasiga umumiy ekran, sotuv rahbariga esa voronka tafsilotlari bilan o‘ziniki kerak;
- bitta ekranda cheklangan miqdordagi KPI, qolganlari alohida varaqlarda;
- barcha grafiklar uchun bir xil **davr filtri**;
- ma’noli ranglar: hamma narsani emas, faqat rejadan chetlanishlarni ajratib ko‘rsating;
- o‘lchov birligi va valyutasi ko‘rsatilgan yozuvlar.

## 4-qadam. Vosita tanlash

| Vosita | Kuchli tomonlari | Nimani hisobga olish kerak |
|---|---|---|
| Power BI | Kuchli ma’lumotlar modeli, korporativ muhitda tanish | Nashr qilish va birgalikda foydalanish uchun litsenziyalar |
| Metabase | Open source, o‘z serveringizda o‘rnatish mumkin, sodda interfeys | Murakkab modelni bazada tayyorlagan ma’qul |
| Looker Studio | Bepul, Google Sheets va Google xizmatlari bilan qulay | Katta hajmlarda sekin ishlashi mumkin |

Vositani manbalar va ma’lumotlar hajmi aniq bo‘lgandan keyin tanlang, oldin emas.

## 5-qadam. Ma’lumotlarni yangilash

- **Chastotani maqsadga ko‘ra** belgilang: moliyaviy ko‘rsatkichlar uchun odatda kuniga bir marta yetarli, operativ sotuvlar uchun tez-tezroq kerak bo‘lishi mumkin.
- Dashboard’da **oxirgi yangilanish vaqtini** ko‘rsating.
- Yuklash muvaffaqiyatsiz bo‘lsa, **bildirishnoma** sozlang: jimgina eskirgan dashboard umuman yo‘qidan yomonroq.
- Yuklash jarayonidagi har qanday o‘zgarishdan keyin asosiy raqamlarni manba tizimlar bilan solishtiring.

## FAQ

### Dashboard’da nechta KPI bo‘lishi kerak?

O‘quvchi muntazam kuzata oladigan miqdorda. Agar ko‘rsatkich hech qanday qarorni o‘zgartirmasa, uni olib tashlang yoki tafsilotlar varag‘iga o‘tkazing.

### Dashboard’ni to‘g‘ridan-to‘g‘ri Excel’da qilsa bo‘ladimi?

Kichik kompaniya va qo‘lda kiritiladigan ma’lumotlar uchun — ha, bu yaxshi birinchi qadam. Manbalar bir nechta bo‘lib, ma’lumotni avtomatik yangilash kerak bo‘lganda, alohida baza va BI-vositaga o‘tish kerak.

### Nega dashboard’dagi raqamlar 1C hisobotiga mos kelmaydi?

Odatda turli formulalar (qaytarishlar, QQS, jo‘natish sanasi va to‘lov sanasi) yoki yangilanish vaqti sabab bo‘ladi. Shuning uchun har bir KPI formulasini hujjatlashtirib, buxgalteriya bilan kelishib olish kerak.
