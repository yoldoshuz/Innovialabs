---
title: Mobil dizaynda bosish zonalari o‘lchami va bosh barmoq zonasi
description: Apple, Google va WCAG tavsiya qilgan bosish zonalari o‘lchamlari, katta telefonlarda bosh barmoq qanday yetishi va asosiy amallarni qayerga joylash kerak.
summary: Bosish maydonini iOS da kamida 44×44 pt, Android da 48×48 dp qiling (WCAG AA minimumi — 24×24 CSS px), elementlar orasida bo‘shliq qoldiring, tez-tez ishlatiladigan va asosiy amallarni esa bosh barmoq oson yetadigan ekranning pastki qismiga joylashtiring.
---

## Tavsiya etilgan o‘lchamlar

| Manba | Minimal zona | Izoh |
|---|---|---|
| **Apple Human Interface Guidelines** | 44×44 pt | Har qanday bosiladigan element uchun |
| **Material Design (Google)** | 48×48 dp | Hamda elementlar orasida taxminan 8 dp bo‘shliq |
| **WCAG 2.2, 2.5.8-mezon (AA)** | 24×24 CSS px | Yoki kichikroq element atrofida yetarli bo‘shliq; matn ichidagi havolalar istisno |
| **WCAG 2.2, 2.5.5-mezon (AAA)** | 44×44 CSS px | Kengaytirilgan daraja |

Punktlar, dp va CSS piksellar — ekranning jismoniy piksellari emas, mantiqiy birliklar, shuning uchun bu qiymatlarni taxminan solishtirish mumkin. Amaliy qoida: **44–48 birlikka mo‘ljallab loyihalang, 24 ni esa maqsad emas, mutlaq minimum** deb hisoblang.

## Ko‘rinadigan o‘lcham va bosish maydoni — turli narsalar

Ikonka 24×24 bo‘lib, bosish maydoni 48×48 bo‘lishi mumkin. Barmoq uchun rasm emas, aynan **hit area** muhim. Vebda uni ichki chekinishlar yoki psevdoelement bilan kengaytirish mumkin:

```css
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-button::after {
  content: "";
  position: absolute;
  inset: -12px; /* 24 + 12 + 12 = 48px bosish maydoni */
}
```

Qo‘shni elementlarning kengaytirilgan maydonlari **ustma-ust tushmasligiga** e’tibor bering, aks holda bosish boshqa elementga tegadi.

## Bo‘shliqlar o‘lchamdan kam muhim emas

Bir-biriga yopishib turgan 44 pt li ikkita tugma baribir xato bosishlarga olib keladi. Ayniqsa quyidagilar orasida bo‘shliq qoldiring:

- tulbarlardagi ikonkalar qatorlari;
- ro‘yxat va menyulardagi havolalar;
- yonma-yon turgan «Bekor qilish» va «O‘chirish».

Kichik elementlar odatda zich maketlarda — jadvallar va kalendarlarda paydo bo‘ladi. Kataklarni kattalashtirib bo‘lmasa, qatorlarni balandroq qiling yoki bitta qatorga bir nechta mayda tugma qo‘yish o‘rniga tafsilotlarni bosilganda oching.

## Bosh barmoq zonasi qanday ishlaydi

Ko‘pchilik telefonni ko‘pincha bir qo‘lda ushlab, bosh barmoq bilan bosadi. Barmoq kaft asosidan yoy bo‘ylab harakatlanadi va ekran zonalarga bo‘linadi:

- **Qulay** — ekranning pastki va o‘rta qismi.
- **Cho‘zilish kerak** — yuqori o‘rta qism va chetlar.
- **Qiyin** — yuqori burchaklar, ayniqsa ushlab turgan qo‘lga qarama-qarshi burchak.

Telefon qanchalik katta bo‘lsa, qiyin zona shunchalik kattalashadi. Bundan tashqari odamlar ushlashni o‘zgartiradi, telefonni boshqa qo‘lga oladi, ikki barmoq bilan foydalanadi, ba’zilari esa chapaqay. Shuning uchun eng ishonchli joy — aniq bir burchak emas, ekranning **markazi va pastki qismi**.

## Asosiy amallarni qayerga joylashtirish kerak

- **Ekrandagi asosiy amal** («To‘lash», «Davom etish») — pastda, ko‘pincha to‘liq kenglikdagi tugma ko‘rinishida.
- **Asosiy navigatsiya** — yuqori burchakdagi menyu ikonkasi o‘rniga pastki tab bar.
- **Tez-tez ishlatiladigan amallar** — pastki yarmida: bottom sheet, suzuvchi amal tugmasi, pastki asboblar paneli.
- **Ma’lumot** — yuqorida: sarlavha, holat, yakuniy qiymatlar. O‘qish uchun cho‘zilish shart emas.
- **Kam ishlatiladigan va xavfli amallar** — qulay zonadan tashqarida bo‘lishi mumkin. Akkauntni o‘chirish bitta oson bosishda bo‘lmasligi kerak; tasdiqlashni ham qo‘shing.

Agar muhim element baribir yuqorida turishi kerak bo‘lsa (masalan, sarlavhadagi qidiruv), ikkinchi yo‘l bering: pastga tortib ochish yoki ekran pastiga yaqinroq nusxasini qo‘yish.

## Ishlab chiqishga topshirishdan oldingi chek-list

- Barcha bosiladigan elementlar kamida 44 pt / 48 dp yoki ularning bosish maydoni kengaytirilgan.
- Qo‘shnilarning maydonlari ustma-ust tushmaydi, ular orasida bo‘shliq bor.
- Asosiy amal va navigatsiya ekranning pastki qismida.
- Xavfli amallar tez-tez ishlatiladiganlar bilan yonma-yon turmaydi.
- Maket haqiqiy katta telefonda bir qo‘l bilan — chap va o‘ng qo‘lda — sinab ko‘rilgan.

Figma da 44×44 yoki 48×48 o‘lchamli oddiy ustqo‘yma komponent yasab, o‘lchamlarni tez tekshirish uchun uni ikonkalar ustiga qo‘yish qulay.

## FAQ

### Sayt uchun qanday minimumdan foydalanish kerak?

WCAG 2.2 AA darajasi kamida 24×24 CSS px yoki kichikroq elementlar atrofida yetarli bo‘shliq talab qiladi. Qulay mobil tajriba uchun 44–48 px ga yo‘naltiring: WCAG qiymati qulaylik tavsiyasi emas, balki foydalanish imkoniyatining quyi chegarasi.

### Tugma 44×44 dan kichik ko‘rinishi mumkinmi?

Ha. Agar uning atrofidagi bosish maydoni tavsiya etilgan o‘lchamga yetsa va qo‘shnilar bilan ustma-ust tushmasa, ko‘rinadigan element kichikroq bo‘lishi mumkin.

### Chapaqaylar uchun bosh barmoq zonasi bir xilmi?

U ko‘zgudagidek teskari. Shuning uchun hamma narsani bitta burchakka siqib qo‘ymasdan, asosiy amallarni pastki markazga joylashtirish va maketni ikkala qo‘l bilan tekshirish ishonchliroq.
