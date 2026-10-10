---
title: Sayt uchun shriftlarni qanday tanlash va uyg‘unlashtirish mumkin
description: Sarlavha va matn shriftlari juftligini kontrast va kayfiyat bo‘yicha tanlash usuli, litsenziya, tillar va yuklanish tezligini tekshirish, bepul juftliklar.
summary: Avval asosiy matn uchun o‘qilishi qulay shriftni tanlang, keyin undan bitta aniq belgi bilan farq qiladigan va brend kayfiyatiga mos sarlavha shriftini toping; tasdiqlashdan oldin litsenziya, tillar va fayl hajmini tekshiring.
---

## Qisqacha javob

Ko‘pchilik saytlarga **ikkitadan ortiq shrift kerak emas**: sarlavhalar uchun va asosiy matn uchun. **Matn shriftidan** boshlang — o‘qish aynan unga tayanadi. So‘ng undan bitta sezilarli belgi bilan farq qiladigan va brend kayfiyatini beradigan **sarlavha shriftini** tanlang. Tasdiqlashdan oldin uch narsani tekshiring: **litsenziya**, tillaringiz uchun **belgilar to‘plami** va **yuklanish tezligi**.

## 1-qadam. Matn shriftini tanlang

Asosiy matn arzon ekranlarda ham kichik o‘lchamda yaxshi o‘qilishi kerak. E’tibor bering:

- kichik harflarning **katta balandligiga** (x-height);
- a, e, c kabi harflarning **ochiq shakllariga**;
- **Il1** va **O0** aniq farqlanishiga;
- kamida regular, medium va bold, iloji bo‘lsa kursiv borligiga;
- sifatli **hinting** yoki ekran uchun yaratilgan shriftga.

Neytral groteskalar (Inter, Source Sans 3, IBM Plex Sans, PT Sans) interfeyslar uchun ishonchli tanlov. Serifli matn shriftlari uzun o‘qish ko‘p bo‘lgan joylarda yaxshi: bloglar, mediya.

## 2-qadam. Sarlavha shriftini kontrast bo‘yicha tanlang

Deyarli bir xil ikki shrift xatoga o‘xshaydi, butunlay boshqa-boshqa ikki shrift esa tartibsizlikka. **Bitta kuchli kontrast** izlang:

| Kontrast turi | Misol | Ta’siri |
|---|---|---|
| Struktura: serif + sans | Playfair Display + Source Sans 3 | klassik, jurnal uslubi |
| Qalinlik: qalin aksidens + yengil matn | Montserrat ExtraBold + Lora | ishonchli, yorqin |
| Kenglik: tor + oddiy | tor groteska + Inter | zich, plakatga o‘xshash |
| Bitta oila, turli uslublar | IBM Plex Serif + IBM Plex Sans | yaxlit, xavfsiz |

**Superoila** (serif va sans versiyalari bor bitta shrift oilasi) — taxminlarsiz uyg‘unlikka erishishning eng oson yo‘li.

## 3-qadam. Kayfiyatni hisobga oling

Shriftlarning o‘z assotsiatsiyalari bor. Ularni shaxsiy didga emas, brendga moslang:

- **geometrik groteska** (dumaloq O, oddiy shakllar): zamonaviy, texnologik, do‘stona;
- **gumanistik groteska** (kalligrafik ildizlar): iliq, ochiq, o‘qilishi oson;
- **kontrastli serif**: premium, moda, mediya;
- **slab serif**: mustahkam, amaliy, biroz retro;
- aksent sifatida **monospace**: texnik, dasturchilar uchun.

Juftlikni saytning real ekranida sinang: birinchi ekran, kartochka, forma, uzun abzats. Namunada chiroyli ko‘ringan juftlik zich interfeysda ishlamasligi mumkin.

## 4-qadam. Litsenziyani tekshiring

- **Google Fonts**’dagi shriftlar asosan **SIL Open Font License** asosida tarqatiladi, u tijorat maqsadida foydalanish va o‘z serveringizda joylashtirishga ruxsat beradi.
- Tijorat shriftlarida ko‘pincha **desktop**, **veb** va **ilova** uchun alohida litsenziyalar bo‘ladi. Desktop litsenziyasi shriftni saytga joylash huquqini bermaydi.
- Veb-litsenziyalar ko‘rishlar soni yoki domenlar bilan cheklangan bo‘lishi mumkin. Shartlarni ishga tushirishdan keyin emas, oldin o‘qing.
- Litsenziya faylini repozitoriyada shrift fayllari yonida saqlang.

## 5-qadam. Tillar va belgilarni tekshiring

Sayt ko‘p tilli bo‘lsa, har bir shrift barcha tillarni qo‘llab-quvvatlashi kerak. Rus tili uchun **kirill** yozuvi, o‘zbek lotin yozuvi uchun o‘ va g‘ dagi to‘g‘ri tutuq belgilari kerak. Ko‘plab aksidens shriftlar faqat lotin yozuvida bo‘ladi. Har bir tilda real gap yozing va boshqa shriftdan to‘satdan almashib qolgan harflarni qidiring.

## 6-qadam. Tezlikni kuzating

Har bir qalinlik — yuklanadigan yana bitta fayl.

- **WOFF2** formatidan foydalaning.
- Faqat kerakli qalinliklarni ulang, odatda oilaga 2–3 ta, yoki bitta **variable font**.
- Kerakli yozuvlar uchun **subsetting** qiling.
- Matn darhol zaxira shrift bilan ko‘rinishi uchun `font-display: swap` qo‘ying.
- Birinchi ekrandagi bir-ikki fayl uchun **preload** qiling.
- Iloji bo‘lsa, shriftlarni **o‘z domeningizdan** bering.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

body { font-family: "Inter", system-ui, sans-serif; }
```

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

## Sinovdan o‘tgan bepul juftliklar

| Sarlavhalar | Matn | Xarakter |
|---|---|---|
| Playfair Display | Source Sans 3 | jurnal uslubi, nafis |
| Manrope | Inter | toza, mahsulot, texnologik |
| Montserrat | Lora | yorqin sarlavhalar, iliq o‘qish |
| Roboto Slab | Roboto | amaliy, neytral |
| PT Serif | PT Sans | birga yaratilgan, kuchli kirill |
| IBM Plex Serif | IBM Plex Sans | korporativ, texnik |

Belgilar to‘plami versiyadan versiyaga o‘zgaradi, shuning uchun ishlatishdan oldin shrift sahifasida kirill yoki Latin Extended qo‘llab-quvvatlanishini tekshiring.

## Ko‘p uchraydigan xatolar

- Bitta sahifada uch va undan ortiq shrift oilasi.
- Avval sarlavha shriftini tanlab, matn shriftini unga moslashtirish.
- Asosiy matn uchun aksidens shrift.
- Barcha qalinliklarni «har ehtimolga qarshi» ulash.
- Sayt tillaridan biri qo‘llab-quvvatlanmasligini unutish.

## FAQ

### Bitta shrift bilan cheklansa bo‘ladimi?

Ha. Bir nechta qalinlikka ega yaxshi shrift oilasi va aniq o‘lchamlar shkalasi ko‘pincha yetarli va tezroq yuklanadi. Bunda kontrastni o‘lcham va qalinlik yaratadi.

### Google Fonts tijorat saytlari uchun bepulmi?

Ko‘pchiligi tijorat maqsadida foydalanishga ruxsat beruvchi ochiq litsenziyalar bilan nashr etilgan, lekin ishga tushirishdan oldin aniq shriftning litsenziyasini tekshiring.

### Nechta qalinlik ulash kerak?

Dizayn talab qilgancha, ortiq emas. Matn uchun regular va bold hamda sarlavha uchun bitta qalinlik ko‘pchilik saytlarga yetadi; variable font bir nechta statik faylni almashtira oladi.
