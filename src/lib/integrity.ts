// Composite integrity verdict for proctored submissions.
//
// Companies want a fast read on whether to trust a submission. The detail
// view still shows raw counts, but the badge is what they scan for first.

export type IntegrityVerdict = "green" | "yellow" | "red";

export interface IntegritySignals {
  tab_switches?: number;
  paste_count?: number;
  fullscreen_exits?: number;
  time_spent_seconds?: number;
}

export function integrityVerdict(signals: IntegritySignals | null | undefined): IntegrityVerdict {
  const tab = signals?.tab_switches ?? 0;
  const paste = signals?.paste_count ?? 0;
  const fs = signals?.fullscreen_exits ?? 0;
  if (tab >= 5 || paste >= 3 || fs >= 3) return "red";
  if (tab > 0 || paste > 0 || fs > 0) return "yellow";
  return "green";
}

export const INTEGRITY_LABEL: Record<IntegrityVerdict, string> = {
  green: "Clean run",
  yellow: "Minor signals",
  red: "Review carefully",
};

export const INTEGRITY_DESCRIPTION: Record<IntegrityVerdict, string> = {
  green: "No tab switches, pastes, or fullscreen exits.",
  yellow: "Some signals detected. Likely benign.",
  red: "Repeated signals. Investigate before shortlisting.",
};
