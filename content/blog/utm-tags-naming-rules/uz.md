---
title: UTM-teglarni qanday tuzish: nomlash qoidalari va tayyor shablon
description: UTM-teglarni nomlash qoidalari, tayyor shablon, Google Ads, Meta va Yandex Direkt uchun dinamik parametrlar hamda hisobotlarni bo‘lib yuboradigan xatolar.
summary: UTM-teglarni faqat kichik lotin harflarida, bo‘sh joysiz, source va medium uchun bitta tasdiqlangan qiymatlar ro‘yxati asosida yozing, reklama kabinetlarida esa dinamik parametrlardan foydalaning. Shunda har bir kanal hisobotda o‘nta variant emas, bitta qator bo‘lib ko‘rinadi.
---
## Qisqa javob

**UTM-teglar** — havoladagi parametrlar bo‘lib, ular orqali analitika tashrifchi qayerdan kelganini aniqlaydi. Ular beshta:

| Parametr | Ma’nosi | Misol |
|---|---|---|
| `utm_source` | Platforma | `google`, `facebook`, `yandex`, `telegram` |
| `utm_medium` | Trafik turi | `cpc`, `paid_social`, `email`, `referral` |
| `utm_campaign` | Kampaniya | `brand_search_2026_10` |
| `utm_content` | E’lon yoki kreativ | `video_15s_a` |
| `utm_term` | Kalit so‘z yoki auditoriya | `crm_biznes_uchun` |

Birinchi uchtasi majburiy. Eng muhimi teglarning o‘zi emas, balki **yagona lug‘at**: bir xil kanal har doim bir xil nomlanadi.

## Nomlash qoidalari

1. **Faqat kichik harflar.** Analitika registrni farqlaydi: `Facebook` va `facebook` ikki xil manbaga aylanadi.
2. **Lotin harflari, raqamlar, `_` yoki `-`.** Bo‘sh joy, kirill harflari va maxsus belgilarsiz — ular `%D0%...` ko‘rinishida kodlanadi va o‘qib bo‘lmaydi.
3. **Butun kompaniya uchun bitta ajratuvchi.** `_` yoki `-` ni tanlang va aralashtirmang.
4. **source va medium uchun qat’iy ro‘yxat.** Yangi qiymatlarni faqat analitika uchun mas’ul xodim qo‘shadi.
5. **campaign nomini bloklardan tuzing**: `mahsulot_maqsad_geo_sana`, masalan `crm_leads_tashkent_2026_10`.
6. **Ma’lumotni takrorlamang.** Agar manba `google` bo‘lsa, campaign nomida «google» so‘zi kerak emas.
7. **GA4 taniydigan standart medium qiymatlaridan foydalaning**: pullik qidiruv uchun `cpc`, `email`, `referral`, `social` yoki pullik ijtimoiy tarmoqlar uchun `paid` qatnashgan qiymatlar. Shunda trafik to‘g‘ri kanal guruhiga tushadi. Guruhlashning aniq qoidalarini Google Analytics hujjatlaridan tekshiring.

## Tayyor shablon

Bitta umumiy jadval yuriting (Google Sheets yetarli), ustunlari:

| Sana | Kanal | source | medium | campaign | content | term | Asosiy URL | Yakuniy havola | Muallif |
|---|---|---|---|---|---|---|---|---|---|

Yakuniy havolani (I ustun) qo‘lda emas, formula bilan yig‘ing:

```text
=H2&"?utm_source="&C2&"&utm_medium="&D2&"&utm_campaign="&E2&"&utm_content="&F2&"&utm_term="&G2
```

Agar asosiy URLda allaqachon `?` bo‘lsa, formuladagi birinchi `?` ni `&` ga almashtiring.

Alohida varaqda ruxsat etilgan qiymatlar **lug‘atini** saqlang va source hamda medium ustunlariga ochiladigan ro‘yxatli ma’lumot tekshiruvini ulang — shunda xato yozish imkonsiz bo‘ladi.

**Teg konstruktorlari** ham mos keladi: Googlening Campaign URL Builder vositasi va Yandexning shunga o‘xshash konstruktori. Ammo ular bilan ishlaganda ham qiymatlar lug‘atingizdan olinadi.

## Reklama kabinetlaridagi dinamik parametrlar

Har bir e’lonni qo‘lda belgilash o‘rniga kabinetlar qiymatlarni o‘zi qo‘yadi.

**Google Ads.** **Avtobelgilashni** (gclid) yoqing — u Google Ads va GA4 ni bog‘laydi. Kuzatish shablonida qo‘shimcha ravishda ValueTrack parametrlaridan foydalanish mumkin:

```text
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

**Meta Ads.** E’londagi URL parametrlari maydonida:

```text
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

Agar nomlar dinamik qo‘yilsa, kabinetdagi kampaniyalarni ham shu qoidalar bo‘yicha nomlang: lotin, kichik harflar, bo‘sh joysiz.

**Yandex Direkt.** Metrika ulanganda yclid parametri avtomatik qo‘shiladi. UTM uchun Direkt parametrlaridan foydalaning:

```text
utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}
```

Har bir kabinetning amaldagi parametrlar ro‘yxatini uning yordam bo‘limidan ko‘ring — to‘plam vaqt o‘tishi bilan kengayadi.

## Ma’lumotlarni bo‘lib yuboradigan xatolar

- **Turlicha registr va yozilish**: `fb`, `facebook`, `Facebook.com` — bitta o‘rniga uchta manba.
- **Saytning ichki havolalarida UTM**: sayt ichidagi bannerni bosish asl manbani qayta yozadi va reklama tashrifi «ichki» tashrifga aylanadi.
- **Parametrlarni kesib tashlaydigan redirektlar**: o‘tishdan keyin teglar manzil satrida qolganini tekshiring.
- Dinamik qo‘yilgan kampaniya nomlarida **bo‘sh joylar va kirill harflari**.
- **Organik postlarni tizimsiz belgilash**: bir jamoa `instagram`, boshqasi `ig` deb yozadi.
- **Jadvalda yozuv yo‘q**: uch oydan keyin `test2_new` nimani anglatishini hech kim eslamaydi.

## FAQ

### Google Ads avtobelgilash yoqilgan bo‘lsa, UTM kerakmi?

Google Ads va GA4 bog‘lanishi uchun odatda avtobelgilash yetarli. UTM esa trafikni gclid ni o‘qiy olmaydigan boshqa tizimlarda — Yandex Metrika, CRM, uchdan-uchga analitikada — tahlil qilsangiz foydali bo‘ladi.

### Telegram va email-xabarnomalardagi havolalarni qanday belgilash kerak?

Xuddi shunday, lug‘at bo‘yicha: masalan, kanal postlari uchun `utm_source=telegram&utm_medium=social`, xabarnoma uchun `utm_source=newsletter&utm_medium=email`. Asosiysi — butun loyiha uchun bitta variant.

### UTM-teglar SEOga ta’sir qiladimi?

O‘z-o‘zidan yo‘q, lekin teglangan havolalarni ichki bog‘lanishlarda va sayt xaritasida ishlatmang. Parametrlar bilan ochiladigan sahifalar uchun teglarsiz kanonik manzilni ko‘rsating.
