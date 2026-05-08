export interface User {
  id: string;
  role: "student" | "company";
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Profile {
  user_id: string;
  questionnaire_answers: Record<string, unknown>;
  completed_at: string | null;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  description: string;
  one_liner: string;
  day_in_the_life: string;
  sample_schedule: { time: string; activity: string }[];
  typical_tasks: string[];
  tools: string[];
  required_skills: string[];
  salary_range: { min: number; max: number; currency: string; source: string };
  growth_outlook: string;
  color: string;
  icon: string;
  target_vector: number[];
  tags: string[];
  video_url?: string;
  created_at: string;
}

export interface Company {
  id: string;
  user_id: string | null;
  name: string;
  logo_url: string | null;
  description: string;
  contact_email: string;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  career_id: string;
  company_id: string;
  title: string;
  brief: string;
  rubric: { criterion: string; weight: number; description: string }[];
  time_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  skills_tested: string[];
  deliverable_format: "text" | "document" | "spreadsheet" | "slides";
  created_at: string;
  company?: Company;
  career?: Career;
}

export interface Submission {
  id: string;
  user_id: string;
  case_study_id: string;
  answer: string | null;
  integrity_signals: {
    tab_switches: number;
    paste_count: number;
    fullscreen_exits: number;
    time_spent_seconds: number;
  };
  started_at: string | null;
  submitted_at: string | null;
  score: number | null;
  score_breakdown: Record<string, number> | null;
  status: "in_progress" | "submitted" | "scored" | "reviewed";
  created_at: string;
  case_study?: CaseStudy;
  users?: User;
}

export interface Invitation {
  id: string;
  submission_id: string;
  company_id: string;
  user_id: string;
  status: "pending" | "accepted" | "declined";
  message: string | null;
  sent_at: string;
  company?: Company;
  submission?: Submission;
}
