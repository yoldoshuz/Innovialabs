import "server-only";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { i18n, type Locale } from "@/lib/i18n/config";
import type { ServiceSlug } from "@/lib/content";

/**
 * Blog content: content/blog/<slug>/{meta.json, ru.md, en.md, uz.md}.
 * Markdown files carry a tiny single-line frontmatter (title, description,
 * summary); the body ends with a "## FAQ" section that becomes the FAQ
 * block and FAQPage schema. Everything is read once per process and cached.
 */

export const blogCategories = [
  "business",
  "web",
  "seo",
  "devops",
  "ai",
  "programming",
  "mobile",
  "marketing",
  "design",
  "telegram",
  "ecommerce",
  "security",
  "data",
  "cloud",
  "career",
  "tools",
] as const;
export type BlogCategory = (typeof blogCategories)[number];
export type BlogLevel = "basics" | "practice" | "advanced";

/** Publication date for the first batch (all articles went live together). */
export const BLOG_PUBLISHED = "2026-10-10";

export type PostMeta = {
  slug: string;
  category: BlogCategory;
  level: BlogLevel;
  tags: string[];
  services: ServiceSlug[];
  date: string;
};

export type Heading = { id: string; text: string; level: 2 | 3 };
export type Faq = { question: string; answer: string };

export type Post = PostMeta & {
  lang: Locale;
  title: string;
  description: string;
  summary: string;
  html: string;
  headings: Heading[];
  faq: Faq[];
  minutes: number;
};

/** Lightweight listing entry (no body). */
export type PostCard = Pick<Post, "slug" | "category" | "level" | "tags" | "title" | "description" | "summary" | "minutes">;

const ROOT = join(process.cwd(), "content", "blog");

function parseFrontmatter(src: string) {
  const text = src.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const data: Record<string, string> = {};
  if (!m) return { data, body: text };
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["'](.*)["']$/, "$1");
  }
  return { data, body: text.slice(m[0].length) };
}

/** Heading anchor: keeps letters of any script, digits and dashes. */
function anchor(text: string, used: Set<string>) {
  const base =
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "section";
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** Markdown → HTML with heading ids, wrapped tables and safe external links. */
function render(md: string) {
  const headings: Heading[] = [];
  const used = new Set<string>();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const level = Math.min(Math.max(depth, 2), 4);
        const text = stripTags(inner);
        const id = anchor(text, used);
        if (level <= 3) headings.push({ id, text, level: level as 2 | 3 });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },
      table(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: "th" | "td") =>
          `<${tag}${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        const head = `<tr>${token.header.map((c) => cell(c, "th")).join("")}</tr>`;
        const body = token.rows.map((r) => `<tr>${r.map((c) => cell(c, "td")).join("")}</tr>`).join("");
        return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        return `<a href="${href}"${title ? ` title="${title}"` : ""}${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${inner}</a>`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, headings };
}

/** Splits "## FAQ" off the body into question/answer pairs. */
function splitFaq(body: string) {
  const m = body.match(/\n##\s+FAQ\s*\n([\s\S]*)$/i);
  if (!m) return { body, faq: [] as Faq[] };
  const faq: Faq[] = [];
  for (const block of m[1].split(/\n###\s+/).map((b) => b.trim()).filter(Boolean)) {
    const nl = block.indexOf("\n");
    const question = (nl === -1 ? block : block.slice(0, nl)).replace(/^###\s+/, "").trim();
    const answer = nl === -1 ? "" : block.slice(nl + 1).trim();
    if (question && answer) faq.push({ question, answer: stripTags(new Marked().parseInline(answer) as string) });
  }
  return { body: body.slice(0, m.index), faq };
}

function minutesOf(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ------------------------------------------------------------------ */

let metas: PostMeta[] | null = null;
const posts = new Map<string, Post | null>();

function isCategory(c: string): c is BlogCategory {
  return (blogCategories as readonly string[]).includes(c);
}

/** All article metas, interleaved by category so lists feel varied. */
export function allMetas(): PostMeta[] {
  if (metas) return metas;
  if (!existsSync(ROOT)) return (metas = []);
  const list: PostMeta[] = [];
  for (const dir of readdirSync(ROOT, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const metaPath = join(ROOT, dir.name, "meta.json");
    if (!existsSync(metaPath)) continue;
    // Only articles that exist in every locale are published.
    if (!i18n.locales.every((l) => existsSync(join(ROOT, dir.name, `${l}.md`)))) continue;
    try {
      const raw = JSON.parse(readFileSync(metaPath, "utf8"));
      if (!isCategory(raw.category)) continue;
      list.push({
        slug: dir.name,
        category: raw.category,
        level: ["basics", "practice", "advanced"].includes(raw.level) ? raw.level : "basics",
        tags: Array.isArray(raw.tags) ? raw.tags.slice(0, 6) : [],
        services: Array.isArray(raw.services) ? raw.services.slice(0, 2) : [],
        date: typeof raw.date === "string" ? raw.date : BLOG_PUBLISHED,
      });
    } catch {
      /* broken meta: skip the article rather than the build */
    }
  }
  // Round-robin over categories, alphabetical inside each.
  const byCat = blogCategories.map((c) => list.filter((m) => m.category === c).sort((a, b) => a.slug.localeCompare(b.slug)));
  const out: PostMeta[] = [];
  for (let i = 0; byCat.some((c) => i < c.length); i++) for (const c of byCat) if (c[i]) out.push(c[i]);
  return (metas = out);
}

export function getPost(lang: Locale, slug: string): Post | null {
  const key = `${lang}/${slug}`;
  if (posts.has(key)) return posts.get(key)!;
  const meta = allMetas().find((m) => m.slug === slug);
  const file = join(ROOT, slug, `${lang}.md`);
  if (!meta || !existsSync(file)) {
    posts.set(key, null);
    return null;
  }
  const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
  const { body: main, faq } = splitFaq(body.replace(/^#\s+.*\n/, ""));
  const { html, headings } = render(main);
  const post: Post = {
    ...meta,
    lang,
    title: data.title || slug,
    description: data.description || data.summary || "",
    summary: data.summary || data.description || "",
    html,
    headings,
    faq,
    minutes: minutesOf(body),
  };
  posts.set(key, post);
  return post;
}

export function getCards(lang: Locale): PostCard[] {
  return allMetas()
    .map((m) => getPost(lang, m.slug))
    .filter((p): p is Post => p !== null)
    .map(({ slug, category, level, tags, title, description, summary, minutes }) => ({
      slug,
      category,
      level,
      tags,
      title,
      description,
      summary,
      minutes,
    }));
}

export function countByCategory() {
  const counts = Object.fromEntries(blogCategories.map((c) => [c, 0])) as Record<BlogCategory, number>;
  for (const m of allMetas()) counts[m.category]++;
  return counts;
}

/** Same category first, then shared tags; never the post itself. */
export function relatedPosts(lang: Locale, post: PostMeta, n = 3): PostCard[] {
  const cards = getCards(lang).filter((c) => c.slug !== post.slug);
  const score = (c: PostCard) =>
    (c.category === post.category ? 2 : 0) + c.tags.filter((t) => post.tags.includes(t)).length;
  return cards
    .map((c) => ({ c, s: score(c) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.c.slug.localeCompare(b.c.slug))
    .slice(0, n)
    .map((x) => x.c);
}

export const PAGE_SIZE = 24;
export const pageCount = () => Math.max(1, Math.ceil(allMetas().length / PAGE_SIZE));
