---
title: Cloudflare R2 yoki AWS S3: saqlash va trafik narxi
description: Cloudflare R2 va AWS S3 narx modellarini chiquvchi trafik to‘lovi, API mosligi, unumdorlik va har biriga mos vazifalar nuqtai nazaridan solishtiramiz.
summary: Asosiy farq — R2 chiquvchi trafik uchun haq olmaydi, S3 esa internetga berilgan har bir gigabayt uchun to‘lov oladi. Shuning uchun foydalanuvchilar tez-tez yuklab oladigan fayllar uchun R2, AWS ichida qayta ishlanadigan yoki arzon arxivga ketadigan ma’lumotlar uchun S3 foydaliroq.
---
## Qisqa javob

- **Cloudflare R2** — agar fayllar internetga ko‘p tarqatilsa: media, foydalanuvchilar yuklagan fayllar, distributivlar, ochiq datasetlar. Chiquvchi trafik bepul, siz saqlash va operatsiyalar uchun to‘laysiz.
- **AWS S3** — agar ma’lumotlar AWS xizmatlarida (EC2, Lambda, Athena) qayta ishlansa, arxiv saqlash sinflari yoki IAM va AWS hodisalari bilan chuqur integratsiya kerak bo‘lsa.

Ikkalasi ham S3 bilan mos API’ga ega obyekt omborlari, shuning uchun kod va vositalar asosan bir xil.

## Narx nimalardan iborat

| Xarajat moddasi | AWS S3 | Cloudflare R2 |
|---|---|---|
| Saqlash | Oyiga GB uchun, narx saqlash sinfiga bog‘liq | Oyiga GB uchun, Standard va Infrequent Access sinflari |
| Yozish va ro‘yxat olish | PUT/COPY/POST/LIST so‘rovlari sifatida to‘lanadi | A sinf operatsiyalari |
| O‘qish | GET va shunga o‘xshash so‘rovlar sifatida to‘lanadi | B sinf operatsiyalari |
| **Internetga chiquvchi trafik** | **Har bir GB uchun to‘lanadi** | **To‘lanmaydi** |
| Mintaqalar orasidagi trafik | To‘lanadi | Alohida trafik to‘lovi yo‘q |
| «Sovuq» sinflardan olish | To‘lanadi | Infrequent Access uchun to‘lanadi |
| Bepul daraja | Bor | Bor, oylik |

Aniq stavkalar mintaqaga bog‘liq va vaqti-vaqti bilan o‘zgaradi — ularni tarif sahifalarida tekshiring.

## Nega hamma narsani egress hal qiladi

Chiquvchi trafik (egress) uchun to‘lov boshida sezilmaydi va mashhurlik bilan tez o‘sadi. Oddiy hisob: 10 000 marta yuklab olingan 100 MB’lik fayl — taxminan 1 TB chiquvchi trafik.

- **S3**’da shu terabaytning har bir gigabayti va 10 000 ta GET-so‘rov uchun to‘laysiz.
- **R2**’da faqat 10 000 ta o‘qish operatsiyasi uchun to‘laysiz.

«Yuklab olingan / saqlanayotgan» nisbati qanchalik katta bo‘lsa, R2 shunchalik foydali. Agar ma’lumotlar yillab yotsa va deyarli o‘qilmasa, egress rol o‘ynamaydi — saqlash narxi va arxiv sinflari hal qiladi, bu yerda S3’da tanlov kengroq.

AWS’ning bir nozik jihati: S3’dan CloudFront’ga trafik uchun haq olinmaydi, shuning uchun S3 + CloudFront birikmasi xarajatni kamaytiradi. Lekin endi CloudFront trafigi uchun to‘laysiz.

## API mosligi

R2 S3 API’ni amalga oshiradi va ko‘pchilik SDK hamda vositalar (AWS SDK, AWS CLI, rclone) manzil va kalitlar almashtirilgach ishlaydi:

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

await r2.send(new PutObjectCommand({ Bucket: "media", Key: "a.jpg", Body: file }));
```

Farqlar baribir bor: R2’da huquqlar IAM siyosatlari emas, API-tokenlar orqali beriladi, S3’ning ayrim imkoniyatlari esa yo‘q yoki boshqacha ishlaydi. Ko‘chishdan oldin kodingiz ishlatadigan har bir operatsiyani Cloudflare hujjatlari bo‘yicha tekshiring.

## Unumdorlik

- **S3**’ni aniq mintaqada joylashtirasiz. Eng kichik kechikish — xuddi shu AWS mintaqasidagi xizmatlar uchun.
- **R2** joylashuvni avtomatik tanlaydi (joylashuv bo‘yicha maslahat berish mumkin). Ommaviy fayllarni o‘z domeningiz orqali tarqatish qulay — shunda Cloudflare keshi ishlaydi.

Foydalanuvchilar uchun ombordan ko‘ra uning oldidagi CDN va backend’gacha bo‘lgan masofa muhimroq.

## Qaysi vazifalar qaysi biridan yutadi

**R2:**
- saytda ko‘rsatiladigan rasmlar, videolar va foydalanuvchi yuklagan fayllar;
- ilovalar, yangilanishlar va datasetlarni tarqatish;
- turli provayderlardagi serverlar bir xil ma’lumotni o‘qiydigan multibulut arxitektura;
- allaqachon Cloudflare orqali ishlayotgan saytlar.

**S3:**
- AWS ichida qayta ishlanadigan ma’lumotlar: analitika, ETL, mashinaviy o‘qitish;
- deyarli o‘qilmaydigan uzoq muddatli arxivlar va zaxira nusxalar;
- S3 hodisalari, nozik IAM siyosatlari va muvofiqlik talablari kerak bo‘lgan loyihalar.

Ularni birga ishlatish mumkin: asl nusxalar va arxivni S3’da saqlab, ommaviy nusxalarni R2’dan tarqatish.

## Yashirin xarajatlar

- **Ko‘plab mayda obyektlar** — ikkala xizmatda ham operatsiyalar uchun hisob saqlash hisobidan oshib ketishi mumkin.
- **AWS’dagi NAT Gateway** — agar xususiy subnetdagi serverlar S3’ga NAT orqali murojaat qilsa, bu trafik to‘lanadi. S3 uchun VPC gateway endpoint’dan foydalaning.
- Ikkala xizmatda ham «sovuq» sinflarning **minimal saqlash muddati va olish to‘lovi**.

## FAQ

### R2 har doim S3’dan arzonmi?

Yo‘q. Agar ma’lumotlar internetga kam chiqsa va AWS ichida qayta ishlansa, narxdagi farq kichik, arxivlar uchun esa Glacier sinflari bilan S3 arzonroq bo‘lishi mumkin.

### S3 uchun yozilgan kodim o‘zgarishsiz ishlaydimi?

Odatda endpoint va kalitlarni almashtirish hamda mintaqani `auto` qilib ko‘rsatish kifoya. Lekin ishlatiladigan barcha operatsiyalarni sinab ko‘ring: S3’ning ayrim funksiyalari R2’da qo‘llab-quvvatlanmaydi.

### Ma’lumotlarni S3’dan R2’ga qanday ko‘chirish mumkin?

Cloudflare’da ko‘chirish vositalari bor: butun bucket’ni bir martada ko‘chirish va obyektlarni ularga murojaat qilinganda asta-sekin nusxalash. rclone ham mos keladi.
