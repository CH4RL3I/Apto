"use client";

import {
  useState,
  useTransition,
  useMemo,
  useEffect,
} from "react";
import Link from "next/link";
import {
  Check,
  Link2,
  Loader2,
  MessageCircle,
  Users,
  X,
} from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import type { ConnectionPeer, ActivityItem, DiscoverPerson } from "./page";
import { requestConnection, respondToConnection } from "./actions";

// ── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Avatar ─────────────────────────────────────────────────────────────────

function Avatar({
  name,
  url,
  size = "md",
}: {
  name: string;
  url: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm"
      ? "h-7 w-7 text-[10px]"
      : size === "lg"
      ? "h-12 w-12 text-base"
      : "h-9 w-9 text-sm";

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} shrink-0 rounded-full bg-pale-sage flex items-center justify-center font-bold text-sage`}
    >
      {initials(name)}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-[12px] border border-sage/30 bg-chalk px-4 py-3 shadow-3 text-sm font-semibold text-charcoal">
      <Check className="h-4 w-4 text-sage" strokeWidth={2} />
      {message}
    </div>
  );
}

// ── Connection card (My Network) ───────────────────────────────────────────

function ConnectionCard({ peer }: { peer: ConnectionPeer }) {
  return (
    <div className="flex flex-col rounded-[14px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={peer.name} url={peer.avatarUrl} size="lg" />
        <div className="min-w-0">
          <p className="font-bold text-charcoal text-sm leading-snug">{peer.name}</p>
          {(peer.university || peer.yearOfStudy) && (
            <p className="text-xs text-charcoal-2 mt-0.5">
              {[peer.university, peer.yearOfStudy].filter(Boolean).join(" · ")}
            </p>
          )}
          {peer.headline && (
            <p className="text-xs text-charcoal-2 mt-0.5 italic line-clamp-1">
              {peer.headline}
            </p>
          )}
        </div>
      </div>

      {peer.challengeCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {peer.challengeCategories.map((cat) => (
            <Pill key={cat} variant="sage" size="sm">
              {cat}
            </Pill>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-sage-mist-2">
        {peer.mutualCount > 0 ? (
          <span className="text-xs text-charcoal-2 flex items-center gap-1">
            <Users className="h-3 w-3" strokeWidth={1.75} />
            {peer.mutualCount} mutual
          </span>
        ) : (
          <span />
        )}
        <Link
          href="/messages"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-sage-mist-2 bg-chalk px-2.5 py-1.5 text-xs font-semibold text-charcoal hover:bg-pale-sage transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
          Message
        </Link>
      </div>
    </div>
  );
}

// ── Incoming request card ──────────────────────────────────────────────────

function PendingRequestCard({
  peer,
  onDone,
}: {
  peer: ConnectionPeer;
  onDone: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(status: "accepted" | "rejected") {
    setError(null);
    startTransition(async () => {
      try {
        await respondToConnection(peer.connectionId, status);
        onDone(peer.connectionId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-sage-mist-2 bg-chalk p-4 shadow-1">
      <Avatar name={peer.name} url={peer.avatarUrl} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-charcoal text-sm">{peer.name}</p>
        {(peer.university || peer.yearOfStudy) && (
          <p className="text-xs text-charcoal-2">
            {[peer.university, peer.yearOfStudy].filter(Boolean).join(" · ")}
          </p>
        )}
        {peer.challengeCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {peer.challengeCategories.map((cat) => (
              <Pill key={cat} variant="sage" size="sm">
                {cat}
              </Pill>
            ))}
          </div>
        )}
        {error && <p className="text-xs text-coral mt-1">{error}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <Button
          size="sm"
          variant="primary"
          disabled={isPending}
          onClick={() => handle("accepted")}
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Accept"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => handle("rejected")}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

// ── Activity feed ──────────────────────────────────────────────────────────

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-5 shadow-1 h-fit">
      <h3 className="text-sm font-bold text-charcoal mb-4">Network activity</h3>
      {items.length === 0 ? (
        <p className="text-sm text-charcoal-2">
          Activity from your connections will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              <Avatar name={item.userName} url={item.userAvatarUrl} size="sm" />
              <div className="min-w-0">
                <p className="text-xs text-charcoal leading-relaxed">
                  <span className="font-semibold">{item.userName}</span>{" "}
                  {item.description}
                </p>
                <p className="text-[11px] text-charcoal-2 mt-0.5">
                  {relativeTime(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Discover person card ───────────────────────────────────────────────────

function DiscoverCard({
  person,
  onConnectSent,
}: {
  person: DiscoverPerson;
  onConnectSent: (userId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(person.isPending);
  const [error, setError] = useState<string | null>(null);

  function handleConnect() {
    setError(null);
    startTransition(async () => {
      try {
        await requestConnection(person.userId);
        setSent(true);
        onConnectSent(person.userId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send request");
      }
    });
  }

  return (
    <div className="flex flex-col rounded-[14px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={person.name} url={person.avatarUrl} size="md" />
        <div className="min-w-0">
          <p className="font-bold text-charcoal text-sm leading-snug">{person.name}</p>
          {(person.university || person.yearOfStudy) && (
            <p className="text-xs text-charcoal-2 mt-0.5">
              {[person.university, person.yearOfStudy].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {person.challengeCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {person.challengeCategories.map((cat) => (
            <Pill key={cat} variant="sage" size="sm">
              {cat}
            </Pill>
          ))}
        </div>
      )}

      {(person.sharedCount > 0 || person.careerInterests.length > 0) && (
        <p className="text-xs text-charcoal-2 mb-3">
          {person.sharedCount > 0
            ? `${person.sharedCount} shared challenge area${person.sharedCount > 1 ? "s" : ""}`
            : ""}
          {person.sharedCount > 0 && person.careerInterests.length > 0 ? " · " : ""}
          {person.careerInterests.length > 0
            ? `Interested in ${person.careerInterests.slice(0, 2).join(", ")}`
            : ""}
        </p>
      )}

      {error && <p className="text-xs text-coral mb-2">{error}</p>}

      <div className="mt-auto">
        {sent ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-sage-mist-2 bg-pale-sage px-3 py-1.5 text-xs font-semibold text-sage">
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Pending
          </span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleConnect}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              "Connect"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Main client component ──────────────────────────────────────────────────

type Tab = "network" | "discover";

interface Props {
  userId: string;
  acceptedConns: ConnectionPeer[];
  incomingPending: ConnectionPeer[];
  activityItems: ActivityItem[];
  discoverPersons: DiscoverPerson[];
  universities: string[];
  clusterLabels: string[];
}

export function ConnectionsClient({
  userId,
  acceptedConns,
  incomingPending,
  activityItems,
  discoverPersons,
  universities,
  clusterLabels,
}: Props) {
  const [tab, setTab] = useState<Tab>("network");
  const [toast, setToast] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(
    new Set(discoverPersons.filter((p) => p.isPending).map((p) => p.userId)),
  );
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Filter state for Discover
  const [uniFilter, setUniFilter] = useState("");
  const [topicFilters, setTopicFilters] = useState<Set<string>>(new Set());
  const [interestFilters, setInterestFilters] = useState<Set<string>>(new Set());

  const allInterests = useMemo(() => {
    const set = new Set<string>();
    discoverPersons.forEach((p) => p.careerInterests.forEach((i) => set.add(i)));
    return [...set].sort();
  }, [discoverPersons]);

  const filteredDiscover = useMemo(() => {
    return discoverPersons.filter((p) => {
      if (
        uniFilter.trim() &&
        !p.university?.toLowerCase().includes(uniFilter.toLowerCase())
      )
        return false;
      if (
        topicFilters.size > 0 &&
        !p.challengeCategories.some((c) => topicFilters.has(c))
      )
        return false;
      if (
        interestFilters.size > 0 &&
        !p.careerInterests.some((i) => interestFilters.has(i))
      )
        return false;
      return true;
    });
  }, [discoverPersons, uniFilter, topicFilters, interestFilters]);

  const hasFilters =
    uniFilter.trim() !== "" || topicFilters.size > 0 || interestFilters.size > 0;

  function clearFilters() {
    setUniFilter("");
    setTopicFilters(new Set());
    setInterestFilters(new Set());
  }

  function toggleTopic(label: string) {
    setTopicFilters((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  function toggleInterest(label: string) {
    setInterestFilters((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  function handleConnectSent(uid: string) {
    setPendingIds((prev) => new Set([...prev, uid]));
  }

  function handleRequestDone(connectionId: string) {
    setDismissed((prev) => new Set([...prev, connectionId]));
  }

  function handleInvite() {
    const url = `${window.location.origin}/invite?ref=${userId}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast("Invite link copied to clipboard");
    });
  }

  const visiblePending = incomingPending.filter((p) => !dismissed.has(p.connectionId));
  const hasPeerSuggestions = discoverPersons.length > 0;

  return (
    <div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">Student dashboard</div>
          <h1 className="text-3xl font-bold tracking-tight text-charcoal">
            Connections
          </h1>
          <p className="mt-1 text-sm text-charcoal-2">
            Build your peer network and follow each other&apos;s progress.
          </p>
        </div>
        <button
          onClick={handleInvite}
          className="focus-ring shrink-0 inline-flex items-center gap-2 rounded-[12px] border border-sage-mist-2 bg-chalk px-3 py-2 text-xs font-semibold text-charcoal hover:bg-pale-sage transition-colors"
        >
          <Link2 className="h-3.5 w-3.5 text-sage" strokeWidth={1.75} />
          Invite a friend
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-pale-sage p-1 w-fit">
        {(["network", "discover"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-chalk text-charcoal shadow-1"
                : "text-charcoal-2 hover:text-charcoal"
            }`}
          >
            {t === "network"
              ? `My Network${acceptedConns.length > 0 ? ` (${acceptedConns.length})` : ""}`
              : "Discover"}
          </button>
        ))}
      </div>

      {/* MY NETWORK TAB */}
      {tab === "network" && (
        <div>
          {/* Pending requests */}
          {visiblePending.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-charcoal-2 mb-3">
                Pending requests · {visiblePending.length}
              </h2>
              <div className="space-y-2">
                {visiblePending.map((peer) => (
                  <PendingRequestCard
                    key={peer.connectionId}
                    peer={peer}
                    onDone={handleRequestDone}
                  />
                ))}
              </div>
            </section>
          )}

          {acceptedConns.length === 0 ? (
            /* Empty state: show peer suggestions */
            <div>
              <div className="mb-5 rounded-[14px] border border-sage/20 bg-sage/5 p-5">
                <p className="text-sm font-semibold text-charcoal mb-1">
                  You have no connections yet — here are some students exploring similar paths.
                </p>
                <p className="text-xs text-charcoal-2">
                  Connect with them to follow each other&apos;s progress.
                </p>
              </div>
              {hasPeerSuggestions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {discoverPersons.slice(0, 4).map((person) => (
                    <DiscoverCard
                      key={person.userId}
                      person={{ ...person, isPending: pendingIds.has(person.userId) }}
                      onConnectSent={handleConnectSent}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Two-column layout: connections + activity */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 h-fit">
                {acceptedConns.map((peer) => (
                  <ConnectionCard key={peer.connectionId} peer={peer} />
                ))}
              </div>
              <ActivityFeed items={activityItems} />
            </div>
          )}
        </div>
      )}

      {/* DISCOVER TAB */}
      {tab === "discover" && (
        <div>
          {/* Filter bar */}
          <div className="mb-5 space-y-3">
            <div className="flex flex-wrap gap-2 items-end">
              {/* University input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="University…"
                  value={uniFilter}
                  onChange={(e) => setUniFilter(e.target.value)}
                  list="uni-list"
                  className="focus-ring rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-2 outline-none"
                />
                <datalist id="uni-list">
                  {universities.map((u) => (
                    <option key={u} value={u} />
                  ))}
                </datalist>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="focus-ring text-xs font-semibold text-charcoal-2 hover:text-sage transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Challenge topic pills */}
            <div className="flex flex-wrap gap-1.5">
              {clusterLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => toggleTopic(label)}
                  className={`focus-ring rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    topicFilters.has(label)
                      ? "bg-sage text-chalk"
                      : "border border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-sage hover:text-charcoal"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Career interest pills */}
            {allInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {allInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`focus-ring rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      interestFilters.has(interest)
                        ? "bg-charcoal text-chalk"
                        : "border border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-charcoal hover:text-charcoal"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredDiscover.length === 0 ? (
            <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
              <Users className="h-8 w-8 text-sage mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-charcoal mb-1">
                No students match these filters
              </p>
              <p className="text-xs text-charcoal-2">Try broadening your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDiscover.map((person) => (
                <DiscoverCard
                  key={person.userId}
                  person={{ ...person, isPending: pendingIds.has(person.userId) }}
                  onConnectSent={handleConnectSent}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
