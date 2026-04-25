-- Align submissions with generated case-study IDs and tighten company access.

alter table public.submissions
  drop constraint if exists submissions_case_study_id_fkey;

alter table public.case_studies
  alter column id drop default,
  alter column id type text using id::text,
  alter column id set default uuid_generate_v4()::text;

alter table public.submissions
  alter column case_study_id type text using case_study_id::text,
  alter column case_study_id set not null;

drop policy if exists "Companies can read submitted profiles" on public.profiles;
create policy "Companies can read submitted profiles" on public.profiles for select using (
  exists (
    select 1 from public.submissions s
    join public.case_studies cs on cs.id = s.case_study_id
    join public.companies c on cs.company_id = c.id
    where s.user_id = profiles.user_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "Companies manage invitations" on public.invitations;
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
