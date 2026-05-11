import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";
import { EventsClient } from "./EventsClient";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select(`
      id, title, description, outcomes, speaker_name, speaker_role,
      event_type, topic, format, location, starts_at, duration_minutes,
      total_spots, registered_count,
      companies ( id, name, logo_url )
    `)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("user_id", user.id);

  const registeredIds = new Set((registrations ?? []).map((r) => r.event_id as string));

  return (
    <StudentShell active="events">
      <Suspense
        fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-pale-sage" />
            <div className="h-6 w-64 rounded-lg bg-pale-sage" />
            <div className="h-10 w-80 rounded-xl bg-pale-sage" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-[14px] bg-pale-sage" />
            ))}
          </div>
        }
      >
        <EventsClient
          events={events ?? []}
          registeredIds={Array.from(registeredIds)}
        />
      </Suspense>
    </StudentShell>
  );
}
