-- Align submissions with generated case-study IDs and tighten company access.
-- This migration retypes case_studies.id and submissions.case_study_id from
-- uuid to text, so it must drop every policy that joins on those columns
-- before the ALTER TYPE, then recreate them after.

drop policy if exists "Companies read submission CVs"           on storage.objects;
drop policy if exists "Companies see submissions"               on public.submissions;
drop policy if exists "Companies update submissions"            on public.submissions;
drop policy if exists "Companies can read submitted profiles"   on public.profiles;
drop policy if exists "Companies manage invitations"            on public.invitations;

alter table public.submissions
  drop constraint if exists submissions_case_study_id_fkey;

alter table public.case_studies
  alter column id drop default,
  alter column id type text using id::text,
  alter column id set default uuid_generate_v4()::text;

alter table public.submissions
  alter column case_study_id type text using case_study_id::text,
  alter column case_study_id set not null;

create policy "Companies see submissions" on public.submissions for select using (
  exists (
    select 1 from public.case_studies cs
    join public.companies c on cs.company_id = c.id
    where cs.id = case_study_id and c.user_id = auth.uid()
  )
);

create policy "Companies update submissions" on public.submissions for update using (
  exists (
    select 1 from public.case_studies cs
    join public.companies c on cs.company_id = c.id
    where cs.id = case_study_id and c.user_id = auth.uid()
  )
);

create policy "Companies can read submitted profiles" on public.profiles for select using (
  exists (
    select 1 from public.submissions s
    join public.case_studies cs on cs.id = s.case_study_id
    join public.companies c on cs.company_id = c.id
    where s.user_id = profiles.user_id
      and c.user_id = auth.uid()
  )
);

create policy "Companies manage invitations" on public.invitations for insert with check (
  exists (
    select 1 from public.submissions s
    join public.case_studies cs on cs.id = s.case_study_id
    join public.companies c on cs.company_id = c.id
    where s.id = public.invitations.submission_id
      and s.user_id = public.invitations.user_id
      and c.id = public.invitations.company_id
      and c.user_id = auth.uid()
  )
);

create policy "Companies read submission CVs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cvs' and
  exists (
    select 1 from public.submissions s
    join public.case_studies cs on s.case_study_id = cs.id
    join public.companies c on cs.company_id = c.id
    where c.user_id = auth.uid()
    and s.cv_snapshot_url like '%' || name || '%'
  )
);
