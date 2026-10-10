---
title: VS Code Remote SSH va Dev Containers: serverda va konteynerda ishlash
description: VS Code’da SSH orqali masofaviy serverda va takrorlanadigan dev-konteyner ichida qanday ishlash: devcontainer.json sozlamasi, tezlik va jamoa uchun foydasi.
summary: Remote SSH masofaviy mashinadagi loyihani xuddi lokal kabi ochadi, Dev Containers esa ishlab chiqish muhitini devcontainer.json tavsifi bo‘yicha Docker konteynerida ishga tushiradi — natijada butun jamoada bir xil muhit bo‘ladi.
---
## Ikki rejim haqida qisqacha

Ikkala rejim bir xil tuzilgan: VS Code interfeysi sizning kompyuteringizda qoladi, fayllar, terminal, til serverlari va ko‘pchilik kengaytmalar esa **kod joylashgan joyda** ishlaydi.

- **Remote SSH** — kod va jarayonlar masofaviy serverda yoki kuchli ish mashinasida. Ulanish SSH orqali bo‘ladi, serverga VS Code’ning server qismi avtomatik o‘rnatiladi.
- **Dev Containers** — loyiha Docker konteyneri ichida ochiladi. Unda nima o‘rnatilganini repozitoriydagi `devcontainer.json` fayli tavsiflaydi.

Rejimlarni birlashtirish mumkin: serverga SSH orqali ulanib, loyihani o‘sha yerda konteynerda ochish.

## Qachon qaysi birini tanlash kerak

| Vazifa | Mos keladi |
|---|---|
| Noutbuk kuchsiz, loyiha og‘ir | Kuchli mashinaga Remote SSH |
| Serverdagi ma’lumotlar yoki GPU kerak | Remote SSH |
| Yangi dasturchi bir necha daqiqada ishni boshlashi kerak | Dev Containers |
| Turli loyihalarga tillar va vositalarning turli versiyalari kerak | Dev Containers |
| Butun jamoa va CI’da bir xil muhit muhim | Dev Containers |

## Remote SSH’ni sozlash

1. Microsoft’ning **Remote - SSH** kengaytmasini o‘rnating.
2. Serverga oddiy terminaldan kalit orqali ulanish mumkinligiga ishonch hosil qiling.
3. Xostni `~/.ssh/config` fayliga qo‘shing:

```text
Host staging
    HostName 203.0.113.10
    User deploy
    IdentityFile ~/.ssh/id_ed25519
```

4. Buyruqlar palitrasida **Remote-SSH: Connect to Host...** ni tanlang va `staging` ni ko‘rsating.
5. Serverdagi loyiha papkasini oching.

Ilova serverda tinglayotgan portlarni **Ports** paneli orqali lokal mashinaga uzatish va saytni brauzerda `localhost` orqali ochish mumkin.

E’tibor bering: kod bilan ishlaydigan kengaytmalarni (linterlar, debaggerlar, til plaginlari) serverga qayta o‘rnatish kerak — muharrir buni o‘zi taklif qiladi.

## Dev Containers’ni sozlash

**Dev Containers** kengaytmasi va o‘rnatilgan Docker (Docker Desktop yoki Docker Engine) kerak bo‘ladi. Loyiha ildizida `.devcontainer/devcontainer.json` yarating:

```json
{
  "name": "web-app",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "lts" }
  },
  "forwardPorts": [3000],
  "postCreateCommand": "npm ci",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
    }
  }
}
```

Bu yerda nima bo‘lyapti:

- **image** — bazaviy obraz. Uning o‘rniga `build` maydoni orqali o‘z `Dockerfile` faylingizni ko‘rsatishingiz mumkin.
- **features** — vositalarni qo‘shimcha o‘rnatadigan tayyor bloklar: til, CLI, ma’lumotlar bazasi klientlari.
- **forwardPorts** — mashinangizdan ochiladigan portlar.
- **postCreateCommand** — konteyner yaratilgandan keyingi buyruq, odatda bog‘liqliklarni o‘rnatish.
- **customizations.vscode.extensions** — har bir ishtirokchida konteyner ichiga o‘rnatiladigan kengaytmalar.

So‘ng **Dev Containers: Reopen in Container** ni bajaring. Konfiguratsiya o‘zgargandan keyin — **Rebuild Container**.

Agar loyihaga ma’lumotlar bazasi va kesh kerak bo‘lsa, `image` o‘rniga `dockerComposeFile` va `service` dan foydalaning: VS Code Docker Compose’dagi barcha servislarni ko‘taradi va keraklisiga ulanadi.

## Tezlik

- **Remote SSH** tarmoqqa bog‘liq. Matn kiritish lokal va sekinlashmaydi, lekin fayl amallari va terminal ulanish orqali ishlaydi. Sizga yaxshi aloqasi bor serverni tanlang.
- **macOS va Windows’da Dev Containers** virtual mashina orqali ishlaydi, xostdagi umumiy papkalar esa fayllari ko‘p loyihalarda (masalan, `node_modules`) sekin bo‘lishi mumkin. **Clone Repository in Container Volume** buyrug‘i yordam beradi — kod darhol Docker tomida saqlanadi.
- **Windows’da** loyihani `C:` diskda emas, WSL 2 fayl tizimi ichida saqlang.
- Og‘ir qadamlarni (tizim paketlarini o‘rnatish) obraz yoki features’ga chiqaring — shunda ular har safar bajarilmay, keshlanadi.

## Jamoa uchun foydasi

- **Bir necha daqiqada onbording**: repozitoriyni klonlash, konteynerda ochish — va hammasi ishlaydi.
- **«Menda ishlayapti» muammosi yo‘q**: til, utilitalar va kengaytmalar versiyalari repozitoriyda qayd etilgan.
- **Muhitdagi o‘zgarishlar oddiy kod kabi review’dan o‘tadi.**
- Xuddi shu `devcontainer.json` ni GitHub Codespaces kabi bulutli muhitlar va CI uchun `devcontainer` konsol vositasi ham tushunadi. Spetsifikatsiya ochiq: [containers.dev](https://containers.dev).

## Ko‘p uchraydigan xatolar

- Maxfiy ma’lumotlarni to‘g‘ridan-to‘g‘ri `devcontainer.json` ga yozish — u Git’ga tushadi. Ularni muhit o‘zgaruvchilari yoki repozitoriydan tashqaridagi lokal fayllar orqali uzating.
- `latest` kabi o‘zgaruvchan tegli obrazni ko‘rsatish — muhit sizdan bexabar o‘zgara boshlaydi.
- Fayl huquqlarini unutish: konteynerda root sifatida ishlasangiz, xostda sudo’siz o‘zgartirib bo‘lmaydigan fayllar paydo bo‘lishi mumkin. `remoteUser` dan foydalaning.

## FAQ

### Remote SSH uchun serverda Docker kerakmi?

Yo‘q. Remote SSH uchun SSH kirish huquqi va serverda qo‘llab-quvvatlanadigan OT yetarli. Docker faqat loyihani o‘sha serverda konteynerda ochmoqchi bo‘lsangiz kerak.

### Dev Containers’dan VS Code’siz foydalansa bo‘ladimi?

Ha. Spetsifikatsiyani boshqa vositalar ham qo‘llab-quvvatlaydi, `devcontainer` konsol utilitasi esa bunday konteynerlarni, masalan, CI’da yig‘ib ishga tushira oladi.

### Dev-konteyner production konteyneridan nimasi bilan farq qiladi?

Dev-konteynerda ishlab chiqish vositalari bor: kompilyatorlar, debaggerlar, linterlar. Production obrazi esa minimal bo‘lishi kerak. Odatda bular ikki xil obraz, garchi umumiy bazaviy obrazdan yig‘ilishi mumkin bo‘lsa ham.
