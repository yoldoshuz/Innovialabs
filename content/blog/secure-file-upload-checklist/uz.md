---
title: Fayllarni xavfsiz yuklash: dasturchi uchun chek-list
description: Fayllarni xavfsiz yuklash chek-listi: kengaytma va MIME tekshiruvi, hajm limiti, web root’dan tashqarida saqlash, qayta nomlash, antivirus va SVG xavflari.
summary: Yuklangan fayl — ishonchsiz ma’lumot, uni ishga tushirish ham, o‘z holicha berish ham mumkin emas. Turini allowlist va signatura bo‘yicha tekshiring, hajmini cheklang, qayta nomlang, web root’dan tashqarida saqlang, rasmlarni qayta kodlang va viruslarga skanerlang.
---

## Asosiy qoida

Foydalanuvchidan kelgan har qanday fayl — **ishonchsiz kiritma**. Nomi, kengaytmasi, `Content-Type` va mazmunini uni yuklagan odam boshqaradi. Xavfli ssenariylar uchta:

- serverda **kod bajarilishi**, agar fayl veb-server uni ishga tushiradigan joyga tushsa (`/uploads/` ichidagi `shell.php`);
- **XSS va fishing**, agar HTML yoki SVG sizning domeningizdan berilib, brauzerda ochilsa;
- **xizmat ko‘rsatishni rad etish** — ulkan fayllar, arxiv va rasmlardagi «bombalar».

Quyidagi chek-list uchalasini ham yopadi.

## 1. Fayl turi

- Blocklist emas, **kengaytmalar allowlist’i**: `jpg`, `png`, `pdf` — keragidan ortiq hech narsa. «Taqiqlanganlar» ro‘yxati har doim to‘liq emas (`phtml`, `phar`, `shtml`…).
- Kengaytmani **oxirgi** nuqtadan keyin oling va kichik harflarga o‘tkazing. `photo.php.jpg` va `photo.JPG` — tez-tez uchraydigan aylanib o‘tish usullari.
- **So‘rovdagi `Content-Type` dalil emas:** uni mijoz o‘rnatadi. **Fayl signaturasini** (magic bytes) `libmagic` yoki `file-type` kabi kutubxona bilan tekshiring.
- Kengaytma, MIME va signatura **mos kelishi** kerak. Nomuvofiqlik — rad etish.

## 2. Hajm va soni

- Katta fayl xotirani egallab olmasidan oldin kesilishi uchun limitni proksi (Nginx’da `client_max_body_size`), ilova va ombor darajasida qo‘ying.
- Rasmlar uchun faqat baytlarni emas, **piksellardagi o‘lchamni** ham tekshiring: kichik fayl ulkan rasmga ochilishi mumkin.
- Arxivlarni umumiy hajm va fayllar soni limiti bilan oching, ichidagi yo‘llarni esa `../`ga tekshiring (zip slip).
- Bir foydalanuvchidan va vaqt birligida yuklashlar sonini cheklang.

## 3. Qayerda saqlash kerak

- **Web root’dan tashqarida** yoki xususiy bucket’li **obyekt omborida** (S3-mos). Veb-server yuklangan faylni ishga tushira olmasligi kerak.
- Fayllarni huquqni tekshiradigan handler orqali yoki amal qilish muddati cheklangan **imzolangan havolalar** orqali bering.
- Foydalanuvchi kontentini **alohida domendan** (`usercontent.example.net`) bergan ma’qul: u yerga skript tushib qolsa ham, asosiy sayt cookie’lariga yeta olmaydi.
- Yuklab olish huquqini istalgan ma’lumot kabi qat’iy tekshiring, aks holda `/files/123` orqali IDOR paydo bo‘ladi.

## 4. Fayl nomi

- **Nomni o‘zingiz yarating** (UUID yoki xesh), asl nomni esa bazada saqlang.
- Bu path traversal (`../../etc/passwd`), boshqalarning fayllarini qayta yozish, maxsus belgilar va haddan tashqari uzun nomlarni yopadi.
- Berishda asl nomni `Content-Disposition`da ekranlang, interfeysda esa oddiy matn sifatida chiqaring.

## 5. Rasmlar

- Rasmlarni **qayta kodlang**: ishlov berish kutubxonasi orqali dekodlab, qaytadan saqlang. Bu begona ma’lumotlarni, «poliglot»larni (bir vaqtda ikki formatda yaroqli fayl) va EXIF metama’lumotlarini, jumladan geolokatsiyani o‘chiradi.
- Ishlov berish kutubxonalarini yangilab turing: ularda muntazam ravishda zaifliklar topiladi.
- Ishlovni resurslari cheklangan va ortiqcha tarmoq ruxsatlari bo‘lmagan alohida worker yoki konteynerda bajaring.

## 6. Antivirus

- Fayllar boshqa foydalanuvchilarga ochiq bo‘lishidan oldin ularni skanerlang (masalan, **ClamAV** bilan).
- Qulay sxema: fayl «tekshiruvda» statusi bilan karantinga tushadi, asinxron worker uni skanerlaydi va shundan keyingina fayl e’lon qilinadi.
- Antivirus yuqoridagi bandlarni almashtirmaydi: u ma’lum zararli dasturlarni ushlaydi, SVG ichidagi XSS’ni emas.

## 7. SVG va HTML

**SVG — bu XML**, uning ichida `<script>`, hodisa ishlovchilari va tashqi havolalar bo‘lishi mumkin. Agar SVG sizning domeningizdan ochilsa, bu saqlanuvchi XSS. Variantlar:

| Variant | Qachon mos |
|---|---|
| SVG’ni taqiqlash | usiz ishlash mumkin bo‘lsa |
| PNG’ga konvertatsiya qilish | avatarlar va preview’lar uchun |
| Sanitizatsiya (masalan, serverda DOMPurify) | vektor format kerak bo‘lsa |
| Alohida domendan attachment sifatida berish | «o‘z holicha» saqlash uchun |

Xuddi shu narsa HTML, XML va faol kontentli PDF’larga ham tegishli.

## 8. Berishdagi sarlavhalar

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="report.pdf"
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; sandbox
```

`nosniff` brauzerga turni taxmin qilishni taqiqlaydi, `attachment` esa faylni ochish o‘rniga yuklab olishga majbur qiladi. Batafsil — [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## FAQ

### Fayl kengaytmasini tekshirish yetarlimi?

Yo‘q. Kengaytma va `Content-Type`ni mijoz belgilaydi. Signatura tekshiruvi, ishga tushirib bo‘lmaydigan saqlash va xavfsiz berish ham kerak — aks holda konfiguratsiyadagi bitta xato buzib kirishga aylanadi.

### Faqat rasmlarni qabul qilsak, antivirus kerakmi?

Rasmlarni qayta kodlash xavflarning katta qismini yopadi. Antivirus fayllarni boshqa odamlar yuklab oladigan holatda, ayniqsa hujjatlar va arxivlar uchun foydali.

### Logotiplar uchun SVG yuklashga ruxsat bersa bo‘ladimi?

Bo‘ladi, agar SVG sanitizatsiya qilinsa yoki rastrga aylantirilsa va asl fayllar alohida domendan berilsa. Xom SVG’ni asosiy domendan berish xavfli.
