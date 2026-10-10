---
title: GA4’ni BigQuery’ga eksport qilish: xom marketing ma’lumotlari tahlili
description: GA4’ni BigQuery bilan bog‘lash, hodisalar jadvali tuzilishi, sessiyalar, manbalar va voronkalar uchun SQL misollar hamda so‘rovlar narxini nazorat qilish.
summary: GA4’ning BigQuery’ga eksporti saytdagi har bir hodisani alohida qator sifatida, semplirovka va interfeys chegaralarisiz yozadi. Bog‘lash GA4 admin panelida bir necha daqiqada qilinadi, asosiy ko‘nikmalar esa hodisa parametrlari uchun UNNEST va so‘rovlar arzon bo‘lishi uchun jadval sanalarini filtrlash.
---

## GA4’ni BigQuery’ga nega eksport qilish kerak

GA4 interfeysi cheklovli agregatsiyalangan hisobotlarni ko‘rsatadi: ma’lumot chegaralari, kardinallik limitlari, noqulay tadqiqotlar. **BigQuery’ga eksport** esa xom hodisalarni beradi — har bir hodisa barcha parametrlari bilan alohida qatorda. Bu quyidagilar uchun kerak:

- o‘z voronkalaringiz va atributsiyangizni qurish;
- sayt ma’lumotlarini CRM, reklama xarajatlari va oflayn sotuvlar bilan birlashtirish;
- tarixni GA4’dagi saqlash muddatidan uzoqroq saqlash;
- Looker Studio yoki BI dashbordlarini API limitlarisiz qurish.

## GA4’ni BigQuery bilan qanday bog‘lash

1. **Google Cloud**’da loyiha yarating va BigQuery API’ni yoqing. Boshlash uchun karta ulamasdan BigQuery sandbox’dan foydalanish mumkin, lekin undagi jadvallar avtomatik o‘chiriladi va potokli eksport mavjud emas.
2. GA4’da **Administrator → Mahsulot bog‘lanishlari → BigQuery bog‘lanishlari** bo‘limini oching va bog‘lanish yarating. GA4’da muharrir, GCP loyihasida esa egasi huquqlari kerak.
3. **Ma’lumotlar saqlanadigan hududni** tanlang — keyin uni o‘zgartirib bo‘lmaydi.
4. Eksport turini tanlang:
   - **Kunlik** — kuniga bir marta `events_YYYYMMDD` jadvali.
   - **Potokli** — kun davomida `events_intraday_YYYYMMDD`, pullik.
5. Kerak bo‘lsa, hajmni kamaytirish uchun ortiqcha hodisalarni chiqarib tashlang.

Ma’lumotlar ertasi kundan paydo bo‘ladi, bog‘lanishdan oldingi tarix eksportda bo‘lmaydi. Shuning uchun tahlilni keyinroq qilsangiz ham, eksportni imkon qadar erta ulang.

## Hodisalar jadvali sxemasi

Bitta qator — bitta hodisa. Asosiy maydonlar:

| Maydon | Ichida nima bor |
|---|---|
| `event_date`, `event_timestamp` | sana va mikrosekundlardagi vaqt |
| `event_name` | `page_view`, `purchase` va h.k. |
| `event_params` | takrorlanuvchi kalit–qiymat massivi |
| `user_pseudo_id` | qurilma/brauzer identifikatori |
| `user_id` | agar yuborsangiz, sizning foydalanuvchi ID’ingiz |
| `traffic_source` | foydalanuvchining **birinchi** tashrifi manbai |
| `collected_traffic_source` | shu hodisada ushlangan UTM va click ID |
| `device`, `geo` | qurilma va geografiya |
| `ecommerce`, `items` | elektron savdo ma’lumotlari |

Asosiy xususiyat — `event_params`. Parametr qiymati `value.string_value`, `value.int_value` yoki `value.double_value` maydonlaridan birida turadi va unga faqat `UNNEST` orqali yetish mumkin.

## Misol: kunlar bo‘yicha sessiyalar

Eksportda sessiya — bu `user_pseudo_id` va `ga_session_id` parametri juftligi.

```sql
SELECT
  event_date,
  COUNT(DISTINCT CONCAT(user_pseudo_id, CAST(
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id')
  AS STRING))) AS sessions
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261007'
GROUP BY event_date
ORDER BY event_date;
```

## Misol: manbalar bo‘yicha sessiyalar

Yangi eksportlarda oxirgi klik bo‘yicha sessiya manbai bilan `session_traffic_source_last_click` maydoni bor. Eski ma’lumotlar uchun sessiya manbai sessiyaning birinchi hodisasidagi `collected_traffic_source` dan tiklanadi.

```sql
SELECT
  session_traffic_source_last_click.manual_campaign.source AS source,
  session_traffic_source_last_click.manual_campaign.medium AS medium,
  COUNT(DISTINCT CONCAT(user_pseudo_id, CAST(
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id')
  AS STRING))) AS sessions
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261007'
GROUP BY source, medium
ORDER BY sessions DESC;
```

## Misol: xarid voronkasi

Oddiy «ochiq» voronka — davr ichida har bir qadamni nechta foydalanuvchi bajargani:

```sql
SELECT
  COUNT(DISTINCT IF(event_name = 'view_item', user_pseudo_id, NULL)) AS view_item,
  COUNT(DISTINCT IF(event_name = 'add_to_cart', user_pseudo_id, NULL)) AS add_to_cart,
  COUNT(DISTINCT IF(event_name = 'begin_checkout', user_pseudo_id, NULL)) AS begin_checkout,
  COUNT(DISTINCT IF(event_name = 'purchase', user_pseudo_id, NULL)) AS purchase
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261031';
```

Agar qadamlar tartibi muhim bo‘lsa, foydalanuvchi yoki sessiya ichida har bir qadamning `event_timestamp` ini solishtiring.

## Narxni qanday nazorat qilish

On-demand modelida BigQuery natijadagi qatorlar soni uchun emas, **skanerlangan ma’lumotlar hajmi** uchun haq oladi. Qoidalar:

- **Har doim `_TABLE_SUFFIX` ni filtrlang** — usiz so‘rov butun tarixni o‘qiydi.
- **`SELECT *` yozmang**: BigQuery ustunli, faqat tanlangan ustunlar uchun to‘laysiz.
- Ishga tushirishdan oldin muharrirdagi hajm bahosini ko‘ring.
- So‘rovlar uchun **maksimal to‘lanadigan bayt limitini** va Cloud Billing’da ogohlantirishli byudjet o‘rnating.
- Dashbordlar uchun BI’ni xom hodisalarga yo‘naltirmasdan, jadval bo‘yicha yangilanadigan **agregatsiyalangan jadvallar** yarating.

## Raqamlar nega GA4 interfeysidan farq qiladi

Farqlar normal holat: interfeysda ma’lumot chegaralari, modellashtirish va noyob qiymatlarni taxminiy hisoblash qo‘llaniladi, eksportda esa ular yo‘q. Eksportda Consent Mode’ning modellashtirilgan ma’lumotlari ham bo‘lmaydi. Aniq qiymatlarni emas, trendlarni solishtiring.

## FAQ

### GA4’ni BigQuery’ga eksport qilish qancha turadi?

Standart resurslar uchun kunlik eksportning o‘zi bepul, potokli eksport esa pullik. Siz Google Cloud’ga saqlash va so‘rovlar uchun to‘laysiz. Yakuniy summa hodisalar hajmi, saqlash muddati va so‘rovlar qanchalik puxta yozilganiga bog‘liq.

### O‘tgan oylar ma’lumotlarini eksport qilsa bo‘ladimi?

Yo‘q. Eksport bog‘lanish yaratilgan paytdan boshlanadi. O‘tmish ma’lumotlarini faqat qisman, agregatsiyalangan ko‘rinishda GA4 Data API orqali olish mumkin.

### Buning uchun dasturchi kerakmi?

Bog‘lash uchun — yo‘q. Tahlil uchun asosiy SQL va sxemani, ayniqsa `UNNEST` bilan ishlashni tushunish kerak. Murakkab atributsiya va CRM bilan birlashtirishni ma’lumotlar tahlilchisiga topshirgan ma’qul.
