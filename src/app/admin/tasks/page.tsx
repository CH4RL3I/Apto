import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { fetchAllOverrideIds } from "@/lib/admin/tasks-override";
import { TasksTable, type TasksTableRow } from "./TasksTable";

export const dynamic = "force-dynamic";

export default async function AdminTasksIndex() {
  const overrideIds = await fetchAllOverrideIds();

  const rows: TasksTableRow[] = CASE_STUDIES.map((cs) => {
    const hasOverride = overrideIds.has(cs.id);
    const hasFileTasks = (cs.tasks?.length ?? 0) > 0;
    const status: TasksTableRow["status"] = hasOverride
      ? "DB override"
      : hasFileTasks
      ? "File default"
      : "Missing";
    return {
      id: cs.id,
      title: cs.title,
      cluster: cs.cluster,
      matchesRoles: cs.matchesRoles,
      status,
    };
  }).sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">
          Case Study Tasks
        </h1>
        <p className="mt-1 text-sm text-charcoal-2">
          Manage multi-task content for case studies. DB overrides win over
          file defaults on the student flow.
        </p>
      </div>
      <TasksTable rows={rows} />
    </div>
  );
}
