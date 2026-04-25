-- Allow companies to insert / update / delete their own case studies.
-- Public read is already permitted by the existing "Case studies public read" policy.

drop policy if exists "Companies insert own case studies" on public.case_studies;
create policy "Companies insert own case studies" on public.case_studies
  for insert with check (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "Companies update own case studies" on public.case_studies;
create policy "Companies update own case studies" on public.case_studies
  for update using (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "Companies delete own case studies" on public.case_studies;
create policy "Companies delete own case studies" on public.case_studies
  for delete using (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.user_id = auth.uid()
    )
  );
