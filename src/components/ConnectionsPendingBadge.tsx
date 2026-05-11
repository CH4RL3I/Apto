"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ConnectionsPendingBadge({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;

      const channel = supabase
        .channel("connections-pending-badge")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "connections" },
          async () => {
            if (!userId) return;
            const { count: fresh } = await supabase
              .from("connections")
              .select("id", { count: "exact", head: true })
              .eq("recipient_id", userId)
              .eq("status", "pending");
            setCount(fresh ?? 0);
          },
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }

    const cleanup = init();
    return () => { cleanup.then((fn) => fn?.()); };
  }, []);

  if (count <= 0) return null;

  return (
    <span
      aria-label={`${count} pending connection request${count === 1 ? "" : "s"}`}
      className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold leading-[18px] text-chalk"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
