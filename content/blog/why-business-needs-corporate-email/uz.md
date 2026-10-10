---
title: Biznesga o‘z domenidagi korporativ pochta nima uchun kerak
description: Nega name@company.com bepul pochtadan yaxshiroq: mijozlar ishonchi, xatlar yetib borishi, ma’lumotlar ustidan nazorat va xodim ketganda nima qilish kerak.
summary: O‘z domeningizdagi pochta ishonchliroq ko‘rinadi, SPF, DKIM va DMARC tufayli spamga kamroq tushadi va xodimga emas, kompaniyaga tegishli bo‘ladi. Xodim ketsa, uning yozishmalari va mijozlar yozadigan manzil sizda qoladi.
---

## Qisqa javob

**name@company.com** ko‘rinishidagi manzil `company.sales@gmail.com` kabi bepul pochtalar hal qila olmaydigan uchta vazifani hal qiladi:

- **Ishonch.** Mijoz xat xususiy shaxsdan emas, kompaniyadan kelganini ko‘radi.
- **Yetib borish.** O‘z domeningiz uchun xatlar haqiqiyligini tekshirishni sozlashingiz mumkin, shunda pochta xizmatlari ularni «Kiruvchi» papkaga ko‘proq yetkazadi.
- **Nazorat.** Pochta qutilari kompaniyaga tegishli: ularni o‘zingiz yaratasiz, bloklaysiz va topshirasiz.

## Ishonch va tanilish

Bepul manzilni soxtalashtirish oson: istalgan odam ommaviy xizmatda o‘xshash nomni ro‘yxatdan o‘tkazishi mumkin, firibgarlar bundan faol foydalanadi. Kompaniya domenidagi manzil sayt, vizitkalar va hujjatlar bilan mos keladi — mijozga bu haqiqatan siz ekaningizni tushunish osonroq.

Amaliy jihati ham bor: ko‘plab kompaniyalar va davlat tashkilotlari bepul pochtadan kelgan tijoriy takliflar va hisob-fakturalarga ehtiyotkorlik bilan qaraydi.

## Yetib borish: SPF, DKIM va DMARC

Pochta xizmatlari jo‘natuvchining domen nomidan xat yuborishga haqqi bor-yo‘qligini tekshiradi. O‘z domeningiz uchun buni DNS’da sozlaysiz:

- **SPF** — domeningiz nomidan xat yuborishga ruxsat berilgan serverlar ro‘yxati.
- **DKIM** — xatning raqamli imzosi, u yo‘lda o‘zgartirilmaganini isbotlaydi.
- **DMARC** — tekshiruvdan o‘tmagan xatlar bilan nima qilish va hisobotlarni qayerga yuborish qoidasi.

Yozuvlar misoli (qiymatlar pochta provayderingizga bog‘liq):

```text
example.com.         TXT  "v=spf1 include:_spf.google.com ~all"
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

DKIM yozuvini provayder o‘zi yaratadi — uni boshqaruv panelidan nusxalash kerak. DMARC’ni `p=none` bilan boshlab, hisobotlarni o‘rganib, keyin siyosatni qat’iylashtirish oqilona.

Yirik pochta xizmatlari autentifikatsiya talablarini, ayniqsa ommaviy jo‘natmalar uchun, bosqichma-bosqich kuchaytirib bormoqda. Bu yozuvlarsiz xatlar spamga ko‘proq tushadi yoki rad etiladi.

## Nazorat va xodimlarning ketishi

Bu dalil odatda muammo yuz bermaguncha e’tiborsiz qoladi. Agar menejer mijozlar bilan shaxsiy Gmail’da yozishgan bo‘lsa, u ketgandan keyin:

- butun muloqot tarixi u bilan birga ketadi;
- mijozlar kompaniya kira olmaydigan manzilga yozishda davom etadi;
- kelishuvlar, hisob-fakturalar va kontaktlarni tiklashning iloji bo‘lmasligi mumkin.

Korporativ pochtada administrator:

1. sobiq xodimning kirishini u ketgan kuniyoq bloklaydi;
2. uning pochta qutisini saqlab qoladi yoki rahbar yoxud vorisga kirish huquqini beradi;
3. mijozlar xatlari yo‘qolmasligi uchun yo‘naltirish yoki avtojavobni sozlaydi;
4. kerak bo‘lsa, manzilni umumiy qutiga yoki taxallusga aylantiradi.

Boshidanoq vazifalar uchun **umumiy manzillar** yaratish qulay: `sales@`, `support@`, `info@`. Ular aniq bir odamga bog‘lanmagan va har qanday kadrlar o‘zgarishidan keyin ham saqlanib qoladi.

## Provayderni qanday tanlash kerak

Mashhur variantlar — Google Workspace, Microsoft 365, Yandex 360, Zoho Mail, shuningdek hosting-provayderdagi pochta. Solishtiring:

- **Pochta qutisi va ilovalar hajmi**, jo‘natish limitlari.
- **Qo‘shimcha xizmatlar**: kalendar, hujjatlar, videoqo‘ng‘iroqlar.
- **Boshqaruv**: ikki bosqichli autentifikatsiya, o‘chirilgan xatlarni tiklash, arxiv.
- **Ma’lumotlar qayerda saqlanadi** va bu talablaringizga mosmi.
- **Bitta foydalanuvchi narxi** va u jamoa o‘sishi bilan qanday oshadi.

## Ko‘p uchraydigan xatolar

- Domen yoki pochta akkauntini xodimning shaxsiy manziliga ro‘yxatdan o‘tkazish.
- Pochtani ulagandan keyin SPF, DKIM va DMARC’ni unutish.
- Sozlamasdan asosiy ishchi domendan reklama jo‘natmalarini yuborish — bundan oddiy yozishmalar obro‘si zarar ko‘radi.
- Ketgan xodimning pochta qutisini ma’lumotlarni saqlamay darhol o‘chirish.

## FAQ

### Saytni o‘zgartirmasdan domenimni pochtaga ulasam bo‘ladimi?

Ha. Pochta va sayt turli DNS-yozuvlar orqali sozlanadi: pochta uchun MX va TXT-yozuvlar o‘zgaradi, sayt yozuvlari esa o‘z holicha qoladi. Sayt va pochta turli provayderlarda ishlashi mumkin.

### Har bir pochta qutisi uchun to‘lash kerakmi?

Ko‘pchilik bulutli provayderlarda to‘lov foydalanuvchi uchun olinadi. `info@` kabi umumiy manzillarni ko‘pincha alohida litsenziyasiz taxallus yoki guruh sifatida yaratish mumkin — bu provayderga bog‘liq.

### Gmail’dagi eski yozishmalarni ko‘chirish mumkinmi?

Odatda ha: yirik provayderlarda boshqa xizmatlardan pochtani import qilish vositalari bor. Ko‘chirishni oldindan rejalashtiring va eski qutilarni o‘chirishdan oldin natijani tekshiring.
