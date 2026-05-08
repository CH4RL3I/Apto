-- Company Hiring Portal (PRD §10.8)
-- Adds optional invitations columns the portal reads/writes (responded_at, contact_email)
-- and supporting indexes. The invitations table itself, RLS policies on
-- invitations / submissions, and the status check constraint are already
-- defined upstream and intentionally NOT modified here — the invitations &
-- realtime branch owns evolution of the status field and triggers.

create table if not exists "public"."invitations" (
  "id" uuid primary key default extensions.uuid_generate_v4(),
  "submission_id" uuid references public.submissions(id) on delete cascade,
  "company_id" uuid references public.companies(id) on delete cascade,
  "user_id" uuid references auth.users(id) on delete cascade,
  "status" text default 'pending',
  "message" text,
  "sent_at" timestamptz default now()
);

alter table "public"."invitations"
  add column if not exists "responded_at" timestamptz;

alter table "public"."invitations"
  add column if not exists "contact_email" text;

create index if not exists "invitations_user_status_idx"
  on public.invitations (user_id, status);

create index if not exists "invitations_company_sent_at_idx"
  on public.invitations (company_id, sent_at desc);

create index if not exists "invitations_submission_idx"
  on public.invitations (submission_id);

-- RLS on invitations is enabled upstream; re-assert here defensively for
-- environments where the table is created fresh by this migration.
alter table public.invitations enable row level security;

-- These policies are no-ops if upstream already created identically named
-- ones; we guard with `drop policy if exists` to allow re-application.

drop policy if exists "Companies see invitations" on public.invitations;
create policy "Companies see invitations"
  on public.invitations
  for select
  using (
    exists (
      select 1 from public.companies c
      where c.id = invitations.company_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "Companies manage invitations" on public.invitations;
create policy "Companies manage invitations"
  on public.invitations
  for insert
  with check (
    exists (
      select 1 from public.submissions s
      join public.case_studies cs on cs.id = s.case_study_id
      join public.companies c on cs.company_id = c.id
      where s.id = invitations.submission_id
        and s.user_id = invitations.user_id
        and c.id = invitations.company_id
        and c.user_id = auth.uid()
    )
  );

drop policy if exists "Companies update own invitations" on public.invitations;
create policy "Companies update own invitations"
  on public.invitations
  for update
  using (
    exists (
      select 1 from public.companies c
      where c.id = invitations.company_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "Students see own invitations" on public.invitations;
create policy "Students see own invitations"
  on public.invitations
  for select
  using (auth.uid() = user_id);

drop policy if exists "Students respond to own invitations" on public.invitations;
create policy "Students respond to own invitations"
  on public.invitations
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and status in ('accepted', 'declined', 'rejected')
  );

drop policy if exists "Companies see submissions" on public.submissions;
create policy "Companies see submissions"
  on public.submissions
  for select
  using (
    exists (
      select 1 from public.case_studies cs
      join public.companies c on cs.company_id = c.id
      where cs.id = submissions.case_study_id and c.user_id = auth.uid()
    )
  );
