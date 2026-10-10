---
title: Next.js saytini o‘z domeningiz bilan Vercel’ga qanday deploy qilish
description: Bosqichma-bosqich: Git-repozitoriyni Vercel’ga ulash, muhit o‘zgaruvchilari, preview-deploylar, o‘z domeningizni bog‘lash va bepul tarif limitlari.
summary: Loyihani GitHub, GitLab yoki Bitbucket’ga yuklang, repozitoriyni Vercel’ga import qiling, muhit o‘zgaruvchilarini qo‘shing va domenni Settings → Domains bo‘limida bog‘lang. Shundan so‘ng asosiy branch’ga har bir push saytni avtomatik yangilaydi.
---
## Qisqa javob: to‘rt qadam

1. Kod GitHub, GitLab yoki Bitbucket’dagi Git-repozitoriyda turadi.
2. Vercel’da **Add New → Project** tugmasini bosasiz, repozitoriyni tanlaysiz va platforma Next.js’ni o‘zi aniqlaydi.
3. **Muhit o‘zgaruvchilarini** qo‘shasiz va birinchi deployni ishga tushirasiz.
4. **Settings → Domains** bo‘limida domeningizni qo‘shasiz va registratorda DNS-yozuvlarni kiritasiz.

Shundan keyin asosiy branch’ga har bir push **production**’ni yangilaydi, boshqa har bir branch va pull request esa o‘zining **preview-havolasini** oladi.

## Loyihani tayyorlash

Vercel’ni ulashdan oldin quyidagilarga ishonch hosil qiling:

- `npm run build` lokal kompyuterda xatosiz o‘tadi;
- lock-fayl (`package-lock.json`, `pnpm-lock.yaml` yoki `yarn.lock`) commit qilingan — Vercel paket menejerini shu fayl bo‘yicha tanlaydi;
- `.env*.local` fayllari `.gitignore`’da va repozitoriyga tushmagan;
- kerakli Node.js versiyasi `package.json` ichidagi `engines`’da yoki loyiha sozlamalarida ko‘rsatilgan.

## Repozitoriyni ulash

1. Vercel’ga Git-hosting akkauntingiz orqali kiring va kerakli repozitoriyga ruxsat bering.
2. Repozitoriy qarshisidagi **Import** tugmasini bosing.
3. Monorepozitoriyda **Root Directory** sifatida ilova joylashgan papkani ko‘rsating.
4. Build buyrug‘i va natija papkasini o‘zgartirmang: Next.js uchun ular avtomatik aniqlanadi.
5. **Deploy** tugmasini bosing.

Birinchi deploy bir necha daqiqa davom etadi va `project-name.vercel.app` ko‘rinishidagi manzil beradi.

## Muhit o‘zgaruvchilari

O‘zgaruvchilar **Settings → Environment Variables** bo‘limida uchta muhit uchun alohida beriladi: **Production**, **Preview** va **Development**.

Nimani yodda tutish kerak:

- `NEXT_PUBLIC_` prefiksli o‘zgaruvchilar build paytida brauzer JavaScript’iga joylanadi va har bir tashrif buyuruvchiga ko‘rinadi. **Maxfiy ma’lumotlar** (API kalitlari, ma’lumotlar bazasi parollari) bu prefikssiz bo‘lishi shart.
- O‘zgaruvchi o‘zgartirilgach, **yangi deploy** kerak, aks holda sayt eski qiymatlar bilan ishlashda davom etadi.
- Preview uchun haqiqiy emas, test bazasi va test kalitlarini ko‘rsating.

Xuddi shu o‘zgaruvchilarni lokal muhitga olish uchun Vercel CLI’dan foydalaning:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
```

## Preview-deploylar

Har bir branch va pull request eng so‘nggi versiya bilan alohida URL oladi. Bu o‘zgarishlarni buyurtmachiga ko‘rsatish yoki birlashtirishdan oldin tekshirishning eng oson yo‘li, asosiy sayt esa o‘zgarmaydi. Havola pull request’dagi izohda va **Deployments** bo‘limida paydo bo‘ladi.

Preview-havolalarni begonalardan **Deployment Protection** bo‘limida yopish mumkin. Agar preview’da hali e’lon qilinmagan kontent bo‘lsa, shu bo‘limni tekshiring.

## O‘z domeningizni bog‘lash

**Settings → Domains** bo‘limini oching va `example.com` kabi domenni qo‘shing. Ikki yo‘l bor:

- **DNS’ni registratorda qoldirish** va Vercel ko‘rsatgan yozuvlarni qo‘shish: odatda asosiy domen uchun A-yozuv va `www` uchun CNAME.
- **Domenni Vercel’ga delegatsiya qilish**, ya’ni registratorda NS-serverlarni almashtirish. Shunda barcha DNS Vercel’dan boshqariladi.

| Turi | Nomi | Qiymati |
|---|---|---|
| A | `@` | Vercel panelida ko‘rsatilgan IP-manzil |
| CNAME | `www` | Vercel panelida ko‘rsatilgan manzil |

Qiymatlarni aynan loyiha panelidan oling: Vercel ularni vaqti-vaqti bilan yangilaydi. Bitta asosiy manzilni, masalan `example.com`’ni tanlang va `www`’dan unga yo‘naltirishni yoqing. DNS platformaga ko‘rsata boshlashi bilan Vercel SSL-sertifikatni avtomatik chiqaradi.

NS-serverlarni almashtirsangiz, avval barcha mavjud yozuvlarni, ayniqsa pochta uchun **MX** va **TXT** yozuvlarini ko‘chiring, aks holda domen pochtasi ishlamay qoladi.

## Bepul tarif limitlari

**Hobby** tarifi shaxsiy, notijorat loyihalar uchun mo‘ljallangan. Kompaniya sayti, internet-do‘kon yoki mijoz loyihasi uchun Vercel shartlariga ko‘ra pullik **Pro** tarifi kerak.

Hobby’da build vaqti, server funksiyalarining bajarilish davomiyligi, trafik, rasmlarni optimallashtirish va boshqa resurslar cheklangan. Aniq qiymatlar o‘zgarib turadi, shuning uchun dolzarb raqamlarni hujjatlarda ([vercel.com/docs/limits](https://vercel.com/docs/limits)) ko‘ring va loyihadagi **Usage** bo‘limini kuzatib boring. Limitlarni eng tez og‘ir rasmlar, tez-tez qayta build qilish va statik bo‘lishi mumkin bo‘lgan sahifalarni serverda render qilish sarflaydi.

## Ko‘p uchraydigan xatolar

- **Lokal build bo‘ladi, Vercel’da yo‘q.** Ko‘pincha sabab fayl nomlaridagi harf registrida: Windows va macOS uni farqlamaydi, Linux’dagi build esa farqlaydi, shuning uchun `./header` importi `Header.tsx`’ni topmaydi.
- **O‘zgaruvchi `undefined`.** U kerakli muhit uchun berilmagan, qayta deploy qilinmagan yoki brauzerda `NEXT_PUBLIC_` prefiksisiz ishlatilgan.
- **`NEXT_PUBLIC_` prefiksli maxfiy kalit** ochiq kodga tushib qolgan.
- **Preview haqiqiy bazaga ulangan** va test amallari real ma’lumotlarni o‘zgartiradi.
- **Registratorda eski A-yozuvlar** yangilari bilan birga qolgan va domen goh eski hostingda, goh Vercel’da ochiladi.

## FAQ

### GitHub’siz deploy qilsa bo‘ladimi?

Ha, Vercel CLI’dagi `vercel --prod` buyrug‘i bilan. Lekin Git integratsiyasisiz har bir push’dagi avtomatik deploylar va branch’lar uchun preview-havolalardan mahrum bo‘lasiz.

### Domen ishlashi uchun qancha kutish kerak?

Odatda bir necha daqiqadan bir necha soatgacha, bu eski yozuvlarning TTL qiymatiga bog‘liq. Vercel to‘g‘ri DNS-yozuvlarni ko‘rgach, sertifikat avtomatik chiqariladi; holatni Settings → Domains bo‘limida ko‘rish mumkin.

### Bepul tarif kompaniya sayti uchun yaraydimi?

Vercel shartlariga ko‘ra — yo‘q: Hobby notijorat foydalanish uchun. Tijorat sayti uchun Pro yoki boshqa hosting kerak.
