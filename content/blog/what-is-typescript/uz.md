---
title: TypeScript nima va jamoalar nega unga o‘tadi
description: TypeScript oddiy tilda: statik tiplar JavaScript ustida qanday ishlaydi, qaysi xatolar ishga tushishdan oldin ushlanadi va migratsiya nimaga tushadi.
summary: TypeScript — bu tiplarga ega JavaScript: muharrir va kompilyator xatolarni kod ishga tushishidan oldin topadi, natijada esa oddiy JavaScript chiqadi. Jamoalar ishonchlilik va qulay refaktoring uchun unga bosqichma-bosqich o‘tadi.
---

## TypeScript qisqacha

**TypeScript** — Microsoft tomonidan yaratilgan, JavaScriptga **statik tiplash** qo‘shadigan til. Deyarli har qanday to‘g‘ri JavaScript to‘g‘ri TypeScript hisoblanadi, TypeScript esa ishga tushishdan oldin oddiy JavaScriptga aylantiriladi. Brauzer va Node.js aynan shuni bajaradi.

Asosiy g‘oya: siz qanday ma’lumot kutayotganingizni tasvirlaysiz, vositalar esa buni **ishga tushishdan oldin**, to‘g‘ridan-to‘g‘ri muharrirda tekshiradi.

```typescript
function formatPrice(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

formatPrice("100", "UZS");
// Xato: "string" tipidagi argumentni "number" tipidagi parametrga berib bo‘lmaydi
```

JavaScriptda bu chaqiruv faqat ish vaqtida yiqilardi — satrda `toFixed` metodi yo‘q.

## TypeScript ishga tushishdan oldin qaysi xatolarni ushlaydi

- **Xususiyatlardagi xatolar.** `user.email` o‘rniga `user.emial` — darhol belgilanadi.
- **Noto‘g‘ri argumentlar.** Son o‘rniga satr, unutilgan majburiy parametr.
- **Ehtimoliy `undefined`.** `strict` yoqilganda TypeScript yo‘q bo‘lishi mumkin bo‘lgan qiymatni tekshirishga majbur qiladi.
- **To‘liq ishlanmagan variantlar.** Buyurtma statusiga yangi qiymat qo‘shilsa, kompilyator u ishlanmagan joylarni ko‘rsatadi.
- **Refaktoringdagi buzilishlar.** API javobidagi maydon nomini o‘zgartirdingiz — tuzatish kerak bo‘lgan barcha joylarni ko‘rasiz.

```typescript
type Order = { id: number; status: "new" | "paid" | "shipped" };

function label(order: Order) {
  switch (order.status) {
    case "new": return "Yangi";
    case "paid": return "To‘langan";
    case "shipped": return "Jo‘natilgan";
  }
}
```

Muhim: tiplar faqat ishlab chiqish bosqichida mavjud. Tarmoqdan kelgan ma’lumotlarni TypeScript o‘zi tekshirmaydi — buning uchun validatsiya ishlatiladi (masalan, **Zod** kutubxonasi).

## Kompilyatsiya qanday ishlaydi

1. Siz `.ts` / `.tsx` fayllarni yozasiz.
2. `tsc` kompilyatori `tsconfig.json` sozlamalari bo‘yicha tiplarni tekshiradi.
3. Tiplar olib tashlanadi, natijada JavaScript chiqadi.

Amalda bu ikki vazifa ko‘pincha ajratiladi: **bundlerlar** (Vite, esbuild, SWC, Next.js yig‘uvchisi) tiplarni tekshirmasdan tez olib tashlaydi, `tsc --noEmit` esa tiplarni tekshirish uchun muharrir va CIda alohida ishga tushiriladi.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "noEmit": true
  }
}
```

## Jamoalar nega TypeScriptga o‘tadi

- **Prodakshnda kamroq xato** — noto‘g‘ri ma’lumotlar va yozuv xatolari tufayli.
- **Muharrirdagi maslahatlar va avtoto‘ldirish** — kodni yozish va o‘qish tezroq.
- **Katta kod bazasida xavfsiz refaktoring.**
- **Tiplar hujjat sifatida**: funksiya signaturasidan u nimani qabul qilib, nimani qaytarishi tushunarli.
- **Yangi dasturchilarni jamoaga qo‘shish osonroq.**

Narxi: boshida ko‘proq kod, tiplarni o‘rganish va vositalarni sozlashga vaqt.

## JS loyihani migratsiya qilish nimaga tushadi

Auditsiz aniq baho berib bo‘lmaydi — u quyidagi omillarga bog‘liq:

- **Kod bazasi hajmi** va modullar orasidagi bog‘liqliklar soni.
- **Joriy kod sifati**: dinamika va «sehr» qancha ko‘p bo‘lsa, tiplarni tasvirlash shuncha qiyin.
- **Bog‘liqliklar**: kutubxonalarda tayyor tiplar (`@types/...`) bormi.
- **Maqsadli qat’iylik**: `strict` ni darhol yoki asta-sekin yoqish.
- **Testlar bilan qamrov**: testlar qayta yozish paytida regressiyalardan himoya qiladi.

Ishlaydigan yondashuv — **bosqichma-bosqich migratsiya**:

1. JS va TS birga yashashi uchun `allowJs: true` bilan `tsconfig.json` qo‘shing.
2. Yangi fayllarni darhol TypeScriptda yozing.
3. Mavjud modullarni birma-bir o‘tkazing, umumiy utilitalar va API ma’lumot tiplaridan boshlang.
4. Kod tayyor bo‘lgani sari qat’iy tekshiruvlarni yoqing.

Butun loyihani «bir urinishda» qayta yozish deyarli har doim xavfliroq.

## Ko‘p uchraydigan xatolar

- **Hamma joyda `any`.** Bu tekshiruvni o‘chiradi va foydani yo‘qqa chiqaradi.
- **Tashqi ma’lumotlarga ishonish.** API javobidagi tip — bu tekshiruv emas, va’da.
- **Haddan tashqari murakkab tiplar.** Tip koddan ko‘ra qiyinroq o‘qilsa, uni soddalashtirish kerak.

## FAQ

### TypeScript saytni sekinlashtiradimi?

Yo‘q. Tiplar yig‘ish paytida olib tashlanadi, brauzerga oddiy JavaScript boradi. Ta’sir faqat yig‘ish va tekshirish vaqtiga bor.

### Kichik loyihaga TypeScript kerakmi?

Shart emas. Kichik skript yoki prototip uchun JavaScript yetarli. TypeScript foydasi kod hajmi, jamoa kattaligi va loyiha umri bilan o‘sadi.

### TypeScriptni backendda ishlatsa bo‘ladimi?

Ha. Node.js loyihalari, NestJS, Express va boshqa server yechimlari TypeScriptdan keng foydalanadi, umumiy tiplarni esa klient va server o‘rtasida bo‘lishish mumkin.
