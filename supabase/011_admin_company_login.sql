-- Adds an "Apto Admin" company that sees submissions across every case study.
-- Run via Supabase Dashboard -> SQL Editor. Idempotent. Safe to re-run.
-- Login: admin@apto.test / apto-demo-2025

create extension if not exists "pgcrypto";

-- 1. Flag column on companies. Existing rows default to false.
alter table public.companies
  add column if not exists is_admin boolean not null default false;

-- 2. Auth user.
insert into auth.users (
  id, email, encrypted_password, instance_id, aud, role,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values (
  '11110000-0000-4000-8000-000000000001',
  'admin@apto.test',
  crypt('apto-demo-2025', gen_salt('bf')),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb
)
on conflict (id) do update set
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at;

-- 3. Auth identity so Supabase can resolve email -> user during sign-in.
insert into auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) values (
  '11110000-0000-4000-8000-000000000002',
  '11110000-0000-4000-8000-000000000001',
  '11110000-0000-4000-8000-000000000001',
  '{"sub":"11110000-0000-4000-8000-000000000001","email":"admin@apto.test","email_verified":true}'::jsonb,
  'email',
  now(), now(), now()
)
on conflict (provider, provider_id) do nothing;

-- 4. Public users row (role=company so the existing portal route allows them in).
insert into public.users (id, role, email, name)
values (
  '11110000-0000-4000-8000-000000000001',
  'company',
  'admin@apto.test',
  'Apto Admin'
)
on conflict (id) do update set
  role = excluded.role,
  email = excluded.email,
  name = excluded.name;

-- 5. Company row marked is_admin=true.
insert into public.companies (id, user_id, name, logo_url, contact_email, is_admin)
values (
  '11110000-0000-4000-8000-000000000003',
  '11110000-0000-4000-8000-000000000001',
  'Apto Admin',
  null,
  'admin@apto.test',
  true
)
on conflict (id) do update set
  user_id = excluded.user_id,
  name = excluded.name,
  contact_email = excluded.contact_email,
  is_admin = excluded.is_admin;
