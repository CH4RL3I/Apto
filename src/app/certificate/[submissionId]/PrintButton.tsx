"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="focus-ring rounded-full border border-sage bg-sage px-4 py-2 text-xs font-semibold text-chalk shadow-1 transition-colors hover:bg-sage-700"
    >
      Print or save as PDF
    </button>
  );
}
