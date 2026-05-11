"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { requestConnection } from "@/app/(student)/connections/actions";
import { Pill } from "@/components/ui/Pill";

const CLUSTER_LABELS: Record<string, string> = {
  product_management: "Product",
  data_analytics: "Data & Analytics",
  sports_industry: "Sports Industry",
  design: "Design",
  sales_gtm: "Sales & GTM",
  media_production: "Media",
  hospitality: "Hospitality",
  consulting: "Consulting",
  engineering: "Engineering",
  finance_banking: "Finance",
};

interface Peer {
  userId: string;
  name: string;
  avatarUrl: string | null;
  university: string | null;
  categories: string[];
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function ConnectButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleConnect() {
    setError(null);
    startTransition(async () => {
      try {
        await requestConnection(userId);
        setSent(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  if (sent) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-sage-mist-2 bg-pale-sage px-3 py-1.5 text-xs font-semibold text-sage">
        <Check className="h-3.5 w-3.5" strokeWidth={2} />
        Pending
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isPending}
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-sage-mist-2 bg-chalk px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-pale-sage transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Sending…
          </>
        ) : (
          "Connect"
        )}
      </button>
      {error && <p className="text-[11px] text-coral mt-1">{error}</p>}
    </div>
  );
}

export function PeerSuggestionsSection({ caseStudyId }: { caseStudyId: string }) {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      // Fetch users who completed the same challenge
      const { data: completedSubs } = await supabase
        .from("submissions")
        .select("user_id")
        .eq("case_study_id", caseStudyId)
        .in("status", ["scored", "reviewed", "shortlisted", "submitted"])
        .neq("user_id", user.id)
        .limit(20);

      if (!completedSubs || completedSubs.length === 0 || cancelled) {
        setLoading(false);
        return;
      }

      const candidateIds = [...new Set(completedSubs.map((s) => s.user_id as string))];

      // Fetch my connections to exclude
      const { data: myConns } = await supabase
        .from("connections")
        .select("requester_id, recipient_id")
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

      const connectedIds = new Set(
        (myConns ?? []).map((c) =>
          c.requester_id === user.id ? c.recipient_id : c.requester_id,
        ),
      );

      const unconnected = candidateIds.filter((id) => !connectedIds.has(id)).slice(0, 3);
      if (unconnected.length === 0 || cancelled) {
        setLoading(false);
        return;
      }

      // Fetch user data and profiles
      const [usersRes, profilesRes] = await Promise.all([
        supabase.from("users").select("id, name, avatar_url").in("id", unconnected),
        supabase
          .from("profiles")
          .select("user_id, university, cv_skills")
          .in("user_id", unconnected),
      ]);

      if (cancelled) return;

      const userMap = new Map(
        ((usersRes.data ?? []) as { id: string; name: string | null; avatar_url: string | null }[]).map(
          (u) => [u.id, u],
        ),
      );
      const profileMap = new Map(
        ((profilesRes.data ?? []) as {
          user_id: string;
          university: string | null;
          cv_skills: string[] | null;
        }[]).map((p) => [p.user_id, p]),
      );

      const result: Peer[] = unconnected.map((uid) => {
        const u = userMap.get(uid);
        const p = profileMap.get(uid);
        return {
          userId: uid,
          name: u?.name ?? "Apto member",
          avatarUrl: u?.avatar_url ?? null,
          university: p?.university ?? null,
          categories: (p?.cv_skills ?? []).slice(0, 2),
        };
      });

      setPeers(result);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [caseStudyId]);

  if (loading || peers.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
      <h3 className="text-sm font-bold text-charcoal mb-1">
        Students who completed this challenge
      </h3>
      <p className="text-xs text-charcoal-2 mb-4">Connect to follow each other&apos;s progress.</p>
      <div className="space-y-3">
        {peers.map((peer) => (
          <div
            key={peer.userId}
            className="flex items-center gap-3 rounded-[10px] border border-sage-mist-2 p-3"
          >
            <div className="h-8 w-8 shrink-0 rounded-full bg-pale-sage flex items-center justify-center text-sage text-xs font-bold">
              {peer.avatarUrl ? (
                <img
                  src={peer.avatarUrl}
                  alt={peer.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                initials(peer.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-charcoal">{peer.name}</p>
              {peer.university && (
                <p className="text-xs text-charcoal-2">{peer.university}</p>
              )}
            </div>
            <ConnectButton userId={peer.userId} />
          </div>
        ))}
      </div>
    </div>
  );
}
