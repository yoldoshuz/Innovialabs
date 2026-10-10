---
title: ERP Implementation Roadmap: Stages, Risks and Success Factors
description: ERP implementation step by step: process audit, system selection, design, data migration, pilot, go-live and support, with the typical risks of each phase.
summary: An ERP project succeeds when it starts with a process audit, chooses the system against documented requirements, migrates cleaned data, proves itself in a pilot and goes live with a rollback plan and committed support.
---
## The short answer

An ERP implementation is a business change project with software inside it, not a software installation. The typical sequence:

1. Process audit and goals
2. System selection
3. Solution design
4. Configuration and development
5. Data migration
6. Testing and pilot
7. Go-live
8. Support and improvement

Skipping or compressing the early phases is the most common reason the late ones fail.

## Phase 1. Process audit and goals

Describe how the company actually works today: order to cash, purchase to pay, warehouse, production, finance. Then define what must change and how you will measure it.

- **Output**: as-is process maps, pain points, a prioritized list of requirements, measurable goals.
- **Risks**: automating a broken process as it is; goals like "everything in one system" that cannot be verified; key people not involved.

## Phase 2. System selection

Compare candidates against your requirements, not against feature brochures. Ask vendors to demonstrate your real scenarios on your sample data.

- Check **local fit**: tax and accounting rules, reporting formats, currency, language, integration with banks and fiscal services.
- Check **integration options**: API, existing connectors to your site, marketplaces and CRM.
- Check **total cost of ownership**: licenses, hosting, implementation, customization, support, and future updates.
- **Risks**: choosing by price or brand alone; underestimating how much customization will be needed; a partner without experience in your industry.

## Phase 3. Solution design

Translate requirements into a to-be design: processes, reference data, roles, documents, reports, integrations.

- Decide for every gap: **change the process, configure or develop**. Prefer the first two.
- Fix the **scope in writing** and agree how changes will be approved.
- **Risks**: scope creep; heavy customization that makes updates painful; a design approved by IT without the departments that will use it.

## Phase 4. Configuration and development

Build in short iterations and show results to key users regularly, not once at the end.

- **Risks**: a "black box" period of months; undocumented settings; integrations left for last.

## Phase 5. Data migration

Usually underestimated. Plan it as a separate workstream.

- **Clean before you move**: duplicates in customers and items, inconsistent units, obsolete records.
- **Decide what to migrate**: reference data and opening balances are mandatory; full transaction history often stays in the old system for read-only access.
- **Run several trial migrations** and reconcile totals: stock quantities, receivables, payables.
- **Risks**: dirty item master data; balances that do not match accounting; one-shot migration on go-live night.

## Phase 6. Testing and pilot

- **Functional tests** for each process and integration.
- **End-to-end scenarios**: order, payment, shipment, return, closing the period.
- **User acceptance** by the people who will work in the system.
- **Pilot**: one warehouse, branch or business line first, with the old process available as a fallback.
- **Risks**: testing only on clean demo data; skipping load tests; users seeing the system for the first time at go-live.

## Phase 7. Go-live

- Choose a **quiet period**, not peak season or the end of a reporting period.
- Prepare a **cutover plan**: freeze dates, final migration, balance checks, who does what hour by hour.
- Define **rollback criteria** in advance.
- Have **on-site support** for the first days.
- **Risks**: big-bang launch across the whole company; no rollback plan; training done weeks earlier and forgotten.

## Phase 8. Support and improvement

After launch come the questions, small fixes and the deferred wishes.

- Agree on a **support model**: internal key users, a partner, response times.
- Track the **goals from phase 1** and compare.
- Plan **updates** of the platform, especially if you customized it.
- **Risks**: the project team disbands immediately; users return to spreadsheets.

## Success factors

- **A sponsor from top management** who resolves conflicts between departments.
- **Key users** from each department with time allocated to the project.
- **Standard functionality first**, customization only where it brings clear value.
- **Training** close to go-live, on real scenarios.
- **Phased rollout** instead of everything at once.

## FAQ

### How long does an ERP implementation take?

It depends on the number of processes and integrations, the amount of customization, the quality of your data and how much time key users can give. Ask a partner for an estimate per phase based on your audit, not a single number up front.

### Should we adapt processes to the ERP or the ERP to our processes?

Where your process is a standard practice, adapt to the system. Customize only where the process is a real competitive advantage or a legal requirement.

### Can we keep 1C or an old system alongside the new ERP?

Yes, temporarily or for specific functions such as accounting, but then integration between the systems becomes part of the project and needs its own design and testing.
