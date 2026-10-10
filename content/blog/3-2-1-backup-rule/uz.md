---
title: 3-2-1 zaxira nusxalash qoidasi: bu nima va uni qanday qo‘llash kerak
description: 3-2-1 qoidasi: uchta nusxa, ikki xil saqlash turi, bittasi tashqarida. O‘zgarmas va oflayn nusxalar hamda sayt, noutbuk va ofis uchun tayyor sxemalar.
summary: Ma’lumotlarning uchta nusxasini ikki xil saqlash turida saqlang, ulardan biri boshqa joyda bo‘lsin, hamda kamida bitta nusxani o‘chirib yoki shifrlab bo‘lmasligi uchun o‘zgarmas yoki tarmoqdan uzilgan qiling.
---
## Qisqa javob

**3-2-1 qoidasi** — hech bir yakka nosozlik ma’lumotlaringizni yo‘q qilmasligini ta’minlashning oddiy usuli:

- Ma’lumotlarning **3 ta nusxasi**: ishchi nusxa va ikkita zaxira.
- **2 xil saqlash turi**: masalan, ichki disk va NAS, server va bulutli ombor.
- **1 nusxa asosiy joydan tashqarida**: boshqa binoda, boshqa provayderda yoki bulutda.

Maqsad shuki, bitta sabab — disk buzilishi, yong‘in, o‘g‘irlik, xodim xatosi, virus — barcha nusxalarni birdaniga yo‘q qila olmasin.

## Har bir raqam nima uchun kerak

- **Uchta nusxa**, chunki zaxira nusxaning o‘zi ham buzilgan bo‘lib chiqishi mumkin. Ikkita mustaqil zaxira hech narsasiz qolish xavfini sezilarli kamaytiradi.
- **Ikki xil saqlash turi**, chunki bir xil tashuvchilar ko‘pincha bir xil sabab bilan ishdan chiqadi: bitta partiyadagi disklar, bitta kontroller, bitta provayderdagi bitta akkaunt.
- **Bitta nusxa ofisdan tashqarida**, chunki yong‘in, suv bosishi yoki o‘g‘irlik bir xonada turgan hamma narsani olib ketadi.

## Zamonaviy qo‘shimcha: o‘zgarmas va oflayn nusxalar

To‘lov talab qiluvchi dasturlar (ransomware) va administrator huquqiga ega hujumchilar birinchi navbatda qo‘li yetadigan barcha zaxira nusxalarni o‘chiradi yoki shifrlaydi. Shuning uchun bugun ko‘pincha **3-2-1-1-0** sxemasi haqida gapiriladi:

- **+1 o‘zgarmas yoki oflayn nusxa.** **O‘zgarmas (immutable)** — masalan, obyektlarni bloklash (Object Lock) imkoniyatiga ega ombor, unda faylni muddat tugaguncha o‘chirib ham, o‘zgartirib ham bo‘lmaydi. **Oflayn** — faqat nusxalash vaqtida ulanadigan va keyin uziladigan disk.
- **Tiklash tekshiruvida 0 ta xato.** Zaxira nusxadan biror narsa muvaffaqiyatli tiklangandagina u ishlaydi deb hisoblanadi.

## 3-2-1 nima emas

- **Sinxronizatsiya — zaxira emas.** Google Drive, Dropbox yoki OneDrive faylning o‘chirilishi yoki shifrlanishini barcha qurilmalarga darhol takrorlaydi. Versiyalar tarixi yordam beradi, ammo uning muddati va hajmi cheklangan.
- **RAID — zaxira emas.** U bitta disk buzilishidan himoya qiladi, lekin o‘chirish, virus yoki yong‘indan emas.
- **Xuddi shu hostingdagi snapshot** foydali, ammo u o‘sha joyda va o‘sha akkaunt ostida turadi.

## Sayt uchun sxema

| Nusxa | Qayerda | Qanday |
|---|---|---|
| 1. Ishchi | Sayt serveri | Fayllar va ma’lumotlar bazasi |
| 2. Mahalliy zaxira | Disk snapshotlari yoki hosting zaxiralari | Har kuni, panel vositalari bilan |
| 3. Tashqi | **Boshqa** provayderdagi versiyalash yoki Object Lock yoqilgan obyektli ombor | Jadval bo‘yicha har kuni baza dampi va fayllar arxivi |

Muhim: tashqi omborga kirish uchun yozish huquqi bor, lekin o‘chirish huquqi yo‘q alohida kalitlar ishlating.

## Noutbuk uchun sxema

- **1-nusxa** — noutbukning o‘zi.
- **2-nusxa** — tashqi disk: macOS da Time Machine yoki Windows da «Fayllar tarixi» / arxivlash vositasi. Uni muntazam ulang, nusxalashlar orasida alohida saqlang.
- **3-nusxa** — versiyalar tarixiga ega bulutli zaxira xizmati (shunchaki papka sinxronizatsiyasi emas).

## Kichik ofis uchun sxema

- **1-nusxa** — ishchi kompyuterlar va umumiy fayl serveri.
- **2-nusxa** — ofisdagi NAS, unga umumiy papkalar va muhim kompyuterlar avtomatik nusxalanadi. Zaxira uchun domen administratori emas, alohida hisob qaydnomasi.
- **3-nusxa** — NAS dan o‘zgarmaslik yoqilgan bulutli omborga nusxa **yoki** tashqi disklarni almashtirib turish: biri ulangan, ikkinchisi mas’ul xodimning uyida saqlanadi, haftada bir marta almashtiriladi.

## Ko‘p uchraydigan xatolar

- Barcha nusxalar bitta akkaunt yoki parol ostida — bittasi buzilsa, hammasi yo‘qoladi.
- Tashqi disk kompyuterga doim ulangan — virus uni ham shifrlaydi.
- Zaxira sozlangan, lekin tiklash bir marta ham tekshirilmagan.
- Fayllar nusxalanadi, ma’lumotlar bazasi esa yo‘q yoki baza dampsiz yozish paytida nusxalanadi.

## FAQ

### Ofisdan tashqaridagi nusxa uchun bulut majburiymi?

Yo‘q. Asosiy joydan tashqaridagi har qanday jismonan alohida tashuvchi mos keladi: mas’ul xodimning uyidagi disk, ikkinchi ofis, boshqa provayderdagi server. Bulutni avtomatlashtirish shunchaki osonroq.

### Zaxira nusxalarni qanchalik tez-tez yaratish kerak?

Qancha ma’lumot yo‘qotishga tayyor ekaningizga bog‘liq. Agar bir kunlik ishni yo‘qotish maqbul bo‘lsa, kunlik nusxalar yetarli. Agar yo‘q bo‘lsa, tez-tez nusxalang, ma’lumotlar bazalari uchun esa jurnallarni uzluksiz arxivlashdan foydalaning.

### Zaxira nusxa ishlashini qanday tekshirish mumkin?

Undan ma’lumotlarni muntazam ravishda alohida joyga tiklab ko‘ring: alohida fayllarni tez-tez, butun tizimni yiliga kamida bir necha marta. Agar tiklash tekshirilmagan bo‘lsa, zaxira nusxa yo‘q deb hisoblang.
