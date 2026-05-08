import { createClient } from "@/lib/supabase/server";
import type {
  ChallengeTask,
  CaseStudy,
} from "@/lib/questionnaire/case-studies";

export interface TasksOverrideRow {
  case_study_id: string;
  tasks: ChallengeTask[];
  desk: CaseStudy["desk"] | null;
  company_block: CaseStudy["companyBlock"] | null;
  updated_at: string;
}

export async function fetchTasksOverride(
  caseStudyId: string,
): Promise<TasksOverrideRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("case_study_tasks")
      .select("case_study_id, tasks, desk, company_block, updated_at")
      .eq("case_study_id", caseStudyId)
      .maybeSingle();
    if (error || !data) return null;
    return data as TasksOverrideRow;
  } catch {
    return null;
  }
}

export async function fetchAllOverrideIds(): Promise<Set<string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("case_study_tasks")
      .select("case_study_id");
    if (error || !data) return new Set();
    return new Set(data.map((r) => r.case_study_id));
  } catch {
    return new Set();
  }
}
