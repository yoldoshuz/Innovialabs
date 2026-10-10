import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { BlogDict } from "@/types";
import type { BlogLevel, PostCard as Card } from "@/lib/blog";

/** Article tile: topic, giant-ish title, the one-line answer, level and time. */
export function PostCard({
  lang,
  post,
  labels,
  as: Heading = "h3",
}: {
  lang: Locale;
  post: Pick<Card, "slug" | "category" | "level" | "title" | "summary" | "minutes">;
  labels: Pick<BlogDict, "categories" | "levels" | "minutes">;
  as?: "h2" | "h3";
}) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-[1.75rem] bg-paper p-6 transition-[background-color,translate] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:bg-mist sm:p-7"
    >
      <span className="flex items-center justify-between gap-4 text-sm font-semibold">
        <span className="text-violet">{labels.categories[post.category as keyof BlogDict["categories"]]}</span>
        <span className="type-accent text-muted">
          {post.minutes} {labels.minutes}
        </span>
      </span>
      <Heading className="mt-5 font-display text-[1.35rem] font-extrabold leading-[1.15] tracking-[-0.025em] sm:text-2xl">
        {post.title}
      </Heading>
      <p className="mt-3 line-clamp-3 text-[0.97rem] leading-relaxed text-muted">{post.summary}</p>
      <span className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-muted">
        {labels.levels[post.level as BlogLevel]}
        <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-hover:bg-violet group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
      </span>
    </Link>
  );
}
