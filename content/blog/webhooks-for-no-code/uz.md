---
title: Webhook nima va undan no-code vositalarda qanday foydalaniladi
description: Webhook sodda tilda: so‘rovdan (polling) farqi, uni Zapier, Make va n8n’da qabul qilish, payload tuzilishi, webhook manzilini test qilish va himoyalash.
summary: Webhook — bu siz xizmatdan muntazam «yangi narsa bormi?» deb so‘rash o‘rniga, xizmat hodisa yuz bergan zahoti ma’lumotni o‘zi yuboradigan manzil; no-code’da bu manzilni Zapier, Make yoki n8n’dan olib, manba xizmat sozlamalariga qo‘yasiz.
---
## Webhook sodda tilda

**Webhook** — biror narsa yuz berganda xizmat sizning manzilingizga yuboradigan HTTP so‘rov: ariza keldi, buyurtma to‘landi, bitim holati o‘zgardi.

Ikki yondashuvni solishtiring:

- **So‘rov (polling)** — siz har bir necha daqiqada xizmatdan so‘raysiz: «Yangi arizalar bormi?» Ko‘pincha javob «yo‘q», reaksiya esa kechikadi.
- **Webhook** — xizmatning o‘zi xabar beradi: «Mana yangi ariza». Reaksiya deyarli darhol, ortiqcha tekshiruvlar yo‘q.

| | Polling | Webhook |
|---|---|---|
| Kim boshlaydi | Sizning avtomatlashtirishingiz | Manba xizmat |
| Tezlik | Oraliq qadar kechikish | Deyarli darhol |
| Bo‘sh so‘rovlar | Ko‘p | Yo‘q |
| Nima kerak | API’ga kirish | Qabul qilish uchun ommaviy URL |

## Payload qanday tuzilgan

Webhook odatda JSON formatidagi tanali **POST so‘rov** sifatida keladi. Bu tana **payload** deyiladi:

```json
{
  "event": "form.submitted",
  "created_at": "2026-05-12T09:30:00Z",
  "data": {
    "name": "Alisher",
    "phone": "+998901234567",
    "source": "landing"
  }
}
```

Tanadan tashqari **sarlavhalar (headers)** ham muhim: ularda ko‘pincha hodisa turi, imzo yoki haqiqiylikni tekshirish uchun token uzatiladi. Muayyan xizmat payload’ining tuzilishini uning webhook hujjatlaridan qidiring.

## Webhook’ni Zapier, Make va n8n’da qabul qilish

**Zapier**

1. **Webhooks by Zapier** → *Catch Hook* triggeri bilan Zap yarating.
2. Berilgan URL’ni nusxalab, manba xizmat sozlamalariga qo‘ying.
3. Test hodisasini yuboring va *Test trigger* tugmasini bosing — Zapier qabul qilingan maydonlarni ko‘rsatadi.

Webhooks by Zapier hamma tariflarda mavjud emas.

**Make**

1. **Webhooks** → *Custom webhook* modulini qo‘shing va yangi webhook yarating.
2. Manzilni manba xizmatga nusxalang.
3. Test hodisasini yuboring — Make ma’lumotlar tuzilishini avtomatik aniqlaydi. Keyinroq maydonlar o‘zgarsa, *Redetermine data structure* dan foydalaning.

**n8n**

1. **Webhook** tugunini qo‘shing va metodni tanlang (odatda POST).
2. Tugunda ikkita manzil bor: **Test URL** siz *Listen for test event* ni bosgan paytda ishlaydi, **Production URL** esa workflow faollashtirilganda ishlaydi.
3. Keng tarqalgan xato — manba xizmatda test manzilini qoldirib ketish. Faollashtirgandan keyin uni production manziliga almashtiring.

## Qanday test qilish kerak

- **Xizmatdagi haqiqiy hodisadan boshlang:** qo‘lda tayyorlangan test ma’lumotlari tuzilishi bo‘yicha farq qilishi mumkin.
- Xizmat hali tayyor bo‘lmasa, so‘rovni o‘zingiz Postman yoki `curl` orqali yuboring:

```bash
curl -X POST "https://example.com/webhook/abc123" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"phone\":\"+998900000000\"}"
```

- **Chekka holatlarni** tekshiring: bo‘sh maydonlar, uzun matn, lotin bo‘lmagan belgilar.
- Xizmat xatoda o‘zini qanday tutishini ko‘ring: ko‘pchiligi muvaffaqiyatli javob olmasa, webhook’ni **qayta yuboradi**. Demak, bitta hodisa ikki marta kelishi mumkin — dublikatlarni tekshirishni ko‘zda tuting.

## Webhook manzilini qanday himoyalash kerak

Webhook URL’i amalda ochiq eshik: manzilni bilgan har kim unga ma’lumot yubora oladi.

- **Manzilni oshkor qilmang:** frontend kodida, skrinshotlarda va ochiq hujjatlarda.
- **Maxfiy kalitni tekshiring.** Ko‘p xizmatlar sarlavhada keladigan token belgilashga imkon beradi. n8n’dagi Webhook tugunida ichki autentifikatsiya bor (Header, Basic, JWT); Zapier va Make’da tekshiruvni sarlavha yoki maydon bo‘yicha filtr bilan qilish mumkin.
- **Imzoni (HMAC) tekshiring**, agar xizmat uni yuborsa: shunda so‘rov aynan undan kelgani va o‘zgartirilmagani tasdiqlanadi.
- **Keraksiz so‘rovlarni filtrlang:** majburiy maydonlarsiz so‘rovlarni tashlab yuboring.
- **Manzilni almashtiring**, agar u oshkor bo‘lib qolsa, va manba xizmatda yangilang.

## FAQ

### Webhook qabul qilish uchun server kerakmi?

Yo‘q. Zapier, Make va bulutli n8n tayyor ommaviy manzil beradi. O‘z serveringiz faqat n8n yoki o‘z ishlovchingizni mustaqil o‘rnatsangiz kerak.

### Nega webhook ishlamayapti?

Ko‘pincha manba xizmatda noto‘g‘ri yoki test manzili ko‘rsatilgan, ssenariy yoqilmagan yoki xizmat tez muvaffaqiyatli javob kutadi va yetkazishni muvaffaqiyatsiz deb hisoblaydi. Manba xizmatdagi yetkazish jurnalini tekshiring — ko‘pchilik uni yuritadi.

### No-code vositadan webhook yuborish mumkinmi?

Ha. Uchala platforma ham HTTP so‘rov yubora oladi: Zapier’da bu Webhooks by Zapier amali, Make’da HTTP moduli, n8n’da HTTP Request tuguni.
