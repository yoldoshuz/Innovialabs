import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { CtaBandDict } from "@/types";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Reusable closing call-to-action band shown near the bottom of inner pages. */
export function CtaBand({ lang, dict }: { lang: Locale; dict: CtaBandDict }) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface-2/80 to-surface/30 px-6 py-14 text-center sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {dict.title}
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {dict.subtitle}
            </p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href={`/${lang}/contacts`}
                className={cn(buttonVariants({ size: "lg" }), "group")}
              >
                {dict.primary}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/${lang}/cases`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {dict.secondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
