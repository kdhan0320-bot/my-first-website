-- JobFlow 전용 프로필 테이블(jobflow_profiles) 분리
-- 목적: JobFlow가 Community와 공유하던 public.profiles에서 벗어나
--       JobFlow 전용 선택적 설정 정보(email/display_name/target_role)를
--       별도 테이블로 분리한다.
--
-- 범위:
--   - public.jobflow_profiles 신규 생성 (username/phone/expires_at 없음)
--   - jobflow_profiles에 RLS 활성화 + 본인 행 전용 정책 4개 생성
--     (to authenticated, auth.uid() = id)
--   - jobflow_profiles 테이블 권한을 명시적으로 제한
--     (anon revoke, authenticated에게만 CRUD grant — Supabase 프로젝트의
--     default privileges 설정에 의존하지 않음)
--   - JobFlow FK 5개(applications/application_notes/interview_notes/
--     portfolio_checklists/prompt_templates)를 Community profiles에서
--     분리해 auth.users로 직접 재연결
--
-- 설계 근거:
--   - JobFlow CRUD 데이터(applications 등)의 실제 소유자는 인증 사용자
--     (auth.users) 자체이며, jobflow_profiles는 이름·목표 직무 등
--     선택적 설정 정보일 뿐이다.
--   - CRUD FK를 jobflow_profiles(id)에 걸면, 프로필 행을 아직 만들지
--     않은 기존 인증 사용자가 로그인 직후 CRUD insert를 시도할 때
--     FK 위반으로 실패할 수 있다. 이를 피하기 위해 CRUD FK는
--     auth.users(id)를 직접 참조하도록 하고, jobflow_profiles(id)는
--     별도로 auth.users(id)를 참조하는 독립적인 선택적 테이블로 둔다.
--
-- 범위 밖(절대 변경하지 않음):
--   - public.profiles 테이블 자체(컬럼/데이터/정책) 무변경
--   - Community 소유 FK 4개(posts/comments/post_likes/comment_likes) 무변경
--     (계속 public.profiles(id)를 참조)
--   - 기존 profiles 4행 또는 auth.users 사용자 데이터 이관 없음
--     (JobFlow 관련 테이블은 현재 모두 0행이므로 이관 대상 자체가 없음)

begin;

-- 1) jobflow_profiles 테이블 생성 (JobFlow 로그인 사용자의 선택적 설정 정보)
create table public.jobflow_profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,
  email text,
  display_name text,
  target_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) RLS 활성화
alter table public.jobflow_profiles enable row level security;

-- 3) 본인 행 전용 정책, authenticated 역할에만 적용 (공개 전체 조회 정책 없음)
create policy jobflow_profiles_select_own
  on public.jobflow_profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy jobflow_profiles_insert_own
  on public.jobflow_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy jobflow_profiles_update_own
  on public.jobflow_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy jobflow_profiles_delete_own
  on public.jobflow_profiles
  for delete
  to authenticated
  using (auth.uid() = id);

-- 4) PostgREST 접근 권한을 명시적으로 제한
--    (익명 사용자는 테이블 권한 자체가 없고, 인증 사용자만 CRUD 권한을 받음.
--     실제 행 접근은 위 RLS의 auth.uid() = id 정책이 그대로 제한한다.
--     service_role, 기존 Community profiles, 기존 다른 테이블 권한은 변경하지 않음)
revoke all on table public.jobflow_profiles from anon;

grant select, insert, update, delete
  on table public.jobflow_profiles
  to authenticated;

-- 5) JobFlow FK 5개를 Community profiles에서 분리해 auth.users로 직접 재연결
--    (Community 소유 FK 4개는 이 migration에서 다루지 않으며 계속 profiles(id)를 참조)

alter table public.applications
  drop constraint applications_user_id_fkey;
alter table public.applications
  add constraint applications_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

alter table public.application_notes
  drop constraint application_notes_user_id_fkey;
alter table public.application_notes
  add constraint application_notes_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

alter table public.interview_notes
  drop constraint interview_notes_user_id_fkey;
alter table public.interview_notes
  add constraint interview_notes_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

alter table public.portfolio_checklists
  drop constraint portfolio_checklists_user_id_fkey;
alter table public.portfolio_checklists
  add constraint portfolio_checklists_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

alter table public.prompt_templates
  drop constraint prompt_templates_user_id_fkey;
alter table public.prompt_templates
  add constraint prompt_templates_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

commit;
