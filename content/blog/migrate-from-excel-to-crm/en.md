---
title: How to Migrate Customer Data From Excel to a CRM
description: A plan for moving customers from Excel to a CRM: data audit, duplicate cleanup, field mapping, a test import, validation and keeping deal and contact history.
summary: Collect and review every spreadsheet, remove duplicates and standardize formats, map columns to CRM fields, run a test import on a small sample, validate the result, and only then migrate the full database together with deal history.
---
## The short answer

Moving a customer base from Excel to a CRM is not "upload a file" — it is a small project in six steps:

1. **Audit** — find every source and understand what it contains.
2. **Cleanup** — remove duplicates and standardize formats.
3. **Field mapping** — decide where each column goes.
4. **Test import** — load a small sample and inspect it.
5. **Validation** — check counts, links and sample records.
6. **Full migration and cutover** — load everything and retire the old sheets.

## Step 1. Data audit

Gather **every** source: shared sheets, managers' personal files, exports from accounting and your online store. For each file, find out:

- which columns exist and how complete they are;
- what one row represents — a client, a company or a purchase;
- which data is outdated and does not need to move;
- who owns the file and can answer questions.

This is also when you decide **what not to migrate**. Empty contacts, long-dead records and internal notes are better left in an archive.

## Step 2. Cleanup and duplicates

- **Phone numbers** — one format with the country code: `+998901234567`. Store the column as text, otherwise Excel may drop leading characters or show long numbers in scientific notation.
- **Emails** — lowercase, no spaces.
- **Full names** — split into separate columns if the CRM stores first and last names separately.
- **Duplicates** — match on phone and email, not on name. When merging, decide which record wins and which fields to keep from the other.
- **Reference values** (city, source, status) — use one spelling: "Tashkent", "Toshkent" and "Tashkent city" must become a single value.

## Step 3. Field mapping

Build a mapping table before importing:

| Excel column | CRM entity | CRM field | Note |
|---|---|---|---|
| Company | Company | Name | |
| Contact person | Contact | First name, Last name | split |
| Phone | Contact | Phone | normalize |
| Status | Deal | Stage | map to pipeline stages |
| Manager | Deal | Owner | user must exist in the CRM |
| First contact date | Contact | Custom field | original date |

List values in the file must **match the CRM values exactly**, otherwise the field stays empty or the import fails.

If you have companies, contacts and deals, prepare **separate files** and load them in order: companies → contacts → deals. Add a column with an external ID from Excel to link records across files and trace any record back to its source row.

## Step 4. Test import

- Save the file as **CSV UTF-8** so Cyrillic and Uzbek characters survive. Check which delimiter your CRM expects.
- Load a small sample that includes the "difficult" rows: several phone numbers, no email, long comments.
- If the CRM offers duplicate checking on import, turn it on.

## Step 5. Validation

- The number of records in the CRM matches the row count after cleanup.
- Contacts are linked to companies, deals to contacts.
- Every record has an owner.
- Open a sample of records and compare them with Excel.
- Filters and reports work on the migrated fields.

If something is off, delete the test records, fix the file and repeat.

## Keeping deal and contact history

A CRM usually sets the creation date to the import date. To keep the history:

- store original dates in **separate fields** ("First contact date", "Deal date");
- load past purchases as **closed deals** with the amount and a won or lost stage;
- move comments and notes into a field or the record timeline, if your CRM supports importing them;
- keep the original files in a read-only archive.

## Cutting over to the CRM

Set a date after which new data goes **only into the CRM**. Make the spreadsheets read-only and load changes made during preparation in a separate final import.

## FAQ

### Can I just upload the Excel file as it is?

Technically you often can, but you will get duplicates, empty fields and unlinked records. Cleaning data before the import is far easier than after it.

### What about data that has no matching CRM field?

First decide whether you need it for work or reporting. If yes, create a custom field. If not, put it in a comment or leave it in the archive.

### Do we need to pause sales during the migration?

No. Prepare and test the import alongside daily work, then on cutover day load the changes made in the meantime and lock the spreadsheets for editing.
