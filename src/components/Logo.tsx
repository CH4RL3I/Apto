import Image from "next/image";

type LogoVariant = "lockup" | "mark" | "dark";

const SOURCES: Record<LogoVariant, { src: string; w: number; h: number }> = {
  lockup: { src: "/brand/logo-full-v3.png", w: 1200, h: 400 },
  mark: { src: "/brand/logo-mark-v3.png", w: 512, h: 512 },
  dark: { src: "/brand/logo-mark-transparent-v3.png", w: 512, h: 512 },
};

interface LogoProps {
  variant?: LogoVariant;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function Logo({
  variant = "lockup",
  height = 28,
  priority = false,
  className,
}: LogoProps) {
  const { src, w, h } = SOURCES[variant];
  const width = Math.round((w / h) * height);
  return (
    <Image
      src={src}
      alt="Apto"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
