---
title: UI-dizayndagi modulli to‘rlar: ustunlar, oraliqlar, chekkalar
description: Interfeyslarda modulli to‘rlar: ustunli, bazaviy va 8pt to‘r, desktop va mobil uchun odatiy sozlamalar va to‘r maketni kodga o‘tkazishni qanday osonlashtiradi.
summary: Modulli to‘r — ustunlar, ular orasidagi oraliqlar va chekkalardan iborat ko‘rinmas belgilash bo‘lib, barcha elementlar unga tekislanadi; u maketlarni bir xil, kodga o‘tkazishni esa oldindan aytib bo‘ladigan qiladi.
---

## Qisqacha: to‘r nima

**Modulli to‘r** — dizayner interfeys elementlarini joylashtiradigan ko‘rinmas yo‘naltiruvchi chiziqlar to‘plami. U kontent qayerdan boshlanib, qayerda tugashini, bloklar qanday kenglikda bo‘lishi va ular orasida qancha masofa turishini belgilaydi.

To‘rsiz har bir ekran «ko‘z bilan» yig‘iladi va bir oydan keyin loyihada o‘nlab turli oraliqlar paydo bo‘ladi. To‘r bilan qarorlar bir marta qabul qilinadi, keyin elementlar shunchaki o‘z joyiga tushadi.

## Ustunli to‘r nimalardan iborat

- **Ustunlar (columns)** — kontent kengligi bo‘linadigan vertikal yo‘laklar. Blok bitta yoki bir nechta ustunni egallashi mumkin.
- **Ustunlararo oraliqlar (gutters)** — ustunlar orasidagi bo‘shliqlar. Ularga kontent qo‘yilmaydi, ular «havo» beradi.
- **Chekkalar (margins)** — ekran chetidan birinchi va oxirgi ustungacha bo‘lgan masofa.

Konteyner kengligi shunday yig‘iladi: ustunlar + ular orasidagi gutter’lar + chetlardagi margin’lar. Ustunlar odatda moslashuvchan va cho‘ziladi, gutter va margin esa qat’iy bo‘ladi.

## Birga ishlatiladigan uch xil to‘r

| To‘r | Nimani belgilaydi | Nima uchun kerak |
|---|---|---|
| **Ustunli** | Bloklarning gorizontal joylashuvi va kengligi | Vertikal chiziqlar bo‘yicha tekislash, moslashuvchanlik |
| **Bazaviy (baseline)** | Matnning vertikal ritmi — qatorlar tushadigan qadam | Tekis qatorlar va xatboshilar orasida bir xil masofa |
| **8pt to‘r** | Barcha o‘lcham va oraliqlar 8 ga karrali (mayda detallar uchun ba’zan 4) | Tasodifiy sonlarsiz yagona masofalar tizimi |

### Nega aynan 8

8 soni 2 va 4 ga oson bo‘linadi, keng tarqalgan ekran o‘lchamlari ham 8 ga yaxshi bo‘linadi. 8, 16, 24, 32, 48, 64 qiymatlari ko‘zga aniq farqlanadi va tushunarli shkala hosil qiladi. Mayda detallar — ikonkalar, tugma ichidagi oraliqlar uchun 4 qadamga ruxsat beriladi.

Asosiy foyda sonning sehrida emas, balki **tanlovni cheklashda**: dizayner 1 dan 100 gacha istalgan son emas, qisqa shkaladan tanlaydi, dasturchi esa u yerda 13 edimi yoki 15 mi deb taxmin qilib o‘tirmaydi.

## Odatiy sozlamalar

Bu standart emas, balki keng tarqalgan boshlang‘ich nuqtalar. Masalan, Material Design’ning moslashuvchan to‘ri ham turli ekran kengliklari uchun 4, 8 va 12 ustundan foydalanadi.

| Qurilma | Ustunlar | Gutter | Margin |
|---|---|---|---|
| Telefon | 4 | 16 | 16–24 |
| Planshet | 8 | 16–24 | 24–32 |
| Desktop | 12 | 24–32 | avtomatik, kontent maksimal kenglik bilan cheklanadi |

Nega desktopda 12 ustun ommabop: 12 soni 2, 3, 4 va 6 ga bo‘linadi, shuning uchun bir qatorda ikki, uch, to‘rt yoki olti kartochkali joylashuvni yig‘ish oson.

## To‘r ishlab chiqishga qanday yordam beradi

Maketdagi to‘r to‘g‘ridan-to‘g‘ri CSS’ga o‘tkaziladi. Dasturchi har bir oraliqni o‘lchashi shart emas: har bir breakpoint uchun ustunlar soni, gutter va margin’ni bilish kifoya.

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
  max-width: 1280px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .container { grid-template-columns: repeat(8, 1fr); gap: 24px; padding: 0 32px; }
}

@media (min-width: 1200px) {
  .container { grid-template-columns: repeat(12, 1fr); }
}
```

Agar dizaynda 8pt tizimi ishlatilsa, uni o‘zgaruvchilar yoki tokenlar sifatida rasmiylashtirish qulay (`--space-1: 8px`, `--space-2: 16px` va hokazo) — shunda maket va kod bir tilda gaplashadi.

## Figma’da to‘rni qanday sozlash

1. Freymni tanlang va o‘ng panelda **Layout grid** qo‘shing.
2. **Columns** turini tanlang, ustunlar sonini, **Gutter** va **Margin**ni kiriting, **Stretch** turini belgilang.
3. Vertikal ritm uchun 4 yoki 8 qadamli **Rows** yoki **Grid** turidagi ikkinchi to‘rni qo‘shing.
4. Bir xil o‘lchamdagi barcha ekranlarga qo‘llash uchun sozlamani uslub sifatida saqlang.

## Ko‘p uchraydigan xatolar

- Matn va rasmlarni gutter’larga joylashtirish.
- To‘rni «ko‘rinish uchun» qo‘yib, elementlarni unga tekislamaslik.
- Bir xil o‘lchamdagi ekranlarda turli to‘rlardan foydalanish.
- 8pt shkalani 13 yoki 22 kabi tasodifiy qiymatlar bilan buzish.
- Mobil to‘rni unutib, desktop to‘rini siqishga urinish.

## FAQ

### To‘rga qat’iy amal qilish shartmi?

To‘r — qonun emas, asbob. Ba’zan element ataylab undan chiqib ketadi, masalan butun kenglikdagi fon rasmi. Muhimi, bunday istisnolar ongli bo‘lsin, asosiy kontent esa tekislangan holda qolsin.

### Lending uchun nechta ustun tanlash kerak?

Desktop uchun odatda 12 ustun yetarli: bu har qanday joylashuv uchun kifoya. Mobilda esa 4 ustunga o‘tgan ma’qul, u yerda ko‘pchilik bloklar butun kenglikni egallaydi.

### 8pt to‘r ustunli to‘rdan nimasi bilan farq qiladi?

Ustunli to‘r bloklarning gorizontal joylashuvi va kengligiga javob beradi. 8pt to‘r esa barcha o‘lcham va oraliqlar, jumladan vertikallari tizimi. Ular bir-birini to‘ldiradi.
