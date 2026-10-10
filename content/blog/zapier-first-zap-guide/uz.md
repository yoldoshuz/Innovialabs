---
title: Yangi boshlovchilar uchun Zapier: birinchi Zap qanday yaratiladi
description: Birinchi Zap’ni bosqichma-bosqich yig‘amiz: trigger, amallar, maydonlarni moslash, filtrlar, Paths, test va Zapier tarif uchun vazifalarni qanday sanashi.
summary: Zap — bu trigger va bir yoki bir nechta amal: bir xizmatdagi hodisa boshqa xizmatlarda qadamlarni ishga tushiradi, to‘lov esa asosan muvaffaqiyatli bajarilgan amallar (tasks) uchun olinadi, shuning uchun keraksiz ishga tushishlarni filtr bilan erta to‘xtating.
---
## Zap qanday tuzilgan

**Zap** — Zapier’dagi avtomatik ssenariy bo‘lib, ikki qismdan iborat:

- **Trigger** — Zap’ni ishga tushiradigan hodisa: formadagi yangi ariza, Google Sheets’dagi yangi qator, yangi xat.
- **Action (amal)** — Zapier javob sifatida bajaradigan ish: qator yaratadi, xabar yuboradi, CRM’ga bitim qo‘shadi.

Har bir Zap’da bitta trigger va bir yoki bir nechta amal bo‘ladi. Ular orasiga **filtrlar**, **formatlash** va **tarmoqlar (Paths)** qo‘yish mumkin.

## Misol: formadagi arizani jadvalga va Slack’ga yuborish

Vazifa: Google Forms’ga yangi ariza kelganda uni Google Sheets’ga yozish va Slack kanaliga xabar yuborish.

1. **Zap yarating** va trigger tanlang: Google Forms, hodisa *New Form Response*. Akkauntni ulang va formani tanlang.
2. **Triggerni test qiling.** Zapier namunaviy ma’lumot sifatida oxirgi javobni oladi. Javoblar bo‘lmasa, o‘zingiz test arizasini yuboring.
3. **Amal qo‘shing:** Google Sheets → *Create Spreadsheet Row*. Jadval va varaqni tanlang.
4. **Maydonlarni moslang (field mapping).** Har bir ustunga trigger ma’lumotini qo‘ying: «Ism» ← formadagi «Ism», «Telefon» ← «Telefon» va hokazo.
5. **Ikkinchi amalni qo‘shing:** Slack → *Send Channel Message*. Xabar matnida ham trigger ma’lumotlaridan foydalaning.
6. **Har bir qadamni test qiling** va Zap’ni yoqing.

## Maydonlarni moslash: nimaga e’tibor berish kerak

- Maydonga oldingi qadamlardagi **dinamik ma’lumotlar** va oddiy matnni aralash yozish mumkin: `Yangi ariza: {Ism}, telefon {Telefon}`.
- Ma’lumot noto‘g‘ri formatda kelsa (sana, telefon, harf registri), amaldan oldin **Formatter by Zapier** qadamini qo‘shing.
- O‘zgarib turadigan qiymatlarni qo‘lda yozib qo‘ymang: jadval ID’lari, xodimlar ismi, havolalar. Ular o‘zgarsa, Zap jimgina noto‘g‘ri joyga yoza boshlaydi.

## Filtrlar va tarmoqlar

**Filter** shart bajarilgandagina Zap’ni davom ettiradi. Masalan, Slack’ga faqat «Shoshilinch» belgilangan arizalarni yuborish. Shart bajarilmasa, Zap shu qadamda to‘xtaydi.

**Paths** — «agar — u holda» tarmoqlanishi: turli shartlar uchun turli amallar to‘plami. Masalan:

- A yo‘l: shahar Toshkent → Toshkent bo‘yicha menejerga xabar.
- B yo‘l: boshqa shaharlar → hududiy menejerga xabar.

Paths hamma tariflarda mavjud emas — o‘z rejangizni tekshiring.

| Vosita | Qachon ishlatiladi |
|---|---|
| Filter | Keraksiz ishga tushishlarni shunchaki to‘xtatish kerak |
| Paths | Ma’lumotga qarab turli amallar kerak |
| Formatter | Ma’lumotni kerakli ko‘rinishga keltirish kerak |

## Vazifalar (tasks) qanday sanaladi

Zapier tariflari oyiga **vazifalar (tasks)** sonini cheklaydi. Asosiy qoida:

- **Vazifa — bu bitta muvaffaqiyatli bajarilgan amal.** Trigger va ikkita amaldan iborat Zap bir marta ishlasa, odatda ikkita vazifa sarflanadi.
- **Trigger vazifa hisoblanmaydi.**
- Filter, Paths va Formatter kabi ichki xizmat qadamlari odatda vazifa sarflamaydi, lekin aniq qoidalar Zapier’ning joriy siyosatiga bog‘liq — hujjatlarni tekshiring.
- Zap filtrda to‘xtasa, undan keyingi amallar bajarilmaydi va sanalmaydi.

Amaliy xulosa: **filtrni iloji boricha erta qo‘ying**, shunda sizga kerak bo‘lmagan arizalarga vazifa sarflanmaydi.

Yana bir omil — **triggerni tekshirish oralig‘i**. Ko‘pchilik triggerlar so‘rov (polling) orqali ishlaydi: Zapier xizmatni bir necha daqiqada bir tekshiradi, chastota esa tarifga bog‘liq. Darhol reaksiya kerak bo‘lsa, instant-triggerlar yoki webhook’lardan foydalaning.

## Yangi boshlovchilarning keng tarqalgan xatolari

- **Bo‘sh namunaviy ma’lumotda test qilish.** Maydonlari to‘ldirilmagan namuna moslash xatolarini yashiradi.
- **Sozlashdan keyin Zap’ni yoqishni unutish.**
- **Xodimning shaxsiy akkauntini ulash.** U kompaniyadan ketsa, Zap ishlamay qoladi. Umumiy ishchi akkauntdan foydalaning.
- **Zap History’ga qaramaslik.** U yerda barcha ishga tushishlar, xatolar va har bir qadamga aynan qanday ma’lumot ketgani ko‘rinadi.

## FAQ

### Zap’ni bepul yaratish mumkinmi?

Ha, Zapier’da vazifalar soni va imkoniyatlar bo‘yicha cheklovli bepul reja bor: masalan, ko‘p qadamli Zap’lar va Paths faqat pullik tariflarda bo‘lishi mumkin. Birinchi tajriba uchun odatda yetarli.

### Nega Zap kechikib ishlaydi?

Ko‘pchilik triggerlar yangi ma’lumotni darhol emas, jadval bo‘yicha tekshiradi, oraliq esa tarifga bog‘liq. Darhol reaksiyani instant-triggerlar va webhook’lar beradi.

### Amal xato bilan tugasa nima bo‘ladi?

Ishga tushish Zap History’da xatoli deb belgilanadi, u yerda sababini ko‘rib, qadamni qayta ishga tushirishingiz mumkin. Muammo haqida mijozlardan eshitmaslik uchun xatolar haqidagi bildirishnomalarni yoqing.
