import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";
import { AcceptedCard, IncomingRow, SentRow } from "./ConnectionRow";
import { DiscoverPersonCard } from "./DiscoverPersonCard";

interface ConnectionRow {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "rejected" | "blocked";
  created_at: string;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
}

interface ProfileRow {
  user_id: string;
  headline: string | null;
  cv_parsed: { summary?: string | null } | null;
}

interface DiscoverProfileRow {
  user_id: string;
  username: string | null;
  headline: string | null;
  cv_parsed: { name?: string | null; summary?: string | null } | null;
  cv_skills: string[] | null;
  created_at?: string | null;
}

function pickHeadline(p?: ProfileRow): string | null {
  if (!p) return null;
  if (p.headline) return p.headline;
  const summary = p.cv_parsed?.summary;
  if (typeof summary === "string" && summary.trim().length > 0) {
    return summary.length > 140 ? `${summary.slice(0, 137)}…` : summary;
  }
  return null;
}

function pickName(u?: UserRow): string {
  if (!u) return "Unknown";
  return u.name?.trim() || u.email;
}

function pickDiscoverHeadline(p: DiscoverProfileRow): string | null {
  if (p.headline?.trim()) return p.headline.trim();
  const summary = p.cv_parsed?.summary;
  if (typeof summary === "string" && summary.trim().length > 0) {
    return summary.length > 140 ? `${summary.slice(0, 137)}…` : summary;
  }
  return null;
}

function pickDiscoverName(p: DiscoverProfileRow, u?: UserRow): string {
  const cvName =
    typeof p.cv_parsed?.name === "string" ? p.cv_parsed.name.trim() : "";
  if (cvName) return cvName;
  if (u?.name?.trim()) return u.name.trim();
  if (p.username) return p.username;
  if (u?.email) return u.email;
  return "Apto member";
}

export default async function ConnectionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawConnections } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status, created_at")
    .order("created_at", { ascending: false });

  const connections = (rawConnections ?? []) as ConnectionRow[];

  const otherIds = Array.from(
    new Set(
      connections.map((c) =>
        c.requester_id === user.id ? c.recipient_id : c.requester_id,
      ),
    ),
  );

  const [{ data: usersData }, { data: profilesData }] = await Promise.all([
    otherIds.length
      ? supabase.from("users").select("id, name, email").in("id", otherIds)
      : Promise.resolve({ data: [] as UserRow[] }),
    otherIds.length
      ? supabase
          .from("profiles")
          .select("user_id, headline, cv_parsed")
          .in("user_id", otherIds)
      : Promise.resolve({ data: [] as ProfileRow[] }),
  ]);

  const userMap = new Map<string, UserRow>(
    ((usersData ?? []) as UserRow[]).map((u) => [u.id, u]),
  );
  const profileMap = new Map<string, ProfileRow>(
    ((profilesData ?? []) as ProfileRow[]).map((p) => [p.user_id, p]),
  );

  const incoming = connections.filter(
    (c) => c.status === "pending" && c.recipient_id === user.id,
  );
  const sent = connections.filter(
    (c) => c.status === "pending" && c.requester_id === user.id,
  );
  const accepted = connections.filter((c) => c.status === "accepted");

  const empty =
    incoming.length === 0 && sent.length === 0 && accepted.length === 0;

  // ---------------------------------------------------------------------
  // Discover people: public profiles I'm not already connected/connecting to
  // ---------------------------------------------------------------------
  const excludedIds = new Set<string>([user.id]);
  for (const c of connections) {
    // Exclude every user currently entangled with me — pending, accepted,
    // rejected, or blocked. Re-sending a request after a rejection is
    // intentionally not supported from Discover.
    excludedIds.add(
      c.requester_id === user.id ? c.recipient_id : c.requester_id,
    );
  }

  const { data: rawDiscover } = await supabase
    .from("profiles")
    .select(
      "user_id, username, headline, cv_parsed, cv_skills, created_at",
    )
    .eq("is_public", true)
    .not("username", "is", null)
    .order("created_at", { ascending: false })
    .limit(48);

  const discoverProfiles = ((rawDiscover ?? []) as DiscoverProfileRow[])
    .filter((p) => !excludedIds.has(p.user_id))
    .filter((p) => typeof p.username === "string" && p.username.length > 0)
    .slice(0, 12);

  const discoverUserIds = discoverProfiles.map((p) => p.user_id);
  const { data: discoverUsersData } = discoverUserIds.length
    ? await supabase
        .from("users")
        .select("id, name, email")
        .in("id", discoverUserIds)
    : { data: [] as UserRow[] };
  const discoverUserMap = new Map<string, UserRow>(
    ((discoverUsersData ?? []) as UserRow[]).map((u) => [u.id, u]),
  );

  function rowProps(c: ConnectionRow) {
    const otherId = c.requester_id === user!.id ? c.recipient_id : c.requester_id;
    return {
      connectionId: c.id,
      name: pickName(userMap.get(otherId)),
      headline: pickHeadline(profileMap.get(otherId)),
    };
  }

  return (
    <StudentShell active="connections">
      <header className="mb-8">
        <div className="eyebrow mb-2">Network</div>
        <h1 className="text-3xl font-bold tracking-tight text-charcoal">
          Connections
        </h1>
        <p className="mt-1 text-charcoal-2">
          Manage incoming requests and people in your network.
        </p>
      </header>

      <section className="mb-10">
        <div className="mb-3">
          <h2 className="eyebrow">Discover people</h2>
          <p className="mt-1 text-sm text-charcoal-2">
            Public profiles on Apto — connect to follow each other&apos;s
            challenges and messages.
          </p>
        </div>
        {discoverProfiles.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-sage-mist-2 bg-pale-sage/40 p-6 text-sm text-charcoal-2">
            No public profiles to discover yet — once people make their
            profiles public on /profile/edit, they&apos;ll show up here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {discoverProfiles.map((p) => {
              const u = discoverUserMap.get(p.user_id);
              return (
                <DiscoverPersonCard
                  key={p.user_id}
                  recipientUserId={p.user_id}
                  username={p.username as string}
                  name={pickDiscoverName(p, u)}
                  headline={pickDiscoverHeadline(p)}
                  skills={p.cv_skills ?? []}
                />
              );
            })}
          </div>
        )}
      </section>

      {empty ? (
        <div className="rounded-[14px] border border-dashed border-sage-mist-2 bg-pale-sage/40 p-8 text-center">
          <div className="text-sm font-semibold text-charcoal">
            No connections yet
          </div>
          <div className="mt-1 text-sm text-charcoal-2">
            Explore companies and challenges to get started.
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="eyebrow mb-3">
              Incoming requests ({incoming.length})
            </h2>
            {incoming.length === 0 ? (
              <p className="text-sm text-charcoal-3">
                No incoming requests.
              </p>
            ) : (
              <div className="space-y-3">
                {incoming.map((c) => (
                  <IncomingRow key={c.id} {...rowProps(c)} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="eyebrow mb-3">Sent requests ({sent.length})</h2>
            {sent.length === 0 ? (
              <p className="text-sm text-charcoal-3">No pending sent requests.</p>
            ) : (
              <div className="space-y-3">
                {sent.map((c) => (
                  <SentRow key={c.id} {...rowProps(c)} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="eyebrow mb-3">
              My connections ({accepted.length})
            </h2>
            {accepted.length === 0 ? (
              <p className="text-sm text-charcoal-3">No connections yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {accepted.map((c) => (
                  <AcceptedCard key={c.id} {...rowProps(c)} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </StudentShell>
  );
}
