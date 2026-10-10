---
title: React nima va nega u bunchalik mashhur
description: React’ning oddiy tushuntirishi: komponentlar, JSX, props, state va virtual DOM, kichik ilova misoli va React qachon mos, qachon mos emasligi.
summary: React — interfeyslarni komponentlardan quruvchi JavaScript kutubxonasi: siz ekran berilgan holatda qanday ko‘rinishini tasvirlaysiz, React esa sahifaning kerakli qismlarini o‘zi yangilaydi.
---

## React haqida qisqacha

**React** — foydalanuvchi interfeyslarini qurish uchun JavaScript kutubxonasi. U Meta (Facebook)da yaratilgan va 2013-yilda ochiq kodli bo‘lgan. React faqat ko‘rinish qatlamiga javob beradi: ma’lumotlar foydalanuvchi ekranda ko‘radigan narsaga qanday aylanadi.

Asosiy g‘oya — **deklarativlik**. Siz «elementni top, matnini o‘zgartir, klass qo‘sh» deb yozmaysiz. Interfeys joriy ma’lumotlarda qanday ko‘rinishi kerakligini tasvirlaysiz, React esa DOM’da nimani o‘zgartirish kerakligini o‘zi hisoblaydi.

## Beshta asosiy tushuncha

**Komponentlar.** Interfeys mustaqil bloklardan yig‘iladi: tugma, mahsulot kartochkasi, forma. Komponent — maket qaytaradigan oddiy funksiya. Bir marta yozasiz — hamma joyda ishlatasiz.

**JSX.** JavaScript ichidagi HTML’ga o‘xshash sintaksis. U funksiya chaqiruvlariga kompilyatsiya qilinadi, shuning uchun jingalak qavslar ichida istalgan ifodani yozish mumkin: `{user.name}`, `{items.length > 0 && <List />}`.

**Props.** Komponentga ota-komponent uzatadigan kirish parametrlari. Komponent ularni o‘zgartirmaydi — faqat o‘qiydi. Ma’lumotlar **yuqoridan pastga** oqadi.

**State.** Komponentning ichki holati: maydon qiymati, ro‘yxat ochiqmi, hisoblagich. State o‘zgarganda React komponentni qayta chaqiradi va ekranni yangilaydi.

**Virtual DOM.** Haqiqiy DOM bilan ishlash nisbatan qimmat. React xotirada interfeysning yengil tavsifini quradi, yangi versiyani eskisi bilan solishtiradi (bu jarayon **reconciliation** deyiladi) va sahifaga faqat haqiqiy farqlarni qo‘llaydi.

## Kichik ilova

Bitta komponentdagi vazifalar ro‘yxati:

```jsx
import { useState } from "react";

function TodoApp() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  function add() {
    if (!text.trim()) return;
    setItems([...items, text]);
    setText("");
  }

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>Qo‘shish</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

Bu yerda nima bo‘lyapti:

- `useState` — chizishlar orasida holatni saqlaydigan **hook**.
- Kiritish maydoni **boshqariladigan**: uning qiymati har doim state’dan olinadi.
- `setItems` eski massivni o‘zgartirmay, yangisini yaratadi — React o‘zgarishni shunday sezadi.
- `key` React’ga ro‘yxatning qaysi elementi o‘zgarganini tushunishga yordam beradi. Real loyihalarda indeks o‘rniga barqaror id ishlatgan ma’qul.

## Nega React bunchalik mashhur

- **Komponentli yondashuv** yaxshi kengayadi: katta interfeys tushunarli qismlarga bo‘linadi.
- **Ulkan ekotizim**: routing, formalar, holatni boshqarish, UI kutubxonalar — deyarli har bir vazifa uchun tayyor yechim bor.
- **React ustidagi freymvorklar**, masalan, Next.js, server rendering, marshrutlash va optimallashtirishlarni tayyor holda qo‘shadi.
- **React Native** bilimlarni mobil ilovalar uchun ham qayta ishlatish imkonini beradi.
- **Katta hamjamiyat**: ko‘plab hujjatlar, savollarga javoblar va bozorda dasturchilar.

## React qachon mos va qachon mos emas

| Mos | Ehtimol kerak emas |
|---|---|
| Interaktiv ilovalar: kabinetlar, CRM, dashboardlar | Interaktivsiz oddiy lending yoki vizitka |
| Ko‘p holatga ega interfeyslar | Sayt generatori yetadigan statik blog |
| Jamoa uzoq vaqt rivojlantiradigan loyihalar | Tayyor saytdagi kichik vidjet |
| Umumiy yondashuvli veb va mobil ilova kerak | Jamoa boshqa stekda kuchli va muddatlar qisqa |

Muhim: freymvorksiz «sof» React kontentni brauzerda render qiladi. SEO muhim bo‘lgan sahifalar uchun odatda server rendering’li freymvork ishlatiladi.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- Yangi qiymat yaratish o‘rniga state’ni to‘g‘ridan-to‘g‘ri o‘zgartirish (`items.push(...)`).
- Boshqa ma’lumotlardan hisoblash mumkin bo‘lgan narsani state’da saqlash.
- Butun interfeysni bitta ulkan komponentga joylash.
- Saralanadigan yoki filtrlanadigan ro‘yxatlarda massiv indeksini `key` sifatida ishlatish.
- O‘rnatilgan `useState` va `useContext` yetarli bo‘lgan loyihaga holatni boshqarish kutubxonasini qo‘shish.

O‘rganishni [rasmiy hujjatlardan](https://react.dev) boshlash eng qulay.

## FAQ

### React freymvorkmi yoki kutubxonami?

Rasman kutubxona: u interfeysga javob beradi, marshrutlash, ma’lumot yuklash va yig‘ish esa boshqa vositalar yoki Next.js kabi freymvorklar orqali hal qilinadi.

### React’dan oldin JavaScript’ni bilish kerakmi?

Ha. Funksiyalar, massivlar, obyektlar, destrukturizatsiya va modullarni yaxshi tushunmasangiz, React sehrdek tuyuladi, xatolar esa tushunarsiz bo‘ladi.

### React SEO uchun mosmi?

Ha, agar server rendering yoki statik sahifalar generatsiyasidan foydalansangiz — masalan, Next.js orqali. Faqat brauzerda render qilinadigan saytni qidiruv tizimlari yomonroq indekslaydi.
