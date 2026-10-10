---
title: OMS nima: e-commerce’da buyurtmalarni boshqarish tizimi
description: OMS barcha kanallardan buyurtmalarni qanday yig‘adi, omborlarga taqsimlaydi, statuslarni kuzatadi, bekor qilishlarni boshqaradi va do‘konga u qachon kerak.
summary: OMS — barcha savdo kanallaridagi buyurtmalarni bir joyga yig‘ib, har bir buyurtmani rasmiylashtirishdan yetkazib berish yoki qaytarishgacha olib boradigan tizim: tovarni band qiladi, omborni tanlaydi, statuslarni yangilaydi va bekor qilishlarni hal qiladi.
---
## OMS oddiy so‘zlar bilan

**Order Management System (OMS)** — buyurtmalarni boshqarish markazi. Mijoz saytda, mobil ilovada, marketpleysda, Telegram-bot orqali yoki telefonda xarid qilishi mumkin, OMS esa bularning barchasini **yagona qayta ishlash mantiqiga ega yagona buyurtmalar ro‘yxatiga** jamlaydi.

OMS bo‘lmasa, har bir kanal o‘z hayotini yashaydi: menejer buyurtmalarni sayt admin panelida, alohida marketpleys kabinetida, alohida yozishmalarda ko‘radi. Qoldiqlar mos kelmay qoladi, bitta tovar ikki marta sotiladi, mijozga posilkasi qayerdaligini hech kim ayta olmaydi.

## OMS nima qiladi

### 1. Barcha kanallardan buyurtmalarni yig‘adi

API va integratsiyalar orqali OMS saytdan, marketpleyslardan, ijtimoiy tarmoqlardan va call-markaz operatorlaridan buyurtmalarni qabul qiladi. Barcha buyurtmalar yagona formatga keltiriladi: mijoz, tovarlar, summa, to‘lov usuli, manzil.

### 2. Tovarni band qiladi va qoldiqlarni kuzatadi

Buyurtma paytida tovar band qilinadi, toki u boshqa kanalda qayta sotilmasin. OMS **barcha omborlar va nuqtalardagi qoldiqlarni** ko‘radi va dolzarb raqamlarni savdo kanallariga qaytaradi.

### 3. Buyurtmalarni omborlarga taqsimlaydi (routing)

Ombor yoki do‘konlar bir nechta bo‘lsa, OMS buyurtmani qayerdan jo‘natishni tanlaydi. Odatiy qoidalar:

- mijozga eng yaqin ombor;
- posilkani bo‘lmaslik uchun butun buyurtma mavjud bo‘lgan ombor;
- yetkazib berish narxi yoki ombor yuklamasi bo‘yicha ustuvorlik;
- mijoz tanlagan bo‘lsa, aniq do‘kondan olib ketish.

### 4. Statuslarni yuritadi

Har bir buyurtma hayot siklidan o‘tadi: *yangi → tasdiqlangan → to‘langan → yig‘ilmoqda → yetkazib berishga topshirilgan → yetkazilgan*. OMS o‘tishlarni qayd etadi, yetkazib berish xizmati va to‘lov tizimidan statuslarni oladi hamda mijozni SMS, e-mail yoki messenjer orqali xabardor qiladi.

### 5. Bekor qilish, o‘zgartirish va qaytarishlarni hal qiladi

Mijoz fikridan qaytdi, tovar topilmadi, kuryer bog‘lana olmadi — OMS bandlikni olib tashlaydi, to‘lov xizmati orqali pulni qaytarishni boshlaydi, tovarni qoldiqqa qaytaradi va tahlil uchun bekor qilish sababini saqlaydi.

## OMS, CRM, ERP va WMS: farqi nimada

| Tizim | Asosiy savol | Fokus |
|---|---|---|
| **OMS** | buyurtma bilan nima bo‘lyapti? | buyurtmalar, bandlik, taqsimlash, statuslar |
| **CRM** | mijozimiz kim va u bilan qanday ishlaymiz? | mijozlar, kommunikatsiya, savdo voronkasi |
| **WMS** | tovar omborning qayerida va uni qanday yig‘ish kerak? | yacheykalar, yig‘ish, qadoqlash |
| **ERP** | kompaniya pullari va resurslari qanday tuzilgan? | hisob, xaridlar, moliya |

Chegaralar shartli: ko‘plab CRM va ERP, jumladan 1C asosidagi yechimlar ham buyurtmalarni qayta ishlay oladi, internet-do‘kon platformalarida esa o‘rnatilgan buyurtmalar moduli bor. Muhimi tizim nomi emas, balki **buyurtma haqidagi yagona haqiqat manbai qayerda turishi**.

## Do‘konga alohida OMS qachon kerak

Bitta savdo kanali va bitta ombor bo‘lsa, odatda platformaning o‘rnatilgan admin paneli yetarli. Alohida OMS (tayyor yoki o‘zingizniki) quyidagilar paydo bo‘lganda o‘zini oqlaydi:

- **bir nechta savdo kanali** — sayt, marketpleyslar va oflayn;
- **bir nechta ombor yoki topshirish punkti** va tanlash mantiqi kerak;
- **qoldiqlardagi xatolar** — mavjud bo‘lmagan tovarni sotish, ikki marta sotish;
- buyurtmalarni tizimlar orasida **qo‘lda ko‘chirish**;
- **ko‘p yetkazib berish xizmatlari** va mijozga statusni tez aytib bo‘lmaydi;
- murakkab ssenariylar: oldindan buyurtma, qisman jo‘natish, buyurtmani bo‘lish, almashtirish.

## Qanday tanlash yoki joriy qilish

1. **Buyurtmaning hozirgi yo‘lini** qadamma-qadam, qo‘lda bajariladigan amallar va istisnolar bilan tasvirlang.
2. **Integratsiyalar ro‘yxatini** tuzing: savdo kanallari, to‘lov tizimlari (masalan, Payme, Click), yetkazib berish xizmatlari, hisob tizimi.
3. Qaysi tizim **qoldiqlar masteri** va buyurtmalar masteri bo‘lishini hal qiling — ikkita haqiqat manbai bo‘lmasligi kerak.
4. Tayyor yechimlar va o‘z ishlanmangizni solishtiring: tayyor OMS tezroq ishga tushadi, o‘zingizniki nostandart jarayonlarga moslashuvchanroq.
5. Bosqichma-bosqich ishga tushiring: avval bitta kanal, keyin qolganlarini ulang.

**Ko‘p uchraydigan xato** — tartibsiz jarayonni o‘z holicha avtomatlashtirish. Avval statuslar va qoidalar bo‘yicha kelishib oling, keyin tizimni sozlang.

## FAQ

### OMS o‘rniga CRM’dan foydalansa bo‘ladimi?

Bo‘ladi, agar CRM tovarni band qila olsa, qoldiqlarni hisobga olsa hamda savdo kanallari va yetkazib berish bilan integratsiya qilinsa. Bir nechta ombor va marketpleyslar bo‘lsa, odatda maxsus buyurtmalar moduli kerak bo‘ladi.

### Kichik do‘konga OMS kerakmi?

Bitta sayt va bitta ombor bo‘lsa, platformaning o‘rnatilgan imkoniyatlari yetarli. Yangi savdo kanallari paydo bo‘lib, qoldiqlarda xatolar boshlanganda alohida OMS haqida o‘ylash kerak.

### OMS tanlashda eng muhimi nimani tekshirish?

Kanallaringiz, to‘lov tizimlari va yetkazib berish xizmatlari bilan tayyor integratsiyalar, buyurtmalarni taqsimlash qoidalarining moslashuvchanligi va kelajakdagi ulanishlar uchun API mavjudligi.
