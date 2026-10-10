---
title: Firebase Analytics, AppMetrica yoki Amplitude: analitikani tanlash
description: Firebase Analytics, AppMetrica va Amplitude taqqoslanadi: hodisalar, voronkalar, kogortalar, narx, ma’lumot eksporti, mintaqa va hodisalar rejasi.
summary: Firebase Analytics — bepul asos, ayniqsa Google ekotizimidan foydalansangiz; AppMetrica — MDHda mashhur, atribusiyasi o‘rnatilgan bepul variant; Amplitude — eng kuchli mahsulot analitikasi, lekin o‘sish bilan pullik bo‘ladi. Avval hodisalar rejasini tuzing, keyin vositani tanlang.
---

## Qisqa javob

- **Firebase Analytics** (Google Analytics for Firebase) — bepul, bir soatda ulanadi, Crashlytics, Remote Config, A/B Testing va Google reklamasi bilan bog‘langan. Standart tanlov sifatida yaxshi.
- **AppMetrica** (Yandex) — bepul, o‘rnatishlar atribusiyasi, push-kampaniyalar va crash hisobotlari o‘rnatilgan, rus tilidagi interfeysga ega. MDHda mashhur.
- **Amplitude** — ixtisoslashgan mahsulot analitikasi: moslashuvchan voronkalar, xulq-atvor kogortalari, foydalanuvchi yo‘llari. Cheklovli bepul tarifi bor, keyin ma’lumot hajmiga qarab pullik rejalar.

Ko‘p jamoalar bir vaqtda ikkita vositadan foydalanadi: masalan, texnik asos uchun Firebase va marketing hamda mahsulot uchun AppMetrica yoki Amplitude.

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | Firebase Analytics | AppMetrica | Amplitude |
|---|---|---|---|
| Hodisalarni kuzatish | Avto-hodisalar + o‘z hodisalaringiz | Avto-hodisalar + o‘z hodisalaringiz | O‘z hodisalaringiz, moslashuvchan xususiyatlar |
| Voronkalar | Bor, GA4 hisobotlari orqali | Bor | Kuchli tomoni, moslashuvchan shartlar |
| Kogorta va qaytish | Bazaviy | Bor | Xulq-atvor kogortalari, chuqur tahlil |
| Narx | Bepul | Bepul (asosiy funksiyalar) | Cheklovli bepul tarif, keyin pullik |
| Xom ma’lumot eksporti | BigQuery’ga eksport | Logs API va eksportlar | Omborlarga eksport va Export API |
| O‘rnatish atribusiyasi | Integratsiyalar va Google Ads orqali | O‘rnatilgan | Hamkorlar orqali |

Limitlar va tariflar o‘zgarib turadi — tanlashdan oldin servislar saytida tekshiring.

## Tanlashda nimalarni hisobga olish kerak

- **Ma’lumotlarni kim ko‘radi.** Marketologga o‘rnatish manbalari va kampaniyalar, mahsulot menejeriga voronkalar va qaytish, dasturchiga crash va barqarorlik muhim.
- **Xom ma’lumotlarga kirish.** O‘z BI tahlilingizni rejalashtirsangiz, hodisalar qanday eksport qilinishini tekshiring: Firebase’da BigQuery, AppMetrica’da Logs API, Amplitude’da omborlar bilan integratsiya.
- **Mintaqa va ma’lumotlarga talablar.** Ma’lumotlar qayerda saqlanishini va bu biznesingiz talablari hamda foydalanuvchilaringiz yashaydigan mamlakat qonunchiligiga mos kelishini aniqlang. Interfeys va qo‘llab-quvvatlash tili ham muhim.
- **Ekotizim.** Push va Crashlytics uchun Firebase’dan foydalanayotgan bo‘lsangiz, uning analitikasi qo‘shimcha SDKsiz ulanadi.
- **O‘sish.** Amplitude’ning bepul limitlari boshlash uchun yetarli; auditoriyangiz qancha hodisa yaratishini oldindan baholang.

## Avval hodisalar rejasi, keyin SDK

Eng ko‘p uchraydigan muammo — vosita tanlovi emas, tartibsiz hodisalar: `click1`, `ButtonTap`, `buy_btn`. Yarim yildan so‘ng ularning ma’nosini hech kim tushunmaydi. Integratsiyadan oldin **tracking plan** tuzing.

**1. Asosiy savollarni aniqlang.** Masalan: foydalanuvchilar buyurtmani rasmiylashtirishning qaysi bosqichida chiqib ketadi? Bir haftadan keyin qanchasi qaytadi?

**2. Voronkani hodisalar ketma-ketligi sifatida tasvirlang.**

| Hodisa | Qachon yuboriladi | Parametrlar |
|---|---|---|
| `app_opened` | Ilova ishga tushganda | `source` |
| `signup_completed` | Muvaffaqiyatli ro‘yxatdan o‘tish | `method` |
| `product_viewed` | Mahsulot kartochkasi ochildi | `product_id`, `category` |
| `cart_item_added` | Mahsulot savatga qo‘shildi | `product_id`, `price` |
| `checkout_completed` | Buyurtma to‘landi | `order_value`, `currency` |

**3. Nomlash qoidalarini kelishib oling.** Masalan, snake_case’da `obyekt_harakat`, o‘tgan zamondagi fe’l, iOS va Android’da bir xil nomlar.

**4. Hodisalar va foydalanuvchi xususiyatlarini ajrating.** Tarif, til, shahar — bu alohida hodisalar emas, **user properties**.

**5. Reja uchun mas’ul shaxs tayinlang.** Yangi hodisalar faqat hujjat orqali qo‘shiladi, aks holda u tezda eskiradi.

## Ko‘p uchraydigan xatolar

- Analitikaga **shaxsiy ma’lumotlarni** yuborish — telefon, email, ism. Ko‘pchilik servislar buni to‘g‘ridan-to‘g‘ri taqiqlaydi.
- Har bir bosishni loglash: ma’lumot ko‘p, javob yo‘q.
- iOS va Android’da hodisalarning turli nomlari.
- Relizdan oldin hodisalarni tekshirmaslik. Har bir vositada debug rejimi bor — undan foydalaning.
- Bir nechta SDKni butun kod bo‘ylab to‘g‘ridan-to‘g‘ri chaqirish. Hodisani barcha ulangan servislarga yuboradigan bitta qatlam yarating.

## FAQ

### Firebase va AppMetrica’dan bir vaqtda foydalansa bo‘ladimi?

Ha, bu keng tarqalgan amaliyot. Kod takrorlanmasligi uchun ilovada yagona analitika qatlamini yarating: ekranlar bitta funksiyani chaqiradi, u esa hodisani ikkala SDKga yuboradi.

### Boshlash uchun nechta hodisa kerak?

Asosiy savollarga javob berish uchun qancha kerak bo‘lsa, shuncha: odatda asosiy voronka, ro‘yxatdan o‘tish va bir-ikkita muhim harakat. Rejani kengaytirish tartibsizlikni tozalashdan osonroq.

### Pullik vositalarga byudjet bo‘lmasa, nimani tanlash kerak?

Firebase Analytics va AppMetrica boshlang‘ich bosqichdagi ko‘p vazifalarni bepul hal qiladi. Mahsulot jamoasiga chuqurroq voronka va kogortalar kerak bo‘lganda Amplitude’ga o‘tish mantiqli.
