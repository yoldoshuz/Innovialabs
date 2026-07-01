"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

/** Accessible single-open accordion with animated height. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface/40">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={index} className="px-5 sm:px-7">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium transition-colors hover:text-primary sm:text-lg"
              >
                <span className="text-pretty">{item.question}</span>
                <Plus
                  className={cn(
                    "size-5 shrink-0 text-muted transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen && "rotate-45 text-primary",
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-8 text-pretty leading-relaxed text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
