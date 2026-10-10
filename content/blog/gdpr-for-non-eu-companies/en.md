---
title: GDPR Explained for Companies Outside the EU
description: When GDPR applies to a business outside the EU, which lawful bases you need, what rights users have, the 72-hour breach rule and a minimum site checklist.
summary: GDPR applies to a non-EU company when it offers goods or services to people in the EU or monitors their behaviour. You then need a lawful basis for each processing activity, a clear privacy policy, a way to handle user requests and a plan to report breaches within 72 hours.
---

## Does GDPR apply to your company

**GDPR** (General Data Protection Regulation) is the EU law on personal data. It follows the data subjects, not the company's address. Article 3 extends it to businesses outside the EU in two situations:

- **you offer goods or services to people in the EU** — paid or free. Signals include a site in an EU language, prices in euros, shipping to the EU or ads aimed at European audiences;
- **you monitor the behaviour of people in the EU** — analytics, profiling, retargeting, user tracking.

The mere fact that your site loads in Germany does not bring you under GDPR. An English-language SaaS that charges in euros and advertises in Europe clearly does.

There is also a third case: you **process data on behalf of** a European client, for example by building and maintaining their CRM. You are then a **processor**, the client is the **controller**, and you need a data processing agreement (DPA) between you.

## Lawful bases: what each activity rests on

Every processing activity needs one of the six bases in Article 6:

| Basis | Typical example |
|---|---|
| **Consent** | Newsletters, marketing cookies |
| **Contract** | Delivery address for an order |
| **Legal obligation** | Keeping records for accounting |
| **Vital interests** | Medical emergencies |
| **Public task** | Work of public authorities |
| **Legitimate interests** | Fraud prevention, basic security logging |

A common mistake is trying to cover everything with consent. Consent can be withdrawn at any time, so for data you genuinely need to deliver the service, contract is usually the more honest basis. Where you do rely on consent, it must be **freely given, specific and active** — no pre-ticked boxes.

## User rights

People in the EU can ask you to:

- give **access** to the data you hold about them;
- **rectify** inaccurate data;
- **erase** it ("right to be forgotten") when there is no reason to keep it;
- **restrict** processing;
- provide **portability** — an export in a machine-readable format;
- **object** to processing, especially for marketing;
- not be subject to decisions based **solely on automated processing** that significantly affect them.

You must respond within **one month**, extendable for complex requests if you tell the person. In practice this means having an email address or form for requests and knowing every system where a person's data lives: database, CRM, mailing tool, logs and backups.

## Data breaches: the 72-hour rule

A **personal data breach** can be a hack, a spreadsheet sent to the wrong recipient or a lost unencrypted laptop. If it poses a risk to people, the controller must notify the supervisory authority **within 72 hours** of becoming aware of it. If the risk is high, the affected individuals must be told as well.

A processor must inform its controller without undue delay. Record every incident in an internal log, including those that do not require notification.

## Minimum checklist for a site with European users

1. **Data map**: what you collect, why, where it is stored, who receives it and how long you keep it.
2. **Privacy policy** in plain language, listing lawful bases and user rights.
3. **Cookie banner** with a real choice: analytics and ads load only after consent.
4. **Forms** collect only the fields you need; newsletter consent is a separate unticked checkbox.
5. **HTTPS**, access control, encrypted backups and two-factor authentication for the admin panel.
6. **DPAs** with vendors: hosting, email services, CRM, analytics.
7. **International transfers**: if data goes to a country without an EU adequacy decision, use mechanisms such as Standard Contractual Clauses (SCCs).
8. **EU representative** (Article 27) — required for most non-EU companies under GDPR; the exemption covers only occasional, low-risk processing.
9. **Procedures** for handling user requests and responding to incidents.

GDPR fines can reach EUR 20 million or 4% of worldwide annual turnover, whichever is higher. For a small company the more immediate risk is commercial: European clients and partners simply will not work with a vendor who cannot show basic data hygiene.

The full regulation text is available on [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj).

## FAQ

### Do we need a DPO (Data Protection Officer)?

Not always. A DPO is mandatory when your core activities involve large-scale systematic monitoring of people or large-scale processing of sensitive data such as health or biometrics. A typical website or online store usually does not need one, but naming an internal owner for data protection is still a good idea.

### Can we just copy a privacy policy from another website?

No. The policy must describe your actual processes: which data, which services and which retention periods. Someone else's text will almost certainly not match reality, and a mismatch between your policy and what you really do is itself a violation.

### We only have a few EU clients. Does GDPR still apply?

Volume is not the main test. If you deliberately offer services to people in the EU or monitor their behaviour, GDPR applies to that processing. Scale affects which measures are mandatory, such as appointing a DPO, but not whether the regulation applies.
