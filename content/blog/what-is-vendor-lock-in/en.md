---
title: What Is Vendor Lock-In and How to Avoid It
description: How dependence on one contractor or platform forms through closed code, data and someone else's accounts, and which simple steps protect your product early.
summary: Vendor lock-in is when leaving a contractor or platform becomes too costly or impossible because you do not control the code, data or access. The fix is simple: accounts in your name, code in your repository, data in open formats and documentation.
---

## The short answer: what vendor lock-in is

**Vendor lock-in** is a situation where switching a contractor, service or platform is so expensive that you effectively cannot do it. You keep working with the current supplier not because it is the best option, but because leaving is too hard.

Dependence in itself is normal: every business relies on external services. The problem starts when **you do not control key assets** — code, data and access.

## How dependence forms

### On a contractor

- **The code is not yours.** The repository lives on the contractor's account, source code is never handed over, and you only have a working website or app.
- **Accounts in someone else's name.** Domain, hosting, cloud, App Store, Google Play and payment systems are registered to the contractor.
- **Closed development.** The product is built on the contractor's in-house framework or builder that nobody else knows how to use.
- **No documentation.** Architecture, server settings and integrations exist only in one developer's head.
- **A contract without rights.** It does not say who owns the exclusive rights to the code.

### On a platform

- **Locked data.** The service does not let you export all your data or exports it in an awkward format.
- **Proprietary features.** Logic depends on specific capabilities of one cloud or SaaS that have no equivalent elsewhere.
- **Switching costs.** Moving large volumes of data, retraining staff and rebuilding integrations.

## Signs you are already locked in

- You cannot log in to your own hosting or cloud console.
- Every small change has to go through one specific person.
- You do not know where the source code is or how to build it.
- The contractor raises prices and you cannot compare with the market because nobody else will take the project.

## How to protect yourself: a checklist

| Asset | What to do |
|---|---|
| **Domain and DNS** | register to the company, owner has access |
| **Hosting and cloud** | your account and payment method, contractor gets separate access |
| **Code** | repository in your organisation on GitHub, GitLab or similar |
| **App stores and payments** | developer and merchant accounts in your company's name |
| **Data** | regular backups and a tested export in open formats |
| **Documentation** | README, architecture diagram, deployment guide |
| **Contract** | transfer of exclusive rights and a handover procedure |

Choosing **widely used technologies** also helps. If the product is built on a popular stack, finding another team is much easier than for a rare or custom-built solution.

## How to work with cloud platforms

Avoiding cloud-specific services entirely is not always wise: they save time. A simpler approach is to **choose deliberately** where dependence is acceptable:

1. Keep business logic in your own code, not in the settings of a closed service.
2. Use standards where it is cheap: containers, SQL databases, open protocols.
3. Before adopting a service, check how to export your data from it.
4. Keep a list of the components that would be hardest to replace and review it.

## Common mistakes

- **"The contractor will register everything"** — convenient at the start, expensive when you part ways.
- **Trust instead of a contract**: a good relationship does not replace a clause on code ownership.
- **Backups nobody has tested**: a copy you cannot restore from offers no protection.
- **Rejecting all dependence**: custom-built replacements for proven services just create dependence on your own developers.

## FAQ

### Does vendor lock-in mean the contractor is acting in bad faith?

Not necessarily. Lock-in often comes from convenience: it is faster for the contractor to open accounts in their own name. That is why ownership is worth discussing at the very start, calmly and in writing.

### What should I do if I am already locked in?

Start with an inventory: which domains, accounts, repositories and data exist and who has access. Then, by agreement, move them to the company and request documentation while the cooperation is still ongoing.

### Should the product be designed to move to any cloud?

Usually not: it makes development more complex and expensive. It is enough to know which parts are tied to the platform and to be able to export your data.
