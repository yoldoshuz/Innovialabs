---
title: Dasturchi uchun sayt qulayligi (accessibility) chek-listi
description: Kod darajasidagi aniq tekshiruvlar: klaviatura, fokus, alt-matn, label, kontrast, landmarks, reduced motion, ekran o‘quvchisi va axe bilan test.
summary: Hammasi klaviatura bilan ishlashi va fokus ko‘rinishi, rasm va maydonlarda matnli nom borligi, kontrast yetarliligi, belgilash semantik bo‘lishi, animatsiya reduced motion’ni hisobga olishini tekshiring, so‘ng axe va ekran o‘quvchisi bilan sinang.
---
## Bir daqiqada asosiysi

Qulaylik muammolarining aksariyati murakkab kutubxonalarsiz, oddiy vyorstka darajasida hal qilinadi. Minimal tekshiruvlar to‘plami:

1. Hammasi **klaviatura bilan** boshqariladi va **fokus ko‘rinadi**.
2. Rasmlarda **alt**, maydonlarda **label**, ikonka-tugmalarda **qulay nom** bor.
3. Matn va interfeys elementlari **kontrasti** yetarli.
4. Belgilash **semantik**: tartibli sarlavhalar, landmarks, haqiqiy tugma va havolalar.
5. Animatsiya **prefers-reduced-motion** ni hisobga oladi.
6. Natija **axe** va **ekran o‘quvchisi** bilan tekshirilgan.

Quyida har bir band batafsil.

## Klaviatura va fokus

- [ ] Barcha interaktiv elementlarga **Tab** orqali yetib boriladi, tartib vizual tartibga mos.
- [ ] Tugmalar — `<button>`, havolalar — `<a href>`. `onClick` li `div` klaviaturadan foydalanib bo‘lmaydi.
- [ ] 0 dan katta `tabindex` yo‘q — u tabiiy tartibni buzadi.
- [ ] Modal oynalar fokusni ichida ushlaydi, **Esc** bilan yopiladi va fokusni ularni ochgan tugmaga qaytaradi.
- [ ] Sahifa boshida «Kontentga o‘tish» havolasi bor.
- [ ] Fokus hech qachon o‘rniga hech narsa qo‘yilmagan `outline: none` bilan **yashirilmaydi**.

```css
:focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
}
```

`:focus-visible` klaviatura bilan harakatlanganda ramkani ko‘rsatadi va sichqoncha bosilganda xalaqit bermaydi.

## Rasmlar va media

- [ ] Ma’lumot beruvchi rasmlarda «rasm» emas, ma’noni tavsiflovchi `alt` bor.
- [ ] Bezak rasmlari — `alt=""`, ekran o‘quvchisi ularni o‘tkazib yuborishi uchun.
- [ ] Tugmalar ichidagi ikonkalar yashirilgan (`aria-hidden="true"`), tugmaning esa matni yoki `aria-label` i bor.
- [ ] Videoda subtitrlar, audioda transkripsiya bor.
- [ ] Ovozli avtomatik ijro o‘chirilgan.

## Formalar

- [ ] Har bir maydonda `for` va `id` orqali bog‘langan `<label>` bor. Placeholder label o‘rnini bosmaydi.
- [ ] Majburiy maydonlar faqat rang bilan belgilanmagan.
- [ ] Xatolar maydon yonida matn sifatida ko‘rsatiladi va `aria-describedby` orqali bog‘lanadi.
- [ ] Maydonlarda `autocomplete` (ism, email, telefon) ko‘rsatilgan — bu harakat imkoniyati cheklangan odamlarga ham yordam beradi.

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email"
       aria-describedby="email-error" aria-invalid="true">
<p id="email-error">Emailni name@example.com formatida kiriting</p>
```

## Kontrast va rang

- [ ] Oddiy matn kontrasti kamida **4.5:1**, yirik matn — kamida **3:1** (WCAG AA darajasi).
- [ ] Maydon chegaralari, ikonkalar va fokus holatlari fonga nisbatan kamida **3:1**.
- [ ] Ma’lumot **faqat rang** orqali berilmaydi: xato — bu qizil ramka va matn yoki ikonka.
- [ ] Matn 200% ga kattalashtirilganda o‘qiladi va kesilmaydi.

## Semantika va landmarks

- [ ] Sahifada bitta `<h1>`, sarlavhalar darajalari tashlab ketilmasdan boradi.
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` ishlatilgan — ekran o‘quvchisi ular bo‘yicha tez harakatlanadi.
- [ ] Sahifa tili ko‘rsatilgan: `<html lang="uz">`.
- [ ] Ro‘yxatlar — `<ul>`/`<ol>`, ma’lumotli jadvallar — `<th>` li `<table>`.
- [ ] Havolalar kontekstsiz ham tushunarli: «bu yerda» emas, «Narxlar ro‘yxatini yuklab olish».

## Animatsiya va harakat

- [ ] Soniyasiga uch martadan ko‘p miltillash yo‘q.
- [ ] Avtomatik harakatlanuvchi kontentni to‘xtatish mumkin.
- [ ] Tizimda harakatni kamaytirish sozlamasi yoqilganda yirik animatsiyalar o‘chadi:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Testlash

| Vosita | Nimani topadi |
|---|---|
| **axe DevTools** / **Lighthouse** | Yo‘q alt va label, past kontrast, ARIA xatolari |
| **Klaviatura** | Fokus tuzoqlari, ko‘rinmas fokus, yetib bo‘lmaydigan elementlar |
| **Screen reader** (NVDA, VoiceOver, TalkBack) | Tushunarsiz nomlar, noto‘g‘ri o‘qish tartibi, «soqov» tugmalar |
| **200% masshtab va mobil kenglik** | Kesilgan matn, gorizontal aylantirish |

Avtomatik tekshiruvlarni CI ga qo‘shing — masalan, end-to-end testlarda `@axe-core/playwright` orqali, — lekin ularni qo‘lda tekshirishning to‘liq o‘rnini bosuvchi deb hisoblamang.

## FAQ

### Sayt allaqachon tayyor bo‘lsa, nimadan boshlash kerak?

Asosiy ssenariylarni faqat klaviatura bilan bosib o‘ting va muhim sahifalarda axe’ni ishga tushiring. Bu ikki qadam eng jiddiy muammolarni tez ko‘rsatadi.

### ARIA ni hamma joyga qo‘shish kerakmi?

Yo‘q. Avval native HTML elementlardan foydalaning — ularda qulaylik ichiga o‘rnatilgan. ARIA faqat HTML yetmaydigan joylarda, masalan murakkab vidjetlar uchun kerak.

### Qulaylikni qanchalik tez-tez tekshirish kerak?

Har bir yangi komponentda va relizdan oldin. Ushbu chek-list bandlarini vazifaning definition of done qismiga kiritish qulay.
