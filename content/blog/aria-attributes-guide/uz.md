---
title: ARIA atributlari: qachon va qanday ishlatish kerak
description: ARIA ni tahlil qilamiz: rollar, holatlar va xususiyatlar, ARIA ning birinchi qoidasi, modal oyna, tablar, menyu va live-regionlar uchun to‘g‘ri patternlar.
summary: ARIA yordamchi texnologiyalarga elementning roli, nomi va holatini bildiradi, lekin xatti-harakat qo‘shmaydi; uni faqat mos native HTML element bo‘lmagan joyda ishlating.
---
## ARIA nima va asosiy qoida

**ARIA (Accessible Rich Internet Applications)** — ekran o‘quvchilariga qarshisidagi element nima ekani va qanday holatda ekanini tushuntiradigan HTML atributlar to‘plami. ARIA faqat elementning qulaylik daraxtida qanday **tavsiflanishini** o‘zgartiradi. U **xatti-harakat qo‘shmaydi**: elementni fokuslanadigan qilmaydi va tugmalarni qayta ishlamaydi.

**ARIA ning birinchi qoidasi:** kerakli semantika va xatti-harakatga ega native HTML element bo‘lsa, ARIA emas, o‘shani ishlating.

```html
<!-- Yomon: tabindex, Enter va probelni qo‘lda qo‘shish kerak -->
<div role="button" onclick="save()">Saqlash</div>

<!-- Yaxshi: hammasi ichiga o‘rnatilgan -->
<button type="button" onclick="save()">Saqlash</button>
```

Noto‘g‘ri ARIA uning yo‘qligidan yomonroq: u ekran o‘quvchisiga noto‘g‘ri ma’lumot berishi mumkin.

## Atributlarning uch turi

| Tur | Nimani tavsiflaydi | Misollar |
|---|---|---|
| **Rollar (roles)** | Element nima ekanini | `role="dialog"`, `role="tab"`, `role="alert"` |
| **Xususiyatlar (properties)** | Doimiy tavsiflar va bog‘lanishlar | `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-controls` |
| **Holatlar (states)** | O‘zaro ta’sirda o‘zgaradigan narsalar | `aria-expanded`, `aria-selected`, `aria-checked`, `aria-hidden` |

Holatlarni interfeys har safar o‘zgarganda **JavaScript’dan yangilash** kerak — aks holda ekran o‘quvchisi eskirgan ma’lumotni aytadi.

## Eng foydali atributlar

- **`aria-label`** — ko‘rinadigan matni yo‘q elementga nom beradi, masalan ikonkali tugmaga.
- **`aria-labelledby`** — nomni `id` bo‘yicha boshqa elementdan oladi, masalan modal oyna sarlavhasidan.
- **`aria-describedby`** — izoh qo‘shadi: maslahat yoki xato matni.
- **`aria-expanded`** — bog‘liq blok ochiqmi: akkordeon, ochiluvchi menyu.
- **`aria-hidden="true"`** — elementni ekran o‘quvchisidan yashiradi. Uni hech qachon fokuslanadigan elementlarga qo‘ymang.
- **`aria-current="page"`** — navigatsiyada joriy sahifani belgilaydi.

## Pattern: modal oyna

Bugun eng oddiy yo‘l — native `<dialog>` ni `showModal()` orqali ochish: brauzer fonni o‘zi nofaol qiladi va oynani Esc bilan yopadi.

```html
<dialog aria-labelledby="dlg-title">
  <h2 id="dlg-title">Loyihani o‘chirasizmi?</h2>
  <p>Bu amalni bekor qilib bo‘lmaydi.</p>
  <button type="button">Bekor qilish</button>
  <button type="button">O‘chirish</button>
</dialog>
```

Agar oyna `div` asosida o‘zingiz yozgan bo‘lsa: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, ochilganda fokusni ichkariga o‘tkazish, fokusni ushlab turish, Esc bilan yopish va fokusni ochgan tugmaga qaytarish kerak.

## Pattern: tablar

```html
<div role="tablist" aria-label="Tariflar">
  <button role="tab" id="t1" aria-selected="true" aria-controls="p1">Oylik</button>
  <button role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">Yillik</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
<div role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
```

Klaviatura bilan ishlash: **Tab** fokusni faol tabga, so‘ng panelga o‘tkazadi, **strelkalar** tablarni almashtiradi. Har almashtirishda `aria-selected` va `tabindex` ni yangilang.

## Pattern: menyu va ochiluvchi ro‘yxatlar

Ko‘p uchraydigan xato — saytning oddiy navigatsiyasiga `role="menu"` qo‘yish. `menu` roli desktop dasturlari uslubidagi ilova menyulari uchun mo‘ljallangan va strelkalar bilan boshqarishni talab qiladi. Navigatsiya yoki havolalarning oddiy ochiluvchi ro‘yxati uchun quyidagisi yetarli:

```html
<button type="button" aria-expanded="false" aria-controls="nav-list">Xizmatlar</button>
<ul id="nav-list" hidden>
  <li><a href="/web">Saytlar</a></li>
  <li><a href="/mobile">Ilovalar</a></li>
</ul>
```

Ochilganda `aria-expanded` ni `true` ga o‘zgartiring va `hidden` ni olib tashlang.

## Pattern: live-regionlar

**Live-region** fokus o‘tmasdan sodir bo‘ladigan o‘zgarishlar haqida ekran o‘quvchisiga xabar beradi: «Mahsulot savatga qo‘shildi», «Saqlandi», forma yuborishdagi xatolar.

```html
<div aria-live="polite" id="status"></div>
```

- **`aria-live="polite"`** — ekran o‘quvchisi joriy jumlani tugatib, so‘ng o‘zgarishni aytadi. Deyarli har doim mos.
- **`role="alert"`** (`assertive` ga teng) — nutqni to‘xtatadi. Faqat shoshilinch xatolar uchun.
- Region DOM’da **oldindan mavjud bo‘lishi**, o‘zgaradigan narsa esa uning matni bo‘lishi kerak. Matn bilan birga qo‘shilgan element ko‘pincha o‘qilmaydi.

## Ko‘p uchraydigan xatolar

- Rolsiz `div` yoki `span` dagi `aria-label` — ko‘plab ekran o‘quvchilari uni e’tiborsiz qoldiradi.
- Ichida tugmalar bor konteynerdagi `aria-hidden="true"`.
- Xatti-harakatsiz rol: tugmalarni qayta ishlamaydigan `role="button"`.
- Holatlar yangilanmaydi: ochiq menyuda `aria-expanded="false"`.
- Takrorlash: `<button aria-label="Yuborish tugmasi">Yuborish</button>` — nom ko‘rinadigan matnga mos bo‘lishi kerak.

Klaviatura xatti-harakati bilan to‘liq patternlar [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) da tasvirlangan.

## FAQ

### React yoki Vue’da yozsam, ARIA kerakmi?

Freymvork qoidalarni o‘zgartirmaydi. Native elementlardan foydalaning, murakkab vidjetlar uchun esa qulaylikni qo‘llab-quvvatlaydigan sinalgan komponent kutubxonalari yoki APG patternlariga tayaning.

### aria-label va aria-labelledby ning farqi nimada?

`aria-label` nomni to‘g‘ridan-to‘g‘ri atributda satr sifatida beradi, `aria-labelledby` esa boshqa elementning ko‘rinadigan matniga havola qiladi. Mos ko‘rinadigan matn bo‘lsa, `aria-labelledby` afzal.

### ARIA to‘g‘ri ishlayotganini qanday tekshirish mumkin?

axe kabi avtomatik vositalar noto‘g‘ri atribut va rollarni topadi, ammo haqiqiy xatti-harakat faqat ekran o‘quvchisi bilan tekshiriladi: NVDA, VoiceOver yoki TalkBack.
