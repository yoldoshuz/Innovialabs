---
title: React va Next.js ilovalarida XSS dan himoyalanish
description: React ma’lumotlarni qayerda o‘zi ekranlaydi, qayerda yo‘q: dangerouslySetInnerHTML, javascript: havolalar, Markdown, DOMPurify bilan tozalash va Next.js’da CSP.
summary: React JSX dagi matnni ekranlaydi, shuning uchun XSS bu himoyani aylanib o‘tganda paydo bo‘ladi: dangerouslySetInnerHTML, xavfli URL’lar, HTML’li Markdown va DOM bilan to‘g‘ridan-to‘g‘ri ishlash. HTML’ni DOMPurify bilan tozalang, havola sxemalarini tekshiring va CSP ni yoqing.
---

## Qisqa javob

React standart holatda ko‘pchilik XSS hujumlaridan himoya qiladi: JSX’da `{value}` sifatida chiqarilgan hamma narsa HTML emas, matnga aylanadi. `<script>` satri sahifada oddiy belgilar bo‘lib ko‘rinadi.

Zaifliklar dasturchi bu himoyani aylanib o‘tgan joylarda paydo bo‘ladi. Bunday joylar kam va ularni kod bo‘yicha qidiruv bilan oson topish mumkin.

## React qayerda avtomatik ekranlaydi

- JSX ichidagi matn: `<p>{comment}</p>`.
- Ko‘pchilik atributlar qiymati: `<input value={name} />`, `title`, `alt`, `className`.
- Props orqali uzatilib, xuddi shu usulda chiqarilgan ma’lumotlar.

Bu Next.js’ning klient va server komponentlarida bir xil ishlaydi.

## React qayerda himoya qilmaydi

### dangerouslySetInnerHTML

Nomi halol: satr hech qanday tekshiruvsiz HTML sifatida qo‘yiladi.

```tsx
// bio foydalanuvchidan kelgan bo‘lsa, zaif
<div dangerouslySetInnerHTML={{ __html: user.bio }} />
```

Undan faqat sanitayzer bilan tozalangan HTML yoki to‘liq jamoa nazoratidagi kontent bilan foydalaning.

### javascript: havolalar

React `href` qiymatini ekranlaydi, lekin URL sxemasini tekshirmaydi. `javascript:alert(document.cookie)` havolasi bosilganda kodni bajaradi. React’ning yangi versiyalari bunday URL’lar haqida ogohlantiradi yoki ularni bloklaydi, lekin bunga tayanmang — sxemani o‘zingiz tekshiring:

```ts
export function safeUrl(input: string): string {
  try {
    const url = new URL(input, "https://placeholder.local");
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? input : "#";
  } catch {
    return "#";
  }
}
```

Xuddi shu tekshiruv `iframe` ning `src` i, `window.location` va logindan keyingi redirektlar uchun ham kerak.

### DOM bilan to‘g‘ridan-to‘g‘ri ishlash

`ref.current.innerHTML = ...`, `document.write`, `eval`, `new Function` va uchinchi tomon jQuery plaginlari React’ni chetlab o‘tadi va hech narsani ekranlamaydi.

### script ichidagi ma’lumotlar

Agar JSON’ni `<script>` tegiga qo‘ysangiz (masalan, SEO uchun JSON-LD), ma’lumot ichidagi `</script>` satri tegni yopib qo‘yadi. `<` belgisini ekranlang:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }}
/>
```

### Foydalanuvchi props’larini yoyish

`<div {...userProvidedObject} />` istalgan atributni, jumladan `dangerouslySetInnerHTML` yoki `href` ni uzatishga imkon beradi. Faqat aniq sanab o‘tilgan maydonlarni uzating.

## Markdown va foydalanuvchi HTML’i

Markdown’ni render qilish XSS ning ko‘p uchraydigan manbai, chunki Markdown ichida HTML yozish mumkin.

- **react-markdown** standart holatda xom HTML’ni render qilmaydi — bu xavfsiz variant. Agar `rehype-raw` ni ulasangiz, `rehype-sanitize` ni ham qo‘shing.
- **marked, markdown-it** va shunga o‘xshashlar HTML satrini qaytaradi. Uni `dangerouslySetInnerHTML` dan oldin tozalash kerak.

```ts
import DOMPurify from "dompurify";

const clean = DOMPurify.sanitize(rawHtml);
```

DOMPurify brauzerda ishlaydi. Serverda tozalash uchun uni jsdom bilan yoki `isomorphic-dompurify` o‘ramasi orqali ishlating. Faqat saqlashda emas, chiqarishda ham tozalang: sanitayzer qoidalari vaqt o‘tishi bilan yangilanadi.

## Content Security Policy

**CSP** — brauzer skriptlarni qayerdan yuklashi va bajarishi mumkinligini cheklaydigan sarlavha. Agar XSS baribir o‘tib ketsa, qat’iy siyosat inline skriptning bajarilishiga yo‘l qo‘ymaydi.

Nonce bilan asosiy qat’iy siyosat:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-RANDOM' 'strict-dynamic'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

Next.js’da sarlavhalar konfiguratsiyada beriladi yoki nonce kerak bo‘lsa, har bir so‘rov uchun yaratiladi. Nonce sahifalarni dinamik render qilishni talab qilishini hisobga oling. `Content-Security-Policy-Report-Only` rejimidan boshlang, buzilishlarni yig‘ing va shundan keyingina bloklashni yoqing. Direktivalar [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) da batafsil yozilgan.

## Kod-review uchun chek-list

1. Loyihada `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` ni qidiring — har birining asosi bo‘lishi kerak.
2. Tashqi ma’lumotlardan olingan barcha `href` va `src` sxema tekshiruvidan o‘tadi.
3. Markdown xom HTML’siz yoki sanitayzer orqali render qilinadi.
4. Noma’lum obyektlar props’ga yoyilmaydi.
5. Sessiya cookie’lari `HttpOnly`, `Secure`, `SameSite` bayroqlari bilan.
6. CSP sozlangan, hech bo‘lmasa hisobot rejimida.

## FAQ

### Next.js server komponentlari XSS dan himoya qiladimi?

Ular matnni oddiy React kabi ekranlaydi. Lekin `dangerouslySetInnerHTML` va xavfli URL’lar serverda ham xavfli: HTML baribir brauzerda bajariladi.

### Tokenlarni localStorage’da saqlasa bo‘ladimi?

Har qanday muvaffaqiyatli XSS ularni o‘qiy oladi. Sessiyalar uchun `HttpOnly` cookie ishonchliroq: skript ularga kira olmaydi, garchi foydalanuvchi nomidan so‘rov yuborishi mumkin bo‘lsa ham.

### Faqat CSP yetarlimi?

Yo‘q. CSP — ikkinchi himoya chizig‘i. Asosiy himoya — kodda tekshirilmagan HTML va xavfli URL’larni qo‘ymaslik.
