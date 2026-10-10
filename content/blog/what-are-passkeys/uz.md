---
title: Passkeys nima va ular parollarni almashtiradimi
description: Passkeys ochiq kalitli kriptografiyadan qanday foydalanadi, nega fishing ularga qarshi ishlamaydi, qanday sinxronlanadi va ularni joriy etishga nima kerak.
summary: Passkey — parol o‘rniga ishlatiladigan kriptografik kalitlar juftligi: yopiq kalit qurilmangizda qoladi va barmoq izi, yuz yoki PIN-kod bilan ochiladi, sayt faqat ochiq kalitni saqlaydi, soxta sayt esa undan foydalana olmaydi, shuning uchun fishing va parollarning sizib chiqishi ish bermay qoladi.
---
## Qisqa javob

**Passkey** (kirish kaliti) — parolsiz kirish usuli. Siz kiritadigan maxfiy so‘z o‘rniga qurilma har bir sayt uchun **kalitlar juftligini** yaratadi: yopiq kalit sizda qoladi, ochiq kalitni sayt saqlaydi. Kirishni telefon yoki noutbukni ochadigan narsa bilan — barmoq izi, yuz yoki PIN-kod bilan tasdiqlaysiz.

Parollar bir kunda yo‘qolmaydi, lekin yirik servislarda passkeys allaqachon asosiy kirish usuliga aylanmoqda.

## Bu qanday ishlaydi

Passkeys **FIDO2 / WebAuthn** standartlari va ochiq kalitli kriptografiyaga asoslangan:

1. **Ro‘yxatdan o‘tish.** Qurilma sayt uchun kalitlar juftligini yaratadi. **Yopiq kalit** qurilmaning himoyalangan xotirasida yoki parol menejerida qoladi. Sayt faqat **ochiq kalitni** oladi.
2. **Kirish.** Sayt tasodifiy **challenge** (so‘rov) yuboradi. Qurilma kirishni biometriya yoki PIN-kod bilan tasdiqlashni so‘raydi va so‘rovni yopiq kalit bilan imzolaydi.
3. **Tekshirish.** Sayt imzoni saqlangan ochiq kalit bilan tekshiradi. Mos keldi — siz kirdingiz.

Barmoq izi yoki yuz **hech qachon qurilmadan chiqmaydi** — ular faqat lokal kalitni ochadi. Saytda esa sizning nomingizdan kirishga imkon beradigan hech narsa yo‘q.

## Nega fishing ishlamaydi

Parolni har qanday o‘xshash sahifaga kiritish mumkin. Passkey bilan bunday bo‘lmaydi:

- Har bir passkey **sayt domeniga bog‘langan**. Brauzer `example.com` passkey’ini `examp1e-login.com` da taklif qilmaydi.
- **Kiritish yoki aytib berish uchun hech narsa yo‘q**, demak, aldab olinadigan narsa ham yo‘q.
- Sayt bazasi sizib chiqsa, hujumchilar faqat kirish uchun foydasiz **ochiq kalitlarni** oladi.
- Har bir saytning o‘z kalitlar juftligi bor — takrorlash ham, credential stuffing ham yo‘q.

## Sinxronlash va qurilmalar

- **Sinxronlanadigan passkeys** iCloud Keychain, Google parol menejeri yoki uchinchi tomon parol menejerida saqlanadi va shu akkauntga ega barcha qurilmalaringizda paydo bo‘ladi.
- **Qurilmaga bog‘langan passkeys** bitta qurilmada, masalan apparat kalitda yashaydi va hech qachon nusxalanmaydi. Kompaniyalar ulardan yuqori xavfli akkauntlar uchun foydalanadi.
- **Boshqa qurilmadan kirish:** kompyuterda passkey bo‘lmasa, u QR-kod ko‘rsatishi mumkin; siz uni telefon bilan skanerlaysiz, telefon esa kirishni tasdiqlaydi va Bluetooth orqali jismonan yaqin turganini tekshiradi.

## Hozirgi qo‘llab-quvvatlash

Passkeys asosiy operatsion tizimlar va brauzerlarning joriy versiyalarida ishlaydi, ko‘plab yirik servislar — pochta, marketpleyslar, to‘lov va dasturchilar platformalari — ularni allaqachon taklif qiladi. Tafsilotlar farq qiladi: ba’zi joyda passkey ikkinchi omil, ba’zi joyda parolning to‘liq o‘rnini bosadi.

Hozircha e’tibor talab qiladigan jihatlar:

- **Akkauntni tiklash** — barcha qurilmalarni yo‘qotsangiz ham, servisga kirishni qaytarishning xavfsiz usuli kerak.
- **Ekotizimlar o‘rtasida ko‘chish** — bitta platforma ichida passkeys yaxshi sinxronlanadi, provayderlar o‘rtasida ko‘chirish esa hali standartlashtirilmoqda.
- **Umumiy akkauntlar** — ayrim parol menejerlarida passkeys’ni ulashish mumkin, lekin bu parolni berishdan murakkabroq.

## Passkey orqali kirish uchun dasturchilarga nima kerak

1. Imzolarni qo‘lda tekshirish o‘rniga tilingiz uchun **qo‘llab-quvvatlanadigan WebAuthn server kutubxonasidan foydalaning**.
2. **Ro‘yxatdan o‘tish endpoint’i:** parametrlarni shakllantiring (challenge, tekshiruvchi tomon ID’si — domeningiz, foydalanuvchi identifikatori), brauzerda `navigator.credentials.create()` ni chaqiring, javobni serverda tekshiring.
3. **Har bir kalit uchun saqlang:** kalit ID’si, ochiq kalit, imzolar hisoblagichi, foydalanuvchi ID’si, yaratilgan sana va tushunarli nom. **Bitta akkauntga bir nechta passkey** qo‘shishga ruxsat bering.
4. **Kirish endpoint’i:** yangi challenge bering, `navigator.credentials.get()` ni chaqiring, imzo va challenge’ni tekshiring.
5. **Avtoto‘ldirish:** brauzer passkeys’ni to‘g‘ridan-to‘g‘ri login maydonida taklif qilsin.

```html
<input type="text" name="username" autocomplete="username webauthn">
```

```js
const credential = await navigator.credentials.get({
  publicKey: optionsFromServer, // challenge, rpId va h.k.
  mediation: "conditional",
});
```

6. **Zaxira kirish usulini qoldiring** — 2FA bilan parol yoki pochta orqali kirish — va tushunarli tiklash ssenariysini. Passkey yaratishni foydalanuvchi allaqachon tasdiqlangan, muvaffaqiyatli kirishdan keyin taklif qiling.
7. Mobil ilovalarda ilovani domen bilan bog‘lang (iOS’da associated domains, Android’da Digital Asset Links), shunda bir xil passkeys saytda ham, ilovada ham ishlaydi.

Qo‘llab-quvvatlash haqidagi dolzarb ma’lumotlar va joriy etish namunalari dasturchilar uchun [passkeys.dev](https://passkeys.dev) qo‘llanmasida jamlangan.

## FAQ

### Telefonni o‘g‘irlashsa, passkey xavfsizmi?

Qurilmani biometriya yoki PIN-kodingiz bilan ochmasdan passkey’dan foydalanib bo‘lmaydi. Telefonni ishonchli ekran qulfi bilan himoyalang va qurilmani akkauntlaringizdan masofadan uzib qo‘ya olishingizga ishonch hosil qiling.

### Passkeys bo‘lsa, 2FA kerakmi?

Passkey allaqachon ikki omilni birlashtiradi: sizda bor narsa (qurilma) va siz biladigan yoki o‘zingizga xos narsa (PIN yoki biometriya). Odatda passkey orqali kirgandan keyin servislar qo‘shimcha kod so‘ramaydi.

### Parollar butunlay yo‘qoladimi?

Tez orada emas. Eski tizimlar, umumiy akkauntlar va tiklash ssenariylari hali ham parollarga bog‘liq. Oldinda passkeys asosiy variant, parollar esa zaxira bo‘lib qoladigan uzoq davr turibdi.
