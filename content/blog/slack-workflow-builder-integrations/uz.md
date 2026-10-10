---
title: Slack’da Workflow Builder va integratsiyalar: rutinani avtomatlash
description: Slack’da arizalar, stendaplar va onbording uchun workflow yig‘ish, Jira, Google Drive va GitHub’ni ulash hamda avtomatik bildirishnomalarga cho‘kib ketmaslik.
summary: Workflow Builder Slack’dagi takroriy rutinani trigger va bir necha qadamga aylantiradi — forma, xabar, jadvaldagi qator, Jira, Google Drive va GitHub ilovalari esa hodisalarni olib keladi; qoida bitta: har bir integratsiya uchun alohida kanal va qat’iy filtrlar.
---
## Qisqacha javob

**Workflow Builder** — Slack’ning rutinani avtomatlashtirish uchun no-code vositasi: **trigger** (havola, jadval, kanalga yangi a’zo, emoji reaksiya, webhook) **qadamlar** zanjirini ishga tushiradi — forma ko‘rsatish, xabar yuborish, Google Sheets’ga qator qo‘shish, Jira’da vazifa yaratish. Alohida tarzda Jira, Google Drive va GitHub **ilovalari** o‘z hodisalarini kanallarga yuboradi va Slack’dan chiqmasdan harakat qilish imkonini beradi.

Deyarli hamma joyda uchta workflow o‘zini oqlaydi: **arizalarni qabul qilish**, **asinxron stendaplar** va **onbording**. Workflow Builder Slack’ning pullik tariflarida mavjud — jarayonlarni qurishdan oldin rejangizning joriy shartlarini tekshiring.

## 1-workflow: arizalarni qabul qilish

Muammo: IT, dizayn yoki buxgalteriyaga arizalar shaxsiy xabarda, tafsilotlarsiz keladi va yo‘qoladi.

1. **From a link in Slack** triggeri bilan workflow yarating va uni `#help-it` kanali xatcho‘plariga qo‘shing.
2. **Collect info in a form** qadami: ariza turi (ochiladigan ro‘yxat), tavsif, shoshilinchlik, muddat.
3. **Send a message to a channel** qadami: `#help-it`’da javoblar va muallif ismi bilan rasmiylashtirilgan kartochka.
4. Ixtiyoriy: konnektor qadami arizani kuzatish uchun Google jadvaliga qator qo‘shadi yoki Jira’da vazifa yaratadi.
5. **Send a message to a person** qadami: muallifga ariza qabul qilingani haqida tasdiq.

Reaksiyalar orqali oddiy statuslarni kelishib oling: ko‘zlar — ishga olindi, belgi — tayyor.

## 2-workflow: asinxron stendap

Muammo: kundalik qo‘ng‘iroqlar vaqt oladi, turli jadvalda ishlaydiganlar esa ularni o‘tkazib yuboradi.

1. **On a schedule** triggeri: ish kunlari, ish kuni boshida.
2. Qadam: `#team-dev`’da stendap formasini ochadigan tugmali eslatma.
3. Forma: kecha nima qildim, bugun nima rejalashtiryapman, nima xalaqit beryapti.
4. Javoblar kanalga chiqadi; timlid ularni o‘qiydi va faqat to‘siqlar qo‘ng‘iroqqa aylanadi.

Uchtadan ortiq savol bermang. Uzun formalar o‘tkazib yuboriladi.

## 3-workflow: onbording

1. **When someone joins a channel** triggeri, masalan `#ann-company`.
2. Qadam: reglament, asosiy kanallar va muloqot qoidalariga havolalar bilan shaxsiy salomlashuv xabari.
3. Qadam: rahbar yoki murabbiyga yangi odam kelgani haqida bildirishnoma.
4. Ixtiyoriy — bir necha kundan keyin jadval bo‘yicha ikkinchi workflow: barcha kirishlar ishlayaptimi.

## Jira, Google Drive va GitHub’ni ulash

**Jira Cloud.** Rasmiy Jira Cloud ilovasini o‘rnating, Atlassian akkauntini ulang, so‘ng loyihani kanalga bog‘lang va filtrlar qo‘ying: faqat muayyan vazifa turlari, statuslar yoki JQL so‘rovi. Vazifa havolalari prevyuga ochiladi, vazifalarni esa to‘g‘ridan-to‘g‘ri xabarlardan yaratish mumkin.

**Google Drive.** Ilova izohlar, kirish so‘rovlari va ulashilgan fayllar haqida shaxsiy xabarda bildiradi, prevyu ko‘rsatadi va kanalga havola yuborilganda ruxsatlarni tekshirib, kanal a’zolariga kirish ochishni taklif qiladi.

**GitHub.** GitHub ilovasini o‘rnating va kanalni repozitoriyga obuna qiling:

```text
/github subscribe owner/repo
/github subscribe owner/repo reviews comments
/github unsubscribe owner/repo commits
```

Birinchi qator standart hodisalarni yoqadi, ikkinchisi ko‘rib chiqish va izohlarni qo‘shadi, uchinchisi shovqinli kommitlar lentasini olib tashlaydi. Repozitoriyni faqat unga mas’ul jamoa kanalida obuna qiling.

## Shovqinni qanday nazorat qilish kerak

Integratsiyalar — Slack’ni chidab bo‘lmas qilishning eng tez yo‘li. Quyidagi qoidalar yordam beradi:

- **Botlar uchun alohida kanallar**: `#alerts-jira-backend`, `#alerts-deploys`. Odamlar jamoa kanallarida muhokama qiladi, botlar `alerts-`’ga yozadi.
- **Manbaning o‘zida filtrlang.** Faqat kimdir javob beradigan hodisalar: yangi jiddiy xatolar, muvaffaqiyatsiz deploylar, ko‘rib chiqish kutayotgan PR’lar.
- **Har bir integratsiyaning egasi bor** — filtrlarni tahrirlaydi va foydasi qolmaganda o‘chiradi.
- **Muhokama — bot xabari ostidagi tredda**, yangi xabarlar bilan emas.
- **Standart holatda ovozsiz.** A’zolar `alerts-` kanallariga faqat eslatmalar bo‘yicha obuna, navbatchi esa to‘liq kuzatadi.
- **Oyiga bir marta tekshiruv.** Agar kanal alertlariga bir oy hech kim javob bermagan bo‘lsa, ularni qisqartiring yoki o‘chiring.

## Ko‘p uchraydigan xatolar

- Jamoa hali kelishmagan jarayonni avtomatlashtirish — workflow tartibsizlikni mustahkamlab qo‘yadi.
- Hech kim to‘ldirmaydigan o‘n maydonli formalar.
- Workflow’ni bitta odam yig‘gan va boshqa hech kim uni tahrirlay olmaydi. Hammualliflar qo‘shing.
- Barcha integratsiyalar `#general`’ga yozadi.

## FAQ

### Workflow yig‘ish uchun dasturchi kerakmi?

Yo‘q. Formalar, xabarlar, jadvallar va standart konnektor qadamlari vizual sozlanadi. Dasturchi o‘z qadamlaringiz, tizimlaringizdan keladigan webhook’lar yoki o‘z mantiqiga ega Slack ilovasi uchun kerak.

### Workflow Builder Zapier yoki Make’ni almashtira oladimi?

Slack’da boshlanib, Slack’da tugaydigan jarayonlar uchun — ko‘pincha ha. Tarmoqlanish va ma’lumotlarni o‘zgartirish bilan ko‘plab tashqi servislar orqali o‘tadigan zanjirlar uchun Zapier, Make yoki n8n moslashuvchanroq.

### Bot xabarlariga e’tiborsizlikning oldini qanday olish mumkin?

Ularni kamroq yuboring. Faqat harakat talab qiladigan hodisalarni qoldiring, butun kanalni emas, mas’ul shaxsni belgilang, axborot xarakteridagi hamma narsani esa ovozsiz kanal yoki kundalik dayjestga o‘tkazing.
