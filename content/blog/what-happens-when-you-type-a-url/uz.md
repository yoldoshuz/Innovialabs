---
title: Sayt manzilini kiritib Enter bosganingizda nima sodir bo‘ladi
description: Bosqichma-bosqich: DNS so‘rovi, TCP va TLS ulanish, HTTP so‘rov, server javobi, HTML tahlili va chizish. Sahifa yuklanish tezligi qayerda yo‘qolishi tushunarli.
summary: Brauzer DNS orqali IP-ni topadi, himoyalangan ulanish o‘rnatadi (TCP + TLS), HTTP so‘rov yuboradi, HTML oladi, CSS, JS va rasmlarni yuklaydi, so‘ng sahifani quradi va chizadi.
---
## Qisqa javob: soniyaning bir qismida olti bosqich

Enter bosilgandan keyin brauzer bir qator qadamlardan o‘tadi:

1. **Manzilni tahlil qiladi** va keshni tekshiradi.
2. **DNS** — domen nomi bo‘yicha server IP-manzilini aniqlaydi.
3. **TCP** — server bilan ulanish o‘rnatadi.
4. **TLS** — shifrlash bo‘yicha kelishadi (HTTPS uchun).
5. **HTTP** — so‘rov yuboradi va javob oladi.
6. **Rendering** — HTML, CSS va JavaScript ni ekrandagi piksellarga aylantiradi.

Har bir bosqich vaqt oladi va bu zanjirni tushunish sayt nega sekin yuklanayotganini topishga yordam beradi.

## 1-qadam. Manzilni tahlil qilish va kesh

Brauzer nima kiritganingizni aniqlaydi: manzilmi yoki qidiruv so‘rovimi. Agar manzil bo‘lsa, u **keshda** saqlangan sahifa, fayllar yoki allaqachon ma’lum IP bor-yo‘qligini tekshiradi. Agar ular bor va dolzarb bo‘lsa, keyingi qadamlarning bir qismi o‘tkazib yuboriladi.

## 2-qadam. DNS: IP-manzilni topish

Kompyuterlar nomlar bilan emas, IP-manzillar bilan muloqot qiladi. Brauzer **DNS-rezolverdan** (odatda provayderniki yoki ommaviy) domenning IP-sini so‘raydi. Agar rezolver javobni bilmasa, u zanjir bo‘yicha ildiz serverlarni, domen zonasi serverlarini (masalan, .uz yoki .com) va nihoyat domeningizning avtoritativ serverini so‘roq qiladi.

Javob yozuvda ko‘rsatilgan vaqtga (**TTL**) keshlanadi, shuning uchun takroriy tashriflar tezroq bo‘ladi.

## 3–4-qadamlar. TCP va TLS: ulanish va shifrlash

- **TCP qo‘l siqishi (handshake)** — klient va server xizmat paketlarini almashadi va ma’lumot uzatishga tayyorligini tasdiqlaydi.
- **TLS qo‘l siqishi** — server **sertifikat** taqdim etadi, brauzer uning ishonchli markaz tomonidan berilganini va domenga mosligini tekshiradi. So‘ng tomonlar shifrlash kalitlarini kelishib oladi.

Agar sertifikat muddati o‘tgan yoki domenga mos kelmasa, brauzer ogohlantirish ko‘rsatadi va roziligingizsiz sahifani ochmaydi. Protokollarning yangi versiyalari (HTTP/2, HTTP/3) bunday almashuvlar sonini kamaytiradi va ko‘plab fayllarni bitta ulanish orqali uzatishga imkon beradi.

## 5-qadam. HTTP so‘rov va server javobi

Brauzer quyidagi ko‘rinishdagi so‘rov yuboradi:

```http
GET / HTTP/1.1
Host: example.com
Accept: text/html
```

Server (ko‘pincha **CDN** va nginx kabi teskari proksi orqali) so‘rovni ilovaga uzatadi. Ilova ma’lumotlar bazasiga murojaat qilishi, sahifani yig‘ishi va status kodi (**200**, **301**, **404**, **500**) hamda tanasida HTML bo‘lgan javobni qaytarishi mumkin.

Bu bosqichda server javobining tezligi muhim — **TTFB** (birinchi baytgacha vaqt). Bazaga sekin so‘rovlar yoki serverda kesh yo‘qligi aynan shu yerda seziladi.

## 6-qadam. Sahifani tahlil qilish va chizish

HTML ni olgach, brauzer:

1. **DOM quradi** — sahifa elementlari daraxti.
2. **Resurslarni topadi** — CSS, JavaScript, shriftlar, rasmlar — va ularni so‘raydi.
3. **CSSOM quradi** — uslublar modeli. CSS yuklanmaguncha brauzer odatda kontentni chizmaydi, toki uslubsiz sahifa ko‘rinmasin.
4. **JavaScript ni bajaradi.** Oddiy `<script>` HTML tahlilini to‘xtatadi, shuning uchun skriptlar `defer` yoki `async` bilan ulanadi.
5. **Layout** — elementlarning o‘lchami va joylashuvini hisoblaydi.
6. **Paint va composite** — piksellarni chizadi va qatlamlarni ekranda yig‘adi.

Shundan so‘ng sahifa ko‘rinadi, lekin JavaScript ma’lumotlarni yuklashda va uni interaktiv qilishda davom etishi mumkin.

## Tezlik ko‘pincha qayerda yo‘qoladi

| Bosqich | Kechikishning odatiy sababi |
|---|---|
| DNS | Sekin DNS-provayder, juda kichik TTL |
| TCP/TLS | Server foydalanuvchidan uzoqda, CDN yo‘q |
| Server javobi | Bazaga og‘ir so‘rovlar, kesh yo‘q |
| Resurslarni yuklash | Katta rasmlar, ortiqcha skriptlar va shriftlar |
| Rendering | Bloklovchi JavaScript, murakkab verstka |

## FAQ

### Nega sayt ikkinchi marta tezroq ochiladi?

Brauzer domen IP-sini allaqachon biladi, ulanishni qayta ishlata oladi va CSS, skriptlar hamda rasmlarni keshdan oladi. Server esa faqat o‘zgargan narsani yuboradi.

### Bu zanjirda CDN nima qiladi?

CDN — turli mamlakatlardagi serverlar tarmog‘i. U fayllarni foydalanuvchiga eng yaqin tugundan beradi, ulanish va yuklash vaqtini qisqartiradi hamda asosiy serverdan yukni oladi.

### Bu bosqichlarni o‘zim ko‘rishim mumkinmi?

Ha. Brauzerda dasturchi vositalarini oching (F12), Network bo‘limiga o‘ting va sahifani yangilang. Har bir so‘rov uchun DNS, ulanish, javobni kutish va yuklashga ketgan vaqt ko‘rinadi.
