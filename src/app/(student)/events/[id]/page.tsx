import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, Monitor, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { RegisterButton } from "./RegisterButton";

const FORMAT_LABELS: Record<string, string> = {
  online: "Online",
  in_person: "In Person",
  hybrid: "Hybrid",
};

const TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop",
  company_info_session: "Info Session",
  career_talk: "Career Talk",
  panel: "Panel",
  networking: "Networking",
};

const TOPIC_LABELS: Record<string, string> = {
  consulting: "Consulting",
  finance: "Finance",
  product: "Product",
  marketing: "Marketing",
  engineering: "Engineering",
  general: "General",
};

// Map event topic to CaseStudy matchesFields values
const TOPIC_TO_FIELDS: Record<string, string[]> = {
  consulting: ["Consulting", "Strategy"],
  finance: ["Finance", "Investment Banking", "Banking"],
  product: ["Product Management", "Product"],
  marketing: ["Marketing", "Growth"],
  engineering: ["Engineering", "Software Engineering", "Data Science"],
  general: [],
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select(`
      id, title, description, outcomes, speaker_name, speaker_role, speaker_photo_url,
      event_type, topic, format, location, starts_at, duration_minutes,
      total_spots, registered_count,
      companies ( id, name, logo_url )
    `)
    .eq("id", id)
    .single();

  if (!event) notFound();

  const { data: reg } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const isRegistered = !!reg;

  // Related challenges: match by topic field
  const relatedFields = TOPIC_TO_FIELDS[event.topic as string] ?? [];
  const related = relatedFields.length
    ? CASE_STUDIES.filter((cs) =>
        cs.matchesFields.some((f) =>
          relatedFields.some((rf) => f.toLowerCase().includes(rf.toLowerCase())),
        ),
      ).slice(0, 3)
    : [];

  const spotsLeft = event.total_spots - event.registered_count;

  return (
    <StudentShell active="events">
      <div className="max-w-2xl">
        {/* Back link */}
        <Link
          href="/events"
          className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal-2 hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          All events
        </Link>

        {/* Type + topic badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full bg-pale-sage px-2.5 py-0.5 text-xs font-semibold text-sage">
            {TYPE_LABELS[event.event_type as string] ?? event.event_type}
          </span>
          <span className="inline-flex items-center rounded-full border border-sage-mist-2 px-2.5 py-0.5 text-xs font-semibold text-charcoal-2">
            {TOPIC_LABELS[event.topic as string] ?? event.topic}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-charcoal tracking-tight mb-1">
          {event.title}
        </h1>

        {(() => {
          const c = event.companies as
            | { name?: string | null }
            | Array<{ name?: string | null }>
            | null
            | undefined;
          const hostName = Array.isArray(c) ? c[0]?.name : c?.name;
          if (!hostName) return null;
          return (
            <p className="text-sm text-charcoal-2 mb-6">
              Hosted by{" "}
              <span className="font-semibold text-charcoal">{hostName}</span>
            </p>
          );
        })()}

        {/* Meta card */}
        <div className="mb-6 rounded-[14px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} />
              <div>
                <p className="text-[11px] font-semibold text-charcoal-2 uppercase tracking-wide mb-0.5">Date & Time</p>
                <p className="text-sm font-semibold text-charcoal">{formatDate(event.starts_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} />
              <div>
                <p className="text-[11px] font-semibold text-charcoal-2 uppercase tracking-wide mb-0.5">Duration</p>
                <p className="text-sm font-semibold text-charcoal">{event.duration_minutes} minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {event.format === "online" ? (
                <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} />
              ) : (
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} />
              )}
              <div>
                <p className="text-[11px] font-semibold text-charcoal-2 uppercase tracking-wide mb-0.5">Format</p>
                <p className="text-sm font-semibold text-charcoal">
                  {FORMAT_LABELS[event.format as string] ?? event.format}
                  {event.location && event.format !== "online" ? ` · ${event.location}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} />
              <div>
                <p className="text-[11px] font-semibold text-charcoal-2 uppercase tracking-wide mb-0.5">Availability</p>
                <p className="text-sm font-semibold text-charcoal">
                  {spotsLeft <= 0 ? (
                    <span className="text-coral">Fully booked</span>
                  ) : (
                    <>{spotsLeft} of {event.total_spots} spots left</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Register button (client — handles RPC + ICS + realtime) */}
        <div className="mb-8">
          <RegisterButton
            eventId={event.id}
            eventTitle={event.title}
            startsAt={event.starts_at}
            durationMinutes={event.duration_minutes}
            initialRegistered={isRegistered}
            initialSpotsLeft={spotsLeft}
          />
        </div>

        {/* Description */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-charcoal mb-2">About this event</h2>
          <p className="text-sm text-charcoal-2 leading-relaxed">{event.description}</p>
        </section>

        {/* Outcomes */}
        {event.outcomes && (event.outcomes as string[]).length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-charcoal mb-3">What you&apos;ll take away</h2>
            <ul className="space-y-2">
              {(event.outcomes as string[]).map((outcome, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal-2">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pale-sage text-sage text-[10px] font-bold">
                    ✓
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Speaker */}
        {event.speaker_name && (
          <section className="mb-8">
            <h2 className="text-base font-bold text-charcoal mb-3">Speaker</h2>
            <div className="flex items-center gap-3 rounded-[14px] border border-sage-mist-2 bg-chalk p-4 shadow-1">
              {event.speaker_photo_url ? (
                <img
                  src={event.speaker_photo_url}
                  alt={event.speaker_name}
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-full bg-pale-sage flex items-center justify-center text-sage font-bold text-sm">
                  {event.speaker_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-charcoal">{event.speaker_name}</p>
                {event.speaker_role && (
                  <p className="text-xs text-charcoal-2">{event.speaker_role}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Related challenges */}
        {related.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-charcoal mb-3">Related challenges</h2>
            <div className="space-y-2">
              {related.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/challenges/${cs.id}`}
                  className="focus-ring flex items-center justify-between rounded-[14px] border border-sage-mist-2 bg-chalk p-4 shadow-1 hover:shadow-2 transition-shadow"
                >
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{cs.title}</p>
                    <p className="text-xs text-charcoal-2 mt-0.5">{cs.cluster}</p>
                  </div>
                  <span className="text-xs font-semibold text-sage ml-4 shrink-0">Try it →</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </StudentShell>
  );
}
