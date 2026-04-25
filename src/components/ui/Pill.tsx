import { type ReactNode } from "react";

type Variant = "mist" | "sage" | "sageSolid" | "coral" | "coralSolid";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  mist: "bg-chalk-2 text-charcoal-2 border border-sage-mist-2",
  sage: "bg-pale-sage text-sage-700",
  sageSolid: "bg-sage text-chalk",
  coral: "bg-coral-100 text-coral-700",
  coralSolid: "bg-coral text-chalk",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

interface PillProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Pill({
  variant = "mist",
  size = "md",
  icon,
  className = "",
  children,
}: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold leading-snug whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
