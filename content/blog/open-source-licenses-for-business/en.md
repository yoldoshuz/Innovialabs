---
title: Open Source Licenses: What Business Owners Must Know
description: How permissive MIT and Apache licenses differ from copyleft GPL and AGPL, and how your library choices affect selling and keeping your product closed.
summary: Permissive licenses (MIT, Apache 2.0) let you use code in a closed commercial product with almost no restrictions. Copyleft licenses (GPL, AGPL) can force you to open your source code, so track them before the product reaches customers or investors.
---

## The one-minute version

Almost every modern product is built from open source libraries. Free code does not mean "no rules": each library has a **license** that defines what you must do if you use it.

Licenses fall into two big camps:

- **Permissive** — MIT, BSD, Apache 2.0. You can use them in a closed commercial product; you only need to keep the copyright notice and license text.
- **Copyleft** — GPL, AGPL, and the weaker LGPL. If you distribute a product containing such code, the derivative work must be distributed under the same terms, meaning with open source code.

For a business this is not theory but cost: an overlooked license can surface during an acquisition, an investor review or a dispute with a client.

## Popular licenses compared

| License | Type | OK in a closed product | Main condition |
|---|---|---|---|
| MIT | Permissive | Yes | Keep the copyright and license text |
| BSD | Permissive | Yes | Same, plus limits on using the authors' names |
| Apache 2.0 | Permissive | Yes | Keep notices, mark changes; includes a patent license |
| LGPL | Weak copyleft | Usually, with dynamic linking | Changes to the library itself must be shared |
| GPL | Strong copyleft | No, if you distribute | Derivative product is distributed under GPL with source |
| AGPL | Strong copyleft | No, even for SaaS | Network users must also get the source |

## The key word is "distribution"

GPL obligations usually apply when you **hand the software to others**: sell a boxed version, ship a mobile app, install software on a client's server.

If the code runs only on your server and users just see a website or service, GPL generally does not require you to publish the source. **AGPL** closes this gap: interacting with the program over a network also triggers the obligation to provide the code.

Practical takeaway:

- for a **mobile or desktop app**, a GPL dependency is a serious risk;
- for **SaaS**, AGPL is the bigger danger;
- for a **library or SDK** you sell to developers, both matter.

## Impact on sales and investment

Acquisitions and funding rounds often include technical due diligence. It checks whether the code contains components whose licenses conflict with a closed commercial model. A finding can mean rewriting a module, replacing a library or a lower valuation.

A separate risk is **dual licensing**. Some products are free under AGPL and paid under a commercial license. You cannot use them for free in a closed product, and the paid license becomes a recurring cost.

Also note that a copyright holder can **change the license** in new versions. Old versions keep the previous license, but updates may come with different terms.

## Owner's checklist

1. **Specify allowed licenses in the contractor agreement** and require a dependency list at handover.
2. **Keep a dependency inventory** (SBOM). License scanning tools can generate it automatically.
3. **Check the license before adoption**, not before a sale.
4. **Preserve notices**: LICENSE and NOTICE files, a "Licenses" section in the app.
5. **Decide early** whether you plan to open your code. If not, avoid GPL and AGPL in distributed parts.
6. **In unclear cases**, consult an intellectual property lawyer.

## Common mistakes

- **"It's on GitHub, so it's fine."** Code without a license is protected by copyright by default and cannot be used without permission.
- **Checking only direct dependencies.** Transitive libraries carry their own licenses too.
- **Confusing free of charge with free to use.** A free download is not the right to embed code in a commercial product.

This article is a general overview, not legal advice.

## FAQ

### Can I sell a product built on MIT libraries?

Yes. MIT allows commercial use and closed source. You only need to include the copyright and license text with your product.

### What if a GPL library turns up in my mobile app?

By distributing the app, you must provide the source under GPL terms. The usual fixes are replacing the library, rewriting the module or buying a commercial license if the author offers one.

### Why might Apache 2.0 be better than MIT for a business?

Both are permissive. Apache 2.0 also includes an explicit patent license from contributors, which lowers patent risk, but it requires more care in keeping notices and marking changes.
