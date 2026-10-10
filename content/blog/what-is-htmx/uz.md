---
title: htmx nima va qachon JS-freymvork kerak emas
description: htmx HTML atributlari orqali interaktivlik qo‘shadi, server esa tayyor HTML bo‘laklarini yuboradi. Odatiy ssenariylar va SPA bilan taqqoslagandagi cheklovlar.
summary: htmx — atributlar orqali sahifa qismlarini serverdan kelgan HTML bo‘laklari bilan yangilaydigan kichik kutubxona; formalar, qidiruv, jadvallar va admin panellar uchun u ko‘pincha React yoki Vue o‘rnini bosadi, lekin boy klient interfeyslarga mos kelmaydi.
---
## Qisqa javob

**htmx** — HTML’ni `hx-get` va `hx-post` kabi atributlar bilan kengaytiradigan kichik JavaScript kutubxonasi. Istalgan element serverga so‘rov yuborishi mumkin, javob esa — **tayyor HTML bo‘lagi** — sahifaning kerakli joyiga qo‘yiladi.

«Server JSON beradi, klient interfeysni chizadi» sxemasi o‘rniga **«server HTML beradi, brauzer uni joylaydi»** sxemasi ishlaydi. Buni **hypermedia-driven** yondashuv deyishadi: holat va mantiq serverda qoladi, klient kodi deyarli yo‘q.

Agar interfeys asosan **formalar, ro‘yxatlar, jadvallar, filtrlar va kartochkalar**dan iborat bo‘lsa va ma’lumotlar baribir serverda yashasa, JS-freymvork kerak emas.

## Qanday ishlaydi

Asosiy atributlar:

- `hx-get`, `hx-post`, `hx-put`, `hx-delete` — qanday so‘rov yuborish;
- `hx-trigger` — qaysi hodisada (bosish, kiritish, aylantirish);
- `hx-target` — javobni qayerga qo‘yish;
- `hx-swap` — qanday qo‘yish: ichini almashtirish, butun elementni, oxiriga qo‘shish;
- `hx-indicator` — yuklanish paytida nimani ko‘rsatish.

Backend istalgan bo‘lishi mumkin: Django, Laravel, Rails, Go, Node.js, ASP.NET. U klassik saytdagidek shablonlarni render qiladi, faqat ba’zan butun sahifani emas, uning bir bo‘lagini qaytaradi.

## Odatiy ssenariylar

### Qayta yuklanmaydigan forma

```html
<form hx-post="/contacts" hx-target="this" hx-swap="outerHTML">
  <input name="email" type="email" required>
  <button>Yuborish</button>
</form>
```

Server ma’lumotlarni tekshiradi va xatolari bor formani yoki muvaffaqiyat xabarini qaytaradi. Validatsiya bitta joyda — serverda yashaydi.

### Jonli qidiruv

```html
<input type="search" name="q"
       hx-get="/search"
       hx-trigger="input changed delay:300ms"
       hx-target="#results">
<div id="results"></div>
```

So‘rov yozishdagi qisqa pauzadan keyin yuboriladi, server esa natijalarning tayyor ro‘yxatini qaytaradi.

### Sahifalash va cheksiz aylantirish

```html
<tr hx-get="/orders?page=2"
    hx-trigger="revealed"
    hx-swap="afterend">
  <td>Yuklanmoqda...</td>
</tr>
```

Qator ekranda paydo bo‘lganda keyingi qism yuklanadi. Oddiy sahifalash uchun «Yana» tugmasidagi `hx-get` va brauzerdagi manzilni yangilash uchun `hx-push-url` yetarli.

## htmx va SPA freymvorklar

| Mezon | htmx | React / Vue (SPA) |
|---|---|---|
| Holat qayerda | serverda | asosan klientda |
| Javob formati | HTML | odatda JSON |
| Klient kodi hajmi | minimal | sezilarli |
| Frontend build | majburiy emas | kerak |
| Oflayn rejim | deyarli yo‘q | mumkin |
| Murakkab muharrirlar, drag-and-drop | noqulay | tabiiy |
| Serversiz bir zumda javob | yo‘q | ha |
| Alohida frontend jamoa kerakmi | odatda yo‘q | odatda ha |

## htmx qachon yaxshi tanlov

- jadval va formalarga boy **admin panellar, CRM, ichki tizimlar**;
- loyiha allaqachon shablonli server freymvorkida;
- ikki ilovani — API va SPA’ni qo‘llab-quvvatlashni istamaydigan kichik jamoa;
- mavjud ko‘p sahifali saytni qayta yozmasdan «jonlantirish» kerak.

## Cheklovlar qayerda boshlanadi

- **Boy klient interfeys**: grafik muharrirlar, sudrab o‘tkaziladigan kanban, lokal holatga ega murakkab dashboardlar.
- **Oflayn va beqaror tarmoq**: har bir harakat server javobini talab qiladi.
- **Mobil ilova va uchinchi tomon klientlari**: ularga baribir JSON API kerak va uni alohida qilishga to‘g‘ri keladi.
- **Mayda klient mantiq**, masalan menyuni ochish — buning uchun htmx yoniga odatda Alpine.js kabi yengil kutubxona yoki bir necha qator oddiy JavaScript qo‘shiladi.

## Odatiy xatolar

- **htmx’da SPA’ni takrorlashga urinish**: murakkab holatni DOM’da saqlash va o‘nlab atributlarni bog‘lash.
- **Bo‘lak o‘rniga butun sahifani qaytarish** — sekin va maketni buzadi.
- **Xavfsizlikni unutish**: shablonlar foydalanuvchi kiritgan ma’lumotni ekranlashi, POST so‘rovlar esa CSRF’dan himoyalangan bo‘lishi kerak.

## FAQ

### htmx SEO uchun mos keladimi?

Ha, agar asosiy sahifalar server tomonidan oddiy HTML sifatida berilsa. htmx faqat ular ustiga bo‘laklarni yuklaydi, shuning uchun qidiruv tizimlari to‘liq kontentni ko‘radi.

### htmx’ni React bilan birga ishlatish mumkinmi?

Texnik jihatdan mumkin, lekin bu holat bilan ishlashning ikki xil yondashuvi. Odatda bittasi asosiy bo‘ladi, ikkinchisi nuqtali ishlatiladi — masalan, htmx sahifasidagi alohida React vidjeti.

### htmx uchun alohida API kerakmi?

Yo‘q. HTML bo‘laklarini qaytaradigan server marshrutlari yetarli. JSON API faqat mobil ilovalar yoki integratsiyalar uchun kerak bo‘ladi.
