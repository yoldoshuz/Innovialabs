---
title: Sun’iy intellekt gallyutsinatsiyalari: LLM nega fakt to‘qiydi
description: Til modellari nega ishonch bilan noto‘g‘ri fakt aytadi va qaysi usullar buni kamaytiradi: manbaga tayanish, iqtiboslar, rad etish va tekshiruv.
summary: LLM faktlarni tekshirmaydi, balki ehtimoliy matnni bashorat qiladi, shuning uchun ba’zan to‘qib chiqaradi. Buni o‘z ma’lumotlaringizga tayanish (RAG), iqtibos talab qilish, «bilmayman» deyishga ruxsat va avtomatik tekshiruv kamaytiradi.
---

## Model nega to‘qib chiqaradi

**Gallyutsinatsiya** — ishonchli va savodli eshitiladigan, lekin faktlarga mos kelmaydigan javob: mavjud bo‘lmagan qonun moddasi, kutubxonada yo‘q funksiya, noto‘g‘ri sana.

Sababi modelning tuzilishida. LLM matnni eng ehtimoliy tarzda davom ettirishga o‘rgatilgan. Unda javob berishdan oldin murojaat qiladigan ichki faktlar bazasi yo‘q. Model «bilmasa» ham, to‘g‘ri javobga o‘xshash matn yaratadi.

Asosiy sabablar:

- **O‘qitish ma’lumotlaridagi bo‘shliqlar.** Kam uchraydigan, mahalliy yoki yangi mavzular haqida model kam biladi, lekin baribir javob beradi.
- **Eskirgan bilim.** O‘qitish ma’lumotlari ma’lum sanada tugaydi, dunyo esa o‘zgarib boradi.
- **Savol bosimi.** «... haqidagi qaror raqami qanday?» degan savol raqam borligini nazarda tutadi va model uni bajonidil «eslaydi».
- **Uzun yoki shovqinli kontekst.** So‘rovda hujjatlar ko‘p bo‘lsa, model turli manbalardagi tafsilotlarni aralashtirib yuborishi mumkin.
- **Mazmun o‘rniga uslub.** Model shaklni (havolalar, raqamlar, atamalar) yaxshi takrorlaydi, hatto ortida mazmun bo‘lmasa ham.

## Gallyutsinatsiyalar qayerda eng xavfli

- Huquqiy, tibbiy va moliyaviy javoblar.
- Aniq raqamlar, sanalar, ismlar, havolalar va iqtiboslar.
- Kutubxonada mavjud bo‘lmagan API’larni chaqiradigan kod.
- Kompaniya nomidan mijozlarga javoblar: narxlar, shartlar, muddatlar.

Xato qanchalik qimmat bo‘lsa, shuncha ko‘p himoya qatlami kerak.

## Amalda gallyutsinatsiyalarni qanday kamaytirish mumkin

### 1. Manbalarga tayanish (grounding)

Eng samarali usul — kerakli ma’lumotlarni modelga to‘g‘ridan-to‘g‘ri so‘rovda berish. Bu **RAG** (Retrieval-Augmented Generation): tizim hujjatlaringizdan tegishli parchalarni topadi va ularni savol bilan birga modelga uzatadi. Model «xotiradan» emas, matn asosida javob beradi.

### 2. Iqtibos talab qilish

Modeldan har bir fakt qaysi parchadan olinganini ko‘rsatishni so‘rang. Bu javobni tartibga soladi va tez tekshirish imkonini beradi. Iqtibos topilmasa, da’vo shubhali.

### 3. Rad etishga ruxsat

Yo‘riqnomada aniq yozing: «Javob berilgan materiallarda bo‘lmasa, bilmasligingni ayt». Bunday ruxsatsiz model har qanday holatda javob berishga moyil bo‘ladi.

```text
Faqat quyidagi hujjatlar asosida javob ber.
Javob ularda bo‘lmasa, yoz: "Hujjatlarda bu ma’lumot yo‘q".
Har bir fakt uchun hujjat raqamini kvadrat qavsda ko‘rsat.
```

### 4. Tekshiruv bosqichlari

- **O‘z-o‘zini tekshirish:** ikkinchi so‘rov modeldan javobni manbalar bilan solishtirib, tasdiqlanmagan joylarni belgilashni so‘raydi.
- **Tuzilgan natija:** qat’iy sxemali JSON’ni erkin matnga qaraganda kod bilan tekshirish osonroq.
- **Kod bilan tekshirish:** havolalar ochiladi, raqamlar baza bilan solishtiriladi, yaratilgan kod kompilyatsiya qilinib, testdan o‘tkaziladi.
- **Jarayonda inson:** muhim javoblar uchun xodim tasdig‘i majburiy.

### 5. Sozlamalar va so‘rov matni

- Past **temperature** faktlarga oid vazifalarda javoblarni kamroq «ijodiy» qiladi.
- Tor rol va aniq chegaralar «har qanday savolga javob ber»dan yaxshiroq ishlaydi.
- Murakkab vazifani bitta ulkan so‘rov o‘rniga bosqichlarga bo‘ling.

### 6. Baholash (evals)

Namunaviy javoblari bor real savollar to‘plamini yig‘ing va ularni tizimdan muntazam o‘tkazing. Shunda prompt, model yoki qidiruvdagi o‘zgarishlar haqiqatan yordam beryaptimi — bir-ikki omadli misolga qarab emas, aniq ko‘rasiz.

## Tipik xatolar

- Javob ishonchli eshitilgani uchun unga ishonish.
- RAG ulab, qidiruv kerakli parchalarni topayaptimi — tekshirmaslik. Yomon qidiruv xatolarning keng tarqalgan sababi.
- Bazada javobi yo‘q savollarda sinab ko‘rmaslik.
- Nozik mavzularda sun’iy intellekt javoblarini hech qanday tekshiruvsiz mijozlarga yuborish.

## FAQ

### Gallyutsinatsiyalardan butunlay qutulish mumkinmi?

Yo‘q. Ularni sezilarli kamaytirish va iqtiboslar hamda tekshiruvlar orqali ko‘rinadigan qilish mumkin, lekin generativ modelda xatolarni to‘liq istisno qilib bo‘lmaydi. Shuning uchun muhim qarorlar nazoratni talab qiladi.

### Yangi model muammoni hal qiladimi?

Kuchliroq modellar kamroq xato qiladi, lekin ishlash tamoyili o‘sha. Manbaga tayanish, rad etish va tekshiruv har qanday modelda kerak bo‘lib qoladi.

### Birinchi navbatda nimani joriy qilish kerak?

Hujjatlaringiz bo‘yicha RAG, «bilmasang — ayt» yo‘riqnomasi va kichik test savollar to‘plamidan boshlang. Bu o‘rtacha kuch evaziga asosiy samarani beradi.
