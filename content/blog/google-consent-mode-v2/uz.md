---
title: Google Consent Mode v2: bu nima va uni qanday joriy qilish
description: Google Consent Mode v2 qanday ishlaydi: to‘rtta rozilik signali, basic va advanced rejim, cookie-banner bilan bog‘lash, konversiya modellashtirish.
summary: Consent Mode v2 — sayt Google teglariga foydalanuvchi nimaga rozilik berganini yetkazadigan mexanizm: rozilik bo‘lmasa teglar cookie yozmaydi, Google esa yo‘qolgan konversiyalarni qisman modellashtirish orqali tiklaydi. YeIH (EEA) trafigiga reklama uchun bu signallarni yuborish majburiy.
---

## Qisqacha: Consent Mode v2 nima

**Consent Mode** — gtag.js va Google Tag Manager’dagi API bo‘lib, u Google Ads va GA4 teglariga foydalanuvchining rozilik holatini uzatadi. U tashrif buyuruvchidan hech narsa so‘ramaydi: rozilikni sizning cookie-banneringiz yig‘adi, Consent Mode esa natijani teglarga yetkazadi.

2-versiya mavjud signallarga yana ikkitasini qo‘shdi. Reklama va analitika uchun to‘liq to‘plam:

| Signal | Nima uchun javob beradi |
|---|---|
| `ad_storage` | reklama uchun cookie va xotira |
| `analytics_storage` | analitika (GA4) uchun cookie |
| `ad_user_data` | foydalanuvchi ma’lumotlarini reklama uchun Google’ga yuborish mumkinmi |
| `ad_personalization` | ma’lumotlardan personalizatsiya va remarketing uchun foydalanish mumkinmi |

Har bir signal `granted` yoki `denied` qiymatiga ega.

## Texnik jihatdan qanday ishlaydi

Mantiq doim bir xil: **avval standart holat, keyin yangilanish**.

1. Teglar yuklanishidan oldin `default` beriladi — rozilik talab qilinadigan hududlarda odatda hammasi `denied`.
2. Foydalanuvchi bannerda tanlov qiladi.
3. Banner yangi qiymatlar bilan `update` chaqiradi.

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
</script>
```

«Qabul qilish» bosilgach, banner ruxsat berilgan toifalar uchun `granted` bilan `gtag('consent', 'update', {...})` chaqiradi. `wait_for_update` parametri bannerga birinchi xitlardan oldin yuklanishi uchun vaqt beradi (millisekundlarda). `region` parametri orqali turli mamlakatlar uchun turli standart qiymatlarni berish mumkin.

## Basic va advanced rejim

| | Basic | Advanced |
|---|---|---|
| Rozilikdan oldin teglar | Bloklangan | Darhol yuklanadi |
| Roziliksiz ma’lumotlar | Yuborilmaydi | Identifikatorsiz **cookieless-pinglar** ketadi |
| Modellashtirish | Umumiy model, aniqligi past | Saytingiz ma’lumotlariga asoslangan, aniqroq |
| Xavf va murakkablik | Yuristlar bilan kelishish osonroq | Pinglar yurisdiksiyangizda ruxsat etilganini tekshirish kerak |

**Basic rejim** — ehtiyotkor tanlov: rozilik bo‘lmaguncha Google hech narsa olmaydi. **Advanced** esa anonim signallarni yuboradi (hodisa sodir bo‘lgani haqida, cookie’siz) va bu Google’ga modellashtirish uchun ko‘proq material beradi. Rejimni tanlash faqat texnik emas, balki maxfiylik bo‘yicha yuristingizning ham masalasi.

## Konversiyalarni modellashtirish

Foydalanuvchi cookie’dan voz kechsa, reklamadagi klikni xarid bilan to‘g‘ridan-to‘g‘ri bog‘lab bo‘lmaydi. Google bu bo‘shliqni **modellashtirish** bilan to‘ldiradi: rozilik bergan foydalanuvchilar xatti-harakatiga qarab, rad etganlar qancha konversiya qilganini baholaydi.

Nimani bilish muhim:

- Modellashtirilgan konversiyalar Google Ads hisobotlarida kuzatilganlar bilan birga ko‘rinadi va avtomatik stavka strategiyalarida ishlatiladi.
- GA4’da alohida **xulq-atvor modellashtirish** bor, lekin u faqat trafik va kunlik hodisalar hajmi yetarli bo‘lganda yoqiladi — kichik saytda bo‘lmasligi mumkin.
- Model — bu fakt emas, baho. Dinamikani CRM ma’lumotlari bilan solishtiring.

## Consent Mode qachon majburiy

2024-yildan boshlab Google, agar siz **Yevropa iqtisodiy hududi** (EEA), shuningdek Buyuk Britaniya va Shveytsariya foydalanuvchilari uchun reklama funksiyalaridan (remarketing, personalizatsiya, konversiyalarni o‘lchash) foydalansangiz, rozilik signallarini yuborishni talab qiladi. `ad_user_data` va `ad_personalization` signallarisiz bu trafik uchun auditoriyalar va o‘lchash yomonlashadi.

Agar auditoriyangiz faqat O‘zbekiston yoki MDHda bo‘lsa, Google talabi rasman qo‘llanilmaydi. Lekin YeIdan sezilarli trafik kelsa yoki u yerda reklama qilishni rejalashtirsangiz, hozirdan joriy qiling. Mahalliy shaxsiy ma’lumotlar haqidagi qonunchilikni ham tekshiring — Consent Mode uning o‘rnini bosmaydi.

## Banner bilan bog‘lash: bosqichma-bosqich

1. **CMP tanlang** (rozilikni boshqarish platformasi) — Consent Mode v2’ni qo‘llab-quvvatlaydiganini. EEA’da AdSense, Ad Manager va AdMob uchun Google sertifikatlangan CMP talab qiladi.
2. **GTM orqali ulang**: aksariyat CMP’larda teg shabloni bor. Uni *Consent Initialization — All Pages* triggeriga qo‘ying, shunda `default` boshqa teglardan oldin ishlaydi.
3. GTM konteyner sozlamalarida **rozilik obzorini yoqing** va qaysi Google teglarida rozilik tekshiruvi o‘rnatilganini, qaysi uchinchi tomon teglariga uni qo‘lda qo‘shish kerakligini ko‘ring.
4. **Hududlarni sozlang**: EEA uchun qat’iy standart qiymatlar, boshqalar uchun yumshoqroq — agar siyosatingiz bunga yo‘l qo‘ysa.
5. **Ixtiyoriy ravishda** `url_passthrough` (klik parametrlarini cookie’siz URL orqali uzatish) va `ads_data_redaction` (rad etilganda reklama identifikatorlarini olib tashlash) ni yoqing.

## Joriy qilishni qanday tekshirish

- **Tag Assistant**’da Consent yorlig‘ini oching: standart va yangilangan holat ko‘rinadi.
- DevTools’ning Network yorlig‘ida Google so‘rovlarida `gcs` va `gcd` parametrlari bor — ular rozilik holatini kodlaydi.
- Google Ads’dagi konversiya diagnostikasida Consent Mode holati ko‘rsatiladi.

Ko‘p uchraydigan xatolar:

- `default` birinchi teglardan **keyin** ishlaydi — dastlabki xitlar holatsiz ketadi.
- Banner faqat `ad_storage` va `analytics_storage` ni yangilaydi, ikkita yangi signalni unutadi.
- Meta, TikTok va boshqa tizimlar teglari roziliksiz ishlashda davom etadi: Consent Mode faqat Google teglarini boshqaradi.

## FAQ

### Consent Mode’ni GTM’siz joriy qilsa bo‘ladimi?

Ha. gtag.js yuklanishidan oldin sahifa kodida `gtag('consent', 'default', ...)` ni, banner ishlovchisidan esa `update` ni chaqirish kifoya. GTM shunchaki boshqarish va tekshirishni osonlashtiradi.

### Consent Mode saytni GDPR’ga muvofiq qiladimi?

Yo‘q. U faqat foydalanuvchi tanlovini Google teglariga uzatadi. Qonunga muvofiqlik banner, maxfiylik siyosati, ma’lumotlarni qayta ishlovchilar ro‘yxati va ma’lumotlar bilan umumiy munosabatga bog‘liq.

### Joriy qilgandan keyin konversiyalar nega kamaydi?

Foydalanuvchilarning bir qismi cookie’dan voz kechadi, shuning uchun kuzatilgan konversiyalar kamayadi. Modellashtirilgan konversiyalar kechikib paydo bo‘ladi va har bir akkauntda emas — ma’lumotlar kam bo‘lsa, model yoqilmasligi mumkin.
