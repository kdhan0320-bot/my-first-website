-- Reconstructed baseline migration — 재구성된 기준선 migration.
-- 이 timestamp(20260611000000)는 원래 실행된 시각이 아니라, 기존 migration
-- 20260610015623(guestbook)과 20260704065841(add_is_featured_to_projects)
-- 사이에 놓이도록 재구성한 값이다.
--
-- 이 파일은 원본 SQL을 그대로 복원한 것이 아니라, 현재 운영 catalog와 이후
-- migration의 의존성(20260704065841이 projects에 is_featured 컬럼을 추가하는
-- 사실)을 근거로 재구성한 baseline이다. 원래 SQL 원문과 실제 timestamp는
-- 확인할 수 없다.
--
-- 이 파일은 운영 DB에 다시 실행하기 위한 파일이 아니다. 운영 migration
-- history와의 정합화는 별도 승인 단계에서 다룬다.

begin;

create table public.projects (
  id serial primary key,
  title text not null,
  description text,
  tech_stack text[] default '{}'::text[],
  github_url text,
  detail_url text,
  thumbnail_url text,
  is_published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Public read"
  on public.projects
  for select
  using (true);

commit;
