-- profile privacy
alter table public.profiles
  add column if not exists is_public boolean not null default false,
  add column if not exists username text,
  add column if not exists headline text;

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

-- connections (request/accept/reject between two users)
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending','accepted','rejected','blocked')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);
create index if not exists connections_recipient_idx on public.connections (recipient_id, status);
create index if not exists connections_requester_idx on public.connections (requester_id, status);

-- messages (only between accepted connections)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_connection_idx on public.messages (connection_id, created_at desc);

-- RLS
alter table public.connections enable row level security;
alter table public.messages enable row level security;

drop policy if exists connections_select on public.connections;
create policy connections_select on public.connections
  for select using (auth.uid() in (requester_id, recipient_id));

drop policy if exists connections_insert on public.connections;
create policy connections_insert on public.connections
  for insert with check (auth.uid() = requester_id);

drop policy if exists connections_update on public.connections;
create policy connections_update on public.connections
  for update using (auth.uid() in (requester_id, recipient_id));

drop policy if exists connections_delete on public.connections;
create policy connections_delete on public.connections
  for delete using (auth.uid() = requester_id);

drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
        and auth.uid() in (c.requester_id, c.recipient_id)
        and c.status = 'accepted'
    )
  );

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and auth.uid() in (c.requester_id, c.recipient_id)
        and c.status = 'accepted'
    )
  );

drop policy if exists messages_update_read on public.messages;
create policy messages_update_read on public.messages
  for update using (
    auth.uid() <> sender_id
    and exists (
      select 1 from public.connections c
      where c.id = connection_id and auth.uid() in (c.requester_id, c.recipient_id)
    )
  ) with check (true);

-- Profiles: allow anyone (including unauthenticated) to read public profiles.
-- Existing self-read policy "Profiles select own" remains in force.
drop policy if exists profiles_public_select on public.profiles;
create policy profiles_public_select on public.profiles
  for select using (is_public = true);

-- Allow anyone to read minimal user identity (name, avatar) for users whose
-- profiles are public, so the public profile route can resolve the display name.
-- Restricted to the join: users.id where a public profile exists.
drop policy if exists users_public_select on public.users;
create policy users_public_select on public.users
  for select using (
    exists (
      select 1 from public.profiles p
      where p.user_id = public.users.id and p.is_public = true
    )
    or auth.uid() = id
  );
