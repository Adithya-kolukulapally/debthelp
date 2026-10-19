alter table public.assessments
  add column if not exists attribution jsonb not null default '{}'::jsonb;
