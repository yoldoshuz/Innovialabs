---
title: Privacy Policy and Cookie Consent: What Your Website Needs
description: What a privacy policy must contain, when you need a cookie banner, how to collect consent in forms and for analytics, and how to avoid dark patterns.
summary: A site that collects data through forms or runs analytics needs a privacy policy that describes real processing and user consent wherever the law requires it. Consent must be voluntary: refusing is as easy as accepting, and optional scripts stay off until the visitor chooses.
---

## The short answer

If your site has even one form or an analytics counter, you process personal data and you need:

- a **privacy policy** — a public document explaining what data you collect and what you do with it;
- **consent** — wherever processing relies on it: newsletters, marketing and analytics cookies and, under some laws such as Russia's 152-FZ, the form submission itself.

Which rules apply depends on where your users are: GDPR and cookie rules in the EU, 152-FZ in Russia, the Law on Personal Data in Uzbekistan. The core principles are similar.

## What a privacy policy must contain

A good policy answers simple questions in plain language:

1. **Who you are**: company name, contacts and who to write to about data.
2. **What data** you collect: from forms, at sign-up and automatically (IP address, cookies, device data).
3. **Why**: handling enquiries, fulfilling contracts, newsletters, analytics, security.
4. **On what basis**: consent, contract, legitimate interest, legal obligation.
5. **Who receives it**: hosting, CRM, email service, analytics, payment providers.
6. **Where it is stored** and whether it is transferred abroad.
7. **How long** it is kept — a specific period or the rule used to set it.
8. **User rights** and how to exercise them: access, correction, deletion, withdrawing consent.
9. **Cookies**: which ones you use and how to manage choices.
10. **Last updated** date.

The main rule: the policy describes what actually happens. If you add a new analytics tool or switch CRMs, update the document.

## When you need a cookie banner

Cookies and similar technologies (localStorage, pixels) fall into two groups:

| Type | Examples | Consent required (EU rules) |
|---|---|---|
| **Strictly necessary** | Session, cart, CSRF protection, remembering the cookie choice | No |
| **Optional** | Analytics, session replay, ad pixels, retargeting | Yes, before loading |

If your site uses only strictly necessary cookies, you do not need a consent banner — mentioning them in the policy is enough. If you run analytics or advertising and some visitors are in the EU, consent must be obtained **before** those scripts load. For Russian audiences, analytics data is also treated as personal data, so cookie notices and consent have become standard there too.

## Consent in forms

- A separate **unticked checkbox** next to the submit button.
- A link to the policy and consent text beside it.
- Newsletter consent is a **separate** checkbox, not tied to submitting the enquiry.
- Collect only the fields you need: if a name and phone number are enough for a callback, do not ask for a date of birth.
- Store **proof of consent**: date, time, text version and source. This is your evidence.

## Avoiding dark patterns

A **dark pattern** is an interface that pushes people into agreeing through tricks or pressure. EU regulators explicitly treat consent obtained this way as invalid.

What to avoid:

- a bright "Accept" button while "Reject" is hidden in settings or styled as a faint link;
- toggles switched on by default in settings;
- a banner that cannot be closed without accepting and blocks the content;
- wording such as "By continuing to use this site, you agree";
- withdrawal possible only by emailing support.

How to do it fairly:

- **"Accept all"** and **"Reject all"** buttons of equal size and weight on the first layer;
- a "Customize" link with categories switched off by default;
- a way to change the choice at any time, for example a footer link;
- the choice is remembered, so the banner does not reappear on every page.

## Technical implementation

The key point: optional scripts must not be in the HTML by default. They load only after consent.

```js
function loadAnalytics() {
  const s = document.createElement("script");
  s.src = "https://example-analytics.com/tag.js";
  s.async = true;
  document.head.appendChild(s);
}

const consent = localStorage.getItem("consent-analytics");
if (consent === "granted") loadAnalytics();

document.querySelector("#accept-analytics").addEventListener("click", () => {
  localStorage.setItem("consent-analytics", "granted");
  loadAnalytics();
});
```

After shipping, open the Network tab in developer tools: before clicking "Accept" there should be no requests to analytics or ad services. This is the most common mistake — the banner is there, but the counter already fired on page load.

## FAQ

### Can we use an online generator for our privacy policy?

As a draft, yes, but you then need to match it to reality: list your actual services, retention periods and contact details. A template that does not reflect what your site does offers no protection and can itself become grounds for complaints.

### If we only use Yandex Metrica or Google Analytics, do we need a banner?

If any visitors are in the EU, yes — consent is required before the counter runs. Requirements for Russian and Uzbek audiences are framed differently, but you should still disclose cookies and describe analytics in your policy. The safe option is one banner with a fair choice for everyone.

### Do we need to store user consents?

Yes. You must be able to show that a person consented: when, to which version of the text and through which form. A record in the database alongside the enquiry, plus the policy version at the time, is usually enough.
