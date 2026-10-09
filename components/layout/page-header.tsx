import Link from "next/link";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { GiantTitle } from "@/components/motion/giant-title";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href: string };

/** Inner-page opening: breadcrumbs, giant H1, lead. */
export function PageHeader({
  title,
  lead,
  crumbs,
  children,
  titleClassName,
}: {
  title: string;
  lead?: string;
  crumbs: Crumb[];
  children?: React.ReactNode;
  titleClassName?: string;
}) {
  return (
    <header className="shell pb-12 pt-32 sm:pt-40 lg:pb-16">
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
      <nav aria-label="Breadcrumbs">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className="transition-colors hover:text-violet">
                      {crumb.label}
                    </Link>
                    <span aria-hidden className="text-lilac">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <GiantTitle as="h1" className={cn("mt-6", titleClassName)}>
        {title}
      </GiantTitle>

      {lead ? (
        <Reveal delay={0.2}>
          <p className="type-lead mt-8 max-w-3xl text-muted">{lead}</p>
        </Reveal>
      ) : null}
      {children}
    </header>
  );
}
