---
title: Make (Integromat) Scenarios: Routers, Iterators and Filters
description: How Make scenarios work: modules and operations, branching with routers, handling arrays with iterators and aggregators, error handlers and scheduling.
summary: A Make scenario is a chain of modules that data bundles flow through: routers split the flow into branches, filters decide which bundles pass, iterators break an array into separate bundles and aggregators combine them back.
---
## How a Make scenario works

A **scenario** in Make (formerly Integromat) is a visual chain of **modules**. Each module is one action in some app: fetch emails, create a row, send a message.

Data moves between modules in **bundles**. If the trigger finds five new orders, it outputs five bundles, and every following module runs five times — once per bundle.

The key billing concept is the **operation**: one run of one module. Five bundles through three modules is roughly fifteen operations. Current Make pricing may express usage in credits, but the logic is the same: more bundles and more modules mean more usage.

## Filters: let only the right data through

A **filter** sits on the link between two modules. A bundle continues only if the condition holds: order total above zero, email not empty, status equals "paid".

- Filters can combine conditions with **AND** and **OR**.
- Put filters **as early as possible** so you do not spend operations on bundles you will discard anyway.

## Router: several branches

A **Router** splits the flow into several routes. Each bundle is checked against each route's filter.

Example — handling incoming leads:

- Route 1: source is "website" → create a deal in the CRM.
- Route 2: source is "Telegram" → post to the sales chat.
- Route 3 (**fallback route**): everything else → log to a sheet for manual review.

Important: if a bundle matches several routes, it goes down **all matching routes**. Make conditions mutually exclusive when branches must not overlap, and use the fallback route for "everything else".

## Iterator and aggregator: working with arrays

Modules often return an **array**: items in an order, email attachments, rows from an API response.

- An **Iterator** turns an array into separate bundles. An order with three items becomes three bundles, and the next module runs once per item.
- An **Aggregator** combines bundles back into one. Types include:
  - **Array aggregator** — into an array (for example, to send a list in a single request);
  - **Text aggregator** — into one text string (for example, an item list for a message);
  - **Numeric aggregator** — into a number: sum, average, count.

Every aggregator has a **Source module** setting — where aggregation starts. Usually it is the iterator or trigger that produced the bundles. Pick the wrong module and you get several output bundles instead of one.

The typical pattern: **trigger → iterator → process each item → aggregator → one final action**.

## Error handling

By default an error in a module stops the run, and repeated errors can lead Make to deactivate the scenario. To control this, attach an **error handler** to the module:

| Handler | What it does |
|---|---|
| Ignore | Skips the error, the scenario keeps going |
| Resume | Substitutes a fallback value and continues |
| Break | Stores the incomplete execution for a retry |
| Commit | Stops the run and keeps what was already done |
| Rollback | Stops and tries to revert changes where supported |

For external APIs that occasionally fail, **Break** with automatic retries works well. Use **Ignore** carefully: errors simply vanish from view.

## Scheduling

A scenario can start in one of these ways:

- **On a schedule**: at an interval, once a day, on specific days of the week or month.
- **Instantly**: via a webhook or instant trigger — the scenario runs when the app pushes data to it.
- **On demand** — for one-off jobs and tests.

Remember that scheduled checks also use operations even when there is no new data. A very short interval for rare events is a common cause of overspending.

## FAQ

### How is Make different from Zapier?

Make gives you more control over logic: visual branches, array handling and flexible error handling. Zapier is simpler for linear workflows. The choice depends on how complex the logic is and who will maintain the automations.

### Why did my scenario use more operations than expected?

Usually because of bundle count: an iterator multiplies the runs of every module after it, and frequent scheduled runs spend operations on empty checks. Open the execution history to see how many times each module ran.

### Do I need an aggregator after every iterator?

No. You only need one when you want a single combined result after processing items — for example, one message with a list instead of a separate message per item.
