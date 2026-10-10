---
title: Data Analyst Roadmap: How to Become an Analyst
description: A step-by-step plan for aspiring data analysts: Excel, SQL, statistics, visualization and Python, plus portfolio case ideas built on public datasets.
summary: To become a data analyst, go Excel → SQL → statistics → visualization → Python, and build a portfolio of 3-4 public-data cases where you answer specific business questions.
---

## The plan in five steps

A data analyst turns data into **answers to business questions**: why sales dropped, which customers leave, which campaign worked. Learn the tools in this order:

1. **Excel or Google Sheets.**
2. **SQL.**
3. **Statistics.**
4. **Visualization and BI.**
5. **Python for analysis.**

Each step extends the previous one: from a single spreadsheet to databases, conclusions and automation.

## Step 1. Spreadsheets

- Formulas, relative and absolute references.
- Lookup functions (`XLOOKUP` or `VLOOKUP`), `IF`, `SUMIFS`, `COUNTIFS`.
- **Pivot tables** and filters.
- Data cleaning: duplicates, missing values, inconsistent date formats.

**Checkpoint:** you can take a raw sales export and quickly build a summary by month, category and region.

## Step 2. SQL

SQL is an analyst's main everyday tool.

- `SELECT`, `WHERE`, `ORDER BY`, aggregate functions, `GROUP BY` and `HAVING`.
- Different `JOIN` types and knowing when rows get duplicated.
- Subqueries and **CTEs**.
- **Window functions**: ranking, running totals, period-over-period comparison.

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month,
       revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS diff
FROM monthly
ORDER BY month;
```

**Checkpoint:** you confidently solve join and window-function tasks and sanity-check your results.

## Step 3. Statistics

- Mean, median, spread, outliers.
- Distributions and sampling.
- **Correlation vs causation**: why one does not prove the other.
- **A/B testing** basics: hypothesis, statistical significance, sample size.

**Checkpoint:** you can explain why an average order value can mislead and when the median is a better choice.

## Step 4. Visualization

- Matching the chart to the question: trend, comparison, share, distribution.
- **BI tools**: Power BI, Tableau, Looker Studio or similar.
- Dashboards: a few key metrics instead of dozens of charts.
- **Storytelling**: the conclusion first, then the evidence, then the recommendation.

**Checkpoint:** someone without a technical background grasps the main takeaway of your dashboard within a minute.

## Step 5. Python

- Language basics and Jupyter Notebook.
- **pandas** to load, clean and group data.
- **matplotlib** or **seaborn** for charts.
- Automating recurring reports.

```python
import pandas as pd

df = pd.read_csv("orders.csv", parse_dates=["order_date"])
monthly = df.groupby(df["order_date"].dt.to_period("M"))["amount"].sum()
print(monthly.tail())
```

## Portfolio case ideas

Use public data: government open data portals, Kaggle, public city transport or weather datasets.

| Case | Question | Skills |
|---|---|---|
| Online store sales | Which categories are growing and why | SQL, pivots, dashboard |
| Customer churn | Which traits are linked to customers leaving | Python, statistics |
| City transport | When and where the peak load happens | Visualization, date handling |
| A/B test | Is there a significant difference between variants | Statistics, interpretation |

For each case, write a short report: **question, data, method, conclusion, limitations, recommendation**.

## Common mistakes

- Learning Python before SQL and stumbling on simple queries.
- Building pretty charts that answer no question.
- Drawing causal conclusions from a single correlation.
- Not checking data for missing values and duplicates.

## FAQ

### Do I need a math degree to become a data analyst?

No. You need solid basic statistics, logical thinking and attention to detail. A math background helps but does not replace hands-on practice with real data.

### What matters more for a first job: SQL or Python?

For most entry-level roles SQL matters more because you use it every day. Python adds a lot of power, but it usually comes second.

### How is a data analyst different from a data scientist?

An analyst answers what happened and why, and helps people make decisions. A data scientist more often builds predictive models and works more deeply with machine learning.
