---
title: LLM API narxi: AI xarajatlarini qanday hisoblash va kamaytirish
description: LLM API uchun oylik xarajatni tokenlar va trafik asosida qanday hisoblash hamda modelni tanlash, keshlash, qisqa promptlar va paketli ishlov bilan kamaytirish.
summary: LLM API xarajati = so‘rovlar soni × (kirish tokenlari × kirish narxi + chiqish tokenlari × chiqish narxi); uni modellar o‘rtasida marshrutlash, keshlash, promptlarni qisqartirish va paketli ishlov kamaytiradi.
---
## Aslida nima uchun to‘laysiz

Deyarli barcha LLM provayderlari **tokenlar uchun** haq oladi — model kirish va chiqish matnini bo‘ladigan bo‘laklar uchun. Uchta narsani yodda tuting:

- **Kirish va chiqish tokenlari turlicha narxlanadi**, chiqish odatda qimmatroq.
- **Kirishga hamma narsa kiradi**: tizim prompti, suhbat tarixi, RAG hujjatlari, vositalar tavsifi.
- **Bitta provayderning turli modellari** narxda bir necha barobar farq qiladi, shuning uchun model tanlash asosiy richag.

Bir so‘zga to‘g‘ri keladigan tokenlar soni til va tokenizatorga bog‘liq: rus va o‘zbek tilidagi matnlar odatda ingliz tilidagi xuddi shu ma’noga qaraganda ko‘proq token talab qiladi. O‘z ma’lumotlaringizda tekshiring — provayderlarda token hisoblagichlari bor.

## Oylik byudjetni qanday baholash

Asosiy formula:

```text
Oylik xarajat =
  oyiga so‘rovlar × (kirish tokenlari × kirish narxi
                     + chiqish tokenlari × chiqish narxi)
```

Qadamlar:

1. Ssenariyingizdan **20-50 ta real so‘rov oling** va o‘rtacha kirish hamda chiqish tokenlarini hisoblang. API javobi odatda bu raqamlarni qaytaradi.
2. **Trafikni baholang**: foydalanuvchilar × kuniga bir foydalanuvchi so‘rovlari × kunlar.
3. **Yashirin chaqiruvlarni hisobga oling**: agentlar va zanjirlar foydalanuvchining bitta harakati uchun modelga bir necha marta murojaat qiladi, xatolikdagi qayta urinishlar ham pul turadi.
4. O‘sish va eng yuqori yuklama uchun **zaxira qo‘shing** va 2-3 modelni bitta jadvalda solishtiring.

Narxlar o‘zgaradi, shuning uchun ularni hisoblash paytida provayderlarning rasmiy sahifalaridan oling.

## Xarajatlarni qanday kamaytirish

### Modellar o‘rtasida marshrutlash

Har bir so‘rovga eng kuchli model kerak emas. Tasniflash, maydonlarni ajratib olish, qisqa javoblarni ko‘pincha arzon model bajaradi, murakkab mulohazalarni esa qimmat model. Vazifa turi bo‘yicha oddiy router yoki «avval arzon, ishonch past bo‘lsa — kuchli» kaskadi hisobni sezilarli kamaytiradi.

### Keshlash

- **Javoblar keshi**: bir xil savollarni (FAQ, ma’lumotnoma) modelni chaqirmasdan o‘z keshingizdan berish mumkin.
- Provayderdagi **prompt caching**: agar prompt boshi (ko‘rsatmalar, hujjatlar) takrorlansa, ko‘plab API keshlangan qism uchun kamroq haq oladi. O‘zgarmas qismni boshida, o‘zgaruvchanini oxirida saqlang.

### Qisqa promptlar va javoblar

- Tizim promptidan takrorlar va eskirgan qoidalarni olib tashlang.
- RAG orqali butun hujjatlarni emas, faqat tegishli bo‘laklarni uzating.
- Uzun suhbatlar tarixini qisqartiring yoki siqing.
- Javob uzunligini cheklang va ortiqcha kirish so‘zlarisiz format so‘rang.

### Paketli ishlov

Darhol javob talab qilmaydigan vazifalar (belgilash, tarjimalar, tungi hisobotlar) uchun ko‘plab provayderlarda kechiktirilgan ishlov evaziga chegirmali **batch API** mavjud.

## Ko‘p uchraydigan xatolar

- Byudjetni real namuna emas, bitta «ideal» so‘rov bo‘yicha hisoblash.
- Har bir xabar bilan o‘sib boradigan suhbat tarixi tokenlarini unutish.
- «Har ehtimolga qarshi» darhol eng kuchli modelni tanlash.
- Xarajatlarga limit va ogohlantirishlar qo‘ymaslik — bitta tsiklga tushgan agent oylik byudjetni yeb qo‘yishi mumkin.

## FAQ

### Matnimda nechta token borligini qanday bilaman?

Provayderning rasmiy tokenizatori yoki token hisoblagichidan foydalaning yoki API javobidagi usage maydoniga qarang. Rus va o‘zbek tillari uchun «chamalab» qilingan baholar ko‘pincha past bo‘ladi.

### Qaysi biri arzonroq: API yoki serverdagi o‘z modelim?

Hajm va talablarga bog‘liq. Kichik va notekis trafikda API odatda foydaliroq. O‘z xostingingiz barqaror katta yuklama yoki ma’lumotlarga qat’iy talablar bo‘lganda mantiqli, lekin GPU va qo‘llab-quvvatlash xarajatlarini qo‘shadi.

### Tejash sifatga ta’sir qiladimi?

Ko‘r-ko‘rona qisqartirsangiz, ta’sir qilishi mumkin. Har bir o‘zgarishdan oldin test so‘rovlar to‘plamini o‘tkazib, javoblarni solishtiring — shunda tejash qayerda xavfsiz ekani ko‘rinadi.
