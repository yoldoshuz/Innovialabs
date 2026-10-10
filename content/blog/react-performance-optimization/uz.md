---
title: React unumdorligini oshirish: memo, useMemo va qayta renderlar
description: Profiler orqali ortiqcha qayta renderlarni topish, memo va useMemo qachon yordam beradi va qachon zarar qiladi, ro‘yxat virtualizatsiyasi va React Compiler.
summary: Avval React Profiler’da nima sekinlashayotganini o‘lchang, ortiqcha qayta renderlar sababini komponentlar tuzilmasi orqali bartaraf qiling va shundan keyingina memo, useMemo va virtualizatsiyani nuqtaviy qo‘shing.
---

## Qisqa javob

Qayta render o‘z-o‘zidan muammo emas: React tez-tez qayta chizishga mo‘ljallangan. Muammo — **qimmat** komponentlar **keraksiz** qayta chizilganda va buni foydalanuvchi sezganda. Harakatlar tartibi doim bir xil: **o‘lchash → sababni topish → tuzilmani tuzatish → nuqtaviy memoizatsiya**.

## Komponent nega qayta chiziladi

Komponent qayta render bo‘ladi, agar:

- uning holati o‘zgarsa;
- ota komponent qayta chizilsa (props bir xil bo‘lsa ham);
- u o‘qiydigan kontekst qiymati o‘zgarsa.

Ikkinchi band — ortiqcha renderlarning asosiy manbai. Daraxt tepasida holat saqlaydigan katta komponent o‘zidan pastdagi hamma narsani ham qayta chizadi.

## Ortiqcha qayta renderlarni qanday topish

1. **React Developer Tools** ni o‘rnating va **Profiler** vkladkasini oching.
2. Sozlamalarda har bir komponent nega render bo‘lganini yozib borishni yoqing.
3. Sekin ishlayotgan harakatni yozib oling: maydonga matn kiritish, ro‘yxatni ochish, filtrni almashtirish.
4. Flamegraph’ni o‘rganing: qaysi komponentlar render bo‘ldi, qancha vaqt oldi va nima uchun.

Production yig‘masida tekshiring, kerak bo‘lsa brauzer DevTools’da CPU’ni sekinlashtiring: ishlab chiqish rejimida React sekinroq ishlaydi va manzara buziladi.

## Avval tuzilma, keyin memoizatsiya

Ko‘p muammolar `memo` siz hal bo‘ladi:

- **Holatni pastga tushiring.** Agar qidiruv maydoni holatni o‘zgartirsa, uni butun sahifada emas, kichik `SearchInput` komponentida saqlang.
- **Og‘ir qismlarni children orqali uzating.** Tashqarida yaratilib, `children` sifatida uzatilgan elementlar o‘ram holati o‘zgarganda qayta chizilmaydi.
- **Kontekstlarni ajrating.** Tez-tez o‘zgaradigan ma’lumotlar kam o‘zgaradiganlar bilan bitta kontekstda turmasligi kerak.
- **Komponent ichida komponent yaratmang.** Bunday komponent har renderda qayta yaratiladi va holatini yo‘qotadi.

## memo, useMemo va useCallback

| Vosita | Nima qiladi | Qachon yordam beradi |
|---|---|---|
| `React.memo` | Props o‘zgarmagan bo‘lsa, renderni o‘tkazib yuboradi | Og‘ir komponent ko‘pincha bir xil props oladi |
| `useMemo` | Hisoblash natijasini keshlaydi | Qimmat hisoblash yoki memo-komponent uchun obyekt |
| `useCallback` | Funksiyani keshlaydi | Funksiya memo-komponentga yoki effekt bog‘liqliklariga uzatiladi |

```jsx
const Row = memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }) {
  const [selected, setSelected] = useState(null);
  const handleSelect = useCallback((id) => setSelected(id), []);
  return items.map((item) => (
    <Row key={item.id} item={item} onSelect={handleSelect} />
  ));
}
```

`useCallback` bo‘lmasa, `handleSelect` har renderda qayta yaratilardi va `Row` dagi `memo` ishlamasdi.

## Memoizatsiya qachon zarar qiladi

- **Props’ni taqqoslash ham vaqt oladi.** Yengil komponentlar uchun bu renderning o‘zidan qimmatroq bo‘lishi mumkin.
- **Kod murakkablashadi**, bog‘liqliklar massivida xato qilish xavfi oshadi.
- **Memoizatsiya sezdirmasdan buziladi:** yangi `style={{...}}` obyekti yoki strelkali funksiya uzatish kifoya — va `memo` ishlamay qoladi.

Memoizatsiyani faqat Profiler haqiqiy muammoni ko‘rsatgan joyga qo‘shing.

## Uzun ro‘yxatlarni virtualizatsiya qilish

Agar ekranda minglab qatorlar bo‘lsa, muammo qayta renderlarda emas, DOM tugunlari sonida. **Virtualizatsiya** faqat ko‘rinib turgan elementlarni va ularning atrofidagi kichik zaxirani chizadi. Buning uchun TanStack Virtual yoki react-window kabi kutubxonalar bor. Muqobil — sahifalash yoki aylantirish davomida yuklash.

## React Compiler

**React Compiler** — React jamoasining yig‘ish vositasi bo‘lib, u komponentlar va qiymatlarni avtomatik memoizatsiya qiladi. U qo‘lda yoziladigan `memo`, `useMemo` va `useCallback` ning katta qismidan xalos qiladi, lekin kod React qoidalariga rioya qilishini talab qiladi: toza komponentlar, props va holatni mutatsiya qilmaslik. Ulashdan oldin React versiyangiz va freymvorkingiz bilan mosligini rasmiy hujjatlarda tekshiring.

## Sekinlikning boshqa tez-tez uchraydigan sabablari

- Og‘ir bandllar — kodni bo‘lish va `lazy` dan foydalaning.
- Har bir belgi kiritilganda sinxron hisoblashlar — `useDeferredValue` va `useTransition` yordam beradi.
- Siqilmagan katta rasmlar va joylashuvni qayta hisoblashga olib keladigan animatsiyalar.

## FAQ

### Har bir komponentni memo bilan o‘rash kerakmi?

Yo‘q. Bu murakkablik va props’ni taqqoslash xarajatini qo‘shadi. Profiler ma’lumotlariga ko‘ra qimmat render bo‘ladigan va ko‘pincha bir xil props oladigan komponentlarni memoizatsiya qiling.

### React Compiler ishlatsam, useMemo va useCallback kerakmi?

Ko‘p hollarda kompilyator o‘zi uddalaydi. Qo‘lda memoizatsiya ayrim holatlar uchun qolishi mumkin, masalan, qiymat effekt bog‘liqligi bo‘lsa va aniq xatti-harakat muhim bo‘lsa.

### Nega ishlab chiqish rejimida ilova sekinroq?

Development yig‘masida qo‘shimcha tekshiruvlar va ogohlantirishlar bor, StrictMode esa kodning bir qismini ikki marta chaqiradi. Unumdorlikni production yig‘masida baholang.
