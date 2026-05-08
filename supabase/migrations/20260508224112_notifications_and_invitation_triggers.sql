-- invitations baseline (idempotent in case the company-hiring-portal branch lands first)
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  submission_id uuid,
  user_id uuid not null,
  status text not null default 'sent' check (status in ('sent','accepted','rejected','expired')),
  message text,
  sent_at timestamptz not null default now(),
  responded_at timestamptz,
  contact_email text
);
create index if not exists invitations_user_idx on public.invitations (user_id, status);

-- notifications: in-app feed
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in (
    'connection_request','connection_accepted','message_received',
    'invitation_received','invitation_accepted','invitation_rejected',
    'submission_scored'
  )),
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;
create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update using (auth.uid() = user_id);
-- inserts come from triggers / server actions running with elevated context

-- Trigger: new invitation -> notify the recipient student
create or replace function public.notify_on_invitation() returns trigger
language plpgsql security definer as $$
begin
  insert into public.notifications (user_id, type, payload)
  values (new.user_id, 'invitation_received', jsonb_build_object(
    'invitation_id', new.id,
    'company_id', new.company_id,
    'submission_id', new.submission_id,
    'message', new.message
  ));
  return new;
end;
$$;

drop trigger if exists trg_notify_on_invitation on public.invitations;
create trigger trg_notify_on_invitation
  after insert on public.invitations
  for each row execute function public.notify_on_invitation();

-- Trigger: connection status flips to 'accepted' -> notify the requester
create or replace function public.notify_on_connection_accepted() returns trigger
language plpgsql security definer as $$
begin
  if new.status = 'accepted' and (old.status is null or old.status <> 'accepted') then
    insert into public.notifications (user_id, type, payload)
    values (new.requester_id, 'connection_accepted', jsonb_build_object(
      'connection_id', new.id,
      'recipient_id', new.recipient_id
    ));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_on_connection_accepted on public.connections;
create trigger trg_notify_on_connection_accepted
  after update on public.connections
  for each row execute function public.notify_on_connection_accepted();

-- Trigger: new connection request -> notify the recipient
create or replace function public.notify_on_connection_request() returns trigger
language plpgsql security definer as $$
begin
  insert into public.notifications (user_id, type, payload)
  values (new.recipient_id, 'connection_request', jsonb_build_object(
    'connection_id', new.id,
    'requester_id', new.requester_id
  ));
  return new;
end;
$$;

drop trigger if exists trg_notify_on_connection_request on public.connections;
create trigger trg_notify_on_connection_request
  after insert on public.connections
  for each row execute function public.notify_on_connection_request();

-- Trigger: new message -> notify the OTHER party in the connection
create or replace function public.notify_on_message() returns trigger
language plpgsql security definer as $$
declare
  recipient uuid;
begin
  select case when c.requester_id = new.sender_id then c.recipient_id else c.requester_id end
    into recipient
  from public.connections c
  where c.id = new.connection_id;

  if recipient is not null then
    insert into public.notifications (user_id, type, payload)
    values (recipient, 'message_received', jsonb_build_object(
      'connection_id', new.connection_id,
      'message_id', new.id,
      'sender_id', new.sender_id,
      'preview', left(new.body, 120)
    ));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_on_message on public.messages;
create trigger trg_notify_on_message
  after insert on public.messages
  for each row execute function public.notify_on_message();
