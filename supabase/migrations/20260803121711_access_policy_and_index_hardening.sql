drop policy if exists "Admins can view their access" on public.admin_users;

create policy "Admins can view their own access"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

create index admin_users_invited_by_idx
  on public.admin_users(invited_by);

create index documents_created_by_idx
  on public.documents(created_by);

create index share_links_created_by_idx
  on public.share_links(created_by);
