---
title: vLLM bilan LLM’ni production’da o‘z serveringizda ishlatish
description: Ochiq LLM’ni vLLM orqali production’da ishga tushirish: GPU tanlash, batching, kechikish va o‘tkazuvchanlik, OpenAI-mos API va API bilan xarajat taqqoslash.
summary: vLLM ochiq modellarni o‘z GPU’laringizda OpenAI-mos API va samarali batching bilan ishlatadi; yuklama barqaror, ma’lumot ichkarida qolishi shart va jamoa bor bo‘lsa, bu o‘zini oqlaydi.
---
## Qisqa javob

**vLLM** — katta til modellari uchun open-source inference server. U ochiq modelni (Llama, Qwen, Mistral va boshqalar) GPU’laringizga yuklaydi va **OpenAI-mos HTTP API** taqdim etadi. Ko‘pincha mavjud mijoz kodi faqat base URL’ni almashtirish bilan ishlaydi.

Asosiy afzalliklari — **PagedAttention** (KV-keshni xotirada tejamkor saqlash) va **continuous batching** (yangi so‘rovlar navbat kutmasdan joriy batch’ga qo‘shiladi). Shu tufayli bitta GPU bir vaqtda ko‘p foydalanuvchiga xizmat qiladi.

O‘z serveringiz quyidagi hollarda o‘rinli:

- ma’lumotlar infratuzilmangizdan tashqariga chiqmasligi kerak;
- yuklama yuqori va GPU bo‘sh turmaydigan darajada barqaror;
- fine-tuning qilingan yoki aniq bir ochiq model kerak;
- GPU serverlarni boshqara oladigan muhandislar bor.

## GPU’ni qanday tanlash kerak

Birinchi cheklov — xotira. Taxminiy hisob:

- **Og‘irliklar** = parametrlar soni x bitta parametr uchun bayt. 7B model FP16’da (2 bayt) taxminan 14 GB, 8 bitda taxminan 7 GB, 4 bitda taxminan 3,5-4 GB egallaydi.
- **KV-kesh** kontekst uzunligi va parallel so‘rovlar soni bilan o‘sadi. Aynan u bir vaqtda nechta foydalanuvchi sig‘ishini cheklaydi.
- **Qo‘shimcha xarajatlar** — aktivatsiyalar va CUDA runtime uchun.

Model bitta kartaga sig‘masa, vLLM uni **tensor parallelism** orqali bir nechta GPU’ga bo‘ladi. Kvantlangan modellar (AWQ, GPTQ, FP8) kamroq xotira talab qiladi, lekin sifat biroz pasayadi — buni o‘z vazifalaringizda o‘lchang.

## Serverni ishga tushirish

```bash
pip install vllm
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --tensor-parallel-size 1
```

Mijoz oddiy OpenAI SDK’dan foydalanadi:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="local")
resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",
    messages=[{"role": "user", "content": "Salom"}],
)
print(resp.choices[0].message.content)
```

Flaglar versiyadan versiyaga o‘zgaradi, shuning uchun [vLLM rasmiy hujjatlari](https://docs.vllm.ai/) bilan solishtiring.

## O‘tkazuvchanlik yoki kechikish

Bu ikki maqsad turli tomonga tortadi:

| Maqsad | Nima yordam beradi | Narxi |
|---|---|---|
| **Yuqori o‘tkazuvchanlik** (jami soniyasiga ko‘p token) | katta batch’lar, ko‘proq parallel ketma-ketliklar, xotiradan yuqori foydalanish | har bir foydalanuvchi ko‘proq kutadi |
| **Past kechikish** (birinchi token tez) | kichik batch’lar, qisqaroq maksimal kontekst, takrorlanuvchi system prompt uchun prefix caching | bitta GPU’ga kamroq foydalanuvchi |

Asosiy sozlamalar:

- **`--max-model-len`** — qisqa kontekst ko‘proq parallel so‘rov uchun KV-keshni bo‘shatadi.
- **`--max-num-seqs`** — batch’dagi bir vaqtdagi ketma-ketliklar chegarasi.
- **`--gpu-memory-utilization`** — vLLM video xotiraning qancha qismini egallashi mumkin.
- **Prefix caching** — ko‘p so‘rovlarda bir xil uzun system prompt bo‘lsa, hisob-kitobni qayta ishlatadi.

Sozlamalarni tanlashdan oldin real yuklama ostida **birinchi tokengacha vaqt (TTFT)**, **har bir chiqish tokeni uchun vaqt** va **soniyasiga jami tokenlar** sonini o‘lchang.

## Production uchun chek-list

- vLLM’ni **autentifikatsiya** va **rate limit**’li reverse proxy ortiga qo‘ying — serverning o‘zi to‘liq API shlyuz emas.
- Model va image versiyalari qat’iy belgilangan holda **Docker**’da ishga tushiring.
- Metrikalarni yig‘ing (vLLM’da Prometheus endpoint bor) va navbat uzunligi, GPU xotirasi hamda xatolar ulushi bo‘yicha alertlar sozlang.
- **Sovuq start**ni hisobga oling: katta modelni yuklash vaqt oladi, isitilgan replikalar saqlang.
- Nosozlik va keskin yuklamalar uchun bulutli API’ga **fallback** tayyorlang.

## O‘z serveringiz yoki bulutli API: to‘liq xarajat

Faqat GPU narxini token narxi bilan solishtirmang. Hammasini hisoblang:

- **GPU narxi** — ishlasa ham, bo‘sh tursa ham to‘laysiz. Past yuklama har bir tokenni qimmatlashtiradi.
- **Muhandislar vaqti** — sozlash, yangilash, monitoring, navbatchilik.
- **Model sifati** — ochiq model yetakchi API darajasiga yetishi uchun promptlar ustida ko‘proq ish yoki fine-tuning talab qilishi mumkin.
- **Masshtablash** — bulutli API keskin yuklamani ko‘taradi, klasteringizning esa qat’iy chegarasi bor.

Bulutli API odatda notekis yoki kichik yuklamada va prototip bosqichida foydaliroq. O‘z serveringiz **barqaror yuqori yuklama**, **ma’lumot saqlash joyi** bo‘yicha qat’iy talablar yoki o‘z modelingiz kerak bo‘lganda o‘zini oqlaydi.

## Ko‘p uchraydigan xatolar

- GPU’ni faqat og‘irliklar hajmiga qarab tanlash va KV-keshni unutish.
- Maksimal kontekstni foydalanuvchilar real yuboradiganidan ancha katta qo‘yish.
- Real parallel yuklama o‘rniga bitta so‘rov bilan test qilish.
- vLLM portini to‘g‘ridan-to‘g‘ri internetga ochish.

## FAQ

### Kodimdagi OpenAI API’ni vLLM bilan almashtirsa bo‘ladimi?

Chat va completions uchun odatda ha: SDK’da vLLM base URL’ini va ishga tushirilgan model nomini ko‘rsating. Ba’zi funksiyalar, masalan tool calling formatlari, model va server versiyasiga bog‘liq, ularni tekshirib ko‘ring.

### Bitta GPU yetadimi?

Kichik va o‘rta modellar uchun mo‘tadil trafikda ko‘pincha ha, ayniqsa kvantlash bilan. Katta modellar va yuqori parallellik ko‘proq xotira yoki tensor parallelism bilan bir nechta GPU talab qiladi.

### Bulutli API qachon arzonroq?

Yuklama notekis yoki kichik bo‘lsa, GPU’lar ko‘p vaqt bo‘sh tursa va ma’lumotni o‘z serverlaringizda saqlash bo‘yicha qat’iy talab bo‘lmasa.
