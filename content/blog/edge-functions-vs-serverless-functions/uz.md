---
title: Edge va serverless funksiyalar: qachon nimani ishlatish kerak
description: Edge va serverless funksiyalarni bajarilish joyi, runtime cheklovlari, kechikish, ma’lumotlar bazasi bilan ishlash va narx modeli bo‘yicha solishtiramiz.
summary: Edge funksiyalar foydalanuvchiga yaqin joyda ishlaydi va uzoqdagi bazaga murojaat qilmaydigan yengil mantiq uchun mos; mintaqaviy serverless funksiyalar ma’lumotlar yonida ishlaydi va biznes mantiq, baza so‘rovlari hamda uzoq amallar uchun mos.
---
## Qisqa javob

**Edge funksiyalar** CDN tarmog‘ining foydalanuvchiga eng yaqin nuqtalarida ishga tushadi. Ular deyarli bir zumda start oladi, lekin qisqartirilgan muhitda va qattiq limitlar bilan ishlaydi. **Serverless funksiyalar** bulutning aniq bir mintaqasida ishga tushadi, to‘liq runtime’ga ega va odatda ma’lumotlar bazasi yonida joylashadi.

Oddiy qoida: **edge’ga ma’lumotlarga emas, so‘rovga bog‘liq narsalarni qo‘ying**. Bazaga ko‘p marta murojaat qiladigan hamma narsa — mintaqada, baza yonida bo‘lsin.

## Solishtirish

| Mezon | Edge funksiyalar | Serverless funksiyalar |
|---|---|---|
| Qayerda bajariladi | Dunyo bo‘ylab ko‘plab nuqtalarda, foydalanuvchi yonida | Bitta yoki bir nechta tanlangan mintaqada |
| Runtime | Ko‘pincha V8 izolyatlar, Web API, Node.js API’ning bir qismi yo‘q | To‘liq Node.js, Python, Go, Java va boshqalar |
| Sovuq start | Juda qisqa | Sezilarliroq, runtime va kod hajmiga bog‘liq |
| Limitlar | CPU vaqti, xotira va kod hajmi bo‘yicha qattiqroq | Kengroq: uzoqroq bajarilish, ko‘proq xotira |
| Native modullar, fayl tizimi | Odatda yo‘q | Bor |
| Bazaga kirish | HTTP drayverlar yoki proksi orqali, bazadan uzoqda | Oddiy drayverlar, baza yonida |
| Narx modeli | Odatda so‘rovlar va CPU vaqti uchun | Odatda so‘rovlar, bajarilish vaqti va xotira uchun |

Aniq limitlar va narxlar provayderlarda (Vercel, Cloudflare Workers, Netlify, AWS Lambda@Edge va CloudFront Functions) farq qiladi va o‘zgarib turadi, shuning uchun ularning hujjatlarini tekshiring.

## Kechikish: vaqt aslida qayerda yo‘qoladi

Edge faqat javobni **uzoqdagi ma’lumotlarga murojaat qilmasdan** shakllantirish mumkin bo‘lgandagina yutuq beradi. Agar Toshkentdagi edge funksiya Frankfurtdagi bazaga ketma-ket uchta so‘rov yuborsa, har biri uzoq masofani bosib o‘tadi va natija o‘sha uchta so‘rovni mahalliy bajaradigan Frankfurtdagi serverless funksiyadan sekinroq bo‘ladi.

Shuning uchun funksiyagacha bo‘lgan kechikishni emas, barcha ma’lumot so‘rovlarini hisobga olgan holda **to‘liq javob vaqtini** o‘lchang.

## Bazaga kirish patternlari

- **Bitta mintaqadagi klassik baza.** Unga so‘rov yuboradigan mantiqni o‘sha mintaqadagi serverless funksiyada saqlang. Ko‘p platformalar funksiyalar mintaqasini mahkamlash imkonini beradi.
- **Edge + taqsimlangan ombor.** Edge uchun mo‘ljallangan KV omborlar va replikatsiya qilinadigan bazalar butun dunyo bo‘ylab tez o‘qishni ta’minlaydi. Yozish odatda asosiy mintaqaga boradi va kechikish bilan tarqaladi.
- **Edge + kesh.** Edge funksiya javobni keshdan beradi, keshda bo‘lmasa serverless funksiya yoki API’ga murojaat qiladi.
- **Ulanishlar puli.** Edge funksiyalar va qisqa yashaydigan serverless funksiyalar klassik bazaning ulanishlar limitini tez tugatishi mumkin, shuning uchun ulanishlar pulerini yoki HTTP drayverni ishlating.

## Nimani qayerga chiqarish kerak

**Edge uchun yaxshi vazifalar:**

- redirektlar va URL’ni qayta yozish;
- geolokatsiya va tilni tanlash;
- A/B testlar va feature-flag’lar;
- JWT tekshiruvi va marshrutlarni asosiy himoyalash;
- xavfsizlik sarlavhalarini qo‘shish;
- kesh yoki KV’dan personallashtirish.

**Mintaqaviy serverless uchun yaxshi vazifalar:**

- bir nechta baza so‘rovli biznes mantiq;
- to‘lovlar, webhook’lar, uchinchi tomon API integratsiyalari;
- PDF yaratish, rasmlarni qayta ishlash;
- native kutubxonalar yoki uzoq bajarilishni talab qiladigan amallar.

Funksiyalar emas, **doimiy server uchun**: uzoq yashaydigan WebSocket ulanishlari, og‘ir fon vazifalari, doimiy navbatlar.

## Ko‘p uchraydigan xatolar

- Butun mantiqni “tezlik uchun” edge’ga ko‘chirib, bazani bitta mintaqada qoldirish.
- Edge’da mavjud bo‘lmagan Node.js API’larga bog‘liq kutubxonani ishlatish va buni faqat deployda bilish.
- Serverless funksiyalar mintaqasini baza yonida mahkamlamaslik.
- Narxlarni bajarilish vaqtini hisobga olmay, faqat so‘rovlar soni bo‘yicha solishtirish.

## FAQ

### Edge funksiyalar har doim serverless’dan tezroqmi?

Yo‘q. Ular tezroq start oladi va foydalanuvchiga yaqinroq, lekin mantiq uzoqdagi bazaga bog‘liq bo‘lsa, umumiy javob sekinroq bo‘lishi mumkin. Edge uzoq ma’lumotlarga murojaat qilmaydigan yengil amallarda yutadi.

### Bitta loyihada ikkalasini ham ishlatish mumkinmi?

Ha, bu eng ko‘p uchraydigan variant. Edge qatlami marshrutlash, avtorizatsiya tekshiruvi va keshni boshqaradi, baza mintaqasidagi serverless funksiyalar esa asosiy biznes mantiqni bajaradi.

### Ikkilansangiz nimani tanlash kerak?

Bazangiz joylashgan mintaqadagi serverless funksiyalardan boshlang. O‘lchovlar foydalanuvchiga yaqinlik foyda berishini ko‘rsatgandan keyin alohida amallarni edge’ga chiqaring.
