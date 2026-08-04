drop policy if exists "Admins can view their own access" on public.admin_users;
drop policy if exists "Owner can manage administrator access" on public.admin_users;

create policy "Administrators can view access"
on public.admin_users
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.is_owner())
);

create policy "Owner can invite administrators"
on public.admin_users
for insert
to authenticated
with check ((select private.is_owner()));

create policy "Owner can update administrators"
on public.admin_users
for update
to authenticated
using ((select private.is_owner()))
with check ((select private.is_owner()));

create policy "Owner can remove administrators"
on public.admin_users
for delete
to authenticated
using ((select private.is_owner()));
