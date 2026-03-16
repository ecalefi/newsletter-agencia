create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  whatsapp text,
  status text not null default 'active' check (status in ('active','unsubscribed')),
  source text not null default 'manual' check (source in ('manual','spreadsheet')),
  created_at timestamptz not null default now()
);

alter table public.contacts
add column if not exists whatsapp text;

create index if not exists idx_contacts_status on public.contacts(status);
create index if not exists idx_contacts_created_at on public.contacts(created_at desc);

create table if not exists public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_logs (
  id uuid primary key,
  subject text not null,
  preview_text text not null,
  mode text not null check (mode in ('test','weekly')),
  test_email text,
  total_recipients integer not null default 0,
  status text not null check (status in ('sent','failed')),
  provider_message_id text,
  error text,
  sent_at timestamptz not null default now()
);

create index if not exists idx_campaign_logs_sent_at on public.campaign_logs(sent_at desc);

insert into public.app_state (key, value)
values ('newsletter', '{}'::jsonb)
on conflict (key) do nothing;

-- Storage bucket (execute once in Supabase SQL editor)
insert into storage.buckets (id, name, public)
values ('newsletter-assets', 'newsletter-assets', true)
on conflict (id) do nothing;
