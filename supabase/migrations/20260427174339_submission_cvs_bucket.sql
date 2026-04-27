-- Create a storage bucket that holds frozen CV snapshots taken at the moment
-- a candidate starts a case-study exam. The original `cvs` bucket is mutable
-- (the student can re-upload), so a separate write-once bucket lets companies
-- review the exact CV the candidate submitted.

insert into storage.buckets (id, name, public)
values ('submission-cvs', 'submission-cvs', false)
on conflict (id) do nothing;

-- Policies on storage.objects for the new bucket.
-- Owner = student who took the exam.
-- Reader = the company whose case study the submission belongs to.

drop policy if exists "Students upload their submission cv" on storage.objects;
create policy "Students upload their submission cv"
on storage.objects for insert
with check (
  bucket_id = 'submission-cvs'
  and auth.uid() = owner
);

drop policy if exists "Students read their submission cv" on storage.objects;
create policy "Students read their submission cv"
on storage.objects for select
using (
  bucket_id = 'submission-cvs'
  and auth.uid() = owner
);

drop policy if exists "Companies read submission cvs they own" on storage.objects;
create policy "Companies read submission cvs they own"
on storage.objects for select
using (
  bucket_id = 'submission-cvs'
  and exists (
    select 1
    from public.submissions sub
    join public.case_studies cs on cs.id = sub.case_study_id
    join public.companies co on co.id = cs.company_id
    where co.user_id = auth.uid()
      and sub.cv_snapshot_url is not null
      and sub.cv_snapshot_url like '%/' || storage.objects.name
  )
);
