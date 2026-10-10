---
title: Telegram Mini App dizayni: mavzu, tugmalar va nativ his
description: Mini App Telegram ichida o‘zinikidek ko‘rinishi uchun: mavzu ranglari, viewport va safe area, MainButton, tebranish, to‘liq ekran va tez yuklanish.
summary: Mini App Telegram mavzusidan rang olsa, safe area larni hisobga olsa, o‘z tugmalari o‘rniga MainButton va BackButton dan foydalansa, tebranish bilan javob bersa va deyarli bir zumda ochilsa — nativ bo‘lib tuyuladi.
---
## Mini App ni nativ qiladigan narsalar

Foydalanuvchi sayt ochganini sezmasligi kerak. Buning uchun Mini App:

- **ranglarni Telegram mavzusidan oladi**, brendbukdan to‘liq emas;
- **oyna o‘lchami va safe area larni hisobga oladi** — kamera kesigi, tizim panellari, Telegram tugmalari;
- **tizim tugmalaridan foydalanadi** — MainButton, BackButton, SettingsButton;
- muhim harakatlarga **tebranish bilan javob beradi**;
- **tez yuklanadi** va darhol `Telegram.WebApp.ready()` ni chaqiradi.

Bularning barchasini rasmiy `telegram-web-app.js` skriptidagi `window.Telegram.WebApp` obyekti beradi.

## Mavzu ranglari

Telegram ilovaga `themeParams` ni uzatadi — foydalanuvchining joriy mavzu ranglari: `bg_color`, `text_color`, `hint_color`, `link_color`, `button_color`, `button_text_color`, `secondary_bg_color` va boshqalar. Ular CSS o‘zgaruvchilari sifatida ham mavjud.

```css
body {
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
.card { background: var(--tg-theme-secondary-bg-color); }
.hint { color: var(--tg-theme-hint-color); }
```

Amaliy qoidalar:

- **Fon, matn va izohlar** faqat mavzudan olinadi. Aks holda qorong‘i mavzuda oq dog‘ paydo bo‘ladi.
- **Brendni urg‘ularda qoldiring**: logotip, illyustratsiyalar, bir-ikkita brend bloki.
- `themeChanged` hodisasiga obuna bo‘ling — foydalanuvchi ilovani yopmasdan mavzuni almashtirishi mumkin.
- Sarlavha va oyna fonini `setHeaderColor()` va `setBackgroundColor()` orqali birinchi ekranga moslang, shunda «chok» ko‘rinmaydi.
- CSS o‘zgaruvchilariga doim **zaxira qiymat** bering: oddiy brauzerda ochilganda mavzu bo‘lmaydi.

## Viewport va safe area

Mini App oynasining balandligi o‘zgarib turadi: foydalanuvchi oynani tortadi, klaviatura ochiladi. Shuning uchun `100vh` bu yerda ishonchsiz.

- `--tg-viewport-height` — joriy balandlik, animatsiya vaqtida o‘zgaradi.
- `--tg-viewport-stable-height` — o‘zgarishlar tugagandan keyingi balandlik. Pastga qotirilgan elementlar uchun shuni ishlating.
- `expand()` oynani maksimal balandlikka ochadi — interfeysga joy yetmasa chaqiring.

**Safe area** — qurilmaning tizim elementlari va Telegram interfeysi yopib turadigan zonalar. Ikki xil chekinish bor:

- `--tg-safe-area-inset-*` — tizim elementlaridan (kamera kesigi, imo-ishora paneli);
- `--tg-content-safe-area-inset-*` — kontent ustidagi Telegram elementlaridan.

```css
.screen {
  padding-top: calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px));
  padding-bottom: var(--tg-safe-area-inset-bottom, 0px);
}
```

Bu ayniqsa to‘liq ekran rejimida muhim: chekinishlarsiz sarlavha kamera kesigi ostiga kirib ketadi.

## Tugmalar: MainButton va BackButton

**MainButton** — ekran pastidagi Telegram uslubidagi katta tugma. Uni ekranning asosiy harakati uchun ishlating: «Buyurtma berish», «To‘lash», «Keyingi».

```js
const tg = window.Telegram.WebApp;
tg.MainButton.setParams({ text: "Buyurtma berish", is_visible: true });
tg.MainButton.onClick(async () => {
  tg.MainButton.showProgress();
  await submitOrder();
  tg.MainButton.hideProgress();
});
```

- **Bir ekranda bitta asosiy harakat.** Ikkinchi darajali harakat uchun `SecondaryButton` bor.
- Forma to‘ldirilmaguncha tugmani o‘chirib qo‘ying (`disable()`), so‘rov paytida `showProgress()` ni ko‘rsating.
- O‘zingizning «orqaga» strelkangiz o‘rniga sarlavhadagi **BackButton** dan foydalaning va uni router bilan bog‘lang.
- MainButton ni sahifadagi o‘z tugmangiz bilan takrorlamang — ikkita bir xil tugma chiqadi.
- Ekran almashganda ishlov beruvchilarni `offClick()` bilan olib tashlang, aks holda bitta bosish bir necha marta ishlaydi.

## Taktil javob

`HapticFeedback` interfeysni «jonli» qiladi:

- `impactOccurred("light" | "medium" | "heavy" | "rigid" | "soft")` — bosish va sudrash;
- `notificationOccurred("success" | "warning" | "error")` — harakat natijasi;
- `selectionChanged()` — ro‘yxat yoki almashtirgichda tanlov o‘zgarishi.

Tebranishni me’yorida ishlating: tasdiqlash, xato va tanlov uchun. Har bir bosishga tebranish charchatadi.

## To‘liq ekran rejimi

`requestFullscreen()` Mini App ni butun ekranga yoyadi — o‘yinlar, media va xaritalar uchun mos. E’tibor bering:

- **safe area** majburiy, aks holda kontent tizim elementlari ostida qoladi;
- `fullscreenChanged` va `fullscreenFailed` hodisalarini tinglang — rejim hamma klientlarda ishlamaydi;
- oddiy do‘kon va formalar uchun to‘liq ekran ko‘pincha kerak emas.

Agar ilovada vertikal imo-ishoralar (svayp, slayder) bo‘lsa, `disableVerticalSwipes()` oynaning tasodifan yopilishiga yo‘l qo‘ymaydi.

## Tez yuklanish

Birinchi taassurot — bu tezlik. Chek-list:

- birinchi ekran chizilgach, `ready()` ni **imkon qadar erta** chaqiring;
- bo‘sh oq ekran emas, mavzu ranglaridagi **skeleton** ko‘rsating;
- boshlang‘ich bandlni kichik saqlang, og‘ir ekranlarni dangasa (lazy) yuklang;
- statik fayllarni keshlash bilan CDN orqali bering;
- birinchi ekranni API so‘rovlari bilan to‘sib qo‘ymang — avval karkas, keyin ma’lumot;
- faqat noutbukda emas, arzon Android telefon va sekin tarmoqda sinab ko‘ring.

## Ko‘p uchraydigan xatolar

- Qattiq belgilangan oq fon va qora matn.
- Klaviatura ochilganda sakraydigan `100vh` va qotirilgan bloklar.
- BackButton o‘rniga burchakdagi o‘z «Orqaga» tugmasi.
- Versiya tekshiruvi yo‘qligi: yangi metodlardan oldin `isVersionAtLeast()` ni ishlating.

## FAQ

### Brend ranglaridan butunlay voz kechish kerakmi?

Yo‘q. Asosiy yuzalar va matnni Telegram mavzusidan oling, brend rangini esa urg‘ular, illyustratsiyalar va xohlasangiz `setParams({ color })` orqali MainButton uchun ishlating.

### Nega yangi metodlar ayrim foydalanuvchilarda ishlamaydi?

Foydalanuvchilarda Telegram klientining turli versiyalari bor. `isVersionAtLeast()` bilan tekshiring va metod mavjud bo‘lmasa, zaxira variantni ko‘zda tuting.

### Dizaynni telefonsiz qanday sinash mumkin?

Telegram Desktop va veb-versiyalarda Mini App ni ochib, debagni yoqish mumkin. Ammo safe area, klaviatura va tebranishni yakuniy tekshirishni haqiqiy iOS va Android qurilmalarida qiling.
