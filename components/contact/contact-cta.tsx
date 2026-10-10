import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { FormService } from "@/lib/content";
import { briefHref } from "@/lib/links";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Opens the brief page with a service preselected. */
export function ContactCta({
  lang,
  label,
  service,
  size = "xl",
  variant = "primary",
  className,
}: {
  lang: Locale;
  label: string;
  service?: FormService;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
}) {
  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href={briefHref(lang, service)}>
        {label}
        <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
      </Link>
    </Button>
  );
}
