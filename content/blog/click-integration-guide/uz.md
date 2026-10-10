---
title: Saytga Click to‘lovini qanday ulash mumkin
description: Click Prepare va Complete jarayoni qanday ishlaydi, imzo qanday tekshiriladi, integratsiya qanday sinaladi va buyurtma statuslari qanday to‘g‘ri saqlanadi.
summary: Click serveringizga ikki so‘rov yuboradi — Prepare (buyurtmani tekshirish va band qilish) va Complete (to‘lovni tasdiqlash); sizning vazifangiz imzo, summa va statusni tekshirib, idempotent javob berish.
---

## Qisqa javob: Click to‘lovi qanday ishlaydi

Internet-do‘konlar uchun Click **Shop API** sxemasidan foydalanadi: xaridor Click to‘lov sahifasiga o‘tadi, Click esa serveringizga ikki so‘rov yuboradi.

1. **Prepare** (`action=0`) — Click so‘raydi: «Bunday buyurtma bormi, summa to‘g‘rimi, uni to‘lash mumkinmi?» Siz tekshirib, `0` (hammasi joyida) yoki rad etish kodi bilan javob berasiz.
2. **Complete** (`action=1`) — Click yechib olish natijasini xabar qiladi. To‘lov o‘tgan bo‘lsa, buyurtmani «to‘langan» holatiga o‘tkazasiz. Click xato yuborsa — bandni bekor qilasiz.

Boshlash uchun Click bilan shartnoma va merchant ma’lumotlari kerak: `service_id`, `merchant_id`, `merchant_user_id` va **maxfiy kalit**. Prepare va Complete manzillarini merchant kabinetida ko‘rsatasiz.

## So‘rovlarda nima keladi

Click forma parametrlari bilan POST so‘rov yuboradi. Asosiy maydonlar:

- `click_trans_id` — Click tomonidagi tranzaksiya ID;
- `service_id` — sizning servisingiz;
- `merchant_trans_id` — tizimingizdagi buyurtma ID (to‘lov havolasini yaratishda bergan qiymatingiz);
- `amount` — summa;
- `action` — Prepare uchun 0, Complete uchun 1;
- `error`, `error_note` — Click tomonidagi holat (Complete’da muhim);
- `sign_time`, `sign_string` — vaqt va imzo;
- `merchant_prepare_id` — faqat Complete’da: Prepare bosqichida qaytargan ID.

Javob — `click_trans_id`, `merchant_trans_id`, `merchant_prepare_id` (yoki `merchant_confirm_id`), `error` va `error_note` bo‘lgan JSON.

## Imzoni tekshirish

Imzo — maydonlar va maxfiy kalit birlashtirilgan satrdan olingan MD5. Maydonlar tartibi Click’ning rasmiy hujjatlarida keltirilgan; Complete uchun satrga `merchant_prepare_id` qo‘shiladi. Ishga tushirishdan oldin formulani dolzarb hujjat bilan solishtiring.

```ts
import { createHash } from "crypto";

function checkSign(p: Record<string, string>, secret: string) {
  const base =
    p.click_trans_id + p.service_id + secret + p.merchant_trans_id +
    (p.action === "1" ? p.merchant_prepare_id : "") +
    p.amount + p.action + p.sign_time;
  const md5 = createHash("md5").update(base).digest("hex");
  return md5 === p.sign_string;
}
```

Imzo mos kelmasa — darhol imzo xatosi kodi bilan javob bering va bazada hech narsani o‘zgartirmang.

## Prepare va Complete mantig‘i

**Prepare’da tekshiring:**

- imzoni;
- `merchant_trans_id` bo‘yicha buyurtma mavjudligini;
- `amount` buyurtma summasiga tengligini (satr emas, son sifatida solishtiring);
- buyurtma hali to‘lanmagan va bekor qilinmaganini.

So‘ng «tayyorlangan» statusli tranzaksiya yozuvini yarating va uning ID’sini `merchant_prepare_id` sifatida qaytaring.

**Complete’da tekshiring:**

- imzoni va `merchant_prepare_id` mavjudligini;
- `error` maydonini: manfiy bo‘lsa, Click bekor qilinganini bildiradi — tranzaksiyani bekor qilingan deb belgilang;
- `error = 0` bo‘lsa — buyurtmani to‘lov yozuvi bilan birga **bitta ma’lumotlar bazasi tranzaksiyasida** «to‘langan»ga o‘tkazing.

## Buyurtma statuslarini buzmaslik

- **Idempotentlik.** Click so‘rovni takrorlashi mumkin. Bu tranzaksiya uchun Complete allaqachon qayta ishlangan bo‘lsa, xato yoki qayta hisoblash emas, xuddi o‘sha javobni qaytaring.
- **Bloklash.** Ikki parallel so‘rov buyurtmani ikki marta to‘lamasligi uchun buyurtmani `SELECT ... FOR UPDATE` yoki shunga o‘xshash usul bilan yangilang.
- **Bir buyurtmaga bitta to‘lov.** Buyurtma boshqa usulda to‘langan bo‘lsa, tegishli xato kodi bilan javob bering.
- **Summa qat’iy.** Prepare’dan keyin buyurtma summasini o‘zgartirmang, aks holda Complete farq bilan keladi.
- **Loglar.** Har bir kiruvchi so‘rov va javobingizni saqlang: bu bahsli to‘lovlarda asosiy vosita.

## Sinovdan o‘tkazish

1. Endpoint’larni internetdan ochiq HTTPS manzilda ishga tushiring (lokal ishlab chiqish uchun tunnel yetarli).
2. Ssenariylarni sinang: muvaffaqiyatli to‘lov, noto‘g‘ri summa, mavjud bo‘lmagan buyurtma, takroriy Complete, Click tomonidan bekor qilish.
3. Noto‘g‘ri imzoda baza o‘zgarmasligini tekshiring.
4. Ishga tushirishdan oldin minimal summada haqiqiy to‘lov qiling.

## Ko‘p uchraydigan xatolar

- Imzoni noto‘g‘ri maydonlar tartibi bilan tekshirish.
- `amount`ni satr sifatida solishtirish: `"1000"` va `"1000.00"` teng emas.
- Buyurtmani Prepare bosqichidayoq «to‘langan» qilish.
- Kodli JSON o‘rniga HTTP xato bilan javob berish — Click tuzilgan javob kutadi.

## FAQ

### Click integratsiyasi uchun alohida server kerakmi?

Yo‘q. Backend’ingizda internetdan ochiq ikkita HTTPS endpoint yetarli. Asosiysi — ishonchli ma’lumotlar bazasi va so‘rovlarni loglash.

### Complete kelmasa nima qilish kerak?

Buyurtmani «to‘lov kutilmoqda» holatida qoldiring va to‘lovlarni merchant kabinetida solishtiring. Foydalanuvchi saytga qaytgani uchungina buyurtmani to‘langan deb belgilamang.

### Click va Payme’ni bir vaqtda qabul qilish mumkinmi?

Ha. «Provayder» maydoni bo‘lgan umumiy to‘lovlar jadvali va buyurtma statusini o‘zgartirishning yagona qoidalarini yarating — shunda ikki usul to‘qnashmaydi.
