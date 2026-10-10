---
title: Postman va Newman’da API avtomatik testlari
description: Postman’da test skriptlari, pre-request skriptlar bilan so‘rovlarni bog‘lash, kolleksiyani Collection Runner va Newman’da ishga tushirish va CI’ga qo‘shish.
summary: Postman’da har bir so‘rovga pm.test orqali JavaScript tekshiruvlarini qo‘shish, ma’lumotlarni so‘rovlar orasida o‘zgaruvchilar orqali uzatish va butun kolleksiyani Newman yordamida buyruq satridan, jumladan har bir commit’da CI’da ishga tushirish mumkin.
---
## Bu qanday ishlaydi

Postman’dagi avtotest — bu oddiy so‘rov va javobni tekshiradigan skript. So‘rovda kod uchun ikki joy bor:

- **Pre-request** — yuborishdan oldin bajariladi: ma’lumot tayyorlash, token olish, noyob email yaratish.
- **Post-response** (eski versiyalarda **Tests** vkladkasi deb atalgan) — javobdan keyin bajariladi: status, maydonlar, vaqtni tekshirish, keyingi so‘rovlar uchun qiymatlarni saqlash.

Skriptlarni papka yoki kolleksiya darajasida ham yozish mumkin — shunda ular ichidagi har bir so‘rov uchun bajariladi.

Butun kolleksiyani ketma-ket ishga tushirishni interfeysda **Collection Runner** yoki buyruq satridan **Newman** bajaradi.

## Tekshiruvlarni yozamiz

```javascript
pm.test("Status 200", () => {
  pm.response.to.have.status(200);
});

pm.test("Javobda foydalanuvchi id bor", () => {
  const body = pm.response.json();
  pm.expect(body.id).to.be.a("number");
  pm.expect(body.email).to.include("@");
});

pm.test("Javob bir soniyadan tez", () => {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

`pm.test` tekshiruv nomini beradi, `pm.expect` esa Chai kutubxonasi sintaksisidan foydalanadi. Birinchi navbatda nimani tekshirish kerak:

- **Status kodi** — muvaffaqiyatli va xatoli stsenariylar uchun.
- **Javob tuzilmasi** — majburiy maydonlar va ularning turlari.
- **Biznes qoidalari** — masalan, buyurtma summasi pozitsiyalar summasiga teng.
- **Salbiy holatlar** — tokensiz so‘rov 200 emas, 401 qaytarishi kerak.

## So‘rovlarni bog‘laymiz

Odatiy zanjir: kirish → resurs yaratish → uni o‘qish → o‘chirish.

**Login** so‘rovidan keyin tokenni saqlang:

```javascript
const { token } = pm.response.json();
pm.collectionVariables.set("token", token);
```

**Create order** dan keyin yaratilgan buyurtma id’sini saqlang:

```javascript
pm.collectionVariables.set("orderId", pm.response.json().id);
```

Keyingi so‘rov uni manzilda ishlatadi: `{{baseUrl}}/orders/{{orderId}}`.

**Pre-request** skriptida testlar ishga tushirishlar orasida to‘qnashmasligi uchun noyob ma’lumotlarni tayyorlash qulay:

```javascript
pm.variables.set("email", `qa+${Date.now()}@example.com`);
```

Agar token har qanday so‘rovdan oldin kerak bo‘lsa, uni kolleksiyaning pre-request skriptida `pm.sendRequest` orqali olish mumkin.

## Collection Runner

Postman interfeysida kolleksiyani oching va **Run** ni bosing. Quyidagilarni qilish mumkin:

- muhit va so‘rovlar tartibini tanlash;
- iteratsiyalar sonini belgilash;
- **ma’lumotlar bilan CSV yoki JSON faylni** ulash — har bir qator alohida iteratsiyaga aylanadi, qiymatlar esa o‘zgaruvchi sifatida mavjud bo‘ladi.

Runner reliz oldidan qo‘lda tekshirish va testlarni sozlash uchun qulay.

## Newman: buyruq satridan ishga tushirish

**Newman** — Postman kolleksiyalarini Node.js’da ishga tushiradigan konsol vositasi. Kolleksiya va muhitni JSON’ga eksport qiling va bajaring:

```bash
npm install -g newman

newman run api.postman_collection.json \
  -e staging.postman_environment.json \
  --reporters cli,junit \
  --reporter-junit-export results/newman.xml
```

Foydali flaglar:

- `-d data.csv` — test ma’lumotlari fayli;
- `--env-var "token=..."` — o‘zgaruvchi qiymatini tashqaridan, masalan CI sirlaridan uzatish;
- `--bail` — birinchi xatoda to‘xtash.

Tekshiruv o‘tmasa, Newman noldan farqli kod bilan tugaydi va CI yig‘ishni muvaffaqiyatsiz deb belgilaydi. Postman’ning o‘xshash vazifali o‘z **Postman CLI** vositasi ham bor; u Postman buluti bilan yaqinroq bog‘langan, Newman esa fayllar bilan to‘liq lokal ishlaydi.

## CI’ga qo‘shamiz

GitHub Actions uchun misol:

```yaml
name: API tests
on: [push]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g newman
      - run: >
          newman run tests/api.postman_collection.json
          -e tests/staging.postman_environment.json
          --env-var "token=${{ secrets.API_TOKEN }}"
          --reporters cli,junit
          --reporter-junit-export results/newman.xml
```

Ko‘pchilik CI tizimlari JUnit hisobotini testlar ro‘yxati sifatida ko‘rsata oladi. GitLab CI, Jenkins va boshqa tizimlarda qadamlar bir xil: Newman’ni o‘rnatish va kolleksiyani ishga tushirish.

## Ko‘p uchraydigan xatolar

- **Testlar keraksiz ravishda bir-biriga bog‘liq.** Bitta so‘rov yiqilsa, butun zanjir buziladi. Iloji boricha mustaqil stsenariylar tuzing.
- **Testlar production’ga yozadi.** Ularni test ma’lumotlari bo‘lgan alohida stendda ishga tushiring.
- **Faqat 200 statusi tekshiriladi.** Server tanasida xato bilan 200 qaytarishi mumkin.
- **Maxfiy ma’lumotlar muhit faylida commit qilingan.** Ularni `--env-var` va CI sirlari orqali uzating.
- **Repozitoriydagi kolleksiya eskirgan.** Haqiqat manbai Git’dagi fayl ekanini kelishib oling va uni API kodi bilan birga yangilang.

## FAQ

### Postman testlari backend unit-testlaridan nimasi bilan farq qiladi?

Unit-testlar kod ichidagi alohida funksiyalarni tekshiradi. Postman testlari esa API’ni tashqaridan, klient ko‘rganidek tekshiradi: tarmoq orqali, haqiqiy avtorizatsiya va ma’lumotlar bazasi bilan. Bular turli darajalar va bir-birini to‘ldiradi.

### Newman uchun Postman’ning pullik tarifi kerakmi?

Yo‘q. Newman — ochiq manbali vosita, u eksport qilingan JSON kolleksiya fayllarini ishga tushiradi va obuna talab qilmaydi.

### Testlarni turli stendlarda qanday ishga tushirish mumkin?

Har bir stend uchun alohida muhit fayli yarating va keraklisini `-e` flagi orqali uzating. Kolleksiyaning o‘zi o‘zgarmaydi.
