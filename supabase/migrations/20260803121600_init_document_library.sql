create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 160),
  storage_path text not null unique check (
    char_length(storage_path) between 1 and 500
    and storage_path not like '%..%'
  ),
  original_filename text not null check (
    char_length(original_filename) between 1 and 255
  ),
  mime_type text not null default 'application/pdf'
    check (mime_type = 'application/pdf'),
  size_bytes bigint not null check (
    size_bytes > 0 and size_bytes <= 104857600
  ),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  token_hash char(64) not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > created_at)
);

create table public.download_events (
  id bigint generated always as identity primary key,
  share_link_id uuid not null references public.share_links(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create index documents_updated_at_idx
  on public.documents(updated_at desc);
create index documents_title_idx
  on public.documents using btree(lower(title));
create index share_links_document_id_idx
  on public.share_links(document_id);
create index download_events_share_link_id_idx
  on public.download_events(share_link_id, downloaded_at desc);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated, service_role;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger documents_set_updated_at
before update on public.documents
for each row execute function private.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.documents enable row level security;
alter table public.share_links enable row level security;
alter table public.download_events enable row level security;

create policy "Admins can view their access"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Admins can manage documents"
on public.documents
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can manage share links"
on public.share_links
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can read download events"
on public.download_events
for select
to authenticated
using ((select private.is_admin()));

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'documents',
  'documents',
  false,
  104857600,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can read stored documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and (select private.is_admin())
);

create policy "Admins can upload documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and (select private.is_admin())
);

create policy "Admins can replace documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
  and (select private.is_admin())
)
with check (
  bucket_id = 'documents'
  and (select private.is_admin())
);

create policy "Admins can delete documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and (select private.is_admin())
);
