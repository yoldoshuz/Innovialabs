---
title: Dashboard UI Design: Making Complex Data Readable
description: How to design dashboards for admin panels and CRMs: picking key metrics, layout priority, choosing chart types, tables, filters and interface density.
summary: A readable dashboard starts with the question it answers, not with charts: 3–5 key metrics at the top, details below, chart types matched to comparison or trend, and tables and filters for people who need to act.
---

## The short answer: a dashboard answers questions, it does not show everything

A good dashboard tells its user within seconds whether things are fine, where the problem is and what to do next. A screen that simply dumps every available number forces people to find the meaning themselves, and most of the time they do not.

So dashboard work starts with three questions:

- **Who is looking** — an executive, a sales manager, a support operator.
- **How often** — a weekly review or an all-day working tool.
- **What decision** they make after looking.

An executive overview and a CRM operator's workspace are different products, even when they share the same data.

## Define the key metrics

For each role, pick **3–5 metrics** that actually drive decisions. Everything else is a secondary layer that opens on click.

Test every metric:

- Is it clear whether the value is **good or bad**? A number without context is useless. Add a comparison: previous period, target or a normal range.
- Can the user **influence it**? If not, it belongs in a report, not on the main screen.
- Does **everyone define it the same way**? An "active customer" often means different things to sales and to finance. Agree on definitions before design.

A metric card usually holds a label, the current value, the change against a period and, when useful, a sparkline showing the trend.

## Layout priority

Eyes move top to bottom and left to right, so arrange the screen by decreasing importance:

1. **Top strip** — key metrics as cards.
2. **Middle** — charts that explain those metrics: trends and breakdowns by segment.
3. **Bottom** — detailed tables and lists for actual work.

Practical rules:

- Use a **grid** (for example 12 columns) and consistent spacing; visual order lowers cognitive load.
- Place related data next to each other, not in opposite corners.
- Do not make every block the same size: **size signals importance**.
- Reserve the accent color for anomalies and alerts. When everything is bright, nothing stands out.

## Choosing a chart type

The right chart depends on what the user needs to see.

| Task | Good choice | Avoid |
|---|---|---|
| Change over time | Line chart, bars per period | Pie chart |
| Comparing categories | Horizontal bars sorted by value | 3D effects |
| Part of a whole (2–4 parts) | Stacked bar, sometimes a donut | A pie with ten slices |
| Stage funnel | Funnel or stage bars with conversion | Scattered cards |
| Distribution | Histogram | An average with no spread |
| Progress to target | Progress bar, bullet chart | Speedometer gauges |

General rules: bar charts start the Y axis at zero, labels are readable without tilting your head, legends sit next to the data or are replaced by direct labels, and each chart uses as few colors as possible. Account for **color blindness**: never encode meaning with red and green alone; add a sign, an icon or a label.

## Tables: the workhorse of admin panels

In admin panels and CRMs, users spend most of their time in tables. What makes them work:

- **Numbers align right**, text aligns left; use tabular figures.
- The most important columns go first; rarely used ones can be hidden, and users can choose their own column set.
- A **sticky header** and first column while scrolling.
- Sorting by clicking a header, with a clear direction indicator.
- Statuses as short colored labels with text, not color alone.
- Bulk actions appear when rows are selected instead of sitting there permanently.
- Thoughtful **empty and loading states**: "No data for this period" beats an empty grid.

## Filters and density

Put **filters** in one predictable place, above the content or in a side panel. Active filters must always be visible, with a way to clear each one and all at once. The date range is usually the main filter, so make it prominent and add quick presets such as "Today", "Last 7 days" and "This month". Keeping filter state in the URL lets people share a specific view.

**Density** depends on the scenario. An overview dashboard needs breathing room. An operator processing requests all day needs high density: more rows on screen, less scrolling. A good solution is a density toggle (compact / comfortable) backed by a single spacing scale in your design system.

## Common mistakes

- Dozens of metrics on the first screen "just in case".
- Numbers without comparison or units.
- Decorative charts that look impressive but cannot be read.
- Mixed date and number formats on one screen.
- Designing for perfect data only: test long names, zeros, gaps and very large values.
- No answer to "what next": no link to details and no action.

## FAQ

### How many charts should one dashboard have?

There is no fixed number. Work from the user's questions: every chart should answer at least one of them. If a block cannot be tied to a decision, remove it or move it to reports.

### Can one dashboard serve every role?

A shared skeleton is fine, but the content should adapt to the role: different metrics, default filters and density. A one-size-fits-all screen is usually equally inconvenient for everyone.

### Where do I start when redesigning an existing admin panel?

Watch real work first: which screens are opened most, which columns and filters people use, and where they export data to Excel. Those are the spots where changes will have the biggest effect.
