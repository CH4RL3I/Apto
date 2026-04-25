-- Auto-provision public.users / profiles / companies on auth signup.
--
-- Why: server-side signup actions used to do these inserts after
-- supabase.auth.signUp(), but when email confirmation is on signUp returns
-- no session, so the follow-up insert ran unauthenticated and tripped the
-- "new row violates row-level security policy for table users" RLS check.
--
-- A SECURITY DEFINER trigger sidesteps RLS and works the same for email,
-- magic-link, and OAuth signups. Idempotent — safe to re-run.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text := nullif(new.raw_user_meta_data ->> 'role', '');
  meta_full_name text := nullif(new.raw_user_meta_data ->> 'full_name', '');
  meta_company_name text := nullif(new.raw_user_meta_data ->> 'company_name', '');
  meta_avatar text := nullif(new.raw_user_meta_data ->> 'avatar_url', '');
  resolved_role text := coalesce(meta_role, 'student');
begin
  if resolved_role not in ('student', 'company') then
    resolved_role := 'student';
  end if;

  insert into public.users (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(meta_full_name, meta_company_name),
    meta_avatar,
    resolved_role
  )
  on conflict (id) do nothing;

  if resolved_role = 'student' then
    insert into public.profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  else
    insert into public.companies (user_id, name, contact_email)
    values (
      new.id,
      coalesce(meta_company_name, meta_full_name, new.email),
      new.email
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
