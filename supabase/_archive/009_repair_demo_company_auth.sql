-- Repair demo company auth so /login/company actually works.
--
-- Migration 004's auth.users insert does not set encrypted_password
-- and never creates auth.identities rows, so the demo accounts cannot
-- be signed in via email/password. GoTrue surfaces this as the
-- generic "Database error querying schema" message.
--
-- This migration is idempotent: safe to re-run.

create extension if not exists pgcrypto;

-- 1. Set / refresh the bcrypt password and required flags on every
--    demo company auth.users row. Password: apto-demo-2025
update auth.users
   set encrypted_password = crypt('apto-demo-2025', gen_salt('bf', 10)),
       email_confirmed_at = coalesce(email_confirmed_at, now()),
       is_sso_user        = coalesce(is_sso_user,  false),
       is_anonymous       = coalesce(is_anonymous, false)
 where email like 'demo+cs-%@apto.test';

-- 2. Create the matching auth.identities row when missing.
--    For the 'email' provider on current Supabase Auth, provider_id
--    must equal the user's email address.
insert into auth.identities (
  id, user_id, provider, provider_id, identity_data,
  last_sign_in_at, created_at, updated_at
)
select gen_random_uuid(),
       u.id,
       'email',
       u.email,
       jsonb_build_object(
         'sub',            u.id::text,
         'email',          u.email,
         'email_verified', true
       ),
       now(), now(), now()
  from auth.users u
 where u.email like 'demo+cs-%@apto.test'
   and not exists (
     select 1 from auth.identities i
      where i.user_id = u.id
        and i.provider = 'email'
   );

-- 3. For seed identities that already exist but have the wrong
--    provider_id (UUID instead of email) or stale identity_data,
--    correct them in place.
update auth.identities i
   set provider_id  = u.email,
       identity_data = jsonb_build_object(
         'sub',            u.id::text,
         'email',          u.email,
         'email_verified', true
       ),
       updated_at   = now()
  from auth.users u
 where i.user_id  = u.id
   and i.provider = 'email'
   and u.email like 'demo+cs-%@apto.test'
   and (
     i.provider_id <> u.email
     or coalesce(i.identity_data->>'email', '') <> u.email
   );

-- 4. Verification — should return one row per demo user with all
--    flags green. Uncomment to inspect.
--
-- select u.email,
--        u.encrypted_password is not null as has_password,
--        u.email_confirmed_at is not null as confirmed,
--        i.provider_id = u.email          as identity_id_matches,
--        i.identity_data->>'email'        as identity_email
--   from auth.users u
--   left join auth.identities i
--     on i.user_id = u.id and i.provider = 'email'
--  where u.email like 'demo+cs-%@apto.test'
--  order by u.email;
