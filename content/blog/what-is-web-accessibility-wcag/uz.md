---
title: Sayt qulayligi (accessibility) va WCAG standarti nima
description: Saytlar qulayligi haqida sodda: u kimga kerak, POUR tamoyillari, WCAG ning A, AA va AAA darajalari hamda biznes nega bu haqda o‘ylashi kerak.
summary: Accessibility — saytdan hamma, jumladan ko‘rish, eshitish va harakat imkoniyati cheklangan odamlar ham foydalana olishi; WCAG — aniq mezonlarga ega xalqaro standart, odatda AA darajasi mo‘ljal qilinadi.
---
## Qisqacha: accessibility nima

**Sayt qulayligi (accessibility, a11y)** — interfeysdan cheklovlardan qat’i nazar foydalanish mumkinligi: sichqonchasiz, ko‘rmasdan, zaif eshitish bilan, qo‘l titrasa yoki telefon ekraniga quyosh tushib turganda ham.

**WCAG (Web Content Accessibility Guidelines)** — W3C konsorsiumining xalqaro standarti. U tekshirsa bo‘ladigan mezonlarni belgilaydi: matn kontrasti qanday bo‘lishi, klaviatura bilan qanday ishlash, video va formalar bilan nima qilish kerakligi. Standart 2.0, 2.1, 2.2 versiyalari bo‘yicha rivojlanadi va har biri oldingisini to‘ldiradi.

## Accessibility kimga kerak

Ko‘pincha faqat ko‘zi ojiz foydalanuvchilar haqida o‘ylashadi, ammo doira ancha keng:

- **Ko‘rish qobiliyati cheklanganlar** — ekran o‘quvchilari (screen readers), kattalashtirish va yuqori kontrastli mavzulardan foydalanadi.
- **Eshitish qobiliyati cheklanganlar** — subtitrlar va matnli transkripsiyalarga muhtoj.
- **Harakat imkoniyati cheklanganlar** — saytni faqat klaviatura, ovoz yoki maxsus qurilmalar bilan boshqaradi.
- **Kognitiv xususiyatlarga ega odamlar** — sodda til, oldindan bilinadigan navigatsiya va chalg‘ituvchi animatsiyasiz interfeys muhim.
- **Vaqtinchalik va vaziyatli cheklovlar** — singan qo‘l, qo‘lda bola, shovqinli ko‘cha, sekin internet.
- **Keksa foydalanuvchilar** — ularda ko‘pincha bir nechta omil birga uchraydi.

Asosiy xulosa: qulay interfeys faqat bir guruh uchun emas, hamma uchun qulayroq.

## To‘rt POUR tamoyili

WCAG ning barcha mezonlari to‘rt tamoyil atrofida guruhlangan:

| Tamoyil | Ma’nosi | Misollar |
|---|---|---|
| **Perceivable** (idrok etiladigan) | Ma’lumotni kamida bitta sezgi orqali qabul qilish mumkin | Rasmlarda alt-matn, subtitrlar, yetarli kontrast |
| **Operable** (boshqariladigan) | Interfeysni turli usullarda boshqarish mumkin | Klaviatura bilan ishlash, harakatlar uchun yetarli vaqt, miltillashsiz |
| **Understandable** (tushunarli) | Kontent va xatti-harakat oldindan bilinadi | Formalardagi tushunarli xatolar, sahifa tili ko‘rsatilgan, yagona navigatsiya |
| **Robust** (ishonchli) | Sayt yordamchi texnologiyalar bilan to‘g‘ri ishlaydi | Valid belgilash, elementlarning to‘g‘ri rollari va nomlari |

## A, AA va AAA muvofiqlik darajalari

Har bir WCAG mezoni uch darajadan biriga tegishli:

- **A** — bazaviy minimum. Usiz ba’zi foydalanuvchilar saytdan umuman foydalana olmaydi. Misol: rasmlarda matnli muqobil bor.
- **AA** — ishchi standart. Qonunlar, tenderlar va korporativ talablarda ko‘pincha aynan shu daraja ko‘rsatiladi. Misol: oddiy matn kontrasti kamida **4.5:1**.
- **AAA** — eng yuqori daraja. Butun sayt uchun odatda talab qilinmaydi, chunki ayrim mezonlarni har qanday kontent uchun bajarib bo‘lmaydi. Misol: kontrast kamida **7:1**.

Darajalar jamlanadi: AA ga mos kelish uchun barcha A va AA mezonlarini bajarish kerak.

## Bu biznes uchun nega muhim

- **Ko‘proq mijozlar.** Agar odam klaviatura bilan buyurtma bera olmasa yoki xira matnni o‘qiy olmasa, raqobatchiga ketadi.
- **Huquqiy talablar.** Ko‘plab mamlakatlarda raqamli servislar qulayligi qonun bilan belgilangan — ayniqsa davlat sektori, banklar, transport va internet-do‘konlar uchun. Xorijiy bozorlar yoki yirik buyurtmachilar bilan ishlasangiz, WCAG AA ga muvofiqlik shartnomada paydo bo‘lishi mumkin.
- **SEO va kod sifati.** Semantik belgilash, alt-matnlar va tushunarli sarlavhalar qidiruv tizimlari va AI-qidiruvga sahifani yaxshiroq tushunishga yordam beradi.
- **Hamma uchun qulaylik.** Yaxshi kontrast, katta tugmalar va tushunarli formalar har qanday foydalanuvchida xatolarni kamaytiradi.
- **Boshidan hisobga olish arzonroq.** Tayyor mahsulotda qulaylikni tuzatish, odatda, uni dizayn va vyorstkada oldindan rejalashtirishdan qimmatroq.

## Nimadan boshlash kerak

1. Saytning asosiy ssenariylarini **faqat klaviatura bilan** bosib o‘ting: Tab, Shift+Tab, Enter, probel, Esc.
2. Matn va tugmalar **kontrastini** istalgan kontrast-chekerda tekshiring.
3. Avtomatik auditni ishga tushiring — masalan, **Lighthouse** yoki **axe**. U muammolarning bir qismini topadi, hammasini emas.
4. Saytni **ekran o‘quvchisi** bilan tinglang: macOS va iOS’da VoiceOver, Windows’da NVDA, Android’da TalkBack.
5. Qulaylik tekshiruvlarini dizayn-revyu va vazifalarni qabul qilish chek-listiga qo‘shing.

Standartning rasmiy matni va mezonlar bo‘yicha qisqa ma’lumotnomalar [W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/) saytida e’lon qilingan.

## Keng tarqalgan noto‘g‘ri tasavvurlar

- **«Bizda bunday foydalanuvchilar yo‘q»** — siz ularni analitikada ko‘rmaysiz, chunki ular saytdan foydalana olmagan.
- **«Accessibility vidjetini qo‘yish kifoya»** — overleylar koddagi muammolarni tuzatmaydi va ba’zan yordamchi texnologiyalarga xalaqit beradi.
- **«Qulay sayt — chiroyli emas»** — WCAG yorqin dizaynni taqiqlamaydi, u o‘qiluvchanlik va boshqaruvchanlikni talab qiladi.

## FAQ

### WCAG ning qaysi darajasini tanlash kerak?

Ko‘pchilik tijorat va davlat saytlari uchun mo‘ljal — **WCAG AA**. AAA ning alohida mezonlarini oson bo‘lgan joylarda bajarish mumkin.

### Accessibility ni faqat avtomatik vositalar bilan tekshirsa bo‘ladimi?

Yo‘q. Avtomatika alt yo‘qligi yoki past kontrast kabi texnik xatolarni topadi, ammo navigatsiya mantig‘i, matnning tushunarliligi va ekran o‘quvchisi bilan ishlashni qo‘lda tekshirish kerak.

### Accessibility bir martalik vazifami?

Yo‘q, bu jarayonning bir qismi. Har bir yangi sahifa va komponent qulaylikni buzishi mumkin, shuning uchun tekshiruvlarni dizayn, ishlab chiqish va testlashga kiritish kerak.
