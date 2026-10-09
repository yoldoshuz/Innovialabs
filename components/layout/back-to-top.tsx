"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/lib/lenis";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="group inline-flex items-center gap-2 font-semibold text-white"
    >
      {label}
      <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-[background-color,transform] duration-300 group-hover:-translate-y-1 group-hover:bg-violet">
        <ArrowUp className="size-4" />
      </span>
    </button>
  );
}
