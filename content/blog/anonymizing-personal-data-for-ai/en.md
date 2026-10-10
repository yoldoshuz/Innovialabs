---
title: How to Anonymize Personal Data Before Sending It to AI
description: How to find and hide personal data before an AI request: masking, pseudonymization, re-identification risks and data localization rules in Uzbekistan.
summary: Before sending text to AI, detect personal data (names, phones, passports, addresses), replace it with masks or pseudonyms, keep the mapping table on your side, and respect Uzbekistan's data localization rules.
---
## The short answer

Anonymization means replacing or removing anything that identifies a person **before** the text reaches an external AI service. The working pattern: **detect** personal data → **replace** it with labels or pseudonyms → send the request → if needed, **restore** the real values in the response on your own side.

## What counts as personal data

**PII** (personally identifiable information) usually includes:

- full name, date of birth, photo;
- phone number, email, address;
- passport data, PINFL, tax ID;
- card and account numbers;
- health and income details;
- indirect attributes: a job title in a small company, a rare diagnosis, an exact workplace.

Indirect attributes are dangerous because individually they reveal nothing, but together they point to a specific person.

## Step 1. Detection

Use several layers:

- **Regular expressions** — for formatted data: phones, emails, document and card numbers.
- **NER models** (named entity recognition) — for names, addresses, organizations. Quality on Russian and Uzbek text must be tested separately.
- **Dictionaries** — lists of your clients, employees, partners.
- **Structured fields** — if data comes from a CRM, simply do not send unnecessary fields.

```python
import re

PHONE = re.compile(r"\+?998[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")

def mask(text: str) -> str:
    text = PHONE.sub("[PHONE]", text)
    return EMAIL.sub("[EMAIL]", text)
```

## Step 2. Choosing a technique

| Technique | What it does | When it fits |
|---|---|---|
| **Removal** | drops the value entirely | the data is not needed for the task |
| **Masking** | `[PHONE]`, `[NAME]` | AI only needs the data type |
| **Pseudonymization** | "Client_1", "Client_2" | people must be distinguishable in the text |
| **Generalization** | "35" → "30–40" | analytics without exact values |
| **Synthetic data** | realistic fake values | testing and training |

With pseudonymization, the **mapping table** lives only on your server. The AI sees "Client_1", and your system puts the real name back after the response.

## Re-identification risks

A person can be recognized even without a name:

- through a **combination** of attributes: district, age, profession, event date;
- through **free text** where customers mention details about themselves;
- through **unique events** — a rare deal, a well-known incident;
- when pseudonyms are **identical** across requests and can be linked.

Reduce the risk: send the minimum of fields, generalize exact values, rotate pseudonyms between sessions when requests do not need to be linked.

## Requirements in Uzbekistan

Uzbekistan has a **Law "On Personal Data"**. Among other things, it requires personal data of Uzbek citizens processed with information technologies to be stored in databases physically located in the country. Practical takeaways:

- keep the original personal data on servers in Uzbekistan;
- send only anonymized text to external AI services;
- obtain the data subject's consent and record the purposes;
- review the AI provider's contract and data retention policy.

Agree on the exact setup with a lawyer: requirements and their interpretation change.

## Common mistakes

- Relying on regular expressions alone — they miss names and addresses.
- Sending the mapping table to the AI along with the request.
- Writing raw data to logs before masking.
- Never testing anonymization on real samples.

## FAQ

### Is removing the name enough?

No. A phone number, address, document number or a combination of indirect attributes can also identify a person. You need to detect every category of data.

### Can a local model replace anonymization?

A model deployed on your servers in Uzbekistan removes the issue of passing data to a third party, but access rules, logging and consent requirements still apply.

### Does masking hurt the quality of AI answers?

Usually not, as long as the labels are clear and consistent. For most tasks the AI needs the meaning of the text, not real names and numbers.
