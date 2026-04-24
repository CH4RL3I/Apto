-- Add CV fields to profiles
alter table public.profiles add column if not exists cv_url text;
alter table public.profiles add column if not exists cv_parsed jsonb default '{}';
alter table public.profiles add column if not exists cv_skills text[] default '{}';

-- Add CV snapshot to submissions (so companies see the CV at time of submission)
alter table public.submissions add column if not exists cv_snapshot_url text;

-- Create storage bucket for CVs
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

-- Storage policies: users can upload their own CVs
create policy "Users upload own CVs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

-- Users can read their own CVs
create policy "Users read own CVs"
on storage.objects for select
to authenticated
using (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

-- Companies can read CVs attached to submissions for their case studies
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
