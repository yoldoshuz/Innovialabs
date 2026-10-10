// Validates content/blog: every article has meta + ru/en/uz, sane
// frontmatter, a body of reasonable length, a "## FAQ" section, no H1,
// and Uzbek text uses ‘ ’ instead of ASCII apostrophes.
// Usage: node scripts/check-blog.mjs [--json]
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "content/blog";
const CATS = new Set(["business", "web", "seo", "devops", "ai", "programming", "mobile", "marketing", "design", "telegram", "ecommerce", "security", "data", "cloud", "career", "tools"]);
const SERVICES = new Set(["ai", "telegram", "web", "mobile", "crm", "integrations", "design", "devops", "marketing", "support", "consulting"]);
const LANGS = ["ru", "en", "uz"];

const problems = {};
const add = (slug, msg) => (problems[slug] ??= []).push(msg);

function front(src) {
  const text = src.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: text.slice(m[0].length) };
}

const dirs = existsSync(ROOT) ? readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()) : [];
for (const { name: slug } of dirs) {
  const dir = join(ROOT, slug);
  try {
    const meta = JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"));
    if (meta.slug !== slug) add(slug, "meta.slug mismatch");
    if (!CATS.has(meta.category)) add(slug, `bad category ${meta.category}`);
    if (!["basics", "practice", "advanced"].includes(meta.level)) add(slug, "bad level");
    if (!Array.isArray(meta.services) || !meta.services.length || meta.services.some((s) => !SERVICES.has(s))) add(slug, "bad services");
  } catch {
    add(slug, "meta.json missing or invalid");
  }
  for (const l of LANGS) {
    const file = join(dir, `${l}.md`);
    if (!existsSync(file)) {
      add(slug, `${l}.md missing`);
      continue;
    }
    const parsed = front(readFileSync(file, "utf8"));
    if (!parsed) {
      add(slug, `${l}: no frontmatter`);
      continue;
    }
    const { data, body } = parsed;
    for (const k of ["title", "description", "summary"]) if (!data[k]) add(slug, `${l}: no ${k}`);
    if (data.title && data.title.length > 90) add(slug, `${l}: title too long (${data.title.length})`);
    if (/^#\s/m.test(body.replace(/```[\s\S]*?```/g, ""))) add(slug, `${l}: has H1`);
    if (!/\n##\s+FAQ\s*\n/i.test("\n" + body)) add(slug, `${l}: no FAQ`);
    const words = body.split(/\s+/).filter(Boolean).length;
    if (words < 300) add(slug, `${l}: short (${words} words)`);
    if (l === "uz") {
      const prose = body.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
      const ascii = (prose.match(/\b[oOgG]'[a-z]/g) || []).length + (prose.match(/[a-z]'[a-z]/g) || []).length;
      if (ascii > 3) add(slug, `uz: ${ascii} ASCII apostrophes`);
    }
  }
}

const bad = Object.keys(problems);
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(problems, null, 2));
} else {
  console.log(`${dirs.length} articles, ${dirs.length - bad.length} ok, ${bad.length} with problems`);
  for (const s of bad.slice(0, 60)) console.log(`- ${s}: ${problems[s].join("; ")}`);
}
