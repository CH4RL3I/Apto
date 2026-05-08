interface Props {
  label: string;
  text: string;
  tone?: "default" | "success" | "error";
  className?: string;
}

export function InsightBox({ label, text, tone = "default", className = "" }: Props) {
  const toneClasses =
    tone === "success"
      ? "bg-pale-sage border-sage/30"
      : tone === "error"
      ? "bg-coral-100 border-coral/30"
      : "bg-pale-sage border-sage/25";
  const labelClasses =
    tone === "error" ? "text-coral-700" : "text-sage-700";
  const textClasses =
    tone === "error" ? "text-coral-700" : "text-charcoal";
  return (
    <div className={`rounded-lg border px-4 py-3 ${toneClasses} ${className}`}>
      <div
        className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-1 ${labelClasses}`}
      >
        {label}
      </div>
      <div
        className={`text-[13px] leading-relaxed ${textClasses}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
