---
title: Figma’da interaktiv prototip qanday yaratiladi
description: Figma’da kliklanadigan prototip: flow, triggerlar, harakatlar, o‘tishlar, Smart Animate, overleylar va skroll, hamda prototipni test uchun ulashish.
summary: Prototype bo‘limida freymlarni interaksiyalar (trigger, harakat, animatsiya) bilan bog‘laysiz, flow boshlanish nuqtasini belgilaysiz, overley va skroll qo‘shasiz, so‘ng havolani testerlarga yuborasiz.
---

## Qisqacha javob

Figma’dagi interaktiv prototip — **interaksiyalar** bilan bog‘langan freymlar to‘plami. Har bir interaksiya uch qismdan iborat: **trigger** (foydalanuvchi nima qiladi), **harakat** (nima sodir bo‘ladi) va **animatsiya** (qanday ko‘rinadi). Hammasi o‘ng paneldagi **Prototype** bo‘limida sozlanadi, keyin flow boshlanishini belgilab, **Present** tugmasini bosasiz. Kod kerak emas.

## 1-qadam. Freymlarni tayyorlang

- Har bir ekran guruh emas, yuqori darajadagi **freym** bo‘lsin.
- Test qilinadigan qurilma uchun yagona freym o‘lchamini tanlang, masalan telefon preseti.
- Freymlarni tushunarli nomlang: `01 Bosh sahifa`, `02 Katalog`, `03 Mahsulot`. Nomlar prototipda va havolalarda ko‘rinadi.
- Takrorlanuvchi elementlarni (header, tab-bar) komponent qiling, shunda o‘zgarish hamma joyda qo‘llanadi.

## 2-qadam. Flow yarating

**Flow** — boshlang‘ich ekrani bor prototip bo‘ylab yo‘l. Birinchi freymni tanlang va Prototype bo‘limida **flow starting point** qo‘shing. Bitta faylda bir nechta flow bo‘lishi mumkin, masalan «Ro‘yxatdan o‘tish» va «Buyurtma berish», har birini alohida test qilish mumkin.

## 3-qadam. Ekranlarni bog‘lang

Prototype bo‘limiga o‘ting, qatlamni (tugma, kartochka) tanlang va bog‘lanishni maqsadli freymga torting. So‘ng tafsilotlarni sozlang:

| Qism | Asosiy variantlar | Qachon ishlatiladi |
|---|---|---|
| Trigger | On click / On tap, On drag, While hovering, While pressing, Mouse enter / leave, Key / Gamepad, After delay | Bosish — ko‘p harakatlar uchun, hover — desktop uchun, kechikish — splash ekran uchun |
| Harakat | Navigate to, Back, Scroll to, Open link, Open overlay, Swap overlay, Close overlay, Change to | Navigate — ekranlar uchun, Change to — komponent variantlari uchun |
| Animatsiya | Instant, Dissolve, Smart animate, Move in / out, Push, Slide in / out | Push va Slide — ekran almashuvi uchun, Dissolve — yumshoq almashtirish uchun |

**Easing** va **davomiylikni** ham belgilang. Ease-out bilan qisqa animatsiyalar tezkor his qilinadi, uzunlari esa testda zeriktiradi.

Maslahat: «orqaga» strelkasiga aniq freymga havola emas, **Back** harakatini bering — shunda u istalgan yo‘ldan ishlaydi.

## 4-qadam. Smart Animate’dan foydalaning

**Smart Animate** ikki freymdagi **nomi va joylashuv ierarxiyasi bir xil** qatlamlarni topadi va ularning holati, o‘lchami, burilishi, shaffofligi va rangidagi farqni animatsiya qiladi.

Natijaga erishish uchun:

1. Freymni nusxalang.
2. Nusxadagi qatlamni o‘zgartiring: suring, kattalashtiring, shaffof qiling.
3. Ikkala freymda qatlam nomlarini bir xil saqlang.
4. Freymlarni Smart Animate bilan bog‘lang.

Qayerda o‘rinli: ochiladigan kartochkalar, o‘tkazgichlar, faol tab indikatori, onboarding karusellari. Agar element harakatlanish o‘rniga «sakrasa», birinchi navbatda qatlam nomlarini tekshiring.

Bitta element ichidagi kichik holat o‘zgarishlari uchun **interaktiv komponentlardan** foydalaning: variantlar yarating (Default, Hover, Pressed), ularni **Change to** bilan bog‘lang — barcha nusxalar interaktiv bo‘ladi.

## 5-qadam. Overleylar qo‘shing

**Overley** freymni joriy ekran ustida ko‘rsatadi: modal oynalar, bottom sheet, ochiladigan menyular, bildirishnomalar.

- **Open overlay** harakati va maqsadli freymni tanlash.
- **Joylashuv**: markazda, yuqorida, pastda yoki qo‘lda.
- Modal va menyular uchun **tashqariga bosilganda yopilish**.
- E’tiborni jamlash uchun **fonni qoraytirish**.
- **Swap overlay** bir overleyni boshqasiga almashtiradi, masalan modalning 1-qadamini 2-qadamga.

## 6-qadam. Skrollni sozlang

Kontent freymdan balandroq (yoki kengroq) bo‘lsa va **clip content** yoqilgan bo‘lsa, freym prototipda aylantiriladi.

- Prototype bo‘limida **overflow** ni belgilang: vertikal, gorizontal yoki ikkalasi.
- Uzun sahifa uchun freym balandligini qurilma ekraniga teng qiling, kontent esa pastga davom etsin.
- Gorizontal karusel uchun kartochkalarni gorizontal overflow’li ichki freymga joylang.
- Header va tab-bar’ni **fixed** yoki **sticky** qiling, shunda ular skrollda joyida qoladi.
- **Scroll to** «Yuqoriga» kabi langar havolalar uchun mos.

## 7-qadam. Ulashing va test o‘tkazing

- **Present** prototipni ishga tushiradi; qurilma ramkasi va kerakli flow’ni tanlang.
- **Share** tugmasi orqali prototipga kirish bering; ko‘rib chiquvchilarga tahrirlash huquqi shart emas.
- Havolani brauzerda yoki Figma mobil ilovasida ochib, haqiqiy telefonda sinash mumkin.
- Yuzabiliti test paytida kliklanadigan zonalar yoritilishini o‘chiring, ishtirokchilar o‘zlari izlasin.
- **Topshiriqlar ssenariysini** tayyorlang: «Ko‘k tugmani bosing» emas, «Mahsulotni toping va savatga qo‘shing».

## Ko‘p uchraydigan xatolar

- **Boshi berk ekranlar**: chiqib bo‘lmaydigan ekran. Testdan oldin har bir flow’ni o‘zingiz o‘tib chiqing.
- **Qatlam nomlari har xil**, shu sababli Smart Animate ishlamaydi.
- **Hamma narsani prototiplash**: faqat haqiqatan test qilinadigan yo‘llarni bog‘lang.
- **Noto‘g‘ri freym o‘lchami**, natijada skroll va fiksatsiyalangan elementlar kutilmagan tarzda ishlaydi.

## FAQ

### Figma prototipi testda haqiqiy ilovani almashtira oladimi?

Navigatsiya, struktura va matnlarni tekshirish uchun — ha. Real ma’lumotlar, tezlik va murakkab mantiqni u takrorlay olmaydi, ular keyinroq ishchi versiyada tekshiriladi.

### Nega Smart Animate qatlamlarni animatsiya qilmayapti?

Ko‘pincha ikki freymdagi qatlamlar turlicha nomlangan yoki turli ichma-ich darajalarda joylashgan bo‘ladi. Nomlar va strukturani bir xil qiling va qayta urinib ko‘ring.

### Testerlarga Figma akkaunti kerakmi?

Bu fayl ulashish sozlamalariga bog‘liq. Agar havola orqali ko‘rish uchun kirish ochiq bo‘lsa, prototip odatda brauzerda ochiladi; havolani yuborishdan oldin sozlamalarni tekshiring.
