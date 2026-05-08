import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <StudentShell active="home">
      <header className="mb-6">
        <div className="eyebrow mb-2">Upcoming events</div>
        <h1 className="text-3xl font-bold text-charcoal tracking-tight">
          Upcoming Events
        </h1>
        <p className="text-charcoal-2 mt-1">
          Workshops, info sessions, and prep events from companies and the Apto team. Save the dates and join the ones that match your goals.
        </p>
      </header>

      <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pale-sage text-sage shadow-1">
          <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="font-bold text-charcoal mb-2">No events yet</h3>
        <p className="text-sm text-charcoal-2">Check back soon.</p>
      </div>
    </StudentShell>
  );
}
