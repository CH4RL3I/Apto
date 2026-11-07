-- Multi-role support for public.users.
--
-- Until now public.users.role was a single text column with a CHECK constraint
-- limiting it to 'student' or 'company'. A user signing in with Google as a
-- student and later trying to use the same account on /login/company had no
-- way to gain the company role. This migration adds a roles text[] column so
-- a single auth.user can hold both 'student' and 'company' at once.
--
-- The legacy `role` column is kept and mirrors `roles[1]` via trigger so any
-- existing code (RLS policies such as is_company(), queries) that reads `role`
-- continues to work while new code reads `roles`.
--
-- The trigger works in both directions for rows that only set one column:
--   * roles empty/null  -> roles := array[role]   (legacy writers, e.g. the
--                          handle_new_auth_user signup trigger, only set role)
--   * roles non-empty   -> role  := roles[1]
--
-- Idempotent: safe to re-run. Deliberately does NOT swallow errors: if the
-- backfill, constraint or trigger cannot be created, the migration must fail.
--
-- Timestamp note: this file was renamed from 20260511135334 to sort after
-- 20260511140000_connections_redesign, which had already landed on main.

-- 1. Add roles column.
alter table public.users
  add column if not exists roles text[] not null default '{}';

-- 2. Backfill from legacy role for any existing rows.
update public.users
   set roles = array[role]
 where coalesce(array_length(roles, 1), 0) = 0
   and role is not null;

-- 3. CHECK constraint: every element of roles must be in ('student','company').
do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'users_roles_values_check'
       and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_roles_values_check
      check (roles <@ array['student','company']::text[]);
  end if;
end$$;

-- 4. Trigger keeping `role` and `roles` consistent.
create or replace function public.sync_users_role_from_roles()
returns trigger
language plpgsql
as $$
begin
  if coalesce(array_length(new.roles, 1), 0) = 0 then
    -- Legacy writer set only `role` (or roles was cleared): derive roles.
    if new.role is not null then
      new.roles := array[new.role];
    end if;
  elsif new.role is distinct from new.roles[1] then
    -- New code writes `roles`: mirror the primary (first) role into `role`.
    new.role := new.roles[1];
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
     where tgname = 'users_sync_role_from_roles'
       and tgrelid = 'public.users'::regclass
  ) then
    create trigger users_sync_role_from_roles
      before insert or update of roles on public.users
      for each row execute function public.sync_users_role_from_roles();
  end if;
end$$;
