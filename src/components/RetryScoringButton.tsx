"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RetryScoringButton({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function retry() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/score-submission", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Scoring failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scoring failed");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={retry}
        disabled={busy}
        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-coral bg-coral-100 px-3 py-1 text-xs font-semibold text-coral-700 transition-colors hover:bg-coral hover:text-chalk disabled:opacity-50"
      >
        {busy ? "Scoring…" : "Retry scoring"}
      </button>
      {error && <span className="text-[10px] text-coral-700">{error}</span>}
    </div>
  );
}
