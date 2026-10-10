---
title: Google Apps Script: Google Sheets’ni avtomatlashtirish
description: Google Apps Script amalda: o‘z funksiyalaringiz, oddiy va o‘rnatiladigan triggerlar, jadvaldan xat yuborish, API’dan ma’lumot olish va kvota cheklovlari.
summary: Apps Script — jadvalingiz yonida Google serverlarida ishlaydigan JavaScript: u o‘z formulalaringizni qo‘shadi, tahrirlarga va belgilangan vaqtga javob beradi, xat yuboradi va API’dan ma’lumot oladi, lekin kunlik kvotalar va bir ishga tushirish uchun vaqt chegarasi doirasida.
---
## Apps Script nima

**Google Apps Script** — Google Workspace’ga o‘rnatilgan JavaScript platformasi. Jadvalni oching va **Extensions → Apps Script** bandini tanlang: shu faylga bog‘langan loyihali muharrir paydo bo‘ladi. Kod Google serverlarida bajariladi, shuning uchun hech narsa o‘rnatish shart emas va kompyuteringiz o‘chiq bo‘lsa ham skript ishlaydi.

U nima uchun qulay:

- Sheets’da yo‘q bo‘lgan o‘z formulalaringiz;
- tahrir, forma yuborilishi yoki belgilangan vaqt bo‘yicha amallar;
- jadval ma’lumotlari asosida xatlar va bildirishnomalar;
- tashqi API’lardan ma’lumotlarni varaqqa yuklash.

Asosiy obyektlar: `SpreadsheetApp` (varaqlar va diapazonlar), `MailApp` (pochta), `UrlFetchApp` (HTTP so‘rovlar) va `PropertiesService` (sozlamalar va maxfiy kalitlar).

## O‘z funksiyalaringiz

Yozilgan har qanday funksiyani katakdan oddiy formula kabi chaqirish mumkin. `@customfunction` tegi uni avtomatik takliflarga qo‘shadi.

```javascript
/**
 * Soliq qo‘shilgan narxni qaytaradi.
 * @param {number} price Soliqsiz narx
 * @param {number} rate Stavka, masalan 0.15
 * @return {number}
 * @customfunction
 */
function WITH_TAX(price, rate) {
  if (Array.isArray(price)) {
    return price.map(row => row.map(p => p * (1 + rate)));
  }
  return price * (1 + rate);
}
```

Katakda: `=WITH_TAX(B2:B100, 0.15)`. Butun diapazonni bir marta uzatish formulani yuzlab kataklarga nusxalashdan ancha tez ishlaydi.

Cheklovlar: funksiya tez tugashi kerak (taxminan 30 soniya) va **avtorizatsiya talab qiladigan xizmatlardan foydalana olmaydi**, masalan xat yubora olmaydi. U faqat hisoblaydi va qiymat qaytaradi.

## Triggerlar

**Oddiy triggerlar** — band qilingan nomli funksiyalar: `onOpen(e)`, `onEdit(e)`. Ular sozlashsiz ishlaydi, lekin qisqa vaqt bajariladi va ruxsat talab qiladigan xizmatlarga murojaat qila olmaydi. Misol: Tasks varag‘ida C ustuni o‘zgarganda vaqt belgisini qo‘yish.

```javascript
function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Tasks' || e.range.getColumn() !== 3) return;
  sheet.getRange(e.range.getRow(), 4).setValue(new Date());
}
```

`onEdit` boshqa skriptlar yoki API orqali kiritilgan o‘zgarishlarga emas, inson qilgan tahrirlarga ishga tushadi.

**O‘rnatiladigan triggerlar** muharrirda (Triggers → Add Trigger) yoki kodda yaratiladi. Ular belgilangan vaqtda, forma yuborilganda yoki jadval o‘zgarganda ishga tushadi va ularni yaratgan foydalanuvchi huquqlari bilan ishlaydi.

```javascript
function createHourlyTrigger() {
  ScriptApp.newTrigger('loadRates').timeBased().everyHours(1).create();
}
```

Bunday funksiyani bir marta ishga tushiring, aks holda har safar yana bitta trigger yaratiladi.

## Jadvaldan xat yuborish

Invoices varag‘i: A — email, B — ism, C — summa, D — status, E — yuborilgan sana. Skript hali xat yuborilmagan har bir to‘lanmagan qator bo‘yicha eslatma jo‘natadi:

```javascript
function sendReminders() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Invoices');
  const data = sheet.getDataRange().getValues();
  const sent = data.map(row => [row[4]]);
  for (let i = 1; i < data.length; i++) {
    const [email, name, amount, status, sentAt] = data[i];
    if (status !== 'To‘lanmagan' || sentAt) continue;
    MailApp.sendEmail(email, 'To‘lov haqida eslatma',
      `Assalomu alaykum, ${name}! ${amount} summadagi hisob hali to‘lanmagan.`);
    sent[i][0] = new Date();
  }
  sheet.getRange(1, 5, sent.length, 1).setValues(sent);
}
```

Yuborilgan sana ustuni skript qayta ishga tushganda takroriy xatlardan himoya qiladi. Avval o‘z manzilingizda sinab ko‘ring.

## API’dan ma’lumot olish

```javascript
function loadRates() {
  const key = PropertiesService.getScriptProperties().getProperty('API_KEY');
  const res = UrlFetchApp.fetch('https://api.example.com/rates', {
    headers: { Authorization: `Bearer ${key}` },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error(res.getContentText());
  const rows = JSON.parse(res.getContentText()).items.map(r => [r.code, r.rate]);
  const sheet = SpreadsheetApp.getActive().getSheetByName('Rates');
  sheet.getRange('A2:B').clearContent();
  if (rows.length) sheet.getRange(2, 1, rows.length, 2).setValues(rows);
}
```

Kalitlarni kodda emas, **Script Properties**da (Project Settings) saqlang: jadvalni tahrirlash huquqiga ega har kim skriptni ochishi mumkin.

## Kvotalar va cheklovlar

Apps Script bepul, lekin uning kvotalari bor. Ular shaxsiy Google akkauntlari va Workspace akkauntlari uchun farq qiladi hamda vaqt o‘tishi bilan o‘zgaradi, shuning uchun rasmiy [kvotalar sahifasini](https://developers.google.com/apps-script/guides/services/quotas) tekshiring.

Oldindan nimani hisobga olish kerak:

- **Bir ishga tushirish vaqti** cheklangan (taxminan olti daqiqa). Uzun vazifalarni qismlarga bo‘lib bajaring, jarayonni `PropertiesService`da saqlang va keyingi triggerda davom ettiring.
- **Kunlik cheklovlar** xat oluvchilar soni, UrlFetch chaqiruvlari va triggerlarning umumiy ish vaqtiga taalluqli. `MailApp.getRemainingDailyQuota()` qancha xat qolganini ko‘rsatadi.
- **Tezlik.** Diapazonlarni `getValues()` va `setValues()` orqali to‘plab o‘qing va yozing. Tsiklda har bir katak uchun `getValue()` chaqirish skriptlar sekin ishlashining eng ko‘p uchraydigan sababi.
- **Parallellik.** Ikki trigger bir vaqtda ishga tushishi mumkin bo‘lsa, ular bir-birining ma’lumotini ustidan yozmasligi uchun `LockService`dan foydalaning.

## FAQ

### JavaScript’ni bilish shartmi?

Asoslar yetarli: o‘zgaruvchilar, tsikllar, massivlar va obyektlar. Ko‘pchilik skriptlar bir xil tuzilgan: diapazonni o‘qish, massivni qayta ishlash, natijani qaytarib yozish.

### Nega birinchi ishga tushirishda skript ruxsat so‘raydi?

Google skript qaysi ma’lumotlarga kirishini ko‘rsatadi: jadvallar, pochta, tashqi so‘rovlar. Bu ro‘yxatni diqqat bilan o‘qing, ayniqsa internetdan nusxalangan skriptlar uchun.

### Apps Script qachon yetmay qoladi?

Ishga tushirishlar muntazam ravishda vaqt chegarasiga yetsa, ma’lumotlar bir nechta tizimda saqlansa yoki ishonchli xatolarni qayta ishlash va loglash kerak bo‘lsa. Bunday paytda odatda alohida backend yoki integratsiya platformasi yaxshiroq mos keladi.
