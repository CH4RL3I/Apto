import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CaseStudyForm } from "../CaseStudyForm";

export default async function NewCaseStudyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userRow?.role !== "company") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/portal" aria-label="Back to portal" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <Link
            href="/portal/case-studies"
            className="text-sm font-medium text-charcoal-2 hover:text-charcoal inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="eyebrow mb-1">New</div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">
            Create a case study
          </h1>
          <p className="text-charcoal-2 mt-1">
            Candidates will see the brief, work for the time you set, and submit a solution scored
            against your rubric.
          </p>
        </div>

        <CaseStudyForm mode="create" />
      </div>
    </div>
  );
}
