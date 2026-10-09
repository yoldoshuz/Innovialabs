"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ContactIntent } from "@/lib/contact-intent";
import { requestContact } from "@/lib/contact-intent";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Jumps to the page's #contact form and preselects a service there.
 * Works without JS too (plain anchor link).
 */
export function ContactCta({
  label,
  intent,
  size = "xl",
  variant = "primary",
  className,
}: {
  label: string;
  intent: ContactIntent;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
}) {
  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href="#contact" onClick={() => requestContact(intent)}>
        {label}
        <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
      </Link>
    </Button>
  );
}
