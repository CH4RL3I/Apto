create table if not exists public.case_study_tasks (
  case_study_id text primary key,
  tasks jsonb not null,
  desk jsonb null,
  company_block jsonb null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.case_study_tasks enable row level security;

create policy case_study_tasks_select_anyone on public.case_study_tasks
  for select using (true);

create policy case_study_tasks_write_authed on public.case_study_tasks
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
