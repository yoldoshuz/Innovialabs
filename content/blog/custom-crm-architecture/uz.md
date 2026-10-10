---
title: O‘z CRM tizimingizni loyihalash: arxitektura va ma’lumotlar modeli
description: Asosiy obyektlar, voronkalar, ruxsatlar, harakatlar tarixi va integratsiyalar qatlami: biznes bilan birga o‘sadigan CRM’ni qanday loyihalash mumkin.
summary: Barqaror shaxsiy CRM kichik asosiy obyektlar to‘plami, kod emas, ma’lumot sifatida tavsiflangan voronkalar, yozuv darajasidagi ruxsatlar, o‘zgarmas harakatlar tarixi va hodisalarga asoslangan alohida integratsiyalar qatlamiga tayanadi.
---
## Qisqa javob

Uzoq yashaydigan shaxsiy CRM beshta qarorga asoslanadi:

1. **Kichik va barqaror ma’lumotlar modeli**: kontaktlar, kompaniyalar, bitimlar, faolliklar, foydalanuvchilar.
2. **Voronkalar va statuslar ma’lumot sifatida saqlanadi**, rahbar ularni relizsiz o‘zgartira oladi.
3. **Ruxsatlar birinchi kundan o‘ylab chiqiladi**, yozuv darajasigacha.
4. **O‘zgarmas harakatlar tarixi** har bir o‘zgarish va aloqani qayd etadi.
5. **Integratsiyalar qatlami** yadrodan ajratilgan va hodisalar orqali ishlaydi.

Bu qarorlar to‘g‘ri qabul qilinsa, yangi funksiyalar qayta yozish emas, sozlashga aylanadi.

## Asosiy obyektlar

Har qanday savdo jarayonida bor bo‘lgan obyektlardan boshlang:

| Obyekt | Nimani saqlaydi | Asosiy bog‘lanishlar |
|---|---|---|
| Kontakt | Shaxs: ism, telefonlar, email, messenjerlar | Bir yoki bir nechta kompaniyaga bog‘langan |
| Kompaniya | Yuridik shaxs yoki mijoz akkaunti | Kontaktlar va bitimlarga ega |
| Bitim (lid, buyurtma) | Summa va bosqichga ega savdo imkoniyati | Kontakt, kompaniya, voronka, mas’ul |
| Faollik | Qo‘ng‘iroq, xabar, uchrashuv, vazifa, izoh | Istalgan yozuvga bog‘lanadi |
| Foydalanuvchi va bo‘lim | Xodimlar va tuzilma | Yozuvlarga egalik qiladi, bo‘limlarga kiradi |
| Tovar pozitsiyasi | Nima sotilgan, miqdori, narxi | Bitimga tegishli |

Amaliy qoidalar:

- **Telefon va email’larni normallashtirilgan ko‘rinishda** alohida jadvalda saqlang. Dublikatlarni topish va kiruvchi qo‘ng‘iroqlarni aniqlash shunga bog‘liq.
- **Lid va bitimni faqat jarayon haqiqatan farq qilsa ajrating.** Ko‘p bizneslarga bitta obyekt va erta «saralash» bosqichi yetarli.
- **Yumshoq o‘chirishdan foydalaning.** Savdo ma’lumotlari keyinchalik nizolar va tahlil uchun kerak bo‘ladi.

## Voronkalar va statuslar

Kodga qattiq yozilgan statuslar biznes o‘zgarganda birinchi bo‘lib buziladi. Ularni ma’lumot sifatida tavsiflang:

- `pipelines` — savdo voronkalari (chakana, ulgurji, hamkorlar).
- `stages` — voronka ichidagi tartiblangan bosqichlar, har birining turi bor: ochiq, muvaffaqiyatli yoki muvaffaqiyatsiz.
- `stage_transitions` — qaysi o‘tishlarga ruxsat borligi haqidagi ixtiyoriy qoidalar.
- **Bosqichlar bo‘yicha majburiy maydonlar**: masalan, «Hisob yuborildi» bosqichigacha summa majburiy.
- **Rad etish sabablari** — erkin matn emas, ma’lumotnoma, aks holda ularni tahlil qilib bo‘lmaydi.

Har bir bosqich o‘zgarishini vaqti bilan yozib boring. Voronka konversiyasi va bosqichda o‘tkazilgan vaqt joriy status bo‘yicha emas, shu jurnal bo‘yicha hisoblanadi.

## Ruxsatlar

Kirish huquqini uch qatlamda quring:

- **Rollar** amallarni belgilaydi: ko‘rish, yaratish, tahrirlash, o‘chirish, eksport.
- **Ko‘rinish doirasi** yozuvlarni belgilaydi: o‘ziniki, o‘z bo‘liminiki, butun kompaniyaniki.
- **Maydon darajasidagi qoidalar** marja yoki xarid narxi kabi maxfiy ma’lumotlarni yashiradi.

Ruxsatlarni faqat interfeysda emas, har bir so‘rovda backend’da tekshiring. Eksport va ommaviy operatsiyalarni jurnalga yozing: ma’lumotlar sizib chiqishining eng ko‘p uchraydigan yo‘li aynan shu.

## Harakatlar tarixi

Hodisalar lentasi — menejer birinchi ochadigan narsa. Uni ishonchli qiling:

- **Faqat qo‘shiladigan hodisalar jadvali**: kim, nima, qaysi yozuv bilan, qachon, eski va yangi qiymat.
- **Har bir yozuv uchun bitta lenta** — qo‘ng‘iroqlar, xabarlar, xatlar, vazifalar va maydon o‘zgarishlarini birlashtiradi.
- **Integratsiya hodisalarini ham saqlang**: to‘lov qabul qilindi, buyurtma jo‘natildi, xabar yetkazildi.

Bu jadval eng tez o‘sadi, shuning uchun yozuv va sana bo‘yicha indekslar hamda arxivlash siyosatini oldindan o‘ylang.

## Integratsiyalar qatlami

Telefoniya, messenjerlar, sayt formalari, to‘lov shlyuzlari, 1C va marketpleyslar yadro jadvallariga bevosita yozmasligi kerak.

- **Kiruvchi adapterlar** tashqi ma’lumotlarni «lid yaratish» yoki «faollik qo‘shish» kabi ichki buyruqlarga aylantiradi.
- **Chiquvchi hodisalar** (bitim yutildi, bosqich o‘zgardi) navbat orqali vebhuk va konnektorlarga boradi.
- **Tashqi ID’larni** moslik jadvalida saqlang — dublikatlar ko‘paymaydi va qayta sinxronlash mumkin bo‘ladi.
- **Ishlovchilarni idempotent va qayta urinishli qiling**: tashqi tizimlar dublikat yuboradi va vaqti-vaqti bilan ishlamay qoladi.

## Kengaytiriluvchanlik

Biznes hozir oldindan aytib bo‘lmaydigan maydon va obyektlarni so‘raydi. Variantlar:

- **Foydalanuvchi maydonlari** — turlangan tavsiflar jadvali va qiymatlar uchun JSON ustun orqali. Oddiy va moslashuvchan; filtrlanadigan maydonlarni indekslang.
- **Foydalanuvchi obyektlari** — faqat real ehtiyoj bo‘lganda, ular hamma narsani murakkablashtiradi.
- **Avtomatlashtirish qoidalari** (trigger, shart, amal) — oddiy ishlar uchun dasturchi kerak bo‘lmasin.
- **Ochiq API** — interfeysdagi kabi ruxsat tekshiruvlari bilan.

## Keng tarqalgan xatolar

- O‘z real jarayoningiz o‘rniga tayyor CRM funksiyalarining to‘liq ro‘yxatini nusxalash.
- Statuslarni kodda enum sifatida saqlash.
- Ruxsatlarni faqat frontend’da tekshirish.
- Yadro jadvallariga to‘g‘ridan-to‘g‘ri yozadigan integratsiyalar.
- Kontakt va kompaniya dublikatlari bilan ishlash rejasining yo‘qligi.

## FAQ

### Qachon AmoCRM yoki Bitrix24 o‘rniga shaxsiy CRM o‘zini oqlaydi?

Jarayon standart voronkalarga sig‘masa, o‘z tizimlaringiz bilan chuqur integratsiya kerak bo‘lsa yoki har bir foydalanuvchi uchun litsenziya cheklovga aylansa. Agar tayyor CRM jarayonni sozlamalar bilan qoplasa, undan boshlang.

### Foydalanuvchi maydonlarini ustunlarda saqlash kerakmi yoki JSON’da?

Barqaror maydonlar to‘plami uchun oddiy ustunlar qulayroq. Foydalanuvchilar yaratadigan maydonlar uchun keng tarqalgan murosa — tavsiflar jadvali va JSON qiymat ustuni; indekslarni faqat filtr va hisobotlarda ishlatiladigan maydonlarga qo‘shing.

### Birinchi navbatda nimani ishlab chiqish kerak?

Kontaktlar, bitta voronkali bitimlar, faollik lentasi va asosiy rollar. Integratsiyalar va avtomatlashtirish — model real ishda tekshirilgandan keyingi qadam.
