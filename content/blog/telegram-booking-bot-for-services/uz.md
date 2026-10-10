---
title: Telegram’da onlayn yozilish uchun botni qanday yaratish mumkin
description: Xizmat, mutaxassis va bo‘sh vaqtni tanlash, eslatmalar, ko‘chirish va kalendar bilan sinxronlash: salon, klinika yoki studiya uchun yozilish botini loyihalash.
summary: Yozilish boti mijozni «xizmat → mutaxassis → sana → vaqt → tasdiq» zanjiri bo‘ylab olib boradi, bo‘sh vaqtni jadval va xizmat davomiyligiga qarab hisoblaydi, tashrif haqida o‘zi eslatadi, bitta tugma bilan ko‘chirishga imkon beradi va barcha yozuvlarni bitta kalendar yoki CRM’da saqlaydi.
---
## Qisqa javob

Yaxshi yozilish boti to‘rtta vazifani hal qiladi:

1. Jadval, xizmat davomiyligi va mavjud yozuvlarni hisobga olib, **faqat haqiqatan bo‘sh vaqtni ko‘rsatadi**.
2. **Mijozni qisqa ssenariy bo‘yicha olib boradi**: xizmat → mutaxassis → sana → vaqt → kontakt → tasdiq.
3. **Tashrif haqida eslatadi** va uni tugma bilan tasdiqlash, ko‘chirish yoki bekor qilish imkonini beradi.
4. Administrator yozuvlarni ikki joyda yuritmasligi uchun **kalendar yoki CRM bilan sinxronlanadi**.

## Yozilish ssenariysi bosqichma-bosqich

- **Xizmat.** Kategoriyalar bo‘yicha guruhlangan tugmalar. Har bir xizmatning davomiyligi va narxi bor.
- **Mutaxassis.** Faqat tanlangan xizmatni ko‘rsatadiganlarni chiqaring va «Istalgan bo‘sh mutaxassis» variantini qo‘shing.
- **Sana.** Yaqin kunlar tugmalar ko‘rinishida yoki bo‘sh vaqti yo‘q kunlar faol bo‘lmagan oylik kalendar.
- **Vaqt.** Tanlangan kun uchun faqat bo‘sh vaqtlar.
- **Kontakt.** Telefon «Kontaktni ulashish» tugmasi orqali — bir marta, keyin bot uni eslab qoladi.
- **Tasdiq.** Yakun: xizmat, mutaxassis, sana, vaqt, manzil, narx — va «Yozilish» tugmasi.

Salon uchun «xizmat → usta» tartibi odatiyroq. Agar mijozlar aniq bir mutaxassisga qatnasa, undan boshlash imkonini bering: «O‘z ustamga yozilish».

## Bo‘sh vaqtni qanday hisoblash kerak

Slot — bu shunchaki «jadvaldagi bir soat» emas. Bot quyidagilarni hisobga olishi kerak:

- har bir mutaxassisning **ish jadvali**, dam olish kunlari va ta’tillari;
- **xizmat davomiyligi**: ikki soatlik muolaja bir soatlik oraliqqa sig‘maydi;
- xonani tozalash yoki tayyorlash uchun mijozlar orasidagi **bufer**;
- **resurslar**: kabinet, kreslo, uskunalar — ular mutaxassislardan kam bo‘lishi mumkin;
- foydalanuvchining emas, salonning **vaqt mintaqasi**.

Asosiy xavf — **ikki marta yozilish**, ya’ni ikki kishi bir vaqtni bir paytda tanlashi. Himoya: rasmiylashtirish vaqtida slotni qisqa muddatga band qilish va tasdiqlashda serverda tekshirish. Agar slot band bo‘lib qolsa, bot buni ochiq aytadi va eng yaqin variantlarni taklif qiladi.

## Eslatmalar va tashrifni tasdiqlash

Eslatmalar kelmay qolishlarga qarshi sezilarli yordam beradi, bot orqali esa ularni yuborish eng oson: mijoz allaqachon chatda.

- **Bir kun oldin** — tafsilotlar va «Kelaman», «Ko‘chirish», «Bekor qilish» tugmalari bilan xabar.
- **Bir-ikki soat oldin** — manzil va kerak bo‘lsa geolokatsiya bilan qisqa eslatma.
- **Tashrifdan keyin** — xizmatni baholash so‘rovi yoki qayta yozilish taklifi.

Telegram cheklovini hisobga oling: **bot uni ishga tushirmagan odamga birinchi bo‘lib yoza olmaydi**. Shuning uchun telefon orqali qilingan yozuvni botga avtomatik «o‘tkazib» bo‘lmaydi — mijozni havola orqali botga taklif qilish kerak.

## Ko‘chirish va bekor qilish

- Ko‘chirish — bu **bitta harakat**: bot yangi slotlarni taklif qiladi va eskisini faqat yangisi tasdiqlangandan keyin bo‘shatadi.
- **Qoidalarni** belgilang: masalan, tashrifdan necha soat oldin qo‘ng‘iroqsiz bekor qilish mumkin. Vaqtni biznes belgilaydi, bot uni faqat qo‘llaydi.
- Administrator har bir bekor qilish va ko‘chirish haqida xabar oladi, bo‘shagan vaqtni boshqalarga taklif qilishi uchun.

## Kalendar va CRM bilan sinxronlash

Jadval bo‘yicha haqiqat manbai **bitta** bo‘lishi kerak.

| Vaziyat | Yechim |
|---|---|
| API’ga ega onlayn yozilish tizimi yoki CRM allaqachon bor | Bot unga interfeys: slotlarni o‘qiydi va yozuvlarni API orqali yaratadi |
| Yozuvlar Google Calendar’da yuritiladi | Ikki tomonlama sinxronlash: kalendardagi band vaqt botdagi slotlarni yopadi |
| Hech narsa yo‘q | O‘z yozuvlar bazasi va oddiy admin-panel yoki administrator uchun ishchi chat |

«Faqat botdan» bir tomonlama sinxronlash xavfli: telefon orqali va administrator qilgan yozuvlarni bot ko‘rmaydi.

## Ko‘p uchraydigan xatolar

- Barcha slotlarni ko‘rsatib, bandlikni faqat oxirida tekshirish.
- Xizmat davomiyligi va resurslarni hisobga olmaslik.
- «Istalgan mutaxassis»ni tanlash imkonini bermaslik.
- Mijozga odam bilan bog‘lanish yo‘lini qoldirmaslik.

## FAQ

### Yozilish uchun Mini App kerakmi?

Shart emas. Bir nechta xizmat va mutaxassis uchun chatdagi tugmalar yetarli. Xizmatlar ko‘p bo‘lsa, jadvalning ko‘rgazmali to‘ri kerak bo‘lsa yoki bir vaqtda bir nechta xizmat tanlansa, Mini App foydali.

### Yozilish uchun oldindan to‘lov olsa bo‘ladimi?

Ha, bot tasdiqdan oldin hisob yoki to‘lov havolasini yuborishi mumkin. Muhimi, slot mijozga faqat muvaffaqiyatli to‘lovdan keyin biriktirilishi kerak.

### Doimiy mijozlarni botga qanday o‘tkazish mumkin?

Bot havolasini xabarlarda, saytda, ijtimoiy tarmoqlarda bering va qabulxonaga QR-kod qo‘ying. Birinchi ishga tushirishdan keyin bot eslatmalarni o‘zi yubora oladi.
