---
title: Face Recognition for Business: Use Cases, Accuracy and Law
description: Where face recognition helps a business, such as access control and attendance, how to read error rates and bias, and what biometric data rules apply first.
summary: Face recognition makes sense where people knowingly opt in, such as office entry or shift tracking; before launch, choose an error threshold, test the system on your own staff and collect consent for biometric data.
---
## The short answer

Face recognition works well in **controlled scenarios**: the person knows about the system, looks at the camera and has consented. Think office entry, time tracking or identity checks in an app. Searching for people in a crowd without their knowledge is harder and riskier: more errors and stricter legal requirements.

## Typical use cases

- **Access control** — a turnstile or door opens by face instead of a card. A card can be handed over, a face cannot.
- **Attendance tracking** — employees check in at a terminal, and the data goes to an HR system or accounting software.
- **Identity verification (KYC)** — matching a selfie against a document photo during online sign-up.
- **Service for regular customers** — only with explicit customer consent, otherwise it is more of a risk than an advantage.

## Two modes of operation

| Mode | What it does | Example |
|---|---|---|
| **Verification 1:1** | Confirms a person is who they claim to be | Selfie vs passport photo |
| **Identification 1:N** | Searches for a person in a database of many faces | Cardless turnstile |

Identification is harder: the larger the database, the higher the chance of confusing two similar-looking people.

## How to read accuracy

A system makes two kinds of errors:

- **FMR / FAR (false match)** — it lets in the wrong person.
- **FNMR / FRR (false non-match)** — it fails to recognize the right person.

They are linked by the **threshold**: a stricter threshold lets fewer strangers in but rejects your own people more often. A server room door needs a strict threshold; a shift check-in can be more lenient.

What affects accuracy in practice:

- lighting, camera angle and mounting height;
- masks, glasses, headwear;
- quality of the enrollment photo;
- **anti-spoofing (liveness)** — without it, a printed photo or a phone video can fool the system.

## Model bias

Independent tests, such as NIST's face recognition evaluation program, show that many algorithms perform differently across demographic groups. So:

- do not rely on the vendor's stated accuracy — **test the system on your own people**;
- look at errors per group, not just the average;
- keep a **fallback**: a card, a PIN or a check by security staff.

## The law and biometric data

A face image that can identify a person is **biometric personal data**, and most jurisdictions treat it specially. Uzbekistan has its Law on Personal Data, the EU has GDPR, Russia has Federal Law 152-FZ. The general principles are similar:

- **Consent** — explicit and informed; for employees, document it separately.
- **Purpose and minimization** — collect only what the stated purpose needs.
- **Storage** — where the data lives, who can access it and for how long. Some countries require citizens' data to be stored locally.
- **Alternative** — people must be able to opt out and use another method.
- **Protection** — encryption, access logs, deletion when an employee leaves.

Specific requirements change, so consult a lawyer before launch.

## Pre-launch checklist

1. The goal is defined, and it is clear why it needs faces.
2. The mode (1:1 or 1:N) and error threshold are chosen.
3. Liveness detection is in place.
4. A pilot ran on real employees and errors were counted.
5. Consent forms and a retention policy are in place.
6. A fallback entry method exists.

## FAQ

### Can we just connect face recognition to our existing cameras?

Sometimes, but surveillance cameras are usually mounted high and shoot at an angle, which lowers accuracy. Access and attendance setups usually use dedicated terminals at face height.

### Do we need employee consent if it is our own office?

As a rule, yes: biometrics are a special category of data. How to document consent depends on the country, so check with a lawyer before launch.

### What if the system fails to recognize some employees?

Re-enroll them with good photos, check lighting and camera angle, and adjust the threshold if needed. Always keep a fallback way in.
