---
title: How to Accept Work from Developers Without Missing Problems
description: A software acceptance process for clients: test scenarios, devices, proper bug reports, the sign-off document and the warranty period.
summary: Accept work against pre-agreed scenarios on real devices, log bugs in a tracker using one template, and sign off only after fixes are verified, keeping a warranty period in place.
---

## What proper acceptance looks like

Acceptance is not "see if it looks nice" — it is checking against **pre-agreed criteria**. A working process looks like this:

1. Before development starts, agree on **acceptance criteria** for each feature.
2. Receive the build on a **staging environment**, not on production.
3. Run the **test scenarios** on the required devices.
4. Log bugs in a **tracker** using one template.
5. Verify the fixes and sign the **acceptance document**.
6. Use the **warranty period** for bugs found after launch.

Without agreed criteria, acceptance turns into an argument about taste.

## Test scenarios

A scenario is a user's path from start to finish. Write them in plain language:

- "A new user signs up with a phone number, receives a code, logs into the account."
- "A buyer adds two products, applies a promo code, pays, receives a notification."
- "A manager changes the order status, the customer sees the new status."

Check not only the happy path but also **negative cases**:

- wrong password, empty fields, very long text;
- cancelled payment and a retry;
- losing the connection in the middle of an action;
- double-clicking the submit button;
- different user roles and their permissions.

## Devices and environment

Agree on the device list in advance, based on your audience.

| What to check | Why it matters |
|---|---|
| Popular Android phones, including budget ones | Weak devices reveal speed problems |
| iPhone with a current iOS | Safari behaves differently from Chrome |
| Desktop browsers | Layout on wide screens |
| Slow mobile internet | Loading and network error handling |
| Language versions | Long translations break layouts |

## How to write a bug report

A bad report: "Nothing works." A good one contains:

- **Title**: what broke and where.
- **Steps to reproduce**: numbered actions.
- **Expected result** and **actual result**.
- **Environment**: device, browser, app version, account.
- **Screenshot or screen recording**.
- **Severity**: blocks work, gets in the way, cosmetic.

One bug, one task. Do not mix five different problems in one message.

## The acceptance document

Before signing, make sure:

- all critical and major bugs are **fixed and re-tested**;
- cosmetic issues are either fixed or listed with an agreed deadline;
- **source code, access and documentation**, plus deployment instructions, are handed over;
- the document lists the accepted features or stage, not just "work completed".

A signed acceptance usually means claims about visible defects are no longer accepted. So do not sign it "in advance".

## The warranty period

Put a **warranty** in the contract: for an agreed period the vendor fixes development defects free of charge. Clarify:

- how long the warranty lasts;
- what counts as a warranty case versus a new task;
- response time for warranty requests;
- whether the warranty is void if another team changed the code.

## Common mistakes

- Testing only on your own phone with your admin account.
- Accepting based on screenshots instead of a live staging environment.
- Sending feedback as voice messages.
- Signing before launch so as "not to delay payment".

## FAQ

### How much time should acceptance take?

It depends on the scope. Plan dedicated time for testing and at least one round of fixes, and set the acceptance period in the contract so both sides know the rules.

### Do I need a separate tester on the client side?

On large projects it helps: an independent QA specialist finds what both developers and the business miss. For small projects, well-written scenarios and an attentive product owner are usually enough.

### What if a bug is found after signing?

If it is a hidden defect within the warranty period, file a warranty request using the same bug report template. If it is a new requirement, it is a separate task.
