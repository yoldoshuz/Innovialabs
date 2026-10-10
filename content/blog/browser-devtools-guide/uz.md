---
title: Chrome DevTools: veb-dasturchi uchun qo‘llanma
description: Chrome DevTools’dagi Elements, Console, Network, Performance, Application va Lighthouse panellaridan real debugging misollarida foydalanish.
summary: Chrome DevTools — brauzerga o‘rnatilgan vositalar to‘plami: Elements maket uchun, Console xatolar uchun, Network so‘rovlar uchun, Performance tezlik uchun, Application xotira uchun, Lighthouse audit uchun.
---

## DevTools nima va uni qanday ochish mumkin

**Chrome DevTools** — Chrome va Chromium asosidagi boshqa brauzerlarga o‘rnatilgan dasturchi vositalari. **F12** tugmasi, **Ctrl+Shift+I** (macOS’da **Cmd+Option+I**) yoki o‘ng tugma bosib, «Kodni ko‘rish» bandi orqali ochiladi.

**Buyruqlar menyusini** darhol eslab qoling: **Ctrl+Shift+P** (**Cmd+Shift+P**). U orqali istalgan funksiyani nomi bo‘yicha topish mumkin — skrinshot olish, JavaScript’ni o‘chirish, mavzuni almashtirish.

Quyida ko‘pchilik vazifalarni yopadigan oltita panel va har biri uchun aniq misol.

## Elements: maket va uslublar

Jonli DOM va qo‘llanilgan CSS qoidalarini ko‘rsatadi.

**Misol: tugma o‘ngga «surilib» ketgan.**

1. Inspektor bilan elementni tanlang (strelka belgisi yoki **Ctrl+Shift+C**).
2. **Styles** blokida qaysi qoidalar qo‘llanilgani va qaysilari chizib tashlanganini ko‘ring — ularni aniqroq qoida bosib ketgan.
3. **Computed** yorlig‘ida yakuniy `margin`, `width` va `display` qiymatlarini tekshiring.
4. Flex va grid konteynerlar uchun element yonidagi belgi orqali overlay’ni yoqing — to‘r chiziqlari to‘g‘ridan-to‘g‘ri sahifada ko‘rinadi.

Styles’dagi o‘zgarishlar faqat qayta yuklashgacha amal qiladi — tajriba uchun qulay.

## Console: xatolar va tezkor tekshiruvlar

Bu yerda JavaScript xatolari, ogohlantirishlar va sizning `console.log` chiqishlaringiz ko‘rinadi.

**Misol: forma yuborilmayapti.**

- Qizil xatoni toping va o‘ngdagi havolani bosing — manba kodidagi aniq qator ochiladi.
- Elements’da elementni tanlang, so‘ng konsolda `$0` yozing — unga havola olasiz.
- `console.table(array)` obyektlar massivini qulay ko‘rsatadi.
- Darajalar filtri (Errors, Warnings) shovqinni olib tashlaydi.

## Network: serverga so‘rovlar

Har bir so‘rovni ko‘rsatadi: status, hajm, vaqt, sarlavhalar va javob tanasi.

**Misol: ma’lumotlar sahifada chiqmayapti.**

1. Network’ni oching va sahifani yangilang.
2. **Fetch/XHR** bo‘yicha filtrlang.
3. Kerakli so‘rovni topib, **status**ini ko‘ring: 4xx — so‘rov yoki huquqlarda muammo, 5xx — serverda.
4. **Payload** yorlig‘ida nima yuborilganini, **Response**da nima kelganini tekshiring.
5. CORS xatosi Console’da chiqadi, so‘rovning o‘zi esa Network’da muvaffaqiyatsiz deb belgilanadi.

Foydali sozlamalar: **Disable cache** — sahifani yangi tashrif buyuruvchi kabi ko‘rish uchun, **Throttling** — sekin tarmoqni emulyatsiya qilish uchun. So‘rovga o‘ng tugma bosib, **Copy as cURL** tanlasangiz, uni terminaldan takrorlash mumkin.

## Performance: nega sekin ishlayapti

Brauzer bajaradigan hamma narsani yozib oladi: skriptlar bajarilishi, layout, paint.

**Misol: skroll qotib-qotib ishlayapti.**

1. Yozishni boshlang, muammoni takrorlang, to‘xtating.
2. **Main** yo‘lagida uzun vazifalarni qidiring — ular qizil burchak bilan belgilanadi.
3. Vazifani bosing: **Bottom-Up** yoki **Call Tree**da qaysi funksiya eng ko‘p vaqt olgani ko‘rinadi.
4. Skriptdan keyin ketma-ket keladigan binafsha Layout bloklari — layout thrashing belgisi.

Halol o‘lchov uchun **CPU throttling**ni yoqing: kuchli noutbukda zaif telefonlardagi muammolar ko‘rinmaydi.

## Application: xotira va kesh

Cookies, localStorage, sessionStorage, IndexedDB, Service Workers va Cache Storage’ni ko‘rsatadi.

**Misol: foydalanuvchi chiqib ketgan bo‘lsa ham «tizimda» ko‘rinmoqda.**

- **Cookies** bo‘limida sessiya cookie’si o‘chirilganini tekshiring, uning `HttpOnly`, `Secure`, `SameSite` bayroqlari va amal qilish muddatiga qarang.
- **Local Storage**da token qolib ketmaganini tekshiring.
- Storage bo‘limidagi **Clear site data** tugmasi joriy sayt uchun hammasini tozalaydi.
- **Service Workers**da keshlangan versiyani berayotgan eski worker’ni o‘chirish mumkin.

## Lighthouse: avtomatik audit

Ishlash tezligi, foydalanish qulayligi (accessibility), eng yaxshi amaliyotlar va SEO’ni tekshiradi.

**Misol: optimallashtirishni nimadan boshlashni bilish kerak.**

- Kengaytmalar natijani buzmasligi uchun inkognito oynada ishga tushiring.
- Faqat umumiy ballga emas, **Diagnostics** bo‘limi va aniq tavsiyalarga qarang.
- O‘zgarishlardan oldingi va keyingi hisobotlarni bir xil sharoitda solishtiring.

Lighthouse — laboratoriya o‘lchovi. Foydalanuvchilarning real tajribasi farq qilishi mumkin, shuning uchun mavjud bo‘lsa, dala ma’lumotlariga ham qarang. Barcha imkoniyatlar [rasmiy hujjatlarda](https://developer.chrome.com/docs/devtools) keltirilgan.

## Ko‘p uchraydigan xatolar

- Elements’da uslublarni tuzatib, o‘zgarishlarni kodga ko‘chirishni unutish.
- Tezlikni yoqilgan kesh va tez internet bilan o‘lchash.
- Console’dagi ogohlantirishlarni xatoga aylanmaguncha e’tiborsiz qoldirish.
- Saytni sabablarni tahlil qilmay, faqat Lighthouse balli bo‘yicha baholash.

## FAQ

### Boshqa brauzerlarda DevTools bormi?

Ha. Edge, Opera va Chromium asosidagi boshqa brauzerlarda deyarli bir xil to‘plam bor. Firefox va Safari’da o‘xshash panellarga ega o‘z vositalari mavjud, lekin interfeysi boshqacha.

### Saytning mobil versiyasini debug qilsa bo‘ladimi?

Ha. **Device Toolbar** rejimi (**Ctrl+Shift+M**) ekran o‘lchamlari va touch’ni emulyatsiya qiladi. Haqiqiy Android qurilma uchun USB orqali `chrome://inspect` yordamida masofaviy debugging bor.

### DevTools’da biror narsani o‘zgartirish xavflimi?

Yo‘q. O‘zgarishlar faqat sizning brauzeringizda amal qiladi va qayta yuklangach yo‘qoladi. Server va boshqa foydalanuvchilar ularni ko‘rmaydi — aynan shuning uchun DevTools serverdagi ma’lumotlar tekshiruvining o‘rnini bosa olmaydi.
