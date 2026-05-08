alter table "public"."submissions"
  add column if not exists "is_multi_task" boolean not null default false;

alter table "public"."submissions"
  add column if not exists "task_responses" jsonb null;

alter table "public"."submissions"
  add column if not exists "task_scores" jsonb null;
