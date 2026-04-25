"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteCaseStudy } from "./actions";

export function DeleteCaseStudyButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteCaseStudy(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={pending}
        icon={<Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
      >
        {pending ? "Deleting…" : "Delete"}
      </Button>
      {error && <span className="text-xs text-coral-700">{error}</span>}
    </div>
  );
}
