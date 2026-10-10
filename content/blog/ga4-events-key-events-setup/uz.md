---
title: GA4 da hodisalar va asosiy hodisalarni (konversiyalarni) sozlash
description: GA4 dagi hodisalar: avtomatik, tavsiya etilgan va maxsus hodisalar, parametrlar va maxsus o‘lchamlar, asosiy hodisalarni belgilash va DebugView’da tekshirish.
summary: GA4 da har qanday harakat — parametrli hodisa; generate_lead kabi tavsiya etilgan nomlardan foydalaning, kerakli parametrlarni maxsus o‘lchamlar sifatida ro‘yxatdan o‘tkazing, muhim hodisalarni asosiy deb belgilang va e’lon qilishdan oldin hammasini DebugView’da tekshiring.
---
## Qisqa javob: GA4 da hodisalar qanday ishlaydi

GA4 da hamma narsa **hodisalar** bilan o‘lchanadi: sahifani ko‘rish, bosish, formani yuborish, xarid. Har bir hodisada **parametrlar** bor — qo‘shimcha ma’lumotlar, masalan forma nomi yoki buyurtma summasi.

Ish tartibi:

1. Qaysi hodisalar allaqachon **avtomatik** yig‘ilayotganini tekshiring.
2. Odatiy harakatlar uchun Google’ning **tavsiya etilgan hodisalaridan** foydalaning.
3. Qolgan hamma narsa uchun **maxsus hodisalar** yarating.
4. Kerakli parametrlarni **maxsus o‘lchamlar** (custom dimensions) sifatida ro‘yxatdan o‘tkazing.
5. Muhim harakatlarni **asosiy hodisalar** deb belgilang.
6. Hammasini **DebugView**’da tekshiring.

## Hodisa turlari

| Tur | Misollar | Nima qilish kerak |
|---|---|---|
| **Avtomatik** | `first_visit`, `session_start`, `user_engagement` | Hech narsa, o‘zi yig‘iladi |
| **Kengaytirilgan o‘lchov** | `page_view`, `scroll`, `click`, `file_download`, `form_start` | Oqim sozlamalarida yoqish |
| **Tavsiya etilgan** | `generate_lead`, `sign_up`, `login`, `purchase`, `add_to_cart` | Aniq nom va parametrlar bilan yuborish |
| **Maxsus** | `brief_submit`, `calculator_used` | Nom o‘ylab topish va yuborish |

**Mos kelsa, tavsiya etilgan nomlardan foydalaning.** Ular uchun GA4 va Google Ads’da tayyor hisobotlar va funksiyalar bor, masalan `purchase` uchun elektron savdo hisobotlari.

## Hodisani qanday yuborish

**gtag.js orqali:**

```javascript
gtag('event', 'generate_lead', {
  form_name: 'contact',
  value: 1,
  currency: 'USD'
});
```

**Google Tag Manager orqali.** Sayt hodisani dataLayer’ga yuboradi, GTM’da esa shu hodisaga triggerli «Google Analytics: GA4 hodisasi» tegini yaratasiz:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_success',
  form_name: 'brief'
});
```

Hodisani **harakat muvaffaqiyatli bo‘lgandan keyin** yuboring — masalan, server arizani qabul qilganini tasdiqlaganda, tugma bosilganda emas.

**Nomlash qoidalari:**

- lotin harflari, raqamlar va pastki chiziq, harf bilan boshlanadi;
- registr muhim: `Generate_Lead` va `generate_lead` — turli hodisalar;
- `google_`, `ga_`, `firebase_` zaxiralangan prefikslaridan foydalanib bo‘lmaydi;
- barcha hodisalar uchun yagona `snake_case` uslubi.

## Parametrlar va maxsus o‘lchamlar

Hodisa bilan yuboriladigan parametrlar **hisobotlarda avtomatik paydo bo‘lmaydi**. Masalan, `form_name`’ni ko‘rish uchun:

1. «Administrator → Maxsus ta’riflar»ni oching.
2. «Maxsus o‘lcham yaratish»ni bosing.
3. Nom, amal qilish sohasi (**hodisa** yoki **foydalanuvchi**) va parametr nomini kodda qanday bo‘lsa, aynan shunday kiriting.

Muhim: ma’lumotlar faqat ro‘yxatdan o‘tkazilgan paytdan boshlab paydo bo‘ladi, orqaga qarab to‘ldirilmaydi. Buyurtma ID’si yoki vaqt kabi noyob qiymatli parametrlarni ro‘yxatdan o‘tkazmang — bu yuqori kardinallik va hisobotlarda «(other)» qatorini keltirib chiqaradi.

## Asosiy hodisalar

**Asosiy hodisalar** (key events) — GA4 da konversiyalar endi shunday ataladi. Bular biznes uchun muhim harakatlar: ariza, xarid, ro‘yxatdan o‘tish.

Qanday belgilash:

- «Administrator → Hodisalar»da kerakli hodisa qarshisidagi «Asosiy hodisa deb belgilash» belgisini yoqing;
- hodisa hali ro‘yxatda bo‘lmasa, uning aniq nomini ko‘rsatib, asosiy hodisani qo‘lda yarating.

Hamma narsani asosiy deb belgilamang: aylantirish yoki sahifani ko‘rish manzarani xiralashtiradi. Google Ads’ga faqat stavkalarni haqiqatan optimallashtirmoqchi bo‘lgan asosiy hodisalarni import qiling — u yerda ular konversiyalar deb ataladi.

## DebugView’da tekshirish

«Administrator» bo‘limidagi DebugView qurilmangizdan kelgan hodisalarni deyarli real vaqtda ko‘rsatadi. Nosozliklarni tuzatish rejimini yoqish uchun:

- Google Tag Manager’da **Preview**’ni ishga tushiring — rejim avtomatik yoqiladi;
- yoki teg konfiguratsiyasiga `debug_mode: true` qo‘shing;
- yoki Google Analytics Debugger kengaytmasidan foydalaning.

Saytda harakatni bajaring va tekshiring: hodisa bir marta kelgan, nomi to‘g‘ri yozilgan, parametrlar to‘ldirilgan. Tekshiruvdan keyin `debug_mode`’ni koddan olib tashlang.

## FAQ

### Nega hodisa DebugView’da ko‘rinadi, lekin hisobotlarda yo‘q?

Standart hisobotlar kechikish bilan yangilanadi: ma’lumotlarni qayta ishlash bir-ikki sutkagacha davom etishi mumkin. Shuningdek, ichki trafik yoki dasturchilar trafigi filtri ishlamaganini tekshiring.

### Hodisani dasturchisiz yaratish mumkinmi?

Ha, agar kerakli harakat allaqachon qayd etilayotgan bo‘lsa: «Administrator → Hodisalar»da mavjud hodisa asosida yangisini yaratish mumkin, masalan «Rahmat» sahifasidagi `page_view`. Murakkab harakatlarni GTM orqali sozlash osonroq.

### Asosiy hodisa Google Ads’dagi konversiyadan nimasi bilan farq qiladi?

Asosiy hodisa — GA4 tushunchasi. Uni Google Ads’ga import qilganingizda u konversiyaga aylanadi va stavkalarni optimallashtirish uchun ishlatilishi mumkin.
