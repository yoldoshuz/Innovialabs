---
title: Google Shared Drives: Structure and Access Permissions
description: My Drive vs shared drives, the five access roles, a company folder structure, external sharing rules and how to keep files safe when employees leave.
summary: Keep company files on shared drives, not in employees' My Drive: files belong to the organization, access is granted to groups by role, and nothing disappears when someone leaves.
---
## The short answer

**My Drive** is an employee's personal space. A file there belongs to that person, even if the whole company uses it. A **shared drive** belongs to the organization: members come and go, files stay.

The rule is simple: anything the company needs after a specific person leaves should live on a shared drive.

## My Drive vs shared drive

| | My Drive | Shared drive |
|---|---|---|
| File owner | The employee | The organization |
| When the employee leaves | Files must be transferred before the account is deleted | Files stay where they are |
| Permissions | Set file by file | Assigned to drive members and inherited downward |
| Good for | Drafts and personal notes | Department and project documents |

## Shared drive roles

Each shared drive member has one of five roles:

- **Manager** manages members and drive settings, and can do everything else.
- **Content manager** adds, edits, moves and deletes files.
- **Contributor** adds and edits files but cannot delete or move them.
- **Commenter** reads and comments.
- **Viewer** can only view.

Important: permissions **inherit downward** and can only expand. You can grant extra people access to a subfolder, but you cannot take access away from members of the drive itself. Put confidential data on a separate drive, not in a "locked" folder inside a shared one.

## A structure for a company

Avoid one giant drive for everyone. It works better to have **one drive per group of people with the same access**:

```text
Shared drives
├── 00 Company        all staff: Viewer
├── Sales             sales team: Content manager
├── Marketing         marketing: Content manager, sales: Viewer
├── Finance           accounting and leadership
├── HR                HR and leadership only
└── Project Alpha     project team, contractors: Contributor
```

Inside a drive, keep the hierarchy shallow: two or three folder levels, clear names, and year or number prefixes where useful.

## How to grant access

1. **Grant access to groups, not people.** Create groups such as sales@ or finance@ in the Admin console and add them to the drive. A new hire joins the group and gets the right access immediately.
2. **Keep managers few.** Two per drive is usually enough: a primary and a backup.
3. **Give Content manager deliberately.** Deleting and moving files are the main causes of "lost" documents.
4. **Review members every quarter.** Former employees, finished contractors and stray guests are common finds.

## External sharing

The admin sets rules in the Admin console, and the drive manager adjusts them in drive settings. Decide:

- whether files can be shared outside the organization at all, or only with trusted domains;
- whether external people can be members of a shared drive;
- whether "Anyone with the link" sharing is allowed.

For contractors, a separate project drive with the **Contributor** role works well: when the job ends, you simply remove them.

## Not losing files when people leave

- Move work files from My Drive to a shared drive **before** the employee's last day.
- If anything remains, an admin can transfer My Drive data to another user in the Admin console. Do it **before deleting the account**: after deletion, data can be restored only for a limited time.
- Do not delete the account right away: suspend sign-in first, transfer files and email, then delete.

## Common mistakes

- Keeping contracts and financial reports in a manager's personal My Drive.
- Trying to restrict a folder inside a shared drive instead of creating a separate drive.
- Making everyone a Manager "just in case".
- Leaving "Anyone with the link" on documents that contain personal data.

## FAQ

### Can I move a folder from My Drive to a shared drive?

Yes, drag it or use Move. You need permission to add files on the target drive, and an admin can restrict moving files owned by other people.

### What happens to deleted files on a shared drive?

They go to that drive's trash, where a member with a suitable role can restore them. After a set period they are deleted permanently, so do not postpone recovery.

### How many shared drives should we create?

As many as you have groups with different access. If two folders have the same people and permissions, they belong on the same drive.
