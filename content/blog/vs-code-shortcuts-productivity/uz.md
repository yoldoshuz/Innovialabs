---
title: VS Code’da tez ishlash uchun tezkor tugmalar va usullar
description: VS Code’da multikursor, buyruqlar palitrasi, tez navigatsiya, refaktoring, snippetlar va o‘z tugma birikmalaringiz: Windows va macOS uchun misollar bilan.
summary: VS Code’da ishni eng ko‘p tezlashtiradigan beshta odat bor: menyu o‘rniga buyruqlar palitrasi, fayl va funksiyalarga klaviaturadan o‘tish, multikursor, F2 va Ctrl+. orqali refaktoring hamda o‘z snippet va tugmalaringiz.
---
## Eng ko‘p vaqt tejaydigan odatlar

Yuzlab tugma birikmalarini yodlash shart emas. Deyarli butun yutuqni bir nechta usul beradi:

- **Buyruqlar palitrasi** — muharrirning istalgan funksiyasi nomi bo‘yicha topiladi, menyuda qidirish kerak emas.
- **Tez navigatsiya** — faylni ochish, funksiya yoki qatorga o‘tish sichqonchasiz bajariladi.
- **Multikursor** — bir vaqtda bir nechta joyni tahrirlash.
- **Refaktoring** — matnni emas, kodni tushunadigan qayta nomlash va tezkor tuzatishlar.
- **Snippetlar va o‘z tugmalaringiz** — takrorlanadigan amallar bitta bosishga aylanadi.

Quyida birikmalar **Windows / macOS** ko‘rinishida berilgan. Linux’da ular asosan Windows bilan bir xil.

## Buyruqlar palitrasi va fayl qidirish

| Amal | Windows | macOS |
|---|---|---|
| Buyruqlar palitrasi | Ctrl+Shift+P | Cmd+Shift+P |
| Faylni nomi bo‘yicha ochish | Ctrl+P | Cmd+P |
| Joriy fayldagi simvol | Ctrl+Shift+O | Cmd+Shift+O |
| Butun loyihadagi simvol | Ctrl+T | Cmd+T |
| Qatorga o‘tish | Ctrl+G | Ctrl+G |
| Barcha fayllar bo‘yicha qidiruv | Ctrl+Shift+F | Cmd+Shift+F |

Foydali tafsilot: **Ctrl+P** oynasida prefiks yozish mumkin. `>` uni buyruqlar palitrasiga aylantiradi, `@` fayldagi simvollarni qidiradi, `:` qatorga o‘tadi. Bitta birikmani eslab qolish kifoya.

## Kod bo‘ylab harakatlanish

- **F12** — funksiya yoki klass ta’rifiga o‘tish.
- **Alt+F12 / Option+F12** — ta’rifni joriy fayldan chiqmasdan qalqib chiquvchi oynada ko‘rish.
- **Shift+F12** — simvol ishlatilgan barcha joylarni ko‘rsatish.
- **Alt+← / Ctrl+-** — o‘tishdan oldingi joyga qaytish.
- **Ctrl+Tab** — ochiq vkladkalar orasida almashish.

«F12 — o‘qidim — orqaga qaytdim» zanjiri ko‘p hollarda loyiha bo‘ylab qo‘lda qidirishning o‘rnini bosadi.

## Multikursor

| Amal | Windows | macOS |
|---|---|---|
| Bosish orqali kursor qo‘shish | Alt+bosish | Option+bosish |
| Yuqori / pastga kursor | Ctrl+Alt+↑/↓ | Cmd+Option+↑/↓ |
| Keyingi moslikni belgilash | Ctrl+D | Cmd+D |
| Moslikni o‘tkazib yuborish | Ctrl+K Ctrl+D | Cmd+K Cmd+D |
| Barcha mosliklarni belgilash | Ctrl+Shift+L | Cmd+Shift+L |
| Har bir belgilangan qator oxiriga kursor | Shift+Alt+I | Shift+Option+I |

Odatiy holat: o‘zgaruvchi nomini belgilang, **Ctrl+D** ni bir necha marta bosing va yozishni boshlang — tanlangan barcha joylar o‘zgaradi. To‘rtburchak belgilash uchun **Shift+Alt** (macOS’da **Shift+Option**) ni bosib turib sichqoncha bilan torting.

## Qatorlarni tahrirlash

- **Alt+↑/↓ / Option+↑/↓** — qatorni ko‘chirish.
- **Shift+Alt+↑/↓ / Shift+Option+↑/↓** — qatorni nusxalash.
- **Ctrl+Shift+K / Cmd+Shift+K** — qatorni o‘chirish.
- **Ctrl+/ / Cmd+/** — qator yoki belgilangan qismni izohga aylantirish.
- **Shift+Alt+F / Shift+Option+F** — hujjatni formatlash.

## Refaktoring

- **F2** — simvolni butun loyihada qayta nomlash. Qidirish va almashtirishdan farqli o‘laroq, muharrir ko‘rinish sohasini hisobga oladi va boshqa joylardagi bir xil nomli o‘zgaruvchilarga tegmaydi.
- **Ctrl+. / Cmd+.** — tezkor tuzatishlar va refaktoringlar: import qo‘shish, kodni funksiya yoki konstantaga chiqarish, linter xatosini tuzatish.

Mavjud refaktoringlar to‘plami til va o‘rnatilgan kengaytmalarga bog‘liq: TypeScript va JavaScript uchun u boshidan boy, boshqa tillar uchun mos til plagini kerak.

## O‘z snippetlaringiz

Snippet — qisqa so‘z orqali ochiladigan shablon. Buyruqlar palitrasini oching, «snippets» deb yozing va kerakli til yoki butun loyiha uchun snippet sozlamasini tanlang.

```json
{
  "React component": {
    "prefix": "rfc",
    "body": [
      "export function ${1:Component}() {",
      "  return <div>$0</div>;",
      "}"
    ],
    "description": "React funksional komponenti"
  }
}
```

`$1` — kiritish uchun birinchi joy, `$0` — oxirida kursor turadigan joy. Loyiha darajasidagi snippetlar `.vscode` papkasida saqlanadi va repozitoriyga tushadi, shuning uchun ulardan butun jamoa foydalanadi.

## O‘z tugma birikmalaringiz

Birikmalar muharriri **Ctrl+K Ctrl+S / Cmd+K Cmd+S** orqali ochiladi. U yerda qaysi tugmalar band ekanini ko‘rasiz. Aniq sozlash uchun JSON ko‘rinishini oching (birikmalar muharririning yuqori o‘ng burchagidagi belgi):

```json
[
  {
    "key": "shift+alt+d",
    "command": "editor.action.duplicateSelection",
    "when": "editorTextFocus"
  }
]
```

`when` maydoni birikma qayerda ishlashini cheklaydi va to‘qnashuvlardan saqlaydi.

## Ko‘p uchraydigan xatolar

- Hammasini birdaniga o‘rganishga urinish. Haftasiga 3–4 ta birikmani odatga aylanguncha mashq qiling.
- Buyruqlar palitrasida bor amalni menyudan sichqoncha bilan qidirish.
- **F2** o‘rniga qidirish va almashtirish orqali qayta nomlash — ortiqcha joylarga tegib ketish oson.
- O‘z tugmalaringizni operatsion tizim birikmalari ustiga tayinlash.

## FAQ

### Boshqa muharrirdagi odatiy tugmalarni ko‘chirib o‘tsa bo‘ladimi?

Ha. Kengaytmalar do‘konida mashhur muharrir va IDE’lar uchun tugmalar to‘plamlari (keymaps) bor. Ular asosiy birikmalarni qayta tayinlaydi va qaytadan o‘rganishga to‘g‘ri kelmaydi.

### Birikma va snippetlarni kompyuterlar orasida qanday sinxronlash mumkin?

Akkaunt orqali o‘rnatilgan sozlamalar sinxronizatsiyasini (Settings Sync) yoqing. U sozlamalar, tugma birikmalari, snippetlar va kengaytmalar ro‘yxatini ko‘chiradi.

### Birikmalarning to‘liq ro‘yxatini qayerdan ko‘rish mumkin?

Buyruqlar palitrasida operatsion tizimingiz uchun tugma birikmalari ma’lumotnomasini ochadigan buyruq bor. Lekin birikmalar muharriri qulayroq: unda amal nomi va tugmaning o‘zi bo‘yicha qidirish mumkin.
