import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types";
import { blogCategories, countByCategory, type BlogCategory, type PostCard as Card } from "@/lib/blog";
import { PageHeader } from "@/components/layout/page-header";
import { PostCard } from "@/components/blog/post-card";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { CtaBand } from "@/components/contact/cta-band";
import { cn } from "@/lib/utils";

/**
 * Shared shell of /blog, /blog/page/N and /blog/category/X: giant header,
 * topics, search, the server-rendered grid and plain pagination links.
 */
export function BlogListing({
  lang,
  dict,
  cards,
  total,
  category,
  page = 1,
  pages = 1,
}: {
  lang: Locale;
  dict: Dictionary;
  cards: Card[];
  total: number;
  category?: BlogCategory;
  page?: number;
  pages?: number;
}) {
  const b = dict.blog;
  const counts = countByCategory();
  const base = `/${lang}/blog`;
  const pageHref = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  const crumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: b.meta.title, href: base },
    ...(category ? [{ label: b.categories[category], href: `${base}/category/${category}` }] : []),
  ];

  return (
    <main>
      <PageHeader
        title={category ? b.categories[category] : b.title}
        lead={b.lead}
        crumbs={crumbs}
        titleClassName="max-w-6xl text-[clamp(3rem,10vw,10rem)]"
      >
        <p className="mt-6 font-display text-lg font-bold">
          <span className="type-accent text-3xl text-violet">{total}</span> {b.articles}
        </p>
      </PageHeader>

      <section className="shell">
        <nav aria-label={b.categoryTitle} className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link
            href={base}
            aria-current={!category ? "page" : undefined}
            className={cn("blog-topic", !category && "blog-topic-on")}
          >
            {b.all}
          </Link>
          {blogCategories
            .filter((c) => counts[c] > 0)
            .map((c) => (
              <Link
                key={c}
                href={`${base}/category/${c}`}
                aria-current={category === c ? "page" : undefined}
                className={cn("blog-topic", category === c && "blog-topic-on")}
              >
                {b.categories[c]}
                <span className="type-accent opacity-60">{counts[c]}</span>
              </Link>
            ))}
        </nav>

        <BlogExplorer lang={lang} labels={b} category={category}>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((post) => (
              <li key={post.slug}>
                <PostCard lang={lang} post={post} labels={b} as="h2" />
              </li>
            ))}
          </ul>

          {pages > 1 ? (
            <nav aria-label={b.page} className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} rel="prev" className="blog-topic">
                  <ArrowLeft className="size-4" />
                  {b.prev}
                </Link>
              ) : null}
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 2)
                .map((n, i, arr) => (
                  <span key={n} className="flex items-center gap-2">
                    {i > 0 && n - arr[i - 1] > 1 ? <span className="text-muted">…</span> : null}
                    <Link
                      href={pageHref(n)}
                      aria-current={n === page ? "page" : undefined}
                      className={cn("blog-topic type-accent min-w-12 justify-center", n === page && "blog-topic-on")}
                    >
                      {n}
                    </Link>
                  </span>
                ))}
              {page < pages ? (
                <Link href={pageHref(page + 1)} rel="next" className="blog-topic">
                  {b.next}
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </BlogExplorer>
      </section>

      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} />
    </main>
  );
}
