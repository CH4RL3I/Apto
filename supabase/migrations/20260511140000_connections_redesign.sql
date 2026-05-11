-- Connections redesign: connection_activity table, profile fields, seed data

-- Add new profile fields (check before adding to avoid conflicts)
alter table public.profiles
  add column if not exists university text,
  add column if not exists year_of_study text,
  add column if not exists career_interests text[] not null default '{}';

-- connection_activity table
create table if not exists public.connection_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'challenge_completed', 'challenge_started', 'career_interest_updated'
  )),
  description text not null,
  case_study_id text,
  company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists connection_activity_user_idx
  on public.connection_activity (user_id, created_at desc);

alter table public.connection_activity enable row level security;

-- Students can read their own activity and activity from accepted connections
create policy "connection_activity_select" on public.connection_activity
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.connections c
      where c.status = 'accepted'
      and (
        (c.requester_id = auth.uid() and c.recipient_id = connection_activity.user_id)
        or (c.recipient_id = auth.uid() and c.requester_id = connection_activity.user_id)
      )
    )
  );

-- Students can insert their own activity rows
create policy "connection_activity_insert" on public.connection_activity
  for insert with check (auth.uid() = user_id);

-- Seed 5 realistic student profiles
do $$
declare
  u1 uuid := 'a0000000-0000-0000-0000-000000000001';
  u2 uuid := 'a0000000-0000-0000-0000-000000000002';
  u3 uuid := 'a0000000-0000-0000-0000-000000000003';
  u4 uuid := 'a0000000-0000-0000-0000-000000000004';
  u5 uuid := 'a0000000-0000-0000-0000-000000000005';
begin
  -- Insert into auth.users; the trigger automatically creates public.users rows
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, raw_app_meta_data,
    created_at, updated_at, is_super_admin, is_sso_user
  ) values
    (u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'anna.schmidt@seed.apto.app', '',
      now(), '{"name":"Anna Schmidt"}'::jsonb, '{}'::jsonb, now(), now(), false, false),
    (u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'ben.mueller@seed.apto.app', '',
      now(), '{"name":"Ben Müller"}'::jsonb, '{}'::jsonb, now(), now(), false, false),
    (u3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'clara.weber@seed.apto.app', '',
      now(), '{"name":"Clara Weber"}'::jsonb, '{}'::jsonb, now(), now(), false, false),
    (u4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'david.koch@seed.apto.app', '',
      now(), '{"name":"David Koch"}'::jsonb, '{}'::jsonb, now(), now(), false, false),
    (u5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'eva.fischer@seed.apto.app', '',
      now(), '{"name":"Eva Fischer"}'::jsonb, '{}'::jsonb, now(), now(), false, false)
  on conflict (id) do nothing;

  -- Insert profiles (upsert so re-running is safe)
  insert into public.profiles (
    user_id, is_public, username, headline,
    university, year_of_study, career_interests, cv_skills
  ) values
    (u1, true, 'anna-schmidt', 'Aspiring Product Manager',
      'LMU Munich', '3rd year',
      array['Product Management', 'UX Design'],
      array['Product strategy', 'User research', 'Agile']),
    (u2, true, 'ben-mueller', 'Future Strategy Consultant',
      'WHU Vallendar', '4th year',
      array['Consulting', 'Strategy'],
      array['Case interviews', 'Market sizing', 'PowerPoint']),
    (u3, true, 'clara-weber', 'Data Science enthusiast',
      'TU Berlin', '5th year (Master)',
      array['Data Analytics', 'Machine Learning'],
      array['Python', 'SQL', 'Tableau']),
    (u4, true, 'david-koch', 'Breaking into Investment Banking',
      'Goethe University Frankfurt', '3rd year',
      array['Finance', 'Investment Banking'],
      array['Financial modelling', 'Excel', 'Bloomberg']),
    (u5, true, 'eva-fischer', 'Software engineer with a product mindset',
      'RWTH Aachen', '4th year',
      array['Engineering', 'Product'],
      array['React', 'TypeScript', 'System design'])
  on conflict (user_id) do update set
    is_public     = excluded.is_public,
    username      = excluded.username,
    headline      = excluded.headline,
    university    = excluded.university,
    year_of_study = excluded.year_of_study,
    career_interests = excluded.career_interests,
    cv_skills     = excluded.cv_skills;

  -- Insert seed submissions (challenge completions)
  insert into public.submissions (user_id, case_study_id, status, score, submitted_at)
  values
    -- Anna: product management
    (u1, 'cs-01-pm-feature-cut',         'scored', 78, now() - interval '10 days'),
    (u1, 'cs-02-pm-onboarding-redesign', 'scored', 82, now() - interval '5 days'),
    (u1, 'cs-03-pm-pmf-validation',      'scored', 75, now() - interval '2 days'),
    -- Ben: consulting
    (u2, 'cs-12-consulting-cost-reduction', 'scored', 88, now() - interval '8 days'),
    -- Clara: data analytics
    (u3, 'cs-04-data-margin-deepdive',   'scored', 91, now() - interval '12 days'),
    (u3, 'cs-05-data-churn-features',    'scored', 87, now() - interval '6 days'),
    -- David: finance
    (u4, 'cs-15-ib-valuation-ma',        'scored', 80, now() - interval '9 days'),
    (u4, 'cs-16-fpa-forecast-revision',  'scored', 76, now() - interval '4 days'),
    -- Eva: engineering
    (u5, 'cs-13-swe-build-vs-buy',       'scored', 83, now() - interval '7 days'),
    (u5, 'cs-14-ml-production-tradeoff', 'scored', 89, now() - interval '1 day')
  on conflict do nothing;

  -- Seed connection_activity so the activity feed is not empty
  insert into public.connection_activity (user_id, activity_type, description, case_study_id)
  values
    (u1, 'challenge_completed', 'completed a PM challenge at ShipFlow',  'cs-01-pm-feature-cut'),
    (u1, 'challenge_completed', 'completed a PM challenge at LendBright', 'cs-02-pm-onboarding-redesign'),
    (u2, 'challenge_completed', 'completed a consulting challenge at BGM Group', 'cs-12-consulting-cost-reduction'),
    (u3, 'challenge_completed', 'completed a data analytics challenge at MountainCo', 'cs-04-data-margin-deepdive'),
    (u3, 'challenge_completed', 'completed a data science challenge at FlowStack', 'cs-05-data-churn-features'),
    (u4, 'challenge_completed', 'completed a finance challenge at TransBavaria', 'cs-15-ib-valuation-ma'),
    (u5, 'challenge_completed', 'completed an engineering challenge at MarktLab', 'cs-13-swe-build-vs-buy')
  on conflict do nothing;
end $$;
