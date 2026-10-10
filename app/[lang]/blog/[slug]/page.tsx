import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { i18n, isLocale, localeMeta } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { allMetas, getPost, relatedPosts } from "@/lib/blog";
import { serviceMeta, type ServiceSlug } from "@/lib/content";
import { blogPostJsonLd, breadcrumbJsonLd, faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { Icon } from "@/components/brand/icon";
import { Spark } from "@/components/brand/spark";
import { Reveal } from "@/components/motion/reveal";
import { PostCard } from "@/components/blog/post-card";
import { ContactCta } from "@/components/contact/contact-cta";
import { CtaBand } from "@/components/contact/cta-band";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = allMetas().map((m) => m.slug);
  return i18n.locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPost(lang, slug);
  if (!post) return {};
  const base = pageMetadata({
    lang,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    type: "article",
  });
  return {
    ...base,
    keywords: post.tags,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      section: post.category,
      tags: post.tags,
    },
  };
}

/**
 * Article: the answer first ("in short"), contents, body, FAQ, then how we
 * can help (the related services), what to read next and the CTA.
 */
export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const post = getPost(lang, slug);
  if (!post) notFound();
  const dict = await getDictionary(lang);
  const b = dict.blog;
  const category = b.categories[post.category];
  const services = post.services
    .map((s) => dict.services.items.find((x) => x.slug === s))
    .filter((x) => x !== undefined);
  const related = relatedPosts(lang, post, 3);
  const primary = (post.services[0] ?? "consulting") as ServiceSlug;
  const date = new Intl.DateTimeFormat(localeMeta[lang].hreflang, { dateStyle: "long" }).format(new Date(post.date));
  const toc = post.headings.filter((h) => h.level === 2);

  return (
    <main>
      <JsonLd data={blogPostJsonLd({ lang, post, section: category })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: `/${lang}` },
          { name: b.meta.title, path: `/${lang}/blog` },
          { name: category, path: `/${lang}/blog/category/${post.category}` },
          { name: post.title, path: `/${lang}/blog/${slug}` },
        ])}
      />
      {post.faq.length ? <JsonLd data={faqJsonLd(post.faq)} /> : null}

      <article>
        <header className="shell pb-10 pt-32 sm:pt-40">
          <nav aria-label="Breadcrumbs">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
              <li>
                <Link href={`/${lang}`} className="hover:text-violet">
                  {dict.common.home}
                </Link>
              </li>
              <li aria-hidden className="text-lilac">/</li>
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-violet">
                  {b.meta.title}
                </Link>
              </li>
              <li aria-hidden className="text-lilac">/</li>
              <li>
                <Link href={`/${lang}/blog/category/${post.category}`} className="text-violet hover:text-deep">
                  {category}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.25rem,5.4vw,5rem)] font-extrabold leading-[1] tracking-[-0.04em]">
            {post.title}
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-display font-bold text-muted">
            <span>{b.levels[post.level]}</span>
            <Spark className="size-3 text-lilac" />
            <span className="type-accent">
              {post.minutes} {b.minutes}
            </span>
            <Spark className="size-3 text-lilac" />
            <time dateTime={post.date}>
              {b.updated} {date}
            </time>
          </p>
        </header>

        {/* The answer first. */}
        <section data-tone="dark" className="px-2 sm:px-3">
          <div className="rounded-[clamp(2rem,4vw,3.5rem)] bg-violet text-white">
            <div className="shell py-10 sm:py-14">
              <p className="font-display text-lg font-bold text-mist">{b.summary}</p>
              <p className="mt-3 max-w-4xl font-display text-[clamp(1.4rem,2.6vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.025em]">
                {post.summary}
              </p>
            </div>
          </div>
        </section>

        <div className="shell grid gap-12 pt-14 sm:pt-20 lg:grid-cols-12">
          {toc.length > 2 ? (
            <aside className="lg:col-span-3">
              <nav aria-label={b.toc} className="lg:sticky lg:top-28">
                <p className="font-display text-lg font-extrabold">{b.toc}</p>
                <ol className="mt-4 flex flex-col gap-2 border-l-2 border-mist pl-4">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block leading-snug text-muted transition-colors hover:text-violet">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
          <div className={toc.length > 2 ? "min-w-0 lg:col-span-8 lg:col-start-5" : "min-w-0 lg:col-span-8 lg:col-start-3"}>
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.faq.length ? (
              <section className="mt-16">
                <h2 className="type-title slant">{b.faq}</h2>
                <Accordion type="single" collapsible defaultValue="faq-0" className="mt-8 flex flex-col gap-3">
                  {post.faq.map((f, i) => (
                    <AccordionItem key={f.question} value={`faq-${i}`}>
                      <AccordionTrigger>{f.question}</AccordionTrigger>
                      <AccordionContent>{f.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      {/* How we can help: the services this article leads to. */}
      {services.length ? (
        <section className="shell pt-[clamp(4.5rem,10vw,8rem)]">
          <div className="grid gap-8 border-t-2 border-ink pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="type-title slant">{b.helpTitle}</h2>
              <p className="type-lead mt-5 text-muted">{b.helpLead}</p>
              <ContactCta lang={lang} label={dict.nav.cta} service={serviceMeta[primary].form} className="mt-8" />
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {services.map((s, i) => (
                <Reveal as="li" key={s.slug} delay={i * 0.06}>
                  <Link
                    href={`/${lang}/services/${s.slug}`}
                    className="group flex h-full flex-col rounded-[1.75rem] bg-night p-7 text-white transition-[translate] duration-500 hover:-translate-y-1"
                  >
                    <Icon
                      name={serviceMeta[s.slug as ServiceSlug].icon}
                      className="size-9 text-lilac transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110"
                    />
                    <span className="mt-6 font-display text-2xl font-extrabold leading-tight tracking-[-0.03em]">{s.title}</span>
                    <span className="mt-2 text-dim">{s.subtitle}</span>
                    <span className="mt-auto flex items-center gap-2 pt-6 font-display font-bold text-lilac">
                      {dict.services.more}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="shell pt-[clamp(4.5rem,10vw,8rem)]">
          <h2 className="type-title slant">{b.related}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <PostCard lang={lang} post={r} labels={b} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand
        lang={lang}
        title={dict.contact.title}
        lead={dict.contact.lead}
        cta={dict.nav.cta}
        service={serviceMeta[primary].form}
      />
    </main>
  );
}
