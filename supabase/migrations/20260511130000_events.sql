-- Events and registrations

create type event_type as enum ('workshop', 'company_info_session', 'career_talk', 'panel', 'networking');
create type event_topic as enum ('consulting', 'finance', 'product', 'marketing', 'engineering', 'general');
create type event_format as enum ('online', 'in_person', 'hybrid');

create table events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text not null,
  outcomes         text[] not null default '{}',
  host_company_id  uuid references companies(id) on delete set null,
  speaker_name     text,
  speaker_role     text,
  speaker_photo_url text,
  event_type       event_type not null,
  topic            event_topic not null,
  format           event_format not null default 'online',
  location         text,
  starts_at        timestamptz not null,
  duration_minutes integer not null default 60,
  total_spots      integer not null default 100,
  registered_count integer not null default 0,
  created_at       timestamptz not null default now()
);

create table event_registrations (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references events(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- RLS
alter table events enable row level security;
alter table event_registrations enable row level security;

create policy "events_read_all" on events
  for select using (true);

create policy "registrations_insert_own" on event_registrations
  for insert with check (auth.uid() = user_id);

create policy "registrations_select_own" on event_registrations
  for select using (auth.uid() = user_id);

-- Atomic registration RPC: increments registered_count and inserts row
create or replace function register_for_event(p_event_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_total   integer;
  v_count   integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select total_spots, registered_count
    into v_total, v_count
    from events
   where id = p_event_id
     for update;

  if not found then
    raise exception 'Event not found';
  end if;

  if v_count >= v_total then
    raise exception 'No spots remaining';
  end if;

  insert into event_registrations (event_id, user_id) values (p_event_id, v_user_id);

  update events set registered_count = registered_count + 1 where id = p_event_id;
end;
$$;

-- Extend notifications type constraint to include event_reminder
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'connection_request',
    'connection_accepted',
    'message_received',
    'invitation_received',
    'invitation_accepted',
    'invitation_rejected',
    'submission_scored',
    'event_reminder'
  ));

-- Seed companies for events (no auth user required)
insert into companies (id, name, logo_url, description) values
  ('a1000000-0000-0000-0000-000000000001', 'McKinsey & Company', null, 'Global management consulting firm.'),
  ('a1000000-0000-0000-0000-000000000002', 'Goldman Sachs', null, 'Leading global investment banking firm.'),
  ('a1000000-0000-0000-0000-000000000003', 'Spotify', null, 'Global audio streaming and media services provider.')
on conflict (id) do nothing;

-- Seed events
insert into events (id, title, description, outcomes, host_company_id, speaker_name, speaker_role, event_type, topic, format, starts_at, duration_minutes, total_spots, registered_count) values
(
  'b1000000-0000-0000-0000-000000000001',
  'Product Strategy Workshop',
  'Hands-on session covering product discovery, prioritisation frameworks, and roadmap communication. You will work through a real-world case alongside senior product managers.',
  array['Apply Jobs-to-be-Done and opportunity scoring', 'Build a one-page roadmap for a real product challenge', 'Practice stakeholder alignment techniques'],
  'a1000000-0000-0000-0000-000000000003',
  'Lena Hoffmann',
  'Senior Product Manager, Spotify',
  'workshop',
  'product',
  'online',
  (now() + interval '3 days')::date + time '14:00:00',
  120,
  40,
  12
),
(
  'b1000000-0000-0000-0000-000000000002',
  'Inside McKinsey: Consulting Info Session',
  'Gain an insider view of what life at a top consulting firm looks like — from application to engagement. Former analysts share candid advice on case prep and career progression.',
  array['Understand the consulting project lifecycle', 'Learn what recruiters look for beyond grades', 'Ask questions directly to consultants'],
  'a1000000-0000-0000-0000-000000000001',
  'Marc Bauer',
  'Associate, McKinsey & Company',
  'company_info_session',
  'consulting',
  'online',
  (now() + interval '7 days')::date + time '11:00:00',
  90,
  80,
  34
),
(
  'b1000000-0000-0000-0000-000000000003',
  'Careers in Investment Banking',
  'A candid career talk covering analyst roles, deal flow exposure, and what it takes to break into top-tier investment banking straight from university.',
  array['Map the IB analyst career path', 'Understand what skills matter most to hiring managers', 'Learn how to build a compelling application narrative'],
  'a1000000-0000-0000-0000-000000000002',
  'Sophie Richter',
  'Investment Banking Analyst, Goldman Sachs',
  'career_talk',
  'finance',
  'hybrid',
  (now() + interval '5 days')::date + time '17:00:00',
  60,
  120,
  67
);
