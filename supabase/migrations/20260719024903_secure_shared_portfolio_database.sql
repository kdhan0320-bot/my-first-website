drop table if exists public.guestbook;

drop function if exists public.delete_expired_users();

alter function public.auto_confirm_email()
  set search_path = '';

revoke all
  on function public.auto_confirm_email()
  from public, anon, authenticated;

create or replace function public.increment_view_count(p_post_id bigint)
returns void
language sql
security definer
set search_path = ''
as $function$
  update public.posts
  set view_count = coalesce(view_count, 0) + 1
  where id = p_post_id;
$function$;

revoke all
  on function public.increment_view_count(bigint)
  from public, anon, authenticated;

grant execute
  on function public.increment_view_count(bigint)
  to anon, authenticated, service_role;

revoke all
  on function public.rls_auto_enable()
  from public, anon, authenticated;

alter function public.update_updated_at()
  set search_path = '';

revoke all
  on function public.update_updated_at()
  from public, anon, authenticated;
