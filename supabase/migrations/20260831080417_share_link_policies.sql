create type public.share_link_policy as enum ('permanent', 'one_time');

alter table public.share_links
  add column policy public.share_link_policy;

-- Existing links keep the policy they had before this feature existed.
update public.share_links
set policy = 'one_time'::public.share_link_policy
where policy is null;

alter table public.share_links
  alter column policy set default 'permanent'::public.share_link_policy,
  alter column policy set not null,
  alter column expires_at drop not null,
  drop constraint if exists share_links_expiry_after_creation_check;

alter table public.share_links
  add constraint share_links_policy_check
  check (
    (policy = 'permanent'::public.share_link_policy
      and expires_at is null
      and used_at is null)
    or
    (policy = 'one_time'::public.share_link_policy
      and expires_at is not null
      and expires_at > created_at)
  );

drop index if exists public.download_events_one_per_link_idx;

create or replace function public.consume_share_link(p_token_hash text)
returns table (share_link_id uuid, document_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  consumed_link_id uuid;
  consumed_document_id uuid;
  consumed_policy public.share_link_policy;
begin
  select id, public.share_links.document_id, policy
  into consumed_link_id, consumed_document_id, consumed_policy
  from public.share_links
  where token_hash = p_token_hash
    and revoked_at is null
    and (
      (policy = 'permanent'::public.share_link_policy and expires_at is null)
      or
      (policy = 'one_time'::public.share_link_policy
        and used_at is null
        and expires_at > now())
    )
  for update;

  if not found then
    return;
  end if;

  if consumed_policy = 'one_time'::public.share_link_policy then
    update public.share_links
    set used_at = now()
    where id = consumed_link_id;
  end if;

  insert into public.download_events (share_link_id)
  values (consumed_link_id);

  return query
  select consumed_link_id, consumed_document_id;
end;
$$;

revoke all on function public.consume_share_link(text) from public;
grant execute on function public.consume_share_link(text) to service_role;
