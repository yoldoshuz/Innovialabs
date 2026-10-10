---
title: Statik va dinamik tiplashtirish: afzallik, kamchilik, misollar
description: Statik va dinamik, kuchli va kuchsiz tiplashtirish farqi, bitta xato turli tillarda qanday ko‘rinadi va bosqichma-bosqich tiplashtirish nima uchun kerak.
summary: Statik tiplashtirishda tiplar ishga tushirishdan oldin, dinamikda esa ishlash vaqtida tekshiriladi; kuchli yoki kuchsiz tiplashtirish — yashirin o‘zgartirishlar haqidagi alohida savol, bosqichma-bosqich tiplashtirish (TypeScript, Python annotatsiyalari) esa ikkala yondashuvning yaxshi tomonlarini birlashtiradi.
---

## Qisqacha: ikki xil o‘q

Tiplashtirish ikkita mustaqil savol bilan tavsiflanadi.

**Tiplar qachon tekshiriladi?**
- **Statik** — ishga tushirishdan oldin, kompilyatsiya yoki tahlil bosqichida. Misollar: Java, C#, Go, Rust, TypeScript.
- **Dinamik** — ishlash vaqtida, kod aniq qatorga yetib kelganda. Misollar: Python, JavaScript, Ruby, PHP.

**Til tiplarni aralashtirishga qanchalik toqatli?**
- **Kuchli** — yashirin o‘zgartirishlar kam, satr va sonni aniq o‘zgartirishsiz qo‘shib bo‘lmaydi. Misol: Python.
- **Kuchsiz** — til tiplarni o‘zi bajonidil o‘zgartiradi. Misol: JavaScript, bu yerda `"5" * 2` natijasi `10`.

Bular turli o‘qlar: Python — **dinamik va kuchli**, JavaScript — **dinamik va kuchsiz**, Java — **statik va asosan kuchli**. «Kuchli/kuchsiz» atamalarining qat’iy ta’rifi yo‘q, shuning uchun yorliq emas, aniq xatti-harakat haqida gapiring.

## Bitta xato — uchta til

Funksiya buyurtma summasini hisoblaydi, narx esa formadan satr ko‘rinishida keldi.

**JavaScript (dinamik, kuchsiz):**

```javascript
function total(price, qty) {
  return price + qty;
}
total("100", 2); // "1002" — xatosiz, shunchaki noto‘g‘ri natija
```

Xato jim: dastur noto‘g‘ri ma’lumotlar bilan ishlashda davom etadi.

**Python (dinamik, kuchli):**

```python
def total(price, qty):
    return price + qty

total("100", 2)  # TypeError: can only concatenate str (not "int") to str
```

Xato chiqadi, lekin faqat **kod bajarilganda** — ehtimol, allaqachon foydalanuvchi oldida.

**TypeScript (statik):**

```typescript
function total(price: number, qty: number): number {
  return price + qty;
}
total("100", 2);
// Kompilyatsiya xatosi: Argument of type 'string'
// is not assignable to parameter of type 'number'.
```

Xato **ishga tushirishdan oldin, muharrirning o‘zida** ko‘rinadi.

## Afzallik va kamchiliklar

| | Statik | Dinamik |
|---|---|---|
| Tip xatolari qachon topiladi | ishga tushirishdan oldin | ishlash vaqtida |
| IDE’dagi maslahatlar va avtoto‘ldirish | aniq | cheklangan |
| Refaktoring | xavfsizroq: kompilyator nima buzilganini ko‘rsatadi | hech narsani o‘tkazib yubormaslik uchun testlar kerak |
| Loyihani boshlash tezligi | tiplarni tavsiflash uchun ko‘proq kod | prototipni tezroq yozish mumkin |
| Moslashuvchanlik | pastroq, ba’zan tiplar tizimini «ko‘ndirish» kerak | yuqori |
| Tiplar hujjat sifatida | kodga o‘rnatilgan | implementatsiya yoki izohlarni o‘qish kerak |

Hech biri **testlarni** almashtirmaydi: tiplar ma’lumot shakllarining mos kelmasligini ushlaydi, noto‘g‘ri biznes-mantiqni emas.

## Bosqichma-bosqich tiplashtirish: o‘rta yo‘l

**Gradual typing** tiplarni asta-sekin, faqat kerakli joylarga qo‘shish imkonini beradi.

- **TypeScript** — JavaScript ustidagi qatlam. Erkin koddan boshlab, `strict` sozlamasi orqali tekshiruvlarni kuchaytirish mumkin.
- **Python type hints** — interpretator tekshirmaydigan annotatsiyalar, lekin ularni **mypy**, **pyright** va IDE’lar tekshiradi.

```python
def total(price: float, qty: int) -> float:
    return price * qty

total("100", 2)  # mypy: Argument 1 has incompatible type "str"
```

Ko‘plab jamoalar shunday ishlaydi: prototip tez yoziladi, loyiha o‘sgan sari esa tiplar asosiy modullarga — API, ma’lumot modellari, umumiy utilitalarga qo‘shiladi.

## Qanday tanlash kerak

- **Kichik skript, tajriba, bir martalik vazifa** — annotatsiyasiz dinamik til bemalol mos keladi.
- **Bir necha kishi yillar davomida rivojlantiradigan loyiha** — statik yoki bosqichma-bosqich tiplashtirish qo‘llab-quvvatlash va refaktoringni sezilarli osonlashtiradi.
- **JS yoki Python’da katta kod bazasi allaqachon bor** — hammasini qayta yozmang, tiplarni tizim chegaralaridan boshlab bosqichma-bosqich kiriting.

## Keng tarqalgan xatolar

- TypeScript’ni yoqib, hamma joyda `any` yozish — tekshiruv rasman bor, amalda yo‘q.
- Kod kompilyatsiya bo‘ldi, demak to‘g‘ri ishlaydi, deb hisoblash.
- Python’ga annotatsiyalar qo‘shib, CI’da tip tekshiruvini ishga tushirmaslik — shunda ular tezda eskiradi.

## FAQ

### Statik tiplashtirish dasturni tezlashtiradimi?

Ba’zan: tiplarni bilgan kompilyator kodni yaxshiroq optimallashtirishi mumkin. Lekin asosiy foyda — tezlik emas, xatolarni erta aniqlash va qo‘llab-quvvatlash qulayligi.

### TypeScript tiplarni ishlash vaqtida tekshiradi, bu to‘g‘rimi?

Yo‘q. TypeScript tiplarni yig‘ish paytida tekshiradi, keyin tipsiz oddiy JavaScript’ga aylanadi. Tashqi manbalardan keladigan ma’lumotlarni (API, formalar) alohida tekshirish kerak, masalan, validatsiya sxemalari bilan.

### Python qat’iy tiplashtirilgan tilmi?

Python dinamik va shu bilan birga kuchli tiplashtirilgan: u satr va sonlarni yashirin aralashtirmaydi. Statik tekshiruvni annotatsiyalar va mypy kabi tashqi vositalar orqali qo‘shish mumkin.
