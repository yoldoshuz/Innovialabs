"use client";

import * as React from "react";
import { CheckCircle2, Send } from "lucide-react";
import type { CtaDict } from "@/types";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl border border-border-strong bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-primary/60 focus:outline-none";

/**
 * Contact form with a local success state. Placeholder — no backend yet;
 * swap `onSubmit` for a real handler / Server Action.
 */
export function ContactForm({ dict }: { dict: CtaDict["form"] }) {
  const [sent, setSent] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-primary/30 bg-background/40 p-8 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="text-lg font-medium">{dict.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-background/40 p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.name}>
          <input
            required
            name="name"
            placeholder={dict.namePlaceholder}
            className={inputClass}
          />
        </Field>
        <Field label={dict.email}>
          <input
            required
            type="email"
            name="email"
            placeholder={dict.emailPlaceholder}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label={dict.company}>
        <input
          name="company"
          placeholder={dict.companyPlaceholder}
          className={inputClass}
        />
      </Field>
      <Field label={dict.message}>
        <textarea
          required
          name="message"
          rows={4}
          placeholder={dict.messagePlaceholder}
          className={`${inputClass} resize-none`}
        />
      </Field>
      <Button type="submit" size="lg" className="mt-2 w-full">
        {dict.submit}
        <Send />
      </Button>
      <p className="text-center text-xs text-subtle">{dict.privacy}</p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
