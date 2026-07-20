-- Reconstructed baseline migration — 재구성된 기준선 migration.
-- 이 timestamp(20260616000000)는 원래 실행된 시각이 아니라, Community
-- profiles 생성(20260609024027) 이후이고 20260719073527
-- (create_jobflow_profiles)보다 앞에 놓이도록 재구성한 값이다.
--
-- 이 파일은 원본 SQL을 그대로 복원한 것이 아니라, 현재 운영 catalog와
-- 20260719073527이 다루는 외래키 5개(applications_user_id_fkey,
-- application_notes_user_id_fkey, interview_notes_user_id_fkey,
-- portfolio_checklists_user_id_fkey, prompt_templates_user_id_fkey)를
-- public.profiles(id)에서 auth.users(id)로 재연결한다는 사실을 근거로
-- 재구성한 baseline이다. 원래 SQL 원문과 실제 timestamp는 확인할 수 없다.
--
-- application_notes, prompt_templates는 현재 프론트엔드에서 사용하지
-- 않지만, 이후 migration이 이 테이블들의 constraint를 변경하므로 baseline에
-- 포함한다.
--
-- 이 파일은 운영 DB에 다시 실행하기 위한 파일이 아니다. 운영 migration
-- history와의 정합화는 별도 승인 단계에서 다룬다.

begin;

create table public.applications (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  company_name text not null,
  position text,
  location text,
  company_size text,
  job_url text,
  status text default '관심',
  applied_date date,
  deadline date,
  portfolio_submitted boolean default false,
  resume_submitted boolean default false,
  memo text,
  priority text default '보통',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint applications_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade
);

alter table public.applications enable row level security;

create policy applications_self
  on public.applications
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.application_notes (
  id uuid not null default gen_random_uuid() primary key,
  application_id uuid not null,
  user_id uuid not null,
  note_type text default '메모',
  content text,
  created_at timestamptz default now(),
  constraint application_notes_application_id_fkey
    foreign key (application_id)
    references public.applications(id)
    on delete cascade,
  constraint application_notes_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade
);

alter table public.application_notes enable row level security;

create policy notes_self
  on public.application_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.portfolio_checklists (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  title text not null,
  category text default '기타',
  is_done boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint portfolio_checklists_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade
);

alter table public.portfolio_checklists enable row level security;

create policy checklists_self
  on public.portfolio_checklists
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.interview_notes (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  question text not null,
  answer text,
  related_project text,
  importance text default '보통',
  is_reviewed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint interview_notes_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade
);

alter table public.interview_notes enable row level security;

create policy interview_self
  on public.interview_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.prompt_templates (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  prompt_type text,
  target_role text,
  company_name text,
  selected_project text,
  generated_prompt text,
  created_at timestamptz default now(),
  constraint prompt_templates_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade
);

alter table public.prompt_templates enable row level security;

create policy prompts_self
  on public.prompt_templates
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

commit;
