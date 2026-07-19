-- jobflow_profiles 분리 migration 검증용 조회 문서 (실행용 아님)
-- SELECT / 시스템 카탈로그 조회만 포함합니다. INSERT/UPDATE/DELETE/ALTER/CREATE/DROP 없음.
-- migration 적용 후 Supabase SQL Editor에서 사용자가 직접 실행 여부를 판단하세요.

-- 1. jobflow_profiles 컬럼 확인
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'jobflow_profiles'
order by ordinal_position;

-- 2. jobflow_profiles RLS 활성화 여부
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where relname = 'jobflow_profiles' and relnamespace = 'public'::regnamespace;

-- 3. jobflow_profiles 정책 목록
-- 기대 결과: 4개 정책 모두 roles = {authenticated}, 조건은
--   (select auth.uid()) = id (statement 단위 평가)
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'jobflow_profiles';

-- 3-1. jobflow_profiles 역할별 테이블 권한 확인
-- 기대 결과: anon은 결과 없음 / authenticated는 SELECT·INSERT·UPDATE·DELETE
select
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'jobflow_profiles'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;

-- 4. JobFlow FK 5개가 auth.users(id)를 참조하는지 확인
--    (참고: constraint_column_usage와의 조인은 constraint_schema 기준으로 맞춰야
--     참조 대상이 auth 스키마여도 정상적으로 조회됩니다)
select
  tc.table_schema as referencing_schema,
  tc.table_name as referencing_table,
  kcu.column_name as referencing_column,
  ccu.table_schema as referenced_schema,
  ccu.table_name as referenced_table,
  ccu.column_name as referenced_column,
  tc.constraint_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on tc.constraint_name = ccu.constraint_name
  and tc.constraint_schema = ccu.constraint_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.constraint_name in (
    'applications_user_id_fkey',
    'application_notes_user_id_fkey',
    'interview_notes_user_id_fkey',
    'portfolio_checklists_user_id_fkey',
    'prompt_templates_user_id_fkey'
  );

-- 4-1. jobflow_profiles.id가 auth.users(id)를 참조하는지 확인
select
  tc.table_schema as referencing_schema,
  tc.table_name as referencing_table,
  kcu.column_name as referencing_column,
  ccu.table_schema as referenced_schema,
  ccu.table_name as referenced_table,
  ccu.column_name as referenced_column,
  tc.constraint_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on tc.constraint_name = ccu.constraint_name
  and tc.constraint_schema = ccu.constraint_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.table_name = 'jobflow_profiles';

-- 5. Community FK 4개가 여전히 profiles(id)를 참조하는지 확인 (변경되지 않았어야 함)
select
  tc.table_schema as referencing_schema,
  tc.table_name as referencing_table,
  kcu.column_name as referencing_column,
  ccu.table_schema as referenced_schema,
  ccu.table_name as referenced_table,
  ccu.column_name as referenced_column,
  tc.constraint_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on tc.constraint_name = ccu.constraint_name
  and tc.constraint_schema = ccu.constraint_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.constraint_name in (
    'posts_user_id_fkey',
    'comments_user_id_fkey',
    'post_likes_user_id_fkey',
    'comment_likes_user_id_fkey'
  );

-- 6. JobFlow 관련 테이블 행 수 (개인정보 없이 count만)
select
  (select count(*) from public.applications)          as applications_count,
  (select count(*) from public.application_notes)      as application_notes_count,
  (select count(*) from public.interview_notes)        as interview_notes_count,
  (select count(*) from public.portfolio_checklists)   as portfolio_checklists_count,
  (select count(*) from public.prompt_templates)       as prompt_templates_count;

-- 7. 기존 profiles 행 수 (변경되지 않았어야 함)
select count(*) as profiles_count from public.profiles;

-- 8. jobflow_profiles 행 수 (신규 생성 직후에는 0이어야 함)
select count(*) as jobflow_profiles_count from public.jobflow_profiles;
