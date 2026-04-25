-- Reviewer notes on submissions and a richer status pipeline.

alter table public.submissions
  add column if not exists reviewer_notes text;

alter table public.submissions
  drop constraint if exists submissions_status_check;

alter table public.submissions
  add constraint submissions_status_check
  check (status in (
    'in_progress',
    'submitted',
    'scored',
    'reviewed',
    'shortlisted',
    'rejected'
  ));
