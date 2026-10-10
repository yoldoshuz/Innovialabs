"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { BlogDict } from "@/types";
import type { BlogLevel } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { cn } from "@/lib/utils";

/** Search index row (see app/[lang]/blog/search.json). */
type Row = { s: string; t: string; d: string; c: string; l: BlogLevel; g: string[]; m: number };

const LEVELS: BlogLevel[] = ["basics", "practice", "advanced"];
const STEP = 30;

/** Lowercase, unify Uzbek apostrophes and ё, drop punctuation. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[‘’ʻʼ'`]/g, "")
    .replace(/[^\p{L}\p{N}\s.#+-]/gu, " ");

function score(row: Row, terms: string[]) {
  const title = norm(row.t);
  const tags = norm(row.g.join(" ") + " " + row.s.replace(/-/g, " "));
  const desc = norm(row.d);
  let total = 0;
  for (const term of terms) {
    const s = (title.includes(term) ? 5 : 0) + (tags.includes(term) ? 3 : 0) + (desc.includes(term) ? 1 : 0);
    if (!s) return 0;
    total += s;
  }
  return total;
}

let cache: Promise<Row[]> | null = null;
const loadIndex = (lang: Locale) =>
  (cache ??= fetch(`/${lang}/blog/search.json`).then((r) => r.json() as Promise<Row[]>).catch(() => {
    cache = null;
    return [];
  }));

/**
 * Search + level filter over the whole blog (or one category). The
 * server-rendered page (`children`) stays as is until a filter is active,
 * so crawlers and no-JS visitors get the paginated list.
 */
export function BlogExplorer({
  lang,
  labels,
  category,
  children,
}: {
  lang: Locale;
  labels: Pick<BlogDict, "search" | "searchPlaceholder" | "levelTitle" | "levels" | "all" | "found" | "nothing" | "reset" | "categories" | "minutes">;
  category?: string;
  children: React.ReactNode;
}) {
  const [q, setQ] = React.useState("");
  const [level, setLevel] = React.useState<BlogLevel | null>(null);
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [limit, setLimit] = React.useState(STEP);
  const active = q.trim().length > 1 || level !== null;

  React.useEffect(() => {
    if (!active || rows) return;
    let alive = true;
    loadIndex(lang).then((r) => alive && setRows(r));
    return () => {
      alive = false;
    };
  }, [active, rows, lang]);

  const results = React.useMemo(() => {
    if (!rows || !active) return [];
    const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
    return rows
      .filter((r) => (!category || r.c === category) && (!level || r.l === level))
      .map((r) => ({ r, s: terms.length ? score(r, terms) : 1 }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);
  }, [rows, active, q, level, category]);

  const reset = () => {
    setQ("");
    setLevel(null);
    setLimit(STEP);
  };

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="group relative flex-1">
          <span className="sr-only">{labels.search}</span>
          <Search className="pointer-events-none absolute left-6 top-1/2 size-6 -translate-y-1/2 text-violet" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(STEP);
            }}
            onFocus={() => loadIndex(lang)}
            placeholder={labels.searchPlaceholder}
            className="h-16 w-full rounded-full border-2 border-transparent bg-paper pl-16 pr-14 font-display text-lg font-bold text-ink outline-none transition-colors placeholder:font-semibold placeholder:text-[#a8a2bf] focus:border-violet focus:bg-white sm:h-20 sm:text-xl"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label={labels.reset}
              className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-mist hover:text-ink"
            >
              <X className="size-5" />
            </button>
          ) : null}
        </label>
        <div role="group" aria-label={labels.levelTitle} className="flex gap-1.5 rounded-full bg-paper p-1.5">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={level === l}
              onClick={() => {
                setLevel(level === l ? null : l);
                setLimit(STEP);
              }}
              className={cn(
                "h-12 rounded-full px-5 font-display text-sm font-bold transition-colors sm:h-[3.75rem] sm:px-6 sm:text-base",
                level === l ? "bg-violet text-white" : "text-ink hover:bg-white",
              )}
            >
              {labels.levels[l]}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-10"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-lg font-bold" aria-live="polite">
                {labels.found}: <span className="type-accent text-violet">{rows ? results.length : "…"}</span>
              </p>
              <button type="button" onClick={reset} className="link-underline font-display font-bold text-violet">
                {labels.reset}
              </button>
            </div>
            {rows && results.length === 0 ? (
              <p className="type-lead mt-10 max-w-xl text-muted">{labels.nothing}</p>
            ) : (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.slice(0, limit).map((r) => (
                  <li key={r.s}>
                    <PostCard
                      lang={lang}
                      labels={labels}
                      post={{ slug: r.s, category: r.c as never, level: r.l, title: r.t, summary: r.d, minutes: r.m }}
                    />
                  </li>
                ))}
              </ul>
            )}
            {results.length > limit ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setLimit((n) => n + STEP)}
                  className="h-14 rounded-full bg-mist px-8 font-display font-bold text-violet transition-colors hover:bg-lilac hover:text-white"
                >
                  +{Math.min(STEP, results.length - limit)}
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : (
          <motion.div key="page" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
