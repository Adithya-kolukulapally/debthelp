alter table public.assessments
  add column if not exists contact_consent_at timestamptz;
