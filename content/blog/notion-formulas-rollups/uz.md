---
title: Notion’da formulalar va rollup’lar: misollar bilan qo‘llanma
description: Notion formulalari sintaksisi, sanalar va shartlar bilan ishlash, relations orqali rollup’lar hamda muddat, progress-bar va byudjet uchun tayyor formulalar.
summary: Formula bitta yozuv ichida qiymatni hisoblaydi, rollup esa bog‘langan yozuvlardan ma’lumot yig‘ib, ularni jamlaydi; birgalikda ular Notion’da qo‘lda hisoblamasdan avtomatik muddatlar, loyiha progressi va byudjet qoldig‘ini beradi.
---
## Asosiysi

- **Formula** — shu yozuvning boshqa xususiyatlari asosida qiymat hisoblaydigan xususiyat: matn, raqam, sana yoki belgi.
- **Rollup** — **relation** orqali bog‘langan yozuvlardan qiymatlarni olib, ularni jamlaydigan xususiyat: yig‘indi, soni, foiz, eng kech sana.

Odatiy bog‘lam: “Loyiha → Vazifalar” relation’i, bajarilgan vazifalar ulushini hisoblaydigan rollup va uni progress-barga aylantiradigan formula.

## Formulalar sintaksisi

Xususiyatlar `prop("Nomi")` orqali chaqiriladi. `+ - * /` operatorlari, `== != > <` taqqoslashlari, `and`, `or`, `not` mantiqiy amallari va metodlar uchun nuqtali yozuv mavjud.

```js
prop("Narx") * prop("Soni")
prop("Nomi") + " — " + prop("Mijoz")
prop("Teglar").length()
```

Foydali funksiyalar:

| Funksiya | Nima qiladi |
|---|---|
| `if(shart, ha, yo‘q)` | Ikki tarmoqli shart |
| `ifs(s1, q1, s2, q2, aks_holda)` | Ichma-ich if’siz shartlar zanjiri |
| `empty(x)` | Bo‘sh qiymatni tekshiradi |
| `let(nom, qiymat, ifoda)` | Formula ichidagi o‘zgaruvchi |
| `format(x)` | Raqam yoki sanani matnga aylantiradi |
| `round(x)`, `abs(x)` | Yaxlitlash va modul |

O‘qish oson bo‘lishi uchun uzun formulalarni qatorlarga bo‘ling — formula muharriri bunga imkon beradi.

## Sanalar

- `now()` — joriy sana va vaqt, `today()` — bugungi sana.
- `dateBetween(sana1, sana2, "days")` — `sana1 − sana2` farqi kunlarda, haftalarda, oylarda.
- `dateAdd(sana, 14, "days")` va `dateSubtract(...)` — sanani siljitish.
- `dateStart(...)` va `dateEnd(...)` — sanalar oralig‘ining boshi va oxiri.
- `formatDate(sana, "DD.MM.YYYY")` — kerakli formatda chiqarish.

Misol: hujjatni oxirgi tekshiruvdan 90 kun o‘tib qayta tekshirish sanasi.

```js
dateAdd(prop("Tekshirilgan"), 90, "days")
```

## Relations orqali rollup’lar

Rollup yaratish uchun:

1. Kerakli bazaga **relation** borligiga ishonch hosil qiling.
2. **Rollup** xususiyatini qo‘shing va relation’ni tanlang.
3. Bog‘langan bazaning xususiyatini va hisoblash usulini tanlang.

Hisoblash variantlari: asl qiymatlarni ko‘rsatish, **Count all**, **Count values**, **Sum**, **Average**, **Min / Max**, **Earliest / Latest date**, chekboks’lar uchun **Percent checked**, status guruhlari bo‘yicha foizlar.

Misollar:

- “Loyihalar”da: vazifalar bo‘yicha soatlar yig‘indisi, vazifalarning eng kech sanasi, bajarilganlar foizi.
- “Mijozlar”da: barcha hisob-fakturalar yig‘indisi, oxirgi bitim sanasi.

Formulalar relation bilan to‘g‘ridan-to‘g‘ri ham ishlay oladi: `prop("Vazifalar")` sahifalar ro‘yxatini qaytaradi, unga `filter`, `map` va `length` qo‘llash mumkin.

## Tayyor formulalar

### Muddat holati

“Muddati o‘tgan”, “Bugun” yoki necha kun qolganini ko‘rsatadi. `Muddat` (Date) va `Status` (Status) xususiyatlari kerak.

```js
if(empty(prop("Muddat")) or prop("Status") == "Tayyor", "",
  let(d, dateBetween(prop("Muddat"), today(), "days"),
    ifs(
      d < 0, "Muddati " + format(abs(d)) + " kun o‘tgan",
      d == 0, "Bugun",
      format(d) + " kun qoldi"
    )
  )
)
```

### Loyiha vazifalari bo‘yicha progress

Bajarilgan vazifalar ulushi 0 dan 1 gacha, alohida rollup’siz to‘g‘ridan-to‘g‘ri relation bo‘yicha:

```js
let(t, prop("Vazifalar"),
  if(t.length() == 0, 0,
    t.filter(current.prop("Status") == "Tayyor").length() / t.length()
  )
)
```

Raqam formatini foiz ko‘rinishiga o‘rnating.

### Progress-bar

`Progress` xususiyatidan 0 dan 1 gacha raqamni olib, o‘n bo‘lakli shkala chizadi:

```js
let(p, round(prop("Progress") * 10),
  repeat("●", p) + repeat("○", 10 - p) + " " +
  format(round(prop("Progress") * 100)) + "%"
)
```

### Byudjet qoldig‘i

`Sarflangan` — bog‘langan bazadagi xarajat summalari bo‘yicha **Sum** rollup, `Byudjet` — raqam.

```js
if(empty(prop("Byudjet")) or prop("Byudjet") == 0, "Byudjet belgilanmagan",
  let(left, prop("Byudjet") - prop("Sarflangan"),
    if(left < 0,
      "Ortiqcha sarf: " + format(abs(left)),
      format(round(prop("Sarflangan") / prop("Byudjet") * 100)) + "% sarflandi"
    )
  )
)
```

## Ko‘p uchraydigan xatolar

- **Nolga bo‘lish** — maxrajni doim `if` bilan tekshiring.
- **Nomi o‘zgargan status bilan taqqoslash** — formula aniq qiymatni qidiradi. “Tayyor”ni qayta nomlasangiz, formulalarni ham yangilang.
- **Turlarni aralashtirish** — matnga raqamni `format()`’siz qo‘shib bo‘lmaydi.
- **Uzun zanjirlar** — bir nechta baza orqali rollup va formulalar zanjiri sekinroq ishlaydi va xatoni topish qiyinlashadi. Agar hisob-kitob moliyaviy modelga o‘xshab qolsa, uning joyi jadval yoki BI vositasida.

## FAQ

### Formula rollup’dan nimasi bilan farq qiladi?

Formula yozuvning o‘z xususiyatlari asosida qiymat hisoblaydi. Rollup bog‘langan yozuvlardan qiymatlarni yig‘ib, jamlaydi. Ko‘pincha rollup xom raqam beradi, formula esa uni tushunarli natijaga aylantiradi.

### Rollup’larsiz ishlash mumkinmi?

Ko‘p hollarda ha: formulalar relation’ga to‘g‘ridan-to‘g‘ri murojaat qila oladi va bog‘langan yozuvlarni filtrlaydi. Rollup’ni kodsiz sozlash osonroq, shuning uchun odatiy yig‘indi va hisoblar uchun u qulayroq.

### Funksiyalarning to‘liq ro‘yxatini qayerdan topsa bo‘ladi?

Formula muharririda har bir funksiya tavsifi va misoli bilan ichki ma’lumotnoma bor. Dolzarb hujjatlar Notion yordam markazida ham mavjud.
