// Mechanical fixes for content/blog (safe to re-run):
// - Uzbek: ASCII apostrophes in prose → ‘ (after o/g) or ’ (elsewhere)
// - any "# " H1 outside code blocks → "## "
// Code blocks and inline code are left untouched.
// Usage: node scripts/fix-blog.mjs
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "content/blog";
let changed = 0;

/** Applies `fn` to prose only (outside ``` blocks and `inline code`). */
function mapProse(text, fn) {
  return text
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) => (i % 2 ? part : part.split(/(`[^`\n]*`)/g).map((p, j) => (j % 2 ? p : fn(p))).join("")))
    .join("");
}

const uzApostrophes = (s) =>
  s
    .replace(/([oOgG])['`ʻ](?=\p{L})/gu, "$1‘")
    .replace(/(\p{L})['`ʼ](?=\p{L})/gu, "$1’");

const demoteH1 = (s) => s.replace(/^#\s+/gm, "## ");

for (const dir of existsSync(ROOT) ? readdirSync(ROOT, { withFileTypes: true }) : []) {
  if (!dir.isDirectory()) continue;
  for (const l of ["ru", "en", "uz"]) {
    const file = join(ROOT, dir.name, `${l}.md`);
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    const m = src.match(/^(---[\s\S]*?\n---\n?)([\s\S]*)$/);
    if (!m) continue;
    let [, head, body] = m;
    let next = mapProse(body, demoteH1);
    if (l === "uz") {
      next = mapProse(next, uzApostrophes);
      head = head.replace(/^(title|description|summary):(.*)$/gm, (_, k, v) => `${k}:${uzApostrophes(v)}`);
    }
    const out = head + next;
    if (out !== src) {
      writeFileSync(file, out);
      changed++;
    }
  }
}
console.log(`fixed ${changed} files`);
