---
title: WordPress xavfsizligi: saytni bosqichma-bosqich himoyalash
description: WordPress himoyasi chek-listi: yangilanishlar, plaginlarni tanlash, kirishni himoyalash, fayl huquqlari, XML-RPC va muharrirni o‘chirish, zaxira.
summary: WordPress ko‘pincha yadro orqali emas, eskirgan plaginlar va zaif parollar orqali buziladi. Hammasini yangilab turing, kam va tekshirilgan plaginlar qoldiring, kirishni 2FA va urinishlar limiti bilan himoyalang, fayl muharriri va keraksiz XML-RPC’ni o‘chiring, huquqlarni sozlang va tashqi zaxira nusxalar qiling.
---

## WordPress qayerdan buziladi

WordPress yadrosi muntazam yangilanadi va joriy versiyada ancha ishonchli. Buzib kirishlarning aksariyati uch narsa orqali sodir bo‘ladi:

- **eskirgan yoki tashlab qo‘yilgan plagin va mavzular**;
- administratorlarning **zaif va takroriy parollari**;
- **serverni beparvo sozlash**: fayllarga ortiqcha huquqlar, ochiq qolgan zaxira nusxalar, eski PHP versiyasi.

Shuning uchun himoya bitta «xavfsizlik plagini» emas, balki oddiy odatlar to‘plami. Quyida — bosqichma-bosqich.

## 1-bosqich. Yangilanishlar

- Yadro, plagin va mavzularni yangilang. Yadroning kichik relizlari uchun avtoyangilanishni qoldirish mumkin.
- Katta yangilanishlardan oldin zaxira nusxa oling va sayt daromad keltirsa, **staging-nusxada** tekshiring.
- Xostingdagi **PHP versiyasini** kuzating: xavfsizlik patchlarisiz eskirgan versiya — alohida xavf.
- Faol bo‘lmagan plagin va mavzularni o‘chirib tashlang. O‘chirilgan plagin baribir serverda turadi va uning fayllariga tashqaridan murojaat qilish mumkin.

## 2-bosqich. Plaginni o‘rnatishdan oldin tekshirish

O‘rnatishdan oldin qarang:

- **oxirgi yangilanish** qachon bo‘lgan va joriy WordPress versiyasi bilan moslik;
- faol o‘rnatishlar soni va muallifning qo‘llab-quvvatlashdagi javoblari;
- plagin xavfsizlik muammolari tufayli rasmiy katalogdan olib tashlanmaganmi.

Hech qachon **«nulled»** (buzilgan pullik) plagin va mavzularni o‘rnatmang — ularga ko‘pincha bekdor joylangan bo‘ladi. Qoida oddiy: plaginlar qancha kam bo‘lsa, hujum yuzasi shuncha kichik.

## 3-bosqich. Kirish va admin panelni himoyalash

- Har bir administrator uchun **noyob uzun parol** va parol menejeri.
- Muharrir va undan yuqori huquqli barcha rollar uchun **ikki bosqichli autentifikatsiya** (2FA).
- **Kirish urinishlarini cheklash** — plagin, WAF yoki server darajasida.
- `admin` loginidan foydalanmang. Odamlarga faqat kerakli rolni bering: maqola muallifiga administrator huquqi kerak emas.
- `/wp-admin` yoki `/wp-login.php` manzilini o‘zgartirish botlar shovqinini kamaytiradi, lekin bu o‘z-o‘zidan himoya emas — faqat 2FA va limitlarga qo‘shimcha.
- Jamoa doimiy manzillardan ishlasa, admin panelni veb-server darajasida IP bo‘yicha yopish mumkin.

## 4-bosqich. Fayl muharriri va keraksiz XML-RPC’ni o‘chiring

O‘rnatilgan mavzu va plagin muharriri PHP kodini to‘g‘ridan to‘g‘ri admin paneldan o‘zgartirishga imkon beradi. Hujumchi administrator huquqini qo‘lga kiritsa, bu uning birinchi quroli. Uni `wp-config.php` faylida o‘chiring:

```php
define( 'DISALLOW_FILE_EDIT', true );
```

**XML-RPC** (`xmlrpc.php`) — masofadan boshqarish uchun eski interfeys. U parollarni tanlash va hujumlarni kuchaytirish uchun ishlatiladi. Agar siz uchinchi tomon ilovalari orqali nashr qilmasangiz va unga tayanadigan servislardan foydalanmasangiz, uni veb-server darajasida yoping, masalan Nginx’da:

```nginx
location = /xmlrpc.php {
    deny all;
}
```

O‘chirishdan oldin integratsiyalaringiz va mobil ilovalaringiz XML-RPC’ga bog‘liq emasligini tekshiring.

## 5-bosqich. Fayl huquqlari va server konfiguratsiyasi

WordPress hujjatlaridagi umumiy mo‘ljal:

| Obyekt | Huquqlar |
|---|---|
| Papkalar | `755` |
| Fayllar | `644` |
| `wp-config.php` | qattiqroq, masalan `640` yoki `600` — PHP qaysi foydalanuvchi nomidan ishlashiga qarab |

Qo‘shimcha:

- `wp-content/uploads` papkasida PHP bajarilishini taqiqlang;
- zaxira nusxalar va baza damplarini saytning ochiq papkasida saqlamang;
- **HTTPS**ni yoqing va HTTP’dan yo‘naltirishni sozlang;
- jadvallarning standart prefiksini faqat yangi o‘rnatishda o‘zgartiring — ishlayotgan saytda bu xavfli va deyarli himoya bermaydi.

## 6-bosqich. Zaxira nusxalar va skanerlash

- Fayllar va ma’lumotlar bazasining **avtomatik zaxira nusxalari**, sayt **serveridan tashqarida** saqlanadi. Xuddi shu xostingdagi nusxa u bilan birga yo‘qoladi.
- Nusxani haqiqatan tiklash mumkinligini muntazam tekshiring.
- **Zararli kod skaneri** va fayl o‘zgarishlari monitoringini ulang — plagin yoki xosting orqali.
- Yangi administratorlar va notanish manzillardan kirishlar haqida bildirishnomalarni yoqing.

## Tez-tez uchraydigan xatolar

- Bir vaqtda beshta «xavfsizlik plagini» o‘rnatish — ular to‘qnashadi va saytni sekinlashtiradi.
- Pudratchilarga doimiy administrator huquqi berish va ishdan keyin uni qaytarib olmaslik.
- Kichik sayt hech kimga qiziq emas deb o‘ylash: botlar hammaga avtomatik hujum qiladi.

## FAQ

### Pullik xavfsizlik plagini kerakmi?

Shart emas. Asosiy choralar — yangilanishlar, 2FA, kirish urinishlari limiti, zaxira nusxalar — bepul vositalar va server sozlamalari bilan qoplanadi. Pullik yechimlar WAF, skanerlash va qo‘llab-quvvatlash bir joyda kerak bo‘lganda qulay.

### Plaginlarni qanchalik tez-tez yangilash kerak?

Xavfsizlik yangilanishlarini chiqqanidan keyin imkon qadar tez o‘rnating. Qolganlarini muntazam, masalan haftada bir marta, yangilashdan oldin zaxira nusxa olib.

### Admin panel manzilini o‘zgartirish yetarlimi?

Yo‘q. Bu avtomatik urinishlar sonini kamaytiradi, lekin maqsadli hujumdan himoya qilmaydi. Asos — kuchli parollar, 2FA va kirish urinishlarini cheklash.
