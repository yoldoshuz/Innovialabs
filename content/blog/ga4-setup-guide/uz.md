---
title: Saytga Google Analytics 4 ni qanday o‘rnatish va sozlash
description: Google Analytics 4 ni sozlash: resurs va oqim, gtag yoki GTM, kengaytirilgan o‘lchov, saqlash muddati, ichki trafik filtri va Google Ads bilan bog‘lash.
summary: GA4 resursi va veb-oqim yarating, tegni gtag.js yoki Google Tag Manager orqali o‘rnating, kengaytirilgan o‘lchovni tekshiring, ma’lumotlarni saqlash muddatini 14 oyga uzaytiring, ichki trafikni chiqarib tashlang va GA4 ni Google Ads bilan bog‘lang.
---
## Qisqa javob: sozlash tartibi

1. GA4 **akkaunti** va **resursini** yarating.
2. **Veb ma’lumotlar oqimini** qo‘shing va `G-XXXXXXXXXX` ko‘rinishidagi identifikatorni oling.
3. Tegni saytga **gtag.js** yoki **Google Tag Manager** orqali o‘rnating.
4. **Kengaytirilgan o‘lchovni** (enhanced measurement) tekshiring.
5. **Ma’lumotlarni saqlash muddatini** 14 oyga o‘rnating.
6. **Ichki trafik filtrini** sozlang.
7. GA4 ni **Google Ads** bilan bog‘lang.

## 1-qadam. Resurs va ma’lumotlar oqimi

«Administrator» bo‘limida «Yaratish» tugmasini bosing va ustani bosqichma-bosqich o‘ting:

- **Akkaunt** — odatda kompaniya uchun bitta.
- **Resurs** — mahsulot uchun bitta (bitta biznesning sayti va ilovasini bitta resursda yuritish mumkin). Bu yerda hisobotlarning **vaqt mintaqasi** va **valyutasi** belgilanadi — kunlar va daromad to‘g‘ri hisoblanishi uchun ularni darhol to‘g‘ri ko‘rsating.
- **Ma’lumotlar oqimi** — «Veb»ni tanlang, sayt manzili va nomini kiriting.

Oqim yaratilgach, **o‘lchov identifikatorini** `G-...` ko‘rasiz — u o‘rnatish uchun kerak.

## 2-qadam. O‘rnatish: gtag.js yoki GTM

**1-variant: gtag.js.** Kodni har bir sahifaning `<head>` qismiga qo‘ying:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**2-variant: Google Tag Manager.** **«Google tegi»**ni yarating, `G-...` identifikatorini kiriting va barcha sahifalar uchun trigger tanlang (Initialization — All Pages). Konteynerni e’lon qiling.

| | gtag.js | Google Tag Manager |
|---|---|---|
| Murakkablik | Bitta kod parchasi | Interfeysni o‘rganish kerak |
| Yangi hodisalar | Kodni o‘zgartirish orqali | Interfeys orqali, saytni reliz qilmasdan |
| Boshqa piksellar | Har biri kodda alohida | Hammasi bitta konteynerda |

Agar Meta Pixel, Yandex Metrika va konversiya hodisalarini qo‘shmoqchi bo‘lsangiz, uzoq muddatda **GTM qulayroq**.

O‘rnatishni tekshiring: saytni oching va «Real vaqt» hisobotini ko‘ring — tashrifingiz deyarli darhol paydo bo‘lishi kerak.

## 3-qadam. Kengaytirilgan o‘lchov

Veb-oqim sozlamalarida **kengaytirilgan o‘lchov** yoqilgan. U avtomatik ravishda quyidagilarni yig‘adi:

- sahifa ko‘rishlari, jumladan SPA’da brauzer tarixi orqali sahifa almashishi;
- sahifa oxirigacha aylantirish;
- tashqi havolalarga bosishlar;
- sayt bo‘yicha qidiruv;
- o‘rnatilgan YouTube videolari bilan muloqot;
- fayllarni yuklab olish;
- formalar bilan muloqot.

Shovqin beradiganini o‘chiring. Masalan, formalarni kuzatish istalgan formada, jumladan qidiruvda ham ishga tushishi mumkin — bunday holda muvaffaqiyatli yuborish uchun o‘z hodisangizni sozlash aniqroq.

## 4-qadam. Ma’lumotlarni saqlash muddati

Standart holatda GA4 hodisalar darajasidagi batafsil ma’lumotlarni **2 oy** saqlaydi. «Administrator → Ma’lumotlarni yig‘ish va o‘zgartirish → Ma’lumotlarni saqlash» bo‘limida **14 oy**ga o‘tkazing. Bu «Tadqiqotlar»ga (Explorations) ta’sir qiladi: bu sozlamasiz yilni yilga solishtira olmaysiz. Standart hisobotlar bu sozlamaga bog‘liq emas.

## 5-qadam. Ichki trafik filtri

Xodimlar va dasturchilarning tashriflari statistikani buzadi.

1. Veb-oqim sozlamalarida «Teg sozlamalari → Ichki trafikni aniqlash»ni oching va ofis **IP-manzili** bo‘yicha qoida qo‘shing.
2. «Administrator → Ma’lumotlar filtrlari»da **Internal Traffic** filtrini toping. U **«Sinov»** holatida yaratiladi.
3. Filtr kerakli trafikni belgilayotganini tekshiring va uni **«Faol»** holatiga o‘tkazing. Filtrlangan ma’lumotlar tiklanmaydi.

## 6-qadam. Google Ads bilan bog‘lash

«Administrator → Mahsulotlar bilan bog‘lanish → Google Ads bilan bog‘lanish»da reklama akkauntini tanlang. Shundan keyin:

- bosishlar to‘g‘ri atributsiya qilinishi uchun Google Ads’da **avtomatik belgilashni** (auto-tagging) yoqing;
- GA4 **asosiy hodisalarini** Google Ads’ga konversiya sifatida import qiling;
- remarketing uchun GA4 auditoriyalaridan foydalaning.

Agar sayt cookie’ga rozilik talablari bor mintaqalardagi foydalanuvchilarga xizmat qilsa, banner bilan birga **rozilik rejimini** (Consent Mode) sozlang.

## FAQ

### GA4 va Yandex Metrika’ni bir vaqtda o‘rnatish mumkinmi?

Ha, ular bir-biriga xalaqit bermaydi. Ikkala hisoblagichni Google Tag Manager orqali boshqarish eng qulay.

### Nega GA4 dagi raqamlar reklama kabinetidan farq qiladi?

Tizimlarda atributsiya modellari, konversiya oynalari va hisoblash usullari har xil. Bundan tashqari, foydalanuvchilarning bir qismi trekerlarni bloklaydi. Kichik farqlar normal, trendlarni solishtiring.

### Ma’lumotlar paydo bo‘lmasa nima qilish kerak?

Real vaqt hisobotini va Tag Assistant vositasini oching: teg yuklanayotganini, identifikator to‘g‘riligini va brauzeringizdagi reklama bloklovchisi o‘chirilganini tekshiring.
