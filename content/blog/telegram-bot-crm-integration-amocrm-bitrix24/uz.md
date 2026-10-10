---
title: Telegram-botni amoCRM yoki Bitrix24 ga ulash
description: Telegram-botni amoCRM yoki Bitrix24 bilan bog‘lashning ikki yo‘li: tayyor konnektorlar va API. Maydonlarni moslash, manbani uzatish va dublikatlardan qochish.
summary: Menejer mijoz bilan to‘g‘ridan-to‘g‘ri CRM ichidan yozishishi kerak bo‘lsa, botni amoCRM’dagi Telegram kanali yoki Bitrix24 ochiq liniyalari orqali ulang; bot ssenariysidan tuzilgan arizalar kerak bo‘lsa, ularni API orqali yuboring, oldin kontaktni telefon yoki Telegram ID bo‘yicha qidiring.
---
## Qisqa javob

Ikki yo‘l bor va ular turli vazifalarni hal qiladi:

- **Tayyor konnektor.** amoCRM’da bot chat kanali sifatida, Bitrix24’da esa **ochiq liniyalar** orqali ulanadi. Mijoz xabarlari CRM’ga tushadi, menejer to‘g‘ridan-to‘g‘ri kartochkadan javob beradi. Bot asosan aloqa kanali bo‘lganda mos.
- **API orqali integratsiya.** Botingiz mijozni ssenariy bo‘yicha olib boradi, javoblarni yig‘adi va kerakli maydonlar bilan kontakt hamda bitim yoki lidni o‘zi yaratadi. Bot arizalarni saralaganda mos.

Ko‘pincha ular birlashtiriladi: bot ssenariysi API orqali bitim yaratadi, keyingi yozishma esa konnektor orqali boradi.

## Yondashuvlarni solishtirish

| | Konnektor | API |
|---|---|---|
| Ishga tushirish | CRM interfeysida sozlash | Kod va server kerak |
| CRM ichida yozishma | Ha, tayyor holda | Faqat alohida qilinsa |
| O‘z maydonlari va mantiq | Minimal | To‘liq nazorat |
| Ssenariyli bot | Cheklangan | Ha |
| Dublikatlar nazorati | CRM qoidalari bilan | Sizning mantiqingiz bilan |

Muhim: odatda bitta botga bir vaqtda ham konnektorni, ham o‘z yangilanishlar ishlovchingizni ulab bo‘lmaydi. Telegram yangilanishlarni faqat bitta qabul qiluvchiga beradi — webhook yoki long polling. Ham ssenariy, ham CRM’da yozishma kerak bo‘lsa, arxitekturani oldindan rejalashtiring: masalan, serveringiz barcha yangilanishlarni qabul qiladi va xabarlarni CRM’ning chatlar uchun API’si orqali o‘zi uzatadi.

## Arizani API orqali uzatish

**amoCRM.** REST API v4 ishlatiladi. Ariza uchun `POST /api/v4/leads/complex` metodi qulay: bitta so‘rov bilan kontakt va teglar bilan bitim yaratiladi. Avtorizatsiya — OAuth integratsiyasi yoki uzoq muddatli token orqali.

```json
[
  {
    "name": "Telegram’dan ariza",
    "_embedded": {
      "contacts": [
        {
          "first_name": "Aziz",
          "custom_fields_values": [
            {
              "field_code": "PHONE",
              "values": [{ "value": "+998901234567", "enum_code": "WORK" }]
            }
          ]
        }
      ],
      "tags": [{ "name": "telegram" }]
    }
  }
]
```

**Bitrix24.** Eng oddiy boshlanish — CRM huquqlariga ega **kiruvchi webhook**. Lid `crm.lead.add` metodi bilan, kontaktli bitim esa `crm.contact.add` va `crm.deal.add` orqali yaratiladi. Mavjud mijozlarni topish uchun telefon yoki email bo‘yicha qidiradigan `crm.duplicate.findbycomm` bor.

## Maydonlarni moslash

Koddan oldin jadval tuzing: bot nimani so‘raydi va u CRM’da qayerga tushadi.

- **Ism** — faqat Telegram profilidan emas, foydalanuvchi javobidan: profilda ko‘pincha taxallus bo‘ladi.
- **Telefon** — «Kontaktni ulashish» tugmasi orqali, yagona `+998...` formatida.
- **Telegram ID va username** — kontaktning alohida maxsus maydonlariga. ID orqali keyinchalik telefon ko‘rsatilmagan bo‘lsa ham mijozni topish mumkin.
- **Savollarga javoblar** — izohga bitta matn sifatida emas, bitim maydonlariga (byudjet, xizmat, muddat). Aks holda ular bo‘yicha filtrlab bo‘lmaydi.
- **Manba va UTM** — deep link’ning `start` parametridan (`t.me/bot?start=ads_spring`). Uni birinchi kirishda saqlang va bitimga uzating.
- **Voronka va bosqich** — botdan kelgan arizalarni alohida bosqich yoki voronkaga qo‘ying, menejer ularni darhol ko‘rsin.

amoCRM’dagi maxsus maydonlar ID’lari va Bitrix24’dagi maydon kodlari har bir akkauntda har xil. Ularni kodda emas, konfiguratsiyada saqlang.

## Dublikatlarni qanday ko‘paytirmaslik

1. **Yaratishdan oldin kontaktni qidiring**: avval bazangizdan Telegram ID bo‘yicha, keyin CRM’dan telefon bo‘yicha.
2. **Topilsa, bog‘lang**: yangi bitimni mavjud kontaktga biriktiring. Mijozda allaqachon ochiq bitim bo‘lsa, yangisini yaratishdan ko‘ra unga izoh yoki vazifa qo‘shgan yaxshiroq.
3. **Bog‘lanishni o‘zingizda saqlang**: `telegram_id → contact_id, deal_id`. Bu har safar CRM’dan qidirishdan tezroq.
4. **Yuborishni idempotent qiling**: «Yuborish»ni qayta bosish yoki timeout’dan keyin so‘rovni takrorlash ikkinchi bitimni yaratmasligi kerak. Bunda bazangizdagi ariza holati yordam beradi.
5. **Telefonlarni normallashtiring**: CRM uchun `90 123 45 67` va `+998901234567` — turli satrlar.

## Ishonchlilik

- Ma’lumotlarni CRM’ga navbat orqali yuboring: API ishlamasa yoki so‘rovlar limitiga urilsangiz, ariza yo‘qolmaydi va keyinroq ketadi.
- CRM javoblarini yaratilgan obyektlar ID’lari bilan birga log’ga yozing.
- Integratsiya ishdan chiqqan holat uchun muhim arizalarni menejerlarning ishchi chatiga ham yuboring.
- Tokenlarni oldindan yangilang: amoCRM OAuth tokenlarining amal qilish muddati cheklangan.

## FAQ

### Bot allaqachon o‘z serverimda ishlayotgan bo‘lsa, nimani tanlash kerak?

Katta ehtimol bilan API’ni. CRM konnektori odatda bot yangilanishlarini o‘ziga oladi va sizning mantiqingiz ularni olmay qo‘yadi. API orqali ssenariyni saqlab qolasiz va CRM’ga faqat natijani uzatasiz.

### Bitrix24’da liddan emas, darhol bitim yaratish mumkinmi?

Mumkin. Portalda lidlar o‘chirilgan bo‘lsa yoki soddalashtirilgan sxemada ishlasangiz, kontakt va bitim yarating. Tanlov kompaniyada kiruvchi arizalar bilan ishlash qanday tashkil etilganiga bog‘liq.

### CRM’ga kirish kalitlarini qayerda saqlash kerak?

Serverdagi muhit o‘zgaruvchilarida yoki maxfiy ma’lumotlar omborida. Bitrix24 kiruvchi webhook’i CRM ma’lumotlariga kirish huquqini beradi, shuning uchun uni frontend kodida yoki ochiq repozitoriyda joylashtirib bo‘lmaydi.
