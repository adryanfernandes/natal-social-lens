create extension if not exists pgcrypto;

create table if not exists public.excel_rows (
  id uuid primary key default gen_random_uuid(),
  source_file text not null,
  sheet_name text not null,
  row_number integer not null,
  data jsonb not null,
  imported_at timestamptz not null default now(),
  unique (source_file, sheet_name, row_number)
);

create index if not exists excel_rows_source_sheet_idx
  on public.excel_rows (source_file, sheet_name);

alter table public.excel_rows enable row level security;

create policy "Leitura publica de dados agregados importados"
  on public.excel_rows
  for select
  to anon, authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('excel-fontes', 'excel-fontes', false)
on conflict (id) do nothing;

create policy "Leitura publica dos arquivos Excel do observatorio"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'excel-fontes');
