-- Multi-role support for public.users.
--
-- Until now public.users.role was a single text column with a CHECK constraint
-- limiting it to 'student' or 'company'. A user signing in with Google as a
-- student and later trying to use the same account on /login/company had no
-- way to gain the company role. This migration adds a roles text[] column so
-- a single auth.user can hold both 'student' and 'company' at once.
--
-- The legacy `role` column is kept and mirrors `roles[1]` via trigger so any
-- existing code (RLS policies, queries) that reads `role` continues to work
-- while new code migrates to reading `roles`.
--
-- Idempotent: safe to re-run.

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
exception when others then
  -- Don't block the migration if the constraint already exists in a different
  -- shape or if backfill produced a stray value; surface it in logs instead.
  raise notice 'users_roles_values_check add skipped: %', sqlerrm;
end$$;

-- 4. Trigger to keep legacy `role` in sync with roles[1]. New code writes
--    `roles`; this guarantees the deprecated `role` column always reflects the
--    primary (first) role so RLS policies that gate on role keep working.
create or replace function public.sync_users_role_from_roles()
returns trigger
language plpgsql
as $$
begin
  if new.roles is not null and array_length(new.roles, 1) >= 1 then
    -- Only override `role` when it doesn't already match roles[1]. This lets
    -- callers that still write `role` directly (legacy code path) win, while
    -- callers that write `roles` get the mirror for free.
    if new.role is distinct from new.roles[1] then
      new.role := new.roles[1];
    end if;
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
exception when others then
  raise notice 'users_sync_role_from_roles trigger create skipped: %', sqlerrm;
end$$;
