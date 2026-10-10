---
title: Linux File Permissions Explained: chmod, chown and Users
description: How Linux file permissions work: r, w and x bits, numeric and symbolic notation, owners and groups, and a safe permission setup for web app directories.
summary: Every Linux file has an owner, a group and three sets of read, write and execute permissions for the owner, the group and everyone else; chmod changes permissions and chown changes ownership.
---
## The short answer

Every file and directory in Linux has an **owner** (a user), a **group** and three permission sets:

- **u (user)**: what the owner can do;
- **g (group)**: what members of the group can do;
- **o (others)**: what everyone else can do.

Each set has three bits: **r** (read), **w** (write) and **x** (execute). You see them with `ls -l`:

```bash
$ ls -l
-rw-r--r-- 1 deploy www-data  512 app.conf
drwxr-x--- 2 deploy www-data 4096 storage
```

The first character is the type (`-` for a file, `d` for a directory), followed by three triplets: owner, group, others. Here `deploy` is the owner and `www-data` is the group.

## What r, w and x mean for files vs directories

The bits behave differently on files and directories, and this causes most of the confusion.

| Bit | File | Directory |
|---|---|---|
| r | read the contents | list the files inside |
| w | modify the contents | create, delete and rename files inside |
| x | run it as a program | enter the directory and access files by name |

What follows from this:

- Without **x** on a directory you cannot open a file inside it, even if the file itself is readable.
- Deleting a file depends on permissions of the **directory** (w + x), not the file.
- For a web server to read `/var/www/app/public/index.html`, it needs **x** on every directory along the path.

## Numeric and symbolic notation

**Numeric (octal)** notation adds up bit weights: r = 4, w = 2, x = 1. One digit per set.

| Number | Permissions | Typical use |
|---|---|---|
| 644 | rw-r--r-- | regular files, configs without secrets |
| 640 | rw-r----- | configs read by a service group |
| 600 | rw------- | private keys, `.env` files |
| 755 | rwxr-xr-x | directories, executable scripts |
| 750 | rwxr-x--- | directories hidden from other users |

```bash
chmod 640 .env
chmod 755 deploy.sh
```

**Symbolic** notation is handy when you want to change one bit and leave the rest alone:

```bash
chmod u+x deploy.sh      # give the owner execute
chmod g-w config.yml     # remove write from the group
chmod o= secret.key      # remove all permissions from others
chmod -R g+rX storage    # X adds x to directories (and already executable files) only
```

## Owners and groups: chown and chgrp

- `chown deploy file` changes the owner;
- `chown deploy:www-data file` changes owner and group;
- `chgrp www-data file` changes only the group;
- `-R` applies the change recursively.

Add a user to a group with `sudo usermod -aG www-data deploy`. The `-a` flag matters: without it the user is removed from their other groups. Group changes take effect after the user logs in again.

## A typical setup for a web application

The goal: only the deploy user can change code, the web server or PHP-FPM can read it, and the app can write only to specific directories.

```bash
# owner is the deploy user, group is the web server user
sudo chown -R deploy:www-data /var/www/app

# directories 750, files 640
sudo find /var/www/app -type d -exec chmod 750 {} \;
sudo find /var/www/app -type f -exec chmod 640 {} \;

# directories the app writes to (uploads, cache, logs)
sudo chmod -R g+w /var/www/app/storage

# secrets readable only by owner and group
sudo chmod 640 /var/www/app/.env
```

The web server process belongs to the group, so it can read the code but cannot modify it. If someone exploits a vulnerability in the app, they cannot overwrite your source files.

User names vary by distribution: Debian and Ubuntu usually use `www-data`, while RHEL-based systems use `nginx` or `apache`.

## Common mistakes

- **Using `chmod 777`** to "fix" a permission error. It gives write access to every user on the system. Find out which user the failing process runs as and grant access to that user only.
- **Running `chmod -R 755` on everything**, which makes every file executable. Set files and directories separately with `find`.
- **Deploying as root.** Files end up owned by root and the app can no longer write to its cache.
- **A private SSH key with 644.** OpenSSH refuses to use it; it needs 600.
- **Missing x on a parent directory**, which makes nginx return 403 even though the file itself has correct permissions.

## FAQ

### What is umask?
It is a mask that sets default permissions for newly created files. A common value of `022` gives files 644 and directories 755; `027` keeps new files closed to others. Run `umask` to see the current value.

### What are setuid, setgid and the sticky bit?
They are special bits. **setgid** on a directory makes new files inherit the directory's group, which is useful for shared folders. The **sticky bit** (as on `/tmp`) stops users from deleting each other's files. **setuid** runs a program with its owner's privileges, and you should avoid it in your own scripts.

### Why do I get permission errors inside Docker containers?
Permissions are checked by numeric UID and GID, not by names. If the container process runs with a UID that does not match the owner of a mounted host directory, writes are denied. Align the UIDs or set the directory owner in advance.
