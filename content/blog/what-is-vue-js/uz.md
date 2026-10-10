---
title: Vue.js nima: yangi boshlovchilar uchun sharh
description: Vue.js nima, bir faylli komponentlar va reaktivlik qanday ishlaydi, Composition API va Options API farqi, Pinia va Vue Router nima uchun kerak.
summary: Vue.js — interfeyslar yaratish uchun JavaScript freymvorki bo‘lib, unda komponent bitta faylda yoziladi, sahifa esa ma’lumot o‘zgarganda o‘zi yangilanadi. Yangi loyihalarda odatda Composition API, umumiy holat uchun Pinia va sahifalar uchun Vue Router olinadi.
---

## Vue.js ikki so‘zda

**Vue.js** — foydalanuvchi interfeyslarini yaratish uchun progressiv JavaScript freymvorki. «Progressiv» degani — uni kichik vidjet uchun bitta sahifaga ulash ham, unda butun bir sahifali ilova (SPA) qurish ham mumkin.

Hammasi ikki g‘oyaga tayanadi:

- **Komponentlar** — interfeys mustaqil bloklardan yig‘iladi: tugma, kartochka, forma.
- **Reaktivlik** — siz ma’lumotni o‘zgartirasiz, Vue esa sahifadagi kerakli joylarni o‘zi yangilaydi.

Vue’ni oson o‘rganilishi, tushunarli hujjatlari va oddiy HTML’ga o‘xshash shablonlari uchun qadrlashadi.

## Bir faylli komponentlar

Vue’da komponent odatda `.vue` faylida yashaydi (Single-File Component, SFC). Unda uch qism bor: mantiq, belgilash va uslublar.

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <button @click="count++">Bosildi: {{ count }}</button>
  <p>Ikki baravar qiymat: {{ double }}</p>
</template>

<style scoped>
button { padding: 8px 16px; }
</style>
```

Bu ishlaydigan hisoblagich misoli. `scoped` uslublar faqat shu komponent ichida amal qilishini bildiradi.

## Reaktivlik qanday ishlaydi

- **`ref()`** reaktiv qiymat yaratadi. Skriptda unga `.value` orqali, shablonda esa to‘g‘ridan-to‘g‘ri murojaat qilinadi.
- **`reactive()`** butun obyektni reaktiv qiladi.
- **`computed()`** — faqat bog‘liqliklar o‘zgarganda qayta hisoblanadigan hisoblangan qiymat.
- **`watch()`** — aniq qiymat o‘zgarganda kodni ishga tushiradi, masalan so‘rov yuborish uchun.

Vue shablonda qaysi ma’lumotlar ishlatilishini kuzatadi va o‘zgarishda faqat ularga bog‘liq qismni qayta chizadi.

## Composition API yoki Options API

| | Options API | Composition API |
|---|---|---|
| Ko‘rinishi | `data`, `methods`, `computed` bo‘limli obyekt | `<script setup>` ichida `ref`, `computed` funksiyalari |
| Kirish darajasi | Birinchi qadamlar uchun osonroq | Biroz ko‘proq tushunishni talab qiladi |
| Katta komponentlar | Bitta vazifa mantiqi bo‘limlarga tarqaladi | Mantiqni guruhlab, composable’ga chiqarish mumkin |
| TypeScript | Qo‘llab-quvvatlanadi | Ancha qulayroq qo‘llab-quvvatlanadi |

Ikkala API ham rasman qo‘llab-quvvatlanadi. Yangi loyihalarda ko‘proq **Composition API** tanlanadi: kodni `useCart()` yoki `useAuth()` kabi o‘z composable’laringiz orqali qayta ishlatish osonroq.

## Pinia: umumiy holat

Bir xil ma’lumot ko‘plab komponentlarga kerak bo‘lsa — foydalanuvchi, savat, sozlamalar — ular **store**’ga chiqariladi. Buning uchun rasmiy kutubxona — **Pinia**.

```js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] }),
  getters: {
    total: (state) => state.items.length,
  },
  actions: {
    add(item) {
      this.items.push(item);
    },
  },
});
```

Istalgan komponentda `useCartStore()`’ni chaqirish kifoya, savat o‘zgarganda undan foydalanayotgan barcha komponentlar yangilanadi.

## Vue Router: qayta yuklanishsiz sahifalar

**Vue Router** — rasmiy router. U manzillarni komponentlar bilan bog‘laydi va brauzerni to‘liq qayta yuklamasdan sahifalarni almashtiradi.

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Product from "./pages/Product.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/product/:id", component: Product },
  ],
});
```

Shablonlarda `<a>` o‘rniga `<RouterLink to="/">` ishlatiladi, joriy sahifa joyi esa `<RouterView />` bilan belgilanadi.

## Nimadan boshlash kerak

1. Node.js’ni o‘rnating va rasmiy `npm create vue@latest` buyrug‘i bilan loyiha yarating — u Router, Pinia va TypeScript’ni ulashni taklif qiladi.
2. Reaktivlik va komponentlarni kichik misollarda o‘rganing.
3. Marshrutlar va bitta store qo‘shing.
4. SEO va server rendering muhim bo‘lsa, Vue ustidagi freymvork — **Nuxt**’ga qarang.

Rasmiy hujjatlar: [vuejs.org](https://vuejs.org/).

## Yangi boshlovchilarning keng tarqalgan xatolari

- Skriptda `ref` bilan ishlaganda `.value`’ni unutish.
- `reactive` obyektni destrukturizatsiya qilib, reaktivlikni yo‘qotish.
- Pinia’da hamma narsani saqlash, hatto bitta formaning lokal holatini ham.
- `emit` orqali hodisa yuborish o‘rniga bola komponent ichida props’ni o‘zgartirish.

## FAQ

### Vue yoki React — qaysi birini tanlash kerak?

Ikkalasi ham jiddiy loyihalar uchun mos. Vue HTML’ga o‘xshash shablonlar va o‘rnatilgan rasmiy yechimlar tufayli ko‘pincha osonroq o‘rganiladi; React’da esa uchinchi tomon kutubxonalari ko‘proq va mutaxassislar bozori kengroq. Jamoa va vazifalarni hisobga olib tanlang.

### Vue bilan ishlash uchun TypeScript kerakmi?

Shart emas, Vue JavaScript’da ham a’lo ishlaydi. Lekin o‘rta va yirik loyihalarda TypeScript xatolarni oldinroq topishga yordam beradi, Composition API esa u bilan yaxshi mos keladi.

### Vue SEO saytlar uchun mosmi?

Oddiy Vue SPA brauzerda render qilinadi, bu qidiruv uchun yomonroq. SEO muhim bo‘lgan saytlar uchun server rendering yoki statik generatsiyali Nuxt ishlatiladi.
