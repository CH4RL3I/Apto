"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { setStatus } from "../../candidates/actions";

export function RejectButton({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handle() {
    if (!confirm("Reject this candidate? They won't be deleted; the submission will be marked rejected.")) {
      return;
    }
    startTransition(async () => {
      await setStatus(submissionId, "rejected");
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="md" onClick={handle} disabled={pending}>
      {pending ? "Rejecting…" : "Reject"}
    </Button>
  );
}
