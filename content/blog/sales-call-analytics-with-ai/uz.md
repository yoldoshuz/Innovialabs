---
title: Sotuv bo‘limi qo‘ng‘iroqlarini AI yordamida tahlil qilish
description: AI yordamida sotuv qo‘ng‘iroqlarini matnga aylantirish, skript chek-listi bo‘yicha baholash, mijoz e’tirozlarini topish va qisqa xulosalarni CRM’ga yuborish.
summary: Qo‘ng‘iroqlar ATS’dan olinadi, ASR matnga aylantiradi, LLM chek-list bo‘yicha baholab e’tirozlarni JSON’da ajratadi, natija esa CRM’dagi bitim kartasiga yoziladi — rahbar tasodifiy namunani emas, har bir suhbatni ko‘radi.
---

## Bu qanday ishlaydi

AI bilan qo‘ng‘iroqlarni tahlil qilish — besh bosqichli zanjir:

1. **Yozuvni olish** — ATS yoki bulutli telefoniyadan metama’lumotlar bilan: menejer, mijoz raqami, davomiylik, bitim ID.
2. **Matnga aylantirish** (ASR) — spikerlarni ajratgan holda.
3. **Baholash** — LLM yordamida skript chek-listi bo‘yicha.
4. **Ajratib olish** — e’tirozlar, kelishuvlar, keyingi qadam.
5. **Yozish** — natijani CRM’ga kiritish va hisobotlar yig‘ish.

Asosiy qiymat — sotuv bo‘limi rahbari qo‘lda tinglangan bir nechtasini emas, **har bir qo‘ng‘iroqni** ko‘radi.

## 1–2-bosqichlar. Yozuv va transkripsiya

- Qo‘ng‘iroq tugashi bilan yozuvlarni **ATS API yoki vebhuki** orqali olishni sozlang.
- ATS **stereo** yozsa (menejer va mijoz alohida kanallarda), bundan foydalaning: spikerlarni ajratish aniqroq bo‘ladi.
- O‘zbek va rus-o‘zbek aralash nutqi uchun ishga tushirishdan oldin ASR sifatini real qo‘ng‘iroqlaringizda tekshiring.
- Resurslarni tejash uchun juda qisqa va javobsiz qo‘ng‘iroqlarni o‘tkazib yuboring.

## 3-bosqich. Chek-list bo‘yicha baholash

Sotuv skriptini **aniq va tekshiriladigan bandlarga** aylantiring. Yomon: «menejer xushmuomala edi». Yaxshi: «menejer suhbat boshida ismini va kompaniyasini aytdi».

JSON javobli prompt namunasi:

```text
Sen sotuv bo‘limi qo‘ng‘irog‘ini tahlil qilyapsan. Transkripsiyani bandlar bo‘yicha baholab chiq.
Har bir band uchun qaytar: id, passed (true/false), quote — dalil sifatida
transkripsiyadan qisqa iqtibos. Dalil bo‘lmasa, passed = false.

Bandlar:
1. greeting — o‘zini tanishtirdi va kompaniyani aytdi
2. needs — mijoz ehtiyojlari haqida kamida bitta savol berdi
3. next_step — sanasi bilan aniq keyingi qadamni kelishib oldi

Shuningdek qaytar: objections (mijoz e’tirozlari ro‘yxati), summary (2-3 gap).
Javob — faqat to‘g‘ri JSON.
```

**Dalil-iqtibos** talabi o‘ylab topilgan baholarni keskin kamaytiradi va menejerga band nega o‘tmaganini tekshirish imkonini beradi.

## 4-bosqich. E’tirozlar va insaytlar

LLM quyidagilarni yaxshi ajratadi:

- **e’tirozlar**: «qimmat», «maslahatlashish kerak», «boshqalar bilan ishlaymiz»;
- **menejer ularga qanday javob bergani** — va natija bo‘ldimi;
- **raqobatchilar** va mahsulotlar tilga olinishi;
- **kelishuvlar**: mijozga nima va qaysi muddatga va’da qilindi.

E’tirozlarni **qat’iy kategoriyalar ro‘yxatiga** keltiring, aks holda model har safar yangi ifoda o‘ylab topadi va hisobot jamlanmaydi.

## 5-bosqich. CRM’ga yozish

Bitim yoki kontakt kartasiga yozish foydali bo‘lgan maydonlar:

| Maydon | Nima uchun |
|---|---|
| Qo‘ng‘iroqning qisqa xulosasi | Har qanday xodim kontekstni soniyalarda tushunadi |
| Chek-list bahosi | Sifat nazorati va o‘qitish |
| E’tirozlar | Rad etish sabablari tahlili |
| Keyingi qadam va sana | Menejerga avtomatik vazifa |
| Yozuvga havola | Bahsli holatlarni tez tekshirish |

Ko‘pchilik CRM’lar API orqali maydonlarni yangilash va vazifa yaratishga imkon beradi.

## Ko‘p uchraydigan xatolar

- **Noaniq chek-list** — model «ko‘z bilan» baholaydi, natijalarni solishtirib bo‘lmaydi.
- **Kalibrovka yo‘q**: ishga tushirishdan oldin bir necha o‘nta qo‘ng‘iroqda AI baholarini rahbar baholari bilan solishtiring va ifodalarni tuzating.
- **Baholardan tekshiruvsiz jazolash uchun foydalanish** — menejerlar tizimga ishonmay qo‘yadi.
- **Maxfiylikni e’tiborsiz qoldirish**: mijozlarni yozuv haqida ogohlantirish va transkripsiyalarga kirishni cheklash kerak.

## FAQ

### AI rahbarning qo‘ng‘iroqlarni tinglashini to‘liq almashtira oladimi?

Yo‘q, lekin uning rolini o‘zgartiradi. AI barcha qo‘ng‘iroqlarni tekshirib, muammolilarini belgilaydi, rahbar esa aynan ularni tinglaydi va murakkab holatlarni tahlil qiladi.

### LLM baholari qanchalik aniq?

Aniqlik transkripsiya sifati va chek-list qanchalik aniq ekaniga bog‘liq. Odamlar baholagan qo‘ng‘iroqlarda kalibrovka qilish va dalil-iqtibos talab qilish baholarni ancha ishonchli qiladi.

### Bu o‘zbek tilidagi qo‘ng‘iroqlar bilan ishlaydimi?

Ha, agar tanlangan ASR yozuvlaringizda o‘zbek nutqini yaxshi tanisa. Zamonaviy LLM’lar o‘zbek va rus tilidagi transkripsiyalarni tahlil qila oladi, lekin buni real ma’lumotlarda tekshiring.
