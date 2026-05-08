import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { fetchTasksOverride } from "@/lib/admin/tasks-override";
import { TaskEditor } from "./TaskEditor";

export const dynamic = "force-dynamic";

export default async function AdminTaskEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cs = CASE_STUDIES.find((c) => c.id === id);
  if (!cs) notFound();

  const override = await fetchTasksOverride(id);
  const initial = {
    tasks: override?.tasks ?? cs.tasks ?? [],
    desk: override?.desk ?? cs.desk ?? null,
    companyBlock: override?.company_block ?? cs.companyBlock ?? null,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/tasks"
            className="text-xs text-sage hover:underline"
          >
            ← Back to list
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-charcoal">{cs.title}</h1>
          <p className="text-sm text-charcoal-2">
            <span className="font-mono">{cs.id}</span> · {cs.cluster} ·{" "}
            {override ? "DB override" : "File default"}
            {override?.updated_at
              ? ` · updated ${new Date(override.updated_at).toLocaleString()}`
              : ""}
          </p>
        </div>
      </div>

      <TaskEditor
        caseStudyId={cs.id}
        hasOverride={!!override}
        initial={initial}
      />
    </div>
  );
}
