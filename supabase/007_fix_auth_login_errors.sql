-- Resolve "Database error querying schema" on company sign-in.
--
-- Two root causes are addressed here, both idempotent:
--
-- 1. RLS recursion on public.users
--    The original "Company can read students" policy queried public.users
--    from inside its own USING clause, which re-triggers the same policy
--    and either recurses or errors. We replace it with a SECURITY DEFINER
--    helper that runs as the function owner and bypasses RLS on the inner
--    check.
--
-- 2. auth.identities.email NULL on seeded demo users
--    Supabase Auth (gotrue) >= ~2024-04 reads auth.identities.email
--    directly during sign-in. Migration 004 only populated
--    identity_data->>'email', leaving the column NULL on the seed rows.
--    We backfill it from identity_data when the column exists.

-- ---- 1. RLS recursion fix --------------------------------------------------

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

-- ---- 2. Backfill auth.identities.email on the demo seed --------------------
-- Wrapped in DO so it's a no-op on Supabase versions where the column
-- doesn't exist yet.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name   = 'identities'
      and column_name  = 'email'
  ) then
    execute $sql$
      update auth.identities
         set email = identity_data->>'email'
       where email is null
         and identity_data ? 'email';
    $sql$;
  end if;
end
$$;

-- ---- 3. Sanity diagnostics (run these manually if the error persists) ------
-- select email, encrypted_password is null as no_password,
--        email_confirmed_at, banned_until, is_sso_user
--   from auth.users
--  where email = 'demo+cs-01-pm-feature-cut@apto.test';
--
-- select i.user_id, i.provider, i.email as identity_email,
--        i.identity_data->>'email' as data_email
--   from auth.identities i
--   join auth.users u on u.id = i.user_id
--  where u.email = 'demo+cs-01-pm-feature-cut@apto.test';
