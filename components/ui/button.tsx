import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button tuned to the brand: pill shape, Violet primary with Deep
 * hover (guideline p.08). `asChild` renders the styles onto a Link/anchor.
 */
export const buttonVariants = cva(
  // Long labels wrap on phones (min-h, not h); one line from sm up.
  "group/btn relative inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-full text-center font-display font-bold leading-tight tracking-[-0.01em] transition-[background-color,color,transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 sm:whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-violet text-white hover:bg-deep hover:shadow-[0_18px_40px_-18px_var(--color-violet)]",
        night: "bg-night text-white hover:bg-ink",
        white: "bg-white text-ink hover:bg-mist",
        soft: "bg-mist text-violet hover:bg-lilac hover:text-white",
        ghost: "text-ink hover:bg-paper",
        "ghost-dark": "text-white hover:bg-white/10",
      },
      size: {
        sm: "min-h-10 px-5 py-2 text-sm [&_svg]:size-4",
        md: "min-h-12 px-6 py-2.5 text-[0.95rem] [&_svg]:size-4",
        lg: "min-h-14 px-7 py-3 text-base sm:px-8 [&_svg]:size-5",
        xl: "min-h-14 px-7 py-3 text-base sm:min-h-16 sm:px-10 sm:text-lg [&_svg]:size-5",
        icon: "size-12 [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
