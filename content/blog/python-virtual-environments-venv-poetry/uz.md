---
title: Python virtual muhitlari: venv, pip va Poetry
description: Python’da virtual muhit nima uchun kerak, venv va Poetry’ni qanday sozlash, bog‘liqlik versiyalarini qotirish va Windows hamda Linux’dagi xatolardan qochish.
summary: Virtual muhit — bitta loyihaning Python va paketlari joylashgan izolyatsiyalangan papka; uni venv yoki Poetry orqali yarating va bog‘liqlik versiyalarini faylda qotiring.
---

## Virtual muhit nima uchun kerak

**Virtual muhit** — o‘z Python interpretatori va o‘z paketlariga ega alohida papka. Usiz barcha loyihalar kutubxonalarni umumiy tizim Python’iga o‘rnatadi va ertami-kechmi bir loyiha kutubxonaning bitta versiyasini, boshqasi esa unga mos kelmaydigan versiyasini talab qiladi.

Muhit uchta vazifani hal qiladi:

- **Izolyatsiya**: bir loyihaning paketlari boshqasini buzmaydi.
- **Takrorlanuvchanlik**: hamkasb yoki server aynan o‘sha versiyalarni o‘rnatadi.
- **Toza tizim**: paketlarni global va administrator huquqlari bilan o‘rnatish shart emas.

## venv va pip: o‘rnatilgan variant

`venv` moduli Python standart kutubxonasiga kiradi, hech narsa o‘rnatish shart emas.

```bash
# .venv papkasida muhit yaratish
python -m venv .venv

# faollashtirish: Linux / macOS
source .venv/bin/activate

# faollashtirish: Windows (PowerShell)
.venv\Scripts\Activate.ps1

# paket o‘rnatish va versiyalarni qotirish
pip install requests
pip freeze > requirements.txt
```

Boshqa kompyuterda muhit shunday tiklanadi:

```bash
python -m venv .venv
# faollashtiring, keyin:
pip install -r requirements.txt
```

`pip freeze` barcha o‘rnatilgan paketlarning, shu jumladan tranzitiv bog‘liqliklarning **aniq versiyalarini** yozadi. Bu oddiy, lekin fayl «siz o‘zingiz tanlagan paketlar»ni «ular bilan birga kelgan paketlar»dan ajratmaydi.

## Poetry: bog‘liqliklar va lock-fayl

**Poetry** muhit, bog‘liqliklar va paket yig‘ishni bitta `pyproject.toml` fayli orqali boshqaradi. Uni loyihalardan alohida yashashi uchun `pipx` orqali o‘rnatish qulay.

```bash
pipx install poetry

poetry init            # mavjud loyihada pyproject.toml yaratish
poetry add requests    # bog‘liqlik qo‘shish
poetry add --group dev pytest   # faqat ishlab chiqish uchun bog‘liqlik
poetry install         # poetry.lock bo‘yicha hammasini o‘rnatish
poetry run python main.py       # muhit ichida ishga tushirish
```

Poetry ikkita faylni yuritadi:

- `pyproject.toml` — sizga **qaysi** paketlar va qanday versiya diapazonlari kerak;
- `poetry.lock` — haqiqatan o‘rnatilgan **aniq** versiyalar. Uni repozitoriyga commit qilinadi.

## venv yoki Poetry

| Mezon | venv + pip | Poetry |
|---|---|---|
| O‘rnatish | Python’ga kiritilgan | Alohida o‘rnatiladi |
| Versiyalarni qotirish | Qo‘lda `pip freeze` | Avtomatik `poetry.lock` |
| Dev-bog‘liqliklar | Qo‘lda alohida fayl | Bog‘liqlik guruhlari |
| Kirish chegarasi | Minimal | Buyruqlarni o‘rganish kerak |
| Mos keladi | Skriptlar, kichik servislar, Docker | Jamoaviy loyihalar va kutubxonalar |

## Keng tarqalgan xatolar

- **Muhit git’da.** `.venv` papkasini `.gitignore`ga qo‘shing, faqat `requirements.txt` yoki `pyproject.toml` va `poetry.lock`ni commit qiling.
- **Faollashtirish unutilgan.** Paketlar jimgina tizim Python’iga o‘rnatiladi. `which python` (Linux) yoki `where python` (Windows) bilan tekshiring.
- **Windows faollashtirishni bloklaydi.** PowerShell skriptlarni ishga tushirishni taqiqlashi mumkin. `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` buyrug‘i yoki `cmd` va `activate.bat` yordam beradi.
- **Linux’da venv yo‘q.** Ba’zi distributivlarda modul alohida paket sifatida keladi, masalan `python3-venv`. U yerda ko‘pincha `python` emas, `python3` yozish kerak.
- **externally-managed-environment xatosi.** Yangi distributivlar tizim Python’iga `pip install`ni taqiqlaydi. Bu taqiqni chetlab o‘tish emas, muhit yaratish uchun signal.
- **Muhit papkasini ko‘chirish.** `.venv` ichida absolyut yo‘llar yozilgan, ko‘chirgandan keyin uni qayta yaratish osonroq.

## FAQ

### Docker ichida virtual muhit kerakmi?

Shart emas: konteynerning o‘zi izolyatsiyalangan. Lekin bog‘liqlik versiyalarini baribir qotirish kerak, aks holda turli kunlardagi yig‘ishlar farq qiladi.

### requirements.txt’dan Poetry’ga o‘tish mumkinmi?

Ha. `poetry init` orqali `pyproject.toml` yarating va asosiy paketlarni `poetry add` bilan qo‘shing. Tranzitiv bog‘liqliklarni Poetry o‘zi topib, `poetry.lock`ga yozadi.

### Muhit buzilsa nima qilish kerak?

`.venv` papkasini o‘chiring va uni bog‘liqliklar fayli bo‘yicha qayta yarating. Versiyalar aynan shu maqsadda qotiriladi.
