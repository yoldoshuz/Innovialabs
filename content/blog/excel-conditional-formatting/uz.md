---
title: Excel va Google Sheets’da shartli formatlash
description: Excel va Google Sheets’da shartli formatlash: tayyor qoidalar, o‘z formulangiz, takrorlar, muddati o‘tgan sanalar, rang shkalalari va qoidalar tartibi.
summary: Shartli formatlash shart bajarilganda kataklarni avtomatik bo‘yaydi: oddiy tekshiruvlar uchun tayyor qoidalar yetarli, qolgan hamma narsa uchun, masalan butun qatorni ajratish uchun, to‘g‘ri $ belgilari bilan o‘z formulangiz kerak.
---
## Shartli formatlash nima qiladi

**Shartli formatlash** shart bajarilganda katakning ko‘rinishini (fon, shrift rangi, belgi, gistogramma) o‘zgartiradi. Ma’lumotlar o‘zgarmaydi, faqat ko‘rinish o‘zgaradi va qiymatlar yangilanganda u ham o‘zi yangilanadi.

Qayerda topiladi:

- **Excel:** Home → Conditional Formatting.
- **Google Sheets:** Format → Conditional formatting (yon panel ochiladi).

Oddiy tekshiruvlar uchun tayyor qoidalar yetarli. Shart boshqa ustunga, sanaga yoki bir nechta shartga bog‘liq bo‘lsa, **o‘z formulangiz** kerak bo‘ladi.

## Bilish kerak bo‘lgan tayyor qoidalar

- **Highlight cells rules**: katta, kichik, oraliqda, matn o‘z ichiga oladi, sana. «Summa limitdan oshdi» yoki «status Error so‘zini o‘z ichiga oladi» kabi holatlar uchun qulay.
- **Top/Bottom rules** (Excel): eng yaxshi 10 ta element, o‘rtachadan yuqori.
- **Data bars va icon sets** (Excel): katak ichida kichik grafik yoki strelkalar.
- **Color scales** (ikkalasida ham): kichik qiymatlardan kattalarigacha gradient.

Google Sheets panelida ikkita yorliq bor: **Single color** (barcha shart turlari, jumladan o‘z formulangiz) va **Color scale**.

## O‘z formulangiz bilan qoidalar

Formula TRUE yoki FALSE qaytarishi kerak va u **tanlangan diapazonning chap yuqori katagi uchun** yoziladi. Keyin dastur uni boshqa kataklar uchun xuddi formulani nusxalagandek suradi. Shuning uchun `$` belgilari juda muhim.

Misol: F ustunida «Overdue» yozilgan bo‘lsa, vazifaning butun qatorini ajratish.

1. Ma’lumotlar diapazonini tanlang, masalan `A2:F200`, sarlavhadan emas, birinchi ma’lumot qatoridan boshlab.
2. Excel: New Rule → «Use a formula to determine which cells to format». Sheets: Format rules → «Custom formula is».
3. Formulani kiriting va fon rangini tanlang:

```text
=$F2="Overdue"
```

`$F` ustunni qotiradi, shuning uchun qatordagi har bir katak F ustuniga qaraydi. Dollarsiz `2` esa qatorning o‘zgarishiga imkon beradi. Agar `$F$2` deb yozsangiz, barcha qatorlar faqat ikkinchi qatorni tekshiradi va bu eng ko‘p uchraydigan xato.

## Takrorlar va muddati o‘tgan sanalar

**Takrorlar.** Excel’da tayyor qoida bor: Highlight Cells Rules → Duplicate Values. Ko‘proq nazorat kerak bo‘lsa yoki Google Sheets’da `A2:A200` diapazoniga formula qo‘llang:

```text
=COUNTIF($A$2:$A$200,$A2)>1
```

Faqat ikkinchi va keyingi takrorlarni belgilash uchun joriy qatorgacha sanang: `=COUNTIF($A$2:$A2,$A2)>1`.

**Muddati o‘tgan sanalar.** Muddat D ustunida, status F ustunida, diapazon `A2:F200`:

```text
=AND($D2<>"",$D2<TODAY(),$F2<>"Done")
```

`$D2<>""` qismi bo‘sh kataklarning muddati o‘tgan deb hisoblanishiga yo‘l qo‘ymaydi. «Muddat yaqin 7 kun ichida» uchun boshqa rangdagi ikkinchi qoidani qo‘shing:

```text
=AND($D2>=TODAY(),$D2<=TODAY()+7)
```

Ustunda sanaga o‘xshash matn emas, haqiqiy sanalar turganini tekshiring, aks holda taqqoslash jimgina ishlamaydi.

## Rang shkalalari

Shkala raqamlarni tez ko‘zdan kechirishga yordam beradi: marja, javob vaqti, menejerlar bo‘yicha savdo.

- **Ikki rangli** shkala «qancha ko‘p bo‘lsa, shuncha yaxshi» holatiga mos keladi, o‘rta nuqtali **uch rangli** shkala esa ma’noli o‘rta qiymat bo‘lganda kerak, masalan reja ko‘rsatkichi.
- Minimum va maksimumni avtomatik emas, **son yoki protsentil** bilan belgilang, aks holda bitta keskin qiymat butun diapazonni rangsizlantiradi.
- Bir xil kataklarda shkala va fon bilan bo‘yaydigan qoidalarni aralashtirmang: o‘quvchi rang nimani bildirishini tushunmaydi.

## Qoidalarni tartibda saqlash

Qoidalar sezdirmasdan ko‘payadi: formatlangan kataklarni nusxalash bitta qoidani ko‘p bo‘laklarga ajratib yuborishi mumkin.

- **Ro‘yxatni muntazam ko‘rib chiqing.** Excel: Conditional Formatting → Manage Rules, so‘ng «This worksheet». Sheets: yon panel tanlangan diapazon yoki butun varaq qoidalarini ko‘rsatadi.
- **Bitta diapazonga bitta qoida.** Bo‘laklarni «Applies to» maydonini tahrirlab birlashtiring.
- **Tartib muhim.** Google Sheets’da bir nechta qoida mos kelsa, yuqoridagisi ustun keladi. Excel’da bir-biriga zid bo‘lmagan formatlar qo‘shiladi, ziddiyatlar tartib bo‘yicha hal qilinadi, «Stop If True» esa pastdagi qoidalarni to‘xtatadi.
- **Faqat qiymatlarni joylang** (Paste Special → Values), shunda formatlash ma’lumotlar bilan birga ko‘chmaydi.
- **Jadval yoniga izoh qo‘shing**: har bir rang nimani bildiradi.
- **Diapazonni ma’lumotlar bilan cheklang.** `TODAY()` kabi qayta hisoblanadigan funksiyalar butun ustunlarda katta fayllarni sekinlashtiradi.

## Ko‘p uchraydigan xatolar

- Noto‘g‘ri qotirish: `$A2` o‘rniga `$A$2`.
- Formula tanlangan diapazonning birinchi qatoriga emas, boshqa qatorga murojaat qiladi.
- Matnni son bilan taqqoslash: `"100"` va `100` turli qiymatlar.
- Google Sheets’da o‘z formulangizda boshqa varaqqa to‘g‘ridan-to‘g‘ri murojaat qilish. Buning o‘rniga `INDIRECT("Sheet2!A2:A200")` dan foydalaning.

## FAQ

### Nega formulali qoida noto‘g‘ri qatorlarni bo‘yayapti?

Deyarli har doim sabab qotirishda yoki boshlang‘ich qatorda. Formula tanlangan diapazonning birinchi qatoriga murojaat qilishi kerak: ustun harfi oldida `$` bo‘ladi, qator raqami oldida esa bo‘lmaydi.

### Shartli formatlashni boshqa diapazonga nusxalash mumkinmi?

Ha. Excel’da Format Painter, Google Sheets’da Paste special → Format only dan foydalaning. Keyin qoidalar ro‘yxatini tekshiring: nusxalash ko‘pincha takroriy qoidalar yaratadi, ularni bitta qoidaga birlashtirgan ma’qul.

### Fayl Google Sheets’da ochilgandan keyin Excel qoidalari ishlaydimi?

Oddiy qoidalar, rang shkalalari va ko‘pchilik formulalar ko‘chadi. Data bars, icon sets va Excel’ga xos ayrim sozlamalar yo‘qolishi yoki boshqacha ko‘rinishi mumkin, shuning uchun konvertatsiyadan keyin qoidalarni tekshirib chiqing.
