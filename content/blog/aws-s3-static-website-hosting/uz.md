---
title: Statik saytni AWS S3 va CloudFront’da qanday joylashtirish
description: Yopiq S3 bucket, kirish siyosati, HTTPS va o‘z domeningiz bilan CloudFront distributsiyasini sozlaymiz hamda hosting narxi nimalardan iboratligini ko‘ramiz.
summary: Sayt fayllari yopiq S3 bucket’da turadi, CloudFront ularni Origin Access Control orqali HTTPS bilan tarqatadi, sertifikatni us-east-1 mintaqasida ACM bepul chiqaradi, domen DNS’i esa CloudFront’ga ko‘rsatadi. Siz faqat haqiqiy saqlash, so‘rovlar va trafik uchun to‘laysiz.
---
## Qisqa javob: sxema qanday tuzilgan

- **S3** sayt fayllarini saqlaydi. Bucket internet uchun **yopiq** qoladi.
- **CloudFront** — AWS’ning CDN’i. U fayllarni bucket’dan **Origin Access Control (OAC)** orqali oladi va tashrif buyuruvchilarga HTTPS bilan beradi.
- **ACM** (AWS Certificate Manager) domeningiz uchun SSL-sertifikatni bepul chiqaradi.
- **DNS** (Route 53 yoki joriy provayderingiz) domenni CloudFront’ga yo‘naltiradi.

Bu sxema har qanday statik sayt uchun mos: lending, hujjatlar, Astro, Hugo yoki statik eksportli Next.js build’i.

## 1-qadam. Bucket yarating va fayllarni yuklang

1. S3 konsolida qulay mintaqada `example-com-site` kabi bucket yarating.
2. **Block all public access** yoqilgan holda qolsin. «Static website hosting» rejimi kerak emas: CloudFront bucket’ga to‘g‘ridan-to‘g‘ri API orqali murojaat qiladi.
3. Tayyor saytni AWS CLI orqali yuklang:

```bash
aws s3 sync ./out s3://example-com-site --delete
```

## 2-qadam. ACM’da sertifikat oling

CloudFront uchun sertifikat bucket qayerda bo‘lishidan qat’i nazar **us-east-1 (N. Virginia)** mintaqasida chiqarilishi shart. `example.com` va `www.example.com` uchun ommaviy sertifikat so‘rang, DNS orqali tasdiqlashni tanlang va taklif qilingan CNAME-yozuvlarni qo‘shing. Tasdiqlangach, holat «Issued»’ga o‘zgaradi.

## 3-qadam. CloudFront distributsiyasini yarating

- **Origin** — bucket’ingiz (aynan bucket’ning REST-endpointi, website-endpointi emas).
- **Origin access** — Origin access control settings, yangi OAC yarating.
- **Viewer protocol policy** — Redirect HTTP to HTTPS.
- **Alternate domain names** — `example.com` va `www.example.com`.
- **Custom SSL certificate** — 2-qadamdagi sertifikat.
- **Default root object** — `index.html`.

Yaratilgandan so‘ng CloudFront bucket uchun tayyor siyosatni ko‘rsatadi.

## 4-qadam. Bucket’ga kirish siyosati

Siyosat fayllarni faqat sizning distributsiyangiz o‘qishiga ruxsat beradi. Uni o‘z qiymatlaringiz bilan **Permissions → Bucket policy** bo‘limiga joylang:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-com-site/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/EDFDVBD6EXAMPLE"
        }
      }
    }
  ]
}
```

## 5-qadam. Domenni ulang

- **Route 53**: distributsiyaga **Alias** turidagi A-yozuv yarating — shunda asosiy domen ham ishlaydi.
- **Boshqa DNS-provayder**: `www` uchun `d1234abcd.cloudfront.net` kabi manzilga CNAME. Asosiy domenni CNAME orqali ulab bo‘lmaydi: ALIAS/ANAME yoki CNAME flattening qo‘llab-quvvatlanishi (masalan, Cloudflare’da) yoki asosiy domendan `www`’ga yo‘naltirish kerak.

## Ichki papkalar va bir sahifali ilovalar

S3’ning REST-endpointi `/about/`’ni o‘zi `/about/index.html`’ga aylantirmaydi. Yechim — viewer request hodisasidagi kichik **CloudFront Function**:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var last = uri.split("/").pop();
  if (uri.charAt(uri.length - 1) === "/") {
    request.uri = uri + "index.html";
  } else if (last.indexOf(".") === -1) {
    request.uri = uri + "/index.html";
  }
  return request;
}
```

SPA (SSR’siz React, Vue) uchun **Custom error responses**’ni sozlang: 403 va 404 xatolari 200 kodi bilan `/index.html`’ni qaytarsin. `s3:ListBucket` huquqi bo‘lmasa, mavjud bo‘lmagan fayl aynan 403 qaytaradi.

## Saytni yangilash

```bash
aws s3 sync ./out s3://example-com-site --delete
aws cloudfront create-invalidation --distribution-id EDFDVBD6EXAMPLE --paths "/*"
```

Yaxshisi, build fayllariga xeshli nomlar va uzoq keshlash muddatini bering, invalidatsiyani esa faqat HTML uchun qiling.

## Bu qancha turadi

Aniq tariflar mintaqaga bog‘liq va o‘zgarib turadi, shuning uchun hisob nimalardan iboratligini tushunish muhimroq:

- **S3’da saqlash** — oddiy sayt hajmi kichik, bu modda deyarli sezilmaydi;
- **CloudFront trafigi va HTTPS-so‘rovlari** — hisobning asosiy qismi, tashriflar bilan o‘sadi;
- kesh topilmaganda **CloudFront’ning S3’ga so‘rovlari** (S3’dan CloudFront’ga trafikning o‘zi uchun haq olinmaydi);
- bepul hajmdan ortiq **invalidatsiyalar**;
- **Route 53** — agar DNS AWS’da bo‘lsa, zona uchun oylik to‘lov va so‘rovlar.

CloudFront bilan ishlatiladigan ACM sertifikatlari bepul, CloudFront’da esa bepul daraja bor. Kichik sayt uchun hisob odatda katta bo‘lmaydi, lekin albatta bildirishnomali **AWS Budgets**’ni sozlang.

## Ko‘p uchraydigan xatolar

- Sertifikat us-east-1’da chiqarilmagan — CloudFront uni ko‘rmaydi.
- Bucket’ning website-endpointi OAC bilan birga origin qilib ko‘rsatilgan — bunday ishlamaydi.
- `AccessDenied` xatosi: siyosatda noto‘g‘ri `SourceArn` yoki Default root object berilmagan.
- Bucket «har ehtimolga qarshi» ommaviy qilingan — fayllar CloudFront’ni chetlab ochiladi.
- Deploydan keyin invalidatsiya unutilgan va tashrif buyuruvchilar eski versiyani ko‘radi.

## FAQ

### CloudFront’siz ishlasa bo‘ladimi?

S3’dagi Static website hosting rejimi usiz ham ishlaydi, lekin faqat HTTP orqali va ommaviy bucket talab qiladi. O‘z domeni va HTTPS’li sayt uchun CloudFront kerak.

### Next.js saytini shu tarzda joylashtirsa bo‘ladimi?

Faqat u statik eksportga (`output: "export"`) build qilinsa. Serverda render qilish, API-marshrutlar va middleware hisoblash muhitini talab qiladi: Lambda, konteyner yoki Amplify kabi platforma.

### Bu Vercel yoki Netlify’dan arzonmi?

Trafik va tarifga bog‘liq. AWS ko‘proq nazorat va qat’iy iste’mol bo‘yicha to‘lovni beradi, lekin ko‘proq sozlashni talab qiladi. Kichik sayt uchun ikkala variant ham arzon tushadi.
