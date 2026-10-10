---
title: Risk Management in IT Projects: A Checklist for Clients
description: Typical IT project risks around people, scope, technology, integrations and deadlines, plus a simple risk register with mitigation actions for clients.
summary: List risks in five groups (people, scope, tech, integrations, deadlines), rate each by likelihood and impact, assign an owner and an action, and review the list at every project meeting.
---

## The essentials

Risk management is not a thick document. It is a **short list of what could go wrong**, with a clear answer to "what are we doing so it does not happen". As a client you do not need to read code: it is enough to know the typical risks, keep a simple register and update it regularly with the team.

## Five groups of risks

### People

- A key developer leaves, and the knowledge leaves too.
- Nobody on the client side can make decisions quickly.
- The team is overloaded with parallel projects.

**Mitigation:** documentation and code review so knowledge does not live in one head; one business owner with the authority to decide.

### Scope

- Requirements keep changing and the project keeps growing.
- Different people understand the task differently.

**Mitigation:** fix the scope of the first version, put new ideas into a backlog and estimate every change separately.

### Technology

- The chosen stack is unfamiliar to the team.
- Load, security or backups were not thought through.

**Mitigation:** a small technical prototype for risky parts, and an architecture review before the main development starts.

### Integrations

- An external service (payment provider, 1C, CRM, government API) behaves differently from its documentation.
- Access to a partner's test environment arrives late.

**Mitigation:** request access in the first week and build integrations early instead of leaving them for the end.

### Deadlines

- The estimate is a single number with no buffer.
- Testing and bug fixing are not in the plan.

**Mitigation:** ask for estimates as ranges, reserve time for testing, split the project into stages with demos.

## A simple risk register

A plain table is enough. Rate likelihood and impact as low / medium / high.

| Risk | Likelihood | Impact | Action | Owner |
|---|---|---|---|---|
| Late access to the bank API | Medium | High | Request access in week one | Client manager |
| Lead developer leaves | Low | High | Documentation, code review | Tech lead |
| Scope growth | High | Medium | Backlog and estimate per change | Product owner |

Start with the **high-impact** risks: those are the ones that can stop a project.

## Client checklist

- One person is assigned to make project decisions.
- The scope of the first version is written down and agreed.
- Access to all external services has been requested.
- The code lives in your own repository.
- There are regular demos of working software, not just reports.
- The risk register is reviewed at least every couple of weeks.
- There is a plan for a missed key deadline.

## Common mistakes

- Writing the register once and never opening it again.
- Listing risks without a concrete action and owner.
- Treating risks as the vendor's problem only.

## FAQ

### Who should keep the risk register, the client or the vendor?

Usually the vendor's project manager maintains it, but the client takes part: many risks such as decisions, access and requirements sit on the client side.

### How often should risks be reviewed?

Regular project meetings are a convenient moment. More importantly, update the list whenever something significant changes: new requirements, people leaving or a shifted deadline.

### Does a small project need a risk register?

Yes, in a lightweight form: five to ten rows in a table. Even that helps you spot a problem early instead of discovering it on launch day.
