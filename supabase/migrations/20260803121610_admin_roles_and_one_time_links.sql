create type public.admin_role as enum ('owner', 'admin');

alter table public.admin_users
  add column email text,
  add column role public.admin_role not null default 'admin',
  add column is_active boolean not null default true,
  add column invited_by uuid references auth.users(id),
  add column updated_at timestamptz not null default now(),
  add constraint admin_users_email_check check (
    email is null or (
      char_length(trim(email)) between 3 and 320
      and email = lower(trim(email))
    )
  ),
  add constraint admin_users_owner_active_check check (
    role <> 'owner' or is_active
  );

create unique index admin_users_email_idx
  on public.admin_users (lower(email))
  where email is not null;

create unique index admin_users_single_owner_idx
  on public.admin_users (role)
  where role = 'owner';

create index admin_users_active_idx
  on public.admin_users (is_active, role);

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
      and is_active
      and role in ('owner'::public.admin_role, 'admin'::public.admin_role)
  );
$$;

create or replace function private.is_owner()
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
      and is_active
      and role = 'owner'::public.admin_role
  );
$$;

revoke all on function private.is_owner() from public;
grant execute on function private.is_owner() to authenticated, service_role;

create or replace function private.set_admin_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute function private.set_admin_updated_at();

create or replace function private.prevent_owner_deactivation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.role = 'owner'::public.admin_role
    and (new.role <> old.role or not new.is_active) then
    raise exception 'The owner account cannot be deactivated or demoted';
  end if;
  return new;
end;
$$;

create trigger admin_users_prevent_owner_deactivation
before update on public.admin_users
for each row execute function private.prevent_owner_deactivation();

create policy "Owner can manage administrator access"
on public.admin_users
for all
to authenticated
using ((select private.is_owner()))
with check ((select private.is_owner()));

update public.share_links
set expires_at = created_at + interval '24 hours'
where expires_at is null;

alter table public.share_links
  alter column expires_at set not null,
  add column used_at timestamptz,
  add constraint share_links_expiry_after_creation_check
    check (expires_at > created_at),
  add constraint share_links_used_after_creation_check
    check (used_at is null or used_at >= created_at);

update public.share_links as share_link
set used_at = events.first_downloaded_at
from (
  select share_link_id, min(downloaded_at) as first_downloaded_at
  from public.download_events
  group by share_link_id
) as events
where share_link.id = events.share_link_id
  and share_link.used_at is null;

delete from public.download_events as duplicate_event
using public.download_events as first_event
where duplicate_event.share_link_id = first_event.share_link_id
  and duplicate_event.id > first_event.id;

create unique index download_events_one_per_link_idx
  on public.download_events(share_link_id);

create index share_links_active_idx
  on public.share_links(document_id, expires_at)
  where revoked_at is null and used_at is null;

create index share_links_status_idx
  on public.share_links(expires_at, revoked_at, used_at);

create or replace function public.consume_share_link(p_token_hash text)
returns table (share_link_id uuid, document_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  consumed_link_id uuid;
  consumed_document_id uuid;
begin
  update public.share_links
  set used_at = now()
  where token_hash = p_token_hash
    and revoked_at is null
    and used_at is null
    and expires_at > now()
  returning id, public.share_links.document_id
  into consumed_link_id, consumed_document_id;

  if not found then
    return;
  end if;

  insert into public.download_events (share_link_id)
  values (consumed_link_id);

  return query
  select consumed_link_id, consumed_document_id;
end;
$$;

revoke all on function public.consume_share_link(text) from public;
grant execute on function public.consume_share_link(text) to service_role;
