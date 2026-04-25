import Link from "next/link";
import { type ComponentProps, forwardRef, type ReactNode } from "react";

type Variant = "primary" | "coral" | "ghost" | "text";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sage text-chalk hover:bg-sage-700 shadow-1 hover:shadow-2 disabled:opacity-50 disabled:hover:bg-sage disabled:hover:shadow-1",
  coral:
    "bg-coral text-chalk hover:bg-coral-700 shadow-1 hover:shadow-2 disabled:opacity-50 disabled:hover:bg-coral disabled:hover:shadow-1",
  ghost:
    "bg-transparent text-charcoal border border-sage-mist-2 hover:bg-pale-sage disabled:opacity-50",
  text:
    "bg-transparent text-sage hover:underline px-2 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-[13px] px-3 py-1.5 rounded-lg",
  md: "text-sm px-[18px] py-2.5 rounded-[10px]",
  lg: "text-[15px] px-[22px] py-3.5 rounded-xl",
};

const baseClasses =
  "focus-ring inline-flex items-center justify-center gap-1.5 font-semibold transition-all disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

export const Button = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & CommonProps
>(function Button(
  { variant = "primary", size = "md", icon, className = "", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & CommonProps) {
  return (
    <Link
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </Link>
  );
}
