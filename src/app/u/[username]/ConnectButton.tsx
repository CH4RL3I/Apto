"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { requestConnection } from "@/app/(student)/connections/actions";

export function ConnectButton({
  recipientUserId,
}: {
  recipientUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        await requestConnection(recipientUserId);
        setDone(true);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-pale-sage px-3 py-1.5 text-[13px] font-semibold text-sage-700">
        Request sent
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Sending…" : "Connect"}
      </Button>
      {error && <span className="text-xs text-coral-700">{error}</span>}
    </div>
  );
}
