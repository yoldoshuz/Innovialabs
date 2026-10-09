"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Accordion (Radix) with brand styling: big rows, a "+" that turns
 * into "×", and height animated via Radix CSS variables.
 */
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "rounded-3xl bg-paper transition-colors duration-300 data-[state=open]:bg-mist",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between gap-6 px-6 py-6 text-left font-display text-lg font-bold tracking-[-0.01em] sm:px-8 sm:text-xl",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white text-violet transition-[transform,background-color,color] duration-500 ease-[var(--ease-spring)] group-hover:scale-110 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-violet group-data-[state=open]:text-white"
      >
        <span className="absolute h-0.5 w-4 rounded-full bg-current" />
        <span className="absolute h-4 w-0.5 rounded-full bg-current" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="accordion-content"
    {...props}
  >
    <div
      className={cn(
        "max-w-3xl px-6 pb-7 text-muted sm:px-8 sm:text-lg",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
