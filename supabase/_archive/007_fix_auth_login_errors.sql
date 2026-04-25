-- Resolve "Database error querying schema" on company sign-in.
--
-- Replaces the recursive "Company can read students" policy on
-- public.users with a SECURITY DEFINER helper, so the inner role
-- check bypasses the policy that's evaluating it.
--
-- Idempotent — safe to re-run.

create or replace function public.is_company()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'company'
  )
$$;

revoke all on function public.is_company() from public;
grant execute on function public.is_company() to authenticated, anon, service_role;

drop policy if exists "Company can read students" on public.users;
create policy "Company can read students"
  on public.users
  for select
  using (public.is_company());

-- ---- Diagnostics (uncomment one block, run, paste me the result) -----------
--
-- A. Inspect the auth.users row for the demo company you're signing in as:
-- select id, email, encrypted_password is not null as has_password,
--        email_confirmed_at, banned_until, deleted_at,
--        is_sso_user, is_anonymous, role, aud
--   from auth.users
--  where email = 'demo+cs-01-pm-feature-cut@apto.test';
--
-- B. Inspect the matching identity row:
-- select i.user_id, i.provider, i.provider_id, i.email,
--        i.identity_data->>'email' as data_email,
--        i.last_sign_in_at
--   from auth.identities i
--   join auth.users u on u.id = i.user_id
--  where u.email = 'demo+cs-01-pm-feature-cut@apto.test';
--
-- C. Verify there's a matching public.users row (foreign-key target for
--    profile/submission/invitation rows):
-- select * from public.users
--  where id = (select id from auth.users where email = 'demo+cs-01-pm-feature-cut@apto.test');
