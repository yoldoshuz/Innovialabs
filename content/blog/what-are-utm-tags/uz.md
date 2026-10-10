---
title: UTM-teglar nima va ular har bir reklama havolasida nega kerak
description: Beshta UTM-parametr, ularni Google Analytics 4 va Yandex Metrica qanday o‘qiydi, nomlash qoidalari va havolalar belgilanmaganda hisobotlarda nima buziladi.
summary: UTM-teglar — havoladagi parametrlar bo‘lib, ular analitikaga tashrif qayerdan kelganini aytadi: manba, trafik turi, kampaniya, kalit so‘z va e’lon varianti; ularsiz pullik trafik ko‘pincha to‘g‘ridan-to‘g‘ri kirishlarga tushadi va qaysi reklama ishlagani noma’lum qoladi.
---
## Qisqa javob

**UTM-teglar** — havola oxiriga so‘roq belgisidan keyin qo‘shiladigan parametrlar. Odam havolani ochganda saytdagi analitika hisoblagichi ularni o‘qiydi va tashrif qayerdan kelganini yozib oladi.

```text
https://example.com/course?utm_source=instagram&utm_medium=paid_social&utm_campaign=autumn_intake&utm_content=video_a
```

Tashrifchi uchun sahifa o‘sha-o‘sha. Analitika uchun esa bu endi «internetning qayeridandir» emas, balki «Instagram, pullik ijtimoiy tarmoq, kuzgi qabul kampaniyasi, A video».

## Beshta parametr

| Parametr | Qaysi savolga javob beradi | Qiymat misollari | Majburiymi |
|---|---|---|---|
| **utm_source** | Aynan qayerdan? | google, instagram, telegram, newsletter | Ha |
| **utm_medium** | Trafik turi qanday? | cpc, paid_social, email, referral | Ha |
| **utm_campaign** | Qaysi kampaniya? | autumn_intake, black_friday | Ha |
| **utm_term** | Qaysi kalit so‘z yoki auditoriya? | crm_development, lookalike_buyers | Yo‘q |
| **utm_content** | Qaysi e’lon yoki havola varianti? | video_a, banner_blue, header_button | Yo‘q |

Manba, tur va kampaniya — asos. **utm_term** ko‘proq qidiruv reklamasida ishlatiladi, **utm_content** esa kreativlarni yoki bitta xat ichidagi bir nechta havolani solishtirishga yordam beradi.

## Analitika ularni qanday o‘qiydi

1. Odam belgilangan havolani bosadi va sahifaga tushadi.
2. Analitika hisoblagichi (Google Analytics 4, Yandex Metrica) parametrlarni URL’dan o‘qiydi.
3. Seans va uning ichidagi harakatlar, masalan, forma yuborish, shu manba, tur va kampaniyaga bog‘lanadi.

Qayerdan ko‘rish mumkin:

- **GA4:** Traffic acquisition hisobotida Session source / medium va Session campaign parametrlari bilan.
- **Yandex Metrica:** «Manbalar» bo‘limidagi UTM-teglar hisobotida.

Google Ads va Yandex Direct kliklarni avtomatik belgilay oladi (Google Ads’da bu gclid parametri). Avtomatik belgilash o‘z platformasining analitikasida yaxshi ishlaydi, ammo aniq UTM-teglar har qanday tizimda, jumladan, CRM’ingizda ham o‘qiladi.

## UTM-teglarsiz nima buziladi

- **Pullik trafik «to‘g‘ridan-to‘g‘ri»ga aylanadi.** Ilovalar va ichki brauzerlar, messenjerlar va pochta mijozlari ko‘pincha manba saytni uzatmaydi. Telegram’dagi post yoki Instagram’dagi storisdan kelgan klik odam manzilni qo‘lda yozgandek ko‘rinishi mumkin.
- **Kampaniyalar qo‘shilib ketadi.** Manba aniqlangan taqdirda ham Instagram’dagi barcha kampaniyalar bitta qatorga tushadi — kuzgi chegirmani imij reklamadan ajratib bo‘lmaydi.
- **Kreativlarni solishtirib bo‘lmaydi.** utm_content’siz qaysi video yoki banner ariza olib kelganini bilolmaysiz.
- **CRM manbani yo‘qotadi.** Agar forma UTM-qiymatlarni ariza bilan birga saqlamasa, sotuvlarni kanallar bilan bog‘lab bo‘lmaydi.

Natijada byudjet bo‘yicha qarorlar to‘liq bo‘lmagan ma’lumotlar asosida qabul qilinadi va aslida sotayotgan kanal qisqartirilishi mumkin.

## Hisobotlarni toza saqlaydigan nomlash qoidalari

- **Faqat kichik harflar.** Analitika `Instagram` va `instagram`ni turli qiymat deb hisoblaydi.
- **Bo‘sh joysiz.** `_` yoki `-` ishlating, lekin hamma joyda bir xil.
- **Lug‘at bo‘yicha kelishib oling.** Ruxsat etilgan manbalar, turlar va kampaniya nomlari umumiy jadvalini yuriting, shunda butun jamoa bir xil belgilaydi.
- **medium uchun standart qiymatlardan foydalaning:** `cpc`, `email`, `paid_social`. GA4 trafikni shular asosida standart kanal guruhlariga taqsimlaydi, o‘zingiz o‘ylab topgan qiymatlar esa «Unassigned»ga tushib qolishi mumkin.
- **Ichki havolalarni belgilamang** — o‘z saytingiz sahifalari orasidagi havolalarni: teg tashrifning asl manbasini qayta yozib yuboradi.
- **Teglarga hech qachon shaxsiy ma’lumot qo‘ymang** — email yoki telefon raqamini.
- **Ishga tushirishdan oldin yakuniy havolani tekshiring:** uni oching, sahifa yuklanayotganiga va tashrif real vaqt hisobotida ko‘rinayotganiga ishonch hosil qiling.

Reklama platformalari dinamik qiymatlarni qo‘llab-quvvatlaydi, shuning uchun har bir e’lonni qo‘lda belgilash shart emas. Masalan, Meta Ads `{{campaign.name}}` va `{{ad.name}}`ni, Yandex Direct esa `{campaign_id}` va `{keyword}`ni qo‘yib beradi.

## FAQ

### UTM-teglar SEO yoki sayt tezligiga ta’sir qiladimi?

Tezlikka sezilarli ta’sir qilmaydi. SEO uchun belgilangan manzillar odatda canonical tegi orqali toza sahifa bilan birlashtiriladi — ko‘pchilik zamonaviy konstruktorlar va freymvorklar buni sozlab beradi.

### O‘z Telegram-kanalim yoki Instagram profilimdagi havolalarni belgilash kerakmi?

Ha. Manba aynan shu joylarda ko‘proq yo‘qoladi. Belgilash o‘z kanallaringiz qancha trafik va ariza olib kelayotganini ko‘rsatadi.

### Foydalanuvchi UTM-teglarni ko‘rishi yoki o‘zgartirishi mumkinmi?

Ha, ular manzil satrida ko‘rinadi, ularni o‘chirish yoki tahrirlash mumkin. Katta hajmda bu ma’lumotlarga kam ta’sir qiladi, ammo teglarga maxfiy narsa qo‘ymaslik uchun yana bir sabab.
