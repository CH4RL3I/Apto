import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { ConnectionsClient } from "./ConnectionsClient";

export const CLUSTER_LABELS: Record<string, string> = {
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

const clusterMap = new Map(CASE_STUDIES.map((cs) => [cs.id, cs.cluster]));

function challengeCategories(submissions: { case_study_id: string }[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of submissions) {
    const cluster = clusterMap.get(s.case_study_id);
    if (cluster && !seen.has(cluster)) {
      seen.add(cluster);
      result.push(CLUSTER_LABELS[cluster] ?? cluster);
    }
    if (result.length >= 3) break;
  }
  return result;
}

export interface ConnectionPeer {
  connectionId: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  university: string | null;
  yearOfStudy: string | null;
  careerInterests: string[];
  challengeCategories: string[];
  mutualCount: number;
  headline: string | null;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  description: string;
  createdAt: string;
}

export interface DiscoverPerson {
  userId: string;
  name: string;
  avatarUrl: string | null;
  university: string | null;
  yearOfStudy: string | null;
  careerInterests: string[];
  challengeCategories: string[];
  sharedCount: number;
  isPending: boolean;
}

export default async function ConnectionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. All my connections
  const { data: rawConns } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status, created_at")
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const myConns = (rawConns ?? []) as {
    id: string;
    requester_id: string;
    recipient_id: string;
    status: string;
    created_at: string;
  }[];

  const peerOf = (c: { requester_id: string; recipient_id: string }) =>
    c.requester_id === user.id ? c.recipient_id : c.requester_id;

  const allPeerIds = [...new Set(myConns.map(peerOf))];

  // 2. User + profile data for all peers
  const [usersResult, profilesResult] = await Promise.all([
    allPeerIds.length
      ? supabase.from("users").select("id, name, avatar_url").in("id", allPeerIds)
      : Promise.resolve({ data: [] }),
    allPeerIds.length
      ? supabase
          .from("profiles")
          .select("user_id, university, year_of_study, career_interests, headline")
          .in("user_id", allPeerIds)
      : Promise.resolve({ data: [] }),
  ]);

  type UserRow = { id: string; name: string | null; avatar_url: string | null };
  type ProfileRow = {
    user_id: string;
    university: string | null;
    year_of_study: string | null;
    career_interests: string[] | null;
    headline: string | null;
  };

  const userMap = new Map<string, UserRow>(
    ((usersResult.data ?? []) as UserRow[]).map((u) => [u.id, u]),
  );
  const profileMap = new Map<string, ProfileRow>(
    ((profilesResult.data ?? []) as ProfileRow[]).map((p) => [p.user_id, p]),
  );

  // 3. Submissions for all peers
  const { data: peerSubs } = allPeerIds.length
    ? await supabase
        .from("submissions")
        .select("user_id, case_study_id, status")
        .in("user_id", allPeerIds)
        .in("status", ["scored", "reviewed", "shortlisted", "submitted"])
    : { data: [] };

  const peerSubsMap = new Map<string, { case_study_id: string }[]>();
  for (const s of peerSubs ?? []) {
    const key = s.user_id as string;
    if (!peerSubsMap.has(key)) peerSubsMap.set(key, []);
    peerSubsMap.get(key)!.push({ case_study_id: s.case_study_id as string });
  }

  // 4. My own submissions (for discover overlap)
  const { data: mySubs } = await supabase
    .from("submissions")
    .select("case_study_id, status")
    .eq("user_id", user.id)
    .in("status", ["scored", "reviewed", "shortlisted", "submitted"]);

  const myCategories = new Set(
    (mySubs ?? []).map((s) => clusterMap.get(s.case_study_id as string)).filter(Boolean),
  );

  // 5. Mutual connections count
  const acceptedPeerIds = myConns
    .filter((c) => c.status === "accepted")
    .map(peerOf);

  const mutualCountMap = new Map<string, number>();
  if (acceptedPeerIds.length > 0) {
    const { data: peerConnsData } = await supabase
      .from("connections")
      .select("requester_id, recipient_id")
      .eq("status", "accepted")
      .or(
        `requester_id.in.(${acceptedPeerIds.join(",")}),recipient_id.in.(${acceptedPeerIds.join(",")})`,
      );

    const myAcceptedSet = new Set(acceptedPeerIds);
    for (const peerId of acceptedPeerIds) {
      const peerConns = (peerConnsData ?? []).filter(
        (c) => c.requester_id === peerId || c.recipient_id === peerId,
      );
      const peerConnectedIds = new Set(
        peerConns.map((c) =>
          c.requester_id === peerId ? c.recipient_id : c.requester_id,
        ),
      );
      let mutual = 0;
      for (const otherId of myAcceptedSet) {
        if (otherId !== peerId && peerConnectedIds.has(otherId)) mutual++;
      }
      mutualCountMap.set(peerId, mutual);
    }
  }

  // 6. Build accepted connections list
  const acceptedConns: ConnectionPeer[] = myConns
    .filter((c) => c.status === "accepted")
    .map((c) => {
      const peerId = peerOf(c);
      const u = userMap.get(peerId);
      const p = profileMap.get(peerId);
      return {
        connectionId: c.id,
        userId: peerId,
        name: u?.name ?? "Apto member",
        avatarUrl: u?.avatar_url ?? null,
        university: p?.university ?? null,
        yearOfStudy: p?.year_of_study ?? null,
        careerInterests: p?.career_interests ?? [],
        challengeCategories: challengeCategories(peerSubsMap.get(peerId) ?? []),
        mutualCount: mutualCountMap.get(peerId) ?? 0,
        headline: p?.headline ?? null,
      };
    });

  // 7. Incoming pending requests
  const incomingPending: ConnectionPeer[] = myConns
    .filter((c) => c.status === "pending" && c.recipient_id === user.id)
    .map((c) => {
      const peerId = c.requester_id;
      const u = userMap.get(peerId);
      const p = profileMap.get(peerId);
      return {
        connectionId: c.id,
        userId: peerId,
        name: u?.name ?? "Apto member",
        avatarUrl: u?.avatar_url ?? null,
        university: p?.university ?? null,
        yearOfStudy: p?.year_of_study ?? null,
        careerInterests: p?.career_interests ?? [],
        challengeCategories: challengeCategories(peerSubsMap.get(peerId) ?? []),
        mutualCount: 0,
        headline: p?.headline ?? null,
      };
    });

  // 8. Activity feed
  let activityItems: ActivityItem[] = [];
  if (acceptedPeerIds.length > 0) {
    const { data: actRows } = await supabase
      .from("connection_activity")
      .select("id, user_id, description, created_at")
      .in("user_id", acceptedPeerIds)
      .order("created_at", { ascending: false })
      .limit(20);

    activityItems = (actRows ?? []).map((row) => {
      const u = userMap.get(row.user_id as string);
      return {
        id: row.id as string,
        userId: row.user_id as string,
        userName: u?.name ?? "Apto member",
        userAvatarUrl: u?.avatar_url ?? null,
        description: row.description as string,
        createdAt: row.created_at as string,
      };
    });
  }

  // 9. Discover profiles
  const excludedIds = new Set([user.id, ...allPeerIds]);

  const { data: rawDiscover } = await supabase
    .from("profiles")
    .select(
      "user_id, is_public, university, year_of_study, career_interests, headline, created_at",
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(60);

  const discoverCandidates = (
    (rawDiscover ?? []) as {
      user_id: string;
      university: string | null;
      year_of_study: string | null;
      career_interests: string[] | null;
      headline: string | null;
    }[]
  ).filter((p) => !excludedIds.has(p.user_id));

  const discoverUserIds = discoverCandidates.map((p) => p.user_id);

  const [discoverUsersResult, discoverSubsResult] = await Promise.all([
    discoverUserIds.length
      ? supabase.from("users").select("id, name, avatar_url").in("id", discoverUserIds)
      : Promise.resolve({ data: [] }),
    discoverUserIds.length
      ? supabase
          .from("submissions")
          .select("user_id, case_study_id, status")
          .in("user_id", discoverUserIds)
          .in("status", ["scored", "reviewed", "shortlisted", "submitted"])
      : Promise.resolve({ data: [] }),
  ]);

  const discoverUserMap = new Map<string, UserRow>(
    ((discoverUsersResult.data ?? []) as UserRow[]).map((u) => [u.id, u]),
  );

  const discoverSubsMap = new Map<string, { case_study_id: string }[]>();
  for (const s of discoverSubsResult.data ?? []) {
    const key = s.user_id as string;
    if (!discoverSubsMap.has(key)) discoverSubsMap.set(key, []);
    discoverSubsMap.get(key)!.push({ case_study_id: s.case_study_id as string });
  }

  const pendingIds = new Set(
    myConns
      .filter((c) => c.status === "pending" && c.requester_id === user.id)
      .map(peerOf),
  );

  const discoverPersons: DiscoverPerson[] = discoverCandidates
    .map((p) => {
      const u = discoverUserMap.get(p.user_id);
      const subs = discoverSubsMap.get(p.user_id) ?? [];
      const cats = challengeCategories(subs);
      const peerClusters = new Set(
        subs.map((s) => clusterMap.get(s.case_study_id)).filter(Boolean),
      );
      const sharedCount = [...peerClusters].filter((c) => myCategories.has(c)).length;
      return {
        userId: p.user_id,
        name: u?.name ?? "Apto member",
        avatarUrl: u?.avatar_url ?? null,
        university: p.university ?? null,
        yearOfStudy: p.year_of_study ?? null,
        careerInterests: p.career_interests ?? [],
        challengeCategories: cats,
        sharedCount,
        isPending: pendingIds.has(p.user_id),
      };
    })
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, 24);

  // Distinct universities for autocomplete
  const universities = [
    ...new Set(
      [...discoverCandidates]
        .map((p) => p.university)
        .filter((u): u is string => !!u),
    ),
  ].sort();

  const allClusters = Object.values(CLUSTER_LABELS);

  return (
    <StudentShell active="connections">
      <ConnectionsClient
        userId={user.id}
        acceptedConns={acceptedConns}
        incomingPending={incomingPending}
        activityItems={activityItems}
        discoverPersons={discoverPersons}
        universities={universities}
        clusterLabels={allClusters}
      />
    </StudentShell>
  );
}
