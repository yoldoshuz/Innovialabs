---
title: Mobil ilovada xaritalar: Google Maps SDK yoki Yandex MapKit
description: Google Maps SDK va Yandex MapKit: O‘zbekiston va MDHda qamrov, tariflar va limitlar, geokoding va marshrutlar, fon geolokatsiyasi va batareya sarfi.
summary: O‘zbekiston va MDHda ishlaydigan ilovalar uchun Yandex MapKit ko‘pincha batafsilroq manzillar va obyektlarni beradi, Google Maps SDK esa xalqaro mahsulot va Google ekotizimi uchun qulayroq. Tanlovni foydalanuvchilaringizning haqiqiy manzillarida sinab ko‘rib, geokoding va marshrutlar narxini hisobga olgan holda qiling.
---

## Qisqa javob

Agar foydalanuvchilar asosan O‘zbekiston, Qozog‘iston yoki boshqa MDH davlatlarida bo‘lsa va mahsulot manzillarga bog‘liq bo‘lsa (yetkazib berish, taksi, uyga xizmatlar), **Yandex MapKit**’ni sinashdan boshlang: mintaqada Yandex’ning manzillar rejasi va tashkilotlar bazasi odatda batafsilroq. Mahsulot xalqaro bo‘lsa yoki siz allaqachon Firebase va Google xizmatlaridan foydalansangiz, **Google Maps SDK** qulayroq.

Lekin obro‘ emas, ma’lumotlar hal qiladi: mijozlaringizning 30-50 ta haqiqiy manzilini oling va har bir xizmat ularni qanday topishini tekshiring.

## O‘zbekiston va MDHda qamrov

O‘z shahringizda nimalarni tekshirish kerak:

- **Uygacha aniq manzil**: ko‘cha va raqam bo‘yicha uy topiladimi yoki faqat ko‘cha.
- **Mo‘ljallar**: Toshkent va viloyatlarda odamlar manzilni ko‘pincha mahalla yoki mo‘ljal orqali aytadi. Qidiruv bunday so‘rovlarni qanday uddalashini ko‘ring.
- **Tashkilotlar (POI)**: do‘konlar, kafelar, ofislar ma’lumotlari qanchalik dolzarb.
- **Tillar**: nomlar o‘zbek lotin, o‘zbek kirill va rus tillarida qanday ko‘rsatiladi va qidiriladi.
- **Yangi binolar va shahar chekkalari**: ma’lumotlar qanchalik tez yangilanadi.

MDHdan tashqarida Google qamrovi odatda kengroq va bir tekisroq, shuning uchun dunyoning turli hududlarida auditoriyasi bor ilovalar ko‘pincha Google’ni tanlaydi yoki provayderlarni birlashtiradi.

## Tariflar va limitlar

Aniq narxlar o‘zgarib turadi, shuning uchun tuzilma bo‘yicha solishtiring va dolzarb tarif sahifalarini tekshiring.

| | Google Maps Platform | Yandex MapKit |
|---|---|---|
| Mobil SDK’da xaritani ko‘rsatish | Nativ SDK’larda xarita yuklanishi uchun alohida to‘lov yo‘q | Cheklovlar va shartlar bilan bepul, keyin tijorat litsenziyasi |
| Geokoding, qidiruv, marshrutlar | So‘rov uchun to‘lovli, oylik bepul limitli alohida API’lar | SDK’ning to‘liq versiyasiga kiradi, shartlar litsenziyaga bog‘liq |
| Kalit va cheklovlar | Paket va bundle ID bo‘yicha cheklangan API kalit | API kalit, limitlar foydalanish shartlariga ko‘ra |

Narxning asosiy omili — xaritani necha marta ko‘rsatishingiz emas, **geokoding va marshrutlarni necha marta chaqirishingiz**. Geokoding natijalarini keshlang, xaritaning har bir siljishida manzil so‘ramang va matn kiritilayotganda so‘rovlarni kechiktirib (debounce) yuboring.

## Geokoding va marshrutlar

- **Google**: Geocoding API, manzillarni avtoto‘ldirish uchun Places API va marshrutlar hamda yo‘l vaqti uchun Routes API. Bular veb-xizmatlar, kalit qurilmada qolmasligi uchun ular ko‘pincha backend’dan chaqiriladi.
- **Yandex MapKit**: SDK’ning yengil versiyasi (faqat xarita) va to‘liq versiyasi bor — unda qidiruv, geokoding, avtomobil, piyoda va jamoat transporti uchun marshrutlar hamda oflayn xaritalar mavjud. To‘liq versiya ilova hajmini sezilarli oshiradi.

**Flutter** uchun Google’ning rasmiy `google_maps_flutter` plagini bor, MapKit uchun esa hamjamiyat plaginlari yoki nativ SDK ustidan o‘z o‘ramingizdan foydalanasiz — bunga vaqt ajrating.

## Fon geolokatsiyasi: do‘kon qoidalari

Fonda kuzatish — eng qattiq tekshiriladigan qism.

**Android:**
- `ACCESS_BACKGROUND_LOCATION` ruxsati aniq yoki taxminiy geolokatsiyaga ruxsat berilgandan keyin alohida so‘raladi;
- Google Play Console’da ilovaga fon geolokatsiyasi nima uchun kerakligini e’lon qilish va buni videoda ko‘rsatish kerak;
- uzoq muddatli kuzatish uchun ko‘rinadigan bildirishnomali `location` turidagi foreground service kerak.

**iOS:**
- `Info.plist`’da tushunarli `NSLocationWhenInUseUsageDescription` va `NSLocationAlwaysAndWhenInUseUsageDescription` matnlari bo‘lishi kerak;
- `UIBackgroundModes`’ga `location` rejimini faqat funksiya usiz ishlamasa qo‘shing;
- avval «Foydalanish vaqtida» ruxsatini so‘rang, «Doim»ni esa foydalanuvchi bunga muhtoj funksiyani yoqqanda so‘rang.

Agar fon geolokatsiyasi asosiy funksiya bo‘lmasa, do‘kon ilovani rad etishi mumkin. Ko‘pincha faqat foydalanish vaqtidagi geolokatsiya yetarli.

## Batareya sarfi

- **Vazifaga mos aniqlikni** tanlang: shahar uchun taxminiy geolokatsiya yetarli, GPS navigatsiya va kuryerni kuzatish uchun kerak.
- Yangilanishlar orasidagi **interval va minimal masofani** oshiring.
- Doimiy GPS o‘rniga Android’da **Fused Location Provider**, iOS’da significant location changes yoki geozonalardan foydalaning.
- Xarita ekrani yopilganda yangilanishlarni to‘xtating.
- Koordinatalarni serverga har bir nuqta uchun alohida so‘rov bilan emas, to‘plab yuboring.

## FAQ

### Bitta ilovada ikkala xaritadan foydalansa bo‘ladimi?

Ha. Masalan, bir provayderning xaritasini ko‘rsatib, geokodingni boshqasidan olish yoki provayderni mamlakatga qarab tanlash mumkin. Foydalanish shartlarini tekshiring: ba’zi xizmatlar natijalarni faqat o‘z xaritasida ko‘rsatishni talab qiladi.

### Marshrutlarsiz oddiy xarita kerak bo‘lgan iOS ilova uchun nimani tanlash kerak?

Ichki Apple MapKit’ni ko‘rib chiqing: u Apple shartlari doirasida bepul va uchinchi tomon SDK’sini qo‘shmaydi. Tanlashdan oldin mintaqangizdagi ma’lumotlar sifatini tekshiring.

### Xarita API kalitini yashirish kerakmi?

Mobil SDK kaliti baribir ilova ichiga tushadi, shuning uchun uni paket va bundle ID bo‘yicha cheklang. Geokoding va marshrut veb-xizmatlari kalitlarini serverda saqlagan ma’qul.
