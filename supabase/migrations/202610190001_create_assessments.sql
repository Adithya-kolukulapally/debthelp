create extension if not exists pgcrypto;

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  province text not null,
  debt_amount_range text not null,
  homeowner text not null,
  mortgage_equity text,
  debt_types text[] not null default '{}',
  age_range text not null,
  prior_filing text not null,
  created_at timestamptz not null default now()
);

alter table public.assessments enable row level security;
-- Browser clients cannot read or write this table. The Edge Function uses the
-- service role after validating the submitted payload.
revoke all on public.assessments from anon, authenticated;
