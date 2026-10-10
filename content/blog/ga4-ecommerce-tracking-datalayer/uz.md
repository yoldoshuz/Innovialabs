---
title: GA4’da dataLayer orqali elektron savdo: to‘liq sozlash
description: GA4’da dataLayer va GTM orqali e-commerce: view_item’dan purchase’gacha tavsiya etilgan hodisalar, tovar parametrlari, qaytarishlar va tushumni tekshirish.
summary: Sayt dataLayer’ga items massivi bilan GA4’ning tavsiya etilgan hodisalarini (view_item, add_to_cart, begin_checkout, purchase va boshqalar) yuboradi, GTM esa ularni bitta teg bilan GA4’ga uzatadi. Asosiysi — barcha hodisalarda yagona tovar tuzilmasi, noyob transaction_id va tushumni backend bilan muntazam solishtirish.
---

## Bu qanday ishlaydi

GA4 elektron savdo hisobotlarini faqat nomlari va parametrlari qat’iy belgilangan **tavsiya etilgan hodisalar** asosida quradi. Ish sxemasi:

1. Foydalanuvchi harakat qilganda sayt kodi hodisa va `ecommerce` obyekti bilan `dataLayer.push` qiladi.
2. Google Tag Manager’dagi trigger hodisani ushlaydi.
3. GA4 hodisa tegi uni elektron savdo ma’lumotlari bilan birga yuboradi.

To‘g‘ri dataLayer uchun dasturchi, GTM va hisobotlar uchun marketolog javob beradi. Tuzilmani oldindan kelishib oling va hujjatda qayd eting.

## Qanday hodisalar kerak

| Bosqich | Hodisa | Qachon yuborish |
|---|---|---|
| Katalog | `view_item_list` | tovarlar ro‘yxati ko‘rsatildi |
| | `select_item` | ro‘yxatdagi tovar bosildi |
| Kartochka | `view_item` | tovar kartochkasi ochildi |
| Savatcha | `add_to_cart`, `remove_from_cart` | tovar qo‘shildi yoki olib tashlandi |
| | `view_cart` | savatcha ochildi |
| Rasmiylashtirish | `begin_checkout` | rasmiylashtirish boshlandi |
| | `add_shipping_info` | yetkazib berish usuli tanlandi |
| | `add_payment_info` | to‘lov usuli tanlandi |
| Xarid | `purchase` | buyurtma muvaffaqiyatli yaratildi |
| Qaytarish | `refund` | buyurtma to‘liq yoki qisman qaytarildi |

Bannerlar uchun `view_promotion` va `select_promotion`, shuningdek `add_to_wishlist` ham bor. Ishlaydigan voronka uchun minimal to‘plam: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.

## Tovar va hodisa parametrlari

Har bir hodisada `items` massivi bo‘ladi. Tovar uchun **`item_id` yoki `item_name`** majburiy, qolgani — imkon qadar:

- `item_id`, `item_name` — artikul va nom, barcha hodisalarda bir xil;
- `price` — birlik narxi, satr emas, **son** sifatida;
- `quantity` — miqdor;
- `item_brand`, `item_category` … `item_category5`, `item_variant`;
- `item_list_id`, `item_list_name`, `index` — tovar qaysi ro‘yxatda va qaysi o‘rinda bo‘lgani;
- `discount`, `coupon`.

Hodisa darajasida: ISO 4217 formatidagi `currency` (masalan, `UZS` yoki `USD`) va `value`. `currency` bo‘lmasa, tushum hisobga olinmaydi. `purchase` uchun **`transaction_id`** majburiy, `tax`, `shipping`, `coupon` — ixtiyoriy.

## dataLayer misoli

Har bir e-commerce hodisasidan oldin `ecommerce` obyektini tozalang, aks holda oldingi hodisa ma’lumotlari keyingisiga «yopishib» qolishi mumkin.

```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORD-10452',
    currency: 'UZS',
    value: 450000,
    shipping: 30000,
    items: [{
      item_id: 'SKU-201',
      item_name: 'Termokrujka',
      item_category: 'Idish-tovoq',
      price: 150000,
      quantity: 3
    }]
  }
});
```

`value` ga yetkazib berish va soliqlar kiradimi — oldindan hal qiling va qoidani hamma joyda bir xil qo‘llang.

## GTM’da sozlash

1. Muntazam ifodali **«Maxsus hodisa» (Custom Event)** triggerini yarating, masalan `view_item|add_to_cart|begin_checkout|purchase|refund`.
2. Hodisa nomi `{{Event}}` bo‘lgan **«Google Analytics: GA4 hodisasi»** tegini yarating.
3. Tegning qo‘shimcha sozlamalarida manba sifatida **Data Layer** bilan **«Elektron savdo ma’lumotlarini yuborish»** ni yoqing.
4. Tegni triggerga bog‘lang va tekshiruvdan keyin konteynerni nashr qiling.

dataLayer tuzilmasi Google tavsiyalariga mos bo‘lsa, barcha hodisalar uchun bitta teg yetarli.

## Qaytarishlar

- **To‘liq qaytarish**: asl buyurtmaning `transaction_id`, `currency` va `value` qiymatlari bilan `refund` hodisasi.
- **Qisman qaytarish**: xuddi shu, qo‘shimcha ravishda qaytarilgan tovarlar va miqdori bilan `items` massivi.

Qaytarishlar odatda xaridor saytida emas, admin panel yoki CRM’da sodir bo‘ladi. Shuning uchun ularni dataLayer orqali emas, serverdan **Measurement Protocol** orqali yuborish yoki ma’lumotlar importi orqali yuklash qulayroq.

## Ma’lumotlarni qanday tekshirish

- **GTM oldindan ko‘rish rejimi**: hodisa ishladi, Data Layer yorlig‘ida tuzilma to‘g‘ri.
- **GA4’dagi DebugView**: hodisa parametrlar va tovarlar bilan keldi.
- **Backend bilan solishtirish**: haftada bir marta GA4’dagi buyurtmalar soni va tushumni bazadagi bilan solishtiring. Kichik farqlar normal (blokerlar, cookie’dan voz kechish), kattalari esa xatoni ko‘rsatadi.

Ko‘p uchraydigan xatolar:

- «Rahmat» sahifasi qayta yuklanganda **`purchase` dublikatlari**. Hodisani bir marta yuboring — masalan, serverdagi belgi bo‘yicha.
- **Narx satr ko‘rinishida** yoki bo‘sh joylar va valyuta belgisi bilan.
- Kartochka va xaridda **turli `item_id`** — tovar hisobotlari parchalanib ketadi.
- **`currency` yo‘q** — tushum nolga teng.
- Tashqi to‘lov shlyuzi sessiyani uzadi: shlyuz domenini keraksiz refererlar ro‘yxatiga qo‘shing.

## FAQ

### GA4’da e-commerce’ni GTM’siz sozlasa bo‘ladimi?

Ha, xuddi shu parametrlar bilan sayt kodida to‘g‘ridan-to‘g‘ri `gtag('event', 'purchase', {...})` orqali. Teglar ko‘p bo‘lsa va marketolog ularni relizsiz o‘zgartirishi kerak bo‘lsa, GTM qulayroq.

### Barcha tavsiya etilgan hodisalarni yuborish shartmi?

Yo‘q. Voronkaning asosiy qadamlari va `purchase` dan boshlang, keyin bu ma’lumotlarni tahlil qilsangiz, ro‘yxatlar va promolarni qo‘shing.

### GA4’dagi tushum nega CRM’dagidan kam?

Foydalanuvchilarning bir qismi analitikani bloklaydi yoki cookie’dan voz kechadi, ba’zi buyurtmalar telefon orqali rasmiylashtiriladi yoki bekor qilinadi. Agar farq katta va o‘sib borayotgan bo‘lsa, dublikatlar, valyuta va `purchase` barcha to‘lov usullarida ishlashini tekshiring.
