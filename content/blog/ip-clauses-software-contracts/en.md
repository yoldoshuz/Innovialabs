---
title: Intellectual Property Clauses in Software Development Contracts
description: How to handle code ownership in a contractor agreement: assignment of rights, pre-existing code, third-party components, license back and jurisdiction.
summary: The contract must state which rights in the created code pass to the client and when, what the contractor keeps as pre-existing code, how open-source components are handled and which law governs disputes.
---

## The short answer

Paying for the work does not always mean you own the code. Ownership is defined by the contract, so it must state explicitly: **what is transferred, to what extent and from when**, what the contractor keeps, how third-party components are used and which law governs disputes. The key clauses are below. Have the final text reviewed by a lawyer who knows the applicable law.

## Assignment of rights

There are two main options:

- **Assignment** — exclusive rights in the result pass fully to the client. The contractor can no longer use that code.
- **License** — the client gets the right to use the code while ownership stays with the contractor. A license can be exclusive or non-exclusive and limited by term, territory and permitted uses.

What to specify:

- **When rights transfer** — on signing the acceptance certificate, on full payment, or per milestone.
- **Scope** — source code, design, documentation, databases, copy.
- **Permitted uses** — modification, distribution, sale, sublicensing.
- **Source code delivery** — in what form and where (the client's repository).

## Pre-existing code

Studios and freelancers have their own libraries, templates and internal tools that they reuse across projects. They usually cannot or will not hand these over entirely.

Standard practice:

- the contractor lists such components in an appendix to the contract;
- the contractor keeps ownership of them;
- the client receives a **perpetual non-exclusive license** to use them as part of the product.

Without this clause you may end up unable to move the product to another team or sell the company without the former contractor's consent.

## Third-party and open-source components

Almost every project uses open-source libraries. Their licenses differ:

| License type | Examples | What to consider |
|---|---|---|
| Permissive | MIT, Apache 2.0, BSD | Usually requires keeping copyright notices |
| Copyleft | GPL, AGPL | May require releasing your code on distribution or network use |
| Commercial | Paid SDKs, fonts, themes | Requires a purchased license, often in the client's name |

It helps to require in the contract that the contractor keeps a list of components used and does not introduce copyleft or paid components without approval.

## License back

Sometimes the contractor wants to keep the right to reuse generic work from your project or show it in a portfolio. This can be allowed, with limits:

- excluding your business logic, data and unique algorithms;
- portfolio use only with your consent or within an agreed scope;
- subject to the confidentiality agreement.

## Jurisdiction and governing law

If the parties are in different countries, specify:

- **governing law** — which country's laws govern the contract;
- **dispute resolution** — the courts of a specific country or arbitration;
- that the form of the rights transfer meets the requirements of your own legal system so that it is recognized there.

## Common mistakes

- A contract with not a single word about intellectual property.
- Rights pass "on project completion", but the project is never formally completed.
- No rights transfer documents from the contractor's own employees and subcontractors.
- The repository and accounts are registered to the contractor.

## FAQ

### If I paid, is the code automatically mine?

Not necessarily. In many legal systems rights stay with the author unless the contract expressly transfers them. That is why this clause must be explicit.

### Can the contractor reuse my code in other projects?

Only if the contract allows it. Reuse of generic components is usually permitted, but not of your business logic and data.

### What if the rights were never formalized?

Sign a supplementary rights assignment agreement with the contractor and, if needed, with each author. The sooner, the easier.
