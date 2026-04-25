"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { saveNotes, setStatus, type ReviewStatus } from "../actions";

interface Props {
  submissionId: string;
  initialNotes: string;
  initialStatus: string;
}

export function ReviewControls({ submissionId, initialNotes, initialStatus }: Props) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [status, setLocalStatus] = useState(initialStatus);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSaveNotes() {
    setError(null);
    startTransition(async () => {
      try {
        await saveNotes(submissionId, notes);
        setSavedAt(new Date());
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  function handleStatus(next: ReviewStatus) {
    setError(null);
    startTransition(async () => {
      try {
        await setStatus(submissionId, next);
        setLocalStatus(next);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Status update failed");
      }
    });
  }

  return (
    <div className="bg-chalk rounded-[14px] shadow-1 p-5 space-y-4">
      <div>
        <h3 className="eyebrow mb-3">Review</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-charcoal-2">Current status</span>
          <Pill
            variant={
              status === "shortlisted"
                ? "sageSolid"
                : status === "rejected"
                ? "coralSolid"
                : status === "reviewed"
                ? "coral"
                : "mist"
            }
            size="sm"
          >
            <span className="capitalize">{status.replace(/_/g, " ")}</span>
          </Pill>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={pending || status === "shortlisted"}
            onClick={() => handleStatus("shortlisted")}
          >
            Shortlist
          </Button>
          <Button
            type="button"
            variant="coral"
            size="sm"
            disabled={pending || status === "rejected"}
            onClick={() => handleStatus("rejected")}
          >
            Reject
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending || status === "reviewed"}
            onClick={() => handleStatus("reviewed")}
          >
            Mark reviewed
          </Button>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-charcoal mb-1.5">
          Notes
        </label>
        <textarea
          id="notes"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Private notes for your hiring team."
          className="w-full px-3 py-2 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
        />
        <div className="flex items-center justify-between mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={handleSaveNotes}
          >
            {pending ? "Saving…" : "Save notes"}
          </Button>
          {savedAt && (
            <span className="text-xs text-charcoal-3">Saved {savedAt.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-coral-700">{error}</p>}
    </div>
  );
}
