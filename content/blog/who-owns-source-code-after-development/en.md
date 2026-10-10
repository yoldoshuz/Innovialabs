---
title: Who Owns the Source Code After Software Development
description: Who owns code by default, how an assignment differs from a license, and what your contract must state so the development result fully belongs to you.
summary: The client owns the code only when the contract says so explicitly: an assignment of rights, a defined scope of deliverables and a handover procedure. Default rules differ by country, so relying on them is risky.
---

## The short answer: the contract decides

Paying for development **does not automatically make you the owner of the code**. Rights to software are intellectual property, and who holds them is determined by the law of the country and the contract between the parties.

Default rules vary by jurisdiction: in some, rights to commissioned software pass to the client unless agreed otherwise; in others, they stay with the author or the contractor. The only reliable footing is **clear contract wording**. For a specific situation, consult a lawyer who knows the local law.

## Three parties and their rights

- **The individual developer** is the author. They usually keep certain personal (moral) rights, such as the right to be named as author, which cannot be transferred.
- **The contractor company** usually holds rights to code its employees write as part of their job, provided this is covered in employment contracts.
- **The client** gets only the rights the contractor actually transfers.

That leads to a key check: **the contractor must hold rights to everything** it hands over, including work by freelancers and subcontractors. It cannot transfer what it does not own.

## Assignment vs license

| | Assignment of rights | License |
|---|---|---|
| Owner after the deal | Client | Contractor |
| Can the contractor sell the same code to others | No | Yes, if the license is non-exclusive |
| Can you modify and extend the code | Yes, freely | Within license terms |
| Can you switch contractors | Yes | Depends on terms |

With an **assignment**, you become the rights holder. With a **license**, you are allowed to use the software under certain terms and the owner stays the same. A license is not always bad: it fits standard solutions and ready-made platforms. But if the product is the core of your business, you usually want a full assignment.

## What the contract must state

1. **A direct clause assigning exclusive rights** in the result to the client, not "granting a right to use" but an actual transfer.
2. **When rights pass**: on signing the acceptance act, on payment of a milestone or on full payment.
3. **What the result includes**: source code, the database and its schema, design files, documentation, build and deployment scripts.
4. **Permitted uses**: modification, distribution, adaptation, use without territorial or time limits, to the extent applicable law allows.
5. **A warranty from the contractor** that it holds rights to everything delivered and does not infringe third-party rights.
6. **A handover procedure**: repository access and transfer of accounts, domains, servers and keys.

## What usually does not transfer

- **Open-source libraries.** They remain under their own licenses. A contract cannot assign them, but the contractor must follow their terms and ideally list the components used.
- **The contractor's pre-existing work**: in-house frameworks, modules, tools. These are often covered by a non-exclusive perpetual license. That is fine as long as it is written down and does not restrict you.
- **Third-party paid services.** Their licenses are arranged separately, preferably in the client's name.

## Practical checklist

- The repository lives **in your company's account**, and the contractor works there as an invited member.
- Domains, hosting, app store and payment accounts are **registered to you**.
- Each milestone ends with a **signed act listing the delivered results**.
- Documentation is good enough for another team to continue the work.

## Common mistakes

- The contract mentions only "website development" and nothing about rights.
- The code sits in a developer's personal account.
- A license instead of an assignment, discovered only when changing contractors.
- No handover of infrastructure access, so the product cannot even be updated without the contractor.

## FAQ

### If I paid for development, is the code already mine?

Not necessarily. Payment settles the work, while ownership depends on the contract and applicable law. To avoid disputes later, state the assignment of exclusive rights explicitly.

### Can the contractor reuse my code in other projects?

With a full assignment, no, except for its agreed pre-existing work and open-source components. With a license, it depends on the license terms.

### What if the rights were never documented?

You can sign a supplementary agreement assigning rights to the result already created. The earlier you do it, the easier it is to agree.
