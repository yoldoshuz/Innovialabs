---
title: Secure File Uploads: A Checklist for Developers
description: A secure file upload checklist: extension and MIME checks, size limits, storage outside the web root, renaming, image re-encoding, antivirus and SVG risks.
summary: An uploaded file is untrusted data that must never be executed or served as is. Validate type by allowlist and file signature, limit size, rename it, store it outside the web root, re-encode images and scan for malware.
---

## The main rule

Every user file is **untrusted input**. Whoever uploads it controls the name, extension, `Content-Type` and contents. There are three dangerous outcomes:

- **code execution** on the server, if the file lands where the web server runs it (`shell.php` in `/uploads/`);
- **XSS and phishing**, if HTML or SVG is served from your domain and opens in the browser;
- **denial of service** — huge files, archive bombs and image bombs.

The checklist below covers all three.

## 1. File type

- **Allowlist extensions**, not a blocklist: `jpg`, `png`, `pdf` — and nothing beyond what you need. A list of "forbidden" ones is always incomplete (`phtml`, `phar`, `shtml`…).
- Take the extension after the **last** dot and lowercase it. `photo.php.jpg` and `photo.JPG` are common bypasses.
- **The request's `Content-Type` proves nothing:** the client sets it. Check the **file signature** (magic bytes) with a library such as `libmagic` or `file-type`.
- Extension, MIME type and signature must **match**. A mismatch means rejection.

## 2. Size and count

- Enforce limits at the proxy (`client_max_body_size` in Nginx), the application and the storage layer, so a large file is cut off before it eats memory.
- For images, check **pixel dimensions**, not just bytes: a small file can decompress into a gigantic image.
- Extract archives with limits on total size and file count, and check paths inside them for `../` (zip slip).
- Limit uploads per user and per unit of time.

## 3. Where to store files

- **Outside the web root** or in **object storage** (S3-compatible) in a private bucket. The web server must have no way to execute an uploaded file.
- Serve files through a handler that checks permissions, or via **signed URLs** with a short lifetime.
- Serve user content from a **separate domain** (`usercontent.example.net`): even if a script ends up there, it cannot reach the main site's cookies.
- Check download permissions as strictly as for any data, or you get an IDOR via `/files/123`.

## 4. File name

- **Generate the name yourself** (UUID or hash) and keep the original name in the database.
- This closes path traversal (`../../etc/passwd`), overwriting other users' files, special characters and overly long names.
- When serving, escape the original name in `Content-Disposition` and render it as plain text in the UI.

## 5. Images

- **Re-encode** images: decode and save them again through an image library. This strips foreign data, polyglots (files valid in two formats at once) and EXIF metadata, including geolocation.
- Keep image processing libraries up to date: vulnerabilities are found in them regularly.
- Run processing in a separate worker or container with resource limits and no unnecessary network access.

## 6. Antivirus

- Scan files (for example, with **ClamAV**) before they become available to other users.
- A convenient pattern: the file goes into quarantine with a "pending" status, an async worker scans it, and only then is it published.
- Antivirus does not replace the steps above: it catches known malware, not XSS inside an SVG.

## 7. SVG and HTML

**SVG is XML** that can contain `<script>`, event handlers and external references. If an SVG opens from your domain, that is stored XSS. Options:

| Option | When it fits |
|---|---|
| Disallow SVG | if you can live without it |
| Convert to PNG | avatars and previews |
| Sanitize (for example, DOMPurify on the server) | when you need the vector format |
| Serve from a separate domain as an attachment | storing files as is |

The same applies to HTML, XML and PDFs with active content.

## 8. Response headers

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="report.pdf"
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; sandbox
```

`nosniff` stops the browser from guessing the type, and `attachment` forces a download instead of opening the file. More details in the [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## FAQ

### Is checking the file extension enough?

No. The client controls both the extension and `Content-Type`. You also need signature checks, non-executable storage and safe serving — otherwise one configuration mistake turns into a breach.

### Do I need antivirus if I only accept images?

Re-encoding images covers most of the risk. Antivirus matters when other people download the files, especially documents and archives.

### Can I allow SVG uploads for logos?

Yes, if the SVG is sanitized or converted to a raster image and originals are served from a separate domain. Serving raw SVG from your main domain is unsafe.
