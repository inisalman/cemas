create table if not exists public.results (
  id bigint generated always as identity primary key,
  participant_id uuid not null,
  initials text not null,
  phase text not null check (phase in ('pre', 'post')),
  answers jsonb not null,
  anxiety_score integer not null check (anxiety_score between 4 and 20),
  information_score integer not null check (information_score between 2 and 10),
  created_at timestamptz not null default now()
);
alter table public.results enable row level security;
revoke all on public.results from anon, authenticated;

grant select, insert on public.results to service_role;
