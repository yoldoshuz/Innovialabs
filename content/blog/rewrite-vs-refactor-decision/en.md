---
title: "Rewrite or Refactor: When to Rebuild Your Product"
description: Criteria for choosing between incremental refactoring and a full product rewrite, the main risks, and a safe approach to migration.
summary: In most cases incremental refactoring that replaces parts of the system one by one is safer; a full rewrite is justified only when the old foundation blocks the business and cannot be fixed piece by piece.
---

## The short answer

Default to **refactoring** — improving code step by step without changing what the product does. You keep shipping features, and the risk is spread across many small steps.

A **full rewrite** is justified less often than teams believe. It makes sense when the current platform fundamentally cannot meet business requirements and fixing it in parts would cost more than building anew. Even then, rewrite module by module rather than "everything at once".

## Why rewriting is tempting more often than it is needed

Old code always looks worse than it is. Over the years it has accumulated **fixes for real problems**: rare edge cases, integrations, quirks of customer behavior. A rewrite easily loses that knowledge — and you rediscover it later through production bugs.

Another trap is the **moving target**. While the new version is being built, the old one keeps changing, and the new one has to catch up. The project drags on, and the business goes months without new features.

## Decision criteria

| Signal | Leans refactor | Leans rewrite |
|---|---|---|
| Architecture | Awkward but allows growth | Blocks key requirements: scale, security, integrations |
| Technology | Dated but supported | Platform or language unsupported, no specialists available |
| System knowledge | The team understands how it works | Nobody knows how the code works, no documentation |
| Tests | Exist or can be added | Cannot be added without restructuring |
| Business model | The product solves the same problem | The product has changed fundamentally |
| Resources | Features must keep shipping | A team and time can be dedicated to the transition |

If most signals sit in the left column, refactor. If the right column clearly dominates, consider a rewrite — but a staged one.

## When refactoring stops working

- Every change breaks something somewhere unexpected, and tests do not fix that.
- You cannot upgrade the framework or dependencies without rewriting most of the code.
- Performance is limited by the architecture, not by individual slow spots.
- Security or regulatory requirements cannot be met on the current foundation.

## Migration approach: replace in parts

The most reliable approach is the **Strangler Fig** pattern: the new system grows around the old one and takes over its functions one at a time.

1. **Lock in current behavior.** Write tests for key scenarios, especially money, orders and access rights.
2. **Add a routing point.** An API gateway or proxy decides which requests the old system handles and which go to the new one.
3. **Pick the first module.** Ideally one that is well isolated and still delivers noticeable value.
4. **Move and compare.** Run the new implementation in parallel, compare results, shift traffic gradually.
5. **Switch off the old part.** Delete the old module's code once the new one is stable. Otherwise you will maintain two systems.
6. **Repeat** for the next modules.

Pay special attention to **data migrations**. Rehearse them in advance on a copy of production data, verify integrity and have a rollback plan.

## The main risks

- **Losing hidden logic** — mitigated by tests and by talking to people who know the system.
- **Frozen development** — the business cannot wait for months; plan so new features keep shipping.
- **Two systems forever** — migrations stall on the last, hardest modules. You need a clear decommissioning plan.
- **Repeating the same mistakes** — if you do not understand why the old code degraded, the new code will follow the same path.

## FAQ

### How long does a product rewrite take?

It depends on the amount of functionality, documentation quality, number of integrations and the data involved. An honest estimate is only possible after a code audit and a feature inventory. A staged migration has the advantage that first results arrive long before the end.

### Can refactoring be combined with new features?

Yes, and that is the recommended approach. Improve code in the areas a new task already touches — debt goes down without separate "technical" sprints.

### Who should decide on a rewrite?

Technical leadership and the business together. Engineers assess code health and risks; the business weighs the cost of delayed features and the product's strategic goals.
