-- Demo / contact requests submitted from the marketing site.
-- Writes happen only through the `contact` edge function (service role), so RLS
-- is enabled with no public policies — the table is not directly readable or
-- writable by the anon or authenticated roles.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  organization text not null,
  role text,
  claim_volume text,
  interest text,
  message text,
  source text,
  user_agent text
);

alter table public.contact_submissions enable row level security;

comment on table public.contact_submissions is
  'Marketing-site demo requests. Inserted by the contact edge function only.';
