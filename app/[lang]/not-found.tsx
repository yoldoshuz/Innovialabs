import Link from "next/link";
import { i18n } from "@/lib/i18n/config";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
      <span className="font-mono text-7xl font-semibold text-gradient sm:text-9xl">
        404
      </span>
      <p className="max-w-md text-pretty text-muted">
        Страница не найдена / Page not found / Sahifa topilmadi
      </p>
      <Link href={`/${i18n.defaultLocale}`} className={buttonVariants()}>
        На главную
      </Link>
    </Container>
  );
}
