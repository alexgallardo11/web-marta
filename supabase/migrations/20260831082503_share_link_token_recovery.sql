alter table public.share_links
  add column token_ciphertext text;

alter table public.share_links
  add constraint share_links_token_ciphertext_policy_check
  check (
    (policy = 'permanent'::public.share_link_policy)
    or
    (policy = 'one_time'::public.share_link_policy and token_ciphertext is null)
  );

-- Permanent links created before token recovery keep working, but their original
-- token cannot be reconstructed from its one-way hash. New permanent links
-- receive token_ciphertext from the application and can be recovered by admins.
