---
title: React hooklari: useState, useEffect, useRef va boshqalar misollarda
description: React’ning asosiy hooklari amalda: useState, useEffect, useRef, useMemo, hooklar qoidalari, bog‘liqliklar massivi, tipik xatolar va o‘z hooklaringiz.
summary: Hooklar — komponentga holat (useState), yon effektlar (useEffect) va havolalar (useRef) beradigan funksiyalar; ularni faqat yuqori darajada chaqiring va bog‘liqliklarni to‘liq ko‘rsating.
---

## Hooklar nima va ular nima uchun kerak

**Hooklar** — funksional komponentga holat saqlash, o‘zgarishlarga javob berish va DOM bilan ishlash imkonini beradigan funksiyalar. Ular klass komponentlarini almashtirdi va mantiqni qayta ishlatiladigan qildi: umumiy kod hayot sikli metodlariga tarqalib ketmasdan, **o‘z hookingizga** chiqariladi.

Deyarli har bir loyihada kerak bo‘ladigan asosiy to‘plam:

| Hook | Vazifasi |
|---|---|
| `useState` | Lokal holat; uning o‘zgarishi qayta chizishni chaqiradi |
| `useEffect` | Tashqi dunyo bilan sinxronlash: obunalar, taymerlar, so‘rovlar |
| `useRef` | DOM elementiga yoki qayta chizishni chaqirmaydigan qiymatga havola |
| `useMemo` / `useCallback` | Renderlar orasida hisoblash va funksiyalarni keshlash |
| `useContext` | Props uzatmasdan kontekstdan qiymat o‘qish |

## useState: komponent holati

```jsx
const [count, setCount] = useState(0);

// Yangi qiymat avvalgisiga bog‘liq bo‘lsa — funksiya uzating
setCount(prev => prev + 1);
```

Muhim jihatlar:

- **Holat o‘zgarmas.** Obyekt va massivlar uchun nusxa yarating: `setUser({ ...user, name })`, `user.name = name` emas.
- **Yangilanish darhol bo‘lmaydi.** `setCount` dan keyin joriy renderda `count` hali eski qiymatda qoladi.
- **Qimmat boshlang‘ich qiymatni** funksiya sifatida bering: `useState(() => parse(data))` faqat bir marta bajariladi.

## useEffect va bog‘liqliklar massivi

`useEffect` kodni chizishdan keyin ishga tushiradi. Ikkinchi argument effekt qachon takrorlanishini belgilaydi:

- massivsiz — har bir renderdan keyin;
- `[]` — montajdan keyin bir marta;
- `[userId]` — `userId` o‘zgarganda.

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(() => {});
  return () => controller.abort(); // tozalash
}, [userId]);
```

Effekt qaytaradigan funksiya — **tozalash** (cleanup). U keyingi ishga tushirishdan oldin va komponent olib tashlanganda chaqiriladi. Bu yerda so‘rovlarni bekor qiling, obunalarni olib tashlang va taymerlarni to‘xtating.

## useEffect bilan tipik xatolar

- **Tushib qolgan bog‘liqliklar.** Effekt o‘zgaruvchidan foydalansa, u massivda bo‘lishi kerak. ESLint’da `react-hooks/exhaustive-deps` qoidasini yoqing — u buni avtomatik topadi.
- **Cheksiz sikl.** Effekt o‘zi bog‘liq bo‘lgan holatni o‘zgartiradi yoki bog‘liqliklarda har renderda qayta yaratiladigan obyekt bor.
- **Hisoblash uchun effekt.** Qiymat props yoki holatdan chiqarilsa, uni komponent tanasida hisoblang — `useEffect` va ortiqcha `useState` kerak emas.
- **Tozalash yo‘q.** Tozalanmagan obunalar va intervallar xotira sizishi va takroriy ishlovchilarga olib keladi.
- **So‘rovlar poygasi.** Bekor qilinmasa, eski so‘rovga javob yangisidan keyin kelib, ma’lumotlarni ustidan yozishi mumkin.

## useRef: DOM va qayta chizishsiz qiymatlar

```jsx
const inputRef = useRef(null);
// <input ref={inputRef} />
inputRef.current.focus();
```

`ref.current` ni o‘zgartirish mumkin va bu **qayta chizishni chaqirmaydi**. Shuning uchun `useRef` taymer id’si, oldingi qiymat yoki ekranda ko‘rsatilmaydigan bayroqni saqlash uchun mos.

## Hooklar qoidalari

1. Hooklarni **faqat komponentning yuqori darajasida** chaqiring — shartlar, sikllar va ichki funksiyalar ichida emas. React chaqiruvlar tartibiga tayanadi.
2. Hooklarni **faqat komponentlar yoki boshqa hooklardan** chaqiring, oddiy funksiyalardan emas.

## O‘z hooklaringiz

O‘z hookingiz — nomi `use` bilan boshlanadigan va ichida boshqa hooklarni chaqiradigan funksiya. U takrorlanuvchi mantiqni ajratib chiqaradi:

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

Hookni chaqirgan har bir komponent **o‘zining** holatini oladi — hooklar ma’lumotni emas, mantiqni bo‘lishadi.

## FAQ

### Nega ishlab chiqish rejimida useEffect ikki marta ishlaydi?

`StrictMode` da React tozalash to‘g‘ri ishlashini tekshirish uchun komponentni ataylab montaj qiladi, olib tashlaydi va qayta montaj qiladi. Production’da effekt bir marta ishlaydi. Agar ikki marta ishga tushish nimanidir buzsa, tozalash yetishmayapti.

### useMemo va useCallback qachon kerak?

Hisoblash haqiqatan qimmat bo‘lsa yoki funksiya memoizatsiya qilingan bola komponentga yoki effekt bog‘liqliklariga uzatilsa. Hammasini o‘rab chiqish sezilarli foydasiz kodni murakkablashtiradi.

### useEffect orqali ma’lumot yuklasa bo‘ladimi?

Bo‘ladi, lekin keshlash, qayta urinishlar va poygalarni o‘zingiz hal qilishingiz kerak. Katta ilovalarda TanStack Query kabi kutubxonalar yoki freymvorkingizning ma’lumot yuklash vositalari qulayroq.
