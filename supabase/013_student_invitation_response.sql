-- Let students accept or decline invitations they own.
--
-- Schema gives them SELECT on their own invitations but no UPDATE, so the
-- accept/decline buttons on the dashboard tripped RLS. WITH CHECK pins the
-- new status to accepted/declined — students can't, e.g., flip a row back
-- to pending or to some made-up value. Idempotent.

drop policy if exists "Students respond to own invitations" on public.invitations;
create policy "Students respond to own invitations"
  on public.invitations
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and status in ('accepted', 'declined')
  );
