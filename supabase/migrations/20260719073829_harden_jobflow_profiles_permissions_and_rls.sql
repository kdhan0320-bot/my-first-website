begin;

-- Supabase 기본 권한으로 남은 불필요 권한을 제거하고 필요한 CRUD만 재부여
revoke all on table public.jobflow_profiles from authenticated;

grant select, insert, update, delete
  on table public.jobflow_profiles
  to authenticated;

-- RLS 조건은 동일하게 유지하되 auth.uid()를 statement 단위로 평가
alter policy jobflow_profiles_select_own
  on public.jobflow_profiles
  to authenticated
  using ((select auth.uid()) = id);

alter policy jobflow_profiles_insert_own
  on public.jobflow_profiles
  to authenticated
  with check ((select auth.uid()) = id);

alter policy jobflow_profiles_update_own
  on public.jobflow_profiles
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

alter policy jobflow_profiles_delete_own
  on public.jobflow_profiles
  to authenticated
  using ((select auth.uid()) = id);

commit;
