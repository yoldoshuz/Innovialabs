---
title: Obyektli xotira nima va u diskdan nimasi bilan farq qiladi
description: Obyektli xotira qanday tuzilgan: baketlar, obyektlar, metama’lumotlar, S3 bilan mos API, saqlash klasslari va fayllarni qachon diskda emas, unda saqlash kerak.
summary: Obyektli xotira fayllarni baketlar ichida kalit va metama’lumotlarga ega alohida obyektlar sifatida saqlaydi va ularni odatda S3 bilan mos HTTP API orqali beradi; hajmi deyarli cheklanmagan va serverga bog‘liq emas, shuning uchun foydalanuvchi yuklamalari, media va zaxira nusxalarni u yerda saqlagan ma’qul.
---
## Qisqa javob

**Obyektli xotira** — fayllar diskdagi papkalarda emas, **baketlar** (konteynerlar) ichidagi **obyektlar** sifatida saqlanadigan xizmat. Har bir obyektning noyob kaliti, mazmuni va **metama’lumotlari** bor. U bilan fayl tizimi orqali emas, **HTTP API** orqali ishlanadi: yuklash, olish, o‘chirish, ro‘yxatni olish.

Eng mashhur misol — Amazon S3. Uning API’si amalda standartga aylangan va ko‘plab provayderlar **S3 bilan mos** xotiralarni taklif qiladi: Google Cloud Storage (moslik rejimida), Cloudflare R2, DigitalOcean Spaces, Backblaze B2, o‘z serveringiz uchun MinIO va boshqalar.

## Baketlar, obyektlar va metama’lumotlar

- **Baket** — o‘z kirish huquqlari, mintaqasi va saqlash siyosatlariga ega yuqori darajali konteyner.
- **Obyekt** — fayl va uning tavsifi. Kalit yo‘lga o‘xshashi mumkin: `uploads/2026/avatar-123.jpg`. Lekin bu shunchaki satr: haqiqiy papkalar yo‘q, interfeysdagi «papkalar» — prefikslarning ko‘rinishi xolos.
- **Metama’lumotlar** — kontent turi (`Content-Type`), keshlash sarlavhalari, ixtiyoriy kalit–qiymat juftliklari.

Obyekt odatda **qisman tahrirlanmaydi**: faylni o‘zgartirish uchun uni butunlay qayta yuklashadi.

## Fayl tizimidan farqi

| | Server diski (fayl tizimi) | Obyektli xotira |
|---|---|---|
| **Tuzilma** | Papkalar ierarxiyasi | Baket ichidagi tekis kalitlar maydoni |
| **Kirish** | OT orqali, faqat shu serverdan | HTTP API orqali istalgan joydan |
| **O‘zgartirish** | Fayl qismlarini qo‘shish va tahrirlash mumkin | Obyekt butunlay almashtiriladi |
| **Hajm** | Disk hajmi bilan cheklangan | Amalda cheklanmagan, avtomatik o‘sadi |
| **Ishonchlilik** | Bitta server va zaxira nusxalarga bog‘liq | Ma’lumotlarni provayder replikatsiya qiladi |
| **Nima uchun mos** | OT, ma’lumotlar bazalari, vaqtinchalik fayllar | Media, yuklamalar, zaxira nusxalar, statika, arxivlar |

Fayl qismlariga tez ixtiyoriy kirish kerak bo‘lgan ma’lumotlar bazalari va dasturlar avvalgidek oddiy disklarda ishlaydi.

## S3 bilan mos API

Moslik bir xil SDK va vositalar turli provayderlar bilan ishlashini anglatadi — faqat manzil (endpoint) va kirish kalitlari o‘zgaradi. Masalan, AWS CLI orqali:

```bash
# faylni yuklash
aws s3 cp ./report.pdf s3://my-bucket/reports/report.pdf

# prefiks bo‘yicha obyektlar ro‘yxati
aws s3 ls s3://my-bucket/reports/

# xuddi shu CLI boshqa S3 bilan mos provayder bilan
aws s3 ls s3://my-bucket/ --endpoint-url https://storage.example-provider.com
```

Shaxsiy fayllar uchun **pre-signed URL** ishlatiladi — foydalanuvchi kirish kalitlarisiz aniq bitta obyektni yuklab olishi yoki yuklashi mumkin bo‘lgan vaqtinchalik havola.

## Saqlash klasslari

Provayderlar turli ssenariylar uchun bir nechta **saqlash klassini** taklif qiladi:

- **Standart (hot)** — tez-tez murojaat qilinadigan fayllar uchun.
- **Kam murojaatli (infrequent access)** — saqlash arzonroq, lekin o‘qish qimmatroq, minimal saqlash muddati bo‘lishi mumkin.
- **Arxiv (cold, archive)** — eng arzon saqlash, ammo faylni olish daqiqalardan soatlargacha vaqt olishi va qo‘shimcha pul turishi mumkin.

**Hayot sikli qoidalari (lifecycle)** eski obyektlarni avtomatik ravishda arzonroq klasslarga o‘tkazadi yoki o‘chiradi. Klasslar to‘plami va shartlar provayderlarda turlicha — ularning hujjatlariga qarang.

## Fayllarni qachon obyektli xotirada saqlash kerak

- **Foydalanuvchi yuklamalari**: avatarlar, hujjatlar, mahsulot rasmlari.
- **Sayt mediasi**: rasmlar va video, ayniqsa CDN bilan birga.
- Ma’lumotlar bazalari va serverlarning **zaxira nusxalari**.
- Uzoq saqlanishi kerak bo‘lgan **loglar va arxivlar**.
- **Bir nechta server yoki konteyner** bir xil fayllarni ko‘rishi kerak bo‘lganda.
- Doimiy diski bo‘lmagan **serverless ilovalar**.

Asosiy amaliy afzallik: server «bir martalik» bo‘lib qoladi. Uni fayllarni yo‘qotmasdan qayta yaratish yoki masshtablash mumkin.

## Ko‘p uchraydigan xatolar

- **Adashib ommaviy qilingan baket.** Baketlarni sukut bo‘yicha yopiq qiling va kirishni nuqtali oching.
- **Frontend kodidagi kirish kalitlari.** Brauzerdan yuklash uchun pre-signed URL’dan foydalaning.
- **Hisobga olinmagan chiquvchi trafik.** Ko‘p provayderlarda ma’lumotlarni yuklab olish uchun to‘lov saqlashdan ko‘ra sezilarliroq. Xotira oldidagi CDN yordam beradi.
- **Tez-tez o‘qiladigan fayllar uchun arxiv klassi.** Saqlashdagi tejamni ma’lumotni olish to‘lovi yeb qo‘yadi.
- **Muhim ma’lumotlar uchun versiyalash yo‘q.** Tasodifan qayta yozilgan faylni tiklash uchun obyekt versiyalarini yoqing.

## FAQ

### Obyektli xotirani oddiy disk sifatida ulash mumkinmi?

Baketni papka sifatida ulaydigan utilitalar bor, lekin bu emulyatsiya: amallar sekinroq, fayllarni qisman yozish esa yomon ishlaydi. Ilovalar uchun xotiraga to‘g‘ridan-to‘g‘ri API yoki SDK orqali murojaat qilgan ma’qul.

### Obyektli xotira Google Drive yoki Dropbox’dan nimasi bilan farq qiladi?

Drive va Dropbox — odamlar uchun mahsulotlar: sinxronlash, birgalikda foydalanish, qulay interfeys. Obyektli xotira — dasturlar uchun infratuzilma: API, moslashuvchan huquqlar, saqlash klasslari, CDN va bulut xizmatlari bilan integratsiya.

### U yerda ma’lumotlarni saqlash qanchalik ishonchli?

Yirik provayderlar ma’lumotlarning bir nechta nusxasini turli qurilma va maydonchalarda saqlaydi, shuning uchun uskuna nosozligi sababli yo‘qotish ehtimoli past. Lekin bu tasodifiy o‘chirishdan himoya qilmaydi — versiyalash va alohida zaxira nusxalar kerak.
