---
title: SMS, autentifikator ilovasi yoki kalit: qaysi 2FA’ni tanlash kerak
description: SMS-kodlar, TOTP ilovalari, push tasdiqlar va FIDO2 kalitlari amalda qanday farq qiladi va shaxsiy hamda ish akkauntlari uchun qaysi 2FA usulini tanlash kerak.
summary: SIM almashtirish va ushlab qolish sababli SMS eng zaif 2FA, autentifikator ilovasi ishonchli standart variant, FIDO2 kalitlari va passkeys esa fishingga chidamli yagona keng tarqalgan usul, shuning uchun ularni pochta, adminlar va moliya uchun ishlating.
---
## Qisqa javob

Har qanday 2FA faqat paroldan yaxshiroq, lekin usullar teng emas:

- **SMS** — eng zaifi: kodlarni boshqa raqamga yo‘naltirish yoki ushlab qolish mumkin.
- **Autentifikator ilovasi (TOTP)** — ko‘pchilik akkauntlar uchun yaxshi standart variant.
- **Push tasdiq** — qulay, lekin solishtirish uchun raqam ko‘rsatmasa, so‘rovlar spamiga zaif.
- **Apparat kalit (FIDO2)** va **passkeys** — eng ishonchlisi: fishing saytlarda ular umuman ishlamaydi.

## SMS-kodlar

**Qanday ishlaydi:** servis telefon raqamingizga bir martalik kod yuboradi.

**Xavflar:**

- **SIM swap (SIM-kartani qayta chiqarish)** — hujumchi operator xodimini raqamingizga yangi SIM-karta chiqarishga ko‘ndiradi yoki pora beradi. Shu daqiqadan boshlab barcha kodlar unga keladi.
- **Ushlab qolish** — mobil tarmoq protokollaridagi zaifliklar va kiruvchi SMS’larni o‘qiydigan zararli ilovalar.
- **Fishing** — soxta kirish sahifasi kodni so‘raydi va uni darhol haqiqiy saytda ishlatadi.
- Amaliy qiyinchiliklar: safarda aloqa yo‘q, raqam o‘zgarsa kirish yo‘qoladi.

SMS boshqa usul bo‘lmagan joyda maqbul. Agar servis ishonchliroq usulni qo‘llasa, unga o‘ting va iloji bo‘lsa **telefon raqamini tiklash usullaridan olib tashlang**, aks holda hujumchi shunchaki eng zaif yo‘ldan boradi.

## Autentifikator ilovalari (TOTP)

**Qanday ishlaydi:** sozlashda servis va ilova umumiy maxfiy kalitni (o‘sha QR-kodni) oladi. Keyin ilova har 30 soniyada maxfiy kalit va joriy vaqtdan yangi 6 xonali kod hisoblaydi. Standart **TOTP** deb ataladi va internetsiz ishlaydi.

**Afzalliklari:** aloqa operatoriga bog‘liq emas, SIM-kartani qayta chiqarish xavfi yo‘q, standartni qo‘llaydigan istalgan ilovada ishlaydi.

**Kamchiliklari:**

- Kodlarni hali ham **fishing orqali olish** mumkin: soxta sahifa ularni real vaqtda uzatadi.
- Maxfiy kalitni asrash kerak. **Shifrlangan zaxira nusxa** yoki eksportga ega ilovani tanlang, aks holda telefon bilan birga hammasini yo‘qotasiz.
- Sozlash paytida kimdir QR-kodni ko‘rsa, kodlaringizni nusxalashi mumkin.

## Push tasdiqlar

**Qanday ishlaydi:** servis ilovaga «Bu siz kiryapsizmi?» so‘rovini yuboradi, siz «Tasdiqlash»ni bosasiz.

**Asosiy xavf — push fatigue (MFA bombing):** parolingizga ega hujumchi o‘nlab so‘rovlar yuboradi, ko‘pincha tunda, toki siz xato bilan yoki shunchaki to‘xtashi uchun «Tasdiqlash»ni bosmaguningizcha. Ba’zan bunga go‘yoki texnik yordam xizmatidan qo‘ng‘iroq qo‘shiladi.

Himoya: **raqamni solishtirish** (kirish ekranidagi raqamni ilovaga kiritasiz), joylashuv va ilova nomini ko‘rsatish, so‘rovlar sonini cheklash. O‘zingiz boshlamagan kirishni hech qachon tasdiqlamang.

## Apparat kalitlar va passkeys (FIDO2)

**Qanday ishlaydi:** kalitda qurilmadan hech qachon chiqmaydigan yopiq kalit saqlanadi. Kirishda brauzer kalitga qaysi **domen** so‘rayotganini aytadi va kalit so‘rovni faqat o‘zi ro‘yxatdan o‘tgan domen uchun imzolaydi. O‘xshash fishing domeni hech narsa olmaydi.

**Afzalliklari:** **fishingga chidamlilik**, hech narsani kiritish yoki uzatish shart emas, serverda sizib chiqishi mumkin bo‘lgan maxfiy ma’lumot saqlanmaydi. Kalitlar USB, NFC yoki Bluetooth orqali ulanadi. **Passkeys** xuddi shu standart bo‘yicha ishlaydi, faqat kalit telefonda yoki parol menejerida saqlanadi.

**Kamchiliklari:** apparat kalitni sotib olish kerak, yagona kalit yo‘qolsa, tiklash usuli kerak bo‘ladi. Uni hozircha hamma servislar ham qo‘llamaydi.

## Taqqoslash

| Usul | Fishing | SIM swap | Mobil aloqasiz ishlaydi | Qulaylik |
|---|---|---|---|---|
| SMS | Zaif | Zaif | Yo‘q | Yuqori |
| TOTP ilovasi | Zaif | Himoyalangan | Ha | O‘rtacha |
| Push | So‘rovlar spamiga zaif | Himoyalangan | Yo‘q | Yuqori |
| FIDO2 kalit / passkey | **Himoyalangan** | Himoyalangan | Ha | Sozlangandan keyin yuqori |

## Nimani tanlash kerak

**Shaxsiy akkauntlar**

- Asosiy pochta, Google yoki Apple akkaunti, parol menejeri: qo‘llab-quvvatlansa **passkey yoki apparat kalit**, aks holda TOTP ilovasi.
- Bank: bank taklif qilgan usul va barcha operatsiyalar haqida bildirishnomalar.
- Qolgan hammasi: shifrlangan zaxira nusxali TOTP ilovasi.
- **Ikkita kalitni** ro‘yxatdan o‘tkazing — biri har kungi foydalanish uchun, ikkinchisi xavfsiz joyda saqlanadi.

**Ish akkauntlari**

- Administratorlar, moliya, domen registratori, xosting, kod repozitoriylari: **faqat FIDO2 kalitlar yoki passkeys**.
- Qolgan xodimlar: kamida TOTP yoki raqam solishtiriladigan push; platforma imkon bersa, SMS’ni o‘chiring.
- 2FA’ni iltimos bilan emas, kirishni boshqarish tizimida majburiy siyosat orqali yoqing.
- Tiklash tartibini yozib qo‘ying: kalitini yo‘qotgan xodimning shaxsini kim va qanday tasdiqlaydi.

## FAQ

### SMS-2FA umuman 2FA bo‘lmaganidan yomonroqmi?

Yo‘q. Hatto SMS ham faqat sizib chiqqan parollarga tayanadigan hujumlarni to‘xtatadi. Bu shunchaki yaxshiroq usul paydo bo‘lganda birinchi bo‘lib almashtirish kerak bo‘lgan usul.

### Barcha akkauntlar uchun bitta kalitdan foydalansa bo‘ladimi?

Ha, bitta kalit ko‘plab servislarda ro‘yxatdan o‘tkaziladi. Lekin bittasini yo‘qotish kirishdan mahrum qilmasligi uchun doim ikkinchi, zaxira kalitni qo‘shing.

### Passkeys va apparat kalitlar bir narsami?

Ular bitta FIDO2 standartidan foydalanadi va fishingga bir xil chidamli. Farq yopiq kalit qayerda turishida: alohida jismoniy qurilmada yoki parol menejeri yoki operatsion tizim orqali qurilmalaringiz o‘rtasida sinxronlanadi.
