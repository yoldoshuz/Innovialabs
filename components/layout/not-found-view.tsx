"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { GiantTitle } from "@/components/motion/giant-title";

type Copy = { title: string; text: string; home: string };

export function NotFoundView({ copy }: { copy: Record<Locale, Copy> }) {
  const segment = (usePathname() || "").split("/")[1] ?? "";
  const lang: Locale = isLocale(segment) ? segment : i18n.defaultLocale;
  const t = copy[lang];

  return (
    <main className="shell flex min-h-[80dvh] flex-col justify-center pb-16 pt-36">
      <GiantTitle as="h1" className="text-[clamp(8rem,30vw,22rem)] text-violet">
        {t.title}
      </GiantTitle>
      <p className="type-lead mt-6 max-w-xl text-muted">{t.text}</p>
      <div className="mt-10">
        <Button asChild size="xl">
          <Link href={`/${lang}`}>
            <ArrowLeft />
            {t.home}
          </Link>
        </Button>
      </div>
    </main>
  );
}
