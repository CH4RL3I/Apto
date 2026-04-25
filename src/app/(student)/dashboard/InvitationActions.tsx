"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/Button";
import { respondToInvitation } from "./actions";

export function InvitationActions({ invitationId }: { invitationId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function respond(response: "accepted" | "declined") {
    setError(null);
    startTransition(async () => {
      const result = await respondToInvitation(invitationId, response);
      if (!result.ok) setError(result.error ?? "Could not update invitation.");
    });
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => respond("accepted")}
        disabled={pending}
      >
        {pending ? "Saving…" : "Accept"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => respond("declined")}
        disabled={pending}
      >
        Decline
      </Button>
      {error && <span className="text-xs text-coral-700">{error}</span>}
    </div>
  );
}
