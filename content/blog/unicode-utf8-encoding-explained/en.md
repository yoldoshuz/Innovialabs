---
title: Unicode and UTF-8 Explained: Fixing Encoding Problems
description: What Unicode code points are, how UTF-8 stores characters as bytes, how Windows-1251 differs, and how to fix Cyrillic and Uzbek o‘ and g‘ in code and files.
summary: Unicode gives every character a number, and UTF-8 turns that number into 1 to 4 bytes. Garbled text appears when bytes are written in one encoding and read in another, so specify UTF-8 explicitly everywhere.
---
## The short answer: where garbled text comes from

Computers store bytes, not letters. An **encoding** is the rule that turns bytes into characters. If text is saved in one encoding and opened in another, instead of the Russian word "Привет" you get "РџСЂРёРІРµС‚". This is called **mojibake**.

The fix is almost always the same: **use UTF-8 everywhere** and state the encoding explicitly when reading and writing.

## Unicode, code points and UTF-8

- **Unicode** is a large table that gives every character a number, a **code point**. Cyrillic "А" is `U+0410`, Latin `a` is `U+0061`, the Uzbek mark ‘ in o‘ is `U+2018`.
- **UTF-8** is a way to write a code point as bytes. Latin letters take 1 byte, Cyrillic 2, many punctuation marks and symbols 3, emoji 4.

| Character | Code point | UTF-8 bytes |
|---|---|---|
| `a` | U+0061 | `61` |
| `А` (Cyrillic) | U+0410 | `D0 90` |
| `‘` | U+2018 | `E2 80 98` |

**Windows-1251** is an old single-byte encoding for Cyrillic. In it "А" is one byte, `C0`. It still shows up in exports from legacy systems, Excel CSV files and old databases.

## How the corruption happens

Take "П": in UTF-8 it is the bytes `D0 9F`. A program that thinks the file is Windows-1251 sees two separate characters: `D0` is "Р" and `9F` is "џ". That is the "Рџ" at the start of the broken word.

The reverse case: a Windows-1251 file opened as UTF-8. Those bytes do not form valid sequences, and you get `�` replacement characters instead of text.

## How to fix it in practice

**Read and write files with an explicit encoding:**

```python
with open("data.csv", encoding="utf-8") as f:
    text = f.read()
```

**Convert legacy files:**

```bash
iconv -f WINDOWS-1251 -t UTF-8 old.csv > new.csv
```

**Repair an already broken string** if you know how it broke:

```python
broken = "РџСЂРёРІРµС‚"
fixed = broken.encode("cp1251").decode("utf-8")  # "Привет"
```

**Check every layer:**

- HTML: `<meta charset="utf-8">` and the header `Content-Type: text/html; charset=utf-8`.
- MySQL: the `utf8mb4` charset, not `utf8`, which stores at most 3 bytes and rejects emoji.
- PostgreSQL: a database with `UTF8` encoding.
- CSV for Excel: save as UTF-8 with BOM (`encoding="utf-8-sig"` in Python), otherwise Excel may open Cyrillic incorrectly.
- Code editor and Git: files in UTF-8.

## Uzbek o‘ and g‘: a separate trap

The apostrophe in o‘, g‘ and in words like ma’lumot can be typed with different characters: `'` (U+0027), `` ` `` (U+0060), `‘` (U+2018), `’` (U+2019), `ʻ` (U+02BB). They look alike, but to a computer they are different characters. The consequences:

- searching for "o‘zbek" does not find "o'zbek";
- duplicates in directories, customer lists and addresses;
- different URLs and slugs for the same word.

What to do: pick one variant for the project and **normalize input** on save, replacing the other variants with the chosen one. For search, store an extra normalized field.

One more detail is string length. `"o‘"` is 2 code points but 4 bytes in UTF-8. If a database column is limited in bytes rather than characters, text can be cut in the middle of a character.

## Unicode normalization

Some letters can be written two ways: "й" as one code point, or "и" plus a combining mark. They look identical, yet string comparison returns `False`. Bring text to one form:

```python
import unicodedata
clean = unicodedata.normalize("NFC", text)
```

## FAQ

### Should a new project ever use Windows-1251?

No. Use UTF-8 for new code, databases and APIs. Windows-1251 is only for reading old data and integrating with systems that support nothing else, so convert it at the boundary.

### Why does Excel break Cyrillic in CSV files?

Without a BOM, Excel may read the file in the system encoding instead of UTF-8. Save CSV as UTF-8 with BOM, or use data import with an explicit encoding choice.

### Which character is correct for o‘ and g‘?

The official Uzbek Latin alphabet uses ‘ and ’, while Unicode also has a dedicated modifier letter ʻ. What matters for a developer is choosing one variant and normalizing all data the same way.
