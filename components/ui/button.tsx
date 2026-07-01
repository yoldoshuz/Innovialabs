import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button styles as a `cva` recipe so they can be applied to a native
 * `<button>` (via `<Button>`) or to a `<Link>`/`<a>` (via `buttonVariants`).
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-background font-semibold hover:bg-primary-strong hover:shadow-[0_0_40px_-8px_var(--color-primary)] hover:-translate-y-0.5",
        secondary:
          "bg-elevated text-foreground border border-border-strong hover:border-primary/50 hover:bg-surface-2 hover:-translate-y-0.5",
        outline:
          "border border-border-strong text-foreground hover:border-primary/60 hover:text-primary hover:-translate-y-0.5",
        ghost: "text-muted hover:text-foreground hover:bg-surface-2",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
