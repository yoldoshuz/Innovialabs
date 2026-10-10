---
title: Data Cleaning: How to Prepare Data for Analysis
description: How to remove duplicates, handle missing values, normalise phones, dates and currencies, and flag outliers before analysis, with SQL and pandas examples.
summary: Data cleaning is a sequence of steps: find and remove duplicates, decide how to treat missing values, bring formats to one standard, flag outliers and document every rule so the process can be repeated.
---

## The short answer

Analysis on dirty data produces confident but wrong conclusions. Before analysing, go through five steps:

1. **Duplicates** — find them and decide which record to keep.
2. **Missing values** — understand why and pick a strategy.
3. **Formats** — standardise dates, phones, amounts and lookup values.
4. **Outliers** — find and flag them rather than deleting blindly.
5. **Validation and documentation** — record the rules so cleaning can be repeated.

The key principle: **never modify the raw data**. Cleaning writes to a new table or a new DataFrame, and every rule lives in code.

## Step 1. Duplicates

Duplicates come from repeated imports, double-clicks on a form or merging two CRMs. First define what one entity is: is a customer one phone number? One tax ID? A name plus phone pair?

In SQL, mark duplicates with a window function and keep the most recent record:

```sql
SELECT *
FROM (
  SELECT *,
         row_number() OVER (PARTITION BY phone ORDER BY updated_at DESC) AS rn
  FROM customers
) t
WHERE rn = 1;
```

The same in pandas:

```python
df = df.sort_values("updated_at").drop_duplicates(subset=["phone"], keep="last")
```

Compare duplicates **after** normalising formats, otherwise "+998 90 123 45 67" and "901234567" stay two different customers. In practice steps 1 and 3 often swap places.

## Step 2. Missing values

Measure the scale first:

```sql
SELECT count(*) - count(email) AS no_email,
       count(*) - count(city)  AS no_city
FROM customers;
```

```python
df.isna().sum()
```

Then choose a strategy per column:

| Situation | What to do |
|---|---|
| Required field is empty (id, order date) | Exclude the row and record why |
| Descriptive field (city, source) | Fill with "Unknown" |
| Numeric field where empty means zero | Fill with zero, only if that is truly the case |
| Numeric field where zero and "no data" differ | Leave it empty |

Don't fill gaps with the average just to make the data look complete: it distorts the distribution and the conclusions.

## Step 3. Consistent formats

**Phones.** Keep digits only and bring them to one form, for example international without the plus:

```python
df["phone"] = df["phone"].str.replace(r"\D", "", regex=True)
short = df["phone"].str.len() == 9
df.loc[short, "phone"] = "998" + df.loc[short, "phone"]
```

**Amounts.** Strings like "1 250 000,50 UZS" become numbers only after removing spaces and currency labels:

```python
df["amount"] = pd.to_numeric(
    df["amount"].str.replace(r"[^\d,.\-]", "", regex=True).str.replace(",", "."),
    errors="coerce",
)
```

This assumes a comma as the decimal separator. If sources use different formats, handle each one separately.

**Currencies.** Never add up som and dollars in one column. Keep `amount` and `currency` separate and convert using the rate **on the transaction date** from a rates table.

**Dates.** Specify the format explicitly so that 03.04 doesn't become March 4th by accident:

```python
df["order_date"] = pd.to_datetime(df["order_date"], format="%d.%m.%Y", errors="coerce")
```

**Text lookups.** "Tashkent", "Tashkent city" and "Toshkent" are one city. Trim spaces, normalise case and keep a mapping table for the remaining variants.

## Step 4. Outliers

An outlier isn't always an error. A large wholesale order is real; an order a thousand times bigger than usual may be a typo. So outliers are **flagged**, and the decision is made with someone who knows the business.

A simple method is the interquartile range:

```python
q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
df["is_outlier"] = ~df["amount"].between(q1 - 1.5 * iqr, q3 + 1.5 * iqr)
```

In SQL you can get the boundaries with `percentile_cont(0.25) WITHIN GROUP (ORDER BY amount)`.

Also check **logical** rules: dates in the future, negative quantities, ages over a hundred and twenty.

## Step 5. Validation and documentation

- Compare row counts and key totals before and after cleaning.
- Write down the rules: which duplicates were removed, how gaps were filled, which outliers were excluded.
- Turn the cleaning into a script rather than manual edits in Excel, so it can run again on new data.

## FAQ

### Which is better for cleaning: SQL or pandas?

SQL is convenient when the data already sits in a database and there is a lot of it. pandas is better for one-off files, complex transformations and exploration. Many teams combine them: rough cleaning in SQL, detailed work in Python.

### Can I just drop rows with missing values?

Yes, if there are few of them and they are random. If the gaps are systematic, for example from one source or one period, dropping them will skew the results. Check where they come from first.

### How do I get less dirty data in the first place?

Fix the cause at the source: input masks for phones, dropdowns instead of free text, database constraints and validation during imports.
