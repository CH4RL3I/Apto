"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Monitor, Users } from "lucide-react";

type EventType = "workshop" | "company_info_session" | "career_talk" | "panel" | "networking";
type EventTopic = "consulting" | "finance" | "product" | "marketing" | "engineering" | "general";
type EventFormat = "online" | "in_person" | "hybrid";

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  outcomes: string[];
  speaker_name: string | null;
  speaker_role: string | null;
  event_type: EventType;
  topic: EventTopic;
  format: EventFormat;
  location: string | null;
  starts_at: string;
  duration_minutes: number;
  total_spots: number;
  registered_count: number;
  companies: Company | Company[] | null;
}

export type EventForClient = Event;

const TYPE_LABELS: Record<EventType, string> = {
  workshop: "Workshop",
  company_info_session: "Info Session",
  career_talk: "Career Talk",
  panel: "Panel",
  networking: "Networking",
};

const TOPIC_LABELS: Record<EventTopic, string> = {
  consulting: "Consulting",
  finance: "Finance",
  product: "Product",
  marketing: "Marketing",
  engineering: "Engineering",
  general: "General",
};

const FORMAT_LABELS: Record<EventFormat, string> = {
  online: "Online",
  in_person: "In Person",
  hybrid: "Hybrid",
};

function isThisWeek(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);
  return d >= now && d <= weekEnd;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function spotsLeft(event: Event) {
  return event.total_spots - event.registered_count;
}

function EventCard({
  event,
  isRegistered,
}: {
  event: Event;
  isRegistered: boolean;
}) {
  const spots = spotsLeft(event);
  const isFull = spots <= 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className="focus-ring block rounded-[14px] border border-sage-mist-2 bg-chalk shadow-1 hover:shadow-2 transition-shadow"
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-full bg-pale-sage px-2.5 py-0.5 text-[11px] font-semibold text-sage">
              {TYPE_LABELS[event.event_type]}
            </span>
            <span className="inline-flex items-center rounded-full border border-sage-mist-2 px-2.5 py-0.5 text-[11px] font-semibold text-charcoal-2">
              {TOPIC_LABELS[event.topic]}
            </span>
          </div>
          {isRegistered && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-sage/10 px-2.5 py-0.5 text-[11px] font-semibold text-sage border border-sage/20">
              Registered
            </span>
          )}
        </div>

        <h3 className="font-bold text-charcoal text-base leading-snug mb-1">
          {event.title}
        </h3>
        {(() => {
          const host = Array.isArray(event.companies)
            ? event.companies[0]
            : event.companies;
          if (!host?.name) return null;
          return (
            <p className="text-xs text-charcoal-2 mb-3">{host.name}</p>
          );
        })()}

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-charcoal-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-sage" strokeWidth={1.75} />
            {formatDate(event.starts_at)}
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-sage" strokeWidth={1.75} />
            {event.duration_minutes} min
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal-2">
            {event.format === "online" ? (
              <Monitor className="h-3.5 w-3.5 shrink-0 text-sage" strokeWidth={1.75} />
            ) : (
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sage" strokeWidth={1.75} />
            )}
            {event.format === "online"
              ? "Online"
              : event.location ?? FORMAT_LABELS[event.format]}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-2">
            <Users className="h-3.5 w-3.5 text-sage" strokeWidth={1.75} />
            {isFull ? (
              <span className="text-coral font-semibold">Full</span>
            ) : (
              <span>
                <span className="font-semibold text-charcoal">{spots}</span> spot{spots === 1 ? "" : "s"} left
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-sage">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}

type Tab = "upcoming" | "registered";
type FilterType = "all" | EventType;
type FilterTopic = "all" | EventTopic;

export function EventsClient({
  events,
  registeredIds,
}: {
  events: Event[];
  registeredIds: string[];
}) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterTopic, setFilterTopic] = useState<FilterTopic>("all");

  const registeredSet = useMemo(() => new Set(registeredIds), [registeredIds]);

  const thisWeekEvents = useMemo(
    () => events.filter((e) => isThisWeek(e.starts_at)),
    [events],
  );

  const filtered = useMemo(() => {
    const base = tab === "registered"
      ? events.filter((e) => registeredSet.has(e.id))
      : events;
    return base.filter((e) => {
      if (filterType !== "all" && e.event_type !== filterType) return false;
      if (filterTopic !== "all" && e.topic !== filterTopic) return false;
      return true;
    });
  }, [events, tab, registeredSet, filterType, filterTopic]);

  const registeredCount = registeredIds.length;

  return (
    <div>
      <header className="mb-6">
        <div className="eyebrow mb-2">Student dashboard</div>
        <h1 className="text-3xl font-bold text-charcoal tracking-tight">Events</h1>
        <p className="text-charcoal-2 mt-1 text-sm">
          Workshops, info sessions, and career talks from top companies. Register to save your spot.
        </p>
      </header>

      {/* This week banner */}
      {thisWeekEvents.length > 0 && (
        <div className="mb-6 rounded-[14px] border border-sage/30 bg-sage/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-4 w-4 text-sage" strokeWidth={1.75} />
            <span className="text-sm font-semibold text-sage">This week</span>
          </div>
          <p className="text-sm text-charcoal-2">
            {thisWeekEvents.length} event{thisWeekEvents.length === 1 ? "" : "s"} coming up in the next 7 days
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl bg-pale-sage p-1 w-fit">
        {(["upcoming", "registered"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-chalk text-charcoal shadow-1"
                : "text-charcoal-2 hover:text-charcoal"
            }`}
          >
            {t === "upcoming" ? "Upcoming" : `Registered${registeredCount > 0 ? ` (${registeredCount})` : ""}`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {/* Type filter */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", "workshop", "company_info_session", "career_talk", "panel", "networking"] as FilterType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`focus-ring rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  filterType === type
                    ? "bg-sage text-chalk"
                    : "border border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-sage hover:text-charcoal"
                }`}
              >
                {type === "all" ? "All types" : TYPE_LABELS[type as EventType]}
              </button>
            ),
          )}
        </div>

        {/* Topic filter */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", "consulting", "finance", "product", "marketing", "engineering", "general"] as FilterTopic[]).map(
            (topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic(topic)}
                className={`focus-ring rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  filterTopic === topic
                    ? "bg-charcoal text-chalk"
                    : "border border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-charcoal hover:text-charcoal"
                }`}
              >
                {topic === "all" ? "All topics" : TOPIC_LABELS[topic as EventTopic]}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pale-sage text-sage shadow-1">
            <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h3 className="font-bold text-charcoal mb-1">
            {tab === "registered" ? "No registrations yet" : "No events found"}
          </h3>
          <p className="text-sm text-charcoal-2">
            {tab === "registered"
              ? "Register for upcoming events to see them here."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredSet.has(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
