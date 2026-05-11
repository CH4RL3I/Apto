import { createClient } from "jsr:@supabase/supabase-js@2";

// Scheduled hourly via Supabase cron:
//   select cron.schedule('event-reminder-hourly', '0 * * * *', $$
//     select net.http_post(
//       url := '<SUPABASE_URL>/functions/v1/notify-event-reminder',
//       headers := jsonb_build_object(
//         'Content-Type', 'application/json',
//         'Authorization', 'Bearer <SUPABASE_ANON_KEY>'
//       )
//     );
//   $$);

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = new Date();
  const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  // Find all registrations for events starting in the 23–25 h window
  const { data: registrations, error } = await supabase
    .from("event_registrations")
    .select("user_id, events!inner(id, title, starts_at)")
    .gte("events.starts_at", windowStart.toISOString())
    .lte("events.starts_at", windowEnd.toISOString());

  if (error) {
    console.error("Failed to fetch registrations:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!registrations || registrations.length === 0) {
    return new Response(JSON.stringify({ inserted: 0 }), { status: 200 });
  }

  type EventRow = { id: string; title: string; starts_at: string };

  const notifications = registrations.map((row) => {
    const event = (row.events as unknown as EventRow);
    return {
      user_id: row.user_id as string,
      type: "event_reminder",
      payload: {
        body: `Reminder: "${event.title}" starts in ~24 hours.`,
        link: `/events/${event.id}`,
        event_id: event.id,
        title: event.title,
        starts_at: event.starts_at,
      },
    };
  });

  const { error: insertError, count } = await supabase
    .from("notifications")
    .insert(notifications, { count: "exact" });

  if (insertError) {
    console.error("Failed to insert notifications:", insertError.message);
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ inserted: count ?? notifications.length }), { status: 200 });
});
