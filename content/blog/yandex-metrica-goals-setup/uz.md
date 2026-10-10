---
title: Yandex Metrikada maqsadlarni qanday sozlash kerak
description: Yandex Metrikadagi maqsad turlari: sahifaga kirish, JavaScript-hodisa, forma yuborish va telefon bosish maqsadlarini sozlash, tekshirish va Direktga ulash.
summary: Metrikadagi maqsad — natija deb hisoblanadigan tashrifchi harakati: ariza, qo‘ng‘iroq, messenjerga o‘tish. Maqsadlarni hisoblagich sozlamalarida yarating, debug rejimida tekshiring va asosiylarini kalit maqsad deb belgilang, shunda Yandex Direkt reklamani konversiyalar bo‘yicha optimallashtiradi.
---
## Qisqa javob

Yandex Metrikadagi **maqsad** — sayt aynan nima uchun mavjud bo‘lsa, o‘sha harakat: ariza yuborish, telefon raqamini bosish, Telegramga o‘tish, buyurtma berish. Maqsadlarsiz Metrika faqat trafikni ko‘rsatadi, maqsadlar bilan esa qaysi manba natija keltirayotganini ko‘rasiz.

Sozlash yo‘li: **Metrika → hisoblagichingiz → Maqsadlar → Maqsad qo‘shish**. Turini tanlang, shartni kiriting, saqlang. Maqsad bo‘yicha ma’lumotlar u yaratilgan paytdan boshlab yig‘iladi — orqaga qarab hisoblanmaydi. Shuning uchun maqsadlarni reklamani ishga tushirishdan oldin sozlang.

## Maqsad turlari va qaysi birini qachon tanlash

| Maqsad turi | Nimani hisoblaydi | Qachon ishlatiladi |
|---|---|---|
| **Sahifalarga tashrif** | Shartga mos URL ochilishi | «Rahmat» sahifasi, savat, buyurtma rasmiylashtirish |
| **JavaScript-hodisa** | Sayt kodidan `reachGoal` chaqiruvi | AJAX-formalar, kalkulyatorlar, URL o‘zgarmaydigan harakatlar |
| **Forma yuborish** | Formaning submit hodisasi | Oddiy HTML-formalar |
| **Telefon raqamini bosish** | `tel:` havolasini bosish | Mobil trafik, telefon orqali sotuvchi biznes |
| **Messenjerga o‘tish** | Telegram, WhatsApp va boshqa havolalarni bosish | Arizalar chatlarga kelganda |
| **Email bosish, fayl yuklab olish** | Tegishli havolalar | Narxnomalar, taqdimotlar, kontaktlar |
| **Tarkibiy maqsad** | Qadamlar ketma-ketligi | Voronka: katalog → mahsulot → savat → buyurtma |

Ba’zi maqsadlarni Metrika avtomatik yaratishi mumkin (**avtomaqsadlar**), masalan, telefon va messenjer bosishlari. Boshlash uchun qulay, ammo ularning nomi va mantiqini qo‘lda tekshirib chiqing.

## Asosiy maqsadlarni sozlash

**Sahifaga tashrif.** Shartni tanlang: URL mos keladi, o‘z ichiga oladi, shu bilan boshlanadi yoki muntazam ifoda. «Rahmat» sahifasi uchun `/thank-you` ni «o‘z ichiga oladi» sharti odatda yetarli. Bu sahifaga faqat haqiqiy arizadan keyin kirish mumkinligiga ishonch hosil qiling, aks holda maqsad oshirib ko‘rsatiladi.

**JavaScript-hodisa.** Zamonaviy saytlar uchun eng ishonchli variant. Metrikada **maqsad identifikatorini** kiriting, masalan `lead_form`. Dasturchi esa uni yuborish muvaffaqiyatli bo‘lgan paytda chaqiradi — tugma bosilganda emas, server javob bergandan keyin:

```js
ym(XXXXXXXX, 'reachGoal', 'lead_form');
```

`XXXXXXXX` o‘rniga hisoblagich raqamini qo‘ying. Identifikator yozilishiga sezgir: `lead_form` va `Lead_Form` — turli maqsadlar.

**Forma yuborish.** Metrika sahifada topgan formalarni ko‘rsatadi. Forma standart usulda yuborilsa ishlaydi. Agar forma submit hodisasisiz JavaScript orqali yuborilsa, maqsad ishlamasligi mumkin — bunda JavaScript-hodisadan foydalaning.

**Telefon va messenjer bosishlari.** Raqam `tel:+998...` ko‘rinishidagi havola, messenjer esa oddiy havola bo‘lishi kerak. Rasm yoki havolasiz matn shaklidagi raqamni Metrika kuzata olmaydi.

**Tarkibiy maqsad.** Bir nechta qadam belgilang, har birining o‘z sharti bo‘ladi. Hisobotlarda odamlar qaysi qadamda chiqib ketayotgani ko‘rinadi — internet-do‘konlar va ko‘p qadamli formalar uchun foydali.

## Maqsad ishlayotganini qanday tekshirish

1. Saytni manzilga `?_ym_debug=1` qo‘shib oching, masalan `site.uz/?_ym_debug=1`.
2. Brauzer konsolini oching (F12 → Console).
3. Maqsadli harakatni bajaring. Konsolda maqsadga erishilgani haqida uning identifikatori bilan xabar chiqishi kerak.
4. Biroz vaqtdan keyin **Hisobotlar → Konversiyalar** bo‘limini tekshiring: maqsad noldan katta qiymat bilan ko‘rinishi kerak.

Kompyuterda ham, telefonda ham, reklama blokerlarini o‘chirib tekshiring. Tashrifchilarning bir qismi blokerlardan foydalanadi, shu sababli Metrika va CRM o‘rtasidagi kichik farq normal holat.

## Maqsadlarni Yandex Direktda ishlatish

- Kampaniya sozlamalarida **hisoblagichni ulang**.
- **Kalit maqsadlarni** belgilang — Direkt aynan ular bo‘yicha ko‘rsatishlarni optimallashtiradi. Konversiyaga yo‘naltirilgan avtostrategiyalar uchun allaqachon konversiyalar yig‘ayotgan maqsad kerak.
- Arizalar ahamiyati turlicha bo‘lsa, **konversiya qiymatini** ko‘rsating.
- Maqsadlardan **retargeting** uchun foydalaning: savatgacha yetib, buyurtma bermaganlarga reklama ko‘rsatish.

## Ko‘p uchraydigan xatolar

- Maqsad muvaffaqiyatli yuborishga emas, «Yuborish» tugmasini bosishga qo‘yilgan — bo‘sh formalar va validatsiya xatolari ham hisoblanadi.
- Barcha formalar uchun bitta umumiy maqsad — qaysi forma ishlayotgani noma’lum.
- «Rahmat» sahifasi yangilanganda yoki xatcho‘pdan ochilganda qayta ishlaydi — konversiyalar takrorlanadi.
- Hisoblagich hamma sahifalarda o‘rnatilmagan yoki ikki marta o‘rnatilgan.
- Direktga ikki sahifani ko‘rish kabi «yumshoq» maqsadlar beriladi — algoritm maqsadsiz trafik keltirishni o‘rganadi.

## FAQ

### Nechta maqsad yaratish kerak?

Haqiqiy aloqa nuqtalaringiz qancha bo‘lsa, shuncha: har bir forma, telefon, har bir messenjer. Bunga voronka uchun bir-ikkita tarkibiy maqsad qo‘shing. «Har ehtimolga qarshi» yaratilgan o‘nlab maqsadlar hisobotlarni o‘qishni qiyinlashtiradi.

### Nega Metrikadagi maqsadlar CRMdagi arizalar bilan mos kelmaydi?

Odatda sabab blokerlar, rad etilgan cookie, takroriy yuborishlar va spamda. Tendensiyalarni solishtiring, aniq hisob uchun esa Metrikani CRM bilan uchdan-uchga analitika orqali bog‘lang.

### Oflayn sotuvlarni Metrikaga uzatish mumkinmi?

Ha, Metrika tashrifchiga identifikator orqali bog‘langan oflayn konversiyalarni yuklashni qo‘llab-quvvatlaydi. Shunda qaysi reklama nafaqat arizaga, balki to‘lovga ham olib kelganini ko‘rasiz.
