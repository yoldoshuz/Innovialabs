---
title: Maxfiylik siyosati va cookie roziligi: saytga nima kerak
description: Maxfiylik siyosatida nima bo‘lishi kerak, cookie-banner qachon zarur, formalar va analitika uchun rozilikni qanday olish hamda qorong‘i patternlardan qochish.
summary: Formalar orqali ma’lumot yig‘adigan yoki analitika ulagan saytga haqiqiy ishlov berishni tasvirlaydigan maxfiylik siyosati va qonun talab qilgan joyda foydalanuvchi roziligi kerak. Rozilik ixtiyoriy bo‘lishi lozim: rad etish rozi bo‘lish kabi oson, majburiy bo‘lmagan skriptlar esa tanlovgacha ishga tushmaydi.
---

## Qisqa javob

Agar saytda kamida bitta forma yoki analitika hisoblagichi bo‘lsa, siz shaxsga doir ma’lumotlarga ishlov berasiz va sizga quyidagilar kerak:

- **maxfiylik siyosati** — qanday ma’lumot yig‘ishingiz va ular bilan nima qilishingiz haqidagi ochiq hujjat;
- **rozilik** — ishlov berish unga asoslangan joyda: xabarnomalar, marketing va analitika cookie fayllari, ba’zi qonunlarga ko‘ra (masalan, Rossiyaning 152-FZ) esa formadagi arizaning o‘zi ham.

Qaysi talablar amal qilishi foydalanuvchilaringiz qayerdaligiga bog‘liq: YeIda bu GDPR va cookie qoidalari, Rossiyada — 152-FZ, O‘zbekistonda — «Shaxsga doir ma’lumotlar to‘g‘risida»gi qonun. Asosiy tamoyillari o‘xshash.

## Maxfiylik siyosatida nima bo‘lishi kerak

Yaxshi siyosat oddiy savollarga oddiy tilda javob beradi:

1. **Siz kimsiz**: kompaniya nomi, kontaktlar, ma’lumotlar bo‘yicha kimga yozish kerak.
2. **Qanday ma’lumotlar** yig‘iladi: formalardan, ro‘yxatdan o‘tishda, avtomatik (IP, cookie, qurilma ma’lumotlari).
3. **Nima uchun**: arizalarni ko‘rib chiqish, shartnomani bajarish, xabarnoma, analitika, xavfsizlik.
4. **Qanday asosda**: rozilik, shartnoma, qonuniy manfaat, qonun talabi.
5. **Kimga uzatiladi**: hosting, CRM, pochta servisi, analitika, to‘lov tizimlari.
6. **Qayerda saqlanadi** va chet elga uzatiladimi.
7. **Qancha saqlanadi** — aniq muddat yoki uni belgilash qoidasi.
8. **Foydalanuvchi huquqlari** va ulardan qanday foydalanish: kirish, tuzatish, o‘chirish, rozilikni qaytarib olish.
9. **Cookie**: qaysilari ishlatiladi va tanlovni qanday boshqarish mumkin.
10. Hujjat **yangilangan sana**.

Asosiy qoida: siyosat amalda nima bo‘layotganini tasvirlaydi. Yangi analitika servisini qo‘shsangiz yoki CRMni almashtirsangiz, hujjatni yangilang.

## Cookie-banner qachon kerak

Cookie va o‘xshash texnologiyalar (localStorage, piksellar) ikki guruhga bo‘linadi:

| Turi | Misollar | Rozilik kerakmi (YeI qoidalari bo‘yicha) |
|---|---|---|
| **Qat’iy zarur** | Sessiya, savat, CSRF himoyasi, cookie tanlovini eslab qolish | Yo‘q |
| **Majburiy emas** | Analitika, vebvizor, reklama piksellari, retargeting | Ha, ishga tushishidan oldin |

Agar saytingiz faqat qat’iy zarur cookie fayllaridan foydalansa, rozilik banneri kerak emas — ularni siyosatda eslatib o‘tish yetarli. Analitika yoki reklama ulangan va tashrif buyuruvchilar orasida YeIdan foydalanuvchilar bo‘lsa, rozilik shu skriptlar yuklanishidan **oldin** olinishi kerak. Rossiya auditoriyasi uchun ham metrika tizimlari ma’lumotlari shaxsga doir deb qaraladi, shuning uchun u yerda ham cookie haqida ogohlantirish va rozilik standartga aylangan.

## Formalardagi rozilik

- Yuborish tugmasi yonida **oldindan belgilanmagan** alohida chekboks.
- Yonida — siyosat va rozilik matniga havola.
- Xabarnomaga rozilik — ariza yuborish bilan bog‘lanmagan **alohida** chekboks.
- Faqat kerakli maydonlarni yig‘ing: qayta qo‘ng‘iroq uchun ism va telefon yetarli bo‘lsa, tug‘ilgan sanani so‘ramang.
- **Rozilik faktini** saqlang: sana, vaqt, matn versiyasi va manba. Bu sizning dalilingiz.

## Qorong‘i patternlarga tushib qolmaslik

**Qorong‘i pattern** (dark pattern) — odamni aldov yoki bosim orqali rozilikka undaydigan interfeys. YeI regulyatorlari bunday rozilikni to‘g‘ridan-to‘g‘ri haqiqiy emas deb hisoblaydi.

Nimadan qochish kerak:

- «Qabul qilish» tugmasi yorqin, «Rad etish» esa sozlamalarga yashirilgan yoki xira havola ko‘rinishida;
- sozlamalarda oldindan yoqilgan o‘tkazgichlar;
- rozi bo‘lmasdan yopib bo‘lmaydigan va kontentni to‘sib qo‘yadigan banner;
- «Saytdan foydalanishni davom ettirib, siz rozilik bildirasiz» kabi iboralar;
- rozilikni faqat qo‘llab-quvvatlash xizmatiga xat yozib qaytarib olish mumkinligi.

Qanday qilib halol qilish mumkin:

- birinchi ekranda bir xil o‘lcham va vazndagi **«Hammasini qabul qilish»** va **«Hammasini rad etish»** tugmalari;
- standart holatda o‘chirilgan toifalar bilan «Sozlash» havolasi;
- tanlovni istalgan vaqtda o‘zgartirish imkoni, masalan, futerdagi havola orqali;
- tanlov eslab qolinadi va banner har sahifada qayta chiqmaydi.

## Texnik amalga oshirish

Asosiy nuqta: majburiy bo‘lmagan skriptlar HTMLda standart holatda yuklanmasligi kerak. Ular faqat rozilikdan keyin ulanadi.

```js
function loadAnalytics() {
  const s = document.createElement("script");
  s.src = "https://example-analytics.com/tag.js";
  s.async = true;
  document.head.appendChild(s);
}

const consent = localStorage.getItem("consent-analytics");
if (consent === "granted") loadAnalytics();

document.querySelector("#accept-analytics").addEventListener("click", () => {
  localStorage.setItem("consent-analytics", "granted");
  loadAnalytics();
});
```

Joriy qilgandan keyin dasturchi vositalaridagi Network bo‘limini tekshiring: «Qabul qilish» bosilmaguncha analitika va reklama servislariga so‘rovlar bo‘lmasligi kerak. Bu eng ko‘p uchraydigan xato — banner bor, lekin hisoblagich sahifa yuklanishidayoq ishlab bo‘lgan.

## FAQ

### Maxfiylik siyosatini onlayn generator orqali yaratsa bo‘ladimi?

Qoralama sifatida — ha, lekin keyin uni haqiqat bilan solishtirish kerak: aynan sizning servislaringiz, saqlash muddatlari va aloqa usullarini yozing. Sayt amalda qiladigan narsaga mos kelmaydigan shablon matn himoya qilmaydi va o‘zi da’vo uchun sabab bo‘lishi mumkin.

### Bizda faqat Yandex Metrika yoki Google Analytics bo‘lsa, banner kerakmi?

Tashrif buyuruvchilar orasida YeIdan foydalanuvchilar bo‘lsa — ha, hisoblagich ishga tushishidan oldin rozilik kerak. Rossiya va O‘zbekiston auditoriyasi uchun talablar boshqacha ifodalangan, lekin cookie haqida ogohlantirish va siyosatda analitikani tasvirlash baribir kerak. Xavfsiz variant — hamma uchun halol tanlovli bitta banner.

### Foydalanuvchilar roziligini saqlash kerakmi?

Ha. Inson rozilik berganini ko‘rsata olishingiz kerak: qachon, matnning qaysi versiyasiga va qaysi forma orqali. Odatda ariza bilan birga bazadagi yozuv va yuborish paytidagi siyosat versiyasi yetarli.
