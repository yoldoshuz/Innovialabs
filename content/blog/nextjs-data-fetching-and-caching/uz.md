---
title: Next.js’da ma’lumot yuklash va keshlash: batafsil tahlil
description: Next.js’da fetch keshi, vaqt va teg bo‘yicha revalidatsiya, statik va dinamik rendering, Suspense bilan striming va eskirgan ma’lumotlarni topish.
summary: Next.js’da nimani va qancha muddatga keshlashni o‘zingiz hal qilasiz: ma’lumotni taymer yoki o‘zgarishdan keyin teg orqali yangilaysiz, dinamik qismlarni esa Suspense bilan strim qilasiz. Eskirgan ma’lumot deyarli har doim sahifa yoki so‘rov kutilmaganda keshlanganini bildiradi.
---

## Qisqacha: Next.js ma’lumotni qanday oladi va saqlaydi

App Router’da ma’lumotlar to‘g‘ridan-to‘g‘ri **server komponentlarida** yuklanadi: komponent `async` bo‘lishi va ichida `fetch`, ORM yoki istalgan SDK’ni chaqirishi mumkin. Next.js bunga bir nechta kesh qatlamini qo‘shadi va aynan ular foydalanuvchi yangi ma’lumotni ko‘rishini belgilaydi.

Muhim: standart xatti-harakat Next.js’ning **major versiyalari orasida o‘zgargan**. Ba’zi versiyalarda `fetch` avtomatik keshlangan, boshqalarida yo‘q, yangilarida esa `"use cache"` direktivasi paydo bo‘lgan. Shuning uchun aynan o‘z versiyangiz hujjatlarini tekshiring va kodda xatti-harakatni **aniq** belgilang.

## Har bir so‘rov uchun uchta savol

1. **Bu ma’lumotni foydalanuvchilar o‘rtasida qayta ishlatish mumkinmi?** Mahsulotlar katalogi — ha. Aniq bir odamning savati — yo‘q.
2. **Ular qancha vaqt eskirgan bo‘lishi mumkin?** Valyuta kursi — daqiqalar, blog maqolasi — soatlar yoki tahrirlangunga qadar.
3. **Keshni nima tozalashi kerak?** Taymer yoki aniq hodisa: nashr, to‘lov, narx o‘zgarishi.

Javoblar strategiyani belgilaydi.

## Vaqt bo‘yicha revalidatsiya

Ma’lumot muntazam o‘zgarsa-yu, aniq vaqtini bilmasangiz mos keladi.

```tsx
export default async function Prices() {
  const res = await fetch("https://api.example.com/prices", {
    next: { revalidate: 300 },
  });
  const prices = await res.json();
  return <PriceTable data={prices} />;
}
```

Bu **stale-while-revalidate** mantiqi: 300 soniya davomida kesh beriladi, keyin birinchi so‘rov hali eski versiyani oladi, fonda esa yangisi tayyorlanadi. Demak, bitta foydalanuvchi interval’dan biroz eskiroq ma’lumotni ko‘rishi mumkin — bu normal holat.

## Teg bo‘yicha revalidatsiya

Ma’lumot **qachon** o‘zgarganini aniq bilsangiz mos keladi: admin maqolani saqladi, CRM’dan webhook keldi.

```tsx
// Yuklash
const res = await fetch("https://api.example.com/posts", {
  next: { tags: ["posts"] },
});

// Saqlashdan keyin Server Action
"use server";
import { revalidateTag } from "next/cache";

export async function savePost(data: FormData) {
  await db.post.update(/* ... */);
  revalidateTag("posts", "max");
}
```

Yangi versiyalarda `revalidateTag` ikkinchi argument — kesh profilini qabul qiladi, eskilarida faqat teg. Shuningdek, aniq marshrut keshini tozalaydigan `revalidatePath("/blog")` ham bor. Teglar qulayroq: bitta tegni turli sahifalardagi o‘nlab so‘rovlarga qo‘yish mumkin.

## Statik va dinamik rendering

- **Statik** — sahifa build vaqtida yoki revalidatsiyada yig‘iladi va keshdan beriladi. Tez va arzon.
- **Dinamik** — sahifa har bir so‘rovda render qilinadi. Javob foydalanuvchiga bog‘liq bo‘lsa kerak.

`cookies()`, `headers()`, `searchParams` yoki keshsiz so‘rov (`cache: "no-store"`) ishlatilsa, sahifa dinamik bo‘ladi. Keng tarqalgan tuzoq: layout’dagi bitta `cookies()` chaqiruvi ichidagi **butun** bo‘limni dinamik qiladi.

| Vaziyat | Tanlov |
|---|---|
| Landing, hujjatlar | Statik |
| CMS’dan tahrirlanadigan blog | Statik + teglar |
| API’dan narxlar keladigan katalog | Statik + vaqt bo‘yicha revalidate |
| Shaxsiy kabinet, savat | Dinamik |

## Suspense bilan striming

Sahifada sekin blok bo‘lsa, butun sahifani uni kutishga majburlamang. Uni `Suspense` ichiga oling — qolgan qism darhol keladi, sekin qism esa oqim bilan yuklanadi.

```tsx
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowReport />
      </Suspense>
    </>
  );
}
```

Marshrut papkasidagi `loading.tsx` fayli butun sahifa uchun xuddi shu ishni qiladi. Maslahat: mustaqil so‘rovlarni `await` zanjiri bilan emas, `Promise.all` orqali **parallel** ishga tushiring, aks holda kechikishlar «sharsharasi» hosil bo‘ladi.

## Eskirgan ma’lumotni qanday debug qilish

- **Sahifa statikmi, tekshiring.** `next build` natijasi har bir marshrut turini ko‘rsatadi.
- **Production rejimida tekshiring.** `next dev`’da kesh boshqacha ishlaydi, shuning uchun xatolar ko‘pincha faqat `next build && next start`’dan keyin ko‘rinadi.
- **Teg mos kelishiga ishonch hosil qiling** — yuklashda ham, revalidatsiyada ham. Satrdagi xato hech qanday ogohlantirishsiz hammasini buzadi.
- **Klient router’ni unutmang.** Mutatsiyadan keyin serverda revalidatsiya qiling yoki `router.refresh()` chaqiring.
- **CDN’ni hisobga oling.** O‘z qoidalariga ega CDN Next.js’dan qat’i nazar eski javobni saqlashi mumkin.
- **Log yozing.** Server komponentidagi vaqtinchalik `console.log` u qayta bajarilganini darhol ko‘rsatadi.

## Keng tarqalgan xatolar

- Shaxsiy ma’lumotlarni umumiy keshda saqlash — begona ma’lumotni ko‘rsatish xavfi.
- «Har ehtimolga qarshi» hamma joyda `no-store` — sayt sekin va qimmat bo‘ladi.
- Parallel yuklash o‘rniga ketma-ket `await`’lar.
- Aniq sozlamalar o‘rniga standart xatti-harakatga tayanish.

## FAQ

### O‘z ma’lumotlar bazamga so‘rovlarni keshlash kerakmi?

Ha, agar ma’lumot umumiy bo‘lsa va har soniyada o‘zgarmasa. `fetch` orqali bo‘lmagan so‘rovlar uchun Next.js versiyangizdagi funksiyalarni keshlash vositalaridan foydalaning va o‘zgarishdan keyin ularni teglar bilan tozalang.

### Nega dev’da hammasi yangilanadi, production’da esa yo‘q?

Ishlab chiqish rejimi tahrirlar darhol ko‘rinishi uchun natijalarni deyarli keshlamaydi. Production to‘liq keshni yoqadi, shuning uchun strategiyani production build’da tekshiring.

### Qaysi biri: vaqt bo‘yicha yoki teg bo‘yicha revalidatsiya?

Ma’lumot o‘zgarish vaqtini nazorat qilsangiz — teglar, ular ortiqcha so‘rovlarsiz yangilikni ta’minlaydi. Ma’lumot bildirishnomasiz tashqi manbadan kelsa — vaqt intervali.
