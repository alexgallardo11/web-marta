revoke execute on function public.consume_share_link(text)
from public, anon, authenticated;

grant execute on function public.consume_share_link(text) to service_role;
