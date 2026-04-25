import { type HTMLAttributes, type ReactNode } from "react";

type Tone = "chalk" | "paleSage";
type Pad = "sm" | "md" | "lg";

const toneClasses: Record<Tone, string> = {
  chalk: "bg-chalk",
  paleSage: "bg-pale-sage",
};

const padClasses: Record<Pad, string> = {
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  pad?: Pad;
  hover?: boolean;
  children: ReactNode;
}

export function Card({
  tone = "paleSage",
  pad = "md",
  hover = true,
  className = "",
  children,
  ...rest
}: CardProps) {
  const hoverClasses = hover ? "shadow-1 hover:shadow-2 transition-shadow" : "shadow-1";
  return (
    <div
      className={`rounded-[14px] ${hoverClasses} ${toneClasses[tone]} ${padClasses[pad]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
