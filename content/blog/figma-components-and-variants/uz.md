---
title: Figma’da komponentlar va variantlar: ularni qanday sozlash
description: Figma’da asosiy komponentlar, nusxalar, variantlar, komponent xususiyatlari va nomlash qoidalari tugma va kiritish maydoni misolida, tipik xatolar bilan.
summary: Figma’dagi komponent — asosiy element bo‘lib, uni o‘zgartirganda barcha nusxalari (instance) yangilanadi. Variantlar holat va o‘lchamlarni bitta to‘plamga birlashtiradi, komponent xususiyatlari (text, boolean, instance swap) esa nusxalarni uzmasdan sozlash imkonini beradi.
---

## Komponentlar, nusxalar va variantlar

- **Asosiy komponent (main component)** — boshlang‘ich element. Uni o‘zgartirasiz va o‘zgarishlar barcha nusxalarga tarqaladi.
- **Nusxa (instance)** — maketdagi komponent nusxasi. Unda matn, ranglar va boshqa ruxsat etilgan narsalarni o‘zgartirish mumkin (bu **overrides** deyiladi), lekin tuzilma asosiy komponent bilan bog‘liq qoladi.
- **Variantlar to‘plami (component set)** — bog‘liq komponentlar guruhi, masalan barcha tugmalar: asosiy va ikkinchi darajali, turli o‘lcham va holatlarda.
- **Komponent xususiyatlari (component properties)** — nusxaning o‘ng panelida ko‘rinadigan sozlamalar: variantni almashtirish, matnni o‘zgartirish, ikonkani yashirish yoki almashtirish.

Komponentlarsiz har bir tugma qo‘lda tahrirlanadi va bir oydan keyin maketda bir-biridan biroz farq qiladigan o‘nta tugma paydo bo‘ladi.

## 1-qadam: tugmaning asosiy komponenti

1. Tugmani **Auto Layout**’da yig‘ing: matn, ikonka, padding, kenglik bo‘yicha Hug.
2. Freymni belgilang va **Ctrl + Alt + K** ni bosing (Mac’da — **Cmd + Option + K**) yoki yuqori paneldagi «Create component» tugmasini bosing.
3. Komponentni `Button` deb nomlang.
4. Nusxa yaratish uchun komponentni **Assets** panelidan sudrab olib keling yoki Alt bosilgan holda nusxalang.

Asosiy komponentlarni alohida sahifada saqlang, masalan «Components», maketlarda esa faqat nusxalardan foydalaning.

## 2-qadam: variantlar

1. `Button` komponentini belgilang va o‘ng paneldagi **Add variant** ni bosing. Binafsha punktir ramkali to‘plam paydo bo‘ladi.
2. Variant xususiyatlarini qo‘shing va ularni ma’nosiga ko‘ra nomlang:

| Xususiyat | Qiymatlar |
|---|---|
| `Type` | Primary, Secondary, Ghost |
| `Size` | S, M, L |
| `State` | Default, Hover, Pressed, Disabled |

3. Haqiqatan kerak bo‘lgan har bir kombinatsiya uchun variant yarating va ko‘rinishini sozlang.
4. Endi nusxada turi, o‘lchami va holatini ochiladigan ro‘yxatlar orqali almashtirish mumkin.

Barcha kombinatsiyalarni yaratish shart emas. Agar ghost-tugmalar faqat M o‘lchamda bo‘lsa, ortiqchasini qilmang.

## 3-qadam: komponent xususiyatlari

Variantlar **tashqi ko‘rinishni**, xususiyatlar esa **mazmunni** tasvirlaydi. Bu variantlar sonini keskin kamaytiradi.

- **Text** — matnli qatlamni `Label` xususiyatiga bog‘lang. Tugma matni to‘g‘ridan-to‘g‘ri o‘ng panelda o‘zgaradi.
- **Boolean** — `Has icon` xususiyati ikonkani ko‘rsatadi yoki yashiradi. Usiz barcha variantlarni ikki baravar ko‘paytirishga to‘g‘ri kelardi.
- **Instance swap** — `Icon` xususiyati tugma ichiga kirmasdan kutubxonadan istalgan ikonkani tanlash imkonini beradi.

Xususiyatlar asosiy komponent yoki to‘plamning Properties bo‘limidagi «+» orqali yaratiladi va kerakli parametr yonidagi tugma bilan qatlamga bog‘lanadi.

## 4-qadam: kiritish maydoni

`Input` uchun ham xuddi shu yondashuv:

- **Variantlar:** `State` = Default, Focus, Error, Disabled; kerak bo‘lsa `Size`.
- **Text xususiyatlari:** `Label`, `Placeholder`, `Helper text`.
- **Boolean:** `Has helper`, `Has left icon`.
- **Instance swap:** `Left icon`.

Error holati faqat chegara rangini o‘zgartirmaydi, balki ma’no faqat rang bilan berilmasligi uchun ikonkali xato matnini ham ko‘rsatadi. Focus holati yaxshi sezilishi kerak.

## Nomlash qoidalari

- Xususiyat va qiymatlar — qisqa va dasturchiga tushunarli: `Type`, `Size`, `State`, «Variant 1» emas.
- Bir xil xususiyatlar barcha komponentlarda bir xil nomlanadi: tugmada `State=Disabled` bo‘lsa, maydonda ham `State=Disabled`.
- Assets’da guruhlash uchun slesh ishlating: `Form/Input`, `Form/Checkbox`, `Navigation/Tab`.
- Komponent ichidagi qatlamlarni ham nomlang: `Label`, `Icon`, `Container`. Bu override va ishlab chiqishga topshirishda yordam beradi.
- Nomlarni kod bilan kelishtiring. Kodda variant `primary` deb atalsa, Figma’da uni «Main» deb atamang.

## Ko‘p uchraydigan xatolar

- Har qanday tuzatishda **Detach instance**. Uzilgan nusxa endi yangilanmaydi. Sozlama yetishmasa, asosiy komponentga xususiyat qo‘shing.
- **Xususiyatlar o‘rniga variantlar.** Har bir o‘lcham va tur uchun alohida «ikonkali» va «ikonkasiz» variantlar to‘plamni shishiradi. Boolean’dan foydalaning.
- Tizim dizaynining o‘zi o‘zgarganda **asosiy komponent o‘rniga nusxani tahrirlash**.
- **Auto Layout’siz komponentlar** — matn o‘zgarganda buziladi.

## FAQ

### Variant alohida komponentdan nimasi bilan farq qiladi?

Variant — to‘plam ichidagi komponent bo‘lib, boshqalari bilan umumiy xususiyatlar orqali bog‘langan. Bu nusxada elementni qo‘lda almashtirmasdan ular orasida o‘tish imkonini beradi. Alohida komponentlar bunday bog‘lanmagan.

### Asosiy komponent yangilangandan keyin nusxadagi tuzatishlarim saqlanadimi?

Odatda ha: qatlamlar tuzilmasi va nomlari o‘zgarmagan bo‘lsa, matn, rang va ko‘rinish override’lari saqlanadi. Asosiy komponentdagi qatlam qayta nomlansa yoki o‘chirilsa, shu qatlamdagi tuzatishlar yo‘qolishi mumkin.

### Komponentlarni boshqa fayllar bilan qanday ulashish mumkin?

Komponentli faylni kutubxona sifatida e’lon qiling va uni jamoaning boshqa fayllarida ulang. Shunda kutubxonadagi o‘zgarishlar maketlarga qabul qilish mumkin bo‘lgan yangilanishlar sifatida keladi.
