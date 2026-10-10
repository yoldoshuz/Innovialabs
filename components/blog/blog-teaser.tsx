import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { BlogDict } from "@/types";
import { allMetas, getCards } from "@/lib/blog";
import { GiantTitle } from "@/components/motion/giant-title";
import { PostCard } from "@/components/blog/post-card";

/** Home: a few articles and the way into the blog. */
export function BlogTeaser({ lang, dict }: { lang: Locale; dict: BlogDict }) {
  const cards = getCards(lang).slice(0, 6);
  if (!cards.length) return null;
  return (
    <section className="section shell">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <GiantTitle className="text-[clamp(3rem,9vw,9rem)]">{dict.title}</GiantTitle>
          <p className="type-lead mt-5 max-w-2xl text-muted">{dict.lead}</p>
        </div>
        <Link href={`/${lang}/blog`} className="group flex shrink-0 items-center gap-2 font-display text-lg font-bold text-violet sm:pb-3">
          <span className="link-underline">
            <span className="type-accent">{allMetas().length}</span> {dict.articles}
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((post) => (
          <li key={post.slug}>
            <PostCard lang={lang} post={post} labels={dict} />
          </li>
        ))}
      </ul>
    </section>
  );
}
