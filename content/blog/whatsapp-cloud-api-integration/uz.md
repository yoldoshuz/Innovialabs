---
title: WhatsApp Cloud API’ni ulash: xabar shablonlari va webhook’lar
description: WhatsApp Cloud API’ni ulash: Meta ilovasi, raqamni tasdiqlash, shablonlar va moderatsiya, 24 soatlik oyna, webhook’lar va to‘lov mantiqi.
summary: Meta’da ilova yarating, raqamni ulab tasdiqlang, doimiy token oling, shablonlarni kelishing va webhook’ni ishga tushiring; mijozga birinchi bo‘lib faqat shablon bilan yoziladi, erkin xabarlar esa uning xabaridan keyin 24 soat davomida mumkin.
---
## Qisqa javob

WhatsApp Cloud API — Meta’ning o‘z serverlarida joylashgan rasmiy API’si: o‘zingizning WhatsApp serveringizni ko‘tarish shart emas. Ulash olti qadamdan iborat:

1. Meta for Developers’da WhatsApp mahsuloti bilan ilova;
2. o‘z raqamingizni tasdiqlash;
3. tizim foydalanuvchisining doimiy tokeni;
4. xabar shablonlari va ularning moderatsiyasi;
5. kiruvchi xabarlar va statuslar uchun webhook;
6. 24 soatlik oyna va tariflashni tushunish.

## 1-qadam. Meta’dagi ilova

- Meta for Developers’da ro‘yxatdan o‘ting va biznes turidagi ilova yarating.
- **WhatsApp** mahsulotini qo‘shing va kompaniyaning biznes portfeliga (avvalgi Business Manager) bog‘lang.
- API sozlash bo‘limida **test raqami** va vaqtinchalik token paydo bo‘ladi. Telefoningizni qabul qiluvchilar ro‘yxatiga qo‘shing va birinchi test xabarini yuboring.

Vaqtinchalik token uzoq yashamaydi. Production uchun biznes sozlamalarida **tizim foydalanuvchisini** yarating, unga ilova va WhatsApp akkauntiga kirish huquqini bering hamda `whatsapp_business_messaging` va `whatsapp_business_management` ruxsatlari bilan doimiy token yarating. Tokenni faqat serverda saqlang.

## 2-qadam. O‘z raqamingiz

- Raqam tasdiqlash kodi bilan SMS yoki qo‘ng‘iroqni qabul qila olishi kerak.
- WhatsApp ilovasida ishlayotgan raqamni odatda avval bo‘shatish kerak bo‘ladi. Ulashning dolzarb variantlarini hujjatlarda tekshiring.
- **Ko‘rsatiladigan nom** tekshiruvdan o‘tadi va brendga mos bo‘lishi kerak.
- **Biznes verifikatsiyasi** birinchi bo‘lib yozish mumkin bo‘lgan mijozlar soni bo‘yicha limitlarni oshiradi.

**Phone Number ID** va **WABA ID** ni yozib qo‘ying — ular barcha so‘rovlarda kerak.

## 3-qadam. Xabar shablonlari

Shablon — kompaniya birinchi bo‘lib yozishi mumkin bo‘lgan oldindan kelishilgan matn. Kategoriyalar:

| Kategoriya | Nima uchun |
|---|---|
| Marketing | aksiyalar, yangiliklar, tashlab ketilgan savat haqida eslatmalar |
| Utility | buyurtma holati, yozilish, hisob, shartlar o‘zgarishi |
| Authentication | kirish uchun bir martalik kodlar |

Shablon sarlavha (matn yoki media), `{{1}}`, `{{2}}` o‘zgaruvchilari bor asosiy matn, pastki yozuv va tugmalardan iborat. Har bir til — shablonning alohida versiyasi. Moderatsiya odatda tez o‘tadi, statuslar: tasdiqlangan, rad etilgan, to‘xtatilgan.

Rad etilishning ko‘p uchraydigan sabablari: Utility kategoriyasidagi marketing matni, matnning eng boshida yoki oxirida turgan o‘zgaruvchi, o‘zgaruvchilar uchun namuna qiymatlar yo‘qligi, mazmunning noaniqligi.

Tasdiqlangan shablonni yuborish:

```bash
curl -X POST "https://graph.facebook.com/<API_VERSION>/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer $WA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "998901234567",
    "type": "template",
    "template": {
      "name": "order_ready",
      "language": { "code": "uz" },
      "components": [
        { "type": "body", "parameters": [ { "type": "text", "text": "1024" } ] }
      ]
    }
  }'
```

## 4-qadam. 24 soatlik oyna

Mijoz sizga yozganda **24 soatlik xizmat ko‘rsatish oynasi** ochiladi. Uning ichida istalgan xabarni yuborish mumkin: matn, media, tugmalar, ro‘yxatlar. Mijozning har bir yangi xabari oynani uzaytiradi. Oynadan tashqarida faqat tasdiqlangan shablonlar mavjud.

Amalda bu shuni anglatadi: tez javob bering, oynadan tashqaridagi eslatma va bildirishnomalarni esa oldindan shablon sifatida rasmiylashtiring.

## 5-qadam. Webhook’lar

Webhook — serveringizdagi HTTPS-manzil, Meta unga kiruvchi xabarlar va yetkazish statuslarini yuboradi. Avval Meta manzilni GET-so‘rov bilan tekshiradi:

```js
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});
```

Keyin hodisalar POST-so‘rovlar bilan keladi. Webhook sozlamalarida `messages` maydoniga obuna bo‘ling. Muhim jihatlar:

- **X-Hub-Signature-256** sarlavhasini tekshiring — bu so‘rov tanasining ilova siri bilan HMAC-SHA256 qiymati;
- darhol `200` bilan javob bering, qayta ishlashni esa navbatga chiqaring;
- hodisalarni xabar ID’si bo‘yicha **takrorlanishdan tozalang**: nosozliklarda Meta ularni qayta yuboradi;
- `sent`, `delivered`, `read` va `failed` statuslarini kuzating — `failed` ichida xato kodi bo‘ladi.

## 6-qadam. Tariflash qanday ishlaydi

Avval Meta to‘lovni kategoriyalar bo‘yicha **24 soatlik dialoglar** uchun hisoblardi. 2025-yil o‘rtasidan model o‘zgardi: **yetkazilgan shablon xabarlari** uchun to‘lanadi, narx esa shablon kategoriyasi va qabul qiluvchi mamlakatiga bog‘liq. Xizmat ko‘rsatish oynasi ichidagi javoblar, shuningdek ochiq oyna ichida yuborilgan utility-shablonlar bepul. Meta qoidalarni vaqti-vaqti bilan yangilaydi, shuning uchun byudjetni hisoblashdan oldin rasmiy narxlar sahifasini tekshiring.

Xarajatlar nimaga bog‘liq: marketing shablonlarining ulushi, mijozlaringiz mamlakatlari, xabar yuborish chastotasi va oyna ichida javob berishga ulgurishingiz. Batafsil — [Cloud API hujjatlarida](https://developers.facebook.com/docs/whatsapp/cloud-api).

## FAQ

### Mijozga birinchi bo‘lib yozish mumkinmi?

Ha, lekin faqat tasdiqlangan shablon bilan va faqat sizdan WhatsApp’da xabar olishga rozilik bergan odamga.

### Vositachi (BSP) kerakmi?

Yo‘q, Cloud API to‘g‘ridan-to‘g‘ri mavjud. Operatorlar uchun tayyor interfeys, bot konstruktori yoki qo‘llab-quvvatlash kerak bo‘lsa provayderlar foydali, ammo bu majburiy emas.

### Nega xabar yetkazilmadi?

Webhook’dagi `failed` statusi va xato kodiga qarang. Ko‘p uchraydigan sabablar: 24 soatlik oynadan tashqarida oddiy matn yuborishga urinish, to‘xtatilgan shablon, WhatsApp’siz raqam yoki limitdan oshish.
