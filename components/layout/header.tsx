"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import type { NavDict } from "@/types";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

export function Header({ lang, dict }: { lang: Locale; dict: NavDict }) {
  const scrolled = useScrolled(16);
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href={`/${lang}`} aria-label={`${lang} — home`}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {dict.links.map((link) => (
            <Link
              key={link.href}
              href={`/${lang}${link.href}`}
              className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher current={lang} />
          <Link
            href={`/${lang}/contacts`}
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            {dict.cta}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={dict.menu}
            className="grid size-10 place-items-center rounded-full border border-border-strong text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex h-16 items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={dict.close}
                className="grid size-10 place-items-center rounded-full border border-border-strong"
              >
                <X className="size-5" />
              </button>
            </Container>
            <nav className="flex flex-col gap-1 px-6 pt-8">
              {dict.links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={`/${lang}${link.href}`}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-border py-4 text-2xl font-medium text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={`/${lang}/contacts`}
                onClick={() => setMenuOpen(false)}
                className={cn(buttonVariants({ size: "lg" }), "mt-8")}
              >
                {dict.cta}
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
