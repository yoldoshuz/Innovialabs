---
title: Veb-dasturchi uchun eng yaxshi VS Code kengaytmalari
description: Vazifalar bo‘yicha VS Code kengaytmalari: linting, formatlash, Git, Docker, REST va AI yordamchilar, ularni sozlash va muharrirni sekinlashtirmaslik.
summary: Veb-dasturchiga har bir vazifa uchun bitta kengaytma kerak — ESLint, Prettier, GitLens, Docker yoki Dev Containers, REST mijoz va AI yordamchi; ular .vscode’da loyiha darajasida sozlanadi va muharrir tez qolishi uchun muntazam tekshiriladi.
---
## Qisqacha javob

Yaxshi kengaytmalar to‘plami kichik bo‘ladi: **har bir vazifaga bitta vosita**. Ko‘pchilik veb-loyihalar uchun bu:

| Vazifa | Kengaytma | Nima qiladi |
|---|---|---|
| Linting | **ESLint**, **Stylelint** | JS/TS va CSS’dagi xatolar va yomon patternlarni ko‘rsatadi |
| Qatordagi xatolar | **Error Lens** | Xato matnini to‘g‘ridan-to‘g‘ri qatorda ko‘rsatadi |
| Formatlash | **Prettier**, **EditorConfig** | Butun jamoa uchun yagona kod uslubi |
| Git | **GitLens**, **Git Graph** | Qatorni kim va nima uchun o‘zgartirgan, tarmoqlar tarixi |
| Konteynerlar | **Docker** / **Container Tools** (Microsoft), **Dev Containers** | Konteynerlarni boshqarish, konteyner ichida dasturlash |
| REST | **REST Client** yoki **Thunder Client** | Muharrirdan chiqmasdan API’ga so‘rovlar |
| AI | **GitHub Copilot** yoki **Continue** kabi muqobil | Avtoto‘ldirish, chat, tushuntirishlar |
| Frontend | **Tailwind CSS IntelliSense**, **Code Spell Checker** | Klass maslahatlari, xatoliklarni topish |

Faqat haqiqatan foydalanadiganlaringizni o‘rnating. Har bir kengaytma — muharriringizda ishlaydigan kod.

## Linting va formatlash

**ESLint** muammolarni topadi, **Prettier** formatlaydi. Ular to‘qnashmasligi kerak: zamonaviy sozlashda ESLint kod sifatiga, Prettier esa ko‘rinishga javob beradi, ESLint’dagi formatlash qoidalari loyiha konfigi bilan o‘chiriladi.

Saqlashda hammasi ishlashi uchun sozlamalar:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

ESLint kengaytmasi loyihangizdagi `eslint` paketi va konfigdan foydalanadi, shuning uchun ularni dev-bog‘liqlik sifatida o‘rnating. Prettier ham xuddi shunday: repozitoriydagi `.prettierrc` formatlashni hammada bir xil qiladi. **EditorConfig** har qanday muharrirda ishlaydigan asosiy qoidalarni qo‘shadi — chekinishlar, qator oxirlari.

## Git

Ichki Source Control paneli kommitlar, difflar va tarmoqlarni qamraydi. **GitLens** har bir qatorga blame izohlarini, fayl va qator tarixini, tarmoqlarni solishtirishni qo‘shadi. **Git Graph** kommitlar grafini chizadi. GitLens og‘ir tuyulsa, sozlamalarida keraksiz funksiyalarni o‘chiring — inline blame va code lens alohida o‘chiriladi.

## Docker va Dev Containers

Microsoft’ning **Docker** kengaytmasi (yangi versiyalari **Container Tools** deb ataladi) konteynerlar, obrazlar va tomlarni ko‘rsatadi, `Dockerfile` va `compose` fayllari sintaksisida yordam beradi, loglar yoki shell’ni bir bosishda ochadi. **Dev Containers** bundan ham uzoqqa boradi: loyiha muhitni `.devcontainer/devcontainer.json`’da tasvirlaydi va VS Code kodni kerakli Node yoki Python versiyasiga ega konteyner ichida ochadi. Jamoaning yangi a’zosi qo‘lda o‘rnatishsiz ishlaydigan muhitga ega bo‘ladi.

## REST mijozlar

**REST Client** so‘rovlarni kod yonida kommit qilish mumkin bo‘lgan oddiy `.http` fayllarda saqlaydi:

```http
@baseUrl = http://localhost:3000

### List users
GET {{baseUrl}}/api/users
Accept: application/json

### Create user
POST {{baseUrl}}/api/users
Content-Type: application/json

{"name": "Aziz"}
```

So‘rov ustidagi **Send Request**’ni bosing — javob yonida ochiladi. **Thunder Client** to‘g‘ridan-to‘g‘ri VS Code ichida Postman uslubidagi vizual interfeys beradi. Haqiqiy tokenlarni hech qachon kommit qilmang: ularni muhit o‘zgaruvchilarida yoki `.gitignore`’dagi lokal fayllarda saqlang.

## AI yordamchilar

**GitHub Copilot** avtoto‘ldirish va ochiq fayllarni ko‘radigan chatni taklif qiladi. **Continue** kabi muqobillar turli modellarga, jumladan lokal ishga tushirilganlariga ulanadi. Tijoriy kodda yordamchidan foydalanishdan oldin kompaniya siyosatini tekshiring: qaysi kod provayderga yuboriladi va u o‘qitish uchun ishlatilishi mumkinmi. Takliflarga kichik hamkasb kodi kabi qarang — tekshiring, ayniqsa xavfsizlik masalalarida.

## Jamoa uchun umumiy to‘plam

Tavsiyalarni repozitoriydagi `.vscode/extensions.json`’ga joylang:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "EditorConfig.EditorConfig"
  ]
}
```

Kimdir loyihani ochganda VS Code ularni o‘rnatishni taklif qiladi. Umumiy sozlamalar — `.vscode/settings.json`’da.

## Muharrirni qanday sekinlashtirmaslik kerak

- **O‘lchang.** Command Palette → **Developer: Show Running Extensions** har bir kengaytmaning faollashish vaqtini ko‘rsatadi.
- **Aybdorni toping.** **Help: Start Extension Bisect** muammo topilguncha kengaytmalarni yarmidan o‘chirib boradi.
- **Ish maydoni uchun o‘chiring.** Frontend loyihada Python linteri kerak emas: **Disable (Workspace)**.
- **Profillardan (Profiles) foydalaning** — veb, Python yoki matnlar uchun alohida kengaytma va sozlamalar to‘plamlari.
- **Takrorlanishlardan qoching:** bir ishni qiladigan ikkita formatlovchi yoki ikkita Git interfeysi.
- **Yig‘ish papkalarini** kuzatish va qidiruvdan chiqarib tashlang:

```json
{
  "files.watcherExclude": { "**/dist/**": true, "**/.next/**": true },
  "search.exclude": { "**/dist": true, "**/.next": true }
}
```

- **Nashriyotchini tekshiring.** Tasdiqlangan nashriyotchilar va faol qo‘llab-quvvatlanadigan kengaytmalarni afzal ko‘ring: kengaytma fayllaringizga siz bilan bir xil kirish huquqiga ega.

## FAQ

### Formatlash uchun Prettier’mi yoki ESLint?

Formatlash uchun Prettier, kod sifati uchun ESLint. Ko‘rinish bilan Prettier shug‘ullansin, ESLint esa xatolar va yomon patternlarni qidirsin: shunda saqlashda bir-biriga zid tuzatishlar bo‘lmaydi.

### Qancha kengaytma — juda ko‘p?

Sehrli raqam yo‘q. Ishga tushish yoki matn terish sekinlashsa, ishlayotgan kengaytmalar va ularning faollashish vaqtini ko‘ring, so‘ng uzoq vaqt foydalanmaganlaringizni o‘chiring yoki ish maydoni uchun o‘chirib qo‘ying.

### REST Client bo‘lsa, Postman kerakmi?

Shaxsiy tekshiruv va kod yonida saqlanadigan so‘rovlar uchun odatda REST Client yoki Thunder Client yetarli. Postman jamoadagi umumiy kolleksiyalar, hujjatlar, mock-serverlar va avtomatik API testlari uchun foydaliroq.
