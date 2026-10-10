---
title: "Saytdagi formalar: validatsiya, xatolar va kodda qulaylik"
description: Formani qulay va ishonchli qilish: nativ HTML validatsiya, klient va server uchun umumiy sxema, tushunarli xato xabarlari va spamdan himoya asoslari.
summary: Yaxshi forma ma’lumotni ikki marta tekshiradi — qulaylik uchun klientda va ishonchlilik uchun serverda, bitta umumiy sxema bo‘yicha — va tushunarli xatolarni maydon yonida ko‘rsatadi.
---

## Asosiy qoida

**Klient validatsiyasi — qulaylik uchun, server validatsiyasi — xavfsizlik uchun.** Brauzerdan keladigan har qanday narsani soxtalashtirish mumkin, shuning uchun server ma’lumotlarni o‘zi tekshirishi shart. Brauzerdagi tekshiruv esa inson xato haqida yuborgandan keyin emas, darhol bilishi uchun kerak.

Eng yaxshisi — qoidalarni umumiy sxemada **bir marta** tavsiflab, ikkala tomonda ishlatish.

## Nativ HTML’dan boshlang

Brauzer JavaScript’siz ham ko‘p narsani biladi:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" required>

<label for="phone">Telefon</label>
<input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
```

- **`type`** (`email`, `tel`, `url`, `number`, `date`) — telefonda to‘g‘ri klaviatura va bazaviy tekshiruv.
- **`required`, `minlength`, `maxlength`, `pattern`, `min`, `max`** — kodsiz oddiy qoidalar.
- **`autocomplete`** — brauzer saqlangan ma’lumotlarni qo‘yadi, bu to‘ldirishni ancha tezlashtiradi.
- Har bir maydon uchun **`<label>`** — placeholder yozuv o‘rnini bosmaydi.

Brauzerning standart qalqib chiquvchi maslahatlari har doim chiroyli emas, shuning uchun ko‘pincha formaga `novalidate` qo‘yib, xatolarni o‘zlari chiqaradi, atributlarni esa semantika uchun saqlab qoladi.

## Klient va server uchun umumiy sxema

TypeScript loyihalarida sxemalar kutubxonasidan, masalan Zod’dan foydalanish qulay:

```ts
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Ismingizni kiriting"),
  email: z.string().trim().email("Email’ni tekshiring"),
  message: z.string().trim().max(2000, "Matn juda uzun"),
});
```

Klientda sxema darhol xatolarni beradi, serverda esa saqlashdan oldin xuddi shu tekshiruv ishlaydi:

```ts
const result = leadSchema.safeParse(body);
if (!result.success) {
  return Response.json(
    { errors: result.error.flatten().fieldErrors },
    { status: 422 },
  );
}
```

Server xatolarni **maydonlar bo‘yicha** qaytaradi, shunda klient ularni kerakli joylarda ko‘rsatadi. Faqat serverda mumkin bo‘lgan tekshiruvlar (email band emasmi, promokod mavjudmi) ham shu formatda keladi.

## Xatolarni qachon ko‘rsatish kerak

- **Birinchi belgi kiritilganda emas** — bu asabga tegadi. Maydonni fokus yo‘qolganda (`blur`) tekshiring.
- **Birinchi xatodan keyin** maydonni har bir o‘zgarishda tekshiring, shunda hammasi tuzatilishi bilan xabar yo‘qoladi.
- **Yuborishda** — hammasini tekshiring, xatolarni ko‘rsating va fokusni birinchi noto‘g‘ri maydonga o‘tkazing.
- Server xatosida kiritilgan ma’lumotlarni o‘chirib yubormang.

## Hamma uchun tushunarli xato xabarlari

```html
<input id="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Email’ni tekshiring: @ belgisi yetishmayapti</p>
```

- Xato matni **maydon yonida** va `aria-describedby` orqali bog‘langan.
- Noto‘g‘ri maydonlar uchun `aria-invalid="true"`.
- Faqat qizil rang emas — matn yoki ikonka qo‘shing.
- Xabar shunchaki «Noto‘g‘ri qiymat» emas, **qanday tuzatishni** tushuntiradi.
- Uzun formalar uchun — tepada maydonlarga havolalar bilan xatolar ro‘yxati.

## Ko‘pincha unutiladigan qulayliklar

- Maydonlar minimal bo‘lsin: har bir ortiqcha maydon to‘ldirish istagini kamaytiradi.
- Normallashtirish mumkin bo‘lgan joyda formatni cheklamang: telefondagi bo‘shliqlarni o‘zingiz olib tashlang.
- Dublikatlar bo‘lmasligi uchun yuborish vaqtida tugmani bloklang va yuklanish holatini ko‘rsating.
- Muvaffaqiyat haqida aniq xabar: keyin nima bo‘lishini ayting.

## Spamdan bazaviy himoya

- **Honeypot**: inson to‘ldirmaydigan, bot esa to‘ldiradigan yashirin maydon.
- **Vaqtni tekshirish**: sahifa yuklangandan soniyaning bir qismida yuborilgan forma shubhali.
- Serverda IP bo‘yicha **rate limiting**.
- **CAPTCHA** — faqat qolganlari yordam bermasa: u foydalanuvchilar tajribasini yomonlashtiradi.
- Ma’lumotlarni chiqarish va bazaga yozishdan oldin sanitizatsiya va ekranlash.

## FAQ

### Faqat klientdagi validatsiya yetarlimi?

Yo‘q. So‘rovni to‘g‘ridan-to‘g‘ri yuborib, uni osongina chetlab o‘tish mumkin. Klient tekshiruvi qulaylik uchun, ma’lumotlarni esa faqat server himoya qiladi.

### Email’ni regular ifoda bilan tekshirish kerakmi?

Murakkab regulyar ifodalarsiz oddiy format tekshiruvi yetarli. Manzilni haqiqatan tasdiqlash faqat havola yoki kodli xat orqali mumkin.

### Formalar uchun kutubxona kerakmi?

Bir-ikki maydon uchun nativ HTML va ozgina kod yetadi. Dinamik maydonli katta formalar uchun sxema bilan birga formalar kutubxonasi vaqtni tejaydi va xatolarni kamaytiradi.
