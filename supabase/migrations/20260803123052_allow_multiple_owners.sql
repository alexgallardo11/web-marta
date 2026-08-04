-- The platform supports more than one owner. Every owner remains protected
-- from deactivation or demotion by the trigger created in the previous
-- migration, while all active owners can manage administrator access.
drop index if exists public.admin_users_single_owner_idx;
