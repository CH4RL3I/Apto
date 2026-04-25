-- Fix: GoTrue "Scan error on column ... converting NULL to string is unsupported"
--
-- The Go struct gotrue uses to scan auth.users declares several token
-- columns as non-nullable strings. When the row was inserted via raw
-- SQL (migration 004) those columns default to NULL, and GoTrue fails
-- with the generic "Database error querying schema" wrapper on every
-- /token request.
--
-- Replace NULL with '' on every column gotrue scans as a non-null string.
-- Limited to the demo seed accounts; safe and idempotent.

update auth.users
   set confirmation_token        = coalesce(confirmation_token,        ''),
       recovery_token             = coalesce(recovery_token,             ''),
       email_change_token_new     = coalesce(email_change_token_new,     ''),
       email_change_token_current = coalesce(email_change_token_current, ''),
       email_change               = coalesce(email_change,               ''),
       phone_change               = coalesce(phone_change,               ''),
       phone_change_token         = coalesce(phone_change_token,         ''),
       reauthentication_token     = coalesce(reauthentication_token,     '')
 where email like 'demo+cs-%@apto.test';
