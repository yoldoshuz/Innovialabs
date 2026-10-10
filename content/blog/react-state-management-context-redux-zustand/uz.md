---
title: React’da holatni boshqarish: Context, Redux yoki Zustand
description: React’da lokal, global va server holati qanday farq qiladi va qachon Context, Redux Toolkit, Zustand yoki TanStack Query tanlash kerak.
summary: Avval server ma’lumotlarini (ularni TanStack Query’ga bering) klient holatidan ajrating; kam o‘zgaradigan global qiymatlar uchun Context, tez-tez o‘zgaradiganlar uchun Zustand, katta jamoa uchun Redux Toolkit.
---

## Qisqa javob

React’dagi holat bilan bog‘liq muammolarning ko‘pi **turli xil holatlarni bir xil usulda saqlashdan** kelib chiqadi. To‘g‘ri tanlov kutubxonadan emas, savoldan boshlanadi: bu qanday ma’lumot?

- **Server ma’lumotlari** (ro‘yxatlar, profillar, buyurtmalar) — TanStack Query yoki shunga o‘xshash.
- **Lokal holat** (modal ochiqmi, maydon qiymati) — komponentdagi `useState`.
- **Global klient holati** (mavzu, savat, avtorizatsiyadan o‘tgan foydalanuvchi) — Context, Zustand yoki Redux.

## Holatning uch turi

**Lokal.** Bitta komponent yoki kichik daraxt qismiga kerak. Uni ishlatiladigan joyga iloji boricha yaqin saqlang. Faqat qo‘shni komponentlarga haqiqatan kerak bo‘lsa, yuqoriga ko‘taring.

**Global klient.** Ilovaning ko‘p qismlariga kerak va faqat brauzerda mavjud: mavzu, til, rasmiylashtirishgacha savat tarkibi, murakkab bosqichli formaning holati.

**Server.** Serverda yashaydigan ma’lumotlarning nusxasi. Uning o‘z vazifalari bor: keshlash, qayta yuklash, eskirish, optimistik yangilanishlar, sahifalash. Bunday ma’lumotlarni Redux’da qo‘lda boshqarish — ortiqcha kodning keng tarqalgan manbai.

## Vositalarni taqqoslash

| Vosita | Nimaga mos | Kamchiliklari |
|---|---|---|
| **Context** | Kam o‘zgaradigan qiymatlar: mavzu, til, joriy foydalanuvchi | Qiymat o‘zgarsa, barcha iste’molchilar qayta chiziladi |
| **Zustand** | Tez-tez yangilanadigan global holat, minimal kod | Tayyor kelishuvlar kam, tuzilmani jamoa belgilaydi |
| **Redux Toolkit** | Katta ilovalar, murakkab biznes mantiq, ko‘p dasturchi | Ko‘proq shablon kod va o‘rganish kerak bo‘lgan tushunchalar |
| **TanStack Query** | Server ma’lumotlari: yuklash, kesh, mutatsiyalar | Sof klient holati uchun mo‘ljallanmagan |

## Context: o‘rnatilgan, lekin holat menejeri emas

Context — qiymatni props’siz daraxt bo‘ylab pastga **uzatish** mexanizmi. U o‘z-o‘zidan yangilanishlarni optimallashtirmaydi: provayder qiymati o‘zgarsa, uni o‘qiydigan barcha komponentlar qayta chiziladi.

Amaliy qoidalar:

- Kontekstlarni ma’nosiga ko‘ra ajrating: `ThemeContext` alohida, `CartContext` alohida.
- Obyekt uzatsangiz, provayder qiymatini memoizatsiya qiling.
- Har bir belgi kiritilganda o‘zgaradigan narsalarni Context’ga qo‘ymang.

## Zustand: oddiy global ombor

```js
import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  clear: () => set({ items: [] }),
}));

// Komponentda faqat kerakli qismga obuna bo‘lamiz
const count = useCart((s) => s.items.length);
```

Komponent faqat **selektor** tanlagan qiymat o‘zgarganda qayta chiziladi. Provayder kerak emas, kod kam — shuning uchun Zustand kichik va o‘rta loyihalar uchun ko‘p tanlanadi.

## Redux Toolkit: qat’iylik kerak bo‘lganda

Redux Toolkit — Redux’da yozishning zamonaviy usuli. U oldindan aytib bo‘ladigan bir yo‘nalishli ma’lumot oqimi, harakatlar tarixi bilan DevTools va barqaror patternlarni beradi. Kod ustida ko‘p odam ishlasa va biznes mantiq murakkab bo‘lsa, bu o‘zini oqlaydi. Server ma’lumotlari uchun RTK Query ham bor.

## TanStack Query: server holati alohida

```js
const { data, isPending, error } = useQuery({
  queryKey: ['orders', userId],
  queryFn: () => fetchOrders(userId),
});
```

Kutubxona javoblarni keshlaydi, takroriy so‘rovlarni birlashtiradi va foydalanuvchi vkladkaga qaytganda ma’lumotlarni yangilaydi. Server ma’lumotlari bu yerga ko‘chirilgach, odatda juda oz global klient holati qoladi.

## Ilova hajmiga qarab tanlash

1. **Lending yoki kichik ilova:** `useState` + mavzu va til uchun Context.
2. **API bilan o‘rta ilova:** ma’lumotlar uchun TanStack Query + qolganlari uchun Zustand yoki Context.
3. **Katta mahsulot, katta jamoa:** TanStack Query yoki RTK Query + murakkab klient mantiq uchun Redux Toolkit.

**Tez-tez uchraydigan xatolar:** hamma narsani «har ehtimolga qarshi» global saqlash, server ma’lumotlarini bir nechta omborda takrorlash, besh ekranli ilova uchun Redux tanlash.

## FAQ

### Zustand va TanStack Query’ni birga ishlatsa bo‘ladimi?

Ha, bu keng tarqalgan juftlik: TanStack Query server ma’lumotlari uchun, Zustand esa filtrlar, savat yoki ochiq panellar kabi klient holati uchun javob beradi.

### Redux eskirganmi?

Yo‘q. Qo‘lda yoziladigan action type’lar va ko‘p shablon kodli eski uslub eskirgan. Redux Toolkit murakkab mantiqli katta ilovalar uchun ishonchli tanlov bo‘lib qolmoqda.

### Context qachon sekinlasha boshlaydi?

Unda tez-tez o‘zgaradigan ma’lumotlar saqlansa va ularni ko‘p komponent o‘qisa. Bunday holda kontekstni bo‘ling yoki bu ma’lumotlarni selektorli omborga ko‘chiring.
