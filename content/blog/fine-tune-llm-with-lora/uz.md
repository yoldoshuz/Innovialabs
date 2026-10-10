---
title: Ochiq LLMni LoRA va QLoRA yordamida qanday dooqitish mumkin
description: Ochiq LLMni LoRA va QLoRA orqali dooqitish bo‘yicha qo‘llanma: dataset formati, o‘qitish sozlamalari, giperparametrlar, GPU talablari va baholash.
summary: LoRA muzlatilgan model ustida kichik adapterlarni o‘qitadi, QLoRA esa xuddi shuni 4-bitli bazada bajaradi, shuning uchun dooqitish bitta GPUga sig‘adi. Muvaffaqiyatni toza dataset va bazaviy model bilan halol taqqoslash belgilaydi.
---
## Qisqacha: LoRA va QLoRA nima

**LoRA** (Low-Rank Adaptation) asl model vaznlarini o‘zgartirmaydi. Tanlangan qatlamlarga past rangli kichik matritsalar qo‘shiladi va faqat ular o‘qitiladi. Natijadagi adapter juda yengil, uni alohida saqlash va bazaviy modelga ulash oson.

**QLoRA** — xuddi shu yondashuv, lekin bazaviy model **4-bitli kvantizatsiyada** yuklanadi. Bu video xotira sarfini keskin kamaytiradi: avval bir nechta GPU talab qilgan modellar bitta GPUda o‘qitiladigan bo‘ladi.

Dooqitish modelning **uslubi, javob formati yoki xulq-atvorini** o‘zgartirish kerak bo‘lganda kerak. Agar maqsad modelga yangi faktlarni berish bo‘lsa, odatda RAG yaxshiroq mos keladi.

## 1-qadam. Datasetni tayyorlang

Ma’lumotlar sifati har qanday giperparametrdan muhimroq. Keng tarqalgan format — JSONL ko‘rinishidagi dialoglar:

```json
{"messages": [{"role": "system", "content": "Siz qo‘llab-quvvatlash xizmati yordamchisisiz."}, {"role": "user", "content": "Mahsulotni qanday qaytaraman?"}, {"role": "assistant", "content": "Qaytarishni shaxsiy kabinetda rasmiylashtiring..."}]}
```

Nimani tekshirish kerak:

- **Chat shabloni** model o‘qitilgan shablon bilan mos bo‘lishi shart. Tokenizatorning o‘rnatilgan chat template’idan foydalaning.
- **Takrorlar va qarama-qarshiliklarni** olib tashlang — model ularni ham to‘g‘ri misollar kabi tirishib o‘rganadi.
- **Test to‘plamini** oldindan ajratib qo‘ying va o‘qitishda ishlatmang.
- **Xilma-xillik** miqdordan muhimroq: yuzlab sifatli misollar ko‘pincha minglab bir xil misollardan ko‘proq foyda beradi.

## 2-qadam. O‘qitishni sozlang

Keng tarqalgan stek — Hugging Face `transformers`, `peft` va `trl`. QLoRA uchun minimal konfiguratsiya:

```python
from transformers import BitsAndBytesConfig
from peft import LoraConfig
import torch

bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

lora = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules="all-linear",
    task_type="CAUSAL_LM",
)
```

So‘ng model `quantization_config=bnb` bilan yuklanadi, `trl` dagi `SFTTrainer` esa dataset va LoRA konfiguratsiyasini oladi. Batafsil — [PEFT hujjatlarida](https://huggingface.co/docs/peft).

## 3-qadam. Muhim giperparametrlar

| Parametr | Nima qiladi | Nimadan boshlash |
|---|---|---|
| `r` (rang) | Adapter sig‘imi | 8–16, model yetarli o‘rganmasa — yuqoriroq |
| `lora_alpha` | Yangilanishlar masshtabi | Ko‘pincha 2×r qo‘yiladi |
| learning rate | O‘qitish tezligi | To‘liq fine-tuningdan yuqoriroq; validatsion loss bo‘yicha tanlang |
| epoxalar | Ma’lumotlar bo‘ylab o‘tishlar | 1–3; ko‘prog‘i — ortiqcha moslashish xavfi |
| `target_modules` | Qaysi qatlamlar moslashtiriladi | Barcha chiziqli qatlamlar odatda eng yaxshi natija beradi |

**Validation loss**ni kuzating: agar u o‘sib, training loss esa tushayotgan bo‘lsa — model ortiqcha moslashmoqda (overfitting).

## 4-qadam. GPU talablari

Aniq raqamlar model, kontekst uzunligi va batch hajmiga bog‘liq, shuning uchun omillarga tayaning:

- **Model hajmi** — asosiy omil. QLoRA 16-bitli yuklashga nisbatan vaznlar uchun xotirani taxminan to‘rt baravar kamaytiradi.
- **Ketma-ketlik uzunligi** — uzun misollar aktivatsiyalar uchun xotirani oshiradi.
- **Gradient checkpointing** tezlik hisobiga xotirani tejaydi.
- **Gradient accumulation** kichik GPUda katta batchni taqlid qilish imkonini beradi.

Hammasi xotiraga sig‘ishini tekshirish uchun ma’lumotlarning kichik qismida qisqa sinov o‘tkazishdan boshlang.

## 5-qadam. Natijani bazaviy model bilan solishtiring

Baza bilan taqqoslamasdan dooqitish foyda berdi deb aytib bo‘lmaydi.

- **Bir xil test to‘plamini** bazaviy va dooqitilgan modeldan o‘tkazing.
- **Vazifa metrikalaridan** foydalaning: klassifikatsiya aniqligi, formatga moslik, to‘g‘ri JSON ulushi.
- **Ko‘r ekspert baholashi** yoki aniq mezonli LLM-as-a-judge qo‘shing.
- **Regressiyalarni** tekshiring: model umumiy ko‘nikmalarni yo‘qotmadimi?

## Ko‘p uchraydigan xatolar

- Noto‘g‘ri chat template — model g‘alati javob beradi yoki to‘xtamaydi.
- Tekshiruvsiz yig‘ilgan «iflos» ma’lumotlarda o‘qitish.
- Kichik datasetda juda ko‘p epoxa.
- Haqiqiy javoblarni o‘qimasdan faqat loss bo‘yicha baholash.

## FAQ

### LoRA yoki QLoRA — qaysi birini tanlash kerak?

Xotira yetarli bo‘lsa, 16-bitli modeldagi LoRA soddaroq va biroz tezroq. GPU cheklangan bo‘lsa, QLoRA ancha kattaroq modelni dooqitish imkonini beradi.

### Dooqitish uchun nechta misol kerak?

Universal raqam yo‘q. Format va uslubni o‘zgartirish uchun ko‘pincha bir necha yuz sifatli misol yetadi; murakkab ko‘nikmalar uchun ko‘proq kerak. Test to‘plamidagi metrikalarga tayaning.

### Adapterni model bilan birlashtirish mumkinmi?

Ha, qulay deploy uchun adapterni bazaviy vaznlar bilan birlashtirish mumkin. QLoRA holatida birlashtirishni 4-bitli emas, to‘liq yoki yarim aniqlikdagi model nusxasi bilan bajaring.
