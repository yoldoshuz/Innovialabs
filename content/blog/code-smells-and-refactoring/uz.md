---
title: Kod hidlari va ularni qanday refaktoring qilish kerak
description: Ko‘p uchraydigan kod hidlari — uzun metodlar, takrorlanish, god object, sehrli raqamlar — va har biri uchun xavfsiz refaktoring qadami.
summary: Kod hidi — tuzilma o‘zgarishlarga xalaqit berayotganining belgisi; u testlar bilan himoyalangan kichik refaktoring qadamlari orqali tuzatiladi.
---

## Kod hidi nima va uni qachon tuzatish kerak

**Kod hidi** (code smell) — bu xato emas, balki kodni o‘qish va o‘zgartirish qiyinligining belgisi. Dastur ishlaydi, lekin har bir tahrir ko‘proq vaqt oladi va qo‘shni joylarni tez-tez buzadi.

Refaktoring — xatti-harakatni o‘zgartirmasdan tuzilmani o‘zgartirish. Asosiy qoida: **avval testlar, keyin tahrir**. Agar xatti-harakat testlar bilan qayd etilmagan bo‘lsa, biror narsani buzganingizni bilmaysiz.

Hidni o‘sha kodga baribir tegayotganingizda tuzating: yangi funksiya qo‘shayotganda yoki xatoni tuzatayotganda. Hech kim o‘zgartirmaydigan modulni «har ehtimolga qarshi» qayta yozish odatda o‘zini oqlamaydi.

## Xavfsiz refaktoring tartibi

1. Joriy xatti-harakatni qamrab oluvchi testlarni yozing yoki toping.
2. Bitta kichik o‘zgartirish kiriting.
3. Testlarni ishga tushiring.
4. Commit qiling.
5. Takrorlang.

Kichik commitlarni orqaga qaytarish va review qilish oson. Refaktoring va yangi funksionallikni bitta commitda aralashtirmang.

## Hidlar katalogi va davosi

| Hid | Belgisi | Refaktoring qadami |
|---|---|---|
| Uzun metod | Funksiya ekranga sig‘maydi, ichida ajratuvchi izohlar bor | Extract Method |
| Takrorlanish | Bir xil blok bir necha joyda | Umumiy funksiyaga chiqarish |
| God object | Bitta klass hamma narsani biladi va qiladi | Mas’uliyat bo‘yicha Extract Class |
| Sehrli raqamlar | `if (status === 3)` | Nomlangan konstanta yoki enum |
| Feature envy | Metod o‘zinikidan ko‘ra boshqa obyekt ma’lumotlari bilan ko‘proq ishlaydi | Move Method — ma’lumot yoniga |

### Uzun metod

`// validatsiya`, `// hisoblash`, `// saqlash` kabi izohlar — yangi funksiyalar uchun tayyor nomlar. Har bir blokni tushunarli nomli alohida metodga chiqaring. Asosiy funksiya chaqiruvlardan iborat qisqa ssenariyga aylanadi.

### Takrorlangan mantiq

Birlashtirishdan oldin kod **ma’nosi bo‘yicha** bir xil ekaniga ishonch hosil qiling, faqat ko‘rinishi bo‘yicha emas. Agar ikki blok tasodifan mos kelsa va turli sabablarga ko‘ra o‘zgarsa, ularni birlashtirish soxta bog‘liqlik yaratadi. Agar bu bitta biznes qoidasi bo‘lsa — bitta funksiyaga chiqaring.

### God object

Belgilari: yuzlab qatorlar, o‘nlab bog‘liqliklar, `Manager` yoki `Helper` kabi nom. Maydon va metodlarni mas’uliyat bo‘yicha guruhlang va har bir guruhni alohida klassga chiqaring. Dastlab asl klass chaqiruvlarni shunchaki uzatishi mumkin — shunda tashqi kodni darhol o‘zgartirish shart bo‘lmaydi.

### Sehrli raqamlar va satrlar

```ts
// oldin
if (order.status === 3) refund(order);

// keyin
const OrderStatus = { Paid: 1, Shipped: 2, Cancelled: 3 } as const;
if (order.status === OrderStatus.Cancelled) refund(order);
```

Nom ma’noni tushuntiradi va o‘zgartirish uchun yagona joy beradi.

### Feature envy

Agar `Invoice` klassining metodi chegirmani hisoblash uchun doim `Customer` maydonlarini o‘qisa, chegirma mantiqi, ehtimol, `Customer`ga tegishli. Metodni ma’lumotlar joylashgan joyga ko‘chiring.

## Ko‘p uchraydigan xatolar

- **Testsiz refaktoring.** Hech bo‘lmaganda joriy natijani qayd etuvchi xarakterlovchi testlardan boshlang.
- **Katta portlash.** Butun modulni bitta branchda qayta yozish xavfli va review qilish qiyin.
- **Kelajak uchun abstraksiyalar.** Ikkinchi real foydalanish paydo bo‘lmaguncha interfeys chiqarmang.
- **Qo‘lda nomini o‘zgartirish.** IDE ning avtomatik refaktoringlaridan foydalaning — ular qidirish va almashtirishdan ishonchliroq.

## FAQ

### Refaktoring uchun alohida vaqt ajratish kerakmi?

Odatda vazifalar davomida asta-sekin refaktoring qilish samaraliroq. Alohida vaqt hid jamoani aniq sekinlashtirsa va buni konkret vazifalarda ko‘rsatish mumkin bo‘lsa, o‘zini oqlaydi.

### Umuman testlar bo‘lmasa nima qilish kerak?

Modulning joriy xatti-harakatini, hatto u g‘alati bo‘lsa ham, qayd etuvchi yuqori darajadagi testlardan boshlang. Shundan keyin ichki tuzilmani xavfsiz o‘zgartirish mumkin.

### Kod hidlarini avtomatik topish mumkinmi?

Linterlar va statik analizatorlar uzun funksiyalar, murakkablik va takrorlanishni belgilaydi. Lekin yakuniy qaror inson zimmasida: analizatorning har bir signalini tuzatish shart emas.
