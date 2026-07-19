begin;

-- Public SECURITY DEFINER RPC allowed arbitrary view-count inflation.
-- The Community currently has no posts, and view count is not an essential feature.
drop function if exists public.increment_view_count(bigint);

commit;
