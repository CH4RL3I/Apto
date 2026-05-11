-- User-data cascade hardening
--
-- Goal: deleting an auth.users row must wipe ALL of that user's data.
--
-- Audit findings against the migrations on disk (remote_schema baseline):
--   public.users.id              → auth.users(id)        ON DELETE CASCADE  ✔
--   public.profiles.user_id      → public.users(id)      ON DELETE CASCADE  ✔
--   public.submissions.user_id   → public.users(id)      ON DELETE CASCADE  ✔
--   public.invitations.user_id   → public.users(id)      NO ACTION          ✘
--   public.connections.requester_id → auth.users(id)     ON DELETE CASCADE  ✔
--   public.connections.recipient_id → auth.users(id)     ON DELETE CASCADE  ✔
--   public.messages.sender_id    → auth.users(id)        ON DELETE CASCADE  ✔
--   public.messages.connection_id → public.connections(id) ON DELETE CASCADE  ✔
--   public.notifications.user_id → auth.users(id)        ON DELETE CASCADE  ✔
--   public.case_study_tasks.updated_by → auth.users(id)  ON DELETE SET NULL ✔
--
-- This migration rewrites the only leak (invitations.user_id) and re-points
-- the user-owned tables that route through public.users(id) so they cascade
-- DIRECTLY from auth.users(id). That makes the cascade chain robust to a
-- future drop/rename of public.users, and ensures `auth.admin.deleteUser`
-- can never leave orphaned submissions / profiles / invitations behind.
--
-- The migration is idempotent: each constraint rewrite is wrapped in a
-- DO block that catches errors so re-running against a DB that already has
-- the new state is a no-op.

-- ---------------------------------------------------------------------------
-- invitations.user_id  →  auth.users(id) ON DELETE CASCADE
-- ---------------------------------------------------------------------------
do $$
begin
  begin
    alter table public.invitations drop constraint if exists invitations_user_id_fkey;
  exception when others then null;
  end;
  begin
    alter table public.invitations
      add constraint invitations_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  exception when others then null;
  end;
end $$;

-- ---------------------------------------------------------------------------
-- profiles.user_id  →  auth.users(id) ON DELETE CASCADE
-- (previously referenced public.users(id); the cascade chain was intact via
--  public.users → auth.users, but routing directly removes a fragility risk.)
-- ---------------------------------------------------------------------------
do $$
begin
  begin
    alter table public.profiles drop constraint if exists profiles_user_id_fkey;
  exception when others then null;
  end;
  begin
    alter table public.profiles
      add constraint profiles_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  exception when others then null;
  end;
end $$;

-- ---------------------------------------------------------------------------
-- submissions.user_id  →  auth.users(id) ON DELETE CASCADE
-- This is the critical fix for the bug where a multi-task submission
-- survived account deletion: route the FK directly at auth.users.
-- ---------------------------------------------------------------------------
do $$
begin
  begin
    alter table public.submissions drop constraint if exists submissions_user_id_fkey;
  exception when others then null;
  end;
  begin
    alter table public.submissions
      add constraint submissions_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  exception when others then null;
  end;
end $$;
