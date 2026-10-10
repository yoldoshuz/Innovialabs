---
title: LLM fine-tuning (qo‘shimcha o‘qitish) nima va u qachon o‘zini oqlaydi
description: Fine-tuning modelning xatti-harakatini misollaringiz asosida o‘zgartiradi, lekin yangi faktlarni o‘rgatmaydi. Qanday ma’lumot kerak va qachon RAG’dan yaxshiroq.
summary: Fine-tuning — tayyor til modelini misollaringizda qo‘shimcha o‘qitish, shunda u kerakli format va uslubda barqaror javob beradi; yangi bilimlar uchun odatda RAG mos, boshlash esa promptlardan kerak.
---
## Qisqa javob

**Fine-tuning** (qo‘shimcha o‘qitish) — tayyor til modelini **o‘zingizning misollar to‘plamingizda** "kirish — to‘g‘ri chiqish" ko‘rinishida qo‘shimcha o‘qitish. Shundan keyin model siz ko‘rsatgan narsani barqarorroq bajaradi: formatni, ohangni saqlaydi, qoidalaringiz bo‘yicha klassifikatsiya qiladi.

Eslab qolish kerak bo‘lgan asosiy narsa: qo‘shimcha o‘qitish modelning **xatti-harakatini** yaxshi o‘zgartiradi, lekin **bilim** qo‘shishni yomon uddalaydi. Agar bot narxlar ro‘yxatingiz yoki reglamentlaringizni bilishi kerak bo‘lsa, odatda RAG to‘g‘riroq.

## Modelda aynan nima o‘zgaradi

O‘qitish jarayonida modelning **og‘irliklari** (weights) — javobni belgilaydigan ichki parametrlar tuzatiladi. Ko‘pincha barcha og‘irliklar emas, ularga kichik qo‘shimcha o‘zgartiriladi (**LoRA** kabi usullar), bu arzonroq va tezroq.

Qo‘shimcha o‘qitish nima beradi:

- **Barqaror format:** qat’iy JSON, javobning belgilangan tuzilmasi.
- **Uslub va ohang:** brend ovozi, qisqalik, kerakli terminologiya.
- **Tor vazifa:** murojaatlarni klassifikatsiya qilish, maydonlarni ajratib olish, qoidalaringiz bo‘yicha belgilash.
- **Qisqaroq prompt:** ko‘rsatmalar modelga "joylangan", ularni har safar yuborish shart emas.

Ishonchli bermaydigan narsalar: dolzarb faktlar, tez-tez o‘zgaradigan ma’lumotlar va manbalarga havolalar.

## Prompt, RAG yoki fine-tuning

| | Prompt | RAG | Fine-tuning |
|---|---|---|---|
| Nimani o‘zgartiradi | So‘rovdagi ko‘rsatmalarni | So‘rovga topilgan hujjatlarni qo‘shadi | Model og‘irliklarini |
| Yangi bilimlar | Yo‘q | Ha, yangilash oson | Yomon |
| Format va uslub | Yaxshi, lekin har doim barqaror emas | Ta’sir qilmaydi | Barqaror |
| Ishga tushirish tezligi | Tez | O‘rtacha | Eng uzoq |
| Nima kerak | Yaxshi yozilgan ko‘rsatmalar | Hujjatlar bazasi va qidiruv | Sifatli misollar to‘plami |

Oqilona tartib deyarli har doim shunday: **avval prompt**, keyin bilimlar uchun **RAG**, faqat bu yetmasa — **fine-tuning**. Bu yondashuvlarni birlashtirish mumkin.

## Qo‘shimcha o‘qitish qachon o‘zini oqlaydi

- Misollar bilan prompt endi yordam bermaydi: model **formatni yoki uslubni muntazam buzadi**.
- Vazifa **tor va takrorlanuvchi**, so‘rovlar oqimi katta.
- Qo‘shimcha o‘qitilgandan keyin vazifani kattasidan yomon bajarmaydigan, lekin tezroq va arzonroq ishlaydigan **kichikroq modelga** o‘tmoqchisiz.
- To‘g‘ri javoblarning **yuzlab yoki minglab sifatli misollari** bor.

## Qanday ma’lumotlar kerak

- O‘qitish platformasi talab qiladigan formatdagi **"kirish — namunaviy javob" juftliklari**.
- **Sifat miqdordan muhimroq.** Misollardagi xato va qarama-qarshiliklarni ham model o‘rganib oladi.
- **Xilma-xillik:** misollar real holatlarni, jumladan murakkablarini ham qamrab olishi kerak.
- Model o‘qitilmagan **alohida test to‘plami** — "oldin" va "keyin" natijalarini halol solishtirish uchun.
- Asos bo‘lmasa, **shaxsiy ma’lumotlarsiz**.

## Narx nimalarga bog‘liq

Aniq summani aytib bo‘lmaydi, u omillardan tashkil topadi:

- **bazaviy model hajmi** va usul (to‘liq qo‘shimcha o‘qitish yoki LoRA);
- **ma’lumotlar hajmi** va o‘qitish epoxalari soni;
- **datasetni tayyorlash** — ko‘pincha eng mehnattalab qism, chunki uni odamlar bajaradi;
- **infratuzilma:** provayderning bulut xizmati yoki o‘z GPU’laringiz;
- o‘qitishdan keyin **modelning ishlash narxi** va uni qo‘llab-quvvatlash: yangi bazaviy model chiqqanda o‘qitishni takrorlash kerak bo‘lishi mumkin.

## Ko‘p uchraydigan xatolar

- Model kompaniya hujjatlarini "eslab qolishi" uchun qo‘shimcha o‘qitish. Buning uchun RAG bor.
- O‘lchovlarsiz boshlash: metrika yo‘q — mazmuni bormidi, tushunarsiz.
- Datasetni tekshiruvsiz tasodifiy suhbatlardan yig‘ish.
- O‘qitishga kirmagan vazifalarni model yomonroq bajarishi mumkinligini unutish.

## FAQ

### ChatGPT yoki Claude’ni qo‘shimcha o‘qitish mumkinmi?

Ba’zi provayderlar o‘zlarining ayrim modellarini API yoki bulut platformalari orqali qo‘shimcha o‘qitishga imkon beradi. Mavjud modellar ro‘yxati o‘zgarib turadi, shuning uchun provayderning dolzarb hujjatlarini tekshiring.

### Fine-tuning uchun qancha misol kerak?

Vazifaga bog‘liq. Format va uslub uchun ba’zan kichik to‘plam yetarli, murakkab klassifikatsiya uchun ko‘proq kerak. Kichik hajmdan boshlang, natijani o‘lchang va zarurat bo‘yicha ma’lumot qo‘shing.

### Fine-tuning gallyutsinatsiyalarni yo‘qotadimi?

Yo‘q. U muayyan vazifadagi xatolarni kamaytirishi mumkin, lekin faktik aniqlikni kafolatlamaydi. Faktlarga asoslangan javoblar uchun manbali RAG ishonchliroq.
