---
title: Yangi boshlovchilar uchun VS Code: o‘rnatish va ilk sozlash
description: VS Code’ni o‘rnatish, interfeys bilan tanishish, loyihani ochish, ichki terminal, sozlamalar sinxronlashi, mavzu, shrift va birinchi sozlamalar haqida.
summary: VS Code’ni rasmiy saytdan yuklab oling, alohida fayllarni emas, loyiha papkasini oching, Command Palette va ichki terminalni o‘zlashtiring, Settings Sync’ni yoqing va avtosaqlash hamda saqlashda formatlash kabi bir nechta sozlamani o‘zgartiring.
---
## Qisqacha javob

**Visual Studio Code** — Microsoft’ning Windows, macOS va Linux uchun bepul kod muharriri. Boshlash uchun:

1. Uni rasmiy sayt code.visualstudio.com’dan o‘rnating.
2. Alohida fayllarni emas, loyiha **papkasini** oching.
3. Ikki tugmalar birikmasini eslab qoling: **Command Palette** va **Quick Open**.
4. Alohida oynada emas, **ichki terminalda** ishlang.
5. **Settings Sync**’ni yoqing va bir nechta standart sozlamani o‘zgartiring.

Bu taxminan yarim soat oladi va keyin har kuni vaqtni tejaydi.

## O‘rnatish

- **Windows.** User Installer’ni yuklab oling. O‘rnatishda **Add to PATH** va kontekst menyusi uchun **Open with Code** bandlarini belgilang: shunda istalgan papkani Explorer’dan yoki terminalda `code .` buyrug‘i bilan ochish mumkin.
- **macOS.** Arxivni yuklab oling, Visual Studio Code’ni Applications papkasiga ko‘chiring. Keyin Command Palette’ni ochib, `code` buyrug‘ini PATH’ga o‘rnatadigan **Shell Command** buyrug‘ini bajaring.
- **Linux.** Rasmiy saytdagi `.deb` yoki `.rpm` paketidan yoki distributivingiz paketidan foydalaning.

Faqat rasmiy saytdan yoki ishonchli paket menejeridan yuklab oling: tasodifiy saytlardagi qayta yig‘ilgan “portativ” versiyalar xavfsizlik uchun xavfli.

## Bir daqiqada interfeys

- **Activity Bar** — chapdagi ikonkalar qatori: Explorer, Search, Source Control (Git), Run and Debug, Extensions.
- **Side Bar** — shu ikonkalar ochadigan panel, masalan fayllar daraxti.
- **Editor** — tablarga ega asosiy maydon; fayllarni yonma-yon ko‘rish uchun uni bo‘lish mumkin.
- **Panel** — pastki maydon: Terminal, Problems, Output, Debug Console.
- **Status Bar** — pastki qator: Git tarmog‘i, xatolar, fayl tili, qator oxirlari, chekinishlar.

Asosiy tugmalar birikmalari (macOS’da Ctrl o‘rniga Cmd):

| Amal | Birikma |
|---|---|
| Command Palette — istalgan buyruq nomi bo‘yicha | `Ctrl+Shift+P` |
| Quick Open — fayl nomi bo‘yicha | `Ctrl+P` |
| Terminalni ko‘rsatish yoki yashirish | ``Ctrl+` `` |
| Butun loyiha bo‘yicha qidiruv | `Ctrl+Shift+F` |
| Yon panelni ko‘rsatish yoki yashirish | `Ctrl+B` |
| Sozlamalar | `Ctrl+,` |

Faqat bittasini eslab qolsangiz, u **Command Palette** bo‘lsin: buyruq nomining bir qismini yozing, VS Code uni topadi.

## Loyihalarni qanday ochish kerak

**File → Open Folder** yoki loyiha papkasida `code .` buyrug‘i. VS Code papkani **ish maydoni** deb hisoblaydi: qidiruv, Git, terminal va loyiha sozlamalari unga nisbatan ishlaydi. So‘nggi loyihalar — **File → Open Recent**’da.

Muayyan loyiha sozlamalari papka ichidagi `.vscode/settings.json`’da saqlanadi va shaxsiy sozlamalardan ustun turadi — jamoa chekinish yoki formatlash bo‘yicha kelishgan bo‘lsa, qulay.

## Ichki terminal

``Ctrl+` `` bilan ochiladi. U darhol loyiha papkasida ishga tushadi, shuning uchun `npm install`, `git status` yoki `python main.py` ortiqcha o‘tishlarsiz bajariladi. Bir nechta terminal ochish, ularni bo‘lish va qobiqni tanlash mumkin: Windows’da bu PowerShell, Command Prompt yoki Git Bash. Standart qobiq **Terminal: Select Default Profile** buyrug‘i bilan belgilanadi.

## Sozlamalarni sinxronlash

Pastki chapdagi akkaunt ikonkasini bosing va GitHub yoki Microsoft orqali kirib, **Backup and Sync Settings**’ni yoqing. VS Code sozlamalar, tugmalar birikmalari, kengaytmalar, snippetlar va interfeys holatini kompyuterlar o‘rtasida sinxronlay boshlaydi. Yangi noutbukda kirishning o‘zi kifoya — odatiy muharrir bir daqiqada tayyor.

## Mavzular va shriftlar

- **Mavzu:** Command Palette → **Preferences: Color Theme**. Ichki Dark Modern va Light Modern — yaxshi boshlanish, qolganlari kengaytma sifatida o‘rnatiladi.
- **Shrift:** kod uchun yaratilgan monoshirinali shrift, masalan JetBrains Mono, Fira Code yoki Cascadia Code. Avval uni tizimga o‘rnating, keyin sozlamalarda ko‘rsating.
- **O‘lcham:** uzoq ishlash uchun qulay. `Ctrl+=` va `Ctrl+-` butun interfeysni kattalashtiradi va kichraytiradi.

## Birinchi sozlamalar

Command Palette’dan **Preferences: Open User Settings (JSON)**’ni oching va qo‘shing:

```json
{
  "files.autoSave": "afterDelay",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.fontFamily": "JetBrains Mono, Consolas, monospace",
  "editor.fontSize": 15,
  "editor.fontLigatures": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.minimap.enabled": false
}
```

- `files.autoSave` — o‘zgarishlar endi yo‘qolmaydi.
- `editor.formatOnSave` — formatlovchi kengaytma o‘rnatilgan bo‘lsa, kod har saqlashda formatlanadi.
- `editor.tabSize` — chekinish kengligi; loyiha kelishuviga amal qiling.
- `files.trimTrailingWhitespace` va `files.insertFinalNewline` — Git’da toza difflar.
- `editor.minimap.enabled` — minixarita joy egallaydi, ko‘pchilik uni o‘chiradi.

## FAQ

### VS Code va Visual Studio bir narsami?

Yo‘q. Visual Studio — asosan Windows’da .NET va C++ dasturlash uchun to‘liq IDE. VS Code — yengil, kross-platformali muharrir, kengaytmalar bilan deyarli har qanday til uchun IDE’ga aylanadi.

### Kengaytmalar darhol kerakmi?

Faqat tilingiz uchun va formatlovchi, masalan Python yoki ESLint va Prettier. Qolganlarini aniq ehtiyoj paydo bo‘lganda qo‘shing: ortiqcha kengaytmalar muharrirni sekinlashtiradi.

### Sozlamalarim qayerda saqlanadi?

Shaxsiy sozlamalar foydalanuvchi profilidagi `settings.json` faylida, loyiha sozlamalari esa `.vscode/settings.json`’da. Ikkalasi ham Command Palette’dan ochiladi, loyiha sozlamalari ustunlikka ega.
