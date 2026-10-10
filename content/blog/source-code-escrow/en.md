---
title: Source Code Escrow: How It Protects Software Buyers
description: How source code escrow works: the parties, release triggers, deposit verification and the situations where an escrow agreement is worth paying for.
summary: Source code escrow is an agreement where code is held by an independent agent and released to the buyer if the vendor stops meeting its obligations. It is useful for critical software, but only when the deposit is verified regularly.
---

## What source code escrow is

**Source code escrow** is a three-party agreement between the developer (licensor), the buyer (licensee) and an independent **escrow agent**. The developer hands the agent the source code, documentation and build instructions. The buyer does not see the code until a predefined event occurs — a **release trigger**. The agent then releases the deposit so the buyer can maintain the system on their own.

Escrow solves a specific problem: you licensed software your business depends on, but the code belongs to the vendor. If the vendor disappears, you cannot fix a bug or migrate the system without the code.

## How the agreement works

A typical flow:

1. The parties sign an agreement with the agent and define what the deposit contains.
2. The developer uploads the first deposit and updates it on a schedule, for example after every release.
3. The agent stores the materials and verifies them when required.
4. When a trigger occurs, the buyer files a release request; the developer can dispute it within a set period.
5. If there is no dispute, or it is resolved in the buyer's favour, the agent releases the deposit.

Released code can usually be used **only to support and maintain** the licensed system, not to resell it. The agreement spells this out.

## Common release triggers

- **Bankruptcy or liquidation** of the developer.
- **End of support** for the product or abandoning SLA obligations.
- **Material breach** of the support agreement not cured within an agreed period.
- **Change of ownership** after which the product is no longer developed.

Triggers must be verifiable. "The vendor performs poorly" invites disputes. "A critical defect is not fixed within N days of notice" is clear.

## Verification is the part that matters

The most common escrow failure is an unusable deposit: outdated code, missing dependencies, no build instructions. The agreement should therefore include **verification**:

| Verification level | What is checked |
|---|---|
| Basic | Files are readable, intact and inventoried |
| Completeness | All code, build scripts, DB schemas and docs are present |
| Build | The agent or an expert builds the project from the instructions |
| Functional | The built system runs and behaves like production |

Deeper verification costs more, but only a successful build and run actually prove the deposit is usable.

## What to put in the deposit

- source code for every component, including internal libraries;
- build and deployment scripts, CI/CD configuration;
- a list of third-party dependencies and their versions;
- database schemas and migrations;
- instructions for deploying from scratch;
- key architecture documentation.

Production secrets and passwords do not go into the deposit; describe how to regenerate them instead.

## When escrow is worth it and when it is not

**Worth it** when:

- the system is critical to operations and downtime is expensive;
- the vendor is small or young;
- replacing the system would take a long time;
- you do not own the code under the contract.

**Not needed** when:

- the code is transferred to you anyway (for example, custom development with assignment of rights);
- the product is easy to replace;
- it is SaaS, where code without infrastructure and data offers little — data export rights and a continuity plan matter more.

## Common mistakes

- Signing the agreement and never updating the deposit.
- Skipping build verification.
- Vague release triggers that are easy to dispute.
- Forgetting that you will need people capable of maintaining the code.

## FAQ

### How is escrow different from owning the code?

When rights are assigned, the code is yours from day one. With escrow, the code stays with the developer and you receive it only when agreed events occur, with limited usage rights.

### Does escrow work for SaaS?

Partly. For SaaS it is better to combine a code deposit with regular exports of your data and an infrastructure description; otherwise restoring the service yourself will be hard.

### Who pays for escrow?

It is negotiable. The buyer often pays because escrow protects the buyer, but costs can be shared or built into the license price.
