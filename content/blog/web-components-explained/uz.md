---
title: Web Components: custom elementlar va Shadow DOM
description: Web Components nima, custom elements, Shadow DOM, template va slot qanday ishlaydi, React va Vue bilan qanday birlashadi hamda qachon o‘zini oqlaydi.
summary: Web Components — izolyatsiyalangan stillarga ega o‘z HTML teglaringizni yaratish uchun brauzer standartlari; ular har qanday freymvorkda ishlashi kerak bo‘lgan dizayn-tizim va vidjetlar uchun qulay.
---

## Web Components nima

**Web Components** — bu kutubxona emas, balki brauzerga o‘rnatilgan standartlar to‘plami. Ular yordamida `<price-tag>` kabi o‘z HTML tegingizni yaratib, uni oddiy element sifatida ishlatishingiz mumkin. Freymvork kerak emas.

To‘plam uch qismdan iborat:

- **Custom Elements** — JavaScript klassi orqali o‘z tegingiz va uning xatti-harakatini ro‘yxatdan o‘tkazish.
- **Shadow DOM** — o‘z stillariga ega izolyatsiyalangan daraxt: stillar tashqariga chiqmaydi va global CSS ularni buzmaydi.
- **Templates va slots** — markup shablonlari va komponentdan foydalanuvchi o‘z kontentini qo‘yadigan «oynalar».

## Custom Elements: bir necha qatorda o‘z tegingiz

Element `HTMLElement` dan meros oladigan klass bilan tasvirlanadi va `customElements.define` orqali ro‘yxatdan o‘tkaziladi. Nomida albatta defis bo‘lishi kerak.

```js
class PriceTag extends HTMLElement {
  static observedAttributes = ["amount"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const amount = Number(this.getAttribute("amount") || 0);
    this.textContent = amount.toLocaleString("uz-UZ") + " so‘m";
  }
}

customElements.define("price-tag", PriceTag);
```

Asosiy hayotiy sikl hooklari:

- `connectedCallback` — element hujjatga qo‘shildi;
- `disconnectedCallback` — olib tashlandi (listener va taymerlarni shu yerda tozalang);
- `attributeChangedCallback` — `observedAttributes` ro‘yxatidagi atribut o‘zgardi.

## Shadow DOM: stillar izolyatsiyasi

Shadow DOM element ichida alohida daraxt yaratadi. Ichidagi stillar sahifaga ta’sir qilmaydi, sahifa stillari esa unga deyarli ta’sir qilmaydi.

```js
class UiCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host { display: block; border-radius: 12px; padding: 16px; }
        ::slotted(h3) { margin: 0; }
      </style>
      <slot name="title"></slot>
      <slot></slot>
    `;
  }
}
customElements.define("ui-card", UiCard);
```

Amaliyotda muhim jihatlar:

- **Meros olinadigan xususiyatlar** (`color`, `font-family`) ichkariga o‘tadi — mavzu (tema) uchun qulay.
- **CSS custom properties** (`--brand-color`) ham chegaradan o‘tadi — moslashtirishning asosiy usuli.
- Tashqaridan aniq stillash uchun `::part()` bor, agar muallif elementni `part` atributi bilan belgilagan bo‘lsa.

## Templates va slots

`<template>` tegi klonlanmaguncha render qilinmaydigan markupni saqlaydi. **Slotlar** komponent ichiga berilgan kontent qayerga tushishini belgilaydi:

```html
<ui-card>
  <h3 slot="title">«Start» tarifi</h3>
  <p>Tarif tavsifi</p>
</ui-card>
```

Sarlavha `title` nomli slotga, qolgani esa standart slotga tushadi.

## Freymvorklar bilan moslik

Web Components DOM bor har qanday joyda ishlaydi, lekin nozik jihatlar bor:

| Jihat | Nimani hisobga olish kerak |
|---|---|
| Atributlar | Doim satr; murakkab ma’lumotni xususiyatlar (properties) orqali bering |
| Hodisalar | Komponent `CustomEvent` yuboradi, freymvork unga obuna bo‘ladi |
| React | Yangi versiyalar custom elementlarga xususiyat va hodisalarni yaxshiroq uzatadi; eskilarida o‘ram kerak |
| Vue, Angular, Svelte | Yaxshi qo‘llab-quvvatlaydi, ba’zan qaysi teglar custom ekanini aniq ko‘rsatish kerak |
| SSR | Shadow DOM klientda render qilinadi; server uchun Declarative Shadow DOM bor, ammo ekotizim hali rivojlanmoqda |

Tashqariga chiqadigan hodisalar uchun `bubbles: true` va `composed: true` dan foydalaning, aks holda hodisa Shadow DOM chegarasidan chiqmaydi.

## Web Components qachon o‘zini oqlaydi

**Mos keladi**, agar:

- turli freymvorkdagi jamoalar foydalanadigan **dizayn-tizim** kerak bo‘lsa;
- boshqa saytlar uchun **joylashtiriladigan vidjet** (chat, forma, kalkulyator) qilayotgan bo‘lsangiz;
- komponentlar freymvork versiyasiga bog‘lanmasdan uzoq yashashi kerak bo‘lsa;
- loyiha CMS yoki server shablonlaridagi sayt bo‘lib, og‘ir freymvork ortiqcha bo‘lsa.

**Eng yaxshi tanlov emas**, agar butun ilova allaqachon bitta freymvorkda bo‘lsa: uning o‘z komponentlari holat, routing va SSR uchun qulayroq. Murakkab interfeyslar uchun ko‘pincha standart ustidagi yengil kutubxonalar, masalan **Lit** olinadi — ular qo‘lda render qilishni olib tashlaydi.

## Ko‘p uchraydigan xatolar

- Og‘ir ishni `connectedCallback` o‘rniga `constructor` da bajarish.
- Obyektlarni atributlar orqali `JSON.stringify` bilan uzatish.
- `disconnectedCallback` da listenerlarni tozalashni unutish.
- Accessibility yo‘qligi: custom tugmada rol, fokus va klaviatura ishlovi yo‘q.
- Bir xil nom bilan `customElements.define` ni qayta chaqirish — bu xatoga olib keladi.

## FAQ

### Har bir komponentda Shadow DOM kerakmi?

Yo‘q. Custom elementni Shadow DOM siz ham yaratish mumkin — unda unga global stillar ta’sir qiladi. Shadow DOM izolyatsiya muhim bo‘lganda kerak, masalan joylashtiriladigan vidjetlarda.

### Web Components ni React bilan birga ishlatsa bo‘ladimi?

Ha. Komponent oddiy teg sifatida render qilinadi, ma’lumotlar atribut yoki xususiyatlar orqali uzatiladi, harakatlarga esa `CustomEvent` ga obuna bo‘lib javob beriladi.

### Qidiruv tizimlari Shadow DOM ichidagi kontentni indekslaydimi?

Slotlar orqali berilgan kontent oddiy DOM da qoladi va eng yaxshi ko‘rinadi. SEO uchun muhim matnni faqat soya daraxti ichida yaratish o‘rniga light DOM da saqlash ishonchliroq.
