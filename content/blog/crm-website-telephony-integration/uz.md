---
title: CRM ni sayt, telefoniya va messenjerlar bilan integratsiya qilish
description: Formalar, qo‘ng‘iroqlar va chatlardan arizalar CRM ga qanday o‘zi tushadi: ulanish usullari, dublikatlar, manbalarni kuzatish va tekshiruv ro‘yxati.
summary: Har bir kanal CRM ga tayyor konnektor yoki API orqali ulanadi: forma ma’lumotni vebhuk bilan yuboradi, telefoniya qo‘ng‘iroqda yozuv yaratadi, messenjerlar chat konnektorlari orqali keladi. Baza ifloslanmasligi uchun telefonlarni normallashtirish, dublikatlarni qidirish va har bir ariza manbasini saqlash kerak.
---
## Qisqa javob

CRM integratsiyasi bitta qoidaga tayanadi: **mijozning har qanday murojaati avtomatik ravishda CRM dagi yozuvga aylanadi** — kontakt, manba va mas’ul bilan. Buning uchun uchta oqim ulanadi:

- **Sayt** — formalar ma’lumotni CRM ga API yoki vebhuk orqali yuboradi.
- **Telefoniya** — virtual ATS qo‘ng‘iroq voqealari va suhbat yozuvlarini uzatadi.
- **Messenjerlar** — chatlar CRM ning o‘rnatilgan konnektorlari yoki agregator servis orqali keladi.

Ularning ustida **dublikatlarni bartaraf etish** va **manbalarni kuzatish** ishlaydi, aks holda baza tezda kelib chiqishi noma’lum takrorlarga to‘lib ketadi.

## Saytdagi formalar

Arizani saytdan uzatishning uchta usuli bor:

| Usul | Qanday ishlaydi | Qachon tanlash kerak |
|---|---|---|
| CRM ning o‘rnatilgan formasi | Forma CRM da yaratiladi va saytga kod bilan joylanadi | Tez kerak, forma dizayni muhim emas |
| Vebhuk yoki API | Sizning formangiz serverga yuboradi, server CRM da yozuv yaratadi | O‘z maketingiz, validatsiya, bir vaqtda bir nechta CRM ob’ekti |
| CMS plagini | Sayt dvigateli uchun tayyor modul | Sayt mashhur CMS da, qo‘llab-quvvatlanadigan modul bor |

API orqali yuborishda CRM ga **server qismi** murojaat qilishi muhim: CRM ga kirish kaliti hech qachon brauzerda yuklanadigan kodga tushmasligi kerak. CRM ishlamay qolsa, arizani saqlab, qayta yuborish kerak — yo‘qotmaslik kerak.

## Telefoniya

Virtual ATS CRM ga tayyor ilova yoki API orqali ulanadi. Odatiy mantiq:

1. Kiruvchi qo‘ng‘iroq → CRM raqam bo‘yicha kontaktni qidiradi.
2. Raqam topildi → menejer qalqib chiquvchi oynada mijoz kartochkasini ko‘radi.
3. Raqam yangi → «Qo‘ng‘iroq» manbasi bilan lid yoki bitim yaratiladi.
4. Javobsiz qo‘ng‘iroq → muddatli qayta qo‘ng‘iroq qilish vazifasi.
5. Suhbatdan keyin → qo‘ng‘iroq yozuvi va davomiyligi kartochkaga biriktiriladi.

Chiquvchi qo‘ng‘iroqlarni ham CRM dan qiling: shunda butun muloqot tarixi bir joyda qoladi.

## Messenjerlar va chatlar

Telegram, WhatsApp, Instagram va saytdagi onlayn-chat CRM dagi chat konnektorlari yoki agregator servis orqali ulanadi. WhatsApp uchun odatda provayder orqali rasmiy WhatsApp Business API kerak bo‘ladi.

Dialog **mavjud kontaktga bog‘lanishini** tekshiring — har bir xabarda yangi mijoz yaratmasin — hamda menejerning CRM dan yozgan javoblari mijozga o‘sha messenjerda yetib borsin.

## Dublikatlarni bartaraf etish

Bitta odam forma to‘ldirishi, qo‘ng‘iroq qilishi va Telegramda yozishi mumkin. Dublikat qoidalarisiz uchta kartochka paydo bo‘ladi.

- **Telefonlarni** mamlakat kodi bilan yagona formatga keltiring: `+998901234567`, bo‘sh joy, qavs va chiziqchalarsiz.
- **Email ni kichik harflarga** o‘tkazing va bo‘sh joylarni olib tashlang.
- Yozuv yaratishdan **oldin** kontaktni qidiring: avval telefon, keyin email, keyin messenjer identifikatori bo‘yicha.
- Moslik topilsa — nusxa yaratmang, yangi murojaatni mavjud kontaktga qo‘shing.
- Baribir o‘tib ketganlari uchun CRM ning o‘rnatilgan **dublikat qidiruvini** muntazam ishga tushiring.

## Manbalarni kuzatish

Qaysi reklama mijoz olib kelayotganini bilish uchun har bir ariza o‘z manbasiga ega bo‘lishi kerak.

- **Formalar**: saytga kirishda UTM-belgilarni saqlang va ularni yashirin maydonlarda uzating.
- **Qo‘ng‘iroqlar**: kolltreking ishlating — har bir kanal uchun alohida raqam yoki har bir tashrif uchun almashtiriladigan raqam.
- **Chatlar**: manba odatda kanalning o‘zi (Telegram, Instagram), reklama uchun esa start parametri yoki maxsus havola orqali aniqlanadi.

UTM-belgilarni forma yashirin maydonlariga saqlashning oddiy misoli:

```js
const params = new URLSearchParams(location.search);
for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
  const value = params.get(key);
  if (value) sessionStorage.setItem(key, value);
  const input = document.querySelector(`input[name="${key}"]`);
  if (input) input.value = sessionStorage.getItem(key) ?? "";
}
```

## Sozlashdan keyin nimani tekshirish kerak

- **Har bir kanal** orqali test ariza yuboring: forma, qo‘ng‘iroq, har bir messenjer.
- **Manba** va UTM-belgilar yozilganini tekshiring.
- O‘sha raqamdan qayta murojaat qiling — yangi kartochka yaratilmasligi kerak.
- **Mas’ul** tayinlanishi va vazifa yaratilishiga ishonch hosil qiling.
- Javobsiz qo‘ng‘iroq qayta qo‘ng‘iroq vazifasiga aylanadi.
- CRM ulanishini uzing yoki noto‘g‘ri kalit bering — ariza izsiz yo‘qolmasligi kerak.
- Bir haftadan keyin CRM dagi arizalar sonini telefoniya va sayt analitikasi bilan solishtiring.

## FAQ

### CRM da tayyor integratsiyalar bo‘lsa, dasturchi kerakmi?

Odatiy ssenariylar uchun ko‘pincha tayyor konnektorlar yetarli. Ishlab chiqish o‘z formangiz, murakkab dublikat qoidalari, bir vaqtda bir nechta CRM ob’ektini yaratish yoki tayyor integratsiyasi yo‘q tizimlarni bog‘lash kerak bo‘lganda zarur.

### Nega CRM da arizalar sayt analitikasidagidan kam?

Ko‘p uchraydigan sabablar: qayta urinishsiz yuborish xatolari, brauzerda skriptlarning bloklanishi, ma’lumotni faqat pochtaga yuboradigan formalar yoki analitikada validatsiyadan o‘tmagan yuborishlarning hisobga olinishi. Muayyan sanalar bo‘yicha server va CRM loglarini solishtiring.

### Dublikatlarni qaysi maydon bo‘yicha qidirgan ma’qul?

Odatda normallashtirilgan telefon, keyin email bo‘yicha. Ism bunga yaramaydi: u turli odamlarda ko‘p mos keladi, bitta odamda esa turlicha yoziladi.
