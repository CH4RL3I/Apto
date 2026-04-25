import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CaseStudyForm } from "../../CaseStudyForm";
import type { CaseStudyInput, RubricRow } from "../../actions";

export default async function EditCaseStudyPage({
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

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userRow?.role !== "company") redirect("/dashboard");

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!company) redirect("/dashboard");

  const { data: cs } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .eq("company_id", company.id)
    .single();
  if (!cs) redirect("/portal/case-studies");

  const row = cs as Record<string, unknown>;
  const rubricRaw = row.rubric;
  const rubric: RubricRow[] = Array.isArray(rubricRaw)
    ? (rubricRaw as RubricRow[])
    : [];

  const initial: Partial<CaseStudyInput> = {
    title: (row.title as string) ?? "",
    brief: (row.brief as string) ?? "",
    time_minutes: (row.time_minutes as number) ?? 45,
    difficulty:
      (row.difficulty as CaseStudyInput["difficulty"]) ?? "intermediate",
    skills_tested: (row.skills_tested as string[]) ?? [],
    deliverable_format:
      (row.deliverable_format as CaseStudyInput["deliverable_format"]) ?? "text",
    rubric,
  };

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
          <div className="eyebrow mb-1">Edit</div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">{initial.title}</h1>
        </div>

        <CaseStudyForm mode="edit" id={id} initial={initial} />
      </div>
    </div>
  );
}
